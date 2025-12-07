/**
 * Price Optimizer Agent
 * Dynamic pricing strategy, not just market lookup
 */

import { ProductAnalysis } from '../db/types';

export interface PricingStrategy {
  listPrice: number;
  minimumAccept: number;  // Lowest offer to auto-accept
  declineBelow: number;   // Auto-decline below this
  priceDropSchedule?: {   // Auto price reductions
    daysAfterListing: number;
    percentReduction: number;
  }[];
  auction?: {
    startPrice: number;
    reserve?: number;
    duration: 1 | 3 | 5 | 7 | 10;
  };
}

export interface MarketData {
  avgSoldPrice: number;
  lowestActive: number;
  highestSold: number;
  avgDaysToSell: number;
  totalActive: number;
  recentSales: {
    price: number;
    date: Date;
    condition: string;
  }[];
}

export interface PricingOptions {
  urgency: 'fast_sale' | 'maximize_profit' | 'balanced';
  platform: string;
  condition: string;
}

export interface PlatformFees {
  [platform: string]: {
    sellingFee: number;      // Percentage
    paymentFee: number;      // Percentage
    fixedFee?: number;       // Fixed amount
    promotedListingFee?: number; // Optional promotion
  };
}

export class PriceOptimizerAgent {
  private readonly platformFees: PlatformFees = {
    ebay: {
      sellingFee: 0.1315,    // 13.15% for most categories
      paymentFee: 0,          // Included in selling fee
      fixedFee: 0.30,         // $0.30 per order
      promotedListingFee: 0.02 // 2% if promoted
    },
    facebook: {
      sellingFee: 0.05,       // 5% or $0.40 minimum
      paymentFee: 0,
      fixedFee: 0.40
    },
    mercari: {
      sellingFee: 0.10,       // 10% flat
      paymentFee: 0.029,      // 2.9% + $0.50
      fixedFee: 0.50
    },
    poshmark: {
      sellingFee: 0.20,       // 20% for items over $15
      paymentFee: 0,          // Included
      fixedFee: 0
    },
    offerup: {
      sellingFee: 0.129,      // 12.9% for shipped items
      paymentFee: 0,
      fixedFee: 0
    }
  };

  /**
   * Create comprehensive pricing strategy
   */
  async createStrategy(
    productData: ProductAnalysis,
    marketData: MarketData,
    options: PricingOptions
  ): Promise<PricingStrategy> {
    // Base price calculation
    const estimatedValue = (productData.estimatedRetailValue.low + productData.estimatedRetailValue.high) / 2;
    const marketAvg = marketData.avgSoldPrice;
    const basePrice = this.calculateBasePrice(estimatedValue, marketAvg, productData.condition.state);

    // Adjust for urgency
    const urgencyMultiplier = this.getUrgencyMultiplier(options.urgency);
    const adjustedPrice = Math.round(basePrice * urgencyMultiplier);

    // Calculate acceptance thresholds
    const minimumAccept = this.calculateMinimumAccept(adjustedPrice, options);
    const declineBelow = Math.round(minimumAccept * 0.75);

    // Create price drop schedule
    const priceDropSchedule = this.createPriceDropSchedule(
      adjustedPrice,
      minimumAccept,
      options.urgency
    );

    // Determine if auction is better
    const shouldAuction = await this.shouldAuction(productData, marketData);

    let strategy: PricingStrategy = {
      listPrice: adjustedPrice,
      minimumAccept,
      declineBelow,
      priceDropSchedule
    };

    if (shouldAuction) {
      strategy.auction = this.createAuctionStrategy(
        adjustedPrice,
        minimumAccept,
        marketData
      );
    }

    return strategy;
  }

  /**
   * Determine if auction format is better than fixed price
   */
  async shouldAuction(
    productData: ProductAnalysis,
    marketData: MarketData
  ): Promise<boolean> {
    const factors = {
      highDemand: marketData.recentSales.length > 5,
      fastTurnover: marketData.avgDaysToSell < 7,
      collectible: this.isCollectible(productData),
      uniqueItem: productData.marketPositioning.uniqueSellingPoints.length > 3,
      lowSupply: marketData.totalActive < 10,
      priceVariance: this.calculatePriceVariance(marketData.recentSales) > 0.3
    };

    // Count positive factors
    const positiveFactors = Object.values(factors).filter(f => f).length;

    // Auction if 3+ positive factors
    return positiveFactors >= 3;
  }

  /**
   * Calculate net profit after platform fees
   */
  async calculateNetProfit(
    grossPrice: number,
    platform: string,
    shipping: 'buyer_pays' | 'free_shipping' = 'buyer_pays'
  ): Promise<number> {
    const fees = this.platformFees[platform.toLowerCase()];

    if (!fees) {
      throw new Error(`Unknown platform: ${platform}`);
    }

    let totalFees = 0;

    // Percentage-based fees
    totalFees += grossPrice * (fees.sellingFee + fees.paymentFee);

    // Fixed fees
    if (fees.fixedFee) {
      totalFees += fees.fixedFee;
    }

    // Shipping cost if offering free shipping
    if (shipping === 'free_shipping') {
      totalFees += this.estimateShippingCost(platform);
    }

    const netProfit = grossPrice - totalFees;

    return Math.round(netProfit * 100) / 100;
  }

  /**
   * Get platform-specific fee breakdown
   */
  getPlatformFees(platform: string): PlatformFees[string] {
    return this.platformFees[platform.toLowerCase()];
  }

  /**
   * Calculate competitive price based on market data
   */
  getCompetitivePrice(marketData: MarketData, position: 'lowest' | 'average' | 'premium'): number {
    switch (position) {
      case 'lowest':
        return Math.round(marketData.lowestActive * 0.95); // Undercut by 5%
      case 'average':
        return Math.round(marketData.avgSoldPrice);
      case 'premium':
        return Math.round(marketData.highestSold * 0.9); // 10% below highest
      default:
        return Math.round(marketData.avgSoldPrice);
    }
  }

  /**
   * Private helper methods
   */

  private calculateBasePrice(
    estimatedValue: number,
    marketAvg: number,
    condition: string
  ): number {
    // Weight: 60% market, 40% estimated
    const weightedPrice = (marketAvg * 0.6) + (estimatedValue * 0.4);

    // Condition multiplier
    const conditionMultipliers: Record<string, number> = {
      'NEW': 1.0,
      'LIKE_NEW': 0.85,
      'GOOD': 0.70,
      'FAIR': 0.50,
      'POOR': 0.30
    };

    return Math.round(weightedPrice * (conditionMultipliers[condition] || 0.70));
  }

  private getUrgencyMultiplier(urgency: string): number {
    switch (urgency) {
      case 'fast_sale':
        return 0.85;  // 15% discount for quick sale
      case 'maximize_profit':
        return 1.10;  // 10% premium, wait for right buyer
      case 'balanced':
      default:
        return 1.0;   // Market price
    }
  }

  private calculateMinimumAccept(listPrice: number, options: PricingOptions): number {
    const baseAcceptRate = {
      'fast_sale': 0.75,      // Accept 75% of list
      'maximize_profit': 0.90, // Accept 90% of list
      'balanced': 0.85         // Accept 85% of list
    };

    return Math.round(listPrice * baseAcceptRate[options.urgency]);
  }

  private createPriceDropSchedule(
    startPrice: number,
    minPrice: number,
    urgency: string
  ): PricingStrategy['priceDropSchedule'] {
    const schedules = {
      fast_sale: [
        { daysAfterListing: 3, percentReduction: 5 },
        { daysAfterListing: 7, percentReduction: 10 },
        { daysAfterListing: 14, percentReduction: 15 }
      ],
      maximize_profit: [
        { daysAfterListing: 14, percentReduction: 5 },
        { daysAfterListing: 30, percentReduction: 10 },
        { daysAfterListing: 45, percentReduction: 15 }
      ],
      balanced: [
        { daysAfterListing: 7, percentReduction: 5 },
        { daysAfterListing: 14, percentReduction: 10 },
        { daysAfterListing: 21, percentReduction: 15 }
      ]
    };

    return schedules[urgency as keyof typeof schedules] || schedules.balanced;
  }

  private createAuctionStrategy(
    estimatedPrice: number,
    minimumPrice: number,
    marketData: MarketData
  ): PricingStrategy['auction'] {
    // Start low to attract bidders
    const startPrice = Math.round(minimumPrice * 0.5);

    // Reserve at minimum acceptable
    const reserve = minimumPrice;

    // Duration based on demand
    const duration = marketData.avgDaysToSell < 7 ? 3 : 7;

    return {
      startPrice,
      reserve,
      duration: duration as 3 | 7
    };
  }

  private isCollectible(productData: ProductAnalysis): boolean {
    const collectibleKeywords = [
      'vintage', 'rare', 'limited', 'collectible', 'antique',
      'retro', 'discontinued', 'signed', 'first edition'
    ];

    const text = JSON.stringify(productData).toLowerCase();
    return collectibleKeywords.some(keyword => text.includes(keyword));
  }

  private calculatePriceVariance(sales: MarketData['recentSales']): number {
    if (sales.length < 2) return 0;

    const prices = sales.map(s => s.price);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);

    return stdDev / avg; // Coefficient of variation
  }

  private estimateShippingCost(platform: string): number {
    // Rough estimates for USPS Priority Mail
    const shippingEstimates: Record<string, number> = {
      ebay: 8.00,
      facebook: 0,      // Local pickup typically
      mercari: 7.99,
      poshmark: 7.97,   // Flat rate
      offerup: 8.00
    };

    return shippingEstimates[platform.toLowerCase()] || 8.00;
  }

  /**
   * Generate price analysis report
   */
  async generatePriceReport(
    productData: ProductAnalysis,
    marketData: MarketData,
    strategy: PricingStrategy
  ): Promise<string> {
    const report = `
📊 PRICING ANALYSIS REPORT
========================

Product: ${productData.product.brand} ${productData.product.name}
Condition: ${productData.condition.state}

MARKET DATA:
- Average Sold: $${marketData.avgSoldPrice}
- Lowest Active: $${marketData.lowestActive}
- Highest Sold: $${marketData.highestSold}
- Avg Days to Sell: ${marketData.avgDaysToSell}
- Active Listings: ${marketData.totalActive}

PRICING STRATEGY:
- List Price: $${strategy.listPrice}
- Auto-Accept: $${strategy.minimumAccept}+
- Auto-Decline: Below $${strategy.declineBelow}

${strategy.auction ? `
AUCTION STRATEGY:
- Start Price: $${strategy.auction.startPrice}
- Reserve: $${strategy.auction.reserve}
- Duration: ${strategy.auction.duration} days
` : ''}

PRICE DROP SCHEDULE:
${strategy.priceDropSchedule?.map(drop =>
  `- Day ${drop.daysAfterListing}: -${drop.percentReduction}%`
).join('\n') || 'No automatic price drops'}

PLATFORM NET PROFIT (at list price):
- eBay: $${await this.calculateNetProfit(strategy.listPrice, 'ebay')}
- Facebook: $${await this.calculateNetProfit(strategy.listPrice, 'facebook')}
- Mercari: $${await this.calculateNetProfit(strategy.listPrice, 'mercari')}
- Poshmark: $${await this.calculateNetProfit(strategy.listPrice, 'poshmark')}
- OfferUp: $${await this.calculateNetProfit(strategy.listPrice, 'offerup')}
`;

    return report.trim();
  }
}