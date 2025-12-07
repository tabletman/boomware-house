#!/usr/bin/env tsx
/**
 * BoomWare CLI
 * Command-line interface for marketplace automation
 */

import { Command } from 'commander';
import { OptimizedVisionAgent } from '../src/lib/agents/optimized-vision-agent';
import { ImageProcessorAgent } from '../src/lib/agents/image-processor';
import { InventoryManagerAgent } from '../src/lib/agents/inventory-manager';
import { PriceOptimizerAgent, MarketData } from '../src/lib/agents/price-optimizer';
import { ListingExecutorAgent } from '../src/lib/agents/listing-executor';
import { getDatabase } from '../src/lib/db/client';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('boomware')
  .description('BoomWare House v2 - Autonomous Multi-Platform Listing')
  .version('2.0.0');

// Analyze command
program
  .command('analyze <imagePath>')
  .description('Analyze product from image')
  .option('-p, --platforms <platforms>', 'Comma-separated platforms', 'ebay,facebook')
  .action(async (imagePath, options) => {
    console.log('🔍 Analyzing product...\n');

    if (!existsSync(imagePath)) {
      console.error('❌ Image file not found:', imagePath);
      process.exit(1);
    }

    const vision = new OptimizedVisionAgent({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      defaultModel: 'sonnet'
    });

    try {
      const productData = await vision.analyzeProduct(
        [imagePath],
        options.platforms.split(',')
      );

      console.log('✅ Product Analysis:\n');
      console.log(`📦 Product: ${productData.product.brand} ${productData.product.name}`);
      console.log(`🏷️  Category: ${productData.product.category}`);
      console.log(`📊 Condition: ${productData.condition.state}`);
      console.log(`💰 Estimated Value: $${productData.estimatedRetailValue.low}-$${productData.estimatedRetailValue.high}`);
      console.log(`\n🎯 Target Buyer: ${productData.marketPositioning.targetBuyer}`);
      console.log(`\n✨ Unique Selling Points:`);
      productData.marketPositioning.uniqueSellingPoints.forEach(usp => {
        console.log(`   • ${usp}`);
      });
    } catch (error: any) {
      console.error('❌ Analysis failed:', error.message);
      process.exit(1);
    }
  });

// List command
program
  .command('list <imagePath>')
  .description('Analyze and list product on platforms')
  .option('-p, --platforms <platforms>', 'Comma-separated platforms', 'ebay')
  .option('-u, --urgency <urgency>', 'Pricing urgency', 'balanced')
  .option('--mock', 'Use mock mode (no actual listing)', false)
  .option('--enhance', 'Enhance images', true)
  .option('--remove-bg', 'Remove background', false)
  .action(async (imagePath, options) => {
    console.log('🚀 Starting full pipeline...\n');

    if (!existsSync(imagePath)) {
      console.error('❌ Image file not found:', imagePath);
      process.exit(1);
    }

    // Initialize database
    const db = getDatabase();
    await db.connect();
    await db.initialize();

    // Initialize agents
    const vision = new OptimizedVisionAgent({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!
    });

    const imageProcessor = new ImageProcessorAgent({
      removeBgApiKey: process.env.REMOVE_BG_API_KEY
    });

    const inventory = new InventoryManagerAgent(db);
    const priceOptimizer = new PriceOptimizerAgent();
    const listingExecutor = new ListingExecutorAgent({
      mockMode: options.mock,
      ebay: options.mock ? undefined : {
        clientId: process.env.EBAY_CLIENT_ID!,
        clientSecret: process.env.EBAY_CLIENT_SECRET!,
        sandbox: process.env.EBAY_SANDBOX === 'true'
      }
    });

    try {
      // Step 1: Process images
      console.log('🎨 Processing images...');
      const processedImages = await imageProcessor.processGallery([imagePath], {
        enhance: options.enhance ? { sharpen: true, autoLevel: true } : undefined,
        removeBackground: options.removeBg
      });
      console.log(`✅ Processed ${processedImages.length} images\n`);

      // Step 2: Analyze product
      console.log('🧠 Analyzing product...');
      const productData = await vision.analyzeProduct(
        [imagePath],
        options.platforms.split(',')
      );
      console.log(`✅ Identified: ${productData.product.brand} ${productData.product.name}\n`);

      // Step 3: Add to inventory
      console.log('💾 Adding to inventory...');
      const itemId = await inventory.addItem(productData, processedImages);
      console.log(`✅ Item ID: ${itemId}\n`);

      // Step 4: Create pricing strategy
      console.log('💰 Optimizing price...');

      // Mock market data (in production, would fetch real data)
      const marketData: MarketData = {
        avgSoldPrice: (productData.estimatedRetailValue.low + productData.estimatedRetailValue.high) / 2,
        lowestActive: productData.estimatedRetailValue.low * 0.9,
        highestSold: productData.estimatedRetailValue.high,
        avgDaysToSell: 10,
        totalActive: 15,
        recentSales: []
      };

      const pricingStrategy = await priceOptimizer.createStrategy(
        productData,
        marketData,
        {
          urgency: options.urgency as any,
          platform: 'ebay',
          condition: productData.condition.state
        }
      );

      console.log(`✅ List Price: $${pricingStrategy.listPrice}`);
      console.log(`   Min Accept: $${pricingStrategy.minimumAccept}\n`);

      // Step 5: Create platform-specific images
      console.log('📦 Creating platform images...');
      const platformImages = await imageProcessor.processForAllPlatforms(
        processedImages.slice(0, 5)
      );
      console.log(`✅ Platform images ready\n`);

      // Step 6: List on platforms
      console.log('📝 Creating listings...\n');
      const platforms = options.platforms.split(',');

      for (const platform of platforms) {
        const platformImageSet = platformImages.find(p => p.platform === platform);
        const payload = listingExecutor.buildListingPayload(
          productData,
          platformImageSet?.images || processedImages,
          pricingStrategy,
          platform
        );

        const result = await listingExecutor.listOnEbay(payload);

        if (result.success) {
          console.log(`✅ ${platform}: ${result.listingUrl}`);

          // Add to inventory
          await inventory.addListing(
            itemId,
            platform as any,
            pricingStrategy.listPrice,
            result.listingId,
            result.listingUrl
          );
        } else {
          console.log(`❌ ${platform}: ${result.error}`);
        }
      }

      console.log('\n🎉 Listing complete!');

    } catch (error: any) {
      console.error('❌ Pipeline failed:', error.message);
      process.exit(1);
    } finally {
      db.close();
    }
  });

// Batch command
program
  .command('batch <folderPath>')
  .description('Process all images in folder')
  .option('-p, --platforms <platforms>', 'Comma-separated platforms', 'ebay')
  .option('--auto', 'Auto-list without confirmation', false)
  .option('--mock', 'Use mock mode', false)
  .action(async (folderPath, options) => {
    if (!existsSync(folderPath)) {
      console.error('❌ Folder not found:', folderPath);
      process.exit(1);
    }

    const images = readdirSync(folderPath)
      .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      .map(f => join(folderPath, f));

    console.log(`📁 Found ${images.length} images\n`);

    for (const imagePath of images) {
      console.log(`\n➡️  Processing: ${imagePath}\n`);

      // Run list command for each image
      await program.parseAsync([
        'node', 'boomware',
        'list', imagePath,
        '-p', options.platforms,
        options.mock ? '--mock' : '',
        options.auto ? '--auto' : ''
      ].filter(Boolean));
    }

    console.log('\n✅ Batch processing complete!');
  });

// Inventory command
program
  .command('inventory')
  .description('Show inventory status')
  .action(async () => {
    const db = getDatabase();
    await db.connect();
    await db.initialize();

    const inventory = new InventoryManagerAgent(db);

    try {
      const activeListings = await inventory.getActiveListings();
      const unlistedItems = await inventory.getUnlistedItems();

      console.log('📦 Inventory Status\n');
      console.log(`Active Listings: ${activeListings.length}`);
      console.log(`Unlisted Items: ${unlistedItems.length}`);
      console.log('\n📋 Active Listings:\n');

      activeListings.forEach((item, index) => {
        console.log(`${index + 1}. ${item.productData.product.brand} ${item.productData.product.name}`);
        item.listings?.forEach(listing => {
          console.log(`   ${listing.platform}: $${listing.price} (${listing.status})`);
        });
      });

      if (unlistedItems.length > 0) {
        console.log('\n⏳ Unlisted Items:\n');
        unlistedItems.forEach((item, index) => {
          console.log(`${index + 1}. ${item.productData.product.brand} ${item.productData.product.name}`);
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to get inventory:', error.message);
    } finally {
      db.close();
    }
  });

// Sales command
program
  .command('sales')
  .description('Show sales report')
  .option('--last <days>', 'Days to include', '30')
  .action(async (options) => {
    const db = getDatabase();
    await db.connect();
    await db.initialize();

    const inventory = new InventoryManagerAgent(db);

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(options.last));

      const report = await inventory.getSalesReport(startDate, endDate);

      console.log(`💰 Sales Report (Last ${options.last} days)\n`);
      console.log(`Total Revenue: $${report.totalRevenue.toFixed(2)}`);
      console.log(`Total Sales: ${report.totalSales}`);
      console.log(`Average Sale: $${report.avgSalePrice.toFixed(2)}`);

      if (report.platformBreakdown.length > 0) {
        console.log('\n📊 Platform Breakdown:\n');
        report.platformBreakdown.forEach(platform => {
          console.log(`${platform.platform}: ${platform.sales} sales, $${platform.revenue.toFixed(2)} revenue`);
        });
      }

      if (report.topProducts.length > 0) {
        console.log('\n🏆 Top Products:\n');
        report.topProducts.slice(0, 5).forEach((product, index) => {
          console.log(`${index + 1}. ${product.productName}: $${product.soldPrice} (${product.daysToSell} days)`);
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to get sales report:', error.message);
    } finally {
      db.close();
    }
  });

// Parse arguments
program.parse();