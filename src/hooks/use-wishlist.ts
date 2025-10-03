/**
 * Wishlist / Save for Later Hook
 * Manages saved products with localStorage persistence
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse wishlist:', e);
      }
    }
  }, []);

  // Add item to wishlist
  const addToWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) return prev;
      const updated = [...prev, productId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => {
      const updated = prev.filter(id => id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Toggle item in wishlist
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Clear entire wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    count: wishlist.length,
  };
}
