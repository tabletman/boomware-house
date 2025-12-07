/**
 * eBay API Client
 * OAuth 2.0 authentication and Sell API integration
 */

import axios, { AxiosInstance } from 'axios';
import {
  EbayConfig,
  EbayToken,
  EbayInventoryItem,
  EbayOffer,
  EbayPublishResponse,
  EbayListingPayload,
  EbaySoldItem,
  EbayActiveListing,
  EbayError
} from './types';

export class EbayClient {
  private config: EbayConfig;
  private token?: EbayToken;
  private tokenExpiry?: Date;
  private axios: AxiosInstance;
  private baseUrl: string;

  constructor(config: EbayConfig) {
    this.config = config;
    this.baseUrl = config.sandbox
      ? 'https://api.sandbox.ebay.com'
      : 'https://api.ebay.com';

    this.axios = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to add auth token
    this.axios.interceptors.request.use(async (config) => {
      if (this.needsAuth(config.url)) {
        const token = await this.getValidToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }

  /**
   * Get OAuth authorization URL for user consent
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri || 'https://localhost:3000/callback',
      scope: [
        'https://api.ebay.com/oauth/api_scope',
        'https://api.ebay.com/oauth/api_scope/sell.inventory',
        'https://api.ebay.com/oauth/api_scope/sell.marketing',
        'https://api.ebay.com/oauth/api_scope/sell.account',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment'
      ].join(' ')
    });

    if (state) {
      params.append('state', state);
    }

    if (this.config.ruName) {
      params.append('ru_name', this.config.ruName);
    }

    const authUrl = this.config.sandbox
      ? 'https://auth.sandbox.ebay.com/oauth2/authorize'
      : 'https://auth.ebay.com/oauth2/authorize';

    return `${authUrl}?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticate(authCode: string): Promise<void> {
    const tokenUrl = this.config.sandbox
      ? 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
      : 'https://api.ebay.com/identity/v1/oauth2/token';

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: this.config.redirectUri || 'https://localhost:3000/callback'
    });

    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString('base64');

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      }
    });

    this.token = response.data;
    this.tokenExpiry = new Date(Date.now() + (this.token!.expires_in * 1000));

    console.log('✅ eBay authentication successful');
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<void> {
    if (!this.token?.refresh_token) {
      throw new Error('No refresh token available');
    }

    const tokenUrl = this.config.sandbox
      ? 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
      : 'https://api.ebay.com/identity/v1/oauth2/token';

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.token.refresh_token
    });

    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`
    ).toString('base64');

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      }
    });

    this.token = response.data;
    this.tokenExpiry = new Date(Date.now() + (this.token!.expires_in * 1000));
  }

  /**
   * Create a new listing on eBay
   */
  async createListing(payload: EbayListingPayload): Promise<string> {
    // Generate SKU
    const sku = `SKU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Step 1: Create or update inventory item
    const inventoryItem: EbayInventoryItem = {
      sku,
      product: {
        title: payload.title,
        description: payload.description,
        aspects: this.convertItemSpecifics(payload.itemSpecifics),
        brand: payload.brand,
        mpn: payload.mpn,
        imageUrls: payload.images
      },
      condition: this.mapCondition(payload.condition),
      conditionDescription: `Item is in ${payload.condition} condition`,
      availability: {
        shipToLocationAvailability: {
          quantity: payload.quantity || 1
        }
      }
    };

    await this.createOrUpdateInventoryItem(sku, inventoryItem);

    // Step 2: Create offer
    const offer: EbayOffer = {
      sku,
      marketplaceId: 'EBAY_US',
      format: payload.format || 'FIXED_PRICE',
      listingDescription: payload.description,
      pricingSummary: this.createPricingSummary(payload),
      listingPolicies: await this.getOrCreatePolicies(),
      categoryId: payload.category,
      listingDuration: payload.duration || 'DAYS_7'
    };

    const offerId = await this.createOffer(offer);

    // Step 3: Publish offer
    const publishResponse = await this.publishOffer(offerId);

    console.log(`✅ eBay listing created: ${publishResponse.listingId}`);
    return publishResponse.listingId;
  }

  /**
   * Update an existing listing
   */
  async updateListing(listingId: string, updates: Partial<EbayListingPayload>): Promise<void> {
    // Note: eBay doesn't allow direct listing updates after publishing
    // Must revise through inventory/offer APIs

    // This would involve:
    // 1. Get the offer ID from listing ID
    // 2. Update inventory item if needed
    // 3. Update offer
    // 4. Publish changes

    throw new Error('Listing updates not yet implemented');
  }

  /**
   * End a listing
   */
  async endListing(listingId: string): Promise<void> {
    const response = await this.axios.post(
      `/sell/inventory/v1/listing/${listingId}/end`,
      {}
    );

    if (response.status === 204) {
      console.log(`✅ Listing ${listingId} ended successfully`);
    }
  }

  /**
   * Get sold items
   */
  async getSoldItems(startDate: Date): Promise<EbaySoldItem[]> {
    const response = await this.axios.get('/sell/fulfillment/v1/order', {
      params: {
        filter: `creationdate:[${startDate.toISOString()}..NOW]`,
        limit: 100
      }
    });

    return response.data.orders?.map((order: any) => ({
      orderId: order.orderId,
      listingId: order.lineItems[0]?.lineItemId,
      title: order.lineItems[0]?.title,
      soldPrice: parseFloat(order.pricingSummary.total.value),
      soldDate: new Date(order.creationDate),
      buyerId: order.buyer.username,
      status: order.orderFulfillmentStatus
    })) || [];
  }

  /**
   * Get active listings
   */
  async getActiveListings(): Promise<EbayActiveListing[]> {
    const response = await this.axios.get('/sell/inventory/v1/offer', {
      params: {
        limit: 100,
        filter: 'status:PUBLISHED'
      }
    });

    return response.data.offers?.map((offer: any) => ({
      listingId: offer.listingId,
      title: offer.listing?.title,
      price: parseFloat(offer.pricingSummary.price.value),
      status: offer.status,
      views: 0, // Would need to call Analytics API for views
      watchers: 0, // Would need to call Analytics API for watchers
      createdDate: new Date(offer.createdDate),
      endDate: offer.listing?.endDate ? new Date(offer.listing.endDate) : undefined
    })) || [];
  }

  /**
   * Private helper methods
   */

  private async getValidToken(): Promise<string> {
    if (!this.token || !this.tokenExpiry || this.tokenExpiry < new Date()) {
      if (this.token?.refresh_token) {
        await this.refreshToken();
      } else {
        throw new Error('No valid token available. Please authenticate first.');
      }
    }

    return this.token!.access_token;
  }

  private needsAuth(url?: string): boolean {
    // Auth endpoints don't need bearer token
    return !url?.includes('/identity/v1/oauth2/token');
  }

  private async createOrUpdateInventoryItem(sku: string, item: EbayInventoryItem): Promise<void> {
    await this.axios.put(`/sell/inventory/v1/inventory_item/${sku}`, item);
  }

  private async createOffer(offer: EbayOffer): Promise<string> {
    const response = await this.axios.post('/sell/inventory/v1/offer', offer);
    return response.data.offerId;
  }

  private async publishOffer(offerId: string): Promise<EbayPublishResponse> {
    const response = await this.axios.post(
      `/sell/inventory/v1/offer/${offerId}/publish`,
      {}
    );
    return response.data;
  }

  private async getOrCreatePolicies(): Promise<EbayOffer['listingPolicies']> {
    // In production, these would be created via Account API
    // For now, use default policy IDs (must be created in eBay seller account)
    return {
      fulfillmentPolicyId: '000000', // Replace with actual policy ID
      paymentPolicyId: '000000',      // Replace with actual policy ID
      returnPolicyId: '000000'        // Replace with actual policy ID
    };
  }

  private convertItemSpecifics(specifics?: Record<string, string>): Record<string, string[]> {
    if (!specifics) return {};

    const aspects: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(specifics)) {
      aspects[key] = [value];
    }
    return aspects;
  }

  private mapCondition(condition: string): EbayInventoryItem['condition'] {
    const conditionMap: Record<string, EbayInventoryItem['condition']> = {
      'NEW': 'NEW',
      'LIKE_NEW': 'LIKE_NEW',
      'GOOD': 'GOOD',
      'FAIR': 'ACCEPTABLE',
      'POOR': 'FOR_PARTS_OR_NOT_WORKING'
    };

    return conditionMap[condition] || 'GOOD';
  }

  private createPricingSummary(payload: EbayListingPayload): EbayOffer['pricingSummary'] {
    const pricing: EbayOffer['pricingSummary'] = {
      price: {
        value: payload.price.toFixed(2),
        currency: 'USD'
      }
    };

    if (payload.format === 'AUCTION') {
      pricing.auctionStartPrice = {
        value: (payload.startPrice || payload.price * 0.5).toFixed(2),
        currency: 'USD'
      };

      if (payload.reservePrice) {
        pricing.auctionReservePrice = {
          value: payload.reservePrice.toFixed(2),
          currency: 'USD'
        };
      }
    }

    return pricing;
  }

  private handleError(error: any): Promise<never> {
    if (error.response?.data?.errors) {
      const ebayErrors = error.response.data.errors as EbayError[];
      const errorMessages = ebayErrors.map(e => e.longMessage || e.message).join(', ');
      throw new Error(`eBay API Error: ${errorMessages}`);
    }

    throw error;
  }

  /**
   * Set authentication token directly (for testing or saved tokens)
   */
  setToken(token: EbayToken): void {
    this.token = token;
    this.tokenExpiry = new Date(Date.now() + (token.expires_in * 1000));
  }

  /**
   * Get current token (for saving)
   */
  getToken(): EbayToken | undefined {
    return this.token;
  }
}