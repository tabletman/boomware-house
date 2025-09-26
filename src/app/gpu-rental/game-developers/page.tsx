'use client'

import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { GPU_MODELS, type GPUModel } from '@/lib/gpu-data'
import {
  Gamepad2,
  Zap,
  Monitor,
  Cpu,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Clock,
  BarChart3,
  Users,
  Palette,
  Video,
  Eye,
  Layers,
  Settings,
  Globe,
  Timer
} from 'lucide-react'

interface RenderingBenchmark {
  task: string
  rtx4090: string
  rtx4080: string
  rtx3090: string
  description: string
}

interface GameEngine {
  name: string
  logo: string
  description: string
  features: string[]
  recommended_gpu: string
  render_time_improvement: number
}

interface RenderingWorkflow {
  stage: string
  description: string
  gpu_usage: string
  recommended_specs: string
  icon: React.ComponentType<{ className?: string }>
}

export default function GameDevelopersPage() {
  const [selectedGPU, setSelectedGPU] = useState<GPUModel>(GPU_MODELS[0])
  const [renderingTask, setRenderingTask] = useState('cinematics')

  const renderingBenchmarks: RenderingBenchmark[] = [
    {
      task: 'Ray-traced Reflections (4K)',
      rtx4090: '2.3 hours',
      rtx4080: '3.8 hours',
      rtx3090: '4.2 hours',
      description: 'Complex indoor scene with multiple light sources'
    },
    {
      task: 'Global Illumination Bake',
      rtx4090: '45 minutes',
      rtx4080: '72 minutes',
      rtx3090: '89 minutes',
      description: 'Open world environment lighting calculations'
    },
    {
      task: 'Animation Rendering (1080p)',
      rtx4090: '8 minutes/frame',
      rtx4080: '12 minutes/frame',
      rtx3090: '15 minutes/frame',
      description: '60fps cinematic sequence with particle effects'
    },
    {
      task: 'Texture Baking (8K)',
      rtx4090: '15 minutes',
      rtx4080: '28 minutes',
      rtx3090: '35 minutes',
      description: 'High-resolution normal and ambient occlusion maps'
    }
  ]

  const gameEngines: GameEngine[] = [
    {
      name: 'Unreal Engine 5',
      logo: '/engines/unreal.png',
      description: 'Industry-leading real-time 3D creation platform',
      features: ['Nanite Virtualized Geometry', 'Lumen Global Illumination', 'Chaos Physics', 'MetaHuman Creator'],
      recommended_gpu: 'RTX 4090',
      render_time_improvement: 65
    },
    {
      name: 'Unity',
      logo: '/engines/unity.png',
      description: 'World\'s leading platform for real-time content creation',
      features: ['HDRP Pipeline', 'Ray Tracing Support', 'Visual Scripting', 'Cross-platform Deployment'],
      recommended_gpu: 'RTX 4080',
      render_time_improvement: 55
    },
    {
      name: 'Godot',
      logo: '/engines/godot.png',
      description: 'Open-source game engine with modern rendering',
      features: ['Vulkan Renderer', 'GDScript', 'Visual Scripting', 'Lightweight'],
      recommended_gpu: 'RTX 4080',
      render_time_improvement: 45
    },
    {
      name: 'Blender',
      logo: '/engines/blender.png',
      description: 'Professional 3D modeling and rendering suite',
      features: ['Cycles Renderer', 'Eevee Real-time', 'Geometry Nodes', 'Animation Tools'],
      recommended_gpu: 'RTX 4090',
      render_time_improvement: 75
    }
  ]

  const renderingWorkflows: RenderingWorkflow[] = [
    {
      stage: 'Asset Creation',
      description: 'High-poly modeling, sculpting, and texturing',
      gpu_usage: 'Medium - Interactive viewport',
      recommended_specs: 'RTX 4080 or higher',
      icon: Palette
    },
    {
      stage: 'Lighting & Shading',
      description: 'Material setup and lighting design',
      gpu_usage: 'High - Real-time ray tracing',
      recommended_specs: 'RTX 4090 recommended',
      icon: Eye
    },
    {
      stage: 'Animation',
      description: 'Character rigging and keyframe animation',
      gpu_usage: 'Medium - Viewport playback',
      recommended_specs: 'RTX 4080 sufficient',
      icon: Play
    },
    {
      stage: 'Rendering',
      description: 'Final output generation and post-processing',
      gpu_usage: 'Maximum - GPU compute intensive',
      recommended_specs: 'RTX 4090 or H100',
      icon: Video
    }
  ]

  const renderingTasks = {
    cinematics: {
      title: 'Cinematic Rendering',
      description: 'High-quality cutscenes and trailers',
      gpu_hours: 120,
      cost_estimate: 65,
      quality: '4K Ray Traced'
    },
    environments: {
      title: 'Environment Baking',
      description: 'Lightmaps and global illumination',
      gpu_hours: 80,
      cost_estimate: 43,
      quality: 'Real-time GI'
    },
    animations: {
      title: 'Character Animation',
      description: 'Facial animations and motion capture',
      gpu_hours: 60,
      cost_estimate: 32,
      quality: 'High Fidelity'
    }
  }

  const currentTask = renderingTasks[renderingTask as keyof typeof renderingTasks]

  return (
    <MainLayout>
      <div className="pl-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-900 via-red-900 to-purple-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Gamepad2 className="h-4 w-4" />
              <span className="text-sm font-medium">Game Development GPU Computing</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Render Faster,
              <br />
              <span className="text-orange-400">Ship Sooner</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Accelerate your game development with high-performance GPU rendering.
              From real-time ray tracing to cinematic rendering farms.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">75%</div>
                <div className="text-sm text-orange-200">Faster Renders</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-400">4K</div>
                <div className="text-sm text-orange-200">Ray Tracing</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-orange-200">Render Farms</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">RTX</div>
                <div className="text-sm text-orange-200">Optimized</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8">
                Start Rendering
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Benchmarks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Rendering Benchmarks */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Rendering Performance Benchmarks</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real-world rendering times for common game development tasks
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Rendering Task</th>
                    <th className="px-6 py-4 text-center">RTX 4090</th>
                    <th className="px-6 py-4 text-center">RTX 4080</th>
                    <th className="px-6 py-4 text-center">RTX 3090</th>
                  </tr>
                </thead>
                <tbody>
                  {renderingBenchmarks.map((benchmark, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold">{benchmark.task}</div>
                          <div className="text-sm text-gray-600">{benchmark.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge className="bg-green-100 text-green-800 font-semibold">
                          {benchmark.rtx4090}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge className="bg-blue-100 text-blue-800 font-semibold">
                          {benchmark.rtx4080}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge className="bg-gray-100 text-gray-800 font-semibold">
                          {benchmark.rtx3090}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Benchmarks based on industry-standard scenes using Blender Cycles and Unreal Engine 5
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Engine Support */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Optimized for Popular Engines</h2>
            <p className="text-xl text-gray-600">Pre-configured environments for major game engines</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameEngines.map((engine, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-2xl font-bold text-gray-600">{engine.name.charAt(0)}</div>
                  </div>
                  <CardTitle className="text-lg">{engine.name}</CardTitle>
                  <CardDescription className="text-sm">{engine.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {engine.render_time_improvement}%
                    </div>
                    <div className="text-xs text-gray-600">Faster rendering</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-2">Key Features:</div>
                    <div className="space-y-1">
                      {engine.features.slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-2 rounded text-center">
                    <div className="text-xs text-orange-800">
                      <strong>Recommended:</strong> {engine.recommended_gpu}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rendering Workflow */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Game Development Workflow</h2>
            <p className="text-xl text-gray-600">GPU acceleration for every stage of development</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderingWorkflows.map((workflow, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                      <workflow.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{workflow.stage}</h3>
                      <p className="text-gray-600 mb-3">{workflow.description}</p>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">GPU Usage:</span> {workflow.gpu_usage}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Recommended:</span> {workflow.recommended_specs}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Rendering Cost Calculator</h2>
            <p className="text-xl text-gray-600">Estimate costs for your game development projects</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Project Configuration</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rendering Task</label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.keys(renderingTasks).map((task) => (
                        <Button
                          key={task}
                          variant={renderingTask === task ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setRenderingTask(task)}
                          className="justify-start capitalize"
                        >
                          {renderingTasks[task as keyof typeof renderingTasks].title}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">GPU Type</label>
                    <div className="grid grid-cols-1 gap-2">
                      {GPU_MODELS.slice(0, 3).map((gpu) => (
                        <Button
                          key={gpu.id}
                          variant={selectedGPU.id === gpu.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedGPU(gpu)}
                          className="justify-between"
                        >
                          <span>{gpu.shortName}</span>
                          <span className="text-xs">${gpu.pricing.hourly.average}/hr</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Results */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Cost Estimate</h3>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      ${(currentTask.gpu_hours * selectedGPU.pricing.hourly.average).toFixed(0)}
                    </div>
                    <div className="text-sm text-gray-600">Total project cost</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Task:</span>
                      <span className="text-sm">{currentTask.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">GPU Hours:</span>
                      <span className="text-sm">{currentTask.gpu_hours} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">GPU Rate:</span>
                      <span className="text-sm">${selectedGPU.pricing.hourly.average}/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Quality:</span>
                      <span className="text-sm">{currentTask.quality}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-800">
                      <strong>Time Savings:</strong> Complete in {Math.floor(currentTask.gpu_hours / 24)} days instead of weeks
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features for Game Devs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Game Developers</h2>
            <p className="text-xl text-gray-600">Features that understand your workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Asset Streaming */}
            <Card className="p-6 text-center">
              <Download className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Asset Streaming</h3>
              <p className="text-gray-600">Automatic asset transfer and caching for large game projects</p>
            </Card>

            {/* Render Queuing */}
            <Card className="p-6 text-center">
              <Layers className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Render Queuing</h3>
              <p className="text-gray-600">Intelligent job scheduling for complex rendering pipelines</p>
            </Card>

            {/* Version Control */}
            <Card className="p-6 text-center">
              <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Version Control</h3>
              <p className="text-gray-600">Git LFS integration for managing large art assets</p>
            </Card>

            {/* Performance Monitoring */}
            <Card className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
              <p className="text-gray-600">Track rendering performance and optimize bottlenecks</p>
            </Card>

            {/* Team Collaboration */}
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Share render nodes and resources across your team</p>
            </Card>

            {/* Global CDN */}
            <Card className="p-6 text-center">
              <Globe className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Distribution</h3>
              <p className="text-gray-600">Worldwide GPU nodes for reduced latency</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Accelerate Your Game?
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              Join game studios already using our GPU rendering platform to ship faster
              and create more immersive experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-700 hover:bg-gray-100 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </MainLayout>
  )
}