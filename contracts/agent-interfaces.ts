/**
 * BOOMER Agent Interface Contracts
 *
 * TypeScript interface definitions for all agents and shared types.
 * These contracts ensure type safety across the microservice architecture.
 */

// ============================================================================
// SHARED TYPES
// ============================================================================

export type Platform = 'ebay' | 'facebook' | 'mercari';
export type Condition = 'NEW' | 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR';
export type JobStatus = 'queued' | 'processing' | 'completed' | 'partial_success' | 'failed';
export type ListingStatus = 'draft' | 'pending' | 'active' | 'sold' | 'cancelled' | 'expired';

export interface BaseResponse {
  success: boolean;
  timestamp: Date;
  requestId: string;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
  };
}

// ============================================================================
// VISION AGENT
// ============================================================================

export namespace VisionAgent {
  export interface AnalyzeRequest {
    imageUrl?: string;
    imageBuffer?: Buffer;
    context?: {
      userHints?: string[];
      knownBrand?: string;
      knownCategory?: string;
    };
    options?: {
      includeVectorSearch?: boolean;
      confidenceThreshold?: number; // 0.0-1.0, default 0.6
    };
  }

  export interface ProductIdentification {
    name: string;
    brand: string;
    model: string;
    category: string;
    subcategory: string;
    confidence: number; // 0.0-1.0
  }

  export interface ProductAttributes {
    color?: string;
    size?: string;
    material?: string;
    style?: string;
    year?: number;
    weight?: string;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      unit: 'in' | 'cm';
    };
  }

  export interface VisualFeatures {
    dominantColors: string[]; // Hex color codes
    detectedText: string[];
    logoDetections: Array<{
      brand: string;
      confidence: number;
      boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }>;
  }

  export interface SimilarProduct {
    productId: string;
    similarity: number; // 0.0-1.0
    source: 'cache' | 'vector_search';
    matchedAttributes?: string[];
  }

  export interface Metadata {
    processingTime: number; // milliseconds
    modelVersion: string; // e.g., "claude-3-5-sonnet-20241022"
    imageQuality: 'excellent' | 'good' | 'acceptable' | 'poor';
    imageResolution?: {
      width: number;
      height: number;
    };
  }

  export interface AnalyzeResponse extends BaseResponse {
    productIdentification: ProductIdentification;
    attributes: ProductAttributes;
    visualFeatures: VisualFeatures;
    similarProducts: SimilarProduct[];
    metadata: Metadata;
  }
}

// ============================================================================
// CONDITION ASSESSOR AGENT
// ============================================================================

export namespace ConditionAssessor {
  export interface AssessRequest {
    imageUrls: string[];
    productCategory: string;
    productType: string;
    knownDefects?: string[];
    context?: {
      ageOfItem?: number; // years
      usageIntensity?: 'light' | 'moderate' | 'heavy';
    };
  }

  export type DefectType =
    | 'scratch'
    | 'dent'
    | 'stain'
    | 'tear'
    | 'missing_part'
    | 'wear'
    | 'discoloration'
    | 'crack'
    | 'chip'
    | 'rust'
    | 'fade';

  export type DefectSeverity = 'minor' | 'moderate' | 'major';

  export interface Defect {
    type: DefectType;
    severity: DefectSeverity;
    location: string; // e.g., "top left corner", "back panel"
    affectsValue: boolean;
    imageReference: number; // Index of image array showing defect
    description?: string;
  }

  export interface ElectronicsCondition {
    screenCondition: 'flawless' | 'minor_scratches' | 'noticeable_scratches' | 'cracked';
    functionalityEvidence: boolean;
    batteryHealth?: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
    portsCondition?: 'all_working' | 'some_damaged' | 'unknown';
    accessoriesIncluded?: string[];
  }

  export interface ClothingCondition {
    fabricCondition: 'like_new' | 'minimal_wear' | 'moderate_wear' | 'significant_wear';
    hasStains: boolean;
    hasTears: boolean;
    structuralIntegrity: 'excellent' | 'good' | 'compromised';
    zipper_buttons?: 'all_functional' | 'some_damaged' | 'broken';
    hemCondition?: 'intact' | 'frayed' | 'damaged';
  }

  export interface CollectiblesCondition {
    packageCondition?: 'sealed' | 'opened_mint' | 'opened_good' | 'damaged' | 'no_package';
    completeness: number; // 0.0-1.0 (percentage of original parts)
    authenticity: 'verified' | 'likely_authentic' | 'uncertain' | 'questionable';
    rarityIndicators?: string[];
    gradingRecommendation?: 'professional_grading_recommended' | 'not_needed';
  }

  export interface MarketplaceMapping {
    ebay: string; // eBay condition ID
    facebook: string;
    mercari: string;
  }

  export interface AssessResponse extends BaseResponse {
    overallGrade: Condition;
    confidence: number; // 0.0-1.0
    defects: Defect[];
    positiveAttributes: string[];
    categorySpecific?: {
      electronics?: ElectronicsCondition;
      clothing?: ClothingCondition;
      collectibles?: CollectiblesCondition;
    };
    marketplaceMapping: MarketplaceMapping;
    recommendedDisclosure: string;
    priceImpact: {
      baselineMultiplier: number; // e.g., 0.7 for "EXCELLENT" = 70% of new price
      defectDeduction: number; // Additional % deduction for defects
      finalMultiplier: number;
    };
  }
}

// ============================================================================
// MARKET INTELLIGENCE AGENT
// ============================================================================

export namespace MarketIntelligence {
  export interface ResearchRequest {
    product: {
      name: string;
      brand: string;
      model: string;
      category: string;
    };
    condition: Condition;
    marketplaces: Platform[];
    researchDepth?: 'quick' | 'standard' | 'deep';
    options?: {
      includeSoldListings?: boolean; // Default true
      timeRange?: 'week' | 'month' | 'quarter' | 'year';
      minSampleSize?: number; // Default 10
    };
  }

  export interface PriceStats {
    averagePrice: number;
    medianPrice: number;
    priceRange: {
      min: number;
      max: number;
    };
    standardDeviation: number;
    percentiles: {
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
  }

  export interface PricingAnalysis {
    platform: Platform;
    stats: PriceStats;
    recommendedPrice: number;
    confidence: number; // 0.0-1.0
    sampleSize: number;
    dataFreshness: Date;
    outlierPrices?: number[]; // Prices excluded from analysis
  }

  export interface Listing {
    platform: Platform;
    url: string;
    title: string;
    price: number;
    condition: string;
    listingAge: number; // days
    viewCount?: number;
    watcherCount?: number;
    sellerRating?: number;
    shippingCost?: number;
    isSold?: boolean;
    soldDate?: Date;
  }

  export interface DemandIndicators {
    recentSales: number; // Count in last 30 days
    averageDaysToSell: number;
    priceVelocity: 'rising' | 'stable' | 'falling';
    seasonalFactor?: number; // 1.0 = normal, >1.0 = high demand, <1.0 = low demand
  }

  export interface CompetitiveAnalysis {
    similarListings: Listing[];
    marketSaturation: 'low' | 'moderate' | 'high';
    demandIndicators: DemandIndicators;
    competitorCount: number;
    averageSellerRating: number;
  }

  export interface PricingStrategy {
    aggressive: number; // Price for quick sale (10-20% below market)
    competitive: number; // Market rate pricing
    premium: number; // Max value pricing (10-20% above market)
  }

  export interface StrategicInsights {
    bestPlatform: Platform;
    bestPlatformReason: string;
    optimalPricing: PricingStrategy;
    listingStrategy: string;
    seasonalFactors?: string;
    competitiveAdvantages?: string[];
    risks?: string[];
    estimatedTimeToSell: number; // days
  }

  export interface Metadata {
    scrapedUrls: string[];
    cacheHit: boolean;
    researchDuration: number; // milliseconds
    failedPlatforms?: Array<{
      platform: Platform;
      error: string;
    }>;
  }

  export interface ResearchResponse extends BaseResponse {
    pricingAnalysis: PricingAnalysis[];
    competitiveAnalysis: CompetitiveAnalysis;
    strategicInsights: StrategicInsights;
    metadata: Metadata;
  }
}

// ============================================================================
// DESCRIPTION OPTIMIZER AGENT
// ============================================================================

export namespace DescriptionOptimizer {
  export interface OptimizeRequest {
    product: VisionAgent.AnalyzeResponse;
    condition: ConditionAssessor.AssessResponse;
    marketData: MarketIntelligence.ResearchResponse;
    targetPlatform: Platform | 'all';
    options?: {
      tone?: 'professional' | 'casual' | 'enthusiastic';
      emphasize?: string[]; // Features to highlight
      languageLevel?: 'simple' | 'moderate' | 'technical';
      includeEmojis?: boolean;
    };
  }

  export interface EbayContent {
    title: string; // Max 80 chars
    subtitle?: string; // Max 55 chars
    description: string; // HTML allowed
    itemSpecifics: Record<string, string>;
    keywords: string[];
    categoryId?: string;
  }

  export interface FacebookContent {
    title: string;
    description: string; // Plain text, conversational
    tags: string[];
    location?: string;
  }

  export interface MercariContent {
    title: string; // Brand-first format
    description: string; // Plain text
    hashtags: string[];
    categoryId?: string;
  }

  export interface PlatformContent {
    ebay?: EbayContent;
    facebook?: FacebookContent;
    mercari?: MercariContent;
  }

  export interface SEOMetrics {
    keywordDensity: Record<string, number>;
    readabilityScore: number; // Flesch-Kincaid
    searchOptimization: number; // 0-100
    titleEffectiveness: number; // 0-100
    keywordCoverage: string[]; // Important keywords included
    missingKeywords: string[]; // Recommended keywords not included
  }

  export interface ComplianceCheck {
    platformCompliant: boolean;
    prohibitedKeywords: string[];
    requiredDisclosures: string[];
    suggestions: string[];
    policyViolations?: Array<{
      policy: string;
      violation: string;
      severity: 'low' | 'medium' | 'high';
    }>;
  }

  export interface OptimizeResponse extends BaseResponse {
    platformContent: PlatformContent;
    seoMetrics: SEOMetrics;
    complianceChecks: Record<Platform, ComplianceCheck>;
    recommendations: string[];
  }
}

// ============================================================================
// LISTING ORCHESTRATOR AGENT
// ============================================================================

export namespace ListingOrchestrator {
  export interface CreateListingRequest {
    product: VisionAgent.AnalyzeResponse;
    condition: ConditionAssessor.AssessResponse;
    pricing: MarketIntelligence.ResearchResponse;
    content: DescriptionOptimizer.OptimizeResponse;
    targetPlatforms: Array<{
      platform: Platform;
      priority: 'high' | 'medium' | 'low';
      customPrice?: number; // Override recommended price
    }>;
    publishStrategy: 'immediate' | 'scheduled' | 'draft';
    scheduledTime?: Date;
    options?: {
      enableAutoRelist?: boolean;
      duration?: number; // days
      quantity?: number;
      shippingProfile?: string;
    };
  }

  export interface PlatformResult {
    platform: Platform;
    status: 'success' | 'failed' | 'pending';
    listingId?: string;
    listingUrl?: string;
    sku?: string;
    error?: {
      code: string;
      message: string;
      retryable: boolean;
      retryAfter?: number; // seconds
    };
    platformMetadata?: {
      viewCount?: number;
      categoryPlacement?: string;
      estimatedVisibility?: 'high' | 'medium' | 'low';
    };
  }

  export interface RollbackPlan {
    affectedPlatforms: Platform[];
    rollbackStatus: 'not_needed' | 'in_progress' | 'completed' | 'failed';
    rollbackActions: Array<{
      platform: Platform;
      action: 'delete_listing' | 'delete_images' | 'cancel_draft';
      status: 'pending' | 'completed' | 'failed';
    }>;
  }

  export interface Metadata {
    totalDuration: number; // milliseconds
    platformLatencies: Record<Platform, number>;
    queuePosition?: number;
    retryCount?: number;
  }

  export interface CreateListingResponse extends BaseResponse {
    jobId: string;
    status: JobStatus;
    platformResults: PlatformResult[];
    rollbackPlan?: RollbackPlan;
    metadata: Metadata;
  }

  export interface GetJobStatusRequest {
    jobId: string;
  }

  export interface GetJobStatusResponse extends CreateListingResponse {
    progressPercentage: number; // 0-100
    currentStep?: string;
    estimatedTimeRemaining?: number; // seconds
  }
}

// ============================================================================
// ANALYTICS & EVENTS
// ============================================================================

export namespace Analytics {
  export type EventType =
    | 'product_analyzed'
    | 'condition_assessed'
    | 'market_researched'
    | 'description_generated'
    | 'listing_created'
    | 'listing_updated'
    | 'listing_sold'
    | 'listing_expired'
    | 'error_occurred';

  export interface Event {
    id: string;
    type: EventType;
    timestamp: Date;
    productId?: string;
    listingId?: string;
    platform?: Platform;
    data: Record<string, any>;
    metadata: {
      userId?: string;
      sessionId?: string;
      source: string;
    };
  }

  export interface Metrics {
    period: 'day' | 'week' | 'month' | 'year';
    startDate: Date;
    endDate: Date;
    data: {
      productsAnalyzed: number;
      listingsCreated: number;
      listingsSold: number;
      totalRevenue: number;
      averagePrice: number;
      conversionRate: number; // listings sold / listings created
      platformBreakdown: Record<Platform, {
        listingsCreated: number;
        sold: number;
        revenue: number;
        avgTimeToSell: number;
      }>;
      categoryBreakdown: Record<string, {
        count: number;
        avgPrice: number;
        sold: number;
      }>;
      performance: {
        avgVisionAnalysisTime: number;
        avgMarketResearchTime: number;
        avgListingCreationTime: number;
        errorRate: number;
        cacheHitRate: number;
      };
    };
  }
}

// ============================================================================
// WEBHOOK EVENTS
// ============================================================================

export namespace Webhooks {
  export type WebhookEvent =
    | 'listing.created'
    | 'listing.updated'
    | 'listing.sold'
    | 'listing.expired'
    | 'product.analyzed'
    | 'error.occurred';

  export interface WebhookPayload {
    event: WebhookEvent;
    timestamp: Date;
    data: any;
    signature: string; // HMAC signature for verification
  }

  export interface WebhookConfig {
    url: string;
    events: WebhookEvent[];
    secret: string;
    active: boolean;
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export namespace Health {
  export type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy';

  export interface ServiceHealth {
    service: string;
    status: ServiceStatus;
    latency?: number; // milliseconds
    uptime?: number; // seconds
    lastCheck: Date;
    details?: string;
  }

  export interface SystemHealth {
    overall: ServiceStatus;
    services: Record<string, ServiceHealth>;
    dependencies: {
      database: ServiceHealth;
      redis: ServiceHealth;
      messageQueue: ServiceHealth;
    };
    metrics: {
      cpuUsage: number; // percentage
      memoryUsage: number; // percentage
      diskUsage: number; // percentage
      activeConnections: number;
    };
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export namespace Config {
  export interface AgentConfig {
    maxConcurrency: number;
    timeout: number; // milliseconds
    retryPolicy: {
      maxRetries: number;
      backoffMs: number;
      backoffMultiplier: number;
    };
  }

  export interface VisionConfig extends AgentConfig {
    model: string;
    apiKey: string;
    maxImageSize: number; // bytes
    confidenceThreshold: number;
  }

  export interface MarketConfig extends AgentConfig {
    cacheEnabled: boolean;
    cacheTTL: number; // seconds
    maxScrapingDepth: number;
    platforms: Record<Platform, {
      enabled: boolean;
      maxListings: number;
      timeout: number;
    }>;
  }

  export interface SystemConfig {
    vision: VisionConfig;
    condition: AgentConfig;
    market: MarketConfig;
    description: AgentConfig;
    orchestrator: AgentConfig;
  }
}
