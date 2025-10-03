'use client';

/**
 * Advanced Product Filters Sidebar
 * Multi-select filters for category, condition, price, brand, etc.
 */

import { useState, useEffect } from 'react';
import { Button } from './button';
import { Checkbox } from './checkbox';
import { Label } from './label';
import { Slider } from './slider';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { X, SlidersHorizontal } from 'lucide-react';

interface FilterOptions {
  categories: string[];
  conditions: Array<'Grade A' | 'Grade B' | 'Grade C' | 'Grade D'>;
  brands: string[];
  priceRange: { min: number; max: number };
}

interface ActiveFilters {
  categories: string[];
  conditions: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  onSale: boolean;
}

interface ProductFiltersProps {
  options: FilterOptions;
  onFilterChange: (filters: ActiveFilters) => void;
  className?: string;
}

export function ProductFilters({ options, onFilterChange, className = '' }: ProductFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    conditions: [],
    brands: [],
    priceRange: [options.priceRange.min, options.priceRange.max],
    inStock: false,
    onSale: false,
  });

  const [isExpanded, setIsExpanded] = useState({
    category: true,
    condition: true,
    brand: true,
    price: true,
    other: true,
  });

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(activeFilters);
  }, [activeFilters, onFilterChange]);

  const toggleFilter = (type: 'categories' | 'conditions' | 'brands', value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value],
    }));
  };

  const updatePriceRange = (range: [number, number]) => {
    setActiveFilters(prev => ({ ...prev, priceRange: range }));
  };

  const clearAllFilters = () => {
    setActiveFilters({
      categories: [],
      conditions: [],
      brands: [],
      priceRange: [options.priceRange.min, options.priceRange.max],
      inStock: false,
      onSale: false,
    });
  };

  const activeFilterCount =
    activeFilters.categories.length +
    activeFilters.conditions.length +
    activeFilters.brands.length +
    (activeFilters.inStock ? 1 : 0) +
    (activeFilters.onSale ? 1 : 0) +
    (activeFilters.priceRange[0] !== options.priceRange.min ||
     activeFilters.priceRange[1] !== options.priceRange.max ? 1 : 0);

  const conditionColors: Record<string, string> = {
    'Grade A': 'bg-green-100 text-green-800',
    'Grade B': 'bg-blue-100 text-blue-800',
    'Grade C': 'bg-yellow-100 text-yellow-800',
    'Grade D': 'bg-red-100 text-red-800',
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount}</Badge>
              )}
            </CardTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div>
            <button
              onClick={() => setIsExpanded(prev => ({ ...prev, category: !prev.category }))}
              className="flex items-center justify-between w-full mb-3"
            >
              <h4 className="font-semibold">Category</h4>
              <span className="text-sm text-muted-foreground">
                {activeFilters.categories.length > 0 && `(${activeFilters.categories.length})`}
              </span>
            </button>
            {isExpanded.category && (
              <div className="space-y-2">
                {options.categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={activeFilters.categories.includes(category)}
                      onCheckedChange={() => toggleFilter('categories', category)}
                    />
                    <Label
                      htmlFor={`cat-${category}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Condition Filter */}
          <div>
            <button
              onClick={() => setIsExpanded(prev => ({ ...prev, condition: !prev.condition }))}
              className="flex items-center justify-between w-full mb-3"
            >
              <h4 className="font-semibold">Condition</h4>
              <span className="text-sm text-muted-foreground">
                {activeFilters.conditions.length > 0 && `(${activeFilters.conditions.length})`}
              </span>
            </button>
            {isExpanded.condition && (
              <div className="space-y-2">
                {options.conditions.map(condition => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cond-${condition}`}
                      checked={activeFilters.conditions.includes(condition)}
                      onCheckedChange={() => toggleFilter('conditions', condition)}
                    />
                    <Label
                      htmlFor={`cond-${condition}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      <Badge variant="secondary" className={conditionColors[condition]}>
                        {condition}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div>
            <button
              onClick={() => setIsExpanded(prev => ({ ...prev, price: !prev.price }))}
              className="flex items-center justify-between w-full mb-3"
            >
              <h4 className="font-semibold">Price Range</h4>
            </button>
            {isExpanded.price && (
              <div className="space-y-4">
                <Slider
                  min={options.priceRange.min}
                  max={options.priceRange.max}
                  step={10}
                  value={activeFilters.priceRange}
                  onValueChange={(value) => updatePriceRange(value as [number, number])}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    ${activeFilters.priceRange[0]}
                  </span>
                  <span className="text-muted-foreground">to</span>
                  <span className="font-medium">
                    ${activeFilters.priceRange[1]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Brand Filter */}
          {options.brands.length > 0 && (
            <div>
              <button
                onClick={() => setIsExpanded(prev => ({ ...prev, brand: !prev.brand }))}
                className="flex items-center justify-between w-full mb-3"
              >
                <h4 className="font-semibold">Brand</h4>
                <span className="text-sm text-muted-foreground">
                  {activeFilters.brands.length > 0 && `(${activeFilters.brands.length})`}
                </span>
              </button>
              {isExpanded.brand && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {options.brands.map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={activeFilters.brands.includes(brand)}
                        onCheckedChange={() => toggleFilter('brands', brand)}
                      />
                      <Label
                        htmlFor={`brand-${brand}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Other Filters */}
          <div>
            <button
              onClick={() => setIsExpanded(prev => ({ ...prev, other: !prev.other }))}
              className="flex items-center justify-between w-full mb-3"
            >
              <h4 className="font-semibold">Other</h4>
            </button>
            {isExpanded.other && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={activeFilters.inStock}
                    onCheckedChange={(checked) =>
                      setActiveFilters(prev => ({ ...prev, inStock: checked as boolean }))
                    }
                  />
                  <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
                    In Stock Only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="on-sale"
                    checked={activeFilters.onSale}
                    onCheckedChange={(checked) =>
                      setActiveFilters(prev => ({ ...prev, onSale: checked as boolean }))
                    }
                  />
                  <Label htmlFor="on-sale" className="text-sm font-normal cursor-pointer">
                    On Sale
                  </Label>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">Active Filters</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.categories.map(cat => (
                <Badge key={cat} variant="secondary">
                  {cat}
                  <button
                    onClick={() => toggleFilter('categories', cat)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {activeFilters.conditions.map(cond => (
                <Badge key={cond} variant="secondary" className={conditionColors[cond]}>
                  {cond}
                  <button
                    onClick={() => toggleFilter('conditions', cond)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {activeFilters.brands.map(brand => (
                <Badge key={brand} variant="secondary">
                  {brand}
                  <button
                    onClick={() => toggleFilter('brands', brand)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {activeFilters.inStock && (
                <Badge variant="secondary">
                  In Stock
                  <button
                    onClick={() => setActiveFilters(prev => ({ ...prev, inStock: false }))}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {activeFilters.onSale && (
                <Badge variant="secondary">
                  On Sale
                  <button
                    onClick={() => setActiveFilters(prev => ({ ...prev, onSale: false }))}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
