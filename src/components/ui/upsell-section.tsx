'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/product-image'
import { Plus, ShoppingCart, Zap } from 'lucide-react'
import { Product } from '@/lib/products-data'

interface UpsellItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  image: string
  compatibility: string
  category: 'RAM' | 'Storage' | 'Accessories' | 'Cables' | 'Software'
}

// Sample upsell items that would complement electronics purchases
const upsellItems: UpsellItem[] = [
  {
    id: 'ram-8gb',
    name: 'Crucial 8GB DDR4 RAM',
    price: 29.99,
    originalPrice: 49.99,
    description: 'Boost your computer\'s performance with additional memory',
    image: '/images/upsells/ram-8gb.jpg',
    compatibility: 'Compatible with most desktop computers',
    category: 'RAM'
  },
  {
    id: 'ssd-500gb',
    name: 'Samsung 500GB SSD',
    price: 59.99,
    originalPrice: 89.99,
    description: 'Upgrade to faster storage for lightning-fast boot times',
    image: '/images/upsells/ssd-500gb.jpg',
    compatibility: 'SATA III compatible',
    category: 'Storage'
  },
  {
    id: 'wireless-mouse',
    name: 'Logitech Wireless Mouse',
    price: 19.99,
    originalPrice: 34.99,
    description: 'Ergonomic wireless mouse for comfortable computing',
    image: '/images/upsells/wireless-mouse.jpg',
    compatibility: 'Works with all computers',
    category: 'Accessories'
  },
  {
    id: 'hdmi-cable',
    name: 'Premium HDMI Cable 6ft',
    price: 9.99,
    originalPrice: 19.99,
    description: 'High-quality 4K HDMI cable for crisp display connection',
    image: '/images/upsells/hdmi-cable.jpg',
    compatibility: 'HDMI 2.0 standard',
    category: 'Cables'
  },
  {
    id: 'office-365',
    name: 'Microsoft Office 365 (1 Year)',
    price: 69.99,
    originalPrice: 99.99,
    description: 'Complete productivity suite for work and home',
    image: '/images/upsells/office-365.jpg',
    compatibility: 'Works on Windows and Mac',
    category: 'Software'
  }
]

interface UpsellSectionProps {
  product: Product
  className?: string
}

export function UpsellSection({ product, className = '' }: UpsellSectionProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Filter relevant upsell items based on product category
  const getRelevantUpsells = (product: Product): UpsellItem[] => {
    const category = product.category.toLowerCase()

    if (category.includes('computer') || category.includes('laptop')) {
      return upsellItems.filter(item =>
        ['RAM', 'Storage', 'Accessories', 'Software'].includes(item.category)
      )
    } else if (category.includes('tv') || category.includes('monitor')) {
      return upsellItems.filter(item =>
        ['Cables', 'Accessories'].includes(item.category)
      )
    } else if (category.includes('appliance')) {
      return upsellItems.filter(item =>
        ['Accessories', 'Cables'].includes(item.category)
      )
    }

    // Default upsells for other categories
    return upsellItems.slice(0, 3)
  }

  const relevantUpsells = getRelevantUpsells(product)

  if (relevantUpsells.length === 0) {
    return null
  }

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectedTotal = selectedItems.reduce((total, itemId) => {
    const item = upsellItems.find(i => i.id === itemId)
    return total + (item?.price || 0)
  }, 0)

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-t pt-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Complete Your Setup</h3>
          <Badge variant="secondary" className="ml-2">Save up to 40%</Badge>
        </div>

        <p className="text-muted-foreground mb-6">
          Enhance your {product.name} with these complementary items at special bundle prices:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {relevantUpsells.map((item) => {
            const isSelected = selectedItems.includes(item.id)

            return (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:shadow-md'
                }`}
                onClick={() => toggleItem(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-muted/20 to-muted/40 rounded relative overflow-hidden flex-shrink-0">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-tight line-clamp-2">
                          {item.name}
                        </h4>
                        <Button
                          size="sm"
                          variant={isSelected ? "default" : "outline"}
                          className="ml-2 flex-shrink-0"
                        >
                          <Plus className={`h-3 w-3 ${isSelected ? 'rotate-45' : ''} transition-transform`} />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-sm">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-primary mt-1">
                        {item.compatibility}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bundle Summary */}
        {selectedItems.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Bundle Total</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedItems.length} additional item{selectedItems.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      ${(product.price + selectedTotal).toFixed(2)}
                    </span>
                    <Badge variant="default">
                      Save ${(relevantUpsells
                        .filter(item => selectedItems.includes(item.id))
                        .reduce((total, item) => total + ((item.originalPrice || item.price) - item.price), 0)
                      ).toFixed(2)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    vs ${(product.price + selectedItems.reduce((total, itemId) => {
                      const item = upsellItems.find(i => i.id === itemId)
                      return total + (item?.originalPrice || item?.price || 0)
                    }, 0)).toFixed(2)} separately
                  </p>
                </div>
              </div>

              <Button className="w-full mt-4" size="lg">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add Bundle to Cart - ${(product.price + selectedTotal).toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}