const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

class InstagramScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.scrapedData = [];
    this.imageCounter = 0;
  }

  async init() {
    console.log('Launching browser...');
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for production
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  }

  async scrapeInstagramProfile(username = 'boomwarehouse') {
    console.log(`Scraping Instagram profile: @${username}`);

    try {
      const url = `https://www.instagram.com/${username}/`;
      await this.page.goto(url, { waitUntil: 'networkidle2' });

      // Wait for posts to load
      await this.page.waitForSelector('article', { timeout: 10000 });

      // Scroll to load more posts
      await this.autoScroll();

      // Extract post data
      const posts = await this.page.evaluate(() => {
        const articles = document.querySelectorAll('article a[href*="/p/"]');
        const postUrls = [];

        articles.forEach(article => {
          const href = article.getAttribute('href');
          if (href && href.includes('/p/')) {
            postUrls.push(`https://www.instagram.com${href}`);
          }
        });

        return [...new Set(postUrls)]; // Remove duplicates
      });

      console.log(`Found ${posts.length} posts`);

      // Scrape each post individually
      for (let i = 0; i < Math.min(posts.length, 50); i++) { // Limit to 50 posts
        console.log(`Scraping post ${i + 1}/${Math.min(posts.length, 50)}`);
        await this.scrapePost(posts[i]);
        await this.delay(2000); // Delay between requests
      }

      return this.scrapedData;
    } catch (error) {
      console.error('Error scraping Instagram profile:', error);
      throw error;
    }
  }

  async scrapePost(postUrl) {
    try {
      await this.page.goto(postUrl, { waitUntil: 'networkidle2' });

      // Wait for post content to load
      await this.page.waitForSelector('article', { timeout: 5000 });

      const postData = await this.page.evaluate(() => {
        const article = document.querySelector('article');
        if (!article) return null;

        // Extract images
        const images = [];
        const imgElements = article.querySelectorAll('img');
        imgElements.forEach(img => {
          if (img.src && img.src.includes('scontent') && !img.src.includes('profile')) {
            images.push(img.src);
          }
        });

        // Extract caption/description
        let caption = '';
        const captionElements = article.querySelectorAll('span[dir="auto"]');
        captionElements.forEach(element => {
          if (element.innerText && element.innerText.length > caption.length) {
            caption = element.innerText;
          }
        });

        // Extract timestamp
        const timeElement = article.querySelector('time');
        const timestamp = timeElement ? timeElement.getAttribute('datetime') : null;

        return {
          url: window.location.href,
          images,
          caption,
          timestamp,
          likes: 0, // Instagram doesn't always show like counts publicly
          comments: 0
        };
      });

      if (postData && postData.images.length > 0) {
        this.scrapedData.push(postData);
      }
    } catch (error) {
      console.error(`Error scraping post ${postUrl}:`, error.message);
    }
  }

  async autoScroll() {
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if(totalHeight >= scrollHeight || totalHeight > 5000) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  async downloadImages() {
    console.log('Downloading images...');
    const imageDir = path.join(__dirname, '..', 'public', 'images', 'products');
    await fs.ensureDir(imageDir);

    for (const post of this.scrapedData) {
      for (let i = 0; i < post.images.length; i++) {
        try {
          const imageUrl = post.images[i];
          const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

          this.imageCounter++;
          const filename = `product-${this.imageCounter}.jpg`;
          const filepath = path.join(imageDir, filename);

          // Process image with Sharp (resize, optimize)
          await sharp(Buffer.from(response.data))
            .jpeg({ quality: 90 })
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .toFile(filepath);

          // Update post data with local image path
          post.images[i] = `/images/products/${filename}`;

          console.log(`Downloaded image: ${filename}`);
        } catch (error) {
          console.error('Error downloading image:', error.message);
        }
      }
    }
  }

  processProductData() {
    console.log('Processing product data...');
    const processedProducts = [];

    this.scrapedData.forEach((post, index) => {
      const caption = post.caption.toLowerCase();

      // Extract product info from caption
      const product = {
        id: `ig-${index + 1}`,
        name: this.extractProductName(post.caption),
        description: post.caption,
        category: this.categorizeProduct(caption),
        condition: this.extractCondition(caption),
        price: this.extractPrice(post.caption),
        images: post.images,
        instagram_url: post.url,
        timestamp: post.timestamp,
        brand: this.extractBrand(caption),
        model: this.extractModel(post.caption),
        specifications: this.extractSpecs(post.caption),
        tags: this.extractTags(caption)
      };

      processedProducts.push(product);
    });

    return processedProducts;
  }

  extractProductName(caption) {
    // Try to extract product name from first line or first few words
    const lines = caption.split('\n');
    let firstLine = lines[0].trim();

    // Remove price patterns
    firstLine = firstLine.replace(/\$[\d,]+/g, '').trim();

    // Remove hashtags
    firstLine = firstLine.replace(/#\w+/g, '').trim();

    // Take first 50 characters if too long
    if (firstLine.length > 50) {
      firstLine = firstLine.substring(0, 50) + '...';
    }

    return firstLine || 'Product from Instagram';
  }

  categorizeProduct(caption) {
    const categories = {
      'Used Computers': ['computer', 'pc', 'desktop', 'laptop', 'cpu', 'processor', 'gaming rig', 'workstation'],
      'Electronics': ['electronics', 'device', 'gadget', 'tech', 'digital', 'electronic'],
      'Small Refrigerators': ['refrigerator', 'fridge', 'mini fridge', 'cooler', 'mini-fridge'],
      'Appliances': ['appliance', 'microwave', 'oven', 'dishwasher', 'washer', 'dryer', 'air conditioner']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => caption.includes(keyword))) {
        return category;
      }
    }

    return 'Electronics'; // Default category
  }

  extractCondition(caption) {
    const conditions = {
      'Grade A': ['excellent', 'like new', 'perfect', 'grade a', 'mint'],
      'Grade B': ['good', 'very good', 'grade b', 'minor wear'],
      'Grade C': ['fair', 'grade c', 'some wear', 'used'],
      'Grade D': ['poor', 'grade d', 'heavy wear', 'for parts']
    };

    for (const [condition, keywords] of Object.entries(conditions)) {
      if (keywords.some(keyword => caption.includes(keyword))) {
        return condition;
      }
    }

    return 'Grade B'; // Default condition
  }

  extractPrice(caption) {
    const priceMatch = caption.match(/\$[\d,]+/);
    if (priceMatch) {
      return parseFloat(priceMatch[0].replace('$', '').replace(',', ''));
    }

    // Default pricing based on category
    const categoryPrices = {
      'Used Computers': 299,
      'Electronics': 149,
      'Small Refrigerators': 199,
      'Appliances': 249
    };

    return 199; // Default price
  }

  extractBrand(caption) {
    const commonBrands = ['dell', 'hp', 'lenovo', 'apple', 'samsung', 'lg', 'whirlpool', 'frigidaire', 'ge'];
    const found = commonBrands.find(brand => caption.includes(brand));
    return found ? found.charAt(0).toUpperCase() + found.slice(1) : 'Unknown';
  }

  extractModel(caption) {
    // Try to extract model numbers or names
    const modelMatch = caption.match(/[A-Z0-9]{3,10}/i);
    return modelMatch ? modelMatch[0] : '';
  }

  extractSpecs(caption) {
    const specs = {};

    // Extract common specifications
    const ramMatch = caption.match(/(\d+)\s*(gb|GB)\s*(ram|RAM)/i);
    if (ramMatch) specs.ram = ramMatch[1] + 'GB';

    const storageMatch = caption.match(/(\d+)\s*(gb|GB|tb|TB)\s*(ssd|hdd|storage)/i);
    if (storageMatch) specs.storage = ramMatch[1] + ramMatch[2].toUpperCase();

    return specs;
  }

  extractTags(caption) {
    const tags = [];
    const hashtagMatches = caption.match(/#\w+/g);

    if (hashtagMatches) {
      hashtagMatches.forEach(tag => {
        tags.push(tag.replace('#', ''));
      });
    }

    return tags;
  }

  async saveData(products) {
    const dataDir = path.join(__dirname, '..', 'data');
    await fs.ensureDir(dataDir);

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `instagram-products-${timestamp}.json`;
    const filepath = path.join(dataDir, filename);

    await fs.writeJson(filepath, products, { spaces: 2 });
    console.log(`Product data saved to: ${filepath}`);

    return filepath;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const scraper = new InstagramScraper();

  try {
    await scraper.init();
    console.log('Starting Instagram scraping for @boomwarehouse...');

    const posts = await scraper.scrapeInstagramProfile('boomwarehouse');
    console.log(`Scraped ${posts.length} posts`);

    await scraper.downloadImages();
    console.log('Images downloaded');

    const products = scraper.processProductData();
    console.log(`Processed ${products.length} products`);

    const filepath = await scraper.saveData(products);
    console.log(`Data saved to ${filepath}`);

    console.log('\nScraping Summary:');
    console.log(`- Posts scraped: ${posts.length}`);
    console.log(`- Products processed: ${products.length}`);
    console.log(`- Images downloaded: ${scraper.imageCounter}`);

  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await scraper.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = InstagramScraper;