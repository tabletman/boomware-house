'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GPU_MODELS, PLATFORMS, UTILIZATION_SCENARIOS, type GPUModel, type Platform } from '@/lib/gpu-data'
import { Calculator, DollarSign, Clock, Zap, TrendingUp, Info, Cpu, Server } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts'

interface CalculationResult {
  hourlyRevenue: number
  dailyRevenue: number
  monthlyRevenue: number
  yearlyRevenue: number
  electricityCost: number
  netProfit: {
    daily: number
    monthly: number
    yearly: number
  }
  paybackPeriod: number
  roi: number
}

export function PricingCalculator() {
  const [selectedGPU, setSelectedGPU] = useState<GPUModel>(GPU_MODELS[0])
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(PLATFORMS[0])
  const [utilizationRate, setUtilizationRate] = useState([70])
  const [electricityRate, setElectricityRate] = useState([0.13])
  const [gpuCount, setGpuCount] = useState([1])
  const [priceMultiplier, setPriceMultiplier] = useState([1.0])

  const calculations = useMemo((): CalculationResult => {
    const util = utilizationRate[0] / 100
    const effectivePrice = selectedGPU.pricing.hourly.average * priceMultiplier[0]
    const platformShare = selectedPlatform.revenueShare / 100

    // Base calculations
    const hourlyRevenue = effectivePrice * util * platformShare * gpuCount[0]
    const dailyRevenue = hourlyRevenue * 24
    const monthlyRevenue = dailyRevenue * 30.44 // Average days per month
    const yearlyRevenue = dailyRevenue * 365

    // Operating costs (electricity only for simplicity)
    const powerKW = (selectedGPU.powerConsumption * gpuCount[0]) / 1000
    const dailyElectricityCost = powerKW * 24 * electricityRate[0] * util
    const monthlyElectricityCost = dailyElectricityCost * 30.44
    const yearlyElectricityCost = dailyElectricityCost * 365

    // Net profits
    const netProfit = {
      daily: dailyRevenue - dailyElectricityCost,
      monthly: monthlyRevenue - monthlyElectricityCost,
      yearly: yearlyRevenue - yearlyElectricityCost
    }

    // ROI calculations
    const totalInvestment = selectedGPU.basePrice * gpuCount[0]
    const paybackPeriod = netProfit.monthly > 0 ? totalInvestment / netProfit.monthly : 0
    const roi = netProfit.yearly > 0 ? (netProfit.yearly / totalInvestment) * 100 : 0

    return {
      hourlyRevenue,
      dailyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      electricityCost: monthlyElectricityCost,
      netProfit,
      paybackPeriod,
      roi
    }
  }, [selectedGPU, selectedPlatform, utilizationRate, electricityRate, gpuCount, priceMultiplier])

  // Generate chart data for different utilization rates
  const chartData = useMemo(() => {
    return [30, 40, 50, 60, 70, 80, 90].map(util => {
      const utilDecimal = util / 100
      const effectivePrice = selectedGPU.pricing.hourly.average * priceMultiplier[0]
      const platformShare = selectedPlatform.revenueShare / 100
      const monthlyRevenue = effectivePrice * utilDecimal * platformShare * gpuCount[0] * 24 * 30.44

      const powerKW = (selectedGPU.powerConsumption * gpuCount[0]) / 1000
      const monthlyElectricity = powerKW * 24 * electricityRate[0] * utilDecimal * 30.44
      const netProfit = monthlyRevenue - monthlyElectricity

      return {
        utilization: `${util}%`,
        revenue: Math.round(monthlyRevenue),
        profit: Math.round(netProfit),
        electricity: Math.round(monthlyElectricity)
      }
    })
  }, [selectedGPU, selectedPlatform, electricityRate, gpuCount, priceMultiplier])

  const getUtilizationScenario = (rate: number) => {
    return UTILIZATION_SCENARIOS.find(scenario =>
      Math.abs(scenario.utilizationRate - rate) <= 10
    ) || UTILIZATION_SCENARIOS[1]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          GPU Rental Pricing Calculator
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Calculate potential revenue, costs, and ROI for GPU rental across different platforms and utilization scenarios
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Configuration
              </CardTitle>
              <CardDescription>Configure your GPU rental setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* GPU Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">GPU Model</label>
                <Select
                  value={selectedGPU.id}
                  onValueChange={(value) => {
                    const gpu = GPU_MODELS.find(g => g.id === value)
                    if (gpu) setSelectedGPU(gpu)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GPU_MODELS.map((gpu) => (
                      <SelectItem key={gpu.id} value={gpu.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{gpu.shortName}</span>
                          <Badge variant="secondary" className="ml-2">
                            ${gpu.pricing.hourly.average.toFixed(3)}/hr
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">
                  {selectedGPU.memory} • {selectedGPU.powerConsumption}W • ${selectedGPU.basePrice.toLocaleString()}
                </div>
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <Select
                  value={selectedPlatform.id}
                  onValueChange={(value) => {
                    const platform = PLATFORMS.find(p => p.id === value)
                    if (platform) setSelectedPlatform(platform)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{platform.name}</span>
                          <Badge variant="secondary" className="ml-2">
                            {platform.revenueShare}%
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">
                  {selectedPlatform.revenueShare}% revenue share • {selectedPlatform.payoutFrequency} payouts
                </div>
              </div>

              {/* GPU Count */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Number of GPUs</label>
                  <Badge variant="outline">{gpuCount[0]}</Badge>
                </div>
                <Slider
                  value={gpuCount}
                  onValueChange={setGpuCount}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 GPU</span>
                  <span>10 GPUs</span>
                </div>
              </div>

              {/* Utilization Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Utilization Rate</label>
                  <Badge variant="outline">{utilizationRate[0]}%</Badge>
                </div>
                <Slider
                  value={utilizationRate}
                  onValueChange={setUtilizationRate}
                  max={95}
                  min={10}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10%</span>
                  <span>95%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <strong>{getUtilizationScenario(utilizationRate[0]).name}:</strong>{' '}
                  {getUtilizationScenario(utilizationRate[0]).description}
                </div>
              </div>

              {/* Electricity Rate */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Electricity Rate</label>
                  <Badge variant="outline">${electricityRate[0].toFixed(3)}/kWh</Badge>
                </div>
                <Slider
                  value={electricityRate}
                  onValueChange={setElectricityRate}
                  max={0.30}
                  min={0.05}
                  step={0.01}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0.05/kWh</span>
                  <span>$0.30/kWh</span>
                </div>
              </div>

              {/* Price Multiplier */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Price Multiplier</label>
                  <Badge variant="outline">{priceMultiplier[0].toFixed(2)}x</Badge>
                </div>
                <Slider
                  value={priceMultiplier}
                  onValueChange={setPriceMultiplier}
                  max={2.0}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.5x (Low demand)</span>
                  <span>2.0x (High demand)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Revenue Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hourly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${calculations.hourlyRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  ${(calculations.hourlyRevenue * gpuCount[0]).toFixed(2)} gross
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${calculations.netProfit.monthly.toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  after electricity costs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payback Period</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {calculations.paybackPeriod > 0 ? calculations.paybackPeriod.toFixed(1) : '∞'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {calculations.paybackPeriod > 0 ? 'months' : 'unprofitable'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Annual ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {calculations.roi.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  return on investment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Detailed financial analysis for your configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">Daily Revenue</div>
                    <div className="text-lg font-semibold text-green-600">
                      ${calculations.dailyRevenue.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Monthly Revenue</div>
                    <div className="text-lg font-semibold text-green-600">
                      ${calculations.monthlyRevenue.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Yearly Revenue</div>
                    <div className="text-lg font-semibold text-green-600">
                      ${calculations.yearlyRevenue.toFixed(0)}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Electricity Cost</div>
                    <div className="text-lg font-semibold text-red-600">
                      -${calculations.electricityCost.toFixed(0)}/mo
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        ${calculations.netProfit.daily.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Net Daily Profit</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        ${calculations.netProfit.monthly.toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Net Monthly Profit</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        ${calculations.netProfit.yearly.toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Net Yearly Profit</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilization Impact Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Utilization Impact Analysis</CardTitle>
              <CardDescription>
                How different utilization rates affect your monthly revenue and profit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="utilization" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `$${value}`,
                        name === 'revenue' ? 'Monthly Revenue' :
                        name === 'profit' ? 'Monthly Profit' : 'Monthly Electricity'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="electricity"
                      stackId="2"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#3b82f6"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Investment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Initial Investment ({gpuCount[0]}x {selectedGPU.shortName})</span>
                  <span className="font-semibold">${(selectedGPU.basePrice * gpuCount[0]).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Platform ({selectedPlatform.name})</span>
                  <span>{selectedPlatform.revenueShare}% revenue share</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Target Utilization</span>
                  <span>{utilizationRate[0]}% ({getUtilizationScenario(utilizationRate[0]).name})</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Break-even Utilization</span>
                  <span className="font-semibold">
                    {((calculations.electricityCost / calculations.monthlyRevenue) * utilizationRate[0]).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 font-semibold text-base">
                  <span>Time to Break Even</span>
                  <span className={calculations.paybackPeriod < 12 ? 'text-green-600' : 'text-orange-600'}>
                    {calculations.paybackPeriod > 0 ? `${calculations.paybackPeriod.toFixed(1)} months` : 'Not profitable'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}