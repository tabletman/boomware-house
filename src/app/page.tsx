import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductGrid } from '@/components/products/product-grid'
import { categories, products } from '@/lib/products-data'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 12)
  const mainCategories = categories.slice(0, 6)

  return (
    <MainLayout>
      {/* Compact Hero Banner */}
      <div className="bg-gradient-to-r from-[#37475A] to-[#232F3E] text-white rounded-lg p-6 mb-5">
        <div className="max-w-2xl">
          <h1 className="text-xl font-bold mb-2">Quality Used Electronics at Unbeatable Prices</h1>
          <p className="text-sm text-gray-200 mb-3">Shop refurbished computers, monitors, and electronics with warranty included.</p>
          <Link href="/products">
            <Button className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] text-sm h-8 px-4">
              Shop All Products
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories Grid - Compact */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {mainCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="bg-white dark:bg-[#1E2732] border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-semibold text-center line-clamp-2 h-10">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Featured Products</h2>
          <Link href="/products" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
            See all products
          </Link>
        </div>
        <ProductGrid initialProducts={featuredProducts} showFilters={false} />
      </div>

      {/* Features - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-[#1E2732] border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">✓</div>
          <h3 className="text-sm font-semibold mb-1">Condition Guarantee</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Graded accurately with photos</p>
        </div>
        <div className="bg-white dark:bg-[#1E2732] border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🚚</div>
          <h3 className="text-sm font-semibold mb-1">Fast Shipping</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Local pickup available</p>
        </div>
        <div className="bg-white dark:bg-[#1E2732] border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🛡️</div>
          <h3 className="text-sm font-semibold mb-1">Warranty Included</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Up to 12 months coverage</p>
        </div>
      </div>
    </MainLayout>
  )
}
