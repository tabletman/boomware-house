const fs = require('fs');
const path = require('path');

// Load Instagram data
const instagramData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/instagram-inventory.json'), 'utf8'));

// Get list of existing images
const imagesDir = path.join(__dirname, '../public/images/products');
const existingImages = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];

// Create a map of shortCode to existing images
const imageMap = {};
existingImages.forEach(filename => {
  const match = filename.match(/^([A-Za-z0-9_-]+)_\d+_[a-f0-9]+\.jpg$/);
  if (match) {
    const shortCode = match[1];
    if (!imageMap[shortCode]) imageMap[shortCode] = [];
    imageMap[shortCode].push(`/images/products/${filename}`);
  }
});

// Categories mapping
const categorizeProduct = (caption) => {
  const lower = caption.toLowerCase();

  if (lower.includes('refrigerator') || lower.includes('fridge') || lower.includes('freezer') || lower.includes('dishwasher') || lower.includes('washer') || lower.includes('dryer') || lower.includes('microwave') || lower.includes('oven') || lower.includes('stove')) {
    return 'Appliances';
  }
  if (lower.includes('imac') || lower.includes('macbook') || lower.includes('laptop') || lower.includes('desktop') || lower.includes('computer') || lower.includes('pc')) {
    return 'Computers & Electronics';
  }
  if (lower.includes('monitor') || lower.includes('display') || lower.includes('screen') || lower.includes('tv')) {
    return 'Monitors & Displays';
  }
  if (lower.includes('iphone') || lower.includes('phone') || lower.includes('mobile') || lower.includes('tablet') || lower.includes('ipad')) {
    return 'Mobile Devices';
  }
  if (lower.includes('xbox') || lower.includes('playstation') || lower.includes('nintendo') || lower.includes('gaming') || lower.includes('game')) {
    return 'Gaming';
  }
  if (lower.includes('cpu') || lower.includes('gpu') || lower.includes('ram') || lower.includes('motherboard') || lower.includes('hard drive') || lower.includes('ssd')) {
    return 'Computer Parts';
  }

  return 'Electronics';
};

const extractPriceFromCaption = (caption) => {
  const priceMatch = caption.match(/\$(\d+(?:\.\d{2})?)/);
  return priceMatch ? parseFloat(priceMatch[1]) : Math.floor(Math.random() * 500) + 50;
};

const extractCondition = (caption) => {
  const lower = caption.toLowerCase();
  if (lower.includes('new') || lower.includes('unused')) return 'Grade A';
  if (lower.includes('excellent') || lower.includes('like new')) return 'Grade A';
  if (lower.includes('good') || lower.includes('works')) return 'Grade B';
  if (lower.includes('fair') || lower.includes('used')) return 'Grade C';
  return 'Grade B'; // Default
};

const extractDimensions = (caption) => {
  const dimensionMatch = caption.match(/(\d+)"?\s*[xX×]\s*(\d+)"?\s*[xX×]?\s*(\d+)?"/i);
  if (dimensionMatch) {
    return {
      width: parseInt(dimensionMatch[1]) || 12,
      height: parseInt(dimensionMatch[2]) || 12,
      depth: parseInt(dimensionMatch[3]) || 6
    };
  }
  return {
    width: Math.floor(Math.random() * 20) + 8,
    height: Math.floor(Math.random() * 15) + 6,
    depth: Math.floor(Math.random() * 10) + 4
  };
};

const extractName = (caption) => {
  const lines = caption.split('\n').filter(line => line.trim());
  const firstLine = lines[1] || lines[0] || 'Electronics Item';
  return firstLine.replace(/\$\d+\.?\d*/, '').trim() || 'Electronics Item';
};

const processInstagramData = () => {
  console.log(`Processing ${instagramData.length} Instagram posts...`);

  const products = [];
  const categories = new Set();

  instagramData.forEach((post, i) => {
    if (!post.caption || post.caption.trim().length < 10) {
      console.log(`Skipping post ${i + 1}: No caption or caption too short`);
      return;
    }

    console.log(`Processing post ${i + 1}/${instagramData.length}: ${post.shortCode}`);

    const price = extractPriceFromCaption(post.caption);
    const category = categorizeProduct(post.caption);
    const condition = extractCondition(post.caption);
    const name = extractName(post.caption);
    const dimensions = extractDimensions(post.caption);

    categories.add(category);

    // Use existing images if available, otherwise create placeholder
    let productImages = imageMap[post.shortCode] || [];

    // If no downloaded images, use first Instagram image as fallback
    if (productImages.length === 0 && post.displayUrl) {
      productImages = [post.displayUrl];
    }

    if (productImages.length === 0) {
      console.log(`  ⚠ No images available for ${post.shortCode}, skipping product`);
      return;
    }

    const product = {
      id: post.shortCode,
      name: name.length > 100 ? name.substring(0, 100) + '...' : name,
      description: post.caption.split('\n').slice(2, 5).join(' ').replace(/[-]{5,}/, '').trim() || `Quality ${name.toLowerCase()} in ${condition.toLowerCase()} condition.`,
      price: price,
      compareAtPrice: price > 100 ? Math.floor(price * 1.3) : null,
      category: category,
      condition: condition,
      images: productImages.slice(0, 3), // Max 3 images
      inStock: true,
      is_featured: Math.random() > 0.8,
      warranty_months: condition === 'Grade A' ? 6 : condition === 'Grade B' ? 3 : 1,
      location: 'Warrensville Heights, OH',
      weight: Math.floor(Math.random() * 20) + 5,
      dimensions: dimensions,
      specifications: {},
      created_at: post.timestamp || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    products.push(product);
  });

  // Create categories data
  const categoriesData = Array.from(categories).map(cat => ({
    name: cat,
    slug: cat.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, ''),
    description: `Quality used ${cat.toLowerCase()} at unbeatable prices.`
  }));

  // Save products data
  const outputData = {
    products,
    categories: categoriesData,
    total: products.length,
    processed: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(__dirname, '../data/boom-warehouse-products.json'),
    JSON.stringify(outputData, null, 2)
  );

  console.log(`\n✅ Processing complete!`);
  console.log(`📦 Products created: ${products.length}`);
  console.log(`🏷️ Categories: ${categories.size}`);
  console.log(`📸 Images using local hosting: ${Object.keys(imageMap).length}`);
  console.log(`💾 Data saved to: data/boom-warehouse-products.json`);

  return outputData;
};

// Run the processing
const result = processInstagramData();
module.exports = result;