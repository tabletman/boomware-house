const { createClient } = require('@supabase/supabase-js');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// Check if Supabase is properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment check:');
console.log('Supabase URL:', supabaseUrl || 'Not configured');
console.log('Service Key configured:', !!supabaseServiceKey && supabaseServiceKey !== 'your-service-key');

let supabase = null;

// Only create client if properly configured
if (supabaseUrl && supabaseUrl !== 'your_supabase_url_here' &&
    supabaseServiceKey && supabaseServiceKey !== 'your_supabase_service_role_key_here') {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

class DatabasePopulator {
  constructor() {
    this.categories = [
      {
        name: 'Used Computers',
        slug: 'used-computers',
        description: 'Refurbished desktop computers, laptops, and workstations',
        sort_order: 1
      },
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Consumer electronics, tablets, monitors, and accessories',
        sort_order: 2
      },
      {
        name: 'Small Refrigerators',
        slug: 'small-refrigerators',
        description: 'Compact and mini refrigerators for dorms and offices',
        sort_order: 3
      },
      {
        name: 'Appliances',
        slug: 'appliances',
        description: 'Kitchen appliances, vacuum cleaners, and household items',
        sort_order: 4
      }
    ];

    this.categoryIds = {};
    this.insertedProducts = [];
  }

  async loadProductData() {
    const dataDir = path.join(__dirname, '..', 'data');
    const files = await fs.readdir(dataDir);
    const productFile = files.find(file => file.includes('boom-warehouse-products') && file.endsWith('.json'));

    if (!productFile) {
      throw new Error('Product data file not found. Please run create-sample-products.js first.');
    }

    const filepath = path.join(dataDir, productFile);
    const products = await fs.readJson(filepath);
    console.log(`Loaded ${products.length} products from ${productFile}`);
    return products;
  }

  async checkSupabaseConnection() {
    if (!supabase) {
      console.log('\n🔧 Configuration needed:');
      console.log('Please update your .env.local file with your actual Supabase credentials:');
      console.log('NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url');
      console.log('SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key');
      console.log('\nFor this demo, I\'ll create SQL scripts instead.');
      return false;
    }

    try {
      const { data, error } = await supabase.from('categories').select('count').limit(1);
      if (error) throw error;
      console.log('✓ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('✗ Supabase connection failed:', error.message);
      console.log('\nFalling back to SQL script generation...');
      return false;
    }
  }

  async createCategories() {
    console.log('Creating categories...');

    for (const category of this.categories) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .upsert(category, { onConflict: 'slug' })
          .select()
          .single();

        if (error) throw error;

        this.categoryIds[category.name] = data.id;
        console.log(`✓ Category created: ${category.name}`);
      } catch (error) {
        console.error(`✗ Error creating category ${category.name}:`, error.message);
        throw error;
      }
    }
  }

  async createProducts(products) {
    console.log(`\nInserting ${products.length} products...`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      try {
        // Prepare product data for Supabase
        const productData = {
          name: product.name,
          description: product.description,
          category: product.category,
          condition: product.condition,
          serial_number: product.serial_number,
          sku: product.sku,
          price: product.price,
          compare_at_price: product.compare_at_price,
          cost: product.cost,
          quantity: product.quantity,
          reserved_quantity: product.reserved_quantity,
          location: product.location,
          images: product.images,
          specifications: product.specifications,
          weight: product.weight,
          dimensions: product.dimensions,
          brand: product.brand,
          model: product.model,
          year: product.year,
          warranty_months: product.warranty_months,
          is_featured: product.is_featured,
          is_active: product.is_active,
          tags: product.tags
        };

        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();

        if (error) throw error;

        this.insertedProducts.push(data);
        console.log(`✓ Product ${i + 1}/${products.length}: ${product.name} (${product.sku})`);

        // Create initial inventory transaction
        await supabase
          .from('inventory_transactions')
          .insert({
            product_id: data.id,
            type: 'incoming',
            quantity: product.quantity,
            reason: 'Initial stock',
            notes: 'Imported from inventory migration'
          });

      } catch (error) {
        console.error(`✗ Error inserting product ${product.name}:`, error.message);
        // Continue with other products instead of stopping
      }
    }
  }

  async generateSQLScript(products) {
    console.log('Generating SQL scripts for manual database population...');

    const scriptsDir = path.join(__dirname, '..', 'data');
    await fs.ensureDir(scriptsDir);

    const timestamp = new Date().toISOString().split('T')[0];

    // Generate categories SQL
    const categoriesSQL = `-- Categories SQL Script
-- Generated on ${new Date().toISOString()}

${this.categories.map(category => `
INSERT INTO categories (name, slug, description, sort_order, is_active)
VALUES (
  '${category.name}',
  '${category.slug}',
  '${category.description}',
  ${category.sort_order},
  TRUE
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();`).join('')}
`;

    // Generate products SQL
    const productsSQL = `-- Products SQL Script
-- Generated on ${new Date().toISOString()}

${products.map(product => `
INSERT INTO products (
  name, description, category, condition, serial_number, sku,
  price, compare_at_price, cost, quantity, reserved_quantity, location,
  images, specifications, weight, dimensions, brand, model, year,
  warranty_months, is_featured, is_active, tags
) VALUES (
  '${product.name.replace(/'/g, "''")}',
  '${product.description.replace(/'/g, "''")}',
  '${product.category}',
  '${product.condition}',
  '${product.serial_number}',
  '${product.sku}',
  ${product.price},
  ${product.compare_at_price || 'NULL'},
  ${product.cost},
  ${product.quantity},
  ${product.reserved_quantity},
  '${product.location}',
  ARRAY['${product.images.join("', '")}'],
  '${JSON.stringify(product.specifications).replace(/'/g, "''")}',
  ${product.weight},
  '${JSON.stringify(product.dimensions).replace(/'/g, "''")}',
  '${product.brand}',
  '${product.model || ''}',
  ${product.year || 'NULL'},
  ${product.warranty_months},
  ${product.is_featured},
  ${product.is_active},
  ARRAY['${product.tags.join("', '")}']
);`).join('')}
`;

    // Save SQL files
    const categoriesPath = path.join(scriptsDir, `categories-${timestamp}.sql`);
    const productsPath = path.join(scriptsDir, `products-${timestamp}.sql`);

    await fs.writeFile(categoriesPath, categoriesSQL);
    await fs.writeFile(productsPath, productsSQL);

    console.log(`\n📄 SQL Scripts generated:`);
    console.log(`- Categories: ${categoriesPath}`);
    console.log(`- Products: ${productsPath}`);
    console.log('\n💡 To populate your database manually:');
    console.log('1. Connect to your Supabase SQL Editor');
    console.log('2. Run the categories script first');
    console.log('3. Then run the products script');

    return { categoriesPath, productsPath };
  }

  async generateReport() {
    const products = await this.loadProductData();

    const report = {
      summary: {
        totalProducts: products.length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        avgPrice: products.reduce((sum, p) => sum + p.price, 0) / products.length
      },
      categories: {},
      conditions: {},
      brands: {},
      locations: {}
    };

    products.forEach(product => {
      // Category stats
      if (!report.categories[product.category]) {
        report.categories[product.category] = { count: 0, value: 0 };
      }
      report.categories[product.category].count++;
      report.categories[product.category].value += product.price * product.quantity;

      // Condition stats
      if (!report.conditions[product.condition]) {
        report.conditions[product.condition] = { count: 0, value: 0 };
      }
      report.conditions[product.condition].count++;
      report.conditions[product.condition].value += product.price * product.quantity;

      // Brand stats
      if (!report.brands[product.brand]) {
        report.brands[product.brand] = { count: 0, value: 0 };
      }
      report.brands[product.brand].count++;
      report.brands[product.brand].value += product.price * product.quantity;

      // Location stats
      if (!report.locations[product.location]) {
        report.locations[product.location] = { count: 0, value: 0 };
      }
      report.locations[product.location].count++;
      report.locations[product.location].value += product.price * product.quantity;
    });

    return report;
  }

  async printReport() {
    const report = await this.generateReport();

    console.log('\n' + '='.repeat(60));
    console.log('          BOOM WAREHOUSE INVENTORY REPORT');
    console.log('='.repeat(60));

    console.log('\n📊 SUMMARY');
    console.log(`Total Products: ${report.summary.totalProducts}`);
    console.log(`Total Inventory Value: $${report.summary.totalValue.toFixed(2)}`);
    console.log(`Average Price: $${report.summary.avgPrice.toFixed(2)}`);

    console.log('\n📂 BY CATEGORY');
    Object.entries(report.categories).forEach(([category, stats]) => {
      console.log(`${category}: ${stats.count} items ($${stats.value.toFixed(2)})`);
    });

    console.log('\n🏷️  BY CONDITION');
    Object.entries(report.conditions).forEach(([condition, stats]) => {
      console.log(`${condition}: ${stats.count} items ($${stats.value.toFixed(2)})`);
    });

    console.log('\n🏢 BY BRAND');
    Object.entries(report.brands).forEach(([brand, stats]) => {
      console.log(`${brand}: ${stats.count} items ($${stats.value.toFixed(2)})`);
    });

    console.log('\n📍 BY LOCATION');
    Object.entries(report.locations).forEach(([location, stats]) => {
      console.log(`${location}: ${stats.count} items ($${stats.value.toFixed(2)})`);
    });

    console.log('\n' + '='.repeat(60));
  }
}

async function main() {
  const populator = new DatabasePopulator();

  try {
    // Load product data
    const products = await populator.loadProductData();

    // Check Supabase connection
    const connected = await populator.checkSupabaseConnection();

    if (connected) {
      // Direct database population
      console.log('\n🚀 Starting database population...');
      await populator.createCategories();
      await populator.createProducts(products);

      console.log(`\n✅ Successfully populated database with ${populator.insertedProducts.length} products!`);
    } else {
      // Generate SQL scripts for manual execution
      await populator.generateSQLScript(products);
    }

    // Generate and print report
    await populator.printReport();

  } catch (error) {
    console.error('\n❌ Database population failed:', error);

    // Fallback: Generate SQL scripts
    console.log('\n📝 Generating SQL scripts as fallback...');
    const products = await populator.loadProductData();
    await populator.generateSQLScript(products);
  }
}

if (require.main === module) {
  main();
}

module.exports = DatabasePopulator;