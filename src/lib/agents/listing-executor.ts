/**
 * Listing Executor Agent
 * Actually POST listings to marketplaces
 */

import { EbayClient } from '../platforms/ebay/client';
import { EbayConfig, EbayListingPayload } from '../platforms/ebay/types';
import { ProductAnalysis } from '../db/types';
import { PricingStrategy } from './price-optimizer';

export interface ListingPayload {
  platform: 'ebay' | 'facebook' | 'mercari' | 'poshmark' | 'offerup';
  title: string;
  description: string;
  price: number;
  images: string[]; // Paths or URLs
  category: string;
  condition: string;
  shipping?: ShippingConfig;
  itemSpecifics?: Record<string, string>;
  format?: 'FIXED_PRICE' | 'AUCTION';
  startPrice?: number;
  reservePrice?: number;
}

export interface ShippingConfig {
  domestic: {
    service: string;
    cost: number;
    freeShipping?: boolean;
  };
  international?: {
    service: string;
    cost: number;
  };
}

export interface ListingResult {
  success: boolean;
  platform: string;
  listingId?: string;
  listingUrl?: string;
  error?: string;
  timestamp: Date;
}

export interface ListingExecutorConfig {
  ebay?: EbayConfig;
  mockMode?: boolean; // For testing without actual posting
}

export class ListingExecutorAgent {
  private ebayClient?: EbayClient;
  private mockMode: boolean;

  constructor(config: ListingExecutorConfig = {}) {
    this.mockMode = config.mockMode || false;

    if (config.ebay && !this.mockMode) {
      this.ebayClient = new EbayClient(config.ebay);
    }
  }

  /**
   * List on eBay using official API
   */
  async listOnEbay(payload: ListingPayload): Promise<ListingResult> {
    console.log(`🎯 Listing on eBay: ${payload.title}`);

    if (this.mockMode) {
      console.log('   📝 MOCK MODE: Simulating eBay listing...');
      await this.simulateDelay();
      return {
        success: true,
        platform: 'ebay',
        listingId: `MOCK_EBAY_${Date.now()}`,
        listingUrl: `https://www.ebay.com/itm/MOCK_${Date.now()}`,
        timestamp: new Date()
      };
    }

    if (!this.ebayClient) {
      return {
        success: false,
        platform: 'ebay',
        error: 'eBay client not configured',
        timestamp: new Date()
      };
    }

    try {
      const ebayPayload: EbayListingPayload = {
        title: this.optimizeTitle(payload.title, 'ebay'),
        description: this.enhanceDescription(payload.description, 'ebay'),
        price: payload.price,
        images: payload.images,
        category: payload.category,
        condition: payload.condition,
        itemSpecifics: payload.itemSpecifics,
        quantity: 1,
        shippingOptions: payload.shipping ? {
          domestic: payload.shipping.domestic
        } : undefined,
        duration: 'DAYS_7',
        format: payload.format,
        startPrice: payload.startPrice,
        reservePrice: payload.reservePrice
      };

      const listingId = await this.ebayClient.createListing(ebayPayload);

      return {
        success: true,
        platform: 'ebay',
        listingId,
        listingUrl: `https://www.ebay.com/itm/${listingId}`,
        timestamp: new Date()
      };
    } catch (error: any) {
      console.error('❌ eBay listing failed:', error.message);
      return {
        success: false,
        platform: 'ebay',
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * List on Facebook Marketplace (Playwright automation)
   */
  async listOnFacebook(payload: ListingPayload): Promise<ListingResult> {
    console.log(`🎯 Listing on Facebook: ${payload.title}`);

    if (this.mockMode) {
      console.log('   📝 MOCK MODE: Simulating Facebook listing...');
      await this.simulateDelay();
      return {
        success: true,
        platform: 'facebook',
        listingId: `MOCK_FB_${Date.now()}`,
        listingUrl: `https://www.facebook.com/marketplace/item/MOCK_${Date.now()}`,
        timestamp: new Date()
      };
    }

    // TODO: Implement Playwright automation for Facebook
    return {
      success: false,
      platform: 'facebook',
      error: 'Facebook automation not yet implemented',
      timestamp: new Date()
    };
  }

  /**
   * List on Mercari (Playwright automation)
   */
  async listOnMercari(payload: ListingPayload): Promise<ListingResult> {
    console.log(`🎯 Listing on Mercari: ${payload.title}`);

    if (this.mockMode) {
      console.log('   📝 MOCK MODE: Simulating Mercari listing...');
      await this.simulateDelay();
      return {
        success: true,
        platform: 'mercari',
        listingId: `MOCK_MERC_${Date.now()}`,
        listingUrl: `https://www.mercari.com/us/item/MOCK_${Date.now()}`,
        timestamp: new Date()
      };
    }

    // TODO: Implement Playwright automation for Mercari
    return {
      success: false,
      platform: 'mercari',
      error: 'Mercari automation not yet implemented',
      timestamp: new Date()
    };
  }

  /**
   * List on Poshmark (Playwright automation)
   */
  async listOnPoshmark(payload: ListingPayload): Promise<ListingResult> {
    console.log(`🎯 Listing on Poshmark: ${payload.title}`);

    if (this.mockMode) {
      console.log('   📝 MOCK MODE: Simulating Poshmark listing...');
      await this.simulateDelay();
      return {
        success: true,
        platform: 'poshmark',
        listingId: `MOCK_POSH_${Date.now()}`,
        listingUrl: `https://poshmark.com/listing/MOCK_${Date.now()}`,
        timestamp: new Date()
      };
    }

    // TODO: Implement Playwright automation for Poshmark
    return {
      success: false,
      platform: 'poshmark',
      error: 'Poshmark automation not yet implemented',
      timestamp: new Date()
    };
  }

  /**
   * List on OfferUp (Playwright automation)
   */
  async listOnOfferup(payload: ListingPayload): Promise<ListingResult> {
    console.log(`🎯 Listing on OfferUp: ${payload.title}`);

    if (this.mockMode) {
      console.log('   📝 MOCK MODE: Simulating OfferUp listing...');
      await this.simulateDelay();
      return {
        success: true,
        platform: 'offerup',
        listingId: `MOCK_OFFER_${Date.now()}`,
        listingUrl: `https://offerup.com/item/MOCK_${Date.now()}`,
        timestamp: new Date()
      };
    }

    // TODO: Implement Playwright automation for OfferUp
    return {
      success: false,
      platform: 'offerup',
      error: 'OfferUp automation not yet implemented',
      timestamp: new Date()
    };
  }

  /**
   * Cross-list on multiple platforms
   */
  async crossList(
    payload: ListingPayload,
    platforms: string[]
  ): Promise<ListingResult[]> {
    console.log(`\n🚀 Cross-listing on ${platforms.length} platforms...\n`);

    const results = await Promise.all(
      platforms.map(async (platform) => {
        const platformPayload = { ...payload, platform: platform as ListingPayload['platform'] };

        switch (platform.toLowerCase()) {
          case 'ebay':
            return this.listOnEbay(platformPayload);
          case 'facebook':
            return this.listOnFacebook(platformPayload);
          case 'mercari':
            return this.listOnMercari(platformPayload);
          case 'poshmark':
            return this.listOnPoshmark(platformPayload);
          case 'offerup':
            return this.listOnOfferup(platformPayload);
          default:
            return {
              success: false,
              platform,
              error: `Unknown platform: ${platform}`,
              timestamp: new Date()
            };
        }
      })
    );

    // Summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`\n📊 Cross-listing Results:`);
    console.log(`   ✅ Successful: ${successful.length}/${platforms.length}`);
    if (failed.length > 0) {
      console.log(`   ❌ Failed: ${failed.map(f => f.platform).join(', ')}`);
    }

    return results;
  }

  /**
   * Build listing payload from product data
   */
  buildListingPayload(
    productData: ProductAnalysis,
    images: string[],
    pricingStrategy: PricingStrategy,
    platform: string
  ): ListingPayload {
    const platformContent = this.getPlatformContent(productData, platform);

    return {
      platform: platform as ListingPayload['platform'],
      title: platformContent.title,
      description: platformContent.description,
      price: pricingStrategy.listPrice,
      images,
      category: this.mapCategory(productData.product.category, platform),
      condition: productData.condition.state,
      itemSpecifics: platformContent.itemSpecifics,
      format: pricingStrategy.auction ? 'AUCTION' : 'FIXED_PRICE',
      startPrice: pricingStrategy.auction?.startPrice,
      reservePrice: pricingStrategy.auction?.reserve,
      shipping: {
        domestic: {
          service: 'USPS Priority Mail',
          cost: 0,
          freeShipping: true
        }
      }
    };
  }

  /**
   * Private helper methods
   */

  private getPlatformContent(productData: ProductAnalysis, platform: string): {
    title: string;
    description: string;
    itemSpecifics?: Record<string, string>;
  } {
    const platformKey = platform.toLowerCase() as keyof ProductAnalysis['platformContent'];
    const content = productData.platformContent[platformKey];

    if (!content) {
      // Fallback to generic content
      return {
        title: `${productData.product.brand} ${productData.product.name}`,
        description: this.generateDescription(productData),
        itemSpecifics: this.generateItemSpecifics(productData)
      };
    }

    return {
      title: content.title,
      description: content.description,
      itemSpecifics: content.itemSpecifics || this.generateItemSpecifics(productData)
    };
  }

  private generateDescription(productData: ProductAnalysis): string {
    return `
${productData.product.brand} ${productData.product.name}

CONDITION: ${productData.condition.state}
${productData.condition.notes}

FEATURES:
${productData.product.features.map(f => `• ${f}`).join('\n')}

${productData.marketPositioning.uniqueSellingPoints.map(usp => `✓ ${usp}`).join('\n')}

Perfect for: ${productData.marketPositioning.targetBuyer}

Fast shipping! Carefully packaged. Smoke-free home.
Questions? Feel free to ask!
    `.trim();
  }

  private generateItemSpecifics(productData: ProductAnalysis): Record<string, string> {
    return {
      Brand: productData.product.brand,
      Model: productData.product.model || 'N/A',
      Condition: productData.condition.state,
      ...productData.product.features.reduce((acc, feature, index) => {
        acc[`Feature ${index + 1}`] = feature;
        return acc;
      }, {} as Record<string, string>)
    };
  }

  private optimizeTitle(title: string, platform: string): string {
    const maxLengths: Record<string, number> = {
      ebay: 80,
      facebook: 100,
      mercari: 80,
      poshmark: 50,
      offerup: 64
    };

    const maxLength = maxLengths[platform] || 80;

    if (title.length <= maxLength) {
      return title;
    }

    // Truncate and add ellipsis
    return title.substring(0, maxLength - 3) + '...';
  }

  private enhanceDescription(description: string, platform: string): string {
    // Platform-specific enhancements
    const enhancements: Record<string, string> = {
      ebay: '\n\n🚚 Fast shipping with tracking\n💯 100% authentic\n📦 Carefully packaged',
      facebook: '\n\n💬 Message for quick response\n🏠 Local pickup available\n✨ Priced to sell',
      mercari: '\n\n✈️ Ships same/next business day\n💝 Bundle for discounts\n⭐ Top rated seller',
      poshmark: '\n\n👗 Closet clearout\n💕 Bundle & save\n🎉 Offers welcome',
      offerup: '\n\n📍 Local deals\n💵 Cash or digital payment\n✅ Verified seller'
    };

    return description + (enhancements[platform] || '');
  }

  private mapCategory(category: string, platform: string): string {
    // In production, would have comprehensive category mapping
    // For now, return a default category ID for each platform

    const defaultCategories: Record<string, string> = {
      ebay: '15032',      // Consumer Electronics > Other
      facebook: 'electronics',
      mercari: 'electronics',
      poshmark: 'electronics',
      offerup: 'electronics'
    };

    return defaultCategories[platform] || category;
  }

  private async simulateDelay(): Promise<void> {
    // Simulate network delay for mock mode
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  }

  /**
   * Set eBay authentication token
   */
  setEbayToken(token: any): void {
    if (this.ebayClient) {
      this.ebayClient.setToken(token);
    }
  }

  /**
   * Get eBay auth URL for OAuth flow
   */
  getEbayAuthUrl(state?: string): string {
    if (!this.ebayClient) {
      throw new Error('eBay client not configured');
    }
    return this.ebayClient.getAuthUrl(state);
  }

  /**
   * Complete eBay OAuth flow
   */
  async authenticateEbay(authCode: string): Promise<void> {
    if (!this.ebayClient) {
      throw new Error('eBay client not configured');
    }
    await this.ebayClient.authenticate(authCode);
  }
}