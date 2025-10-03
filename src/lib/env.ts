/**
 * Environment Variable Validation
 * Ensures all required env vars are present at runtime
 */

import { z } from 'zod';

const envSchema = z.object({
  // Shopify (Required for production)
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string().min(1).optional(),
  NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: z.string().min(1).optional(),

  // Supabase (Optional)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

  // Stripe (Optional)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),

  // Cloudinary (Optional)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Crisp Chat (Optional)
  NEXT_PUBLIC_CRISP_WEBSITE_ID: z.string().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Boom Warehouse'),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);

    // Check if we're in production mode
    if (process.env.NODE_ENV === 'production') {
      // In production, Shopify credentials are highly recommended
      if (!env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || !env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN) {
        console.warn('⚠️  Shopify credentials missing - using static product data fallback');
      }
    }

    return env;
  } catch (error) {
    if (error && typeof error === 'object' && 'issues' in error) {
      console.error('❌ Environment variable validation failed:');
      const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
      zodError.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });

      // In development, allow missing vars with warnings
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Continuing with missing env vars in development mode');
        return process.env as Record<string, string | undefined>;
      }

      throw new Error('Invalid environment variables');
    }
    throw error;
  }
}

// Export validated env (with type safety)
export const env = validateEnv();

// Helper to check if Shopify is configured
export const isShopifyConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
  );
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Helper to check if Stripe is configured
export const isStripeConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    process.env.STRIPE_SECRET_KEY
  );
};
