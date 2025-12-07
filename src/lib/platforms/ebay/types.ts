/**
 * eBay API Type Definitions
 * Based on eBay Sell API v1
 */

export interface EbayConfig {
  clientId: string;
  clientSecret: string;
  ruName?: string;
  sandbox?: boolean;
  redirectUri?: string;
}

export interface EbayToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface EbayInventoryItem {
  sku: string;
  product: {
    title: string;
    description: string;
    aspects?: Record<string, string[]>;
    brand?: string;
    mpn?: string;
    imageUrls: string[];
  };
  condition: 'NEW' | 'LIKE_NEW' | 'VERY_GOOD' | 'GOOD' | 'ACCEPTABLE' | 'FOR_PARTS_OR_NOT_WORKING';
  conditionDescription?: string;
  availability: {
    shipToLocationAvailability: {
      quantity: number;
    };
  };
}

export interface EbayOffer {
  sku: string;
  marketplaceId: 'EBAY_US' | 'EBAY_GB' | 'EBAY_AU' | 'EBAY_CA';
  format: 'FIXED_PRICE' | 'AUCTION';
  listingDescription?: string;
  pricingSummary: {
    price: {
      value: string;
      currency: 'USD' | 'GBP' | 'AUD' | 'CAD';
    };
    auctionStartPrice?: {
      value: string;
      currency: string;
    };
    auctionReservePrice?: {
      value: string;
      currency: string;
    };
  };
  listingPolicies: {
    fulfillmentPolicyId: string;
    paymentPolicyId: string;
    returnPolicyId: string;
  };
  categoryId: string;
  merchantLocationKey?: string;
  listingDuration?: 'DAYS_1' | 'DAYS_3' | 'DAYS_5' | 'DAYS_7' | 'DAYS_10' | 'DAYS_30' | 'GTC';
}

export interface EbayPublishResponse {
  listingId: string;
  warnings?: Array<{
    errorId: number;
    message: string;
    longMessage?: string;
  }>;
}

export interface EbayCategory {
  categoryId: string;
  categoryName: string;
  categoryTreeNodeLevel: number;
  parentCategoryId?: string;
  leafCategoryTreeNode: boolean;
  childCategoryTreeNodes?: EbayCategory[];
}

export interface EbayShippingPolicy {
  name: string;
  description?: string;
  freightShipping: boolean;
  globalShipping: boolean;
  handlingTime: {
    value: number;
    unit: 'BUSINESS_DAY' | 'DAY';
  };
  shippingOptions: Array<{
    optionType: 'DOMESTIC' | 'INTERNATIONAL';
    costType: 'FLAT_RATE' | 'CALCULATED';
    shippingServices: Array<{
      shippingCarrierCode: string;
      shippingServiceCode: string;
      shippingCost?: {
        value: string;
        currency: string;
      };
      freeShipping: boolean;
    }>;
  }>;
}

export interface EbayPaymentPolicy {
  name: string;
  description?: string;
  paymentMethods: Array<{
    paymentMethodType: 'PAYPAL' | 'CREDIT_CARD' | 'DEBIT_CARD';
  }>;
}

export interface EbayReturnPolicy {
  name: string;
  description?: string;
  returnsAccepted: boolean;
  returnPeriod?: {
    value: number;
    unit: 'DAY' | 'MONTH';
  };
  refundMethod?: 'MONEY_BACK' | 'MONEY_BACK_OR_REPLACEMENT';
  returnShippingCostPayer?: 'BUYER' | 'SELLER';
}

export interface EbayListingPayload {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  brand?: string;
  mpn?: string;
  itemSpecifics?: Record<string, string>;
  quantity?: number;
  shippingOptions?: {
    domestic?: {
      service: string;
      cost: number;
      freeShipping?: boolean;
    };
    international?: {
      service: string;
      cost: number;
    };
  };
  returnPolicy?: {
    accepted: boolean;
    daysToReturn?: number;
    shippingPaidBy?: 'BUYER' | 'SELLER';
  };
  duration?: 'DAYS_3' | 'DAYS_5' | 'DAYS_7' | 'DAYS_10' | 'DAYS_30' | 'GTC';
  format?: 'FIXED_PRICE' | 'AUCTION';
  startPrice?: number;
  reservePrice?: number;
}

export interface EbaySoldItem {
  orderId: string;
  listingId: string;
  title: string;
  soldPrice: number;
  soldDate: Date;
  buyerId: string;
  status: string;
}

export interface EbayActiveListing {
  listingId: string;
  title: string;
  price: number;
  status: string;
  views: number;
  watchers: number;
  createdDate: Date;
  endDate?: Date;
}

export interface EbayError {
  errorId: number;
  domain: string;
  category: string;
  message: string;
  longMessage?: string;
  inputRefIds?: string[];
  outputRefIds?: string[];
  parameters?: Array<{
    name: string;
    value: string;
  }>;
}