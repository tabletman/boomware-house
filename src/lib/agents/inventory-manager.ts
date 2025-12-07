/**
 * Inventory Manager Agent
 * Tracks what's listed where, prevents duplicates, manages status
 */

import { DatabaseClient, getDatabase } from '../db/client';
import {
  InventoryItem,
  Listing,
  ProductAnalysis,
  SalesReport,
  PlatformMetrics,
  Platform,
  ListingStatus,
  AgentLog
} from '../db/types';

export interface AddItemOptions {
  skipDuplicateCheck?: boolean;
}

export class InventoryManagerAgent {
  private db: DatabaseClient;
  private agentName = 'InventoryManager';

  constructor(db?: DatabaseClient) {
    this.db = db || getDatabase();
  }

  /**
   * Add new item to inventory
   */
  async addItem(
    productData: ProductAnalysis,
    images: string[],
    options: AddItemOptions = {}
  ): Promise<string> {
    const startTime = Date.now();
    const itemId = this.generateItemId();

    try {
      // Check for duplicates unless explicitly skipped
      if (!options.skipDuplicateCheck) {
        const duplicate = await this.findDuplicate(productData);
        if (duplicate) {
          throw new Error(`Duplicate item found: ${duplicate.id}`);
        }
      }

      // Insert inventory item
      this.db.run(
        `INSERT INTO inventory (id, product_data, images, created_at, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [itemId, JSON.stringify(productData), JSON.stringify(images)]
      );

      // Log operation
      await this.logOperation('add_item', { itemId, images: images.length }, { itemId }, Date.now() - startTime);

      return itemId;
    } catch (error) {
      await this.logOperation('add_item', { itemId }, null, Date.now() - startTime, (error as Error).message);
      throw error;
    }
  }

  /**
   * Get item by ID
   */
  async getItem(id: string): Promise<InventoryItem | null> {
    const row = this.db.get<any>(
      `SELECT * FROM inventory WHERE id = ?`,
      [id]
    );

    if (!row) return null;

    // Get associated listings
    const listings = this.db.all<any>(
      `SELECT * FROM listings WHERE inventory_id = ?`,
      [id]
    );

    return this.mapInventoryItem(row, listings);
  }

  /**
   * Update listing status
   */
  async updateListingStatus(
    itemId: string,
    platform: Platform,
    status: ListingStatus
  ): Promise<void> {
    const startTime = Date.now();

    try {
      this.db.run(
        `UPDATE listings
         SET status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE inventory_id = ? AND platform = ?`,
        [status, itemId, platform]
      );

      await this.logOperation(
        'update_listing_status',
        { itemId, platform, status },
        { success: true },
        Date.now() - startTime
      );
    } catch (error) {
      await this.logOperation(
        'update_listing_status',
        { itemId, platform, status },
        null,
        Date.now() - startTime,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Mark item as sold on platform
   */
  async markSold(
    itemId: string,
    platform: Platform,
    soldPrice: number
  ): Promise<void> {
    const startTime = Date.now();

    try {
      this.db.run(
        `UPDATE listings
         SET status = 'sold', sold_at = CURRENT_TIMESTAMP, sold_price = ?
         WHERE inventory_id = ? AND platform = ?`,
        [soldPrice, itemId, platform]
      );

      // Update performance metrics
      await this.updatePerformanceMetrics(platform);

      await this.logOperation(
        'mark_sold',
        { itemId, platform, soldPrice },
        { success: true },
        Date.now() - startTime
      );
    } catch (error) {
      await this.logOperation(
        'mark_sold',
        { itemId, platform, soldPrice },
        null,
        Date.now() - startTime,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Add listing to inventory item
   */
  async addListing(
    itemId: string,
    platform: Platform,
    price: number,
    listingId?: string,
    listingUrl?: string
  ): Promise<string> {
    const startTime = Date.now();
    const id = this.generateListingId(platform);

    try {
      // Check if listing already exists for this platform
      const existing = this.db.get(
        `SELECT id FROM listings WHERE inventory_id = ? AND platform = ?`,
        [itemId, platform]
      );

      if (existing) {
        throw new Error(`Listing already exists for ${platform}`);
      }

      this.db.run(
        `INSERT INTO listings (id, inventory_id, platform, listing_id, listing_url, price, status, listed_at)
         VALUES (?, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)`,
        [id, itemId, platform, listingId, listingUrl, price]
      );

      await this.logOperation(
        'add_listing',
        { itemId, platform, price },
        { listingId: id },
        Date.now() - startTime
      );

      return id;
    } catch (error) {
      await this.logOperation(
        'add_listing',
        { itemId, platform, price },
        null,
        Date.now() - startTime,
        (error as Error).message
      );
      throw error;
    }
  }

  /**
   * Get all active listings
   */
  async getActiveListings(): Promise<InventoryItem[]> {
    const rows = this.db.all<any>(
      `SELECT DISTINCT i.*
       FROM inventory i
       INNER JOIN listings l ON i.id = l.inventory_id
       WHERE l.status = 'active'
       ORDER BY i.created_at DESC`
    );

    return Promise.all(
      rows.map(async (row) => {
        const listings = this.db.all<any>(
          `SELECT * FROM listings WHERE inventory_id = ?`,
          [row.id]
        );
        return this.mapInventoryItem(row, listings);
      })
    );
  }

  /**
   * Get unlisted items (no listings at all)
   */
  async getUnlistedItems(): Promise<InventoryItem[]> {
    const rows = this.db.all<any>(
      `SELECT i.*
       FROM inventory i
       LEFT JOIN listings l ON i.id = l.inventory_id
       WHERE l.id IS NULL
       ORDER BY i.created_at DESC`
    );

    return rows.map((row) => this.mapInventoryItem(row, []));
  }

  /**
   * Search inventory by product name/brand/category
   */
  async searchInventory(query: string): Promise<InventoryItem[]> {
    const rows = this.db.all<any>(
      `SELECT * FROM inventory
       WHERE product_data LIKE ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [`%${query}%`]
    );

    return Promise.all(
      rows.map(async (row) => {
        const listings = this.db.all<any>(
          `SELECT * FROM listings WHERE inventory_id = ?`,
          [row.id]
        );
        return this.mapInventoryItem(row, listings);
      })
    );
  }

  /**
   * Get sales report for date range
   */
  async getSalesReport(startDate: Date, endDate: Date): Promise<SalesReport> {
    const soldListings = this.db.all<any>(
      `SELECT l.*, i.product_data
       FROM listings l
       INNER JOIN inventory i ON l.inventory_id = i.id
       WHERE l.status = 'sold'
         AND l.sold_at BETWEEN ? AND ?`,
      [startDate.toISOString(), endDate.toISOString()]
    );

    const totalRevenue = soldListings.reduce((sum, l) => sum + (l.sold_price || 0), 0);
    const totalSales = soldListings.length;
    const avgSalePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Platform breakdown
    const platformBreakdown = this.groupByPlatform(soldListings);

    // Top products
    const topProducts = soldListings
      .map((l) => {
        const productData = JSON.parse(l.product_data);
        const listedAt = new Date(l.listed_at);
        const soldAt = new Date(l.sold_at);
        const daysToSell = Math.floor((soldAt.getTime() - listedAt.getTime()) / (1000 * 60 * 60 * 24));

        return {
          productName: `${productData.product.brand} ${productData.product.name}`,
          soldPrice: l.sold_price,
          daysToSell
        };
      })
      .sort((a, b) => b.soldPrice - a.soldPrice)
      .slice(0, 10);

    return {
      startDate,
      endDate,
      totalRevenue,
      totalSales,
      avgSalePrice,
      platformBreakdown,
      topProducts
    };
  }

  /**
   * Get platform performance metrics
   */
  async getPlatformPerformance(): Promise<PlatformMetrics[]> {
    const platforms: Platform[] = ['ebay', 'facebook', 'mercari', 'poshmark', 'offerup'];

    return platforms.map((platform) => {
      const activeListings = this.db.get<{ count: number }>(
        `SELECT COUNT(*) as count FROM listings WHERE platform = ? AND status = 'active'`,
        [platform]
      )?.count || 0;

      const soldListings = this.db.all<any>(
        `SELECT * FROM listings WHERE platform = ? AND status = 'sold'`,
        [platform]
      );

      const totalRevenue = soldListings.reduce((sum, l) => sum + (l.sold_price || 0), 0);

      const avgDaysToSell = soldListings.length > 0
        ? soldListings.reduce((sum, l) => {
            const listedAt = new Date(l.listed_at);
            const soldAt = new Date(l.sold_at);
            return sum + (soldAt.getTime() - listedAt.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / soldListings.length
        : 0;

      const totalListings = this.db.get<{ count: number }>(
        `SELECT COUNT(*) as count FROM listings WHERE platform = ?`,
        [platform]
      )?.count || 0;

      const conversionRate = totalListings > 0 ? soldListings.length / totalListings : 0;

      return {
        platform,
        activeListings,
        soldListings: soldListings.length,
        avgDaysToSell,
        conversionRate,
        totalRevenue
      };
    });
  }

  /**
   * Find potential duplicate items
   */
  private async findDuplicate(productData: ProductAnalysis): Promise<InventoryItem | null> {
    const { brand, name, model } = productData.product;

    const rows = this.db.all<any>(
      `SELECT * FROM inventory
       WHERE product_data LIKE ?
         AND product_data LIKE ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [`%${brand}%`, `%${name}%`]
    );

    for (const row of rows) {
      const existingData = JSON.parse(row.product_data);
      if (
        existingData.product.brand === brand &&
        existingData.product.name === name &&
        (!model || existingData.product.model === model)
      ) {
        return this.mapInventoryItem(row, []);
      }
    }

    return null;
  }

  /**
   * Update platform performance metrics
   */
  private async updatePerformanceMetrics(platform: Platform): Promise<void> {
    const soldListings = this.db.all<any>(
      `SELECT * FROM listings WHERE platform = ? AND status = 'sold'`,
      [platform]
    );

    const totalListings = this.db.get<{ count: number }>(
      `SELECT COUNT(*) as count FROM listings WHERE platform = ?`,
      [platform]
    )?.count || 0;

    const avgDaysToSell = soldListings.length > 0
      ? soldListings.reduce((sum, l) => {
          const listedAt = new Date(l.listed_at);
          const soldAt = new Date(l.sold_at);
          return sum + (soldAt.getTime() - listedAt.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / soldListings.length
      : 0;

    const avgSoldPrice = soldListings.length > 0
      ? soldListings.reduce((sum, l) => sum + l.sold_price, 0) / soldListings.length
      : 0;

    const conversionRate = totalListings > 0 ? soldListings.length / totalListings : 0;

    // Upsert metrics
    this.db.run(
      `INSERT OR REPLACE INTO performance_metrics
       (id, platform, avg_days_to_sell, avg_sold_price, total_listings, total_sales, conversion_rate, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        `metrics_${platform}`,
        platform,
        avgDaysToSell,
        avgSoldPrice,
        totalListings,
        soldListings.length,
        conversionRate
      ]
    );
  }

  /**
   * Log agent operation
   */
  private async logOperation(
    action: string,
    input: any,
    output: any,
    durationMs: number,
    error?: string
  ): Promise<void> {
    const logId = this.generateLogId();

    this.db.run(
      `INSERT INTO agent_logs (id, agent, action, input, output, duration_ms, error, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        logId,
        this.agentName,
        action,
        JSON.stringify(input),
        output ? JSON.stringify(output) : null,
        durationMs,
        error || null
      ]
    );
  }

  /**
   * Map database row to InventoryItem
   */
  private mapInventoryItem(row: any, listings: any[]): InventoryItem {
    return {
      id: row.id,
      productData: JSON.parse(row.product_data),
      images: JSON.parse(row.images),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      listings: listings.map((l) => ({
        id: l.id,
        inventoryId: l.inventory_id,
        platform: l.platform,
        listingId: l.listing_id,
        listingUrl: l.listing_url,
        price: parseFloat(l.price),
        status: l.status,
        listedAt: new Date(l.listed_at),
        soldAt: l.sold_at ? new Date(l.sold_at) : undefined,
        soldPrice: l.sold_price ? parseFloat(l.sold_price) : undefined
      }))
    };
  }

  /**
   * Group listings by platform
   */
  private groupByPlatform(listings: any[]): SalesReport['platformBreakdown'] {
    const grouped = listings.reduce((acc, l) => {
      if (!acc[l.platform]) {
        acc[l.platform] = { revenue: 0, sales: 0, prices: [] };
      }
      acc[l.platform].revenue += l.sold_price || 0;
      acc[l.platform].sales += 1;
      acc[l.platform].prices.push(l.sold_price || 0);
      return acc;
    }, {} as Record<string, { revenue: number; sales: number; prices: number[] }>);

    return Object.entries(grouped).map(([platform, data]) => ({
      platform: platform as Platform,
      revenue: data.revenue,
      sales: data.sales,
      avgPrice: data.revenue / data.sales
    }));
  }

  /**
   * Generate unique item ID
   */
  private generateItemId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique listing ID
   */
  private generateListingId(platform: string): string {
    return `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique log ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
