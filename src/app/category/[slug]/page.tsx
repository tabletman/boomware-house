'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductImage } from '@/components/ui/product-image'
import { products, categories } from '@/lib/products-data'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params

  // Find category by slug
  const category = categories.find(cat =>
    cat.slug === slug ||
    cat.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/\s+/g, '-') === slug
  )

  if (!category) {
    notFound()
  }

  // Filter products by category
  const categoryProducts = products.filter(product =>
    product.category.toLowerCase() === category.name.toLowerCase()
  )

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {category.description}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {categoryProducts.length} products available
          </p>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="group cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-muted/20 to-muted/40 relative overflow-hidden">
                      {product.images[0] && (
                        <ProductImage
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute top-3 left-3">
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
                        <div className="absolute top-3 right-3">
                          <Badge variant="destructive">
                            {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              We don&apos;t currently have any products in this category.
            </p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}