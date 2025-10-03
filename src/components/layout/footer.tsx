import Link from 'next/link'
import { Package, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Boom Warehouse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted source for quality used electronics, computers, and appliances
              in the Warrensville Heights area.
            </p>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Warrensville Heights, OH</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(216) 555-0123</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@boomwarehouse.com</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Shop Categories</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/category/computers--electronics" className="hover:underline">
                Computers & Electronics
              </Link>
              <Link href="/category/computer-parts" className="hover:underline">
                Computer Parts
              </Link>
              <Link href="/category/monitors--displays" className="hover:underline">
                Monitors & Displays
              </Link>
              <Link href="/category/mobile-devices" className="hover:underline">
                Mobile Devices
              </Link>
              <Link href="/category/appliances" className="hover:underline">
                Appliances
              </Link>
              <Link href="/category/electronics" className="hover:underline">
                Electronics
              </Link>
            </div>          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
              <Link href="/shipping" className="hover:underline">
                Shipping Info
              </Link>
              <Link href="/returns" className="hover:underline">
                Returns & Exchanges
              </Link>
              <Link href="/warranty" className="hover:underline">
                Warranty
              </Link>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="font-semibold">Policies</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/condition-guide" className="hover:underline">
                Condition Guide
              </Link>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Business Hours</h4>
              <div className="text-sm text-muted-foreground">
                <p>Mon-Fri: 9AM - 7PM</p>
                <p>Saturday: 10AM - 6PM</p>
                <p>Sunday: 12PM - 5PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 Boom Warehouse. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>We accept major credit cards and PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}