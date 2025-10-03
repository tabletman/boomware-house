'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import toast from 'react-hot-toast';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function AddToCartButton({
  productId,
  productName,
  price,
  className = '',
  size = 'lg'
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      // For now, using productId as variantId
      // When Shopify is connected, this will use actual variant IDs
      await addToCart(productId, 1);
      toast.success(`${productName} added to cart!`, {
        icon: '🛒',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      size={size}
      className={`flex-1 transition-all hover:scale-[1.02] ${className}`}
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}
