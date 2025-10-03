/**
 * Product Recommendation Engine
 * Uses collaborative filtering and content-based algorithms
 */

import { Product } from './products-data';

interface RecommendationScore {
  product: Product;
  score: number;
  reasons: string[];
}

/**
 * Calculate similarity score between two products
 */
function calculateSimilarity(product1: Product, product2: Product): number {
  let score = 0;

  // Same category = high relevance
  if (product1.category === product2.category) score += 40;

  // Same brand = moderate relevance
  if (product1.brand === product2.brand) score += 20;

  // Similar condition = moderate relevance
  if (product1.condition === product2.condition) score += 15;

  // Similar price range (within 30%)
  const priceDiff = Math.abs(product1.price - product2.price) / product1.price;
  if (priceDiff < 0.3) score += 15;

  // Shared tags
  const commonTags = product1.tags.filter(tag => product2.tags.includes(tag));
  score += commonTags.length * 5;

  return Math.min(score, 100); // Cap at 100
}

/**
 * Get recommended products based on current product
 */
export function getRecommendations(
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 4
): Product[] {
  const scores: RecommendationScore[] = allProducts
    .filter(p => p.id !== currentProduct.id && p.inStock)
    .map(product => {
      const score = calculateSimilarity(currentProduct, product);
      const reasons: string[] = [];

      if (currentProduct.category === product.category) {
        reasons.push(`Same category: ${product.category}`);
      }
      if (currentProduct.brand === product.brand) {
        reasons.push(`Same brand: ${product.brand}`);
      }
      if (currentProduct.condition === product.condition) {
        reasons.push('Same condition');
      }

      return { product, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scores.map(s => s.product);
}

/**
 * Get "Frequently Bought Together" recommendations
 */
export function getFrequentlyBoughtTogether(
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  // In a real app, this would use purchase history data
  // For now, we'll use complementary product logic

  const complementaryCategories: Record<string, string[]> = {
    'Computers & Laptops': ['Monitors & Displays', 'Computer Parts', 'Peripherals'],
    'Monitors & Displays': ['Computer Parts', 'Computers & Laptops'],
    'Computer Parts': ['Computers & Laptops', 'Computer Components'],
    'Gaming': ['Monitors & Displays', 'Peripherals'],
    'Mobile Devices': ['Phone Accessories', 'Electronics'],
  };

  const targetCategories = complementaryCategories[currentProduct.category] || [];

  return allProducts
    .filter(p =>
      p.id !== currentProduct.id &&
      p.inStock &&
      targetCategories.some(cat => p.category.includes(cat))
    )
    .sort((a, b) => a.price - b.price) // Prefer lower priced items
    .slice(0, limit);
}

/**
 * Get "Customers Also Viewed" recommendations
 */
export function getCustomersAlsoViewed(
  currentProduct: Product,
  allProducts: Product[],
  limit: number = 6
): Product[] {
  // In a real app, this would use view history data
  // For now, use similar products with slight variation

  return allProducts
    .filter(p => p.id !== currentProduct.id)
    .map(product => ({
      product,
      score: calculateSimilarity(currentProduct, product) * 0.7 + Math.random() * 30, // Add randomness
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
}

/**
 * Get trending products (most viewed/purchased)
 */
export function getTrendingProducts(
  allProducts: Product[],
  limit: number = 8
): Product[] {
  // In a real app, this would use analytics data
  // For now, prioritize featured items and recent products

  return allProducts
    .filter(p => p.inStock)
    .sort((a, b) => {
      // Featured products first
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;

      // Then by created date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, limit);
}

/**
 * Get personalized recommendations based on view history
 */
export function getPersonalizedRecommendations(
  viewHistory: string[], // Product IDs
  allProducts: Product[],
  limit: number = 8
): Product[] {
  if (viewHistory.length === 0) {
    return getTrendingProducts(allProducts, limit);
  }

  const viewedProducts = allProducts.filter(p => viewHistory.includes(p.id));

  // Aggregate categories and brands from viewed products
  const categoryWeights: Record<string, number> = {};
  const brandWeights: Record<string, number> = {};

  viewedProducts.forEach(product => {
    categoryWeights[product.category] = (categoryWeights[product.category] || 0) + 1;
    brandWeights[product.brand] = (brandWeights[product.brand] || 0) + 1;
  });

  // Score products based on user preferences
  return allProducts
    .filter(p => !viewHistory.includes(p.id) && p.inStock)
    .map(product => {
      let score = 0;
      score += (categoryWeights[product.category] || 0) * 30;
      score += (brandWeights[product.brand] || 0) * 20;

      // Prefer similar price range to viewed items
      const avgViewedPrice = viewedProducts.reduce((sum, p) => sum + p.price, 0) / viewedProducts.length;
      const priceSimilarity = 1 - Math.abs(product.price - avgViewedPrice) / avgViewedPrice;
      score += priceSimilarity * 20;

      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
}
