import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Shield, Check, AlertTriangle, Info, Star } from 'lucide-react'

export default function ConditionGuidePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container pl-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Our <span className="text-primary">Condition Grading</span> System
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Every item at Boom Warehouse is professionally inspected and graded to ensure you know exactly what you're getting.
              Our transparent grading system guarantees quality and builds trust.
            </p>
          </div>
        </div>
      </section>

      {/* Grading System */}
      <section className="py-16">
        <div className="container pl-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Grading Standards</h2>
            <p className="text-muted-foreground mt-4">
              Professional inspection and transparent condition reporting for every product
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Grade A */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Grade A
                  </Badge>
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Like New Condition</CardTitle>
                <CardDescription>
                  Excellent cosmetic and functional condition with minimal signs of use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Minor or no cosmetic wear</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Fully functional with all features working</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Original accessories included (when available)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">90-day warranty included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Grade B */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    Grade B
                  </Badge>
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Good Condition</CardTitle>
                <CardDescription>
                  Light wear with excellent functionality and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Light cosmetic wear or scratches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Fully functional with all features working</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">May include generic accessories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">60-day warranty included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Grade C */}
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Grade C
                  </Badge>
                  <Info className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle className="text-yellow-800">Fair Condition</CardTitle>
                <CardDescription>
                  Moderate wear but fully functional and reliable performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Moderate cosmetic wear, scratches, or scuffs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Fully functional with all core features working</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Essential accessories included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">30-day warranty included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Grade D */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Grade D
                  </Badge>
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-red-800">Budget Condition</CardTitle>
                <CardDescription>
                  Heavy wear but functional - perfect for budget-conscious buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Heavy cosmetic wear, scratches, or dents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Functional with core features working</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Basic accessories only</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-red-600" />
                    <span className="text-sm">15-day warranty included</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Inspection Process */}
      <section className="py-16 bg-muted/50">
        <div className="container pl-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Inspection Process</h2>
            <p className="text-muted-foreground mt-4">
              Every item goes through our comprehensive quality assurance process
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card>
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-primary/10 text-primary mx-auto mb-4 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">1</span>
                </div>
                <CardTitle>Visual Inspection</CardTitle>
                <CardDescription>
                  Comprehensive cosmetic evaluation including scratches, dents, and overall appearance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-primary/10 text-primary mx-auto mb-4 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">2</span>
                </div>
                <CardTitle>Functional Testing</CardTitle>
                <CardDescription>
                  Complete functionality testing including all ports, buttons, and features
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="h-12 w-12 bg-primary/10 text-primary mx-auto mb-4 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">3</span>
                </div>
                <CardTitle>Performance Verification</CardTitle>
                <CardDescription>
                  Performance benchmarking to ensure optimal operation and reliability
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container pl-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Shop with Confidence
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our transparent grading system ensures you get exactly what you expect.
              Browse our inventory of professionally graded electronics.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}