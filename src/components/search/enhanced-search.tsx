'use client';

/**
 * Enhanced Search with Autocomplete
 * Real-time product search with suggestions
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '../ui/badge';
import Image from 'next/image';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  condition: string;
}

interface EnhancedSearchProps {
  allProducts: SearchResult[];
  className?: string;
}

export function EnhancedSearch({ allProducts, className = '' }: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search results with fuzzy matching
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return allProducts
      .filter(product => {
        const searchText = `${product.name} ${product.category} ${product.condition}`.toLowerCase();
        return searchText.includes(lowerQuery);
      })
      .slice(0, 5); // Limit to 5 results
  }, [query, allProducts]);

  // Popular search terms (could be dynamic from analytics)
  const popularSearches = ['laptop', 'monitor', 'gaming', 'apple', 'dell'];

  const saveRecentSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (term: string) => {
    saveRecentSearch(term);
    router.push(`/products?q=${encodeURIComponent(term)}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleProductClick = (product: SearchResult) => {
    saveRecentSearch(product.name);
    router.push(`/product/${product.id}`);
    setQuery('');
    setIsOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for electronics, appliances, computers..."
          className="w-full h-12 pl-12 pr-12 rounded-full border-2 border-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              handleSearch(query);
            }
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-[500px] overflow-y-auto">
          {/* Search Results */}
          {query && searchResults.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-semibold text-muted-foreground px-3 py-2">
                Products
              </p>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <div className="relative w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{product.category}</span>
                      <Badge variant="secondary" className="text-xs">
                        {product.condition}
                      </Badge>
                    </div>
                  </div>
                  <span className="font-bold text-sm">${product.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query && searchResults.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <p>No products found for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Try different keywords</p>
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div className="p-2 border-t">
              <p className="text-xs font-semibold text-muted-foreground px-3 py-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2 px-3 py-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-1 bg-muted hover:bg-muted/70 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
