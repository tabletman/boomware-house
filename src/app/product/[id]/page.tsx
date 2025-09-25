import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductImage } from '@/components/ui/product-image'
import { UpsellSection } from '@/components/ui/upsell-section'
import { getProductById, products } from '@/lib/products-data'
import { ShoppingCart, Truck, Shield, Star, MapPin } from 'lucide-react'

// Generate static params for all product IDs
export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  // Get related products from same category
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
              {product.images[0] && (
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {/* Additional images could go here */}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-2 mt-4">
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
                <Badge variant="outline">{product.warranty_months} month warranty</Badge>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive">
                      {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Price includes {product.warranty_months} month warranty
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="text-sm text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Physical Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.dimensions && (
                <div>
                  <h4 className="font-medium mb-2">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    {product.dimensions.width}&quot; × {product.dimensions.height}&quot; × {product.dimensions.depth}&quot;
                  </p>
                </div>
              )}
              {product.weight && (
                <div>
                  <h4 className="font-medium mb-2">Weight</h4>
                  <p className="text-sm text-muted-foreground">{product.weight} lbs</p>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Available at {product.location}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Condition Guaranteed</p>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Local Pickup Available</p>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Warranty Included</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upsell Section */}
        <UpsellSection product={product} className="mt-16" />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link href={`/category/${product.category.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}>
                <Button variant="outline">
                  View All in {product.category}
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <Card className="group cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gradient-to-br from-muted/20 to-muted/40 relative overflow-hidden">
                        {relatedProduct.images[0] && (
                          <ProductImage
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge
                            variant="secondary"
                            className={
                              relatedProduct.condition === 'Grade A' ? 'bg-green-100 text-green-800' :
                              relatedProduct.condition === 'Grade B' ? 'bg-blue-100 text-blue-800' :
                              relatedProduct.condition === 'Grade C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }
                          >
                            {relatedProduct.condition}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold">${relatedProduct.price.toFixed(2)}</span>
                          {relatedProduct.compareAtPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${relatedProduct.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}