'use client';

/**
 * Stock Urgency Indicators
 * Display stock levels and urgency messages
 */

import { AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface StockUrgencyProps {
  inStock: boolean;
  stockLevel?: 'high' | 'medium' | 'low' | 'out';
  className?: string;
}

export function StockUrgency({ inStock, stockLevel = 'medium', className }: StockUrgencyProps) {
  if (!inStock || stockLevel === 'out') {
    return (
      <div className={cn('flex items-center gap-2 text-destructive', className)}>
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">Out of Stock</span>
      </div>
    );
  }

  if (stockLevel === 'low') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center gap-2 text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">Only 2-3 left in stock!</span>
        </div>
        <Badge variant="destructive" className="text-xs">
          Limited Availability
        </Badge>
      </div>
    );
  }

  if (stockLevel === 'medium') {
    return (
      <div className={cn('flex items-center gap-2 text-yellow-600', className)}>
        <Package className="h-4 w-4" />
        <span className="text-sm">Limited stock available</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2 text-green-600', className)}>
      <Package className="h-4 w-4" />
      <span className="text-sm">In Stock</span>
    </div>
  );
}

interface PopularityBadgeProps {
  viewCount?: number;
  purchaseCount?: number;
  className?: string;
}

export function PopularityBadge({ viewCount, purchaseCount, className }: PopularityBadgeProps) {
  if (!viewCount && !purchaseCount) return null;

  const isPopular = (viewCount && viewCount > 100) || (purchaseCount && purchaseCount > 10);

  if (!isPopular) return null;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        <TrendingUp className="h-3 w-3 mr-1" />
        Popular Item
      </Badge>
      {viewCount && viewCount > 100 && (
        <span className="text-xs text-muted-foreground">
          {viewCount}+ views
        </span>
      )}
    </div>
  );
}
