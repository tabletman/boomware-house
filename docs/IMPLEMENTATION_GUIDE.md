# BOOMER Agent Performance Implementation Guide

Complete step-by-step guide to implementing the high-performance architecture.

---

## 📋 Prerequisites

### Required Services
- **Redis** (managed): Upstash, Redis Cloud, or DigitalOcean Managed Redis
- **Supabase**: PostgreSQL + pgvector for database
- **Anthropic API**: Claude access with prompt caching
- **Node.js**: v18+ with TypeScript

### Environment Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Required Environment Variables
```env
# Core APIs
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...  # Optional
PERPLEXITY_API_KEY=pplx-...  # Optional

# Redis (Queue + Cache)
REDIS_HOST=redis-12345.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-password

# Supabase (Database)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbG...

# Performance Config
MAX_CONCURRENT_VISION=5
MAX_CONCURRENT_MARKET=5
ENABLE_PROMPT_CACHING=true
ENABLE_AUTO_SCALING=true

# Monitoring
METRICS_PORT=3001
ENABLE_PROMETHEUS=true
```

---

## 🚀 Phase 1: Core Infrastructure (Week 1)

### Day 1-2: Redis Setup

**Option A: Upstash (Recommended for starting)**
```bash
# Create Upstash Redis instance
# Visit: https://console.upstash.com/redis

# Copy credentials to .env
REDIS_HOST=your-redis.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

**Option B: DigitalOcean Managed Redis**
```bash
# Create via CLI
doctl databases create boomer-redis \
  --engine redis \
  --version 7 \
  --size db-s-1vcpu-1gb \
  --region nyc1

# Get connection details
doctl databases connection boomer-redis
```

**Test Connection:**
```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD
});

redis.ping().then(console.log); // Should print "PONG"
```

### Day 3-4: Job Queue Implementation

**Initialize Queue System:**
```typescript
import { JobQueueManager } from './src/lib/queue/job-queue';

const queueManager = new JobQueueManager({
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD
  },
  concurrency: 10,
  removeOnComplete: 1000,
  removeOnFail: 5000
});

// Add test job
const job = await queueManager.addVisionJob(
  ['/path/to/image.jpg'],
  { platforms: ['ebay'], priority: 10 }
);

console.log('Job created:', job.id);
```

**Monitor Queue:**
```typescript
const metrics = await queueManager.getMetrics();
console.log('Queue metrics:', metrics);
```

### Day 5-7: Worker Pool Setup

**Start Workers:**
```typescript
import { WorkerPoolManager } from './src/lib/queue/worker-pool';

const workerPool = new WorkerPoolManager({
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!)
  },
  concurrency: {
    vision: 5,
    market: 5
  },
  autoScale: {
    enabled: true,
    minWorkers: 2,
    maxWorkers: 10,
    scaleThreshold: 50
  },
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!
});

await workerPool.start();
```

**Test End-to-End:**
```bash
# Terminal 1: Start workers
npm run worker:start

# Terminal 2: Add jobs
npm run dev -- add-job path/to/image.jpg

# Terminal 3: Monitor
npm run metrics:dashboard
```

**Expected Performance:**
- ✅ 150-200 items/hour
- ✅ <15s P95 latency
- ✅ <$0.15/item cost
- ✅ Basic job persistence

---

## ⚡ Phase 2: Optimization (Week 2)

### Day 1-2: Prompt Caching

**Enable in Optimized Vision Agent:**
```typescript
import { OptimizedVisionAgent } from './src/lib/agents/optimized-vision-agent';

const agent = new OptimizedVisionAgent({
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  enablePromptCaching: true  // ← Enable this
});

// First call: Full cost (~$0.015)
const result1 = await agent.analyzeProduct(['/path/to/image.jpg']);

// Second call (within 5min): Cached (~$0.004)
const result2 = await agent.analyzeProduct(['/path/to/similar.jpg']);
```

**Verify Cache Usage:**
```bash
# Check logs for cache hit indicators
✅ Vision analysis (CACHED)
   Input tokens: 150
   Cached tokens: 2500  ← Should see this
   Output tokens: 800
```

**Expected Savings:**
- First call: $0.015
- Cached call: $0.004 (73% reduction)
- Target: 60%+ cache hit rate = 50%+ cost savings

### Day 3-4: Model Selection & Routing

**Smart Routing:**
```typescript
// Simple tasks → Haiku ($0.001)
const condition = await agent.assessCondition('/path/to/image.jpg');

// Complex tasks → Sonnet ($0.015 or $0.004 cached)
const fullAnalysis = await agent.analyzeProduct(['/path/to/image.jpg']);

// Batch processing (3x speedup)
const results = await agent.analyzeBatch([
  ['/image1.jpg'],
  ['/image2.jpg'],
  ['/image3.jpg']
]);
```

**Cost Breakdown:**
```
Before: 100% Sonnet = $0.015/item
After:  30% Haiku + 70% Sonnet (60% cached) = $0.006/item
Savings: 60%
```

### Day 5-7: Multi-Layer Caching

**Configure Cache:**
```typescript
import { CacheManager } from './src/lib/cache/cache-manager';

const cache = new CacheManager({
  host: process.env.REDIS_HOST!,
  port: parseInt(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD,
  memory: {
    max: 1000,      // 1000 items in L1
    ttl: 5 * 60 * 1000  // 5min TTL
  }
});

// Vision results: 1hr TTL
await cache.set('vision:abc123', result, 3600);

// Market data: 24hr TTL
await cache.set('market:rtx4090:good', pricing, 86400);
```

**Cache Keys:**
```typescript
import { CacheKeys } from './src/lib/cache/cache-manager';

const visionKey = CacheKeys.vision(['hash1', 'hash2']);
const marketKey = CacheKeys.market('NVIDIA', 'RTX 4090', 'GOOD');
const pricingKey = CacheKeys.ebaySearch('rtx 4090 used');
```

**Expected Impact:**
- Cache hit rate: 60%+
- Latency reduction: 70%
- Cost reduction: 75%

---

## 📈 Phase 3: Scaling (Week 3)

### Day 1-3: Auto-Scaling

**Enable Auto-Scaling:**
```typescript
const workerPool = new WorkerPoolManager({
  // ... other config
  autoScale: {
    enabled: true,
    minWorkers: 2,     // Idle state
    maxWorkers: 10,    // Peak capacity
    scaleThreshold: 50 // Scale up if queue > 50
  }
});
```

**Scaling Behavior:**
```
Queue Depth | Workers | Action
-----------|---------|--------
0-20       | 2       | Idle (minimum)
21-50      | 2       | Normal
51-100     | 3-5     | Scale up
101-200    | 6-8     | Scale up
200+       | 10      | Max capacity
```

### Day 4-5: Circuit Breakers

**Implement Circuit Breakers:**
```typescript
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failures = 0;
  private threshold = 5;
  private timeout = 60000;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      throw new CircuitOpenError('Circuit breaker is OPEN');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
}

// Usage
const breaker = new CircuitBreaker();
const result = await breaker.execute(() =>
  marketAgent.analyzePricing(productData)
);
```

**Graceful Degradation:**
```typescript
try {
  // Try market scraping
  pricing = await marketAgent.analyzePricing(productData);
} catch (error) {
  console.warn('Market scraping failed, using AI estimation');
  // Fallback to AI-based pricing
  pricing = await marketAgent.aiPriceEstimation(productData);
}
```

### Day 6-7: Performance Dashboard

**Metrics Server:**
```typescript
import express from 'express';
import { MetricsCollector } from './src/lib/metrics/collector';

const app = express();
const metrics = new MetricsCollector();

app.get('/metrics', async (req, res) => {
  const data = await metrics.getMetrics();
  res.json(data);
});

app.get('/health', async (req, res) => {
  const health = await workerPool.getHealth();
  res.json(health);
});

app.listen(3001);
```

**Prometheus Export:**
```typescript
app.get('/metrics/prometheus', (req, res) => {
  const prometheus = metrics.toPrometheus();
  res.set('Content-Type', 'text/plain');
  res.send(prometheus);
});
```

**Expected Performance:**
- ✅ 250-300 items/hour
- ✅ <10s P95 latency
- ✅ <$0.10/item cost
- ✅ Auto-scaling working
- ✅ Circuit breakers protecting APIs

---

## 🧪 Phase 4: Testing & Production (Week 4)

### Day 1-3: Load Testing

**Run Load Tests:**
```bash
# Test 1: Steady State (100 items/hour)
npm run test -- --scenario steady

# Test 2: Burst Load (500 items)
npm run test -- --scenario burst

# Test 3: Endurance (10 hours)
npm run test -- --scenario endurance
```

**Expected Results:**
```
Test 1: Steady State
  ✅ Throughput: 100+ items/hour
  ✅ P95 Latency: <10s
  ✅ Error Rate: <1%
  ✅ Cost/Item: <$0.10

Test 2: Burst Load
  ✅ Queue handled gracefully
  ✅ Auto-scaling triggered
  ✅ No memory leaks

Test 3: Endurance
  ✅ No performance degradation
  ✅ Cache efficiency maintained
  ✅ Worker stability confirmed
```

### Day 4-5: Monitoring Setup

**Grafana Dashboard:**
```yaml
panels:
  - title: "Throughput"
    metrics: [itemsPerHour, queueDepth]

  - title: "Performance"
    metrics: [p95Latency, cacheHitRate]

  - title: "Cost"
    metrics: [costPerItem, dailyTotal]

  - title: "Health"
    metrics: [successRate, errorRate, workerUtilization]
```

**Alerts:**
```yaml
alerts:
  - name: "High Error Rate"
    condition: errorRate > 0.05
    action: notify_slack

  - name: "Queue Backup"
    condition: queueDepth > 100
    action: scale_workers

  - name: "Cost Spike"
    condition: hourly_cost > $10
    action: notify_admin
```

### Day 6-7: Production Deployment

**Deployment Checklist:**
- ✅ Redis production instance configured
- ✅ Supabase production database ready
- ✅ Environment variables set
- ✅ Workers deployed (PM2 or Docker)
- ✅ Monitoring dashboard live
- ✅ Alerts configured
- ✅ Backup strategy in place
- ✅ Load tests passed

**PM2 Deployment:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'boomer-workers',
    script: 'dist/workers/start.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      MAX_CONCURRENT_VISION: 5,
      MAX_CONCURRENT_MARKET: 5
    },
    error_file: 'logs/error.log',
    out_file: 'logs/output.log'
  }, {
    name: 'boomer-metrics',
    script: 'dist/metrics/server.js',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

```bash
# Deploy
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📊 Performance Validation

### Success Metrics (After Implementation)

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Throughput** | 60-80/hr | 100+/hr | +67% |
| **P95 Latency** | 30s | <10s | -67% |
| **Cost/Item** | $0.20 | <$0.10 | -50% |
| **Cache Hit** | 0% | 60%+ | ∞ |
| **Uptime** | 95% | 99.9% | +5% |

### Cost Analysis

**Before Optimization:**
```
100 items/day × $0.20 = $20/day = $600/month
- Vision: $15/day
- Market: $3/day
- Infra: $2/day
```

**After Optimization:**
```
1000 items/day × $0.08 = $80/day = $2,400/month
- Vision (cached): $30/day
- Market (cached): $10/day
- Redis: $15/day
- Workers: $15/day
- Database: $10/day

ROI: 10x throughput at 4x cost = 2.5x efficiency
```

---

## 🚨 Troubleshooting

### Common Issues

**1. Redis Connection Errors**
```bash
# Test connection
redis-cli -h $REDIS_HOST -p $REDIS_PORT -a $REDIS_PASSWORD ping

# Check logs
pm2 logs boomer-workers --lines 100
```

**2. Worker Not Processing Jobs**
```typescript
// Check queue status
const metrics = await queueManager.getMetrics();
console.log(metrics);

// Check worker health
const health = await workerPool.getHealth();
console.log(health);
```

**3. High Memory Usage**
```bash
# Monitor memory
pm2 monit

# Restart workers
pm2 restart boomer-workers
```

**4. Cache Not Working**
```typescript
// Test cache
await cache.set('test', { value: 123 });
const result = await cache.get('test');
console.log(result); // Should be { value: 123 }
```

---

## 📚 Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Anthropic Prompt Caching](https://docs.anthropic.com/claude/docs/prompt-caching)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [PM2 Process Manager](https://pm2.keymetrics.io/)

---

**Last Updated**: 2025-12-07
**Version**: 1.0
