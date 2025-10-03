'use client';

/**
 * Advanced Product Grid with Infinite Scroll and Filters
 * Amazon/Alibaba-inspired design
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/ui/product-image';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
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
      {/* Filters Bar */}
      {showFilters && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b mb-8 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="capitalize"
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div className="flex flex-wrap gap-2 mt-4">
              {conditions.map((cond) => (
                <Button
                  key={cond}
                  variant={selectedCondition === cond ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCondition(cond)}
                  className="text-xs"
                >
                  {cond === 'all' ? 'All Conditions' : cond}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found matching your filters.</p>
            <Button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedCondition('all');
                setPriceRange([0, 5000]);
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  const conditionColor =
    product.condition === 'Grade A' ? 'bg-green-100 text-green-800 border-green-200' :
    product.condition === 'Grade B' ? 'bg-blue-100 text-blue-800 border-blue-200' :
    product.condition === 'Grade C' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
    'bg-orange-100 text-orange-800 border-orange-200';

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card
      className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <CardContent className="p-0">
          {/* Image */}
          <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            {product.images[0] && (
              <ProductImage
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge className={`${conditionColor} border`}>
                {product.condition}
              </Badge>
              {product.is_featured && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
            </div>

            {discount > 0 && (
              <div className="absolute top-3 right-3">
                <Badge variant="destructive" className="text-sm font-bold">
                  {discount}% OFF
                </Badge>
              </div>
            )}

            {/* Quick Actions (on hover) */}
            <div
              className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Button size="sm" variant="secondary" className="rounded-full h-10 w-10 p-0">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="rounded-full h-10 w-10 p-0">
                <Heart className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="rounded-full h-10 w-10 p-0">
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            {/* Stock Badge */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-6 py-2">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </p>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors min-h-[48px]">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Warranty */}
            <p className="text-xs text-muted-foreground">
              {product.warranty_months} month warranty included
            </p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
