# 🛍️ Shopify Integration Setup Guide

This guide will help you connect your Boom Warehouse Next.js site to Shopify for product management and checkout.

## Prerequisites

- A Shopify store (you can create a free development store)
- Admin access to your Shopify store
- Node.js 18+ installed

## Step 1: Create a Shopify Custom App

1. **Go to your Shopify Admin**
   - Navigate to: `Settings > Apps and sales channels > Develop apps`
   - Click **"Create an app"**
   - Name it: `Boom Warehouse Storefront`

2. **Configure Storefront API Permissions**
   - Click **"Configure Storefront API scopes"**
   - Enable these scopes:
     - ✅ `unauthenticated_read_product_listings`
     - ✅ `unauthenticated_read_product_inventory`
     - ✅ `unauthenticated_read_product_pickup_locations`
     - ✅ `unauthenticated_read_checkouts`
     - ✅ `unauthenticated_write_checkouts`
     - ✅ `unauthenticated_read_customers`
     - ✅ `unauthenticated_write_customers`

3. **Install the App**
   - Click **"Install app"** in the top right
   - Confirm the installation

4. **Get Your Credentials**
   - Go to **"API credentials"** tab
   - Copy your **Storefront API access token**
   - Copy your **Store domain** (e.g., `your-store.myshopify.com`)

## Step 2: Configure Environment Variables

1. **Create `.env.local` file** in your project root:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add your Shopify credentials**:
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token_here
   ```

## Step 3: Set Up Product Metafields

To support Boom Warehouse's condition grading system, add custom metafields in Shopify:

1. **Go to**: `Settings > Custom data > Products`
2. **Add these metafield definitions**:

   - **Condition Grade**
     - Namespace: `custom`
     - Key: `condition`
     - Type: `Single line text`
     - Values: `Grade A`, `Grade B`, `Grade C`, `Grade D`

   - **Warranty Months**
     - Namespace: `custom`
     - Key: `warranty_months`
     - Type: `Integer`

   - **Location**
     - Namespace: `custom`
     - Key: `location`
     - Type: `Single line text`

   - **Serial Number**
     - Namespace: `custom`
     - Key: `serial_number`
     - Type: `Single line text`

   - **Specifications**
     - Namespace: `custom`
     - Key: `specifications`
     - Type: `JSON`

## Step 4: Import Your Products to Shopify

### Option A: Manual Import (CSV)

1. Go to `Products > Import` in Shopify admin
2. Use the provided CSV template from `/data/boom-warehouse-products.json`
3. Map your existing product data to Shopify's format

### Option B: Use Shopify Admin API (Advanced)

Run the migration script (to be created):
```bash
npm run migrate:products
```

## Step 5: Set Up Collections (Categories)

1. Go to `Products > Collections` in Shopify admin
2. Create collections matching your categories:
   - Computers & Laptops
   - Monitors & Displays
   - Electronics
   - Appliances
   - Gaming
   - Accessories

3. Set collection rules to auto-assign products by product type

## Step 6: Configure Checkout Settings

1. **Go to**: `Settings > Checkout`
2. **Configure**:
   - ✅ Enable guest checkout
   - ✅ Add "Local pickup" as a delivery option
   - ✅ Set up delivery zones for Warrensville Heights area
   - ✅ Configure tax settings for Ohio

## Step 7: Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Verify**:
   - Products load from Shopify
   - Cart functionality works
   - Checkout redirects to Shopify
   - Orders appear in Shopify admin

## Step 8: Enable Shopify Payments (Production)

1. Go to `Settings > Payments`
2. Set up Shopify Payments (or another payment provider)
3. Complete identity verification
4. Configure payout schedule

## Features Enabled

✅ **Product Management**: All products managed in Shopify admin
✅ **Inventory Tracking**: Real-time stock levels
✅ **Cart & Checkout**: Secure Shopify checkout
✅ **Payment Processing**: Shopify Payments integration
✅ **Order Management**: All orders in Shopify admin
✅ **Customer Accounts**: Optional customer login
✅ **Analytics**: Built-in Shopify analytics

## Troubleshooting

### Products not loading?
- Verify your Storefront API token is correct
- Check that products are published to "Online Store" sales channel
- Ensure API scopes are properly configured

### Cart errors?
- Verify `unauthenticated_write_checkouts` scope is enabled
- Check browser console for specific error messages

### Checkout not working?
- Ensure your Shopify store is not password-protected
- Verify payment methods are configured

## Next Steps

1. ✅ Products sync from Shopify
2. ✅ Cart and checkout functional
3. 🎨 Customize the storefront design
4. 📱 Test mobile experience
5. 🚀 Deploy to production

## Support

- **Shopify Docs**: https://shopify.dev/docs/api/storefront
- **Community**: https://community.shopify.com
- **Boom Warehouse**: Contact your development team

---

**Last Updated**: January 2025
**Next.js Version**: 15.5.4
**Shopify API Version**: 2025-01
