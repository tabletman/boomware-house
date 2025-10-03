'use client';

/**
 * Shopping Cart Context with Shopify Cart API
 * Provides global cart state and actions
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShopifyCart } from '@/lib/shopify/types';
import {
  getCart,
  addToCart as shopifyAddToCart,
  updateCartLine,
  removeFromCart as shopifyRemoveFromCart,
} from '@/lib/shopify/cart';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: ShopifyCart | null;
  isLoading: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setIsLoading(true);
    try {
      const fetchedCart = await getCart();
      setCart(fetchedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      const updatedCart = await shopifyAddToCart(variantId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    try {
      const updatedCart = await updateCartLine(lineId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        toast.success('Cart updated');
      } else {
        toast.error('Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (lineId: string) => {
    try {
      const updatedCart = await shopifyRemoveFromCart(lineId);
      if (updatedCart) {
        setCart(updatedCart);
        toast.success('Item removed from cart');
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const itemCount = cart?.totalQuantity || 0;
  const subtotal = cart?.cost?.subtotalAmount
    ? parseFloat(cart.cost.subtotalAmount.amount)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        refreshCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
