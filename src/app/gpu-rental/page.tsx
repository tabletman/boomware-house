'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GPU_MODELS, PLATFORMS, calculateROI, MARKET_DATA, type GPUModel } from '@/lib/gpu-data'
import {
  Zap,
  DollarSign,
  TrendingUp,
  Server,
  Shield,
  Clock,
  Globe,
  CheckCircle,
  ArrowRight,
  Cpu,
  BarChart3,
  Users,
  Gamepad2,
  Brain,
  Code
} from 'lucide-react'

export default function GPURentalPage() {
  const [liveStats, setLiveStats] = useState({
    rtx4090Hourly: 0.54,
    h100Hourly: 3.76,
    totalAvailable: 245,
    activePlatforms: 4
  })

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        rtx4090Hourly: 0.34 + Math.random() * 0.41, // $0.34-0.75
        h100Hourly: 3.35 + Math.random() * 0.83,    // $3.35-4.18
        totalAvailable: 230 + Math.floor(Math.random() * 30),
        activePlatforms: 4
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const topGPUs = GPU_MODELS.slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Live GPU Monetization Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Turn Your GPUs Into
              <br />
              <span className="text-green-400">Profit Machines</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Monetize your idle RTX 4090s and H100s with our enterprise-grade compute marketplace.
              Earn $180-$345/month per GPU at 50-80% utilization rates.
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  ${liveStats.rtx4090Hourly.toFixed(3)}
                </div>
                <div className="text-sm text-blue-200">RTX 4090/hour</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-emerald-400">
                  ${liveStats.h100Hourly.toFixed(2)}
                </div>
                <div className="text-sm text-blue-200">H100/hour</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-400">
                  {liveStats.totalAvailable}
                </div>
                <div className="text-sm text-blue-200">GPUs Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">
                  4-10
                </div>
                <div className="text-sm text-blue-200">Month Payback</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8">
                Start Earning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Calculate Your ROI
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Comparison Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare leading GPU rental platforms and find the best fit for your hardware and requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLATFORMS.slice(0, 3).map((platform) => (
              <Card key={platform.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">{platform.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {platform.revenueShare}% Share
                    </Badge>
                  </div>
                  <CardDescription className="text-lg">{platform.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{platform.userRating}</div>
                      <div className="text-sm text-gray-600">User Rating</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{platform.marketShare}%</div>
                      <div className="text-sm text-gray-600">Market Share</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Advantages</h4>
                    <ul className="space-y-1">
                      {platform.pros.slice(0, 3).map((pro, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">{platform.requirements.uptime} uptime</Badge>
                      <Badge variant="outline" className="text-xs">{platform.payoutFrequency} payouts</Badge>
                    </div>
                  </div>

                  <Button className="w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GPU Showcase Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Top Earning GPUs</h2>
            <p className="text-xl text-gray-600">Maximize your returns with the most in-demand graphics cards</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {topGPUs.map((gpu, index) => {
              const roi = calculateROI(gpu, 70) // 70% utilization
              return (
                <Card key={gpu.id} className={`relative overflow-hidden ${index === 0 ? 'ring-2 ring-green-500' : ''}`}>
                  {index === 0 && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{gpu.shortName}</CardTitle>
                      <Cpu className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardDescription className="text-lg">{gpu.memory} • {gpu.architecture}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${gpu.pricing.hourly.average.toFixed(3)}
                        </div>
                        <div className="text-sm text-gray-600">per hour</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${gpu.pricing.monthly.average}
                        </div>
                        <div className="text-sm text-gray-600">per month</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Gaming Performance</span>
                        <span className="text-sm text-green-600 font-semibold">{gpu.performance.gaming}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                          style={{ width: `${gpu.performance.gaming}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">ML Performance</span>
                        <span className="text-sm text-blue-600 font-semibold">{gpu.performance.ml}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${gpu.performance.ml}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-sm text-yellow-800">
                        <strong>ROI at 70% utilization:</strong>
                        <br />
                        {roi.paybackMonths < 12 ? `${roi.paybackMonths.toFixed(1)} months payback` : 'Long-term investment'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Audience Sections */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Solutions for Every User</h2>
            <p className="text-xl text-gray-600">Tailored GPU rental solutions for different needs and budgets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* AI Researchers */}
            <Link href="/gpu-rental/ai-researchers">
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Brain className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle>AI Researchers</CardTitle>
                  <CardDescription>Academic pricing and research credits</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Educational discounts
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Flexible scheduling
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Research collaboration tools
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            {/* ML Engineers */}
            <Link href="/gpu-rental/ml-engineers">
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <Code className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>ML Engineers</CardTitle>
                  <CardDescription>API access and technical documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      REST API integration
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Custom environments
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Performance monitoring
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            {/* Startups */}
            <Link href="/gpu-rental/startups">
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle>Startups</CardTitle>
                  <CardDescription>Flexible pricing and scaling options</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Pay-as-you-scale
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Startup credits
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Technical support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            {/* Game Developers */}
            <Link href="/gpu-rental/game-developers">
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                    <Gamepad2 className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle>Game Developers</CardTitle>
                  <CardDescription>Rendering benchmarks and optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Ray tracing support
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Rendering farms
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Asset streaming
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Technical Requirements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Technical Requirements</h2>
            <p className="text-xl text-gray-600">Ensure your setup meets our enterprise-grade standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Network</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-2">100+ Mbps</div>
                <div className="text-sm text-gray-600">Minimum bandwidth with low latency</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">99.9%+</div>
                <div className="text-sm text-gray-600">Industry-leading reliability</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-2">SOC 2</div>
                <div className="text-sm text-gray-600">Enterprise security compliance</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                <CardTitle>Power</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 mb-2">Stable</div>
                <div className="text-sm text-gray-600">Uninterrupted power supply recommended</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl mb-8 text-green-100">
              Join thousands of GPU owners already earning passive income with their hardware.
              Get started in under 10 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}