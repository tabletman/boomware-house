'use client'

import React from 'react'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { GPU_MODELS, PLATFORMS, type GPUModel } from '@/lib/gpu-data'
import {
  Code,
  Terminal,
  Database,
  Zap,
  CheckCircle,
  ArrowRight,
  Monitor,
  BarChart3,
  Settings,
  Cpu,
  Cloud,
  Lock,
  Clock,
  Github,
  Container,
  Server,
  Workflow,
  Copy,
  ExternalLink
} from 'lucide-react'

interface APIEndpoint {
  method: string
  endpoint: string
  description: string
  example: string
}

interface TechStack {
  category: string
  technologies: string[]
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function MLEngineersPage() {
  const [selectedTech, setSelectedTech] = useState('pytorch')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'POST',
      endpoint: '/api/v1/instances/create',
      description: 'Launch a new GPU instance',
      example: `{
  "gpu_type": "rtx-4090",
  "image": "pytorch/pytorch:latest",
  "duration_hours": 4,
  "ssh_key": "your-public-key"
}`
    },
    {
      method: 'GET',
      endpoint: '/api/v1/instances/{id}/status',
      description: 'Check instance status',
      example: `{
  "id": "inst_12345",
  "status": "running",
  "gpu_utilization": 85,
  "uptime": "2h 15m"
}`
    },
    {
      method: 'POST',
      endpoint: '/api/v1/instances/{id}/scale',
      description: 'Scale instance resources',
      example: `{
  "additional_gpus": 2,
  "memory_gb": 64,
  "storage_gb": 500
}`
    }
  ]

  const techStacks: TechStack[] = [
    {
      category: 'Deep Learning',
      technologies: ['PyTorch', 'TensorFlow', 'JAX', 'Hugging Face', 'Lightning'],
      icon: Code,
      color: 'text-blue-600'
    },
    {
      category: 'MLOps',
      technologies: ['MLflow', 'Weights & Biases', 'Kubeflow', 'DVC', 'Airflow'],
      icon: Settings,
      color: 'text-green-600'
    },
    {
      category: 'Infrastructure',
      technologies: ['Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Helm'],
      icon: Cloud,
      color: 'text-purple-600'
    },
    {
      category: 'Monitoring',
      technologies: ['Prometheus', 'Grafana', 'ElasticSearch', 'Kibana', 'Datadog'],
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ]

  const codeExamples = {
    pytorch: `import torch
import requests

# Initialize GPU instance
response = requests.post('https://api.gpurental.com/v1/instances/create', {
    'gpu_type': 'rtx-4090',
    'image': 'pytorch/pytorch:2.0-cuda11.8-cudnn8-devel'
})

instance_id = response.json()['id']

# Your ML training code
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = YourModel().to(device)
# ... training loop`,

    tensorflow: `import tensorflow as tf
import requests

# Launch distributed training
response = requests.post('https://api.gpurental.com/v1/clusters/create', {
    'num_gpus': 4,
    'gpu_type': 'a100',
    'framework': 'tensorflow'
})

# Configure distributed strategy
strategy = tf.distribute.MirroredStrategy()
with strategy.scope():
    model = create_model()
    model.compile(...)`,

    kubernetes: `apiVersion: batch/v1
kind: Job
metadata:
  name: ml-training-job
spec:
  template:
    spec:
      containers:
      - name: pytorch-trainer
        image: pytorch/pytorch:latest
        resources:
          limits:
            nvidia.com/gpu: 2
          requests:
            nvidia.com/gpu: 2
        env:
        - name: CUDA_VISIBLE_DEVICES
          value: "0,1"`
  }

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(type)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <MainLayout>
      <div className="pl-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Terminal className="h-4 w-4" />
              <span className="text-sm font-medium">Enterprise ML Infrastructure</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              GPU Compute for
              <br />
              <span className="text-green-400">Production ML</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Scale your machine learning workloads with enterprise APIs, monitoring,
              and infrastructure automation. Built for production deployments.
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-blue-200">API Uptime</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-400">&lt;30s</div>
                <div className="text-sm text-blue-200">Instance Launch</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">REST</div>
                <div className="text-sm text-blue-200">API Access</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">24/7</div>
                <div className="text-sm text-blue-200">Monitoring</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8">
                Get API Key
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* API Documentation Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Developer-First API</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RESTful API with comprehensive documentation, SDKs, and monitoring tools
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* API Endpoints */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold mb-4">Core Endpoints</h3>
                {apiEndpoints.map((endpoint, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant={endpoint.method === 'POST' ? 'default' : 'secondary'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                          <code>{endpoint.example}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(endpoint.example, `api-${index}`)}
                        >
                          {copiedCode === `api-${index}` ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Code Examples */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold mb-4">Integration Examples</h3>

                <div className="flex gap-2 mb-4">
                  {Object.keys(codeExamples).map((tech) => (
                    <Button
                      key={tech}
                      variant={selectedTech === tech ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTech(tech)}
                      className="capitalize"
                    >
                      {tech}
                    </Button>
                  ))}
                </div>

                <Card className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize">{selectedTech} Integration</CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(codeExamples[selectedTech as keyof typeof codeExamples], selectedTech)}
                      >
                        {copiedCode === selectedTech ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                      <code>{codeExamples[selectedTech as keyof typeof codeExamples]}</code>
                    </pre>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Need more examples?</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Check out our GitHub repository with complete integration examples and best practices.
                      </p>
                      <Button size="sm" variant="link" className="text-blue-600 p-0 mt-2">
                        View on GitHub →
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Support */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pre-configured Tech Stacks</h2>
            <p className="text-xl text-gray-600">Popular ML frameworks and tools ready to use</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStacks.map((stack, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 ${stack.color}`}>
                    <stack.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{stack.category}</h3>
                  <div className="space-y-2">
                    {stack.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs mr-1 mb-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Monitoring */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Real-time Monitoring</h2>
              <p className="text-xl text-gray-600">
                Monitor your GPU utilization, costs, and performance in real-time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Monitoring Features */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">GPU Utilization</h3>
                    <p className="text-gray-600">Real-time GPU usage, memory consumption, and temperature monitoring.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cost Tracking</h3>
                    <p className="text-gray-600">Track spending per project, team, or experiment with detailed breakdowns.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Monitor className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                    <p className="text-gray-600">Training speed, inference latency, and model accuracy tracking.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Alerts & Notifications</h3>
                    <p className="text-gray-600">Custom alerts for usage limits, cost thresholds, and performance issues.</p>
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Dashboard Preview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Utilization</span>
                    <span className="text-sm text-green-600 font-semibold">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '87%' }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Spend</span>
                    <span className="text-sm font-semibold">$1,247</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Instances</span>
                    <span className="text-sm font-semibold">3</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Response Time</span>
                    <span className="text-sm text-green-600 font-semibold">23ms</span>
                  </div>

                  <Button className="w-full mt-4">
                    View Full Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Enterprise Security</h2>
            <p className="text-xl text-gray-600">Built with security and compliance in mind</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Data Protection */}
            <Card className="p-6 text-center">
              <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Protection</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• End-to-end encryption</li>
                <li>• Private VPC networks</li>
                <li>• Secure key management</li>
                <li>• Data residency controls</li>
              </ul>
            </Card>

            {/* Compliance */}
            <Card className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Compliance</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• SOC 2 Type II</li>
                <li>• ISO 27001</li>
                <li>• GDPR compliant</li>
                <li>• HIPAA available</li>
              </ul>
            </Card>

            {/* Access Control */}
            <Card className="p-6 text-center">
              <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Access Control</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Role-based permissions</li>
                <li>• Multi-factor authentication</li>
                <li>• API key management</li>
                <li>• Audit logging</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Scale Your ML Infrastructure
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Get started with our developer-friendly API and scale your machine learning
              workloads to production. Free tier available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Read Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </MainLayout>
  )
}