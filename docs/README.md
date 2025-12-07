# BOOMER Marketplace Integration Documentation

Comprehensive best practices research for integrating with eBay, Facebook Marketplace, and Mercari APIs.

## 📚 Documentation Overview

### [MARKETPLACE_API_GUIDE.md](./MARKETPLACE_API_GUIDE.md)
**Complete API integration reference for all target marketplaces**

**Contents:**
- ✅ eBay API (Inventory vs Trading API selection guide)
- ✅ OAuth 2.0 authentication flows with code examples
- ✅ Rate limits, batch operations, and optimization strategies
- ✅ Image upload requirements and methods
- ✅ Category mapping with Taxonomy API (2025 updates)
- ✅ Cassini algorithm ranking factors
- ✅ Facebook Commerce Platform integration
- ✅ Mercari GraphQL API (limited availability)
- ✅ Error handling and common pitfalls
- ✅ Testing recommendations and migration checklists

**Key Highlights:**
- **eBay Inventory API** is the recommended choice for 2025+ (RESTful, OAuth 2.0, 2M calls/day)
- **Batch operations** reduce API calls by 90%+
- **Category mappings** deprecated - use Taxonomy API (decommission June 2, 2025)
- **Facebook requires** Meta partner approval for Commerce Platform access
- **Mercari API** uses OIDC authentication and GraphQL

---

### [COMPLIANCE_REQUIREMENTS.md](./COMPLIANCE_REQUIREMENTS.md)
**Comprehensive compliance and prohibited items reference**

**Contents:**
- ✅ eBay prohibited items and VeRO program
- ✅ Facebook Marketplace AI content moderation
- ✅ Mercari Authenticate program requirements
- ✅ Tax compliance (Form 1099-K, sales tax collection)
- ✅ Brand protection and authenticity requirements
- ✅ Account penalties and appeal processes
- ✅ Cross-platform compliance strategies

**Key Highlights:**
- **eBay VeRO** protects 1000+ brands - requires authorization or proof of authenticity
- **Facebook AI** scans for prohibited keywords - avoid "gun", "rx", "vape", etc.
- **Authenticity Guarantee** required for watches >$2K, handbags >$500, sneakers >$100
- **Form 1099-K** issued for >$5,000 in sales (2024+ threshold)
- **Three-strike system** on Facebook can lead to permanent marketplace ban
- **Mercari Authenticate** mandatory for select luxury brands (Chanel, Hermès, Rolex)

---

### [OPTIMIZATION_BEST_PRACTICES.md](./OPTIMIZATION_BEST_PRACTICES.md)
**SEO, photography, pricing, and conversion optimization strategies**

**Contents:**
- ✅ eBay Cassini algorithm optimization
- ✅ Facebook Marketplace early engagement strategy
- ✅ Mercari refresh tactics
- ✅ Photography standards (lighting, backgrounds, equipment)
- ✅ Pricing psychology (charm pricing, anchoring, bundles)
- ✅ Shipping strategies (free shipping impact: +18% conversion)
- ✅ Customer service automation
- ✅ Cross-platform listing workflows
- ✅ Analytics and A/B testing
- ✅ Seasonal optimization calendars

**Key Highlights:**
- **Complete item specifics** = +35% more impressions on eBay
- **1-day handling + free shipping** = required for top eBay ranking (2025)
- **Facebook first 60-120 minutes** determine ranking for days
- **Free shipping** increases conversion by 18% vs separate shipping charge
- **Returns accepted** = +22% conversion (30-day free returns = +35%)
- **Charm pricing** ($19.99 vs $20) = +12% sales
- **Mobile optimization** critical (87% of buyers shop on mobile)

---

## 🎯 Quick Start Integration Roadmap

### Phase 1: eBay Integration (Recommended First)
1. **Authentication Setup**
   - Obtain App ID, Cert ID, Dev ID from [eBay Developer Portal](https://developer.ebay.com/my/keys)
   - Implement OAuth 2.0 flow (see MARKETPLACE_API_GUIDE.md)
   - Set up token refresh automation

2. **Inventory Management**
   - Use Inventory API for all new listings
   - Implement batch operations (bulkCreateOrReplaceInventoryItem)
   - Configure shipping profiles and return policies

3. **Category & Product Setup**
   - Query Taxonomy API for category selection
   - Retrieve required item aspects via getItemAspectsForCategory
   - Validate all required fields before submission

4. **Optimization**
   - Follow 80-character title formula
   - Complete ALL item specifics (required + recommended)
   - Enable free shipping and 1-day handling
   - Accept 30-day returns

### Phase 2: Facebook Marketplace
1. **Business Verification**
   - Create Meta Business Manager account
   - Submit business verification (3-14 day wait)
   - Apply for Commerce Platform partner status

2. **Catalog Setup**
   - Create product catalog via Commerce API
   - Implement Catalog Batch API for bulk uploads
   - Configure automatic inventory sync

3. **Compliance**
   - Scan all listings for prohibited keywords before submission
   - Ensure all images meet 1:1 aspect ratio requirement
   - Set up auto-response templates for fast engagement

4. **Optimization**
   - List during peak hours (6-9pm local time)
   - Respond within 5 minutes for "Very responsive" badge
   - Refresh/relist every 7 days if not sold

### Phase 3: Mercari Integration
1. **API Access**
   - Contact Mercari for Shops API access
   - Implement OIDC authentication
   - Set up GraphQL client

2. **Product Listing**
   - Configure all required fields (brandId, categoryId, condition, etc.)
   - Implement shipping configuration mapping
   - Add Authenticate service tags for luxury items

3. **Optimization**
   - Optimize for 40-character title limit
   - Research and use top 5 hashtags per listing
   - Implement 3-day refresh strategy (edit timestamp)

---

## 🛠️ Technical Implementation Checklist

### Authentication
- [ ] eBay OAuth 2.0 configured with auto-refresh
- [ ] Facebook access token with Commerce scopes
- [ ] Mercari OIDC authentication implemented
- [ ] Token storage and rotation automated
- [ ] Error handling for token expiration

### Core Features
- [ ] Batch operations for bulk listing creation
- [ ] Image upload pipeline (self-hosted URLs or platform services)
- [ ] Category selection via Taxonomy API
- [ ] Item specifics validation before submission
- [ ] Rate limit monitoring and throttling
- [ ] Cross-platform inventory sync

### Compliance
- [ ] Prohibited items database integrated
- [ ] VeRO brand list checking
- [ ] Authentication requirement detection
- [ ] AI keyword filtering (Facebook)
- [ ] Pre-listing compliance validation
- [ ] Appeal process automation

### Optimization
- [ ] Title optimization algorithm
- [ ] Competitive pricing analysis
- [ ] Photography standards enforcement
- [ ] Shipping cost calculator
- [ ] A/B testing framework
- [ ] Analytics dashboard

---

## 📊 Success Metrics

**Track these KPIs:**

### Listing Performance
- **Views per listing:** Target >100 in first 7 days
- **Conversion rate:** Target >5% (sales/views)
- **Sell-through rate:** Target >70% within 30 days
- **Average sale time:** Target <14 days

### Account Health
- **Feedback score:** Maintain >98% positive
- **Defect rate:** Keep <1% (late shipments, INAD, cancellations)
- **Response time:** Average <1 hour (eBay <24hr, Facebook <15min)
- **Ship time:** 100% within 24 hours

### Financial
- **Average selling price:** Track by category
- **Profit margin:** Target >30% after all fees
- **Inventory turnover:** Target 6-12 times/year
- **Return on ad spend:** Target 3-5x (Promoted Listings)

---

## 🔄 Continuous Improvement

### Weekly Tasks
- Review analytics for underperforming listings
- A/B test one variable (title, price, photos)
- Update pricing based on market conditions
- Refresh listings >7 days old (Facebook/Mercari)

### Monthly Tasks
- Analyze sell-through rates by category
- Review and update item specifics completeness
- Audit compliance with latest platform policies
- Optimize shipping strategies based on costs
- Test new product categories or suppliers

### Quarterly Tasks
- Review API version updates and deprecations
- Update authentication flows if needed
- Benchmark performance against competitors
- Expand to additional marketplaces
- Implement learnings from A/B tests

---

## 📚 Additional Resources

### Official Documentation
- [eBay Developer Program](https://developer.ebay.com/)
- [eBay Inventory API](https://developer.ebay.com/api-docs/sell/inventory/overview.html)
- [Facebook Commerce Platform](https://developers.facebook.com/docs/commerce-platform/)
- [Mercari Shops API](https://api.mercari-shops.com/docs/)

### Code Libraries
- [eBay Node.js API Client](https://github.com/hendt/ebay-api)
- [Facebook Business SDK](https://github.com/facebook/facebook-nodejs-business-sdk)

### Compliance Resources
- [eBay Prohibited Items](https://www.ebay.com/help/policies/prohibited-restricted-items/prohibited-restricted-items?id=4207)
- [Facebook Commerce Policies](https://www.facebook.com/policies/commerce)
- [CPSC Recall Database](https://www.cpsc.gov/Recalls)
- [IRS Form 1099-K](https://www.irs.gov/forms-pubs/about-form-1099-k)

### Community & Learning
- Reddit: r/Flipping, r/eBaySellerAdvice, r/FacebookMarketplace
- YouTube: Reseller tutorials, photography guides
- Blogs: Vendoo Blog, List Perfectly resources

---

## 🎓 Key Learnings Summary

**API Selection (eBay):**
- ✅ **Use Inventory API** for all new projects (RESTful, modern, 2M calls/day)
- ❌ **Avoid Trading API** unless maintaining legacy listings
- ⚠️ **Cannot mix APIs** - listings created with one API cannot be managed by the other

**Authentication Best Practices:**
- ✅ **OAuth 2.0** is the standard (eBay supports it on Trading API now)
- ✅ **Auto-refresh tokens** - set up event listeners to store new tokens
- ✅ **Monitor rate limits** - use response headers to track usage

**Compliance Priorities:**
- 🔴 **VeRO brands** require authorization or authenticity proof
- 🔴 **Facebook AI** auto-flags prohibited keywords - avoid completely
- 🔴 **Authenticity programs** mandatory for high-value luxury items
- 🔴 **Tax compliance** - Form 1099-K issued at >$5K sales (federal)

**Optimization Imperatives:**
- 🎯 **Complete item specifics** = +35% impressions (eBay)
- 🎯 **Free shipping** = +18% conversion (all platforms)
- 🎯 **1-day handling** = +10% visibility (eBay Cassini)
- 🎯 **First 2 hours** = ranking determinant (Facebook)
- 🎯 **30-day returns** = +22% conversion (eBay)

---

## 🚀 Next Steps

1. **Read all three guides** thoroughly before implementation
2. **Set up eBay sandbox** for testing (see MARKETPLACE_API_GUIDE.md)
3. **Create compliance checklist** from COMPLIANCE_REQUIREMENTS.md
4. **Implement photography workflow** from OPTIMIZATION_BEST_PRACTICES.md
5. **Build MVP integration** for single marketplace (recommend eBay first)
6. **Monitor metrics** and iterate based on data
7. **Expand to additional platforms** once eBay integration is stable

---

**Last Updated:** December 7, 2025

**Research Completed By:** Best Practices Researcher (BOOMER Agent)

**Coverage:** eBay API 2025, Facebook Marketplace API, Mercari API, Cross-platform optimization strategies

**Status:** ✅ Complete - Ready for implementation
