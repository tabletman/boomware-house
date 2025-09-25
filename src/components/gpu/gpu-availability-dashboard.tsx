'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GPU_MODELS, type GPUModel } from '@/lib/gpu-data'
import { Activity, Cpu, Zap, DollarSign, TrendingUp, Clock, Server, AlertCircle } from 'lucide-react'

interface GPUAvailabilityStatus {
  id: string
  model: GPUModel
  available: number
  total: number
  currentPrice: number
  utilizationRate: number
  uptime: number
  status: 'online' | 'maintenance' | 'offline'
  location: string
  lastUpdate: Date
}

// Simulate real-time GPU availability data
const generateGPUStatus = (): GPUAvailabilityStatus[] => {
  return GPU_MODELS.map((gpu, index) => ({
    id: `gpu-${gpu.id}-${index}`,
    model: gpu,
    available: Math.floor(Math.random() * 15) + 1,
    total: Math.floor(Math.random() * 20) + 15,
    currentPrice: gpu.pricing.hourly.min + Math.random() * (gpu.pricing.hourly.max - gpu.pricing.hourly.min),
    utilizationRate: Math.floor(Math.random() * 40) + 60,
    uptime: 99.1 + Math.random() * 0.8,
    status: Math.random() > 0.15 ? 'online' : Math.random() > 0.5 ? 'maintenance' : 'offline',
    location: ['US-East-1', 'EU-West-1', 'Asia-Pacific-1', 'US-West-2'][Math.floor(Math.random() * 4)],
    lastUpdate: new Date(Date.now() - Math.random() * 300000) // Last 5 minutes
  }))
}

export function GPUAvailabilityDashboard() {
  const [gpuStatuses, setGpuStatuses] = useState<GPUAvailabilityStatus[]>([])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    // Initial load
    setGpuStatuses(generateGPUStatus())

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive) {
        setGpuStatuses(generateGPUStatus())
        setLastUpdated(new Date())
      }
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'maintenance': return 'bg-yellow-500'
      case 'offline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'maintenance': return 'Maintenance'
      case 'offline': return 'Offline'
      default: return 'Unknown'
    }
  }

  const totalAvailable = gpuStatuses.reduce((sum, gpu) => sum + gpu.available, 0)
  const totalGPUs = gpuStatuses.reduce((sum, gpu) => sum + gpu.total, 0)
  const averageUtilization = gpuStatuses.reduce((sum, gpu) => sum + gpu.utilizationRate, 0) / gpuStatuses.length
  const averageUptime = gpuStatuses.reduce((sum, gpu) => sum + gpu.uptime, 0) / gpuStatuses.length

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">GPU Availability Dashboard</h2>
          <p className="text-muted-foreground">Real-time GPU cluster status and availability</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span>{isLive ? 'Live' : 'Paused'}</span>
            <span>•</span>
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause Updates' : 'Resume Updates'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available GPUs</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAvailable}</div>
            <p className="text-xs text-muted-foreground">of {totalGPUs} total GPUs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageUtilization.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">across all GPUs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{averageUptime.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">30-day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue/Hour</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ${gpuStatuses.reduce((sum, gpu) => sum + gpu.currentPrice * gpu.available, 0).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">current potential</p>
          </CardContent>
        </Card>
      </div>

      {/* GPU Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {gpuStatuses.map((gpuStatus) => (
          <Card key={gpuStatus.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{gpuStatus.model.shortName}</CardTitle>
                  <CardDescription className="text-sm">
                    {gpuStatus.model.memory} • {gpuStatus.location}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(gpuStatus.status)}`} />
                  <Badge variant={gpuStatus.status === 'online' ? 'default' : 'secondary'}>
                    {getStatusText(gpuStatus.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Availability */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Available</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {gpuStatus.available} / {gpuStatus.total}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((gpuStatus.available / gpuStatus.total) * 100).toFixed(0)}% free
                  </div>
                </div>
              </div>

              {/* Current Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Current Rate</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${gpuStatus.currentPrice.toFixed(3)}/hr</div>
                  <div className="text-xs text-muted-foreground">
                    ${(gpuStatus.currentPrice * 24).toFixed(0)}/day
                  </div>
                </div>
              </div>

              {/* Utilization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Utilization</span>
                  </div>
                  <span className="text-sm font-semibold">{gpuStatus.utilizationRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${gpuStatus.utilizationRate}%` }}
                  />
                </div>
              </div>

              {/* Uptime */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Uptime</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-600">{gpuStatus.uptime.toFixed(2)}%</div>
                  <div className="text-xs text-muted-foreground">30 days</div>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Gaming</div>
                  <div className="font-semibold text-sm">{gpuStatus.model.performance.gaming}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">ML</div>
                  <div className="font-semibold text-sm">{gpuStatus.model.performance.ml}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Render</div>
                  <div className="font-semibold text-sm">{gpuStatus.model.performance.rendering}</div>
                </div>
              </div>

              {/* Power Consumption */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span>Power Draw</span>
                </div>
                <span className="font-medium">{gpuStatus.model.powerConsumption}W</span>
              </div>

              {/* Last Update */}
              <div className="text-xs text-muted-foreground border-t pt-2">
                Updated {Math.floor((Date.now() - gpuStatus.lastUpdate.getTime()) / 1000)}s ago
              </div>
            </CardContent>

            {/* Status indicator overlay */}
            {gpuStatus.status !== 'online' && (
              <div className="absolute top-2 right-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground border-t pt-6">
        <p>Dashboard updates every 15 seconds. Prices are dynamic and subject to market demand.</p>
        <p>All GPUs feature container isolation, 99.9%+ uptime SLA, and enterprise-grade security.</p>
      </div>
    </div>
  )
}