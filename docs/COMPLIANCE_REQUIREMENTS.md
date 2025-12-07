# Marketplace Compliance Requirements 2025

## eBay Commerce Policies

### Prohibited Items

**Weapons & Dangerous Goods:**
- Firearms, ammunition, gun parts
- Explosives, fireworks, incendiary devices
- Pepper spray, tasers, stun guns
- Hazardous materials (chemicals, radioactive materials)

**Drugs & Medical:**
- Prescription drugs, controlled substances
- Drug paraphernalia
- Medical devices requiring FDA approval
- COVID-19 test kits (unless FDA approved)

**Counterfeit & Intellectual Property:**
- Replica, counterfeit, or fake items
- Unauthorized copies of media (DVDs, software)
- Items violating trademark/copyright (VeRO program)
- Unauthorized brand merchandise

**Alcohol & Tobacco:**
- Alcoholic beverages
- Tobacco products, e-cigarettes, vaping products
- CBD products (restrictions vary by state)

**Adult Content:**
- Pornographic material
- Adult services
- Used underwear/intimate apparel

**Other Restricted:**
- Event tickets above face value (in certain states)
- Gift cards (strict requirements)
- Lock-picking devices
- Police badges, government IDs
- Human body parts, grave-related items

---

### eBay VeRO Program (Verified Rights Owner)

**How It Works:**
1. Brand owners register with VeRO
2. Monitor eBay for unauthorized use
3. Report violations directly to eBay
4. eBay removes listings within 24hrs

**Compliance Strategy:**

```javascript
const veroCompliance = {
  // Check before listing
  isAuthorized: async (brand) => {
    const veroList = await getVeroParticipants();

    if (veroList.includes(brand)) {
      // Requires authorization
      return await verifyAuthorization(brand);
    }

    return true;
  },

  // Avoid these phrases
  avoidKeywords: [
    'replica',
    'inspired by',
    'AAA quality',
    'similar to',
    'designer style'
  ],

  // Required for branded items
  requireProof: [
    'Receipt from authorized retailer',
    'Certificate of authenticity',
    'Authorized dealer documentation'
  ]
};
```

**High-Risk Brands (2025):**
- Louis Vuitton, Gucci, Chanel (luxury fashion)
- Apple, Samsung (electronics)
- Nike, Adidas (sportswear)
- LEGO, Disney (toys/entertainment)
- Rolex, Omega (watches)

---

### Authenticity Guarantee

**Required For:**
- Watches >$2,000
- Handbags >$500 (select brands)
- Sneakers >$100 (select brands)
- Trading cards >$250
- Jewelry >$750

**Process:**
1. Seller lists eligible item
2. Item sells, ships to authentication center
3. Expert authenticates (2-3 business days)
4. Ships to buyer with certificate
5. Seller paid after authentication

**Implementation:**

```javascript
const requiresAuthentication = (item) => {
  const rules = {
    watches: item.price >= 2000,
    handbags: item.price >= 500 && luxuryBrands.includes(item.brand),
    sneakers: item.price >= 100 && sneakerBrands.includes(item.brand),
    tradingCards: item.price >= 250,
    jewelry: item.price >= 750
  };

  return rules[item.category] || false;
};

// Add authentication tag to listing
if (requiresAuthentication(item)) {
  item.listingPolicies.ebayPlusIfEligible = true;
  item.tags = ['AUTHENTICITY_GUARANTEE'];
}
```

---

### Sales Tax Collection

**eBay Collects Sales Tax (Marketplace Facilitator Laws):**

All US states require marketplace tax collection as of 2025. eBay automatically:
- Calculates tax based on buyer location
- Collects at checkout
- Remits to state governments
- Provides tax reports to sellers

**Seller Responsibilities:**

```javascript
const taxCompliance = {
  // Still required in some states
  stateTaxID: {
    california: 'Required for CA residents',
    texas: 'Required for TX residents',
    // Check state-specific requirements
  },

  // Report eBay's tax collection
  yearEndReporting: {
    form1099K: 'If >$5000 in sales (2024+)',
    scheduleCRevenue: 'Include gross sales',
    scheduleCExpenses: 'Tax already collected shown separately'
  },

  // International sales
  vatCompliance: {
    uk: 'eBay collects VAT for UK buyers',
    eu: 'eBay collects VAT via IOSS',
    australia: 'GST collected by eBay'
  }
};
```

---

## Facebook Marketplace Policies

### Prohibited Items (Comprehensive List)

**Absolutely Prohibited:**

**1. Adult Products & Services**
- Adult toys and sexual enhancement products
- Used underwear/intimate apparel
- Dating services, escort services
- Pornographic content
- Live video chat services

**2. Alcohol**
- Beer, wine, liquor
- Home-brewing kits (in some regions)
- Empty alcohol bottles (sometimes flagged)

**3. Animals**
- Live animals (all types)
- Animal parts (ivory, fur, exotic skins)
- Preserved/taxidermy animals
- Breeding services

**4. Digital Products**
- Digital downloads (music, movies, ebooks)
- Software licenses
- Digital gift cards
- Streaming service accounts
- Social media accounts

**5. Drugs & Medical**
- Prescription medications
- Illegal drugs, controlled substances
- CBD products (all states)
- Ingestible supplements making health claims
- Medical devices requiring approval
- Contact lenses

**6. Explosives & Hazardous Materials**
- Fireworks, firecrackers
- Ammunition, gunpowder
- Flammable liquids
- Chemicals, pesticides
- Airbags

**7. Financial Products**
- Credit cards, debit cards
- Lottery tickets, raffle tickets
- Stocks, bonds, securities

**8. Recalled Items**
- Any item on safety recall list
- Car seats >6 years old
- Cribs not meeting current standards
- Children's products with lead paint

**9. Tobacco**
- Cigarettes, cigars, chewing tobacco
- E-cigarettes, vaping products
- Hookah, tobacco pipes
- Rolling papers (sometimes flagged)

**10. Weapons**
- Firearms, gun parts
- Ammunition, magazines
- BB guns, airsoft guns
- Pepper spray, stun guns
- Knives marketed as weapons
- Brass knuckles, nunchucks

**11. Services (All Types)**
- Cleaning services
- Landscaping services
- Pet sitting
- Tutoring
- Any service-based offering

**12. Real Estate**
- Land, property
- Timeshares
- Rental listings (use Facebook Housing)

**13. Healthcare/Medical**
- Used medical equipment
- Contact lenses
- Teeth whitening products
- Thermometers (during COVID)
- Opened cosmetics

---

### AI Content Moderation

**Facebook's AI Scans For:**

```javascript
const aiModeration = {
  // Keyword triggers (auto-flag)
  prohibitedWords: [
    'gun', 'firearm', 'ammo',
    'prescription', 'rx', 'pills',
    'vape', 'tobacco', 'cbd',
    'alcohol', 'liquor', 'beer',
    'paypal', 'venmo', 'cashapp', // Payment outside FB
    'replica', 'fake', 'bootleg'
  ],

  // Image recognition
  imageFlags: [
    'Weapons in photos',
    'Alcohol bottles visible',
    'Pharmaceutical packaging',
    'Adult content detection',
    'Brand logo counterfeits'
  ],

  // Behavioral patterns
  suspiciousActivity: [
    'Multiple listings removed',
    'High listing velocity (>20/hour)',
    'External payment requests',
    'Shipping to flagged regions',
    'Duplicate content across accounts'
  ]
};
```

**Avoiding False Positives:**

```javascript
const listingBestPractices = {
  // For children's toys/games
  avoidWords: [
    'gun' → use 'blaster', 'launcher'
    'war' → use 'battle', 'combat'
  ],

  // For kitchen items
  avoidWords: [
    'shot glass' → use 'small glass', 'espresso cup'
  ],

  // For collectibles
  avoidWords: [
    'antique gun' → 'vintage firearm replica' (still risky)
  ],

  // General
  tips: [
    'Avoid ALL-CAPS',
    'No emojis in title',
    'Clear, accurate photos',
    'Detailed, honest descriptions',
    'Proper categorization'
  ]
};
```

---

### Account Penalties

**Warning System:**
1. **First Violation:** Warning message
2. **Second Violation:** 24-hour listing ban
3. **Third Violation:** 7-day marketplace ban
4. **Fourth+ Violations:** Permanent ban from Facebook Marketplace

**Additional Consequences:**
- Commerce Manager access revoked
- Instagram Shopping disabled
- Facebook Business Suite restrictions
- Possible account suspension (entire Facebook)

---

### Appeal Process

```javascript
const appealProcess = {
  steps: [
    '1. Click "Request Review" in notification',
    '2. Explain why listing complies with policies',
    '3. Provide evidence (receipts, documentation)',
    '4. Wait 24-48 hours for review'
  ],

  successTips: [
    'Be specific and factual',
    'Attach supporting documents',
    'Reference specific policy compliance',
    'Remain professional and concise'
  ],

  // If appeal denied
  nextSteps: [
    'Do NOT relist immediately',
    'Review Commerce Policies thoroughly',
    'Adjust listing to comply',
    'Wait 7 days before relisting'
  ]
};
```

---

## Mercari Compliance

### Prohibited Items

**Mercari-Specific Restrictions:**

**1. Cosmetics & Personal Care**
- Used makeup, brushes, applicators
- Opened skincare products
- Used razors, tweezers
- Expired products

**2. Health & Safety**
- Recalled items (check CPSC.gov)
- Counterfeit items
- Items missing safety labels
- Car seats, cribs (age restrictions)

**3. Digital/Intangible**
- Digital goods, downloads
- Services
- Coupons, vouchers (some exceptions)

**4. Weapons (Strict)**
- Even replica/toy weapons
- Airsoft guns
- Knife blades >3 inches
- Self-defense items

**5. Handmade Restrictions**
- Items with copyrighted characters
- Unauthorized brand merchandise
- Disney, Marvel, sports teams without license

---

### Authenticate Program

**Mandatory Authentication:**

**Handbags:**
- Chanel: ALL listings
- Louis Vuitton: >$500
- Gucci: >$500
- Hermès: ALL listings
- Prada, YSL, Dior: >$500

**Sneakers:**
- Air Jordan: Select models
- Yeezy: ALL listings
- Nike Off-White: ALL listings
- Dunk SB: Select colorways

**Watches:**
- Rolex: ALL listings
- Omega: >$1,000
- Cartier: >$1,000

**Process:**
```javascript
const authenticateRequired = (item) => {
  const mandatoryBrands = {
    handbags: ['Chanel', 'Hermès'],
    sneakers: ['Yeezy', 'Off-White'],
    watches: ['Rolex']
  };

  const priceThresholds = {
    handbags: { 'Louis Vuitton': 500, 'Gucci': 500 },
    watches: { 'Omega': 1000, 'Cartier': 1000 }
  };

  // Check mandatory
  if (mandatoryBrands[item.category]?.includes(item.brand)) {
    return { required: true, reason: 'Mandatory brand' };
  }

  // Check price threshold
  const threshold = priceThresholds[item.category]?.[item.brand];
  if (threshold && item.price >= threshold) {
    return { required: true, reason: `Price ≥ $${threshold}` };
  }

  return { required: false };
};
```

**Seller Cost:**
- Free for items <$500
- $15 fee for items ≥$500

---

## Cross-Platform Compliance Strategy

### Unified Prohibited Items Check

```javascript
class ComplianceChecker {
  constructor() {
    this.platforms = {
      ebay: new eBayCompliance(),
      facebook: new FacebookCompliance(),
      mercari: new MercariCompliance()
    };
  }

  async checkItem(item, targetPlatforms) {
    const results = {};

    for (const platform of targetPlatforms) {
      const checker = this.platforms[platform];

      results[platform] = {
        allowed: await checker.isAllowed(item),
        restrictions: await checker.getRestrictions(item),
        requiresAuthentication: await checker.needsAuth(item),
        warnings: await checker.getWarnings(item)
      };
    }

    return results;
  }

  // Get strictest common denominator
  getSafestListing(item, platforms) {
    const checks = this.checkItem(item, platforms);

    // Return all restrictions
    return {
      canList: Object.values(checks).every(c => c.allowed),
      title: this.sanitizeTitle(item.title, checks),
      description: this.sanitizeDescription(item.description, checks),
      images: this.validateImages(item.images, checks),
      requiresAuth: Object.values(checks).some(c => c.requiresAuthentication)
    };
  }
}
```

---

### Brand Compliance Database

```javascript
const brandCompliance = {
  // VeRO participants (eBay)
  veroProtected: [
    'Apple', 'Nike', 'Louis Vuitton', 'Chanel',
    'Disney', 'LEGO', 'Adobe', 'Microsoft'
  ],

  // Requires authentication
  authenticateRequired: {
    ebay: {
      watches: ['Rolex', 'Omega', 'Cartier', 'Patek Philippe'],
      handbags: ['Louis Vuitton', 'Chanel', 'Hermès', 'Gucci'],
      sneakers: ['Nike', 'Adidas', 'Yeezy']
    },
    mercari: {
      handbags: ['Chanel', 'Hermès'],
      sneakers: ['Yeezy', 'Off-White']
    }
  },

  // Frequently counterfeited (high risk)
  highRisk: [
    'Supreme', 'Bape', 'Off-White',
    'Ray-Ban', 'Oakley',
    'UGG', 'Canada Goose',
    'Tiffany & Co', 'Cartier'
  ],

  // Requires proof of authenticity
  proofRequired: [
    'Luxury handbags >$500',
    'Designer watches >$1000',
    'Limited edition sneakers',
    'Precious jewelry',
    'Collectible trading cards >$250'
  ]
};
```

---

### Content Moderation Checklist

**Before Listing:**

- [ ] Item not on prohibited list (any platform)
- [ ] No recalled items (check CPSC.gov)
- [ ] All brand names spelled correctly (not "Louie Vuitton")
- [ ] No trigger keywords in title/description
- [ ] Images show actual item (not stock photos for used items)
- [ ] No watermarks, text overlays, or promotional content on images
- [ ] Price reasonable (not suspiciously low for brand)
- [ ] Proper category selection
- [ ] Complete item specifics/attributes
- [ ] Honest condition description
- [ ] Clear photos from multiple angles
- [ ] Authentication documentation ready (if applicable)

**Title Optimization:**
```javascript
const titleCompliance = {
  // ✅ GOOD
  good: [
    'Vintage Nike Air Max 90 Size 10 White Blue',
    'Sony PlayStation 5 Console Disc Version New',
    'Anthropologie Dress Size Medium Floral'
  ],

  // ❌ BAD (AI flags)
  bad: [
    'LOUIS VUITTON HANDBAG AAA QUALITY!!!',
    'Nike Shoes - LOOK!!!! MUST SEE!!!!',
    'iPhone - CHEAPEST PRICE - FREE SHIPPING!!!',
    'Designer Inspired Bag Similar to Gucci'
  ],

  rules: {
    noAllCaps: true,
    noExcessivePunctuation: true,
    noSpam: true,
    noCounterfeitHints: true,
    accurateDescription: true
  }
};
```

---

## Tax & Financial Compliance

### Form 1099-K Reporting (2024+)

**Federal Requirement:**
- Threshold: >$5,000 in gross sales (any number of transactions)
- Applies to: All payment processors (PayPal, Venmo, marketplace payouts)
- Issued by: January 31 each year

**State Requirements:**
- Some states: Lower thresholds ($600 in MA, VT)
- Check state-specific requirements

**Implementation:**

```javascript
const taxCompliance = {
  trackSales: {
    grossSales: 0,
    platformFees: 0,
    shippingCollected: 0,
    taxCollected: 0,
    refunds: 0
  },

  calculateTaxableIncome: () => {
    // Gross sales (includes shipping if you charged it)
    const gross = trackSales.grossSales;

    // Deductible expenses
    const expenses = {
      platformFees: trackSales.platformFees,
      shippingCosts: actualShippingCosts,
      packagingSupplies: packagingCosts,
      costOfGoodsSold: purchaseCosts
    };

    return gross - Object.values(expenses).reduce((a, b) => a + b, 0);
  },

  // Form 1099-K won't show expenses
  keepRecords: [
    'All purchase receipts',
    'Shipping receipts',
    'Platform fee statements',
    'Mileage logs (if applicable)',
    'Home office expenses (if applicable)'
  ]
};
```

---

### Business License Requirements

**When Required:**
- Regular, ongoing sales (not just decluttering)
- Intent to profit
- >$1,000/year in sales (varies by state/city)

**Check:**
1. State business license requirements
2. City/county business license
3. Sales tax permit (if state requires)
4. Home occupation permit (if selling from home)

---

## Record Keeping Best Practices

```javascript
const recordKeeping = {
  // Required for 7 years
  salesRecords: {
    date: 'Transaction date',
    platform: 'eBay, Facebook, Mercari',
    itemSold: 'Description',
    salePrice: 'Total received',
    fees: 'Platform fees',
    shipping: 'Shipping charged vs actual cost',
    taxes: 'Sales tax collected'
  },

  expenseRecords: {
    purchases: 'Item cost + receipts',
    shipping: 'All shipping receipts',
    supplies: 'Boxes, tape, labels',
    mileage: 'Thrift store trips, post office',
    equipment: 'Computer, printer, scales'
  },

  compliance: {
    authentication: 'Certificates, receipts',
    brandAuthorization: 'Reseller agreements',
    correspondance: 'VeRO notices, policy warnings'
  }
};
```

---

## Resources

### Official Policy Pages
- [eBay Prohibited Items](https://www.ebay.com/help/policies/prohibited-restricted-items/prohibited-restricted-items?id=4207)
- [Facebook Commerce Policies](https://www.facebook.com/policies/commerce)
- [Mercari Prohibited Items](https://www.mercari.com/us/help_center/topics/account/prohibited-conduct/prohibited-items/)

### Safety & Recalls
- [CPSC Recalls](https://www.cpsc.gov/Recalls)
- [FDA Device Recalls](https://www.fda.gov/medical-devices/medical-device-recalls)
- [NHTSA Vehicle Recalls](https://www.nhtsa.gov/recalls)

### Tax Resources
- [IRS Form 1099-K](https://www.irs.gov/forms-pubs/about-form-1099-k)
- [State Sales Tax Guide](https://www.salestaxinstitute.com/)

### Brand Protection
- [eBay VeRO Program](https://pages.ebay.com/seller-center/listing-and-marketing/verified-rights-owner-program.html)
- [USPTO Trademark Search](https://www.uspto.gov/trademarks/search)

---

## Compliance Automation

```javascript
// Automated compliance checking
class AutomatedCompliance {
  async preListingCheck(item) {
    const checks = [];

    // 1. Prohibited items scan
    checks.push(await this.scanProhibitedKeywords(item));

    // 2. Brand protection check
    checks.push(await this.checkVeRO(item));

    // 3. Recall database check
    checks.push(await this.checkRecalls(item));

    // 4. Image compliance
    checks.push(await this.validateImages(item));

    // 5. Authentication requirement
    checks.push(await this.checkAuthRequirement(item));

    // 6. Category validation
    checks.push(await this.validateCategory(item));

    const failed = checks.filter(c => !c.passed);

    return {
      canList: failed.length === 0,
      warnings: checks.filter(c => c.warning),
      errors: failed,
      recommendations: this.getRecommendations(checks)
    };
  }
}
```

This ensures every listing is compliant BEFORE going live, reducing takedowns and account risk.
