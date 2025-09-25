const fs = require('fs-extra');
const path = require('path');

// Sample product data based on typical warehouse inventory
const sampleProducts = [
  // Used Computers
  {
    name: "Dell OptiPlex 7060 Desktop Computer",
    description: "Powerful business desktop with Intel Core i5 processor. Perfect for office work, light gaming, and everyday computing. Includes keyboard and mouse. Recently refurbished and tested.",
    category: "Used Computers",
    condition: "Grade A",
    price: 299.99,
    compare_at_price: 399.99,
    brand: "Dell",
    model: "OptiPlex 7060",
    year: 2019,
    quantity: 3,
    specifications: {
      processor: "Intel Core i5-8500",
      ram: "8GB DDR4",
      storage: "256GB SSD",
      graphics: "Intel UHD Graphics",
      ports: "USB 3.0, HDMI, DisplayPort"
    },
    tags: ["desktop", "business", "intel", "refurbished"],
    location: "Warehouse A-1"
  },
  {
    name: "HP Pavilion Gaming Laptop",
    description: "Gaming laptop with dedicated graphics card. Great for gaming, video editing, and demanding applications. Screen in excellent condition, minimal wear on keyboard.",
    category: "Used Computers",
    condition: "Grade B",
    price: 549.99,
    compare_at_price: 699.99,
    brand: "HP",
    model: "Pavilion 15-dk1056wm",
    year: 2020,
    quantity: 2,
    specifications: {
      processor: "Intel Core i5-10300H",
      ram: "8GB DDR4",
      storage: "512GB SSD",
      graphics: "NVIDIA GTX 1650",
      display: "15.6\" Full HD"
    },
    tags: ["laptop", "gaming", "nvidia", "portable"],
    location: "Warehouse A-2"
  },
  {
    name: "Apple iMac 21.5\" All-in-One",
    description: "Sleek all-in-one computer perfect for creative work and everyday use. Beautiful Retina display, wireless keyboard and mouse included. Minor scratches on stand.",
    category: "Used Computers",
    condition: "Grade B",
    price: 649.99,
    compare_at_price: 899.99,
    brand: "Apple",
    model: "iMac 21.5\" 2017",
    year: 2017,
    quantity: 1,
    specifications: {
      processor: "Intel Core i5",
      ram: "8GB",
      storage: "1TB Fusion Drive",
      display: "21.5\" Retina 4K",
      graphics: "Radeon Pro 555"
    },
    tags: ["apple", "all-in-one", "retina", "creative"],
    location: "Warehouse A-3"
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Ultrabook",
    description: "Premium business ultrabook with carbon fiber construction. Ultra-portable and durable. Perfect for business travel and professional use.",
    category: "Used Computers",
    condition: "Grade A",
    price: 699.99,
    compare_at_price: 999.99,
    brand: "Lenovo",
    model: "ThinkPad X1 Carbon Gen 7",
    year: 2019,
    quantity: 2,
    specifications: {
      processor: "Intel Core i7-8565U",
      ram: "16GB LPDDR3",
      storage: "512GB SSD",
      display: "14\" Full HD",
      weight: "2.4 lbs"
    },
    tags: ["ultrabook", "business", "lightweight", "premium"],
    location: "Warehouse A-4"
  },

  // Electronics
  {
    name: "Samsung 32\" Curved Gaming Monitor",
    description: "Immersive curved gaming monitor with fast refresh rate. Perfect for gaming and productivity. Minor scuff on back, screen is flawless.",
    category: "Electronics",
    condition: "Grade B",
    price: 249.99,
    compare_at_price: 349.99,
    brand: "Samsung",
    model: "C32F391",
    year: 2020,
    quantity: 4,
    specifications: {
      size: "32 inches",
      resolution: "1920x1080",
      refresh_rate: "60Hz",
      panel: "VA Curved",
      connections: "HDMI, VGA"
    },
    tags: ["monitor", "curved", "gaming", "display"],
    location: "Warehouse B-1"
  },
  {
    name: "Logitech MX Master 3 Wireless Mouse",
    description: "Premium wireless mouse for productivity and creative work. Ergonomic design with customizable buttons. Like new condition with original packaging.",
    category: "Electronics",
    condition: "Grade A",
    price: 69.99,
    compare_at_price: 99.99,
    brand: "Logitech",
    model: "MX Master 3",
    year: 2021,
    quantity: 6,
    specifications: {
      connectivity: "Wireless, USB-C",
      battery: "70 days",
      buttons: "7 customizable",
      compatibility: "Windows, Mac, Linux"
    },
    tags: ["mouse", "wireless", "productivity", "ergonomic"],
    location: "Warehouse B-2"
  },
  {
    name: "iPad Air 10.9\" WiFi Tablet",
    description: "Versatile tablet perfect for work, entertainment, and creativity. Screen protector applied, minimal signs of use. Includes charging cable.",
    category: "Electronics",
    condition: "Grade B",
    price: 399.99,
    compare_at_price: 549.99,
    brand: "Apple",
    model: "iPad Air 4th Gen",
    year: 2020,
    quantity: 3,
    specifications: {
      display: "10.9\" Liquid Retina",
      storage: "64GB",
      processor: "A14 Bionic",
      connectivity: "WiFi",
      cameras: "12MP rear, 7MP front"
    },
    tags: ["tablet", "apple", "portable", "touchscreen"],
    location: "Warehouse B-3"
  },
  {
    name: "Sony WH-1000XM4 Noise Canceling Headphones",
    description: "Industry-leading noise canceling headphones with premium sound quality. Excellent for travel and work from home. Minor wear on headband padding.",
    category: "Electronics",
    condition: "Grade B",
    price: 199.99,
    compare_at_price: 279.99,
    brand: "Sony",
    model: "WH-1000XM4",
    year: 2021,
    quantity: 5,
    specifications: {
      type: "Over-ear wireless",
      noise_canceling: "Active",
      battery: "30 hours",
      connectivity: "Bluetooth, USB-C, 3.5mm"
    },
    tags: ["headphones", "wireless", "noise-canceling", "premium"],
    location: "Warehouse B-4"
  },

  // Small Refrigerators
  {
    name: "Frigidaire 3.2 Cu Ft Compact Refrigerator",
    description: "Perfect compact refrigerator for dorm rooms, offices, or small apartments. Energy efficient with separate freezer compartment. Excellent working condition.",
    category: "Small Refrigerators",
    condition: "Grade A",
    price: 149.99,
    compare_at_price: 199.99,
    brand: "Frigidaire",
    model: "EFR372",
    year: 2022,
    quantity: 8,
    specifications: {
      capacity: "3.2 cubic feet",
      freezer: "Separate compartment",
      energy_star: "Yes",
      dimensions: "19.1\" W x 17.4\" D x 32.5\" H"
    },
    tags: ["mini-fridge", "compact", "energy-efficient", "dorm"],
    location: "Warehouse C-1"
  },
  {
    name: "Danby 4.4 Cu Ft All Refrigerator",
    description: "All-refrigerator unit with no freezer compartment. Ideal for beverages and fresh food storage. Adjustable shelves and door storage.",
    category: "Small Refrigerators",
    condition: "Grade B",
    price: 179.99,
    compare_at_price: 229.99,
    brand: "Danby",
    model: "DAR044A6DDB",
    year: 2021,
    quantity: 4,
    specifications: {
      capacity: "4.4 cubic feet",
      type: "All refrigerator",
      shelves: "2 adjustable wire",
      dimensions: "20.7\" W x 22.2\" D x 32.2\" H"
    },
    tags: ["refrigerator", "beverage", "no-freezer", "compact"],
    location: "Warehouse C-2"
  },
  {
    name: "BLACK+DECKER Mini Fridge with Freezer",
    description: "Dual-door mini fridge with separate freezer. Perfect for small spaces. Interior light, adjustable temperature control. Minor dents on exterior.",
    category: "Small Refrigerators",
    condition: "Grade C",
    price: 119.99,
    compare_at_price: 159.99,
    brand: "BLACK+DECKER",
    model: "BCRK32B",
    year: 2020,
    quantity: 6,
    specifications: {
      capacity: "3.2 cubic feet",
      freezer: "Separate door",
      features: "Interior light, adjustable thermostat",
      dimensions: "19.7\" W x 20.1\" D x 33.5\" H"
    },
    tags: ["mini-fridge", "dual-door", "freezer", "budget"],
    location: "Warehouse C-3"
  },

  // Appliances
  {
    name: "Hamilton Beach Microwave Oven",
    description: "Countertop microwave with digital controls and multiple preset functions. Perfect for reheating and basic cooking. Interior and exterior in great condition.",
    category: "Appliances",
    condition: "Grade A",
    price: 79.99,
    compare_at_price: 109.99,
    brand: "Hamilton Beach",
    model: "0.9 Cu Ft",
    year: 2022,
    quantity: 10,
    specifications: {
      capacity: "0.9 cubic feet",
      power: "900 watts",
      controls: "Digital with 10 power levels",
      features: "6 preset functions"
    },
    tags: ["microwave", "countertop", "digital", "compact"],
    location: "Warehouse D-1"
  },
  {
    name: "Keurig K-Elite Coffee Maker",
    description: "Premium single-serve coffee maker with multiple cup sizes and strong brew setting. Perfect for office or home use. Some mineral buildup, needs descaling.",
    category: "Appliances",
    condition: "Grade B",
    price: 89.99,
    compare_at_price: 139.99,
    brand: "Keurig",
    model: "K-Elite",
    year: 2021,
    quantity: 7,
    specifications: {
      type: "Single-serve",
      cup_sizes: "4, 6, 8, 10, 12 oz",
      features: "Strong brew, iced coffee setting",
      water_reservoir: "75 oz removable"
    },
    tags: ["coffee-maker", "keurig", "single-serve", "office"],
    location: "Warehouse D-2"
  },
  {
    name: "Ninja Foodi Personal Blender",
    description: "Compact personal blender perfect for smoothies and protein shakes. Comes with travel cups and lids. Powerful motor in excellent working condition.",
    category: "Appliances",
    condition: "Grade A",
    price: 49.99,
    compare_at_price: 69.99,
    brand: "Ninja",
    model: "BL480",
    year: 2022,
    quantity: 12,
    specifications: {
      power: "1000 watts",
      capacity: "18 oz cups",
      includes: "2 Nutri Ninja cups with lids",
      blades: "Pro Extractor blades"
    },
    tags: ["blender", "personal", "smoothie", "portable"],
    location: "Warehouse D-3"
  },
  {
    name: "Instant Vortex Plus Air Fryer",
    description: "Large capacity air fryer with multiple cooking functions. Perfect for healthy cooking and meal prep. Non-stick basket shows some wear but functions perfectly.",
    category: "Appliances",
    condition: "Grade B",
    price: 79.99,
    compare_at_price: 119.99,
    brand: "Instant",
    model: "Vortex Plus 6 Qt",
    year: 2021,
    quantity: 8,
    specifications: {
      capacity: "6 quarts",
      functions: "Air fry, roast, broil, bake, reheat, dehydrate",
      temperature_range: "95-400°F",
      accessories: "Non-stick basket and tray"
    },
    tags: ["air-fryer", "healthy-cooking", "instant", "large-capacity"],
    location: "Warehouse D-4"
  },
  {
    name: "Dyson V8 Cordless Vacuum Cleaner",
    description: "Powerful cordless stick vacuum with multiple attachments. Great for quick cleanups and reaching tight spaces. Battery holds charge well, some wear on attachments.",
    category: "Appliances",
    condition: "Grade B",
    price: 199.99,
    compare_at_price: 279.99,
    brand: "Dyson",
    model: "V8 Animal",
    year: 2020,
    quantity: 4,
    specifications: {
      type: "Cordless stick vacuum",
      battery: "Up to 40 minutes",
      bin_capacity: "0.14 gallons",
      attachments: "Crevice tool, dusting brush, mini motorized tool"
    },
    tags: ["vacuum", "cordless", "dyson", "pet-hair"],
    location: "Warehouse D-5"
  }
];

function generateSKU(product, index) {
  const categoryPrefix = {
    'Used Computers': 'UC',
    'Electronics': 'EL',
    'Small Refrigerators': 'RF',
    'Appliances': 'AP'
  };

  const prefix = categoryPrefix[product.category] || 'GN';
  const number = String(index + 1).padStart(4, '0');
  return `BW-${prefix}-${number}`;
}

function generateSerialNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Process products and add required fields
const processedProducts = sampleProducts.map((product, index) => ({
  ...product,
  id: generateSKU(product, index),
  sku: generateSKU(product, index),
  serial_number: generateSerialNumber(),
  cost: Math.round(product.price * 0.6), // Assume 40% markup
  weight: Math.random() * 20 + 1, // Random weight between 1-21 lbs
  dimensions: {
    length: Math.random() * 20 + 5,
    width: Math.random() * 15 + 5,
    height: Math.random() * 10 + 2
  },
  warranty_months: product.condition === 'Grade A' ? 6 : 3,
  is_featured: Math.random() > 0.8, // 20% chance of being featured
  is_active: true,
  reserved_quantity: 0,
  images: [`/images/products/${generateSKU(product, index).toLowerCase()}-1.jpg`],
  created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString()
}));

async function saveProductData() {
  const dataDir = path.join(__dirname, '..', 'data');
  await fs.ensureDir(dataDir);

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `boom-warehouse-products-${timestamp}.json`;
  const filepath = path.join(dataDir, filename);

  await fs.writeJson(filepath, processedProducts, { spaces: 2 });
  console.log(`Product data saved to: ${filepath}`);
  console.log(`Generated ${processedProducts.length} products:`);

  // Category summary
  const categorySummary = processedProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  console.log('\nCategory Summary:');
  Object.entries(categorySummary).forEach(([category, count]) => {
    console.log(`- ${category}: ${count} products`);
  });

  // Condition summary
  const conditionSummary = processedProducts.reduce((acc, product) => {
    acc[product.condition] = (acc[product.condition] || 0) + 1;
    return acc;
  }, {});

  console.log('\nCondition Summary:');
  Object.entries(conditionSummary).forEach(([condition, count]) => {
    console.log(`- ${condition}: ${count} products`);
  });

  const totalValue = processedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  console.log(`\nTotal Inventory Value: $${totalValue.toFixed(2)}`);

  return filepath;
}

if (require.main === module) {
  saveProductData().catch(console.error);
}

module.exports = { processedProducts, saveProductData };