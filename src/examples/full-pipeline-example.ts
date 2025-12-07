/**
 * Full Pipeline Example
 * Demonstrates complete workflow: Image → Analysis → Processing → Inventory → Listing
 */

import { OptimizedVisionAgent } from '../lib/agents/optimized-vision-agent';
import { ImageProcessorAgent } from '../lib/agents/image-processor';
import { InventoryManagerAgent } from '../lib/agents/inventory-manager';
import { getDatabase } from '../lib/db/client';

async function fullPipelineExample() {
  console.log('🚀 BoomWare House v2 - Full Pipeline Demo\n');

  // Initialize agents
  const db = getDatabase();
  await db.connect();
  await db.initialize();

  const vision = new OptimizedVisionAgent({
    anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
    defaultModel: 'sonnet',
    enablePromptCaching: true
  });

  const imageProcessor = new ImageProcessorAgent({
    removeBgApiKey: process.env.REMOVE_BG_API_KEY,
    cacheDir: './data/processed-images'
  });

  const inventory = new InventoryManagerAgent(db);

  // ========================
  // STEP 1: CAPTURE PHOTOS
  // ========================
  const rawImagePaths = [
    './photos/product-front.jpg',
    './photos/product-back.jpg',
    './photos/product-detail.jpg'
  ];

  console.log('📸 Step 1: Raw photos captured');
  console.log(`   Images: ${rawImagePaths.length}\n`);

  // ========================
  // STEP 2: PROCESS IMAGES
  // ========================
  console.log('🎨 Step 2: Processing images...');

  const processedImages = await imageProcessor.processGallery(rawImagePaths, {
    enhance: {
      sharpen: true,
      autoLevel: true,
      quality: 90
    },
    removeBackground: false, // Set true for apparel/accessories
    watermark: 'BoomWare House'
  });

  console.log(`✅ Processed ${processedImages.length} images\n`);

  // ========================
  // STEP 3: AI ANALYSIS
  // ========================
  console.log('🧠 Step 3: AI product analysis...');

  const productData = await vision.analyzeProduct(
    rawImagePaths,
    ['ebay', 'facebook', 'mercari']
  );

  console.log('✅ Product identified:');
  console.log(`   Name: ${productData.product.brand} ${productData.product.name}`);
  console.log(`   Condition: ${productData.condition.state}`);
  console.log(`   Estimated Value: $${productData.estimatedRetailValue.low}-$${productData.estimatedRetailValue.high}\n`);

  // ========================
  // STEP 4: ADD TO INVENTORY
  // ========================
  console.log('💾 Step 4: Adding to inventory...');

  const itemId = await inventory.addItem(productData, processedImages);

  console.log(`✅ Item added to inventory: ${itemId}\n`);

  // ========================
  // STEP 5: PREPARE PLATFORM-SPECIFIC IMAGES
  // ========================
  console.log('📦 Step 5: Creating platform-specific images...');

  const platformImages = await imageProcessor.processForAllPlatforms(
    processedImages.slice(0, 5), // Max 5 images per listing
    {
      enhance: {
        sharpen: true,
        quality: 92
      }
    }
  );

  console.log(`✅ Platform images prepared:`);
  platformImages.forEach((p) => {
    console.log(`   ${p.platform}: ${p.images.length} images`);
  });
  console.log();

  // ========================
  // STEP 6: SUGGESTED PRICING
  // ========================
  console.log('💰 Step 6: Pricing strategy...');

  const suggestedPrices = {
    ebay: {
      listPrice: Math.round(productData.estimatedRetailValue.high * 0.85),
      minimumAccept: Math.round(productData.estimatedRetailValue.low * 0.90)
    },
    facebook: {
      listPrice: Math.round(productData.estimatedRetailValue.high * 0.80), // Lower for local pickup
      minimumAccept: Math.round(productData.estimatedRetailValue.low * 0.85)
    },
    mercari: {
      listPrice: Math.round(productData.estimatedRetailValue.high * 0.82),
      minimumAccept: Math.round(productData.estimatedRetailValue.low * 0.87)
    }
  };

  console.log('✅ Platform pricing:');
  Object.entries(suggestedPrices).forEach(([platform, pricing]) => {
    console.log(`   ${platform}: $${pricing.listPrice} (min accept: $${pricing.minimumAccept})`);
  });
  console.log();

  // ========================
  // STEP 7: CREATE LISTINGS (Simulated)
  // ========================
  console.log('📝 Step 7: Creating listings (simulated)...\n');

  // eBay listing
  const ebayListingId = await inventory.addListing(
    itemId,
    'ebay',
    suggestedPrices.ebay.listPrice,
    'ebay_sim_12345',
    'https://ebay.com/itm/12345'
  );
  console.log(`✅ eBay listing created: ${ebayListingId}`);

  // Facebook listing
  const fbListingId = await inventory.addListing(
    itemId,
    'facebook',
    suggestedPrices.facebook.listPrice,
    'fb_marketplace_67890',
    'https://facebook.com/marketplace/item/67890'
  );
  console.log(`✅ Facebook listing created: ${fbListingId}`);

  // Mercari listing
  const mercariListingId = await inventory.addListing(
    itemId,
    'mercari',
    suggestedPrices.mercari.listPrice,
    'mercari_abc123',
    'https://mercari.com/us/item/abc123'
  );
  console.log(`✅ Mercari listing created: ${mercariListingId}\n`);

  // ========================
  // STEP 8: ANALYTICS
  // ========================
  console.log('📊 Step 8: Inventory summary...');

  const item = await inventory.getItem(itemId);

  console.log(`\n📦 Item: ${item?.productData.product.brand} ${item?.productData.product.name}`);
  console.log(`   Status: ${item?.listings?.length} active listings`);
  console.log(`   Platforms:`);
  item?.listings?.forEach((listing) => {
    console.log(`     - ${listing.platform}: $${listing.price} (${listing.status})`);
  });

  const stats = imageProcessor.getCacheStats();
  console.log(`\n💾 Image Cache:`);
  console.log(`   Total processed: ${stats.totalImages}`);
  console.log(`   Cache size: ${(stats.totalSizeBytes / 1024 / 1024).toFixed(2)} MB`);

  console.log('\n🎉 Full pipeline complete!\n');

  // ========================
  // SIMULATION: SALE EVENT
  // ========================
  console.log('💸 Simulating sale on eBay...');

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await inventory.markSold(
    itemId,
    'ebay',
    suggestedPrices.ebay.minimumAccept + 10 // Sold for slightly above minimum
  );

  console.log(`✅ Item sold on eBay for $${suggestedPrices.ebay.minimumAccept + 10}\n`);

  // ========================
  // FINAL ANALYTICS
  // ========================
  const platformMetrics = await inventory.getPlatformPerformance();
  const ebayMetrics = platformMetrics.find((m) => m.platform === 'ebay');

  console.log('📈 eBay Performance:');
  console.log(`   Active listings: ${ebayMetrics?.activeListings}`);
  console.log(`   Sold items: ${ebayMetrics?.soldListings}`);
  console.log(`   Total revenue: $${ebayMetrics?.totalRevenue.toFixed(2)}`);

  console.log('\n✨ Demo complete! Ready for production automation.\n');

  db.close();
}

// Run if executed directly
if (require.main === module) {
  fullPipelineExample().catch((error) => {
    console.error('❌ Pipeline error:', error);
    process.exit(1);
  });
}

export { fullPipelineExample };
