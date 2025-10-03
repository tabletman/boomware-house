/**
 * Product service for fetching from Shopify Storefront API
 */

import { shopifyFetch } from './client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  GET_COLLECTIONS_QUERY,
} from './queries';
import type {
  ProductsResponse,
  ProductResponse,
  CollectionProductsResponse,
  SearchResponse,
  CollectionsResponse,
  ShopifyProduct,
  ShopifyCollection,
} from './types';

/**
 * Get all products with pagination support
 */
export async function getProducts(
  first: number = 50,
  after?: string
): Promise<{ products: ShopifyProduct[]; pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; startCursor: string; endCursor: string } }> {
  try {
    const data = await shopifyFetch<ProductsResponse>({
      query: GET_PRODUCTS_QUERY,
      variables: { first, after },
      tags: ['products'],
    });

    return {
      products: data.products.edges.map((edge) => edge.node),
      pageInfo: data.products.pageInfo,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: '',
        endCursor: '',
      },
    };
  }
}

/**
 * Get a single product by handle
 */
export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const data = await shopifyFetch<ProductResponse>({
      query: GET_PRODUCT_QUERY,
      variables: { handle },
      tags: [`product-${handle}`],
    });

    return data.product;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
}

/**
 * Get products from a collection
 */
export async function getCollectionProducts(
  handle: string,
  first: number = 50
): Promise<{ collection: { id: string; title: string; description: string }; products: ShopifyProduct[] }> {
  try {
    const data = await shopifyFetch<CollectionProductsResponse>({
      query: GET_COLLECTION_PRODUCTS_QUERY,
      variables: { handle, first },
      tags: [`collection-${handle}`],
    });

    return {
      collection: {
        id: data.collection.id,
        title: data.collection.title,
        description: data.collection.description,
      },
      products: data.collection.products.edges.map((edge) => edge.node),
    };
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return {
      collection: { id: '', title: '', description: '' },
      products: [],
    };
  }
}

/**
 * Search products by query
 */
export async function searchProducts(query: string, first: number = 20): Promise<ShopifyProduct[]> {
  try {
    const data = await shopifyFetch<SearchResponse>({
      query: SEARCH_PRODUCTS_QUERY,
      variables: { query, first },
      cache: 'no-store', // Don't cache search results
    });

    return data.search.edges.map((edge) => edge.node);
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    return [];
  }
}

/**
 * Get all collections
 */
export async function getCollections(first: number = 50): Promise<ShopifyCollection[]> {
  try {
    const data = await shopifyFetch<CollectionsResponse>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first },
      tags: ['collections'],
    });

    return data.collections.edges.map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

/**
 * Transform Shopify product to local Product interface
 */
export function transformShopifyProduct(shopifyProduct: ShopifyProduct): {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D';
  price: number;
  compareAtPrice?: number;
  brand: string;
  images: string[];
  tags: string[];
  location: string;
  warranty_months: number;
  is_featured: boolean;
  inStock: boolean;
  specifications: Record<string, string | number | boolean>;
  created_at: string;
  updated_at: string;
} {
  const conditionValue = shopifyProduct.metafields?.find((m) => m.key === 'condition')?.value || 'Grade B';
  const condition = (['Grade A', 'Grade B', 'Grade C', 'Grade D'].includes(conditionValue)
    ? conditionValue
    : 'Grade B') as 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D';
  const warrantyMonths = shopifyProduct.metafields?.find((m) => m.key === 'warranty_months')?.value || '3';
  const location = shopifyProduct.metafields?.find((m) => m.key === 'location')?.value || 'Warrensville Heights';
  const specifications = shopifyProduct.metafields?.find((m) => m.key === 'specifications')?.value;

  return {
    id: shopifyProduct.handle,
    name: shopifyProduct.title,
    description: shopifyProduct.description,
    category: shopifyProduct.productType,
    condition,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    compareAtPrice: shopifyProduct.compareAtPriceRange?.minVariantPrice
      ? parseFloat(shopifyProduct.compareAtPriceRange.minVariantPrice.amount)
      : undefined,
    brand: shopifyProduct.vendor,
    images: shopifyProduct.images.edges.map((edge) => edge.node.url),
    tags: shopifyProduct.tags,
    location,
    warranty_months: parseInt(warrantyMonths, 10),
    is_featured: shopifyProduct.tags.includes('featured'),
    inStock: shopifyProduct.availableForSale,
    specifications: specifications ? (JSON.parse(specifications) as Record<string, string | number | boolean>) : {},
    created_at: shopifyProduct.createdAt,
    updated_at: shopifyProduct.updatedAt,
  };
}
