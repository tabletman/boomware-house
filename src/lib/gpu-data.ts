export interface GPUModel {
  id: string
  name: string
  shortName: string
  memory: string
  cudaCores?: number
  tensorCores?: number
  architecture: string
  category: 'consumer' | 'datacenter' | 'workstation'
  basePrice: number
  powerConsumption: number
  performance: {
    gaming: number
    ml: number
    rendering: number
  }
  pricing: {
    hourly: {
      min: number
      max: number
      average: number
    }
    monthly: {
      min: number
      max: number
      average: number
    }
  }
  specifications: {
    baseClock: string
    boostClock: string
    memoryBandwidth: string
    interface: string
    displayOutputs: number
  }
}

export interface Platform {
  id: string
  name: string
  logo: string
  website: string
  description: string
  features: string[]
  revenueShare: number
  minimumUptime: number
  payoutFrequency: string
  supportedGPUs: string[]
  requirements: {
    bandwidth: string
    uptime: string
    security: string[]
    container: boolean
    kubernetes: boolean
  }
  pros: string[]
  cons: string[]
  userRating: number
  marketShare: number
}

export interface UtilizationScenario {
  name: string
  utilizationRate: number
  description: string
  typicalUseCase: string
}

export interface ROICalculation {
  gpuModel: string
  purchasePrice: number
  monthlyRevenue: number
  monthlyOperatingCosts: {
    electricity: number
    internet: number
    maintenance: number
    insurance: number
  }
  paybackMonths: number
  annualROI: number
  breakEvenUtilization: number
}

// GPU Models Data
export const GPU_MODELS: GPUModel[] = [
  {
    id: 'rtx-4090',
    name: 'NVIDIA GeForce RTX 4090',
    shortName: 'RTX 4090',
    memory: '24GB GDDR6X',
    cudaCores: 16384,
    tensorCores: 128,
    architecture: 'Ada Lovelace',
    category: 'consumer',
    basePrice: 1599,
    powerConsumption: 450,
    performance: {
      gaming: 100,
      ml: 85,
      rendering: 95
    },
    pricing: {
      hourly: {
        min: 0.34,
        max: 0.75,
        average: 0.54
      },
      monthly: {
        min: 245,
        max: 540,
        average: 389
      }
    },
    specifications: {
      baseClock: '2235 MHz',
      boostClock: '2520 MHz',
      memoryBandwidth: '1008 GB/s',
      interface: 'PCIe 4.0 x16',
      displayOutputs: 4
    }
  },
  {
    id: 'h100',
    name: 'NVIDIA H100 SXM5',
    shortName: 'H100',
    memory: '80GB HBM3',
    cudaCores: 14592,
    tensorCores: 456,
    architecture: 'Hopper',
    category: 'datacenter',
    basePrice: 25000,
    powerConsumption: 700,
    performance: {
      gaming: 60,
      ml: 100,
      rendering: 80
    },
    pricing: {
      hourly: {
        min: 3.35,
        max: 4.18,
        average: 3.76
      },
      monthly: {
        min: 2412,
        max: 3010,
        average: 2707
      }
    },
    specifications: {
      baseClock: '1410 MHz',
      boostClock: '1980 MHz',
      memoryBandwidth: '3350 GB/s',
      interface: 'SXM5',
      displayOutputs: 0
    }
  },
  {
    id: 'rtx-4080',
    name: 'NVIDIA GeForce RTX 4080',
    shortName: 'RTX 4080',
    memory: '16GB GDDR6X',
    cudaCores: 9728,
    tensorCores: 76,
    architecture: 'Ada Lovelace',
    category: 'consumer',
    basePrice: 1199,
    powerConsumption: 320,
    performance: {
      gaming: 85,
      ml: 70,
      rendering: 80
    },
    pricing: {
      hourly: {
        min: 0.28,
        max: 0.52,
        average: 0.40
      },
      monthly: {
        min: 202,
        max: 374,
        average: 288
      }
    },
    specifications: {
      baseClock: '2205 MHz',
      boostClock: '2505 MHz',
      memoryBandwidth: '717 GB/s',
      interface: 'PCIe 4.0 x16',
      displayOutputs: 4
    }
  },
  {
    id: 'a100',
    name: 'NVIDIA A100 SXM4',
    shortName: 'A100',
    memory: '40GB HBM2e',
    cudaCores: 6912,
    tensorCores: 432,
    architecture: 'Ampere',
    category: 'datacenter',
    basePrice: 15000,
    powerConsumption: 400,
    performance: {
      gaming: 50,
      ml: 90,
      rendering: 65
    },
    pricing: {
      hourly: {
        min: 1.89,
        max: 2.45,
        average: 2.17
      },
      monthly: {
        min: 1361,
        max: 1764,
        average: 1562
      }
    },
    specifications: {
      baseClock: '765 MHz',
      boostClock: '1410 MHz',
      memoryBandwidth: '1555 GB/s',
      interface: 'SXM4',
      displayOutputs: 0
    }
  },
  {
    id: 'rtx-3090',
    name: 'NVIDIA GeForce RTX 3090',
    shortName: 'RTX 3090',
    memory: '24GB GDDR6X',
    cudaCores: 10496,
    tensorCores: 328,
    architecture: 'Ampere',
    category: 'consumer',
    basePrice: 999,
    powerConsumption: 350,
    performance: {
      gaming: 75,
      ml: 65,
      rendering: 85
    },
    pricing: {
      hourly: {
        min: 0.22,
        max: 0.45,
        average: 0.33
      },
      monthly: {
        min: 158,
        max: 324,
        average: 238
      }
    },
    specifications: {
      baseClock: '1395 MHz',
      boostClock: '1695 MHz',
      memoryBandwidth: '936 GB/s',
      interface: 'PCIe 4.0 x16',
      displayOutputs: 4
    }
  }
]

// Platform Data
export const PLATFORMS: Platform[] = [
  {
    id: 'vast-ai',
    name: 'Vast.ai',
    logo: '/platforms/vast-ai.png',
    website: 'https://vast.ai',
    description: 'Decentralized cloud computing marketplace for GPU rentals',
    features: ['Pay-per-hour billing', 'Docker container support', 'SSH access', 'Jupyter notebooks'],
    revenueShare: 80, // Provider gets 80%
    minimumUptime: 95.0,
    payoutFrequency: 'Weekly',
    supportedGPUs: ['rtx-4090', 'rtx-4080', 'rtx-3090', 'h100', 'a100'],
    requirements: {
      bandwidth: '100+ Mbps',
      uptime: '95%+',
      security: ['Firewall configured', 'SSH key auth', 'Docker isolation'],
      container: true,
      kubernetes: false
    },
    pros: [
      'High provider revenue share (80%)',
      'Large customer base',
      'Easy setup process',
      'Good documentation',
      'Weekly payouts'
    ],
    cons: [
      'High competition',
      'Price pressure from other providers',
      'Customer support can be slow'
    ],
    userRating: 4.2,
    marketShare: 35
  },
  {
    id: 'tensordock',
    name: 'TensorDock',
    logo: '/platforms/tensordock.png',
    website: 'https://tensordock.com',
    description: 'GPU cloud platform focused on AI/ML workloads',
    features: ['Hourly and monthly billing', 'Pre-configured ML environments', 'API access', 'Team collaboration'],
    revenueShare: 75,
    minimumUptime: 99.0,
    payoutFrequency: 'Monthly',
    supportedGPUs: ['rtx-4090', 'rtx-4080', 'h100', 'a100'],
    requirements: {
      bandwidth: '1+ Gbps',
      uptime: '99%+',
      security: ['SSL/TLS encryption', 'VPN support', 'Access logging'],
      container: true,
      kubernetes: true
    },
    pros: [
      'Premium pricing for high-end GPUs',
      'Stable long-term customers',
      'Enterprise clients',
      'Good uptime monitoring',
      'Kubernetes support'
    ],
    cons: [
      'Lower revenue share (75%)',
      'Stricter requirements',
      'Longer approval process',
      'Monthly payouts only'
    ],
    userRating: 4.5,
    marketShare: 25
  },
  {
    id: 'akash',
    name: 'Akash Network',
    logo: '/platforms/akash.png',
    website: 'https://akash.network',
    description: 'Decentralized cloud computing marketplace with blockchain payments',
    features: ['Blockchain payments (AKT)', 'Decentralized governance', 'Container orchestration', 'Global network'],
    revenueShare: 85,
    minimumUptime: 98.0,
    payoutFrequency: 'Daily',
    supportedGPUs: ['rtx-4090', 'rtx-4080', 'rtx-3090'],
    requirements: {
      bandwidth: '500+ Mbps',
      uptime: '98%+',
      security: ['Container isolation', 'Network policies', 'Resource limits'],
      container: true,
      kubernetes: true
    },
    pros: [
      'Highest revenue share (85%)',
      'Daily blockchain payouts',
      'Growing ecosystem',
      'Transparent pricing',
      'Community governance'
    ],
    cons: [
      'Cryptocurrency volatility',
      'Smaller customer base',
      'Technical complexity',
      'Limited enterprise adoption'
    ],
    userRating: 4.0,
    marketShare: 15
  },
  {
    id: 'runpod',
    name: 'RunPod',
    logo: '/platforms/runpod.png',
    website: 'https://runpod.io',
    description: 'Cloud GPU platform for AI, ML, and rendering workloads',
    features: ['Serverless GPU functions', 'Persistent storage', 'Custom templates', 'API integration'],
    revenueShare: 70,
    minimumUptime: 99.5,
    payoutFrequency: 'Bi-weekly',
    supportedGPUs: ['rtx-4090', 'rtx-4080', 'rtx-3090', 'h100', 'a100'],
    requirements: {
      bandwidth: '1+ Gbps',
      uptime: '99.5%+',
      security: ['End-to-end encryption', 'Secure boot', 'Attestation'],
      container: true,
      kubernetes: true
    },
    pros: [
      'Premium enterprise customers',
      'Serverless scaling capabilities',
      'High uptime requirements = premium rates',
      'Strong API ecosystem',
      'Good customer support'
    ],
    cons: [
      'Lowest revenue share (70%)',
      'Strictest requirements',
      'Complex onboarding',
      'Bi-weekly payouts'
    ],
    userRating: 4.6,
    marketShare: 20
  }
]

// Utilization Scenarios
export const UTILIZATION_SCENARIOS: UtilizationScenario[] = [
  {
    name: 'Light Usage',
    utilizationRate: 30,
    description: 'Occasional ML training, development work',
    typicalUseCase: 'Hobbyist developers, students, small projects'
  },
  {
    name: 'Moderate Usage',
    utilizationRate: 50,
    description: 'Regular training jobs, some inference',
    typicalUseCase: 'Small businesses, research labs, consultants'
  },
  {
    name: 'Heavy Usage',
    utilizationRate: 70,
    description: 'Continuous training, production inference',
    typicalUseCase: 'AI companies, large research institutions'
  },
  {
    name: 'Maximum Usage',
    utilizationRate: 85,
    description: 'Round-the-clock computational workloads',
    typicalUseCase: 'Crypto mining, large-scale AI inference'
  }
]

// Operating Cost Estimates (monthly)
export const OPERATING_COSTS = {
  electricity: {
    residential: 0.13, // $/kWh
    commercial: 0.10, // $/kWh
    industrial: 0.07   // $/kWh
  },
  internet: {
    residential: 80,   // $/month for 1Gbps
    business: 200,     // $/month for 1Gbps with SLA
    dedicated: 500     // $/month for dedicated fiber
  },
  maintenance: 50,     // $/month per GPU (estimated)
  insurance: 25        // $/month per $10K of hardware value
}

// Revenue projections and ROI calculations
export const calculateROI = (
  gpuModel: GPUModel,
  utilizationRate: number,
  electricityRate: number = OPERATING_COSTS.electricity.residential,
  internetCost: number = OPERATING_COSTS.internet.residential
): ROICalculation => {
  const hoursPerMonth = 730
  const monthlyRevenue = gpuModel.pricing.hourly.average * hoursPerMonth * (utilizationRate / 100)

  const monthlyElectricity = (gpuModel.powerConsumption / 1000) * hoursPerMonth * electricityRate
  const monthlyOperatingCosts = {
    electricity: monthlyElectricity,
    internet: internetCost,
    maintenance: OPERATING_COSTS.maintenance,
    insurance: (gpuModel.basePrice / 10000) * OPERATING_COSTS.insurance
  }

  const totalMonthlyCosts = Object.values(monthlyOperatingCosts).reduce((a, b) => a + b, 0)
  const netMonthlyProfit = monthlyRevenue - totalMonthlyCosts

  const paybackMonths = netMonthlyProfit > 0 ? gpuModel.basePrice / netMonthlyProfit : Infinity
  const annualROI = netMonthlyProfit > 0 ? (netMonthlyProfit * 12 / gpuModel.basePrice) * 100 : 0

  // Calculate break-even utilization rate
  const breakEvenUtilization = (totalMonthlyCosts / (gpuModel.pricing.hourly.average * hoursPerMonth)) * 100

  return {
    gpuModel: gpuModel.name,
    purchasePrice: gpuModel.basePrice,
    monthlyRevenue,
    monthlyOperatingCosts,
    paybackMonths,
    annualROI,
    breakEvenUtilization
  }
}

// Market data for charts and analytics
export const MARKET_DATA = {
  globalGPUMarketSize: 66.3, // Billion USD (2023)
  cloudGPUMarketGrowth: 32.5, // % CAGR 2023-2030
  averageUptimeRequirement: 99.2,
  topApplications: [
    { name: 'Machine Learning Training', share: 45 },
    { name: 'AI Inference', share: 25 },
    { name: '3D Rendering', share: 15 },
    { name: 'Cryptocurrency Mining', share: 10 },
    { name: 'Scientific Computing', share: 5 }
  ],
  demandTrends: {
    '2023': 100,
    '2024': 145,
    '2025': 210,
    '2026': 290,
    '2027': 380
  }
}

// Security and compliance requirements
export const SECURITY_REQUIREMENTS = {
  container_isolation: 'Docker/Podman containers with resource limits and network isolation',
  network_security: 'Firewall rules, VPN access, DDoS protection',
  data_encryption: 'Encryption at rest and in transit (TLS 1.3+)',
  access_control: 'SSH key authentication, multi-factor authentication',
  monitoring: '24/7 uptime monitoring, performance metrics, security logs',
  compliance: ['SOC 2 Type II', 'ISO 27001', 'GDPR', 'HIPAA (for healthcare workloads)'],
  backup_recovery: 'Automated backups, disaster recovery procedures'
}

export default {
  GPU_MODELS,
  PLATFORMS,
  UTILIZATION_SCENARIOS,
  OPERATING_COSTS,
  calculateROI,
  MARKET_DATA,
  SECURITY_REQUIREMENTS
}