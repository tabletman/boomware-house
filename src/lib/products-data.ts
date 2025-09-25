// Updated product data for Boom Warehouse
// Generated from Instagram inventory data

import inventoryData from '../../data/boom-warehouse-products.json';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D';
  sku?: string;
  price: number;
  compareAtPrice?: number;
  brand?: string;
  model?: string;
  year?: number;
  specifications: Record<string, string | number | boolean>;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
  quantity?: number;
  images: string[];
  tags?: string[];
  location: string;
  warranty_months: number;
  is_featured?: boolean;
  inStock?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
}

// Transform the imported data to match our Product interface
export const products: Product[] = inventoryData.products.map((product) => ({
  ...product,
  sku: product.id,
  quantity: 1,
  tags: [product.category, product.condition],
  inStock: product.inStock ?? true,
  condition: product.condition as 'Grade A' | 'Grade B' | 'Grade C' | 'Grade D',
  compareAtPrice: product.compareAtPrice || undefined,
}));

export const categories: Category[] = inventoryData.categories;

// Helper functions
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(product =>
    product.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.is_featured);
}

export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}

export function getProductsByCondition(condition: string): Product[] {
  return products.filter(product =>
    product.condition.toLowerCase() === condition.toLowerCase()
  );
}

// Export summary statistics
export const inventory = {
  totalProducts: products.length,
  totalCategories: categories.length,
  featuredProducts: getFeaturedProducts().length,
  inStockProducts: products.filter(p => p.inStock).length,
  averagePrice: Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length),
  priceRange: {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  }
};

console.log(`📦 Boom Warehouse Inventory Loaded:`, inventory);