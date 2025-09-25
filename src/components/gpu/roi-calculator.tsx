'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GPU_MODELS,
  PLATFORMS,
  OPERATING_COSTS,
  calculateROI,
  type GPUModel,
  type Platform,
  type ROICalculation
} from '@/lib/gpu-data'
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Clock,
  Zap,
  Home,
  Building,
  Factory,
  Wifi,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Target,
  PieChart,
  BarChart3
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'

interface ScenarioComparison {
  gpuModel: string
  scenarios: Array<{
    name: string
    utilizationRate: number
    monthlyProfit: number
    paybackPeriod: number
    annualROI: number
  }>
}

const ELECTRICITY_TIERS = {
  residential: { rate: 0.13, label: 'Residential', icon: Home },
  commercial: { rate: 0.10, label: 'Commercial', icon: Building },
  industrial: { rate: 0.07, label: 'Industrial', icon: Factory }
}

const INTERNET_TIERS = {
  residential: { cost: 80, label: 'Residential 1Gbps' },
  business: { cost: 200, label: 'Business 1Gbps' },
  dedicated: { cost: 500, label: 'Dedicated Fiber' }
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export function ROICalculator() {
  const [selectedGPUs, setSelectedGPUs] = useState<Set<string>>(new Set(['rtx-4090', 'h100']))
  const [utilizationRange, setUtilizationRange] = useState([50, 80])
  const [electricityTier, setElectricityTier] = useState<keyof typeof ELECTRICITY_TIERS>('residential')
  const [internetTier, setInternetTier] = useState<keyof typeof INTERNET_TIERS>('residential')
  const [timeHorizon, setTimeHorizon] = useState(24) // months
  const [includeAdditionalCosts, setIncludeAdditionalCosts] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0])

  const roiCalculations = useMemo(() => {
    const calculations: Record<string, ROICalculation[]> = {}

    selectedGPUs.forEach(gpuId => {
      const gpu = GPU_MODELS.find(g => g.id === gpuId)
      if (!gpu) return

      calculations[gpuId] = [
        utilizationRange[0],
        (utilizationRange[0] + utilizationRange[1]) / 2,
        utilizationRange[1]
      ].map(utilization =>
        calculateROI(
          gpu,
          utilization,
          ELECTRICITY_TIERS[electricityTier].rate,
          INTERNET_TIERS[internetTier].cost
        )
      )
    })

    return calculations
  }, [selectedGPUs, utilizationRange, electricityTier, internetTier, selectedPlatform])

  // Chart data for payback period comparison
  const paybackComparisonData = useMemo(() => {
    return Array.from(selectedGPUs).map(gpuId => {
      const gpu = GPU_MODELS.find(g => g.id === gpuId)
      const calculations = roiCalculations[gpuId]
      if (!gpu || !calculations) return null

      return {
        name: gpu.shortName,
        lowUtil: calculations[0].paybackPeriod,
        avgUtil: calculations[1].paybackPeriod,
        highUtil: calculations[2].paybackPeriod,
        investment: gpu.basePrice
      }
    }).filter(Boolean)
  }, [selectedGPUs, roiCalculations])

  // Monthly profit projection data
  const profitProjectionData = useMemo(() => {
    const months = Array.from({ length: timeHorizon }, (_, i) => i + 1)

    return months.map(month => {
      const dataPoint: Record<string, number> = { month }

      selectedGPUs.forEach(gpuId => {
        const gpu = GPU_MODELS.find(g => g.id === gpuId)
        const calculations = roiCalculations[gpuId]
        if (!gpu || !calculations) return

        const avgCalculation = calculations[1] // Use average utilization
        const cumulativeProfit = avgCalculation.netProfit * month
        const netProfit = cumulativeProfit - gpu.basePrice // Subtract initial investment

        dataPoint[gpu.shortName] = Math.round(netProfit)
      })

      return dataPoint
    })
  }, [selectedGPUs, roiCalculations, timeHorizon])

  // Risk assessment data
  const riskAssessmentData = useMemo(() => {
    return Array.from(selectedGPUs).map((gpuId, index) => {
      const gpu = GPU_MODELS.find(g => g.id === gpuId)
      const calculations = roiCalculations[gpuId]
      if (!gpu || !calculations) return null

      const avgCalculation = calculations[1]
      const riskLevel =
        avgCalculation.paybackPeriod < 6 ? 'Low' :
        avgCalculation.paybackPeriod < 12 ? 'Medium' :
        avgCalculation.paybackPeriod < 18 ? 'High' : 'Very High'

      return {
        name: gpu.shortName,
        value: avgCalculation.paybackPeriod,
        risk: riskLevel,
        fill: COLORS[index % COLORS.length]
      }
    }).filter((item): item is { name: string; value: number; risk: string; fill: string } => item !== null)
  }, [selectedGPUs, roiCalculations])

  const toggleGPU = (gpuId: string) => {
    const newSelected = new Set(selectedGPUs)
    if (newSelected.has(gpuId)) {
      if (newSelected.size > 1) { // Keep at least one selected
        newSelected.delete(gpuId)
      }
    } else {
      newSelected.add(gpuId)
    }
    setSelectedGPUs(newSelected)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600'
      case 'Medium': return 'text-yellow-600'
      case 'High': return 'text-orange-600'
      case 'Very High': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          ROI Calculator & Investment Analysis
        </h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Comprehensive ROI analysis comparing GPU rental vs purchase scenarios with risk assessment and profit projections
        </p>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Parameters</CardTitle>
          <CardDescription>Configure your investment scenario and operating parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* GPU Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">GPU Models</label>
              <div className="space-y-2">
                {GPU_MODELS.map(gpu => (
                  <div key={gpu.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={gpu.id}
                      checked={selectedGPUs.has(gpu.id)}
                      onChange={() => toggleGPU(gpu.id)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={gpu.id} className="text-sm cursor-pointer flex-1">
                      {gpu.shortName}
                    </label>
                    <Badge variant="outline" className="text-xs">
                      ${gpu.basePrice.toLocaleString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Utilization Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Utilization Range</label>
                <Badge variant="outline">{utilizationRange[0]}% - {utilizationRange[1]}%</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Minimum Utilization</div>
                  <Slider
                    value={[utilizationRange[0]]}
                    onValueChange={(value) => setUtilizationRange([value[0], utilizationRange[1]])}
                    max={95}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Maximum Utilization</div>
                  <Slider
                    value={[utilizationRange[1]]}
                    onValueChange={(value) => setUtilizationRange([utilizationRange[0], value[0]])}
                    max={95}
                    min={utilizationRange[0]}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Operating Costs */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Operating Environment</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Electricity Rate</label>
                  <Select
                    value={electricityTier}
                    onValueChange={(value: keyof typeof ELECTRICITY_TIERS) => setElectricityTier(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ELECTRICITY_TIERS).map(([key, tier]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <tier.icon className="h-4 w-4" />
                            <span>{tier.label}</span>
                            <Badge variant="secondary">${tier.rate}/kWh</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Internet Plan</label>
                  <Select
                    value={internetTier}
                    onValueChange={(value: keyof typeof INTERNET_TIERS) => setInternetTier(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(INTERNET_TIERS).map(([key, tier]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center justify-between w-full">
                            <span>{tier.label}</span>
                            <Badge variant="secondary">${tier.cost}/mo</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Analysis Period */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Analysis Period</label>
                <Badge variant="outline">{timeHorizon} months</Badge>
              </div>
              <Slider
                value={[timeHorizon]}
                onValueChange={(value) => setTimeHorizon(value[0])}
                max={60}
                min={6}
                step={6}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>6 months</span>
                <span>5 years</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from(selectedGPUs).map(gpuId => {
              const gpu = GPU_MODELS.find(g => g.id === gpuId)
              const calculations = roiCalculations[gpuId]
              if (!gpu || !calculations) return null

              const [lowUtil, avgUtil, highUtil] = calculations

              return (
                <Card key={gpuId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{gpu.shortName}</CardTitle>
                      <Badge variant="secondary">{gpu.memory}</Badge>
                    </div>
                    <CardDescription>
                      Investment: ${gpu.basePrice.toLocaleString()} • {gpu.powerConsumption}W
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          ${avgUtil.netProfit.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Monthly Profit*</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {avgUtil.paybackPeriod < 100 ? avgUtil.paybackPeriod.toFixed(1) : '∞'}
                        </div>
                        <div className="text-xs text-muted-foreground">Payback (months)*</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {avgUtil.annualROI.toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Annual ROI*</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {avgUtil.breakEvenUtilization.toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Break-even Util</div>
                      </div>
                    </div>

                    {/* Utilization Scenarios */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Utilization Scenarios</h4>
                      <div className="space-y-2">
                        {[
                          { label: 'Conservative', data: lowUtil, color: 'text-orange-600' },
                          { label: 'Realistic', data: avgUtil, color: 'text-blue-600' },
                          { label: 'Optimistic', data: highUtil, color: 'text-green-600' }
                        ].map(({ label, data, color }) => (
                          <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
                            <div>
                              <div className="font-medium text-sm">{label}</div>
                              <div className="text-xs text-muted-foreground">
                                ${data.monthlyRevenue.toFixed(0)}/mo revenue
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${color}`}>
                                {data.paybackPeriod < 100 ? `${data.paybackPeriod.toFixed(1)}mo` : 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {data.annualROI.toFixed(0)}% ROI
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operating Costs Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Monthly Operating Costs</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            Electricity
                          </span>
                          <span>${avgUtil.monthlyOperatingCosts.electricity.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Wifi className="h-3 w-3 text-blue-500" />
                            Internet
                          </span>
                          <span>${avgUtil.monthlyOperatingCosts.internet.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-green-500" />
                            Maintenance
                          </span>
                          <span>${avgUtil.monthlyOperatingCosts.maintenance.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-purple-500" />
                            Insurance
                          </span>
                          <span>${avgUtil.monthlyOperatingCosts.insurance.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-1">
                          <span>Total</span>
                          <span>
                            ${Object.values(avgUtil.monthlyOperatingCosts).reduce((a, b) => a + b, 0).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            * Based on average utilization scenario ({Math.round((utilizationRange[0] + utilizationRange[1]) / 2)}%)
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payback Period Comparison</CardTitle>
              <CardDescription>Compare payback periods across different utilization scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={paybackComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Months', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        value < 100 ? `${value.toFixed(1)} months` : 'Not profitable',
                        name === 'lowUtil' ? 'Low Utilization' :
                        name === 'avgUtil' ? 'Average Utilization' : 'High Utilization'
                      ]}
                    />
                    <Bar dataKey="lowUtil" name="Low Util" fill="#ef4444" />
                    <Bar dataKey="avgUtil" name="Avg Util" fill="#3b82f6" />
                    <Bar dataKey="highUtil" name="High Util" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment vs Revenue Potential</CardTitle>
                <CardDescription>Initial investment compared to monthly revenue potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(selectedGPUs).map(gpuId => {
                    const gpu = GPU_MODELS.find(g => g.id === gpuId)
                    const calculations = roiCalculations[gpuId]
                    if (!gpu || !calculations) return null

                    const avgCalculation = calculations[1]
                    const revenueRatio = (avgCalculation.monthlyRevenue / gpu.basePrice) * 100

                    return (
                      <div key={gpuId} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{gpu.shortName}</span>
                          <Badge variant={revenueRatio > 5 ? "default" : "secondary"}>
                            {revenueRatio.toFixed(1)}% monthly
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Investment</span>
                            <span>${gpu.basePrice.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Monthly Revenue</span>
                            <span className="text-green-600">${avgCalculation.monthlyRevenue.toFixed(0)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${Math.min(revenueRatio * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ROI Comparison Matrix</CardTitle>
                <CardDescription>Annual ROI across different scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">GPU Model</th>
                        <th className="text-center py-2">Conservative</th>
                        <th className="text-center py-2">Realistic</th>
                        <th className="text-center py-2">Optimistic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(selectedGPUs).map(gpuId => {
                        const gpu = GPU_MODELS.find(g => g.id === gpuId)
                        const calculations = roiCalculations[gpuId]
                        if (!gpu || !calculations) return null

                        return (
                          <tr key={gpuId} className="border-b">
                            <td className="py-2 font-medium">{gpu.shortName}</td>
                            {calculations.map((calc, index) => (
                              <td key={index} className="text-center py-2">
                                <Badge
                                  variant={calc.annualROI > 50 ? "default" : calc.annualROI > 20 ? "secondary" : "outline"}
                                >
                                  {calc.annualROI.toFixed(0)}%
                                </Badge>
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projections Tab */}
        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit Projections Over Time</CardTitle>
              <CardDescription>
                Cumulative profit after initial investment over {timeHorizon} months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profitProjectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis
                      label={{ value: 'Cumulative Profit ($)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `$${value.toLocaleString()}`,
                        name
                      ]}
                    />
                    {Array.from(selectedGPUs).map((gpuId, index) => {
                      const gpu = GPU_MODELS.find(g => g.id === gpuId)
                      if (!gpu) return null

                      return (
                        <Line
                          key={gpuId}
                          type="monotone"
                          dataKey={gpu.shortName}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 2 }}
                        />
                      )
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Break-Even Analysis</CardTitle>
                <CardDescription>Time to recover initial investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(selectedGPUs).map(gpuId => {
                    const gpu = GPU_MODELS.find(g => g.id === gpuId)
                    const calculations = roiCalculations[gpuId]
                    if (!gpu || !calculations) return null

                    const avgCalculation = calculations[1]
                    const breakEvenMonth = Math.ceil(avgCalculation.paybackPeriod)
                    const isProfitable = avgCalculation.paybackPeriod < timeHorizon

                    return (
                      <div key={gpuId} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{gpu.shortName}</span>
                          <div className="flex items-center gap-2">
                            {isProfitable ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            )}
                            <Badge variant={isProfitable ? "default" : "secondary"}>
                              {breakEvenMonth} months
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${isProfitable ? 'bg-green-500' : 'bg-orange-500'}`}
                            style={{ width: `${Math.min((breakEvenMonth / timeHorizon) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Start</span>
                          <span>{timeHorizon} months</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sensitivity Analysis</CardTitle>
                <CardDescription>Impact of key variables on profitability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Electricity Rate Impact</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(ELECTRICITY_TIERS).map(([key, tier]) => {
                        const isSelected = key === electricityTier
                        return (
                          <div key={key} className={`flex justify-between p-2 rounded ${isSelected ? 'bg-blue-50' : ''}`}>
                            <span className="flex items-center gap-2">
                              <tier.icon className="h-3 w-3" />
                              {tier.label}
                            </span>
                            <span>${tier.rate}/kWh</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Market Demand Impact</h4>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex justify-between py-1">
                        <span>Low Demand (0.8x price)</span>
                        <span className="text-red-600">-20% ROI</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Normal Demand (1.0x price)</span>
                        <span className="text-blue-600">Baseline</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>High Demand (1.5x price)</span>
                        <span className="text-green-600">+50% ROI</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Investment risk levels based on payback period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={riskAssessmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskAssessmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `${value.toFixed(1)} months`,
                          'Risk Assessment'
                        ]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {riskAssessmentData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                      />
                      <span>{entry.name}</span>
                      <Badge variant="outline" className={getRiskColor(entry.risk)}>
                        {entry.risk}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Factors</CardTitle>
                <CardDescription>Key considerations for GPU rental investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      High Risk Factors
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Market demand volatility</li>
                      <li>• Technology obsolescence</li>
                      <li>• Platform policy changes</li>
                      <li>• Hardware failure risks</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-yellow-600 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Medium Risk Factors
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Electricity cost changes</li>
                      <li>• Internet connectivity issues</li>
                      <li>• Competition increase</li>
                      <li>• Regulatory changes</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Risk Mitigation
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Diversify across platforms</li>
                      <li>• Monitor utilization closely</li>
                      <li>• Maintain insurance coverage</li>
                      <li>• Plan for hardware upgrades</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Recommendations</CardTitle>
              <CardDescription>Personalized recommendations based on your configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from(selectedGPUs).slice(0, 3).map(gpuId => {
                  const gpu = GPU_MODELS.find(g => g.id === gpuId)
                  const calculations = roiCalculations[gpuId]
                  if (!gpu || !calculations) return null

                  const avgCalculation = calculations[1]
                  const recommendation =
                    avgCalculation.paybackPeriod < 8 ? 'Excellent Investment' :
                    avgCalculation.paybackPeriod < 12 ? 'Good Investment' :
                    avgCalculation.paybackPeriod < 18 ? 'Consider Carefully' : 'High Risk'

                  const recommendationColor =
                    avgCalculation.paybackPeriod < 8 ? 'text-green-600' :
                    avgCalculation.paybackPeriod < 12 ? 'text-blue-600' :
                    avgCalculation.paybackPeriod < 18 ? 'text-yellow-600' : 'text-red-600'

                  return (
                    <div key={gpuId} className="space-y-3 p-4 border rounded-lg">
                      <div className="text-center">
                        <h4 className="font-semibold">{gpu.shortName}</h4>
                        <Badge className={recommendationColor}>{recommendation}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Expected Payback:</span>
                          <span className="font-medium">
                            {avgCalculation.paybackPeriod.toFixed(1)} months
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual ROI:</span>
                          <span className="font-medium text-green-600">
                            {avgCalculation.annualROI.toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Profit:</span>
                          <span className="font-medium text-blue-600">
                            ${avgCalculation.netProfit.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}