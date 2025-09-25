'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductImage } from '@/components/ui/product-image'
import { products, categories } from '@/lib/products-data'
import { Filter, Grid, List } from 'lucide-react'

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCondition, setSelectedCondition] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'name' | 'condition'>('price-low')

  // Filter products
  let filteredProducts = products

  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.category === selectedCategory
    )
  }

  if (selectedCondition !== 'all') {
    filteredProducts = filteredProducts.filter(product =>
      product.condition === selectedCondition
    )
  }

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
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
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>

              {/* Category Filter */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`block w-full text-left text-sm px-2 py-1 rounded ${
                      selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    All Categories ({products.length})
                  </button>
                  {categories.map(category => {
                    const count = products.filter(p => p.category === category.name).length
                    return (
                      <button
                        key={category.slug}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded ${
                          selectedCategory === category.name ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                      >
                        {category.name} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="space-y-2 pt-4">
                <h4 className="text-sm font-medium">Condition</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCondition('all')}
                    className={`block w-full text-left text-sm px-2 py-1 rounded ${
                      selectedCondition === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    All Conditions
                  </button>
                  {['Grade A', 'Grade B', 'Grade C', 'Grade D'].map(condition => {
                    const count = products.filter(p => p.condition === condition).length
                    if (count === 0) return null
                    return (
                      <button
                        key={condition}
                        onClick={() => setSelectedCondition(condition)}
                        className={`block w-full text-left text-sm px-2 py-1 rounded ${
                          selectedCondition === condition ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                        }`}
                      >
                        {condition} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
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