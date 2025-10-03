'use client';

/**
 * Search Bar with Autocomplete
 * Amazon-style search experience
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { Product, searchProducts } from '@/lib/products-data';

const RECENT_SEARCHES_KEY = 'boomware-recent-searches';
const MAX_RECENT_SEARCHES = 5;

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Search as user types
  useEffect(() => {
    if (query.length >= 2) {
      const products = searchProducts(query);
      setResults(products.slice(0, 6)); // Limit to 6 results
      setIsOpen(true);
    } else {
      setResults([]);
      if (query.length === 0) {
        setIsOpen(false);
      }
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

    // Navigate to search results
    router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          placeholder="Search for electronics, appliances, computers..."
          className="w-full h-12 pl-12 pr-12 rounded-full border-2 border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-xl max-h-[500px] overflow-y-auto z-50"
        >
          {/* Product Results */}
          {results.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Products
              </p>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => {
                    handleSearch(query);
                  }}
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="font-bold text-primary">${product.price}</p>
                </Link>
              ))}
              <Link
                href={`/products?q=${encodeURIComponent(query)}`}
                onClick={() => {
                  handleSearch(query);
                }}
                className="block p-3 text-center text-sm text-primary hover:bg-muted rounded-md font-medium"
              >
                See all results for &quot;{query}&quot;
              </Link>
            </div>
          )}

          {/* No Results */}
          {query.length >= 2 && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No products found for &quot;{query}&quot;</p>
            </div>
          )}

          {/* Recent Searches */}
          {query.length === 0 && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Recent Searches
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="flex items-center gap-3 p-3 w-full text-left rounded-md hover:bg-muted transition-colors"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          {query.length === 0 && recentSearches.length === 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Trending
              </p>
              {['iMac', 'Refrigerator', 'Gaming PC', 'Monitor'].map((trend) => (
                <button
                  key={trend}
                  onClick={() => {
                    setQuery(trend);
                    handleSearch(trend);
                  }}
                  className="flex items-center gap-3 p-3 w-full text-left rounded-md hover:bg-muted transition-colors"
                >
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{trend}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
