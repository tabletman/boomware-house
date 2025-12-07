/**
 * Inventory Manager Agent Tests
 * Unit tests for inventory tracking and listing management
 */

import { InventoryManagerAgent } from '../../src/lib/agents/inventory-manager';
import { DatabaseClient } from '../../src/lib/db/client';
import { ProductAnalysis } from '../../src/lib/db/types';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';

const TEST_DB_PATH = join(__dirname, 'test-inventory.db');

describe('InventoryManagerAgent', () => {
  let agent: InventoryManagerAgent;
  let db: DatabaseClient;

  beforeEach(async () => {
    // Clean up test database if exists
    if (existsSync(TEST_DB_PATH)) {
      unlinkSync(TEST_DB_PATH);
    }

    // Create new test database
    db = new DatabaseClient({ path: TEST_DB_PATH });
    await db.initialize();
    agent = new InventoryManagerAgent(db);
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) {
      unlinkSync(TEST_DB_PATH);
    }
  });

  describe('addItem', () => {
    it('should add new item to inventory', async () => {
      const productData: ProductAnalysis = createMockProductData();
      const images = ['/path/to/image1.jpg', '/path/to/image2.jpg'];

      const itemId = await agent.addItem(productData, images);

      expect(itemId).toMatch(/^item_\d+_/);

      const item = await agent.getItem(itemId);
      expect(item).toBeDefined();
      expect(item?.productData.product.brand).toBe('Apple');
      expect(item?.images).toEqual(images);
    });

    it('should detect duplicates', async () => {
      const productData: ProductAnalysis = createMockProductData();
      const images = ['/path/to/image.jpg'];

      await agent.addItem(productData, images);

      await expect(
        agent.addItem(productData, images)
      ).rejects.toThrow('Duplicate item found');
    });

    it('should skip duplicate check when requested', async () => {
      const productData: ProductAnalysis = createMockProductData();
      const images = ['/path/to/image.jpg'];

      const itemId1 = await agent.addItem(productData, images);
      const itemId2 = await agent.addItem(productData, images, { skipDuplicateCheck: true });

      expect(itemId1).not.toBe(itemId2);
    });
  });

  describe('addListing', () => {
    it('should add listing to inventory item', async () => {
      const productData: ProductAnalysis = createMockProductData();
      const itemId = await agent.addItem(productData, ['/path/to/image.jpg']);

      const listingId = await agent.addListing(
        itemId,
        'ebay',
        99.99,
        'ebay_123456',
        'https://ebay.com/itm/123456'
      );

      expect(listingId).toMatch(/^ebay_\d+_/);

      const item = await agent.getItem(itemId);
      expect(item?.listings).toHaveLength(1);
      expect(item?.listings?.[0].platform).toBe('ebay');
      expect(item?.listings?.[0].price).toBe(99.99);
      expect(item?.listings?.[0].status).toBe('active');
    });

    it('should prevent duplicate listings on same platform', async () => {
      const productData: ProductAnalysis = createMockProductData();
      const itemId = await agent.addItem(productData, ['/path/to/image.jpg']);

      await agent.addListing(itemId, 'ebay', 99.99);

      await expect(
        agent.addListing(itemId, 'ebay', 79.99)
      ).rejects.toThrow('Listing already exists');
    });
  });

  describe('markSold', () => {
    it('should mark listing as sold', async () => {
      const productData: ProductAnalysis = createMockProductData();
      const itemId = await agent.addItem(productData, ['/path/to/image.jpg']);
      await agent.addListing(itemId, 'ebay', 99.99);

      await agent.markSold(itemId, 'ebay', 89.99);

      const item = await agent.getItem(itemId);
      expect(item?.listings?.[0].status).toBe('sold');
      expect(item?.listings?.[0].soldPrice).toBe(89.99);
      expect(item?.listings?.[0].soldAt).toBeDefined();
    });
  });

  describe('getActiveListings', () => {
    it('should return only active listings', async () => {
      const productData1: ProductAnalysis = createMockProductData('iPhone 13');
      const productData2: ProductAnalysis = createMockProductData('MacBook Pro');

      const itemId1 = await agent.addItem(productData1, ['/path/1.jpg']);
      const itemId2 = await agent.addItem(productData2, ['/path/2.jpg']);

      await agent.addListing(itemId1, 'ebay', 799.99);
      await agent.addListing(itemId2, 'facebook', 1999.99);
      await agent.markSold(itemId1, 'ebay', 750.00);

      const activeListings = await agent.getActiveListings();

      expect(activeListings).toHaveLength(1);
      expect(activeListings[0].productData.product.name).toBe('MacBook Pro');
    });
  });

  describe('getUnlistedItems', () => {
    it('should return items with no listings', async () => {
      const productData1: ProductAnalysis = createMockProductData('iPhone 13');
      const productData2: ProductAnalysis = createMockProductData('MacBook Pro');

      const itemId1 = await agent.addItem(productData1, ['/path/1.jpg']);
      await agent.addItem(productData2, ['/path/2.jpg']);

      await agent.addListing(itemId1, 'ebay', 799.99);

      const unlisted = await agent.getUnlistedItems();

      expect(unlisted).toHaveLength(1);
      expect(unlisted[0].productData.product.name).toBe('MacBook Pro');
    });
  });

  describe('getSalesReport', () => {
    it('should generate accurate sales report', async () => {
      const productData: ProductAnalysis = createMockProductData();
      const itemId = await agent.addItem(productData, ['/path/1.jpg']);

      await agent.addListing(itemId, 'ebay', 99.99);
      await agent.markSold(itemId, 'ebay', 89.99);

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      const endDate = new Date();

      const report = await agent.getSalesReport(startDate, endDate);

      expect(report.totalSales).toBe(1);
      expect(report.totalRevenue).toBe(89.99);
      expect(report.avgSalePrice).toBe(89.99);
      expect(report.platformBreakdown).toHaveLength(1);
      expect(report.platformBreakdown[0].platform).toBe('ebay');
    });
  });

  describe('getPlatformPerformance', () => {
    it('should calculate platform metrics', async () => {
      const productData: ProductAnalysis = createMockProductData();
      const itemId = await agent.addItem(productData, ['/path/1.jpg']);

      await agent.addListing(itemId, 'ebay', 99.99);
      await agent.addListing(itemId, 'facebook', 89.99);
      await agent.markSold(itemId, 'ebay', 95.00);

      const metrics = await agent.getPlatformPerformance();

      const ebayMetrics = metrics.find((m) => m.platform === 'ebay');
      expect(ebayMetrics?.soldListings).toBe(1);
      expect(ebayMetrics?.totalRevenue).toBe(95.00);

      const facebookMetrics = metrics.find((m) => m.platform === 'facebook');
      expect(facebookMetrics?.activeListings).toBe(1);
    });
  });
});

// Helper function to create mock product data
function createMockProductData(name: string = 'iPhone 13 Pro'): ProductAnalysis {
  return {
    product: {
      name,
      brand: 'Apple',
      category: 'Electronics > Cell Phones',
      model: 'A2483',
      features: ['5G', '128GB', 'Graphite'],
      confidence: 0.95
    },
    condition: {
      state: 'LIKE_NEW',
      notes: 'Excellent condition, no scratches',
      defects: [],
      confidence: 0.9
    },
    marketPositioning: {
      targetBuyer: 'Tech enthusiast looking for flagship phone',
      useCases: ['Daily driver', 'Photography', 'Gaming'],
      uniqueSellingPoints: ['Like-new condition', 'Original box', 'Fast shipping'],
      competitorProducts: ['Samsung Galaxy S21', 'Google Pixel 6 Pro']
    },
    platformContent: {
      ebay: {
        title: 'Apple iPhone 13 Pro 128GB Graphite Unlocked Like New',
        description: 'Excellent condition iPhone 13 Pro...',
        itemSpecifics: {
          Brand: 'Apple',
          Model: 'iPhone 13 Pro',
          Storage: '128GB',
          Color: 'Graphite',
          Condition: 'Like New'
        }
      }
    },
    estimatedRetailValue: {
      low: 750,
      high: 900,
      confidence: 0.85
    }
  };
}
