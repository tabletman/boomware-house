# Marketplace API Guide 2025

## eBay API Integration

### API Selection: Inventory API vs Trading API

**Use Inventory API (RESTful) for:**
- New implementations (2025+ projects)
- Modern OAuth 2.0 authentication
- Inventory-first listing management
- Multi-quantity listings
- Better rate limits (2M calls/day)

**Use Trading API (Traditional) only for:**
- Legacy system maintenance
- Existing listings created with Trading API
- Auth'N'Auth token integration

**⚠️ Critical Limitation:** Listings created with Inventory API cannot be managed with Trading API and vice versa. Choose your API at project start.

---

### Authentication

#### OAuth 2.0 (Recommended)

**Scopes Required:**
```javascript
const scopes = [
  'https://api.ebay.com/oauth/api_scope',
  'https://api.ebay.com/oauth/api_scope/sell.inventory',
  'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
  'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly'
];
```

**Implementation Example (Node.js):**
```javascript
import eBayApi from 'ebay-api';

const eBay = new eBayApi({
  appId: process.env.EBAY_APP_ID,        // Client ID
  certId: process.env.EBAY_CERT_ID,      // Client Secret
  devId: process.env.EBAY_DEV_ID,        // Required for Trading API
  sandbox: false,
  ruName: process.env.EBAY_RU_NAME,      // Redirect URL name
  autoRefreshToken: true,
  marketplaceId: eBayApi.MarketplaceId.EBAY_US,
  siteId: eBayApi.SiteId.EBAY_US
});

// Set scopes
eBay.OAuth2.setScope(scopes);

// Handle token refresh
eBay.OAuth2.on('refreshAuthToken', (token) => {
  // Store token in database
  saveTokenToDatabase(token);
});

// Use stored token
eBay.OAuth2.setCredentials(storedToken);
```

**Token Refresh Headers:**
```
X-EBAY-C-MARKETPLACE-ID: EBAY_US
Authorization: Bearer <access_token>
```

---

### Rate Limits & Batch Operations

#### Rate Limits (2025)

| API | Daily Limit | Monitoring Header |
|-----|-------------|-------------------|
| Inventory API | 2,000,000 | X-eBay-C-RateLimit-Remaining |
| Trading API | 5,000 (user tokens) | X-RateLimit-Remaining |
| OAuth Token | Varies by grant type | - |

**Monitor Rate Limits:**
```javascript
// Response headers include:
// X-eBay-C-RateLimit-Limit: 2000000
// X-eBay-C-RateLimit-Remaining: 1999500
// X-eBay-C-RateLimit-Reset: 1735689600

const checkRateLimit = (response) => {
  const remaining = response.headers['x-ebay-c-ratelimit-remaining'];
  const reset = response.headers['x-ebay-c-ratelimit-reset'];

  if (remaining < 1000) {
    console.warn(`Low rate limit: ${remaining} calls remaining`);
    scheduleReset(new Date(reset * 1000));
  }
};
```

#### Batch Operations

**Use batch operations to reduce API calls by 90%+:**

```javascript
// ❌ WRONG: 100 API calls
for (const item of items) {
  await eBay.sell.inventory.createOrReplaceInventoryItem(item.sku, item);
}

// ✅ RIGHT: 1 API call
await eBay.sell.inventory.bulkCreateOrReplaceInventoryItem({
  requests: items.map(item => ({
    sku: item.sku,
    product: item.product,
    condition: item.condition,
    availability: item.availability
  }))
});
```

---

### Image Upload Requirements

**Technical Specifications:**
- **Format:** JPG, JPEG, PNG, GIF, BMP, TIF
- **Size:** 500x500px minimum, 1600x1600px recommended
- **Max File Size:** 12MB per image
- **Max Images:** 24 per listing
- **Background:** White or neutral (recommended)
- **First Image:** Product-only, no text/watermarks

**Upload Methods:**

```javascript
// Method 1: Self-hosted URLs (fastest)
const offer = {
  sku: 'PROD-001',
  listingPolicies: { ... },
  pricingSummary: { ... },
  listingDescription: 'Product description',
  format: 'FIXED_PRICE',
  // Images must be publicly accessible
  imageUrls: [
    'https://yourdomain.com/images/prod-001-main.jpg',
    'https://yourdomain.com/images/prod-001-alt1.jpg'
  ]
};

// Method 2: eBay Picture Services (EPS)
// Upload via Trading API UploadSiteHostedPictures
const pictureData = fs.readFileSync('image.jpg').toString('base64');
const uploadResponse = await eBay.trading.UploadSiteHostedPictures({
  PictureData: pictureData,
  PictureName: 'product-image.jpg'
});
// Use uploadResponse.SiteHostedPictureDetails.FullURL
```

---

### Category Mapping & Product Specifics

#### Get Category Taxonomy

**⚠️ DEPRECATED:** `GetCategoryMappings` (decommissioned June 2, 2025)

**✅ Use Taxonomy API:**

```javascript
// Get active categories
const categories = await eBay.commerce.taxonomy.getCategoryTree('0', {
  category_tree_id: '0' // US marketplace
});

// Get category-specific item aspects
const aspects = await eBay.commerce.taxonomy.getItemAspectsForCategory(
  '9355', // Category ID
  { category_tree_id: '0' }
);

// Identify required fields
const requiredAspects = aspects.aspects.filter(
  aspect => aspect.aspectConstraint?.aspectRequired === true
);

console.log('Required:', requiredAspects.map(a => a.localizedAspectName));
// Example: ['Brand', 'Color', 'Size', 'Material']
```

#### Handle Item Specifics

```javascript
const createInventoryItem = {
  sku: 'SHIRT-001',
  product: {
    title: 'Vintage Band T-Shirt',
    description: 'Authentic vintage concert tee...',
    aspects: {
      'Brand': ['Generic'],           // Required
      'Color': ['Black'],             // Required
      'Size': ['Large'],              // Required
      'Material': ['100% Cotton'],    // Required
      'Sleeve Length': ['Short'],     // Optional
      'Fit': ['Regular']              // Optional
    },
    imageUrls: [...]
  },
  condition: 'USED_EXCELLENT'
};

// Validate before submission
const validateAspects = (aspects, requiredAspects) => {
  const missing = requiredAspects.filter(
    req => !aspects[req.localizedAspectName]
  );

  if (missing.length > 0) {
    throw new Error(`Missing required aspects: ${missing.join(', ')}`);
  }
};
```

---

### eBay Cassini Algorithm (Search Ranking)

**Ranking Factors (2025):**

1. **Relevance (40%)**
   - Title keywords match search queries
   - Complete item specifics
   - Accurate category selection
   - Up to 35% more impressions with complete data

2. **Performance Metrics (30%)**
   - Seller feedback score (98%+ recommended)
   - Defect rate (<1% required)
   - Fast shipping (<24hr handling preferred)
   - Return acceptance (required for top ranking)

3. **Sales History (20%)**
   - Click-through rate (CTR)
   - Conversion rate
   - Sales velocity
   - Multi-quantity listing consistency

4. **Operational Excellence (10%)**
   - Same-day/1-day handling time
   - Free shipping offered
   - Competitive pricing
   - Mobile optimization

**Optimization Checklist:**

```javascript
const listingOptimization = {
  title: {
    keywords: ['Front-loaded', 'Specific', 'No spam'],
    maxLength: 80,
    avoid: ['!!!', 'L@@K', 'MUST SEE']
  },

  itemSpecifics: {
    complete: true,
    required: ['Brand', 'Color', 'Size'],
    recommended: 'All available fields',
    multiValue: 'Use when applicable'
  },

  shipping: {
    handlingTime: 1, // days (same-day = best)
    freeShipping: true,
    tracking: 'always'
  },

  returns: {
    accepted: true,
    window: 30, // days minimum
    freeReturns: true // recommended
  },

  pricing: {
    competitive: true,
    method: 'market-based',
    avoid: 'race-to-bottom'
  }
};
```

**Promoted Listings Strategy:**

```javascript
// Use Promoted Listings to accelerate ranking
// Recommended: 2-5% ad rate for new listings

const promoteNewListing = async (listingId) => {
  // Wait for 48hrs of organic data
  await delay(48 * 60 * 60 * 1000);

  // Promote if CTR < 2%
  const stats = await getListingStats(listingId);

  if (stats.ctr < 0.02) {
    await eBay.sell.marketing.createAdsByInventoryReference({
      inventoryReferenceId: listingId,
      inventoryReferenceType: 'INVENTORY_ITEM',
      bidPercentage: '3.5' // Start at 3.5%
    });
  }
};
```

---

## Facebook Marketplace API

### Commerce Platform Access

**Partner Approval Required:**
- Meta Business Manager account
- Business verification completed
- Commerce Manager approved
- Partner API access granted

**Application Process:**
1. Create Meta Business Manager account
2. Submit business verification (EIN, address, domain)
3. Wait 3-14 days for approval
4. Apply for Commerce Platform partner status
5. Integrate Catalog API once approved

---

### Catalog Batch API

**Use Cases:**
- Large inventories (100+ items)
- Frequent inventory updates
- Automated product management
- Multi-channel sync

**Implementation:**

```javascript
// Create product catalog
const FB = require('facebook-nodejs-business-sdk');

const api = FB.FacebookAdsApi.init(accessToken);
const catalog = new FB.ProductCatalog(null, {
  business_id: businessId,
  name: 'My Product Catalog'
});

await catalog.create();

// Batch upload products (up to 5000 per batch)
const batch = {
  method: 'CREATE',
  data: products.map(p => ({
    id: p.sku,
    title: p.title,
    description: p.description,
    availability: p.inStock ? 'in stock' : 'out of stock',
    condition: p.condition.toLowerCase(),
    price: `${p.price} USD`,
    link: p.url,
    image_link: p.images[0],
    brand: p.brand,
    google_product_category: p.categoryId
  }))
};

await catalog.createBatch(batch);
```

---

### Image Requirements

**Technical Specifications:**
- **Format:** JPG, PNG
- **Size:** 500x500px minimum, 1024x1024px recommended
- **Aspect Ratio:** 1:1 (square) required
- **Max File Size:** 8MB
- **Background:** Solid color preferred (white best)
- **Content:** Product-only, no text overlays

**⚠️ Compliance:**
- No watermarks
- No promotional text
- No before/after images
- No multiple products (unless sold as set)

---

### Category Taxonomy

**Facebook Product Categories (Google Taxonomy):**

```javascript
const categoryMapping = {
  // Electronics
  'Electronics > Computers': 2082,
  'Electronics > Cell Phones': 267,

  // Apparel
  'Apparel > Men > Shirts': 212,
  'Apparel > Women > Dresses': 2271,

  // Home & Garden
  'Home > Furniture > Chairs': 436,
  'Home > Kitchen > Cookware': 668
};

// Get full taxonomy
const getCategory = (productType) => {
  // Use Google Product Category taxonomy
  return categoryMapping[productType] || 166; // Default: Miscellaneous
};
```

---

## Mercari API (Limited Availability)

### Authentication

**GraphQL API (Mercari Shops):**

```javascript
const MERCARI_API = 'https://api.mercari-shops.com/graphql';

// OpenID Connect (OIDC) authentication
const authenticate = async () => {
  const response = await fetch(`${OIDC_PROVIDER}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.MERCARI_CLIENT_ID,
      client_secret: process.env.MERCARI_CLIENT_SECRET,
      scope: 'products:write'
    })
  });

  return response.json();
};
```

---

### Product Listing

**Required Fields:**

```graphql
mutation CreateProduct {
  createProduct(input: {
    brandId: "123"
    categoryId: "456"
    condition: "LIKE_NEW"
    description: "Product description here..."
    imageUrls: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
    name: "Product Name"
    price: 2999  # cents
    shippingConfigurationId: "789"
    shippingDuration: "1_TO_2_DAYS"
    shippingFromStateId: "CA"
    shippingMethod: "USPS"
    shippingPayer: "SELLER"
    status: "DRAFT"
  }) {
    product {
      id
      status
    }
  }
}
```

---

### Authenticate Service Requirements

**High-Value Items:**
- Listings >$500: Authentication MAY be required
- Luxury brands: Authentication REQUIRED
- Designer handbags: Authentication REQUIRED
- Sneakers (select brands): Authentication REQUIRED

**Process:**
1. List item with Authenticate tag
2. Ship to Mercari authentication center
3. Wait 1-3 business days for verification
4. Item ships to buyer after approval

---

## API Integration Best Practices

### Error Handling

```javascript
class MarketplaceAPIClient {
  async makeRequest(endpoint, options, retries = 3) {
    try {
      const response = await fetch(endpoint, options);

      // Check rate limits
      this.checkRateLimit(response.headers);

      if (!response.ok) {
        throw new APIError(response);
      }

      return await response.json();

    } catch (error) {
      if (error.code === 'RATE_LIMIT_EXCEEDED' && retries > 0) {
        const retryAfter = error.retryAfter || 60;
        await this.delay(retryAfter * 1000);
        return this.makeRequest(endpoint, options, retries - 1);
      }

      if (error.code === 'INVALID_TOKEN') {
        await this.refreshToken();
        return this.makeRequest(endpoint, options, retries - 1);
      }

      throw error;
    }
  }

  checkRateLimit(headers) {
    const remaining = parseInt(headers.get('x-ratelimit-remaining'));
    const reset = parseInt(headers.get('x-ratelimit-reset'));

    if (remaining < 100) {
      this.logger.warn(`Low rate limit: ${remaining} calls remaining`);
      this.scheduleBackoff(reset);
    }
  }
}
```

---

### Common Pitfalls

**1. Invalid Token Errors (401)**
```javascript
// ❌ WRONG: Hardcoded expired token
const token = 'expired_token_from_6_months_ago';

// ✅ RIGHT: Auto-refresh tokens
eBay.OAuth2.on('refreshAuthToken', saveToken);
eBay.OAuth2.setCredentials(loadToken());
```

**2. Missing Required Fields**
```javascript
// ❌ WRONG: Incomplete item specifics
const item = {
  title: 'T-Shirt',
  price: 20
  // Missing: Brand, Color, Size (required)
};

// ✅ RIGHT: Validate before submission
await validateRequiredAspects(categoryId, item);
```

**3. Image URL Issues**
```javascript
// ❌ WRONG: Non-public image URLs
imageUrls: ['file:///local/image.jpg']
imageUrls: ['https://private-bucket.s3.amazonaws.com/image.jpg']

// ✅ RIGHT: Public HTTPS URLs
imageUrls: ['https://cdn.yoursite.com/products/image.jpg']
```

**4. Parallel Request Limits**
```javascript
// ❌ WRONG: Too many concurrent requests
await Promise.all(items.map(uploadItem)); // 1000 items = 1000 requests

// ✅ RIGHT: Batch + throttle
const batches = chunk(items, 100);
for (const batch of batches) {
  await bulkUpload(batch);
  await delay(1000); // Rate limit friendly
}
```

**5. Category Selection**
```javascript
// ❌ WRONG: Using deprecated categories
categoryId: '12345' // Category deprecated in 2024

// ✅ RIGHT: Use Taxonomy API to get current categories
const currentCategory = await getCategoryMapping(oldCategoryId);
```

---

### Monitoring & Logging

```javascript
const monitoring = {
  // Track API health
  logApiCall: (endpoint, duration, status) => {
    metrics.record('api.call', {
      endpoint,
      duration,
      status,
      timestamp: Date.now()
    });
  },

  // Monitor rate limits
  trackRateLimit: (service, remaining, limit) => {
    const usage = ((limit - remaining) / limit) * 100;

    if (usage > 80) {
      alerts.send('Rate limit warning', { service, usage });
    }
  },

  // Log errors with context
  logError: (error, context) => {
    logger.error({
      message: error.message,
      code: error.code,
      stack: error.stack,
      context,
      timestamp: Date.now()
    });
  }
};
```

---

## Testing Recommendations

### Sandbox Testing

```javascript
// Always test in sandbox first
const eBaySandbox = new eBayApi({
  appId: process.env.EBAY_SANDBOX_APP_ID,
  certId: process.env.EBAY_SANDBOX_CERT_ID,
  sandbox: true, // ⚠️ Critical flag
  marketplaceId: eBayApi.MarketplaceId.EBAY_US
});

// Test complete workflow
describe('eBay Integration', () => {
  it('creates inventory item', async () => {
    const result = await eBaySandbox.sell.inventory
      .createOrReplaceInventoryItem('TEST-SKU-001', testItem);
    expect(result).toBeDefined();
  });

  it('creates offer', async () => {
    const offer = await eBaySandbox.sell.inventory
      .createOffer(testOffer);
    expect(offer.offerId).toBeDefined();
  });

  it('publishes listing', async () => {
    const listing = await eBaySandbox.sell.inventory
      .publishOffer(offerId);
    expect(listing.listingId).toBeDefined();
  });
});
```

---

## Migration Checklist

**eBay Trading API → Inventory API:**

- [ ] Review API compatibility (cannot mix APIs for same listings)
- [ ] Update authentication to OAuth 2.0
- [ ] Map Trading API fields to Inventory API entities
- [ ] Implement batch operations for efficiency
- [ ] Update category selection to Taxonomy API
- [ ] Test image upload workflow
- [ ] Verify item specifics validation
- [ ] Monitor rate limits in production
- [ ] Set up token refresh handling
- [ ] Document API version dependencies

---

## Resources

- [eBay Developer Program](https://developer.ebay.com/)
- [eBay Inventory API Docs](https://developer.ebay.com/api-docs/sell/inventory/overview.html)
- [Facebook Commerce Platform](https://developers.facebook.com/docs/commerce-platform/)
- [Mercari Shops API](https://api.mercari-shops.com/docs/)
- [eBay API Node.js Client](https://github.com/hendt/ebay-api)
