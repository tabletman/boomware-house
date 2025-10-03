'use client';

/**
 * Modern Tech Parts Product Grid
 * Dense, compact layout with modern card design
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ModernProductCard } from './modern-product-card';
import { Product } from '@/lib/products-data';

interface ProductGridProps {
  initialProducts: Product[];
  showFilters?: boolean;
}

export function ProductGrid({ initialProducts, showFilters = true }: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      filtered = filtered.filter((p) => p.condition === selectedCondition);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured/default sort
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedCondition, priceRange, sortBy]);

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const conditions = ['all', 'Grade A', 'Grade B', 'Grade C', 'Grade D'];

  return (
    <div className="w-full">
      {/* Compact Filters Bar */}
      {showFilters && (
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm shadow-sm border-b mb-6 py-3">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize text-xs h-7 px-3 rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Sort Dropdown - Compact */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs px-3 py-1.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Condition Pills - Secondary Row */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-xs text-gray-500 mr-2 self-center">Condition:</span>
            {conditions.map((cond) => (
              <Button
                key={cond}
                variant={selectedCondition === cond ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCondition(cond)}
                className="text-xs h-6 px-2.5 rounded-full"
              >
                {cond === 'all' ? 'All' : cond}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Dense Product Grid - 5 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
          <ModernProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-lg text-gray-500">No products found matching your filters.</p>
          <Button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCondition('all');
              setPriceRange([0, 5000]);
            }}
            className="mt-4"
            size="sm"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
