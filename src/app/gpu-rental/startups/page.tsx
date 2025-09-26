'use client'

import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { GPU_MODELS, calculateROI, type GPUModel } from '@/lib/gpu-data'
import {
  Rocket,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock,
  Shield,
  BarChart3,
  CreditCard,
  Phone,
  Settings,
  Star,
  Target,
  Lightbulb,
  Globe
} from 'lucide-react'

interface PricingTier {
  name: string
  description: string
  monthlyCredits: number
  hourlyRate: number
  features: string[]
  support: string
  ideal: string
  color: string
}

interface StartupBenefit {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  value: string
  color: string
}

interface ScalingScenario {
  stage: string
  teamSize: string
  monthlyBudget: number
  recommendedGPUs: string[]
  useCase: string
}

export default function StartupsPage() {
  const [selectedTier, setSelectedTier] = useState(0)
  const [teamSize, setTeamSize] = useState(5)
  const [monthlyBudget, setMonthlyBudget] = useState(2000)

  const pricingTiers: PricingTier[] = [
    {
      name: 'Prototype',
      description: 'Perfect for MVP development and proof of concepts',
      monthlyCredits: 500,
      hourlyRate: 0.45,
      features: [
        '$500 startup credits',
        'Pay-as-you-use billing',
        'Community support',
        'Basic monitoring',
        '99.5% uptime SLA'
      ],
      support: 'Community',
      ideal: 'Pre-seed startups',
      color: 'text-blue-600'
    },
    {
      name: 'Growth',
      description: 'Scale your AI capabilities as you grow',
      monthlyCredits: 2000,
      hourlyRate: 0.42,
      features: [
        '$2,000 startup credits',
        'Volume discounts',
        'Email support',
        'Advanced monitoring',
        '99.9% uptime SLA',
        'Custom environments'
      ],
      support: 'Email + Chat',
      ideal: 'Series A/B startups',
      color: 'text-green-600'
    },
    {
      name: 'Scale',
      description: 'Enterprise features for scaling AI companies',
      monthlyCredits: 5000,
      hourlyRate: 0.38,
      features: [
        '$5,000 startup credits',
        'Enterprise discounts',
        'Priority support',
        'Dedicated account manager',
        '99.99% uptime SLA',
        'Custom integrations',
        'White-label options'
      ],
      support: 'Priority + Phone',
      ideal: 'Series C+ startups',
      color: 'text-purple-600'
    }
  ]

  const startupBenefits: StartupBenefit[] = [
    {
      icon: DollarSign,
      title: 'Startup Credits',
      description: 'Get up to $5,000 in free compute credits',
      value: 'Up to $5K',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Pay-as-you-Scale',
      description: 'No upfront costs, pay only for what you use',
      value: 'Zero Fixed Cost',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Instant Scaling',
      description: 'Scale from 1 to 100+ GPUs in under 60 seconds',
      value: '<60s Deploy',
      color: 'text-purple-600'
    },
    {
      icon: Phone,
      title: 'Dedicated Support',
      description: 'Technical support from AI infrastructure experts',
      value: '24/7 Support',
      color: 'text-orange-600'
    }
  ]

  const scalingScenarios: ScalingScenario[] = [
    {
      stage: 'MVP Development',
      teamSize: '2-5 engineers',
      monthlyBudget: 500,
      recommendedGPUs: ['RTX 4080', 'RTX 4090'],
      useCase: 'Model prototyping, small-scale training, proof of concepts'
    },
    {
      stage: 'Product Launch',
      teamSize: '5-15 engineers',
      monthlyBudget: 2000,
      recommendedGPUs: ['RTX 4090', 'A100'],
      useCase: 'Production inference, medium-scale training, A/B testing'
    },
    {
      stage: 'Scale & Growth',
      teamSize: '15-50 engineers',
      monthlyBudget: 8000,
      recommendedGPUs: ['A100', 'H100'],
      useCase: 'Large-scale training, multi-model serving, global deployment'
    }
  ]

  const calculateScenarioCost = (scenario: ScalingScenario) => {
    const gpu = GPU_MODELS.find(g => g.shortName === scenario.recommendedGPUs[0])
    if (!gpu) return 0
    return Math.floor(scenario.monthlyBudget / gpu.pricing.hourly.average / 24)
  }

  return (
    <MainLayout>
      <div className="pl-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Rocket className="h-4 w-4" />
              <span className="text-sm font-medium">Startup-Friendly GPU Computing</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Scale Your AI Startup
              <br />
              <span className="text-green-400">Without Breaking the Bank</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              From MVP to IPO - flexible GPU compute that grows with your startup.
              Get started with free credits and pay only as you scale.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {startupBenefits.map((benefit, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <benefit.icon className={`h-6 w-6 ${benefit.color} mx-auto mb-2`} />
                  <div className="text-lg font-bold text-white">{benefit.value}</div>
                  <div className="text-sm text-purple-200">{benefit.title}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8">
                Claim Startup Credits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Calculate Your Savings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Startup Pricing Tiers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pricing That Grows With You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that matches your startup stage, with the flexibility to upgrade as you scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'ring-2 ring-green-500 scale-105' : ''
                }`}
              >
                {index === 1 && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className={index === 1 ? 'pt-8' : ''}>
                  <div className="text-center">
                    <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                    <CardDescription className="text-lg mb-4">{tier.description}</CardDescription>
                    <div className="text-4xl font-bold mb-2 text-green-600">
                      ${tier.monthlyCredits.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">in startup credits</div>
                    <div className="mt-4">
                      <Badge className={`${tier.color} bg-opacity-10`}>
                        ${tier.hourlyRate}/hr after credits
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <strong>Ideal for:</strong> {tier.ideal}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <strong>Support:</strong> {tier.support}
                    </div>
                  </div>

                  <Button className="w-full" variant={index === 1 ? 'default' : 'outline'}>
                    {index === 1 ? 'Get Started' : 'Learn More'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scaling Scenarios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Scale as You Grow</h2>
            <p className="text-xl text-gray-600">See how GPU compute costs evolve with your startup journey</p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {scalingScenarios.map((scenario, index) => (
                <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-600" />
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-xl">{scenario.stage}</CardTitle>
                      <Badge variant="outline">{scenario.teamSize}</Badge>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ${scenario.monthlyBudget.toLocaleString()}/mo
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Recommended GPUs</h4>
                      <div className="flex flex-wrap gap-1">
                        {scenario.recommendedGPUs.map((gpu, gpuIndex) => (
                          <Badge key={gpuIndex} variant="secondary" className="text-xs">
                            {gpu}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Typical Use Cases</h4>
                      <p className="text-sm text-gray-600">{scenario.useCase}</p>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>~{calculateScenarioCost(scenario)} GPU hours/day</strong>
                        <br />
                        Perfect for {scenario.teamSize} teams
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Startup Success Stories</h2>
            <p className="text-xl text-gray-600">See how startups are scaling with our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Success Story 1 */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">VisionAI</h3>
                  <div className="text-sm text-gray-600">Computer Vision Startup</div>
                </div>
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                &ldquo;We went from prototype to production in 3 months. The startup credits gave us the runway we needed to prove our concept.&rdquo;
              </blockquote>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">70% cost savings</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </Card>

            {/* Success Story 2 */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">NeuralChat</h3>
                  <div className="text-sm text-gray-600">Conversational AI</div>
                </div>
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                &ldquo;The pay-as-you-scale model was perfect for our unpredictable training workloads. We only pay for what we actually use.&rdquo;
              </blockquote>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">5x faster iteration</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </Card>

            {/* Success Story 3 */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">DataMind</h3>
                  <div className="text-sm text-gray-600">ML Platform</div>
                </div>
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                &ldquo;The dedicated support helped us optimize our models for production. We reduced inference costs by 60%.&rdquo;
              </blockquote>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">60% cost reduction</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Support */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Built for Startups</h2>
              <p className="text-xl text-gray-600">
                Everything you need to move fast and build great AI products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technical Features */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Instant Deployment</h3>
                    <p className="text-gray-600">Launch GPU instances in under 60 seconds. No waiting, no setup time.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Settings className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Auto-Scaling</h3>
                    <p className="text-gray-600">Automatically scale up during training, scale down during idle periods.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
                    <p className="text-gray-600">SOC 2 compliance, VPC isolation, and encrypted data transfer by default.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cost Analytics</h3>
                    <p className="text-gray-600">Track spending by project, team, or experiment. Set budgets and alerts.</p>
                  </div>
                </div>
              </div>

              {/* Startup Benefits */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Startup Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-2" />
                      Startup Credits
                    </span>
                    <Badge className="bg-green-100 text-green-800">Up to $5K</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 text-blue-600 mr-2" />
                      Technical Support
                    </span>
                    <Badge>Priority</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 text-purple-600 mr-2" />
                      Account Manager
                    </span>
                    <Badge>Dedicated</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CreditCard className="h-4 w-4 text-orange-600 mr-2" />
                      Flexible Billing
                    </span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                </div>

                <Button className="w-full mt-6">
                  Apply for Startup Program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Scale Your AI Startup?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Join hundreds of startups already building the future with our GPU platform.
              Get started with free credits and scale as you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 px-8">
                Claim Your Credits
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
    </MainLayout>
  )
}