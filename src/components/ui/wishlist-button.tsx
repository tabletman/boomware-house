'use client';

/**
 * Wishlist Button Component
 * Add/remove products from wishlist
 */

import { Heart } from 'lucide-react';
import { Button } from './button';
import { useWishlist } from '@/hooks/use-wishlist';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  variant?: 'default' | 'icon';
  className?: string;
}

export function WishlistButton({ productId, variant = 'default', className }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(productId);

  if (variant === 'icon') {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(productId);
        }}
        className={cn(
          'p-2 rounded-full transition-all',
          isSaved
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500',
          className
        )}
        aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={cn('h-5 w-5 transition-all', isSaved && 'fill-current')}
        />
      </button>
    );
  }

  return (
    <Button
      variant={isSaved ? 'default' : 'outline'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={className}
    >
      <Heart className={cn('mr-2 h-4 w-4', isSaved && 'fill-current')} />
      {isSaved ? 'Saved' : 'Save for Later'}
    </Button>
  );
}
