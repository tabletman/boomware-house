'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Search, Menu, X, User, Package, ChevronDown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isGPUMenuOpen, setIsGPUMenuOpen] = useState(false)

  const navigation = [
    { name: 'Shop All', href: '/products' },
    { name: 'Computers', href: '/category/computers-laptops' },
    { name: 'Parts', href: '/category/computer-parts' },
    { name: 'Monitors', href: '/category/monitors-displays' },
    { name: 'Mobile', href: '/category/mobile-devices' },
    { name: 'Gaming', href: '/category/gaming' },
  ]

  const gpuMenuItems = [
    { name: 'Overview', href: '/gpu-rental', description: 'GPU rental platform overview' },
    { name: 'AI Researchers', href: '/gpu-rental/ai-researchers', description: 'Academic pricing & credits' },
    { name: 'ML Engineers', href: '/gpu-rental/ml-engineers', description: 'API access & technical docs' },
    { name: 'Startups', href: '/gpu-rental/startups', description: 'Flexible pricing & scaling' },
    { name: 'Game Developers', href: '/gpu-rental/game-developers', description: 'Rendering benchmarks' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Boom Warehouse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.name}
            </Link>
          ))}

          {/* GPU Rental Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsGPUMenuOpen(true)}
            onMouseLeave={() => setIsGPUMenuOpen(false)}
          >
            <button className="flex items-center space-x-1 transition-colors hover:text-foreground/80 text-foreground/60">
              <Zap className="h-4 w-4" />
              <span>GPU Rental</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {isGPUMenuOpen && (
              <div className="absolute top-full left-0 w-64 mt-2 bg-white rounded-md shadow-lg border z-50">
                <div className="p-2">
                  {gpuMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors"
                      onClick={() => setIsGPUMenuOpen(false)}
                    >
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Search */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>

          {/* User Account */}
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              0
            </span>
            <span className="sr-only">Shopping cart</span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="grid gap-2 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* GPU Rental Mobile Menu */}
            <div className="border-t pt-2">
              <div className="px-3 py-2 text-base font-medium text-gray-900 flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" />
                GPU Rental
              </div>
              {gpuMenuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block ml-6 px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </Link>
              ))}
            </div>

            <div className="border-t pt-2">
              <Link
                href="/account"
                className="flex items-center rounded-md px-3 py-2 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="mr-2 h-5 w-5" />
                Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}