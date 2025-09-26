'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { GPU_MODELS, calculateROI, type GPUModel } from '@/lib/gpu-data'
import {
  Brain,
  BookOpen,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  FileText,
  Zap,
  TrendingDown,
  Award,
  Calendar
} from 'lucide-react'

interface ResearchCredit {
  institution: string
  amount: number
  duration: string
  requirements: string[]
}

interface AcademicPricing {
  gpuModel: string
  academicDiscount: number
  standardRate: number
  academicRate: number
  researchCredits: number
}

export default function AIResearchersPage() {
  const [selectedGPU, setSelectedGPU] = useState<GPUModel>(GPU_MODELS[0])
  const [utilizationHours, setUtilizationHours] = useState(40) // Academic usage typically lower

  // Academic-specific pricing data
  const academicPricing: AcademicPricing[] = [
    {
      gpuModel: 'RTX 4090',
      academicDiscount: 30,
      standardRate: 0.54,
      academicRate: 0.38,
      researchCredits: 500
    },
    {
      gpuModel: 'H100',
      academicDiscount: 25,
      standardRate: 3.76,
      academicRate: 2.82,
      researchCredits: 2000
    },
    {
      gpuModel: 'A100',
      academicDiscount: 35,
      standardRate: 2.17,
      academicRate: 1.41,
      researchCredits: 1200
    }
  ]

  const researchCredits: ResearchCredit[] = [
    {
      institution: 'University Partners',
      amount: 5000,
      duration: '6 months',
      requirements: ['Valid .edu email', 'Research project description', 'Faculty supervisor']
    },
    {
      institution: 'Graduate Students',
      amount: 2000,
      duration: '3 months',
      requirements: ['Student ID verification', 'Thesis/dissertation topic', 'Advisor approval']
    },
    {
      institution: 'Research Labs',
      amount: 10000,
      duration: '12 months',
      requirements: ['Institutional partnership', 'Published research plan', 'Grant funding proof']
    }
  ]

  const researchFeatures = [
    {
      icon: Brain,
      title: 'Pre-configured ML Environments',
      description: 'PyTorch, TensorFlow, JAX environments ready to use',
      color: 'text-blue-600'
    },
    {
      icon: BookOpen,
      title: 'Academic Collaboration Tools',
      description: 'Share notebooks, datasets, and results with your team',
      color: 'text-green-600'
    },
    {
      icon: FileText,
      title: 'Research Documentation',
      description: 'Automatic experiment tracking and reproducibility tools',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Multi-user Access',
      description: 'Lab-wide access with individual usage tracking',
      color: 'text-orange-600'
    }
  ]

  const currentGPUPricing = academicPricing.find(p => p.gpuModel === selectedGPU.shortName)

  return (
    <MainLayout>
      <div className="pl-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-medium">Academic GPU Computing</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              GPU Power for
              <br />
              <span className="text-blue-300">AI Research</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Access enterprise-grade GPUs with academic pricing, research credits, and collaboration tools
              designed for breakthrough AI research.
            </p>

            {/* Academic Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">30%</div>
                <div className="text-sm text-blue-200">Academic Discount</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-400">$5,000</div>
                <div className="text-sm text-blue-200">Research Credits</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-blue-200">Support</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8">
                Apply for Credits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Academic Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Research Credits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Research Credits Program</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get free GPU credits to accelerate your research with our academic partnership program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {researchCredits.map((credit, index) => (
              <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">{credit.institution}</CardTitle>
                    <Award className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">${credit.amount.toLocaleString()}</div>
                  <CardDescription className="text-lg">Credits valid for {credit.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Requirements:</h4>
                    {credit.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {req}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-6">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Academic Pricing</h2>
            <p className="text-xl text-gray-600">Significant discounts for verified academic institutions</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {academicPricing.map((pricing, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{pricing.gpuModel}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        {pricing.academicDiscount}% OFF
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Standard Rate:</span>
                        <span className="line-through text-gray-400">${pricing.standardRate}/hr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Academic Rate:</span>
                        <span className="text-2xl font-bold text-green-600">${pricing.academicRate}/hr</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-800">
                          <strong>Plus ${pricing.researchCredits} research credits</strong>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Monthly (100 hrs):</span>
                        <span className="font-semibold">${(pricing.academicRate * 100).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Semester (400 hrs):</span>
                        <span className="font-semibold">${(pricing.academicRate * 400).toFixed(0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Research</h2>
            <p className="text-xl text-gray-600">Tools and features designed specifically for academic AI research</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gray-50 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Research Applications</h2>
            <p className="text-xl text-gray-600">See how researchers are using our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Large Language Models */}
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Large Language Models</h3>
              <p className="text-gray-600 mb-4">Fine-tune and train transformer models for NLP research</p>
              <div className="text-sm text-blue-600 font-medium">Recommended: H100, A100</div>
            </Card>

            {/* Computer Vision */}
            <Card className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Computer Vision</h3>
              <p className="text-gray-600 mb-4">Train CNNs, vision transformers, and multimodal models</p>
              <div className="text-sm text-green-600 font-medium">Recommended: RTX 4090, A100</div>
            </Card>

            {/* Reinforcement Learning */}
            <Card className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingDown className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reinforcement Learning</h3>
              <p className="text-gray-600 mb-4">Run massive parallel simulations and agent training</p>
              <div className="text-sm text-purple-600 font-medium">Recommended: RTX 4090</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Collaboration Tools */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Academic Collaboration</h2>
              <p className="text-xl text-gray-600">Share resources and collaborate with your research team</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Team Management</h3>
                    <p className="text-gray-600">Manage lab members, set permissions, and track usage across your research group.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Experiment Tracking</h3>
                    <p className="text-gray-600">Automatic logging of experiments, hyperparameters, and results for reproducible research.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Dataset Sharing</h3>
                    <p className="text-gray-600">Share datasets securely within your institution with built-in version control.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Academic Support</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Technical Support</span>
                    <Badge>Priority</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Office Hours</span>
                    <Badge variant="outline">Weekly</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Research Consultation</span>
                    <Badge>Free</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Publication Support</span>
                    <Badge>Available</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Accelerate Your Research Today
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join leading academic institutions already using our platform for breakthrough AI research.
              Apply for research credits and start computing immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-gray-100 px-8">
                Apply for Research Credits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Schedule Academic Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </MainLayout>
  )
}