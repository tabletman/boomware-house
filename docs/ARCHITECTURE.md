# BOOMER Architecture
## Best Omnichannel Optimization & Marketplace Enhancement Robot

**Version**: 1.0.0
**Last Updated**: 2025-12-07
**Architecture Strategist**: Claude (Sonnet 4.5)

---

## 🎯 Executive Summary

BOOMER is a sophisticated multi-agent AI system designed to completely automate marketplace listing creation across eBay, Facebook Marketplace, and Mercari. It transforms simple product photos into optimized, multi-platform listings through intelligent vision analysis, market research, condition assessment, and adaptive pricing.

### Key Capabilities
- **Vision Intelligence**: Claude 3.5 Sonnet identifies products with 95%+ accuracy
- **Market Intelligence**: Real-time price analysis across platforms using Playwright scraping
- **Condition Assessment**: AI-powered visual inspection with confidence scoring
- **Multi-Marketplace Orchestration**: Concurrent listing to 3+ platforms
- **Adaptive Pricing**: Dynamic pricing based on market conditions and competition
- **Quality Gates**: Validation at each stage with rollback capability

### Performance Targets
- **Throughput**: 100+ items/hour (parallel processing)
- **Accuracy**: 95%+ product identification rate
- **Time-to-List**: <60 seconds per item per platform
- **Market Research**: Fresh pricing data (<24 hours old)
- **Uptime**: 99.5% availability with circuit breaker patterns

---

## 📐 System Architecture Overview

### Architecture Philosophy: Agent Swarm + Event-Driven Microservices

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BOOMER SYSTEM                               │
│                                                                      │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      │
│  │   Vision     │──┬──▶│   Market     │──┬──▶│  Listing     │      │
│  │   Agent      │  │   │ Intelligence │  │   │ Orchestrator │      │
│  └──────────────┘  │   │   Agent      │  │   └──────────────┘      │
│         │          │   └──────────────┘  │          │               │
│         ▼          │          │          │          ▼               │
│  ┌──────────────┐  │          ▼          │   ┌──────────────┐      │
│  │ Condition    │  │   ┌──────────────┐  │   │ eBay         │      │
│  │ Assessor     │──┘   │ Description  │──┘   │ Adapter      │      │
│  └──────────────┘      │ Optimizer    │      ├──────────────┤      │
│                        └──────────────┘      │ FB Market    │      │
│                                              │ Adapter      │      │
│                                              ├──────────────┤      │
│                                              │ Mercari      │      │
│                                              │ Adapter      │      │
│                                              └──────────────┘      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │              Shared Infrastructure Layer                 │       │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │       │
│  │  │ Redis   │  │Postgres │  │ Vector  │  │ BullMQ  │   │       │
│  │  │ Cache   │  │   DB    │  │  Store  │  │ Queues  │   │       │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │       │
│  └─────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
Image Drop → Vision Agent → [Product ID, Attributes, Category]
                ↓
         Condition Assessor → [Condition Score, Defects, Quality]
                ↓
      Market Intelligence → [Pricing Data, Competition, Trends]
                ↓
      Description Optimizer → [SEO Title, Rich Description, Keywords]
                ↓
    Listing Orchestrator → [Platform-Specific Payloads]
                ↓
         ┌────────┼────────┐
         ▼        ▼        ▼
      eBay    Facebook  Mercari
```

---

## 🤖 Agent Architecture (Microservices)

### 1. Vision Agent (`vision-agent`)

**Purpose**: Primary product identification and attribute extraction from images

**Technology Stack**:
- Claude 3.5 Sonnet (multimodal vision)
- TypeScript + Fastify
- Sharp (image preprocessing)
- pgvector (similar product cache)

**Inputs**:
```typescript
interface VisionRequest {
  imageUrl: string;
  imageBuffer?: Buffer;
  context?: {
    userHints?: string[];
    knownBrand?: string;
  };
}
```

**Outputs**:
```typescript
interface VisionResponse {
  productIdentification: {
    name: string;
    brand: string;
    model: string;
    category: string;
    subcategory: string;
    confidence: number; // 0.0-1.0
  };
  attributes: {
    color?: string;
    size?: string;
    material?: string;
    style?: string;
    year?: number;
  };
  visualFeatures: {
    dominantColors: string[];
    detectedText: string[];
    logoDetections: Array<{ brand: string; confidence: number }>;
  };
  similarProducts: Array<{
    productId: string;
    similarity: number;
    source: 'cache' | 'vector_search';
  }>;
  metadata: {
    processingTime: number;
    modelVersion: string;
    imageQuality: 'excellent' | 'good' | 'acceptable' | 'poor';
  };
}
```

**Architecture**:
```
┌─────────────────────────────────────────────────────┐
│              Vision Agent Service                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐    ┌──────────────┐              │
│  │ Image        │───▶│ Claude API   │              │
│  │ Preprocessor │    │ Client       │              │
│  └──────────────┘    └──────────────┘              │
│         │                    │                       │
│         ▼                    ▼                       │
│  ┌──────────────┐    ┌──────────────┐              │
│  │ Quality      │    │ Response     │              │
│  │ Validator    │    │ Parser       │              │
│  └──────────────┘    └──────────────┘              │
│                             │                        │
│                             ▼                        │
│                      ┌──────────────┐               │
│                      │ Vector       │               │
│                      │ Embeddings   │               │
│                      └──────────────┘               │
│                             │                        │
│                             ▼                        │
│                      ┌──────────────┐               │
│                      │ Similar      │               │
│                      │ Product      │               │
│                      │ Search       │               │
│                      └──────────────┘               │
└─────────────────────────────────────────────────────┘
```

**Key Algorithms**:

1. **Hierarchical Vision Analysis**:
   ```typescript
   async analyzeProduct(image: Buffer): Promise<VisionResponse> {
     // Phase 1: Quick category classification (cached)
     const quickCategory = await this.classifyCategory(image);

     // Phase 2: Detailed analysis with category-specific prompts
     const detailedAnalysis = await this.analyzeWithContext(image, quickCategory);

     // Phase 3: Vector similarity search for known products
     const similarProducts = await this.findSimilarProducts(detailedAnalysis);

     // Phase 4: Confidence scoring and validation
     return this.validateAndScore(detailedAnalysis, similarProducts);
   }
   ```

2. **Smart Prompt Engineering**:
   ```typescript
   const categoryPrompts = {
     electronics: `Identify: Brand, Model, Generation, Condition indicators (scratches, dents),
                   Screen condition, Button functionality visible, Accessories present`,
     clothing: `Identify: Brand, Size (check tags), Material, Color, Pattern, Style,
                Visible defects (stains, tears, pilling), Care label info`,
     collectibles: `Identify: Item type, Era/year, Manufacturer, Rarity indicators,
                    Condition (mint/near mint/good/fair/poor), Completeness, Authentication markers`
   };
   ```

**Performance Characteristics**:
- Latency: 2-5 seconds per image
- Throughput: 20 concurrent analyses
- Cache hit rate: 40% (for known products)
- Accuracy: 95%+ for common items, 80%+ for rare items

**Quality Gates**:
- ✅ Confidence >0.85 → Auto-approve
- ⚠️ Confidence 0.60-0.85 → Require human validation
- ❌ Confidence <0.60 → Reject with feedback

---

### 2. Condition Assessor Agent (`condition-assessor`)

**Purpose**: Automated visual condition grading with defect detection

**Technology Stack**:
- Claude 3.5 Sonnet (visual inspection)
- Custom defect detection models
- TypeScript + Fastify

**Inputs**:
```typescript
interface ConditionRequest {
  imageUrls: string[]; // Multiple angles
  productCategory: string;
  productType: string;
  knownDefects?: string[]; // From user input
}
```

**Outputs**:
```typescript
interface ConditionResponse {
  overallGrade: 'NEW' | 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'ACCEPTABLE' | 'POOR';
  confidence: number;
  defects: Array<{
    type: 'scratch' | 'dent' | 'stain' | 'tear' | 'missing_part' | 'wear' | 'discoloration';
    severity: 'minor' | 'moderate' | 'major';
    location: string;
    affectsValue: boolean;
    imageReference: number; // Index of image showing defect
  }>;
  positiveAttributes: string[]; // "Original packaging", "All accessories included"
  categorySpecific: {
    electronics?: {
      screenCondition: 'flawless' | 'minor_scratches' | 'noticeable_scratches';
      functionalityEvidence: boolean;
      batteryHealth?: 'excellent' | 'good' | 'unknown';
    };
    clothing?: {
      fabricCondition: 'like_new' | 'minimal_wear' | 'moderate_wear' | 'significant_wear';
      hasStains: boolean;
      hasTears: boolean;
      structuralIntegrity: 'excellent' | 'good' | 'compromised';
    };
    collectibles?: {
      packageCondition?: 'sealed' | 'opened' | 'damaged';
      completeness: number; // 0.0-1.0
      authenticity: 'verified' | 'likely_authentic' | 'uncertain';
    };
  };
  marketplaceMapping: {
    ebay: string; // "1000" (New), "3000" (Used)
    facebook: string;
    mercari: string;
  };
  recommendedDisclosure: string; // Required disclosure text
}
```

**Condition Grading Matrix**:
```typescript
const conditionMatrix = {
  NEW: {
    criteria: ['Unopened packaging', 'No signs of use', 'All original tags'],
    priceMultiplier: 1.0,
    marketplaceCompatibility: ['ebay', 'facebook', 'mercari']
  },
  LIKE_NEW: {
    criteria: ['Opened but unused', 'Perfect condition', 'All accessories'],
    priceMultiplier: 0.85,
    marketplaceCompatibility: ['ebay', 'facebook', 'mercari']
  },
  EXCELLENT: {
    criteria: ['Light use', 'No defects', 'Minimal wear'],
    priceMultiplier: 0.70,
    marketplaceCompatibility: ['ebay', 'facebook', 'mercari']
  },
  GOOD: {
    criteria: ['Moderate use', 'Minor defects', 'Fully functional'],
    priceMultiplier: 0.50,
    marketplaceCompatibility: ['ebay', 'facebook', 'mercari']
  },
  ACCEPTABLE: {
    criteria: ['Heavy use', 'Noticeable defects', 'Still usable'],
    priceMultiplier: 0.30,
    marketplaceCompatibility: ['facebook', 'mercari'] // Not recommended for eBay
  },
  POOR: {
    criteria: ['Significant damage', 'Parts/repair only'],
    priceMultiplier: 0.10,
    marketplaceCompatibility: ['facebook'] // Parts listings only
  }
};
```

**Visual Defect Detection Pipeline**:
```
Image Set → Multi-Angle Analysis → Defect Detection → Severity Scoring → Grade Calculation
     ↓                ↓                    ↓                  ↓                 ↓
  Zoom-in     Close-up review      Pattern matching    Impact analysis    Final grade
  analysis       of defects       (scratches, etc)     on marketability   with confidence
```

---

### 3. Market Intelligence Agent (`market-intelligence`)

**Purpose**: Real-time competitive pricing analysis and market trend detection

**Technology Stack**:
- Playwright (headless browser automation)
- Supabase pgvector (price history embeddings)
- Redis (cache layer, 24hr TTL)
- TypeScript + Fastify

**Inputs**:
```typescript
interface MarketResearchRequest {
  product: {
    name: string;
    brand: string;
    model: string;
    category: string;
  };
  condition: string;
  marketplaces: ('ebay' | 'facebook' | 'mercari')[];
  researchDepth: 'quick' | 'standard' | 'deep';
}
```

**Outputs**:
```typescript
interface MarketResearchResponse {
  pricingAnalysis: {
    platform: string;
    averagePrice: number;
    medianPrice: number;
    priceRange: { min: number; max: number; };
    recommendedPrice: number;
    confidence: number;
    sampleSize: number;
    dataFreshness: Date;
  }[];
  competitiveAnalysis: {
    similarListings: Array<{
      platform: string;
      url: string;
      title: string;
      price: number;
      condition: string;
      listingAge: number; // days
      viewCount?: number;
      sellerRating?: number;
    }>;
    marketSaturation: 'low' | 'moderate' | 'high';
    demandIndicators: {
      recentSales: number;
      averageDaysToSell: number;
      priceVelocity: 'rising' | 'stable' | 'falling';
    };
  };
  strategicInsights: {
    bestPlatform: string;
    optimalPricing: {
      aggressive: number; // Quick sale
      competitive: number; // Market rate
      premium: number; // Max value
    };
    listingStrategy: string; // "List on eBay at $X, FB at $Y for faster turnover"
    seasonalFactors?: string; // "Holiday demand +15%"
  };
  metadata: {
    scrapedUrls: string[];
    cacheHit: boolean;
    researchDuration: number;
  };
}
```

**Scraping Architecture**:
```
┌─────────────────────────────────────────────────────┐
│         Market Intelligence Service                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────┐          │
│  │    Playwright Scraping Engine         │          │
│  │  ┌────────┐  ┌────────┐  ┌────────┐ │          │
│  │  │ eBay   │  │Facebook│  │Mercari │ │          │
│  │  │Scraper │  │Scraper │  │Scraper │ │          │
│  │  └────────┘  └────────┘  └────────┘ │          │
│  └──────────────────────────────────────┘          │
│         │            │            │                  │
│         ▼            ▼            ▼                  │
│  ┌──────────────────────────────────────┐          │
│  │      Data Normalization Layer        │          │
│  └──────────────────────────────────────┘          │
│                     │                                │
│                     ▼                                │
│  ┌──────────────────────────────────────┐          │
│  │      Statistical Analysis Engine      │          │
│  │  • Outlier removal                    │          │
│  │  • Price distribution analysis        │          │
│  │  • Trend detection                    │          │
│  │  • Demand scoring                     │          │
│  └──────────────────────────────────────┘          │
│                     │                                │
│                     ▼                                │
│  ┌──────────────────────────────────────┐          │
│  │      Pricing Strategy Generator       │          │
│  └──────────────────────────────────────┘          │
│                     │                                │
│                     ▼                                │
│  ┌──────────────────────────────────────┐          │
│  │   Cache Layer (Redis 24hr TTL)       │          │
│  └──────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
```

**Scraping Strategies by Platform**:

1. **eBay Scraping**:
   ```typescript
   async scrapeEbay(query: string, condition: string): Promise<ListingData[]> {
     const page = await this.browser.newPage();

     // Search completed listings (actual sold prices)
     await page.goto(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&LH_Sold=1&LH_Complete=1`);

     // Extract: Title, Price, Sale Date, Condition, Shipping
     const listings = await page.$$eval('.s-item', items =>
       items.map(item => ({
         title: item.querySelector('.s-item__title')?.textContent,
         price: parseFloat(item.querySelector('.s-item__price')?.textContent),
         soldDate: item.querySelector('.s-item__endedDate')?.textContent,
         condition: item.querySelector('.SECONDARY_INFO')?.textContent,
         shipping: item.querySelector('.s-item__shipping')?.textContent,
         url: item.querySelector('.s-item__link')?.href
       }))
     );

     return this.normalizeEbayData(listings);
   }
   ```

2. **Facebook Marketplace Scraping**:
   ```typescript
   async scrapeFacebookMarketplace(query: string): Promise<ListingData[]> {
     // Challenge: Facebook heavily rate-limits and requires authentication
     // Solution: Rotate proxies, use authenticated sessions, respect rate limits

     const page = await this.authenticatedBrowser.newPage();
     await page.goto(`https://www.facebook.com/marketplace/search?query=${encodeURIComponent(query)}`);

     // Infinite scroll to load results
     await this.autoScroll(page, 50); // Load ~50 items

     // Extract visible listings
     const listings = await page.$$eval('[data-testid="marketplace-listing"]', items =>
       items.map(item => ({
         title: item.querySelector('span')?.textContent,
         price: parseFloat(item.querySelector('[data-testid="price"]')?.textContent.replace(/[^0-9.]/g, '')),
         location: item.querySelector('[data-testid="location"]')?.textContent,
         url: item.querySelector('a')?.href
       }))
     );

     return this.normalizeFacebookData(listings);
   }
   ```

3. **Mercari Scraping**:
   ```typescript
   async scrapeMercari(query: string): Promise<ListingData[]> {
     // Mercari has cleaner structure, easier to scrape
     const page = await this.browser.newPage();
     await page.goto(`https://www.mercari.com/search/?keyword=${encodeURIComponent(query)}`);

     const listings = await page.$$eval('[data-testid="item-cell"]', items =>
       items.map(item => ({
         title: item.querySelector('.item-name')?.textContent,
         price: parseFloat(item.querySelector('.item-price')?.textContent.replace(/[^0-9.]/g, '')),
         status: item.querySelector('.item-status')?.textContent, // Sold vs Active
         url: item.querySelector('a')?.href
       }))
     );

     return this.normalizeMercariData(listings);
   }
   ```

**Statistical Analysis**:
```typescript
interface PriceAnalysis {
  calculate(prices: number[]): PriceStats {
    // Remove outliers (beyond 2 standard deviations)
    const cleanedPrices = this.removeOutliers(prices);

    return {
      mean: this.mean(cleanedPrices),
      median: this.median(cleanedPrices),
      mode: this.mode(cleanedPrices),
      stdDev: this.standardDeviation(cleanedPrices),
      percentiles: {
        p25: this.percentile(cleanedPrices, 25),
        p50: this.percentile(cleanedPrices, 50),
        p75: this.percentile(cleanedPrices, 75),
        p90: this.percentile(cleanedPrices, 90)
      },
      confidence: this.calculateConfidence(cleanedPrices.length)
    };
  }
}
```

**Caching Strategy**:
```typescript
const cacheKeyStrategy = {
  // Cache key format: "market:${product_hash}:${condition}:${platform}"
  generateKey(product: Product, condition: string, platform: string): string {
    const productHash = this.hashProduct(product);
    return `market:${productHash}:${condition}:${platform}`;
  },

  // Cache TTL based on market velocity
  getTTL(category: string): number {
    const volatility = {
      electronics: 12 * 60 * 60, // 12 hours (fast-moving)
      clothing: 24 * 60 * 60,    // 24 hours (moderate)
      collectibles: 48 * 60 * 60 // 48 hours (slow-moving)
    };
    return volatility[category] || 24 * 60 * 60;
  }
};
```

**Performance Characteristics**:
- Latency: 15-45 seconds (with scraping), <1 second (cache hit)
- Throughput: 10 concurrent research tasks
- Cache hit rate: 60% (popular items)
- Data freshness: <24 hours guarantee

---

### 4. Description Optimizer Agent (`description-optimizer`)

**Purpose**: SEO-optimized, platform-specific listing content generation

**Technology Stack**:
- Claude 3.5 Sonnet (content generation)
- Custom SEO keyword engine
- TypeScript + Fastify

**Inputs**:
```typescript
interface DescriptionRequest {
  product: VisionResponse;
  condition: ConditionResponse;
  marketData: MarketResearchResponse;
  targetPlatform: 'ebay' | 'facebook' | 'mercari' | 'all';
  tone?: 'professional' | 'casual' | 'enthusiastic';
}
```

**Outputs**:
```typescript
interface DescriptionResponse {
  platformContent: {
    ebay?: {
      title: string; // Max 80 chars, keyword-optimized
      subtitle?: string; // Max 55 chars
      description: string; // HTML allowed
      itemSpecifics: Record<string, string>; // Brand, Model, Size, etc
      keywords: string[];
    };
    facebook?: {
      title: string; // More casual, searchable
      description: string; // Plain text, conversational
      tags: string[];
    };
    mercari?: {
      title: string; // Brand-first format
      description: string; // Plain text, hashtag-friendly
      hashtags: string[];
    };
  };
  seoMetrics: {
    keywordDensity: Record<string, number>;
    readabilityScore: number;
    searchOptimization: number; // 0-100
  };
  complianceChecks: {
    platformCompliant: boolean;
    prohibitedKeywords: string[];
    requiredDisclosures: string[];
  };
}
```

**Content Generation Pipeline**:
```
Product Data → Keyword Research → Template Selection → Content Generation → SEO Optimization → Platform Adaptation
      ↓               ↓                   ↓                    ↓                    ↓                 ↓
   Vision +      Competitor      Category-specific    Claude generation    Keyword density    Platform rules
   Condition     analysis        templates           with context          analysis           validation
   + Market      trending        (electronics vs                           readability
                 search terms    clothing, etc)
```

**Platform-Specific Templates**:

1. **eBay Title Optimization**:
   ```typescript
   const ebayTitleStrategy = {
     format: '[BRAND] [MODEL] [KEY_FEATURE] [CONDITION] [CATEGORY] [SIZE/VARIANT]',
     examples: {
       electronics: 'Apple iPhone 13 Pro 256GB Unlocked Excellent Graphite',
       clothing: 'Nike Air Jordan 1 Retro High OG Chicago Size 10.5 Used',
       collectibles: 'Pokémon Base Set Charizard Holo 1st Edition PSA 9 MINT'
     },
     rules: [
       'Front-load most important keywords',
       'Use exact brand/model spelling',
       'Include condition descriptor',
       'Add size/variant if applicable',
       'Use ALL CAPS sparingly (brand names only)'
     ]
   };
   ```

2. **eBay Description Structure**:
   ```html
   <!-- Generated HTML Template -->
   <div style="max-width: 800px; font-family: Arial;">
     <h1>🌟 [Product Name] - [Condition]</h1>

     <h2>📦 What's Included</h2>
     <ul>
       <li>✅ [Item 1]</li>
       <li>✅ [Item 2]</li>
     </ul>

     <h2>🔍 Condition Details</h2>
     <p>[AI-generated condition description]</p>

     <h2>📊 Specifications</h2>
     <table>
       <tr><td>Brand</td><td>[Brand]</td></tr>
       <tr><td>Model</td><td>[Model]</td></tr>
     </table>

     <h2>🚚 Shipping</h2>
     <p>[Shipping policy]</p>

     <h2>✨ Why Buy From Us</h2>
     <ul>
       <li>Fast shipping</li>
       <li>30-day returns</li>
       <li>Excellent seller rating</li>
     </ul>
   </div>
   ```

3. **Facebook Marketplace Style**:
   ```typescript
   const facebookStyle = {
     tone: 'conversational',
     format: `
   ${productName} - ${condition}

   ${emoji} Great deal! ${emoji}

   [2-3 sentence casual description]

   Details:
   • [Feature 1]
   • [Feature 2]
   • [Feature 3]

   ${conditionNotes}

   Pick up in [Location] or I can meet nearby. Message me!

   #${hashtags}
     `,
     example: `
   iPhone 13 Pro - Excellent Condition

   📱 Great deal! 📱

   Selling my iPhone 13 Pro in excellent condition. Upgraded to newer model.
   Always kept in case, screen protector since day one.

   Details:
   • 256GB storage
   • Graphite color
   • Unlocked - works with any carrier
   • Battery health 95%

   Minor wear on edges (see photos). Screen is perfect. Comes with original box
   and charging cable.

   Pick up in Downtown SF or I can meet nearby. Message me!

   #iPhone #iPhone13Pro #Apple #UnlockedPhone #SanFrancisco
     `
   };
   ```

4. **Mercari Optimization**:
   ```typescript
   const mercariStrategy = {
     titleFormat: '[BRAND] [Item] [Size/Variant] [Condition Emoji]',
     example: 'Nike Air Max 90 White Size 9 🔥',
     descriptionStyle: 'bullet_points_with_hashtags',
     template: `
   [Product name]

   ✨ Condition: ${condition}

   ${conditionDetails}

   📦 What You Get:
   • [Item 1]
   • [Item 2]

   🚀 Ships within 1 business day
   💯 Rated seller

   #${brand} #${category} #${keywords}
     `
   };
   ```

**SEO Keyword Research**:
```typescript
class SEOOptimizer {
  async generateKeywords(product: Product, marketData: MarketData): Promise<string[]> {
    // Primary keywords (exact match)
    const primary = [product.brand, product.model, product.category];

    // Secondary keywords (from competitor titles)
    const secondary = this.extractCompetitorKeywords(marketData.similarListings);

    // Long-tail keywords (natural language)
    const longtail = await this.generateLongTail(product);

    // Trending keywords (from market research)
    const trending = this.getTrendingKeywords(product.category);

    // Combine and score
    return this.scoreAndRank([...primary, ...secondary, ...longtail, ...trending]);
  }

  private extractCompetitorKeywords(listings: Listing[]): string[] {
    const titleWords = listings.flatMap(l => l.title.split(' '));
    const frequency = this.calculateFrequency(titleWords);
    return Object.entries(frequency)
      .filter(([word, count]) => count >= 3 && word.length > 3)
      .map(([word]) => word);
  }
}
```

**Compliance & Safety**:
```typescript
const prohibitedContent = {
  ebay: ['authentic', 'genuine', 'real' /* without proof */, 'replica', 'knockoff'],
  facebook: ['explosive', 'weapon', 'drug', 'alcohol', 'tobacco'],
  mercari: ['handmade', 'custom' /* requires verification */],

  checkCompliance(text: string, platform: string): ComplianceResult {
    const prohibited = this.prohibitedContent[platform];
    const violations = prohibited.filter(word =>
      new RegExp(`\\b${word}\\b`, 'i').test(text)
    );

    return {
      compliant: violations.length === 0,
      violations,
      suggestions: violations.map(v => this.getSuggestion(v))
    };
  }
};
```

---

### 5. Listing Orchestrator Agent (`listing-orchestrator`)

**Purpose**: Multi-platform listing coordination with atomic transactions

**Technology Stack**:
- TypeScript + Fastify
- BullMQ (job queues)
- Saga pattern (distributed transactions)
- Circuit breaker (fault tolerance)

**Inputs**:
```typescript
interface ListingRequest {
  product: VisionResponse;
  condition: ConditionResponse;
  pricing: MarketResearchResponse;
  content: DescriptionResponse;
  targetPlatforms: Array<{
    platform: 'ebay' | 'facebook' | 'mercari';
    priority: 'high' | 'medium' | 'low';
  }>;
  publishStrategy: 'immediate' | 'scheduled' | 'draft';
  scheduledTime?: Date;
}
```

**Outputs**:
```typescript
interface ListingResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'partial_success' | 'failed';
  platformResults: Array<{
    platform: string;
    status: 'success' | 'failed' | 'pending';
    listingId?: string;
    listingUrl?: string;
    error?: {
      code: string;
      message: string;
      retryable: boolean;
    };
  }>;
  rollbackPlan?: {
    affectedPlatforms: string[];
    rollbackStatus: 'not_needed' | 'in_progress' | 'completed';
  };
  metadata: {
    totalDuration: number;
    platformLatencies: Record<string, number>;
  };
}
```

**Orchestration Architecture**:
```
┌─────────────────────────────────────────────────────┐
│         Listing Orchestrator Service                 │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────┐          │
│  │      Job Queue Manager (BullMQ)       │          │
│  │  • Priority queues per platform       │          │
│  │  • Retry logic with backoff           │          │
│  │  • Dead letter queue                  │          │
│  └──────────────────────────────────────┘          │
│                     │                                │
│                     ▼                                │
│  ┌──────────────────────────────────────┐          │
│  │       Saga Coordinator                │          │
│  │  • Transaction orchestration          │          │
│  │  • Rollback management                │          │
│  │  • State tracking                     │          │
│  └──────────────────────────────────────┘          │
│         │           │           │                    │
│         ▼           ▼           ▼                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  eBay   │ │Facebook │ │Mercari  │              │
│  │ Adapter │ │ Adapter │ │ Adapter │              │
│  └─────────┘ └─────────┘ └─────────┘              │
│         │           │           │                    │
│         ▼           ▼           ▼                    │
│  ┌──────────────────────────────────────┐          │
│  │    Circuit Breaker Layer              │          │
│  │  • Failure detection                  │          │
│  │  • Auto-recovery                      │          │
│  │  • Health monitoring                  │          │
│  └──────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
```

**Saga Pattern Implementation**:
```typescript
class ListingSaga {
  private steps: SagaStep[] = [
    { name: 'validate', compensate: null },
    { name: 'uploadImages', compensate: 'deleteImages' },
    { name: 'createEbayListing', compensate: 'cancelEbayListing' },
    { name: 'createFacebookListing', compensate: 'cancelFacebookListing' },
    { name: 'createMercariListing', compensate: 'cancelMercariListing' },
    { name: 'notifyUser', compensate: null }
  ];

  async execute(request: ListingRequest): Promise<ListingResponse> {
    const executedSteps: string[] = [];

    try {
      for (const step of this.steps) {
        await this.executeStep(step, request);
        executedSteps.push(step.name);
      }

      return { status: 'completed', platformResults: [...] };

    } catch (error) {
      // Rollback in reverse order
      console.error(`Saga failed at step ${executedSteps.length}:`, error);
      await this.rollback(executedSteps.reverse(), request);

      return {
        status: 'failed',
        error,
        rollbackPlan: { affectedPlatforms: [...], rollbackStatus: 'completed' }
      };
    }
  }

  private async rollback(steps: string[], request: ListingRequest): Promise<void> {
    for (const stepName of steps) {
      const step = this.steps.find(s => s.name === stepName);
      if (step?.compensate) {
        try {
          await this.executeCompensation(step.compensate, request);
        } catch (compensateError) {
          console.error(`Compensation failed for ${stepName}:`, compensateError);
          // Log to dead letter queue for manual intervention
          await this.deadLetterQueue.add({ step: stepName, error: compensateError });
        }
      }
    }
  }
}
```

**Circuit Breaker Pattern**:
```typescript
class CircuitBreaker {
  private state: 'closed' | 'open' | 'half_open' = 'closed';
  private failures = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute

  async call<T>(fn: () => Promise<T>, platformName: string): Promise<T> {
    if (this.state === 'open') {
      throw new Error(`Circuit breaker OPEN for ${platformName}. Service unavailable.`);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'half_open') {
      this.state = 'closed';
      console.log('Circuit breaker closed - service recovered');
    }
  }

  private onFailure(): void {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'open';
      console.error(`Circuit breaker OPEN - ${this.failures} consecutive failures`);

      setTimeout(() => {
        this.state = 'half_open';
        console.log('Circuit breaker half-open - trying recovery');
      }, this.timeout);
    }
  }
}
```

**Platform Adapters**:

1. **eBay Adapter**:
```typescript
class EbayAdapter {
  async createListing(data: EbayListingData): Promise<EbayListingResult> {
    // Step 1: Upload images to eBay Picture Service (EPS)
    const imageUrls = await this.uploadImages(data.images);

    // Step 2: Create inventory item
    const inventoryItem = await this.ebayClient.sell.inventory.createOrReplaceInventoryItem({
      sku: data.sku,
      product: {
        title: data.title,
        description: data.description,
        aspects: data.itemSpecifics,
        imageUrls
      },
      condition: data.condition,
      availability: {
        shipToLocationAvailability: {
          quantity: data.quantity
        }
      }
    });

    // Step 3: Create offer (pricing)
    const offer = await this.ebayClient.sell.inventory.createOffer({
      sku: data.sku,
      marketplaceId: 'EBAY_US',
      format: 'FIXED_PRICE',
      pricingSummary: {
        price: {
          value: data.price.toString(),
          currency: 'USD'
        }
      },
      listingPolicies: {
        fulfillmentPolicyId: data.fulfillmentPolicyId,
        paymentPolicyId: data.paymentPolicyId,
        returnPolicyId: data.returnPolicyId
      },
      categoryId: data.categoryId
    });

    // Step 4: Publish listing
    const published = await this.ebayClient.sell.inventory.publishOffer(offer.offerId);

    return {
      listingId: published.listingId,
      listingUrl: `https://www.ebay.com/itm/${published.listingId}`,
      sku: data.sku,
      status: 'active'
    };
  }
}
```

2. **Facebook Marketplace Adapter**:
```typescript
class FacebookAdapter {
  async createListing(data: FacebookListingData): Promise<FacebookListingResult> {
    // Challenge: Facebook has no official Marketplace API for individual sellers
    // Solution: Use Graph API for business accounts OR Playwright automation

    // Option A: Graph API (for business accounts)
    if (this.hasBusinessAccount) {
      const response = await this.facebookClient.post('/marketplace_listings', {
        retailer_id: data.sku,
        title: data.title,
        description: data.description,
        price: data.price,
        currency: 'USD',
        availability: 'IN_STOCK',
        condition: data.condition,
        images: data.images.map(img => ({ url: img })),
        location: {
          latitude: data.location.lat,
          longitude: data.location.lng
        }
      });

      return {
        listingId: response.id,
        listingUrl: `https://facebook.com/marketplace/item/${response.id}`,
        status: 'active'
      };
    }

    // Option B: Playwright automation (for individual accounts)
    else {
      const page = await this.authenticatedBrowser.newPage();
      await page.goto('https://www.facebook.com/marketplace/create/item');

      // Fill form fields
      await page.fill('[name="title"]', data.title);
      await page.fill('[name="description"]', data.description);
      await page.fill('[name="price"]', data.price.toString());
      await page.selectOption('[name="condition"]', data.condition);

      // Upload images
      const fileInput = await page.$('input[type="file"]');
      await fileInput.setInputFiles(data.imagePaths);

      // Submit listing
      await page.click('button[type="submit"]');
      await page.waitForURL(/marketplace\/item\/\d+/);

      const listingUrl = page.url();
      const listingId = listingUrl.match(/item\/(\d+)/)?.[1];

      return {
        listingId,
        listingUrl,
        status: 'active'
      };
    }
  }
}
```

3. **Mercari Adapter**:
```typescript
class MercariAdapter {
  async createListing(data: MercariListingData): Promise<MercariListingResult> {
    // Mercari uses Playwright automation (no public API)
    const page = await this.authenticatedBrowser.newPage();
    await page.goto('https://www.mercari.com/sell/');

    // Upload images (drag & drop)
    const fileInput = await page.$('input[type="file"]');
    await fileInput.setInputFiles(data.imagePaths);
    await page.waitForSelector('.photo-uploaded', { timeout: 10000 });

    // Fill listing details
    await page.fill('[name="name"]', data.title);
    await page.fill('[name="description"]', data.description);
    await page.selectOption('[name="category"]', data.categoryId);
    await page.selectOption('[name="condition"]', data.condition);
    await page.fill('[name="price"]', data.price.toString());

    // Shipping details
    await page.selectOption('[name="shipping_payer"]', 'seller'); // or 'buyer'
    await page.selectOption('[name="shipping_method"]', data.shippingMethod);

    // Submit
    await page.click('button[data-testid="submit-listing"]');
    await page.waitForURL(/item\/\w+/);

    const listingUrl = page.url();
    const listingId = listingUrl.match(/item\/(\w+)/)?.[1];

    return {
      listingId,
      listingUrl,
      status: 'active'
    };
  }
}
```

**Job Queue Architecture**:
```typescript
// BullMQ job processor
const listingQueue = new Queue('listing-jobs', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: 100,
    removeOnFail: 500
  }
});

const worker = new Worker('listing-jobs', async (job) => {
  const { platform, data } = job.data;

  // Platform-specific processing
  switch (platform) {
    case 'ebay':
      return await ebayAdapter.createListing(data);
    case 'facebook':
      return await facebookAdapter.createListing(data);
    case 'mercari':
      return await mercariAdapter.createListing(data);
  }
}, {
  connection: redisConnection,
  concurrency: 10 // Process 10 jobs concurrently
});

// Priority lanes
const priorityQueues = {
  high: new Queue('listing-high-priority'),
  medium: new Queue('listing-medium-priority'),
  low: new Queue('listing-low-priority')
};
```

---

## 🗄️ Database Architecture (Supabase PostgreSQL + pgvector)

### Schema Design

```sql
-- Products table (source of truth)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Vision analysis results
  product_name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  category VARCHAR(100),
  subcategory VARCHAR(100),
  vision_confidence DECIMAL(3,2), -- 0.00-1.00

  -- Attributes (JSONB for flexibility)
  attributes JSONB, -- {color, size, material, year, etc}
  visual_features JSONB, -- {dominantColors, detectedText, logos}

  -- Image storage
  image_urls TEXT[], -- Array of image URLs
  primary_image_url TEXT,

  -- Vector embedding for similarity search
  embedding vector(1536) -- OpenAI ada-002 dimensions
);

-- Index for vector similarity search
CREATE INDEX ON products USING ivfflat (embedding vector_cosine_ops);

-- Conditions table
CREATE TABLE product_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  assessed_at TIMESTAMPTZ DEFAULT NOW(),

  overall_grade VARCHAR(20) NOT NULL, -- NEW, LIKE_NEW, EXCELLENT, etc
  confidence DECIMAL(3,2),

  -- Defect details (JSONB)
  defects JSONB, -- [{type, severity, location, imageReference}]
  positive_attributes TEXT[],
  category_specific JSONB,

  -- Marketplace mappings
  ebay_condition_id VARCHAR(10),
  facebook_condition VARCHAR(50),
  mercari_condition VARCHAR(50),

  -- Disclosure text
  recommended_disclosure TEXT
);

-- Market intelligence cache
CREATE TABLE market_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,

  -- Product identification
  product_hash VARCHAR(64) UNIQUE, -- SHA-256 of product attributes
  search_query TEXT,
  category VARCHAR(100),
  condition VARCHAR(20),

  -- Platform-specific data
  platform VARCHAR(20), -- ebay, facebook, mercari

  -- Pricing analysis (JSONB)
  pricing_stats JSONB, -- {mean, median, min, max, stdDev, percentiles}
  sample_size INTEGER,

  -- Competitive listings
  similar_listings JSONB, -- Array of {url, title, price, condition, age}

  -- Market insights
  market_saturation VARCHAR(20), -- low, moderate, high
  demand_indicators JSONB, -- {recentSales, avgDaysToSell, priceVelocity}

  -- Strategic recommendations
  recommended_price DECIMAL(10,2),
  optimal_platform VARCHAR(20),

  -- Metadata
  scraped_urls TEXT[],
  research_duration INTEGER -- milliseconds
);

-- Index for fast cache lookups
CREATE INDEX idx_market_data_hash ON market_data(product_hash, platform);
CREATE INDEX idx_market_data_expiry ON market_data(expires_at);

-- Auto-delete expired cache entries
CREATE OR REPLACE FUNCTION delete_expired_market_data()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM market_data WHERE expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_expired_market_data
AFTER INSERT ON market_data
EXECUTE FUNCTION delete_expired_market_data();

-- Listings table (multi-platform tracking)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  platform VARCHAR(20) NOT NULL, -- ebay, facebook, mercari
  platform_listing_id VARCHAR(100),
  listing_url TEXT,

  -- Listing content
  title VARCHAR(255),
  description TEXT,

  -- Pricing
  price DECIMAL(10,2),
  original_price DECIMAL(10,2), -- For tracking price changes

  -- Status tracking
  status VARCHAR(20), -- draft, active, sold, cancelled, expired
  published_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,

  -- Platform-specific data
  platform_metadata JSONB -- {itemSpecifics, categoryId, shipping, etc}
);

-- Index for multi-platform queries
CREATE INDEX idx_listings_product ON listings(product_id);
CREATE INDEX idx_listings_platform ON listings(platform, status);

-- Jobs table (async task tracking)
CREATE TABLE listing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  job_type VARCHAR(50), -- vision_analysis, market_research, create_listing
  status VARCHAR(20), -- queued, processing, completed, failed

  product_id UUID REFERENCES products(id),

  -- Job data
  input_data JSONB,
  result_data JSONB,
  error_data JSONB,

  -- Retry tracking
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  next_retry_at TIMESTAMPTZ,

  -- Performance metrics
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER
);

-- Index for job queue processing
CREATE INDEX idx_jobs_status ON listing_jobs(status, next_retry_at);

-- Analytics table (business intelligence)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  event_type VARCHAR(50), -- product_analyzed, listing_created, item_sold
  product_id UUID REFERENCES products(id),
  listing_id UUID REFERENCES listings(id),

  -- Event data
  event_data JSONB,

  -- Metrics
  processing_time_ms INTEGER,
  success BOOLEAN
);

-- Index for analytics queries
CREATE INDEX idx_analytics_type ON analytics_events(event_type, created_at);
CREATE INDEX idx_analytics_product ON analytics_events(product_id);

-- Materialized view for dashboard metrics
CREATE MATERIALIZED VIEW dashboard_metrics AS
SELECT
  DATE(created_at) as date,
  COUNT(*) FILTER (WHERE event_type = 'listing_created') as listings_created,
  COUNT(*) FILTER (WHERE event_type = 'item_sold') as items_sold,
  AVG(processing_time_ms) FILTER (WHERE event_type = 'product_analyzed') as avg_analysis_time,
  SUM((event_data->>'price')::DECIMAL) FILTER (WHERE event_type = 'item_sold') as total_revenue
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Refresh materialized view daily
CREATE OR REPLACE FUNCTION refresh_dashboard_metrics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW dashboard_metrics;
END;
$$ LANGUAGE plpgsql;

-- User preferences table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Platform credentials (encrypted)
  ebay_credentials JSONB, -- {appId, certId, devId, token}
  facebook_credentials JSONB,
  mercari_credentials JSONB,

  -- Default settings
  default_platforms TEXT[], -- ['ebay', 'facebook']
  default_pricing_strategy VARCHAR(20), -- aggressive, competitive, premium
  default_shipping_profile UUID,

  -- Preferences
  auto_publish BOOLEAN DEFAULT FALSE,
  require_approval BOOLEAN DEFAULT TRUE,
  notification_preferences JSONB
);
```

### Vector Similarity Search

```typescript
// Find similar products using pgvector
async function findSimilarProducts(
  embedding: number[],
  limit: number = 10
): Promise<Product[]> {
  const { data, error } = await supabase.rpc('match_products', {
    query_embedding: embedding,
    match_threshold: 0.8,
    match_count: limit
  });

  return data;
}

-- SQL function for vector similarity
CREATE OR REPLACE FUNCTION match_products(
  query_embedding vector(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  product_name VARCHAR,
  brand VARCHAR,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    products.id,
    products.product_name,
    products.brand,
    1 - (products.embedding <=> query_embedding) as similarity
  FROM products
  WHERE 1 - (products.embedding <=> query_embedding) > match_threshold
  ORDER BY products.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 📊 System Integration & Data Flow

### End-to-End Workflow

```
1. Image Drop (File Watcher)
         ↓
2. Vision Agent → Product Identification
         ↓
3. Parallel Processing:
   ├─ Condition Assessor → Grade + Defects
   ├─ Market Intelligence → Pricing + Competition
   └─ Description Optimizer → SEO Content
         ↓
4. Listing Orchestrator → Multi-Platform Publishing
         ↓
5. Platform Adapters:
   ├─ eBay Adapter → eBay API
   ├─ Facebook Adapter → FB Graph API / Playwright
   └─ Mercari Adapter → Playwright Automation
         ↓
6. Analytics Tracking → Dashboard Metrics
```

### Message Queue Architecture (BullMQ)

```typescript
// Queue topology
const queues = {
  vision: new Queue('vision-analysis'),
  condition: new Queue('condition-assessment'),
  market: new Queue('market-research'),
  description: new Queue('description-generation'),
  listing: new Queue('listing-orchestration'),

  // Platform-specific queues
  ebay: new Queue('ebay-publishing'),
  facebook: new Queue('facebook-publishing'),
  mercari: new Queue('mercari-publishing')
};

// Job flow with dependencies
async function processNewProduct(imagePath: string) {
  // Step 1: Vision analysis (blocking)
  const visionJob = await queues.vision.add('analyze', { imagePath });
  const visionResult = await visionJob.waitUntilFinished();

  // Step 2: Parallel processing (non-blocking)
  const [conditionJob, marketJob, descriptionJob] = await Promise.all([
    queues.condition.add('assess', {
      imageUrls: visionResult.imageUrls,
      category: visionResult.category
    }),
    queues.market.add('research', {
      product: visionResult,
      platforms: ['ebay', 'facebook', 'mercari']
    }),
    queues.description.add('generate', {
      product: visionResult
    })
  ]);

  // Step 3: Wait for parallel jobs
  const [conditionResult, marketResult, descriptionResult] = await Promise.all([
    conditionJob.waitUntilFinished(),
    marketJob.waitUntilFinished(),
    descriptionJob.waitUntilFinished()
  ]);

  // Step 4: Orchestrate listing (with saga pattern)
  const listingJob = await queues.listing.add('create', {
    product: visionResult,
    condition: conditionResult,
    market: marketResult,
    content: descriptionResult,
    platforms: ['ebay', 'facebook', 'mercari']
  });

  return listingJob;
}
```

### Event-Driven Architecture

```typescript
// Event bus using Redis pub/sub
class EventBus {
  private redis: Redis;

  async publish(event: string, data: any): Promise<void> {
    await this.redis.publish(event, JSON.stringify(data));
  }

  subscribe(event: string, handler: (data: any) => void): void {
    this.redis.subscribe(event);
    this.redis.on('message', (channel, message) => {
      if (channel === event) {
        handler(JSON.parse(message));
      }
    });
  }
}

// Event-driven workflow
eventBus.subscribe('product.analyzed', async (data) => {
  // Trigger parallel processing
  await Promise.all([
    conditionAgent.assess(data),
    marketAgent.research(data),
    descriptionAgent.generate(data)
  ]);
});

eventBus.subscribe('listing.completed', async (data) => {
  // Track analytics
  await analytics.track({
    event: 'listing_created',
    product_id: data.productId,
    platform: data.platform,
    price: data.price
  });

  // Notify user
  await notifications.send({
    type: 'success',
    message: `Listing created on ${data.platform}: ${data.listingUrl}`
  });
});
```

---

## 🚀 Deployment Architecture

### Container Architecture (Docker)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Core services
  vision-agent:
    build: ./services/vision-agent
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G

  condition-assessor:
    build: ./services/condition-assessor
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - DATABASE_URL=${DATABASE_URL}
    deploy:
      replicas: 2

  market-intelligence:
    build: ./services/market-intelligence
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
    deploy:
      replicas: 5 # High concurrency for scraping
      resources:
        limits:
          memory: 2G

  description-optimizer:
    build: ./services/description-optimizer
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - DATABASE_URL=${DATABASE_URL}
    deploy:
      replicas: 2

  listing-orchestrator:
    build: ./services/listing-orchestrator
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - EBAY_APP_ID=${EBAY_APP_ID}
      - EBAY_CERT_ID=${EBAY_CERT_ID}
      - EBAY_DEV_ID=${EBAY_DEV_ID}
    deploy:
      replicas: 3

  # Infrastructure
  postgres:
    image: ankane/pgvector:latest
    environment:
      - POSTGRES_DB=boomer
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  # API Gateway
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3000:3000"
    environment:
      - SERVICES_URL=http://vision-agent:8080,http://condition-assessor:8080
    depends_on:
      - vision-agent
      - condition-assessor
      - market-intelligence
      - description-optimizer
      - listing-orchestrator

volumes:
  postgres_data:
  redis_data:
```

### Kubernetes Architecture (Production)

```yaml
# k8s/deployments/vision-agent.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vision-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vision-agent
  template:
    metadata:
      labels:
        app: vision-agent
    spec:
      containers:
      - name: vision-agent
        image: boomer/vision-agent:latest
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        env:
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: boomer-secrets
              key: anthropic-api-key
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: boomer-secrets
              key: database-url
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: vision-agent-service
spec:
  selector:
    app: vision-agent
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vision-agent-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vision-agent
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Load Balancing Strategy

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │   (NGINX/HAProxy)│
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌─────────┐    ┌─────────┐    ┌─────────┐
       │ Vision  │    │ Vision  │    │ Vision  │
       │ Agent 1 │    │ Agent 2 │    │ Agent 3 │
       └─────────┘    └─────────┘    └─────────┘

Round-robin with health checks
Sticky sessions for multi-part uploads
Circuit breaker for failed instances
```

---

## 📈 Testing Strategy

### Test Pyramid

```
                    ┌─────────┐
                    │   E2E   │  10% - Full workflow tests
                    └─────────┘
                  ┌─────────────┐
                  │ Integration │  30% - Agent communication
                  └─────────────┘
              ┌─────────────────────┐
              │   Unit Tests        │  60% - Individual components
              └─────────────────────┘
```

### Unit Tests (Jest + TypeScript)

```typescript
// vision-agent.test.ts
describe('VisionAgent', () => {
  let visionAgent: VisionAgent;

  beforeEach(() => {
    visionAgent = new VisionAgent({
      anthropicApiKey: 'test-key',
      vectorStore: mockVectorStore
    });
  });

  describe('analyzeProduct', () => {
    it('should identify product with high confidence', async () => {
      const mockImage = Buffer.from('fake-image-data');
      const result = await visionAgent.analyzeProduct(mockImage);

      expect(result.productIdentification.confidence).toBeGreaterThan(0.8);
      expect(result.productIdentification.name).toBeDefined();
      expect(result.productIdentification.brand).toBeDefined();
    });

    it('should handle low quality images', async () => {
      const lowQualityImage = Buffer.from('blurry-image');
      const result = await visionAgent.analyzeProduct(lowQualityImage);

      expect(result.metadata.imageQuality).toBe('poor');
      expect(result.productIdentification.confidence).toBeLessThan(0.6);
    });

    it('should find similar products from cache', async () => {
      const knownProductImage = Buffer.from('iphone-13-pro');
      mockVectorStore.search.mockResolvedValue([
        { productId: 'known-123', similarity: 0.95 }
      ]);

      const result = await visionAgent.analyzeProduct(knownProductImage);

      expect(result.similarProducts).toHaveLength(1);
      expect(result.similarProducts[0].similarity).toBeGreaterThan(0.9);
    });
  });
});
```

### Integration Tests (Playwright + Testcontainers)

```typescript
// market-intelligence.integration.test.ts
describe('Market Intelligence Integration', () => {
  let postgresContainer: StartedTestContainer;
  let redisContainer: StartedTestContainer;
  let marketAgent: MarketIntelligenceAgent;

  beforeAll(async () => {
    // Start test containers
    postgresContainer = await new PostgreSqlContainer('ankane/pgvector:latest')
      .withDatabase('test_boomer')
      .start();

    redisContainer = await new GenericContainer('redis:7-alpine')
      .withExposedPorts(6379)
      .start();

    marketAgent = new MarketIntelligenceAgent({
      databaseUrl: postgresContainer.getConnectionUri(),
      redisUrl: `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`
    });
  });

  afterAll(async () => {
    await postgresContainer.stop();
    await redisContainer.stop();
  });

  it('should scrape eBay and cache results', async () => {
    const result = await marketAgent.research({
      product: { name: 'iPhone 13 Pro', brand: 'Apple' },
      condition: 'EXCELLENT',
      marketplaces: ['ebay']
    });

    expect(result.pricingAnalysis).toHaveLength(1);
    expect(result.pricingAnalysis[0].sampleSize).toBeGreaterThan(5);

    // Verify cache
    const cached = await marketAgent.research({
      product: { name: 'iPhone 13 Pro', brand: 'Apple' },
      condition: 'EXCELLENT',
      marketplaces: ['ebay']
    });

    expect(cached.metadata.cacheHit).toBe(true);
  });
});
```

### E2E Tests (Cypress)

```typescript
// e2e/full-workflow.cy.ts
describe('Full Listing Workflow', () => {
  it('should process image and create multi-platform listings', () => {
    // Step 1: Upload image
    cy.visit('http://localhost:3000');
    cy.get('input[type="file"]').attachFile('iphone-13-pro.jpg');

    // Step 2: Wait for vision analysis
    cy.contains('Product Identified', { timeout: 10000 });
    cy.contains('iPhone 13 Pro');

    // Step 3: Verify condition assessment
    cy.contains('Condition: Excellent');
    cy.contains('Confidence: 95%');

    // Step 4: Check pricing recommendations
    cy.contains('Recommended Price: $699');
    cy.contains('eBay: $710');
    cy.contains('Facebook: $690');

    // Step 5: Review generated content
    cy.get('[data-testid="ebay-title"]').should('contain', 'Apple iPhone 13 Pro');
    cy.get('[data-testid="description"]').should('contain', 'Excellent Condition');

    // Step 6: Publish to platforms
    cy.get('[data-testid="select-platforms"]').click();
    cy.get('[data-testid="ebay-checkbox"]').check();
    cy.get('[data-testid="facebook-checkbox"]').check();
    cy.get('[data-testid="publish-button"]').click();

    // Step 7: Verify success
    cy.contains('Listings Created Successfully', { timeout: 60000 });
    cy.get('[data-testid="ebay-listing-url"]').should('be.visible');
    cy.get('[data-testid="facebook-listing-url"]').should('be.visible');
  });
});
```

### Load Testing (k6)

```javascript
// load-tests/vision-agent.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% requests < 5s
    http_req_failed: ['rate<0.05'],    // <5% error rate
  },
};

export default function () {
  const image = open('../test-images/iphone-13-pro.jpg', 'b');

  const res = http.post('http://localhost:8080/analyze', {
    image: http.file(image, 'iphone.jpg'),
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'analysis completed': (r) => JSON.parse(r.body).productIdentification !== undefined,
    'confidence > 0.8': (r) => JSON.parse(r.body).productIdentification.confidence > 0.8,
  });

  sleep(1);
}
```

---

## 🔒 Security Architecture

### Authentication & Authorization

```typescript
// JWT-based authentication
interface AuthToken {
  userId: string;
  roles: ('admin' | 'user')[];
  platforms: ('ebay' | 'facebook' | 'mercari')[];
  exp: number;
}

// Role-based access control (RBAC)
const permissions = {
  admin: ['*'],
  user: [
    'product:analyze',
    'product:list',
    'listing:create',
    'listing:read',
    'listing:update',
    'listing:delete'
  ]
};

// Middleware for route protection
async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthToken;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Permission checking
function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions = req.user.roles.flatMap(role => permissions[role]);

    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
}
```

### Data Encryption

```typescript
// Encrypt sensitive credentials before storing
class CredentialEncryption {
  private algorithm = 'aes-256-gcm';
  private key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

  encrypt(data: any): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(JSON.stringify(data), 'utf8'),
      cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return {
      encrypted: encrypted.toString('hex'),
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData: EncryptedData): any {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData.encrypted, 'hex')),
      decipher.final()
    ]);

    return JSON.parse(decrypted.toString('utf8'));
  }
}
```

### Rate Limiting

```typescript
// Redis-based rate limiter
class RateLimiter {
  constructor(private redis: Redis) {}

  async checkLimit(
    userId: string,
    endpoint: string,
    limit: number,
    window: number
  ): Promise<boolean> {
    const key = `ratelimit:${userId}:${endpoint}`;
    const current = await this.redis.incr(key);

    if (current === 1) {
      await this.redis.expire(key, window);
    }

    return current <= limit;
  }
}

// Apply rate limits per endpoint
const rateLimits = {
  '/api/analyze': { limit: 100, window: 3600 },      // 100/hour
  '/api/research': { limit: 50, window: 3600 },      // 50/hour
  '/api/listings': { limit: 200, window: 86400 }     // 200/day
};
```

### Input Validation & Sanitization

```typescript
// Zod schemas for validation
import { z } from 'zod';

const VisionRequestSchema = z.object({
  imageUrl: z.string().url().optional(),
  imageBuffer: z.instanceof(Buffer).optional(),
  context: z.object({
    userHints: z.array(z.string()).optional(),
    knownBrand: z.string().optional()
  }).optional()
}).refine(
  data => data.imageUrl || data.imageBuffer,
  { message: 'Either imageUrl or imageBuffer must be provided' }
);

// Validation middleware
function validateRequest<T>(schema: z.Schema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
  };
}
```

---

## 📊 Monitoring & Observability

### Metrics Collection (Prometheus)

```typescript
// Custom metrics
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

const registry = new Registry();

// Business metrics
const listingsCreated = new Counter({
  name: 'boomer_listings_created_total',
  help: 'Total number of listings created',
  labelNames: ['platform', 'category'],
  registers: [registry]
});

const visionAnalysisDuration = new Histogram({
  name: 'boomer_vision_analysis_duration_seconds',
  help: 'Duration of vision analysis',
  labelNames: ['category'],
  buckets: [0.5, 1, 2, 5, 10],
  registers: [registry]
});

const marketResearchCacheHitRate = new Gauge({
  name: 'boomer_market_cache_hit_rate',
  help: 'Cache hit rate for market research',
  registers: [registry]
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});
```

### Distributed Tracing (OpenTelemetry)

```typescript
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

const provider = new NodeTracerProvider();
const exporter = new JaegerExporter({
  endpoint: 'http://jaeger:14268/api/traces'
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

// Trace entire workflow
async function processProductWithTracing(imagePath: string) {
  const tracer = trace.getTracer('boomer');

  return tracer.startActiveSpan('process-product', async (span) => {
    span.setAttribute('image.path', imagePath);

    try {
      const visionResult = await tracer.startActiveSpan('vision-analysis', async (visionSpan) => {
        const result = await visionAgent.analyze(imagePath);
        visionSpan.setAttribute('confidence', result.confidence);
        visionSpan.end();
        return result;
      });

      // ... more traced operations

      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

### Logging Strategy (Structured Logging)

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'boomer' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Contextual logging
logger.info('Product analyzed', {
  productId: 'abc-123',
  category: 'electronics',
  confidence: 0.95,
  duration: 2.3
});
```

### Alerting Rules (Prometheus Alertmanager)

```yaml
# alerting-rules.yml
groups:
  - name: boomer_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: rate(boomer_errors_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}% over last 5 minutes"

      # Slow vision analysis
      - alert: SlowVisionAnalysis
        expr: histogram_quantile(0.95, boomer_vision_analysis_duration_seconds) > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Vision analysis is slow"
          description: "95th percentile latency is {{ $value }}s"

      # Low cache hit rate
      - alert: LowCacheHitRate
        expr: boomer_market_cache_hit_rate < 0.4
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Market research cache hit rate is low"
          description: "Cache hit rate is {{ $value }}%"
```

---

## 🎯 Performance Optimization Strategies

### 1. Caching Layers

```
┌─────────────────────────────────────────┐
│         Multi-Layer Cache Strategy       │
├─────────────────────────────────────────┤
│                                          │
│  L1: In-Memory (Node.js)                │
│  └─ TTL: 5 minutes                      │
│  └─ Size: 100 MB                        │
│  └─ Hit rate target: 30%                │
│                                          │
│  L2: Redis (Distributed)                │
│  └─ TTL: 24 hours                       │
│  └─ Size: 10 GB                         │
│  └─ Hit rate target: 60%                │
│                                          │
│  L3: PostgreSQL (Persistent)            │
│  └─ TTL: 7 days                         │
│  └─ Size: Unlimited                     │
│  └─ Hit rate target: 90%                │
│                                          │
└─────────────────────────────────────────┘
```

### 2. Connection Pooling

```typescript
// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,              // Max connections
  min: 5,               // Min connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Redis connection pool
const redisPool = new RedisPool({
  min: 2,
  max: 10,
  acquireTimeoutMillis: 3000
});
```

### 3. Image Optimization

```typescript
// Compress and resize images before processing
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();
}

// Lazy loading for multiple images
async function* processImagesStream(imagePaths: string[]) {
  for (const path of imagePaths) {
    const buffer = await fs.readFile(path);
    const optimized = await optimizeImage(buffer);
    yield optimized;
  }
}
```

### 4. Database Query Optimization

```sql
-- Create indexes for common queries
CREATE INDEX CONCURRENTLY idx_products_category_brand
ON products(category, brand);

CREATE INDEX CONCURRENTLY idx_listings_status_platform
ON listings(status, platform, created_at DESC);

CREATE INDEX CONCURRENTLY idx_market_data_composite
ON market_data(product_hash, platform, expires_at);

-- Materialized views for analytics
CREATE MATERIALIZED VIEW top_selling_categories AS
SELECT
  category,
  COUNT(*) as total_listings,
  COUNT(*) FILTER (WHERE status = 'sold') as sold_count,
  AVG(price) as avg_price
FROM products p
JOIN listings l ON p.id = l.product_id
GROUP BY category
ORDER BY sold_count DESC;

-- Refresh strategy
CREATE OR REPLACE FUNCTION refresh_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY top_selling_categories;
  REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_metrics;
END;
$$ LANGUAGE plpgsql;
```

### 5. Parallel Processing

```typescript
// Process batches in parallel
async function processBatch(items: string[], batchSize: number = 10) {
  const batches = chunk(items, batchSize);

  for (const batch of batches) {
    await Promise.all(
      batch.map(item => processItem(item))
    );
  }
}

// Worker threads for CPU-intensive tasks
import { Worker } from 'worker_threads';

function runInWorker(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./image-processor-worker.js', {
      workerData: data
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy BOOMER

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: ankane/pgvector:latest
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type checking
        run: npm run typecheck

      - name: Run unit tests
        run: npm run test:unit
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: npm run test:integration

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push images
        run: |
          docker buildx bake -f docker-compose.yml --push

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to Kubernetes
        uses: azure/k8s-deploy@v4
        with:
          manifests: |
            k8s/deployments/*.yaml
          images: |
            boomer/vision-agent:${{ github.sha }}
            boomer/market-intelligence:${{ github.sha }}
          kubectl-version: 'latest'
```

---

## 📚 API Contracts

### REST API Specification (OpenAPI 3.0)

```yaml
openapi: 3.0.0
info:
  title: BOOMER API
  version: 1.0.0
  description: Multi-marketplace listing automation API

paths:
  /api/products/analyze:
    post:
      summary: Analyze product from image
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                image:
                  type: string
                  format: binary
                userHints:
                  type: array
                  items:
                    type: string
      responses:
        '200':
          description: Analysis complete
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VisionResponse'

  /api/listings/create:
    post:
      summary: Create multi-platform listing
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ListingRequest'
      responses:
        '202':
          description: Listing job queued
          content:
            application/json:
              schema:
                type: object
                properties:
                  jobId:
                    type: string
                  status:
                    type: string

  /api/listings/{jobId}:
    get:
      summary: Get listing job status
      parameters:
        - name: jobId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Job status
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListingResponse'

components:
  schemas:
    VisionResponse:
      type: object
      properties:
        productIdentification:
          type: object
          properties:
            name:
              type: string
            brand:
              type: string
            confidence:
              type: number

    ListingRequest:
      type: object
      properties:
        productId:
          type: string
        targetPlatforms:
          type: array
          items:
            type: string
            enum: [ebay, facebook, mercari]

    ListingResponse:
      type: object
      properties:
        jobId:
          type: string
        status:
          type: string
          enum: [queued, processing, completed, failed]
        platformResults:
          type: array
          items:
            type: object
            properties:
              platform:
                type: string
              status:
                type: string
              listingUrl:
                type: string
```

---

## 🎯 Success Metrics & KPIs

### Business Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Listing Success Rate** | >95% | (Successful listings / Total attempts) × 100 |
| **Time to List** | <60 seconds | Average time from image drop to live listing |
| **Multi-Platform Coverage** | 100% | All 3 platforms operational |
| **Price Accuracy** | ±10% of market | Compare recommended vs actual market rates |
| **User Satisfaction** | >4.5/5 | User feedback and ratings |

### Technical Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| **Vision Accuracy** | >95% | <90% |
| **API Uptime** | 99.5% | <99.0% |
| **Response Time (p95)** | <5s | >10s |
| **Cache Hit Rate** | >60% | <40% |
| **Error Rate** | <1% | >5% |
| **Job Success Rate** | >98% | <95% |

### Operational Metrics

```typescript
// Dashboard metrics calculation
const metrics = {
  async getSystemHealth(): Promise<HealthMetrics> {
    return {
      uptime: process.uptime(),
      cpu: os.loadavg()[0],
      memory: process.memoryUsage(),

      // Service health
      services: {
        vision: await this.checkServiceHealth('vision-agent'),
        market: await this.checkServiceHealth('market-intelligence'),
        listing: await this.checkServiceHealth('listing-orchestrator')
      },

      // Queue health
      queues: {
        vision: await queues.vision.getJobCounts(),
        market: await queues.market.getJobCounts(),
        listing: await queues.listing.getJobCounts()
      },

      // Database health
      database: {
        connections: await pool.totalCount,
        activeConnections: await pool.activeCount,
        idleConnections: await pool.idleCount
      }
    };
  }
};
```

---

## 🚀 Roadmap & Future Enhancements

### Phase 1: MVP (Months 1-3)
- ✅ Vision Agent with Claude 3.5 Sonnet
- ✅ Basic condition assessment
- ✅ eBay integration (primary platform)
- ✅ Simple market research (eBay only)
- ✅ Basic description generation

### Phase 2: Multi-Platform (Months 4-6)
- 🔄 Facebook Marketplace integration
- 🔄 Mercari integration
- 🔄 Advanced market intelligence (all platforms)
- 🔄 Platform-specific optimizations
- 🔄 Automated price adjustments

### Phase 3: Intelligence (Months 7-9)
- 📋 Machine learning price prediction models
- 📋 Historical trend analysis
- 📋 Seasonal demand forecasting
- 📋 Competitive intelligence dashboard
- 📋 A/B testing framework for descriptions

### Phase 4: Scale (Months 10-12)
- 📋 Bulk processing (100+ items/batch)
- 📋 Mobile app (iOS/Android)
- 📋 Chrome extension for browser integration
- 📋 API for third-party integrations
- 📋 White-label solutions

### Phase 5: Advanced Features (Year 2+)
- 📋 Video product analysis
- 📋 AR/VR product preview
- 📋 Automated inventory management
- 📋 Cross-border marketplace support
- 📋 AI-powered customer support chatbot
- 📋 Blockchain-based authenticity verification

---

## 📖 Conclusion

BOOMER represents a world-class architecture for multi-marketplace listing automation, leveraging:

1. **AI-First Design**: Claude 3.5 Sonnet powers vision, condition assessment, and content generation
2. **Agent Swarm Pattern**: Specialized microservices coordinate through event-driven architecture
3. **Production-Ready Infrastructure**: Kubernetes, Docker, PostgreSQL, Redis, BullMQ
4. **Quality Engineering**: Comprehensive testing, monitoring, and observability
5. **Scalable Foundation**: Horizontal scaling, caching layers, circuit breakers

This architecture provides the foundation for building the most powerful listing automation agent in existence, with clear paths for enhancement and scale.

---

**Next Steps**:
1. Review and approve architecture
2. Set up development environment
3. Implement Phase 1 (MVP)
4. Deploy to staging
5. Iterate based on metrics

**Questions? Concerns? Let's discuss and refine!** 🚀
