const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

// Load the product data
const productData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/boom-warehouse-products.json'), 'utf8'));

const downloadImage = async (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        file.close();
        fs.unlinkSync(filename);
        return downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filename);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filename, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });

    // Add timeout
    request.setTimeout(10000, () => {
      request.abort();
      reject(new Error('Request timeout'));
    });
  });
};

const downloadMissingImages = async () => {
  const imagesDir = path.join(__dirname, '../public/images/products');

  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  let totalDownloaded = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  const updatedProducts = [];

  for (let i = 0; i < productData.products.length; i++) {
    const product = productData.products[i];
    const newImages = [];
    let hasChanges = false;

    console.log(`\nProcessing product ${i + 1}/${productData.products.length}: ${product.name.substring(0, 50)}...`);

    for (let j = 0; j < product.images.length; j++) {
      const imageUrl = product.images[j];

      // Check if it's an external URL
      if (imageUrl.startsWith('http')) {
        try {
          // Generate local filename
          const imageHash = crypto.createHash('md5').update(imageUrl).digest('hex').substring(0, 8);
          const filename = `${product.id}_${j + 1}_${imageHash}.jpg`;
          const filepath = path.join(imagesDir, filename);
          const localPath = `/images/products/${filename}`;

          if (fs.existsSync(filepath)) {
            console.log(`  ✓ Image ${j + 1} already exists locally: ${filename}`);
            newImages.push(localPath);
            hasChanges = true;
            totalSkipped++;
          } else {
            console.log(`  Downloading image ${j + 1}...`);
            await downloadImage(imageUrl, filepath);
            console.log(`  ✓ Downloaded: ${filename}`);
            newImages.push(localPath);
            hasChanges = true;
            totalDownloaded++;
          }
        } catch (error) {
          console.log(`  ✗ Failed to download image ${j + 1}: ${error.message}`);
          // Keep the original URL if download fails
          newImages.push(imageUrl);
          totalFailed++;
        }
      } else {
        // Already a local path
        newImages.push(imageUrl);
      }

      // Small delay between downloads
      if (j < product.images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Update product with new image paths
    updatedProducts.push({
      ...product,
      images: newImages
    });

    // Pause every 10 products
    if (i % 10 === 9) {
      console.log(`\nPausing to avoid rate limits...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Save updated product data
  const updatedData = {
    ...productData,
    products: updatedProducts,
    lastImageUpdate: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(__dirname, '../data/boom-warehouse-products.json'),
    JSON.stringify(updatedData, null, 2)
  );

  console.log(`\n✅ Image download complete!`);
  console.log(`📥 Downloaded: ${totalDownloaded} images`);
  console.log(`⏩ Skipped (already local): ${totalSkipped} images`);
  console.log(`❌ Failed: ${totalFailed} images`);
  console.log(`💾 Updated data saved to boom-warehouse-products.json`);
};

// Run the download
downloadMissingImages().catch(console.error);