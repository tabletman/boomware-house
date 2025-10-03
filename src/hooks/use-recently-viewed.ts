/**
 * Recently Viewed Items Hook
 * Tracks and persists recently viewed products
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 12;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recently viewed items:', e);
      }
    }
  }, []);

  // Add item to recently viewed
  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(id => id !== productId);
      // Add to beginning
      const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Clear all recently viewed
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
}
