'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductImage } from '@/components/ui/product-image';
import { AddToCartButton } from '@/components/product/add-to-cart-button';
import { ShoppingCart, Heart, Star, MapPin, Shield } from 'lucide-react';
import { Product } from '@/lib/products-data';

interface ModernProductCardProps {
  product: Product;
}

export function ModernProductCard({ product }: ModernProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const conditionColors = {
    'Grade A': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Grade B': 'bg-blue-50 text-blue-700 border-blue-200',
    'Grade C': 'bg-amber-50 text-amber-700 border-amber-200',
    'Grade D': 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card
      className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white border border-gray-200 rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Image Section - Fixed Height */}
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            {product.images[0] && (
              <ProductImage
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            )}

            {/* Top Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              <Badge className={`text-[10px] px-1.5 py-0.5 ${conditionColors[product.condition]} border font-medium`}>
                {product.condition}
              </Badge>
              {product.is_featured && (
                <Badge className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border-indigo-200 font-medium">
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                  Featured
                </Badge>
              )}
            </div>

            {discount > 0 && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="text-xs px-2 py-0.5 font-bold shadow-md">
                  -{discount}%
                </Badge>
              </div>
            )}

            {/* Hover Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-lg h-8 px-3 text-xs shadow-lg hover:scale-105 transition-transform"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                <Badge variant="destructive" className="text-sm px-4 py-1.5 shadow-xl">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-3 flex flex-col flex-1">
          {/* Category */}
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-1">
            {product.category}
          </p>

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[40px] leading-tight mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Specs Preview */}
          {product.brand && (
            <p className="text-[11px] text-gray-600 mb-2">
              Brand: <span className="font-medium text-gray-800">{product.brand}</span>
            </p>
          )}

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Info Row */}
            <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>{product.warranty_months}mo</span>
              </div>
              {product.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[80px]">{product.location}</span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              price={product.price}
              size="sm"
              className="w-full text-xs h-8 rounded-lg shadow-sm hover:shadow-md transition-all"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
