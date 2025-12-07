# eBay Integration Setup Guide

## Prerequisites

1. **eBay Seller Account**
   - Active eBay seller account
   - Business policies configured (shipping, payment, return)

2. **eBay Developer Account**
   - Sign up at: https://developer.ebay.com
   - Create an application for production

## Step 1: Create eBay Application

1. Go to https://developer.ebay.com/my/keys
2. Click "Create Application"
3. Choose "Production" environment
4. Application Title: "BoomWare House Listing Tool"
5. Select OAuth scopes:
   - `https://api.ebay.com/oauth/api_scope`
   - `https://api.ebay.com/oauth/api_scope/sell.inventory`
   - `https://api.ebay.com/oauth/api_scope/sell.account`
   - `https://api.ebay.com/oauth/api_scope/sell.fulfillment`

## Step 2: Configure OAuth Redirect

1. In your app settings, add redirect URI:
   ```
   https://localhost:3000/callback
   ```

2. Note your credentials:
   - Client ID (App ID)
   - Client Secret (Cert ID)

## Step 3: Create Business Policies

In your eBay seller account, create these policies:

### Shipping Policy
1. Go to: https://www.ebay.com/ship/pref
2. Create policy: "Standard Shipping"
   - Domestic: USPS Priority Mail (3 days)
   - Cost: Free shipping or calculated
   - Handling time: 1 business day

### Payment Policy
1. Go to: https://www.ebay.com/ship/pref
2. Create policy: "Standard Payment"
   - Payment methods: Managed Payments (automatic)

### Return Policy
1. Go to: https://www.ebay.com/ship/pref
2. Create policy: "30-Day Returns"
   - Returns accepted: Yes
   - Return period: 30 days
   - Return shipping: Buyer pays

## Step 4: Environment Configuration

1. Copy `.env.example` to `.env`
2. Add your eBay credentials:

```bash
EBAY_CLIENT_ID=your_app_id_here
EBAY_CLIENT_SECRET=your_cert_id_here
EBAY_SANDBOX=false
EBAY_REDIRECT_URI=https://localhost:3000/callback
```

## Step 5: Initial Authentication

### Option A: Manual OAuth Flow

1. Run the auth helper:
```bash
npm run cli auth-ebay
```

2. Open the URL in your browser
3. Log in to eBay and authorize the app
4. Copy the authorization code from the redirect URL
5. Enter it when prompted

### Option B: Programmatic Flow

```typescript
import { EbayClient } from './src/lib/platforms/ebay/client';

const client = new EbayClient({
  clientId: process.env.EBAY_CLIENT_ID!,
  clientSecret: process.env.EBAY_CLIENT_SECRET!,
  sandbox: false
});

// Get auth URL
const authUrl = client.getAuthUrl('state123');
console.log('Open this URL:', authUrl);

// After user authorizes, get code from redirect
const authCode = 'v%5E1.1%23i%5E1%23f%5E0...'; // From redirect URL

// Exchange for token
await client.authenticate(authCode);

// Token is now stored and will auto-refresh
```

## Step 6: Test Listing

### Mock Mode (No actual listing)
```bash
npm run cli list ./test-product.jpg --mock
```

### Production Mode
```bash
npm run cli list ./product.jpg -p ebay
```

## Category Mapping

Common eBay category IDs:

```javascript
const categories = {
  // Electronics
  'Cell Phones': '9355',
  'Laptops': '175672',
  'Tablets': '171485',
  'Video Games': '1249',
  'Cameras': '31388',

  // Fashion
  'Mens Clothing': '1059',
  'Womens Clothing': '15724',
  'Shoes': '63850',
  'Handbags': '63852',
  'Jewelry': '281',

  // Home & Garden
  'Home Decor': '10033',
  'Kitchen': '20625',
  'Tools': '631',

  // Collectibles
  'Trading Cards': '183454',
  'Coins': '11116',
  'Antiques': '20081'
};
```

## Fee Structure

eBay fees (as of 2024):

| Category | Final Value Fee | Per Order Fee |
|----------|----------------|---------------|
| Most categories | 13.25% | $0.30 |
| Books, Movies, Music | 14.95% | $0.30 |
| Collectibles | 13.25% | $0.30 |
| Business/Industrial | 14.55% | $0.30 |

Additional fees:
- Promoted listings: 1-20% (optional)
- International selling: +1.65%
- Store subscription: $7.95-$2,999.95/month (optional)

## Troubleshooting

### Common Errors

**Error: "Invalid client credentials"**
- Solution: Check EBAY_CLIENT_ID and EBAY_CLIENT_SECRET in .env

**Error: "Policy ID not found"**
- Solution: Create business policies in eBay seller account first

**Error: "Category not valid"**
- Solution: Use eBay's Category API to find valid category IDs

**Error: "Token expired"**
- Solution: The client auto-refreshes tokens, but you may need to re-authenticate if refresh token expires (180 days)

### Testing Tips

1. **Use Sandbox First**
   - Create sandbox account: https://developer.ebay.com/sandbox
   - Set `EBAY_SANDBOX=true` in .env
   - No real money or listings

2. **Start with Mock Mode**
   ```bash
   npm run cli list ./product.jpg --mock
   ```

3. **Single Platform First**
   ```bash
   npm run cli list ./product.jpg -p ebay
   ```

4. **Monitor Rate Limits**
   - Inventory API: 25,000 calls/day
   - Offer API: 25,000 calls/day
   - Respect 1-2 second delays between calls

## API Documentation

- [eBay Sell APIs](https://developer.ebay.com/api-docs/sell/static/overview.html)
- [Inventory API](https://developer.ebay.com/api-docs/sell/inventory/overview.html)
- [OAuth Guide](https://developer.ebay.com/api-docs/static/oauth-authorization-code-grant.html)
- [Category IDs](https://pages.ebay.com/sellerinformation/news/categorychanges.html)

## Production Checklist

- [ ] eBay seller account verified
- [ ] Developer account created
- [ ] Production app registered
- [ ] Business policies created
- [ ] OAuth tokens obtained
- [ ] Test listing successful
- [ ] Category mapping configured
- [ ] Error handling tested
- [ ] Rate limiting implemented
- [ ] Monitoring in place