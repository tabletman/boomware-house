/**
 * 404 Not Found Page
 * Displayed when a route doesn't exist
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-6xl font-bold text-primary">404</span>
          </div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription className="text-base mt-2">
            Sorry, we couldn't find the page you're looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Suggestions */}
          <div className="bg-muted rounded-lg p-6">
            <p className="font-semibold mb-3">Looking for something?</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Check the URL for typos</li>
              <li>• Browse our product categories</li>
              <li>• Use the search bar to find what you need</li>
              <li>• Visit our homepage to start fresh</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">
                <Search className="mr-2 h-4 w-4" />
                Products
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </Button>
          </div>

          {/* Popular Categories */}
          <div>
            <p className="font-semibold mb-3 text-sm">Popular Categories:</p>
            <div className="flex flex-wrap gap-2">
              {['Computers', 'Monitors', 'Electronics', 'Gaming', 'Appliances'].map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-full text-sm transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
