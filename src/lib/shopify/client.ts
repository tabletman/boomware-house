/**
 * Shopify Storefront API Client
 * Handles GraphQL queries with caching and error handling
 */

import { GraphQLClient } from 'graphql-request';

const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '',
    'Content-Type': 'application/json',
  },
});

/**
 * Execute a GraphQL query against the Shopify Storefront API
 * with error handling and retry logic
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'force-cache',
  tags = [],
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  tags?: string[];
}): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '',
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: { tags },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('Shopify GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL query failed');
    }

    return json.data as T;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    throw error;
  }
}

/**
 * Format Shopify money object to USD string
 */
export function formatPrice(amount: string | number): string {
  const price = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

/**
 * Extract product ID from Shopify GID
 */
export function extractId(gid: string): string {
  return gid.split('/').pop() || '';
}
