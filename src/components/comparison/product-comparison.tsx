'use client';

/**
 * Product Comparison Tool
 * Compare multiple products side-by-side
 */

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import type { Product } from '@/lib/products-data';

interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onAddMore: () => void;
  maxProducts?: number;
}

export function ProductComparison({
  products,
  onRemoveProduct,
  onAddMore,
  maxProducts = 4,
}: ProductComparisonProps) {
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Collect all unique specification keys
  const allSpecKeys = Array.from(
    new Set(products.flatMap(p => Object.keys(p.specifications)))
  );

  const displayedSpecs = showAllSpecs ? allSpecKeys : allSpecKeys.slice(0, 8);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No products selected for comparison</p>
        <Button onClick={onAddMore}>
          <Plus className="mr-2 h-4 w-4" />
          Add Products to Compare
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-48 text-left p-4 bg-muted font-semibold">
                Product
              </th>
              {products.map((product) => (
                <th key={product.id} className="p-4 bg-muted relative min-w-[250px]">
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    aria-label="Remove product"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Link href={`/product/${product.id}`}>
                    <div className="relative w-full h-40 mb-3">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="250px"
                      />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>
                </th>
              ))}
              {products.length < maxProducts && (
                <th className="p-4 bg-muted/50 min-w-[250px]">
                  <Button
                    variant="outline"
                    onClick={onAddMore}
                    className="w-full h-40"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Product
                  </Button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Price */}
            <tr className="border-t">
              <td className="p-4 font-medium bg-muted/30">Price</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                    {product.compareAtPrice && (
                      <>
                        <p className="text-sm text-muted-foreground line-through">
                          ${product.compareAtPrice.toFixed(2)}
                        </p>
                        <Badge variant="destructive" className="text-xs">
                          {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Condition */}
            <tr className="border-t">
              <td className="p-4 font-medium bg-muted/30">Condition</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Badge
                    variant="secondary"
                    className={
                      product.condition === 'Grade A' ? 'bg-green-100 text-green-800' :
                      product.condition === 'Grade B' ? 'bg-blue-100 text-blue-800' :
                      product.condition === 'Grade C' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {product.condition}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* Brand */}
            <tr className="border-t">
              <td className="p-4 font-medium bg-muted/30">Brand</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  {product.brand}
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr className="border-t">
              <td className="p-4 font-medium bg-muted/30">Category</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  {product.category}
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr className="border-t">
              <td className="p-4 font-medium bg-muted/30">Warranty</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  {product.warranty_months} months
                </td>
              ))}
            </tr>

            {/* Availability */}
            <tr className="border-t">
              <td className="p-4 font-medium bg-muted/30">Availability</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <Badge variant={product.inStock ? 'default' : 'secondary'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </td>
              ))}
            </tr>

            {/* Specifications */}
            {displayedSpecs.map((specKey) => (
              <tr key={specKey} className="border-t">
                <td className="p-4 font-medium bg-muted/30 capitalize">
                  {specKey.replace(/_/g, ' ')}
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4 text-center">
                    {product.specifications[specKey] !== undefined
                      ? String(product.specifications[specKey])
                      : '-'}
                  </td>
                ))}
              </tr>
            ))}

            {/* Show More/Less Button */}
            {allSpecKeys.length > 8 && (
              <tr className="border-t">
                <td colSpan={products.length + 1} className="p-4 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                  >
                    {showAllSpecs ? 'Show Less' : `Show All ${allSpecKeys.length} Specifications`}
                  </Button>
                </td>
              </tr>
            )}

            {/* Actions */}
            <tr className="border-t bg-muted/30">
              <td className="p-4 font-medium">Actions</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <Link href={`/product/${product.id}`}>
                      <Button className="w-full">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      Add to Cart
                    </Button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
