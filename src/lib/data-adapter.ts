/**
 * Data Adapter - Hybrid Strategy
 * Supports both static JSON and Shopify API with seamless fallback
 */

import { products as staticProducts, categories as staticCategories, getProductById, searchProducts as searchStaticProducts } from './products-data';
import { getProducts as getShopifyProducts, getProduct as getShopifyProduct, searchProducts as searchShopifyProducts, transformShopifyProduct } from './shopify/products';
import { isShopifyConfigured } from './env';
import type { Product } from './products-data';

// Determine data source
const useShopify = isShopifyConfigured();

/**
 * Get all products (from Shopify or static data)
 */
export async function getProducts(limit?: number): Promise<Product[]> {
  if (useShopify) {
    try {
      const { products: shopifyProducts } = await getShopifyProducts(limit || 50);
      return shopifyProducts.map(transformShopifyProduct);
    } catch (error) {
      console.warn('Shopify fetch failed, falling back to static data:', error);
      return staticProducts.slice(0, limit);
    }
  }

  return limit ? staticProducts.slice(0, limit) : staticProducts;
}

/**
 * Get single product by ID/handle
 */
export async function getProduct(id: string): Promise<Product | null> {
  if (useShopify) {
    try {
      const shopifyProduct = await getShopifyProduct(id);
      return shopifyProduct ? transformShopifyProduct(shopifyProduct) : null;
    } catch (error) {
      console.warn('Shopify fetch failed, falling back to static data:', error);
      const fallback = getProductById(id);
      return fallback || null;
    }
  }

  const result = getProductById(id);
  return result || null;
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (useShopify) {
    try {
      const shopifyProducts = await searchShopifyProducts(query);
      return shopifyProducts.map(transformShopifyProduct);
    } catch (error) {
      console.warn('Shopify search failed, falling back to static data:', error);
      return searchStaticProducts(query);
    }
  }

  return searchStaticProducts(query);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(p =>
    p.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 4): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(p => p.is_featured).slice(0, limit);
}

/**
 * Get categories
 */
export function getCategories() {
  return staticCategories;
}

/**
 * Check if using Shopify
 */
export function isUsingShopify(): boolean {
  return useShopify;
}
