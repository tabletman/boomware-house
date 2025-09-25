'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLATFORMS, GPU_MODELS, type Platform } from '@/lib/gpu-data'
import {
  Users,
  DollarSign,
  Clock,
  Shield,
  TrendingUp,
  CheckCircle,
  XCircle,
  Star,
  Zap,
  Globe,
  Award,
  AlertCircle,
  ExternalLink,
  Wifi,
  Container,
  Server
} from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'

interface ComparisonMetric {
  name: string
  platforms: Record<string, number | string>
  format: 'percentage' | 'currency' | 'text' | 'rating'
  higherIsBetter: boolean
}

const comparisonMetrics: ComparisonMetric[] = [
  {
    name: 'Revenue Share',
    platforms: {},
    format: 'percentage',
    higherIsBetter: true
  },
  {
    name: 'Market Share',
    platforms: {},
    format: 'percentage',
    higherIsBetter: true
  },
  {
    name: 'User Rating',
    platforms: {},
    format: 'rating',
    higherIsBetter: true
  },
  {
    name: 'Min Uptime',
    platforms: {},
    format: 'percentage',
    higherIsBetter: true
  },
  {
    name: 'Payout Frequency',
    platforms: {},
    format: 'text',
    higherIsBetter: false
  }
]

// Initialize metrics with platform data
PLATFORMS.forEach(platform => {
  comparisonMetrics[0].platforms[platform.id] = platform.revenueShare
  comparisonMetrics[1].platforms[platform.id] = platform.marketShare
  comparisonMetrics[2].platforms[platform.id] = platform.userRating
  comparisonMetrics[3].platforms[platform.id] = platform.minimumUptime
  comparisonMetrics[4].platforms[platform.id] = platform.payoutFrequency
})

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export function PlatformComparison() {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'market' | 'requirements'>('revenue')
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(
    new Set(PLATFORMS.slice(0, 3).map(p => p.id))
  )

  const togglePlatform = (platformId: string) => {
    const newSelected = new Set(selectedPlatforms)
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId)
    } else {
      newSelected.add(platformId)
    }
    setSelectedPlatforms(newSelected)
  }

  const filteredPlatforms = PLATFORMS.filter(p => selectedPlatforms.has(p.id))

  // Chart data for revenue share comparison
  const revenueShareData = PLATFORMS.map((platform, index) => ({
    name: platform.name,
    revenueShare: platform.revenueShare,
    marketShare: platform.marketShare,
    userRating: platform.userRating * 20, // Scale to 100 for chart
    fill: COLORS[index % COLORS.length]
  }))

  // Market share pie chart data
  const marketShareData = PLATFORMS.map((platform, index) => ({
    name: platform.name,
    value: platform.marketShare,
    fill: COLORS[index % COLORS.length]
  }))

  const getScoreColor = (score: number, metric: ComparisonMetric) => {
    if (metric.format === 'rating') {
      if (score >= 4.5) return 'text-green-600'
      if (score >= 4.0) return 'text-blue-600'
      if (score >= 3.5) return 'text-yellow-600'
      return 'text-red-600'
    }

    const values = Object.values(metric.platforms) as number[]
    const max = Math.max(...values)
    const min = Math.min(...values)

    if (metric.higherIsBetter) {
      if (score === max) return 'text-green-600'
      if (score > (max + min) / 2) return 'text-blue-600'
      return 'text-orange-600'
    } else {
      if (score === min) return 'text-green-600'
      if (score < (max + min) / 2) return 'text-blue-600'
      return 'text-orange-600'
    }
  }

  const formatMetricValue = (value: number | string, format: string) => {
    if (typeof value === 'string') return value

    switch (format) {
      case 'percentage':
        return `${value}%`
      case 'currency':
        return `$${value.toFixed(2)}`
      case 'rating':
        return `${value.toFixed(1)}/5`
      default:
        return value.toString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          GPU Rental Platform Comparison
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Compare revenue shares, requirements, and features across major GPU rental platforms to maximize your earnings
        </p>
      </div>

      {/* Platform Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Platforms to Compare</CardTitle>
          <CardDescription>Choose which platforms you want to analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map((platform) => (
              <Button
                key={platform.id}
                variant={selectedPlatforms.has(platform.id) ? "default" : "outline"}
                onClick={() => togglePlatform(platform.id)}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <div className="font-semibold">{platform.name}</div>
                <div className="text-xs opacity-75">{platform.revenueShare}% share</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Share & Market Position</CardTitle>
            <CardDescription>Compare provider revenue shares across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueShareData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenueShare' ? `${value}%` :
                      name === 'marketShare' ? `${value}%` :
                      `${(value/20).toFixed(1)}/5`,
                      name === 'revenueShare' ? 'Revenue Share' :
                      name === 'marketShare' ? 'Market Share' : 'User Rating'
                    ]}
                  />
                  <Bar dataKey="revenueShare" name="Revenue Share" fill="#10b981" />
                  <Bar dataKey="marketShare" name="Market Share" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Share Distribution</CardTitle>
            <CardDescription>Platform dominance in the GPU rental market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Market Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {marketShareData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Platform Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Platform Analysis</CardTitle>
          <CardDescription>Side-by-side comparison of selected platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Feature</th>
                  {filteredPlatforms.map((platform) => (
                    <th key={platform.id} className="text-center py-3 px-4 font-semibold min-w-[150px]">
                      <div className="flex flex-col items-center gap-1">
                        <span>{platform.name}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{platform.userRating}/5</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Revenue Share */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Revenue Share
                  </td>
                  {filteredPlatforms.map((platform) => (
                    <td key={platform.id} className="text-center py-3 px-4">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {platform.revenueShare}%
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Minimum Uptime */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Min Uptime Required
                  </td>
                  {filteredPlatforms.map((platform) => (
                    <td key={platform.id} className="text-center py-3 px-4">
                      <Badge variant={platform.minimumUptime >= 99 ? "default" : "secondary"}>
                        {platform.minimumUptime}%
                      </Badge>
                    </td>
                  ))}
                </tr>

                {/* Payout Frequency */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    Payout Frequency
                  </td>
                  {filteredPlatforms.map((platform) => (
                    <td key={platform.id} className="text-center py-3 px-4">
                      <Badge variant="outline">{platform.payoutFrequency}</Badge>
                    </td>
                  ))}
                </tr>

                {/* Bandwidth Requirements */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-orange-600" />
                    Bandwidth Required
                  </td>
                  {filteredPlatforms.map((platform) => (
                    <td key={platform.id} className="text-center py-3 px-4 text-sm">
                      {platform.requirements.bandwidth}
                    </td>
                  ))}
                </tr>

                {/* Container Support */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Container className="h-4 w-4 text-blue-600" />
                    Container Support
                  </td>
                  {filteredPlatforms.map((platform) => (
                    <td key={platform.id} className="text-center py-3 px-4">
                      {platform.requirements.container ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Kubernetes Support */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <Server className="h-4 w-4 text-indigo-600" />
                    Kubernetes Support
                  </td>
                  {filteredPlatforms.map((platform) => (
                    <td key={platform.id} className="text-center py-3 px-4">
                      {platform.requirements.kubernetes ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Market Share */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Market Share
                  </td>
                  {filteredPlatforms.map((platform) => (
                    <td key={platform.id} className="text-center py-3 px-4">
                      <Badge variant="outline">{platform.marketShare}%</Badge>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Platform Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlatforms.map((platform) => (
          <Card key={platform.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {platform.name}
                    <Badge variant="default">{platform.revenueShare}% share</Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">{platform.description}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{platform.userRating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Features */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Key Features
                </h4>
                <div className="grid grid-cols-2 gap-1">
                  {platform.features.map((feature, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-1">
                      <div className="w-1 h-1 bg-blue-600 rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-700 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Pros
                  </h4>
                  <ul className="space-y-1">
                    {platform.pros.slice(0, 3).map((pro, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-orange-700 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Cons
                  </h4>
                  <ul className="space-y-1">
                    {platform.cons.slice(0, 3).map((con, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                        <div className="w-1 h-1 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Security Requirements */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Security Requirements
                </h4>
                <div className="flex flex-wrap gap-1">
                  {platform.requirements.security.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Supported GPUs */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  Supported GPUs
                </h4>
                <div className="flex flex-wrap gap-1">
                  {platform.supportedGPUs.map((gpuId) => {
                    const gpu = GPU_MODELS.find(g => g.id === gpuId)
                    return gpu ? (
                      <Badge key={gpuId} variant="secondary" className="text-xs">
                        {gpu.shortName}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>

              {/* External Link */}
              <div className="pt-2 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href={platform.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    Visit {platform.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Platform Recommendations
          </CardTitle>
          <CardDescription>
            Choose the best platform based on your priorities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-700">💰 Maximum Revenue</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Akash Network</strong> offers the highest revenue share at 85% plus daily blockchain payouts, ideal for maximizing earnings.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-700">🎯 Best Overall</h4>
              <p className="text-sm text-muted-foreground">
                <strong>TensorDock</strong> provides excellent balance of revenue share (75%), premium customers, and enterprise features.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-700">📈 Market Leader</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Vast.ai</strong> dominates market share (35%) with the largest customer base and easiest setup process.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}