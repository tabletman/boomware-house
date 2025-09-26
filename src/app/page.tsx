import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductImage } from '@/components/ui/product-image'
import { ShoppingBag, Truck, Shield, Star, ArrowRight } from 'lucide-react'
import { getFeaturedProducts, categories } from '@/lib/products-data'

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Quality Used Electronics at{' '}
              <span className="text-primary">Unbeatable Prices</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Discover professionally graded computers, electronics, and appliances in
              Warrensville Heights. Every item comes with our condition guarantee and warranty.
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg">
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/condition-guide">Learn About Our Grading</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Condition Guaranteed</CardTitle>
                <CardDescription>
                  Every item is professionally graded from A to D with detailed condition reports
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Local Pickup & Delivery</CardTitle>
                <CardDescription>
                  Free pickup in Warrensville Heights area or affordable local delivery
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Warranty Included</CardTitle>
                <CardDescription>
                  All items come with our warranty period based on condition grade
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground mt-4">
              Find exactly what you need from our curated selection
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.slug}`}
                className="group relative overflow-hidden rounded-lg bg-slate-800 shadow-sm transition-all hover:shadow-lg hover:bg-slate-700"
              >
                <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-900 p-6">
                  <div className="flex h-full flex-col justify-end">
                    <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-300 mt-1">
                      {category.description}
                    </p>
                    <div className="flex items-center mt-3 text-sm text-primary">
                      <span>Shop now</span>
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <p className="text-muted-foreground mt-2">
                Hand-picked deals you won&apos;t want to miss
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.slice(0, 4).map((product) => (
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
                      <p className="text-sm text-muted-foreground">{product.category}</p>
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
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Find Your Perfect Deal?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Browse our complete inventory of graded electronics and appliances.
            Local pickup available in Warrensville Heights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
