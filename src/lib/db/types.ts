/**
 * Database Type Definitions
 * Shared types for inventory management system
 */

export interface ProductAnalysis {
  product: {
    name: string;
    brand: string;
    category: string;
    model?: string;
    features: string[];
    confidence: number;
  };
  condition: {
    state: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
    notes: string;
    defects: string[];
    confidence: number;
  };
  marketPositioning: {
    targetBuyer: string;
    useCases: string[];
    uniqueSellingPoints: string[];
    competitorProducts: string[];
  };
  platformContent: {
    ebay?: {
      title: string;
      description: string;
      itemSpecifics: Record<string, string>;
    };
    facebook?: {
      title: string;
      description: string;
    };
    mercari?: {
      title: string;
      description: string;
    };
  };
  estimatedRetailValue: {
    low: number;
    high: number;
    confidence: number;
  };
}

export interface InventoryItem {
  id: string;
  productData: ProductAnalysis;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  listings?: Listing[];
}

export interface Listing {
  id: string;
  inventoryId: string;
  platform: Platform;
  listingId?: string;
  listingUrl?: string;
  price: number;
  status: ListingStatus;
  listedAt: Date;
  soldAt?: Date;
  soldPrice?: number;
}

export type Platform = 'ebay' | 'facebook' | 'mercari' | 'poshmark' | 'offerup';

export type ListingStatus = 'active' | 'sold' | 'expired' | 'removed';

export interface PriceHistory {
  id: string;
  inventoryId: string;
  platform: Platform;
  price: number;
  recordedAt: Date;
}

export interface AgentLog {
  id: string;
  agent: string;
  action: string;
  input?: any;
  output?: any;
  durationMs?: number;
  error?: string;
  createdAt: Date;
}

export interface PerformanceMetrics {
  id: string;
  platform: Platform;
  avgDaysToSell: number;
  avgSoldPrice: number;
  totalListings: number;
  totalSales: number;
  conversionRate: number;
  updatedAt: Date;
}

export interface SalesReport {
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalSales: number;
  avgSalePrice: number;
  platformBreakdown: {
    platform: Platform;
    revenue: number;
    sales: number;
    avgPrice: number;
  }[];
  topProducts: {
    productName: string;
    soldPrice: number;
    daysToSell: number;
  }[];
}

export interface PlatformMetrics {
  platform: Platform;
  activeListings: number;
  soldListings: number;
  avgDaysToSell: number;
  conversionRate: number;
  totalRevenue: number;
}
