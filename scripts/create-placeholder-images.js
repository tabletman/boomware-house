const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const productImageSpecs = [
  { sku: 'bw-uc-0001', name: 'Dell OptiPlex Desktop', color: '#0076CE' },
  { sku: 'bw-uc-0002', name: 'HP Pavilion Laptop', color: '#0096D6' },
  { sku: 'bw-uc-0003', name: 'Apple iMac', color: '#A6A6A6' },
  { sku: 'bw-uc-0004', name: 'Lenovo ThinkPad', color: '#E60028' },
  { sku: 'bw-el-0005', name: 'Samsung Monitor', color: '#1F2D8A' },
  { sku: 'bw-el-0006', name: 'Logitech Mouse', color: '#00C9F7' },
  { sku: 'bw-el-0007', name: 'iPad Air', color: '#007AFF' },
  { sku: 'bw-el-0008', name: 'Sony Headphones', color: '#000000' },
  { sku: 'bw-rf-0009', name: 'Frigidaire Fridge', color: '#FFFFFF' },
  { sku: 'bw-rf-0010', name: 'Danby Refrigerator', color: '#000000' },
  { sku: 'bw-rf-0011', name: 'BLACK+DECKER Fridge', color: '#000000' },
  { sku: 'bw-ap-0012', name: 'Hamilton Beach Microwave', color: '#FFFFFF' },
  { sku: 'bw-ap-0013', name: 'Keurig Coffee Maker', color: '#000000' },
  { sku: 'bw-ap-0014', name: 'Ninja Blender', color: '#FF4500' },
  { sku: 'bw-ap-0015', name: 'Instant Air Fryer', color: '#000000' },
  { sku: 'bw-ap-0016', name: 'Dyson Vacuum', color: '#7B68EE' }
];

async function createPlaceholderImage(spec) {
  const imageDir = path.join(__dirname, '..', 'public', 'images', 'products');
  await fs.ensureDir(imageDir);

  const filename = `${spec.sku}-1.jpg`;
  const filepath = path.join(imageDir, filename);

  // Create SVG text
  const svgText = `
    <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${spec.color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${spec.color};stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#grad)" />
      <rect x="50" y="50" width="700" height="700" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.3" />
      <text x="400" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#ffffff" opacity="0.9">
        BOOM WAREHOUSE
      </text>
      <text x="400" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" opacity="0.8">
        ${spec.name}
      </text>
      <text x="400" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" opacity="0.7">
        SKU: ${spec.sku.toUpperCase()}
      </text>
    </svg>
  `;

  // Convert SVG to JPEG using Sharp
  await sharp(Buffer.from(svgText))
    .jpeg({ quality: 85 })
    .toFile(filepath);

  console.log(`Created placeholder image: ${filename}`);
  return filepath;
}

async function createAllPlaceholderImages() {
  console.log('Creating placeholder product images...');

  for (const spec of productImageSpecs) {
    await createPlaceholderImage(spec);
  }

  console.log(`\nCreated ${productImageSpecs.length} placeholder images`);
  console.log('Images saved to: /public/images/products/');
}

if (require.main === module) {
  createAllPlaceholderImages().catch(console.error);
}

module.exports = { createAllPlaceholderImages };