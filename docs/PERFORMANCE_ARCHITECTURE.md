# BOOMER Agent Performance Architecture

**Mission**: Process 100+ items/hour with <$0.10/item cost and 99.9% uptime

---

## 📊 Performance Goals

| Metric | Current | Target | Strategy |
|--------|---------|--------|----------|
| **Throughput** | 60-80/hour | 100+/hour | Job queue + worker pool |
| **Latency** | 25-40s | <10s | Parallel processing + caching |
| **Concurrency** | 3 items | 5-10 items | Worker pool architecture |
| **AI Cost** | $0.15-0.25 | <$0.10 | Prompt caching + model selection |
| **Uptime** | ~95% | 99.9% | Circuit breakers + graceful degradation |
| **Cache Hit Rate** | 0% | 60%+ | Multi-layer caching |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BOOMER AGENT SYSTEM                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │  File     │─────▶│  Job Queue   │─────▶│   Worker     │ │
│  │  Watcher  │      │   (BullMQ)   │      │    Pool      │ │
│  └───────────┘      └──────────────┘      └──────────────┘ │
│                            │                      │          │
│                            │                      │          │
│  ┌───────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │  Redis    │◀─────│   Caching    │◀─────│  Processing  │ │
│  │  Cache    │      │    Layer     │      │   Pipeline   │ │
│  └───────────┘      └──────────────┘      └──────────────┘ │
│                                                   │          │
│  ┌───────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │  Metrics  │◀─────│  Monitoring  │◀─────│  Circuit     │ │
│  │  System   │      │  Dashboard   │      │  Breakers    │ │
│  └───────────┘      └──────────────┘      └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Optimizations

### 1. Job Queue Architecture (BullMQ + Redis)

**Problem**: Sequential processing, no persistence, no retry logic
**Solution**: Durable job queue with worker pools

```typescript
// Job Types
interface VisionJob {
  type: 'vision-analysis';
  imagePaths: string[];
  priority: number;
  cacheKey: string;
}

interface MarketJob {
  type: 'market-intel';
  productData: ProductAnalysis;
  platforms: string[];
  cacheKey: string;
}

// Queue Configuration
{
  concurrency: 10,              // 10 parallel workers
  maxStalledCount: 3,           // Retry 3x on stall
  stalledInterval: 30000,       // Check every 30s
  retryStrategy: exponentialBackoff,
  removeOnComplete: 1000,       // Keep last 1000 for metrics
  removeOnFail: 5000            // Keep failed for debugging
}
```

**Benefits**:
- ✅ Durable job persistence (survives crashes)
- ✅ Automatic retries with exponential backoff
- ✅ Priority queues for urgent items
- ✅ Progress tracking and metrics
- ✅ Worker scaling based on load

**Expected Impact**: 3-5x throughput increase

---

### 2. Multi-Layer Caching Strategy

**L1: Memory Cache (Node.js Map)**
- Hot data: Recent product analyses
- TTL: 5 minutes
- Size: 1000 items
- Eviction: LRU

**L2: Redis Cache**
- Market pricing data (24hr TTL)
- Product embeddings (7d TTL)
- Vision analysis results (1hr TTL)
- API responses (30min TTL)

**L3: Database Cache (Supabase)**
- Historical pricing trends
- Product knowledge base
- Performance analytics

```typescript
// Cache Keys
vision:{sha256(images)}:v1
market:{brand}_{model}_{condition}:v1
embeddings:{productId}:v1
api:ebay:{searchQuery}:v1

// Cache Invalidation
- Market data: 24hr rolling window
- Vision results: 1hr (allow re-analysis)
- Embeddings: Never (immutable)
```

**Expected Impact**: 60%+ cache hit rate, 70% cost reduction

---

### 3. AI Optimization

#### Prompt Caching (Anthropic)
```typescript
// System prompt cached (5min TTL)
const SYSTEM_PROMPT = {
  type: 'text',
  text: VISION_ANALYSIS_PROMPT,
  cache_control: { type: 'ephemeral' }
};

// Saves ~75% tokens on repeated calls
```

**Cost Savings**: $0.015 → $0.004 per cached request (73% reduction)

#### Model Selection
```typescript
// Fast tier: Haiku for simple tasks
- Condition grading (< 1s, $0.001)
- Title optimization (< 1s, $0.001)
- Price validation (< 0.5s, $0.001)

// Smart tier: Sonnet for complex tasks
- Full vision analysis (4-6s, $0.015)
- Market positioning (2-3s, $0.008)
- Description generation (2-3s, $0.008)

// Strategy: Route 70% tasks to Haiku
```

**Expected Cost**: $0.025/item (75% reduction)

#### Batch Vision Analysis
```typescript
// Current: 1 image/request (4-8s each)
// Optimized: 3 images/request (6-10s total)

// 3x speedup for multi-image items
await client.messages.create({
  messages: [{
    content: [image1, image2, image3, analysisPrompt]
  }]
});
```

---

### 4. Worker Pool Architecture

```typescript
// Worker Manager
class WorkerPool {
  private workers: Worker[] = [];
  private maxWorkers = 10;
  private minWorkers = 2;
  private metrics = new MetricsCollector();

  // Auto-scale based on queue depth
  async scaleWorkers(): Promise<void> {
    const queueDepth = await this.queue.count();
    const targetWorkers = Math.min(
      this.maxWorkers,
      Math.ceil(queueDepth / 10)
    );

    if (targetWorkers > this.workers.length) {
      await this.spawnWorkers(targetWorkers - this.workers.length);
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    await this.queue.pause();
    await Promise.all(this.workers.map(w => w.close()));
    await this.queue.close();
  }
}
```

**Worker Types**:
- **Vision Workers** (3-5): GPU-optimized, high memory
- **Market Workers** (3-5): Browser pools, proxy rotation
- **Processing Workers** (2-3): Image processing, embeddings

---

### 5. Rate Limiting & Circuit Breakers

#### Smart Rate Limiting
```typescript
class RateLimiter {
  // Token bucket with prediction
  private buckets = {
    anthropic: new TokenBucket(50, 60000), // 50/min
    ebay: new TokenBucket(20, 60000),      // 20/min
    perplexity: new TokenBucket(10, 60000) // 10/min
  };

  // Exponential backoff
  async waitForToken(service: string): Promise<void> {
    const bucket = this.buckets[service];
    let attempts = 0;

    while (!bucket.consume()) {
      const backoff = Math.min(1000 * Math.pow(2, attempts), 30000);
      await sleep(backoff);
      attempts++;

      if (attempts > 5) {
        throw new RateLimitError(service);
      }
    }
  }
}
```

#### Circuit Breakers
```typescript
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failures = 0;
  private threshold = 5;
  private timeout = 60000; // 1min

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.openedAt > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new CircuitOpenError();
      }
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

  private onFailure(): void {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.openedAt = Date.now();
    }
  }
}
```

---

### 6. Database Optimization

#### Connection Pooling
```typescript
const supabase = createClient(url, key, {
  db: {
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    }
  }
});
```

#### Query Optimization
```sql
-- Indexes for common queries
CREATE INDEX idx_products_brand_model ON products(brand, model);
CREATE INDEX idx_market_prices_timestamp ON market_prices(timestamp DESC);
CREATE INDEX idx_processing_queue_status ON jobs(status, created_at);

-- Materialized view for market trends
CREATE MATERIALIZED VIEW market_trends AS
SELECT
  brand,
  model,
  avg(price) as avg_price,
  count(*) as sample_count,
  date_trunc('day', timestamp) as date
FROM market_prices
WHERE timestamp > now() - interval '90 days'
GROUP BY brand, model, date_trunc('day', timestamp);

REFRESH MATERIALIZED VIEW CONCURRENTLY market_trends;
```

#### Vector Search (pgvector)
```typescript
// Product similarity search
const { data } = await supabase.rpc('match_products', {
  query_embedding: productEmbedding,
  match_threshold: 0.8,
  match_count: 10
});

// Fast embedding lookup
CREATE INDEX ON products
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

## 📈 Performance Monitoring

### Metrics Collection
```typescript
interface Metrics {
  // Throughput
  itemsPerHour: number;
  avgProcessingTime: number;
  queueDepth: number;

  // Quality
  successRate: number;
  cacheHitRate: number;
  errorRate: number;

  // Resources
  cpuUsage: number;
  memoryUsage: number;
  workerUtilization: number;

  // Cost
  aiCostPerItem: number;
  totalDailyCost: number;
  costPerPlatform: Record<string, number>;
}
```

### Dashboard (Grafana + Prometheus)
```yaml
panels:
  - title: "Throughput"
    metrics: [itemsPerHour, queueDepth, workerUtilization]

  - title: "Performance"
    metrics: [avgProcessingTime, cacheHitRate, p95Latency]

  - title: "Reliability"
    metrics: [successRate, errorRate, circuitBreakerState]

  - title: "Cost"
    metrics: [aiCostPerItem, dailyCost, costByModel]

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

---

## 🧪 Load Testing

### Test Scenarios
```typescript
// Scenario 1: Steady State (100 items/hour)
await loadTest({
  rate: 100,
  duration: 3600,
  pattern: 'constant',
  expect: {
    p95Latency: '<10s',
    errorRate: '<1%',
    costPerItem: '<$0.10'
  }
});

// Scenario 2: Spike Load (500 items burst)
await loadTest({
  rate: 500,
  duration: 300,
  pattern: 'burst',
  expect: {
    queueHandling: 'graceful',
    memoryUsage: '<2GB',
    workerScaling: 'automatic'
  }
});

// Scenario 3: Endurance (1000 items over 10 hours)
await loadTest({
  rate: 100,
  duration: 36000,
  pattern: 'constant',
  expect: {
    memoryLeaks: 'none',
    performanceDegradation: '<5%',
    cacheEfficiency: '>60%'
  }
});
```

---

## 💰 Cost Analysis

### Current State
```
100 items/day × $0.20/item = $20/day = $600/month
- Vision API: $15/day
- Market Intel: $3/day
- Infrastructure: $2/day
```

### Optimized State
```
1000 items/day × $0.08/item = $80/day = $2,400/month
- Vision API (cached): $30/day (70% cache hit)
- Market Intel (cached): $10/day (80% cache hit)
- Redis: $15/day (managed)
- Workers: $15/day (2x DigitalOcean droplets)
- Database: $10/day (Supabase Pro)

Cost per item: $0.08 (60% reduction)
10x throughput at 4x total cost = 2.5x cost efficiency
```

### ROI Calculation
```
Revenue: 1000 items/day × $50 margin = $50,000/month
Cost: $2,400/month
Profit: $47,600/month (95% margin)

Break-even: 48 items/day
Target: 1000 items/day (20x break-even)
```

---

## 🚦 Implementation Roadmap

### Phase 1: Foundation (Week 1)
- ✅ BullMQ job queue setup
- ✅ Redis caching layer
- ✅ Basic worker pool
- ✅ Metrics collection

**Goal**: 150 items/hour, <$0.15/item

### Phase 2: Optimization (Week 2)
- ✅ Prompt caching implementation
- ✅ Model selection routing
- ✅ Circuit breakers
- ✅ Database optimization

**Goal**: 250 items/hour, <$0.10/item

### Phase 3: Scaling (Week 3)
- ✅ Auto-scaling workers
- ✅ Advanced caching strategies
- ✅ Load balancing
- ✅ Performance dashboard

**Goal**: 500 items/hour, <$0.08/item

### Phase 4: Production (Week 4)
- ✅ Load testing validation
- ✅ Monitoring & alerting
- ✅ Documentation
- ✅ Production deployment

**Goal**: 1000 items/hour capacity, 99.9% uptime

---

## 🔧 Technical Stack

### Core Infrastructure
- **Job Queue**: BullMQ (Redis-based)
- **Cache**: Redis (managed, 1GB)
- **Database**: Supabase (PostgreSQL + pgvector)
- **Workers**: Node.js (clustered)
- **Monitoring**: Grafana + Prometheus

### AI Services
- **Vision**: Claude Sonnet 4.5 (complex) + Haiku (simple)
- **Market Intel**: Perplexity Sonar (fallback)
- **Embeddings**: Voyage AI (cached)

### Deployment
- **Platform**: DigitalOcean Droplets (2x 4GB)
- **Orchestration**: PM2 (process manager)
- **Scaling**: Horizontal (add workers)

---

## 📊 Success Metrics

| KPI | Baseline | Target | Measurement |
|-----|----------|--------|-------------|
| **Throughput** | 60/hr | 100+/hr | Items processed/hour |
| **Latency** | 30s | <10s | P95 processing time |
| **Cost** | $0.20 | <$0.10 | AI cost per item |
| **Reliability** | 95% | 99.9% | Success rate |
| **Cache Hit** | 0% | 60%+ | Cache efficiency |
| **Worker Util** | 33% | 80%+ | Resource efficiency |

---

## 🎯 Performance Guarantees

**SLA Targets**:
- ✅ 99.9% uptime (43min downtime/month)
- ✅ <10s P95 latency
- ✅ <1% error rate
- ✅ <$0.10 cost per item
- ✅ 100+ items/hour sustained

**Graceful Degradation**:
- Market intel failure → Use AI estimation
- Vision API timeout → Retry with Haiku
- Cache miss → Normal processing
- Queue backup → Priority routing
- Worker failure → Auto-respawn

---

## 📚 References

- [BullMQ Best Practices](https://docs.bullmq.io/patterns/best-practices)
- [Anthropic Prompt Caching](https://docs.anthropic.com/claude/docs/prompt-caching)
- [Redis Caching Strategies](https://redis.io/docs/manual/patterns/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Load Testing with k6](https://k6.io/docs/)

---

**Last Updated**: 2025-12-07
**Version**: 1.0
**Owner**: Performance Oracle Team
