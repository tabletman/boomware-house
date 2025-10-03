'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductImage } from '@/components/ui/product-image'
import { ProductFilters } from '@/components/ui/product-filters'
import { products, categories } from '@/lib/products-data'
import { Filter, Grid, List } from 'lucide-react'

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name' | 'condition'>('price-low')
  const [filters, setFilters] = useState({
    categories: [] as string[],
    conditions: [] as string[],
    brands: [] as string[],
    priceRange: [0, 10000] as [number, number],
    inStock: false,
    onSale: false,
  })

  // Generate filter options from products
  const filterOptions = useMemo(() => {
    const allBrands = [...new Set(products.map(p => p.brand).filter((b): b is string => b !== undefined))].sort()
    const allPrices = products.map(p => p.price)
    return {
      categories: categories.map(c => c.name),
      conditions: ['Grade A', 'Grade B', 'Grade C', 'Grade D'] as Array<'Grade A' | 'Grade B' | 'Grade C' | 'Grade D'>,
      brands: allBrands,
      priceRange: {
        min: Math.floor(Math.min(...allPrices) / 10) * 10,
        max: Math.ceil(Math.max(...allPrices) / 10) * 10,
      },
    }
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply filters
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category))
    }
    if (filters.conditions.length > 0) {
      result = result.filter(p => filters.conditions.includes(p.condition))
    }
    if (filters.brands.length > 0) {
      result = result.filter(p => p.brand && filters.brands.includes(p.brand))
    }
    if (filters.priceRange[0] !== filterOptions.priceRange.min || filters.priceRange[1] !== filterOptions.priceRange.max) {
      result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])
    }
    if (filters.inStock) {
      result = result.filter(p => p.inStock)
    }
    if (filters.onSale) {
      result = result.filter(p => p.compareAtPrice)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'condition':
          const conditionOrder = { 'Grade A': 4, 'Grade B': 3, 'Grade C': 2, 'Grade D': 1 }
          return conditionOrder[b.condition] - conditionOrder[a.condition]
        default:
          return 0
      }
    })

    return result
  }, [filters, sortBy, filterOptions])

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
        <div className="container">
          <h1 className="text-4xl font-bold tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-2">
            Browse our complete inventory of quality used electronics and appliances
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Advanced Filters Sidebar */}
          <div className="lg:w-80">
            <ProductFilters
              options={filterOptions}
              onFilterChange={setFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} products found
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'price-low' | 'price-high' | 'name' | 'condition')}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                    <option value="condition">Condition</option>
                  </select>
                </div>
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <Card className={`group cursor-pointer hover:shadow-md transition-shadow ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}>
                      <CardContent className="p-0">
                        <div className={`${
                          viewMode === 'grid' ? 'aspect-square' : 'w-48 h-32'
                        } bg-gradient-to-br from-muted/20 to-muted/40 relative overflow-hidden`}>
                          {product.images[0] && (
                            <ProductImage
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant="secondary"
                              className={
                                product.condition === 'Grade A' ? 'bg-green-100 text-green-800' :
                                product.condition === 'Grade B' ? 'bg-blue-100 text-blue-800' :
                                product.condition === 'Grade C' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {product.condition}
                            </Badge>
                          </div>
                          {product.compareAtPrice && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive" className="text-xs">
                                {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                          <h3 className={`font-semibold group-hover:text-primary transition-colors ${
                            viewMode === 'grid' ? 'line-clamp-2' : 'line-clamp-1'
                          }`}>
                            {product.name}
                          </h3>
                          {viewMode === 'list' && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                            {product.compareAtPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.compareAtPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          {viewMode === 'list' && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {product.warranty_months} month warranty
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}