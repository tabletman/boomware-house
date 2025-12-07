/**
 * Worker Pool Manager
 * Manages concurrent workers with auto-scaling and health monitoring
 */

import { Worker, Job } from 'bullmq';
import { VisionAnalysisAgent } from '../agents/vision-agent';
import { MarketIntelligenceAgent } from '../agents/market-intel-agent';
import { CacheManager } from '../cache/cache-manager';
import { MetricsCollector } from '../metrics/collector';
import type { VisionJobData, MarketJobData } from './job-queue';

export interface WorkerPoolConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  concurrency: {
    vision: number;
    market: number;
  };
  autoScale?: {
    enabled: boolean;
    minWorkers: number;
    maxWorkers: number;
    scaleThreshold: number;
  };
  anthropicApiKey: string;
  tavilyApiKey?: string;
  perplexityApiKey?: string;
}

export class WorkerPoolManager {
  private visionWorkers: Worker[] = [];
  private marketWorkers: Worker[] = [];
  private visionAgent: VisionAnalysisAgent;
  private marketAgent: MarketIntelligenceAgent;
  private cache: CacheManager;
  private metrics: MetricsCollector;
  private config: WorkerPoolConfig;
  private isShuttingDown = false;

  constructor(config: WorkerPoolConfig) {
    this.config = config;
    this.visionAgent = new VisionAnalysisAgent(config.anthropicApiKey);
    this.marketAgent = new MarketIntelligenceAgent({
      tavilyApiKey: config.tavilyApiKey,
      perplexityApiKey: config.perplexityApiKey
    });
    this.cache = new CacheManager(config.redis);
    this.metrics = new MetricsCollector();
  }

  /**
   * Start all workers
   */
  async start(): Promise<void> {
    console.log('🚀 Starting worker pool...');

    // Start vision workers
    for (let i = 0; i < this.config.concurrency.vision; i++) {
      this.spawnVisionWorker(i);
    }

    // Start market workers
    for (let i = 0; i < this.config.concurrency.market; i++) {
      this.spawnMarketWorker(i);
    }

    // Start auto-scaling if enabled
    if (this.config.autoScale?.enabled) {
      this.startAutoScaling();
    }

    console.log(`✅ Worker pool started`);
    console.log(`   Vision workers: ${this.config.concurrency.vision}`);
    console.log(`   Market workers: ${this.config.concurrency.market}`);
  }

  /**
   * Spawn vision analysis worker
   */
  private spawnVisionWorker(id: number): void {
    const worker = new Worker<VisionJobData>(
      'vision-analysis',
      async (job: Job<VisionJobData>) => {
        return this.processVisionJob(job);
      },
      {
        connection: this.config.redis,
        concurrency: 1,
        lockDuration: 30000,
        lockRenewTime: 15000
      }
    );

    worker.on('completed', (job) => {
      this.metrics.recordJobCompleted('vision', job.id || '', job.processedOn || 0);
      console.log(`✅ Vision job ${job.id} completed`);
    });

    worker.on('failed', (job, error) => {
      this.metrics.recordJobFailed('vision', job?.id || '', error.message);
      console.error(`❌ Vision job ${job?.id} failed:`, error.message);
    });

    worker.on('error', (error) => {
      console.error(`❌ Vision worker ${id} error:`, error);
    });

    this.visionWorkers.push(worker);
  }

  /**
   * Spawn market intelligence worker
   */
  private spawnMarketWorker(id: number): void {
    const worker = new Worker<MarketJobData>(
      'market-intel',
      async (job: Job<MarketJobData>) => {
        return this.processMarketJob(job);
      },
      {
        connection: this.config.redis,
        concurrency: 1,
        lockDuration: 60000,
        lockRenewTime: 30000
      }
    );

    worker.on('completed', (job) => {
      this.metrics.recordJobCompleted('market', job.id || '', job.processedOn || 0);
      console.log(`✅ Market job ${job.id} completed`);
    });

    worker.on('failed', (job, error) => {
      this.metrics.recordJobFailed('market', job?.id || '', error.message);
      console.error(`❌ Market job ${job?.id} failed:`, error.message);
    });

    worker.on('error', (error) => {
      console.error(`❌ Market worker ${id} error:`, error);
    });

    this.marketWorkers.push(worker);
  }

  /**
   * Process vision analysis job with caching
   */
  private async processVisionJob(job: Job<VisionJobData>): Promise<any> {
    const startTime = Date.now();
    const { imagePaths, options, cacheKey } = job.data;

    try {
      // Check cache first
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        this.metrics.recordCacheHit('vision');
        await job.updateProgress(100);
        return cached;
      }

      this.metrics.recordCacheMiss('vision');

      // Update progress
      await job.updateProgress(10);

      // Analyze product
      const result = await this.visionAgent.analyzeProduct(imagePaths, {
        platforms: options.platforms,
        includeMarketAnalysis: false
      });

      await job.updateProgress(90);

      // Cache result (1 hour TTL)
      await this.cache.set(cacheKey, result, 3600);

      await job.updateProgress(100);

      // Record metrics
      this.metrics.recordProcessingTime('vision', Date.now() - startTime);

      return result;

    } catch (error: any) {
      this.metrics.recordError('vision', error.message);
      throw error;
    }
  }

  /**
   * Process market intelligence job with caching
   */
  private async processMarketJob(job: Job<MarketJobData>): Promise<any> {
    const startTime = Date.now();
    const { productData, platforms, cacheKey } = job.data;

    try {
      // Check cache first (24hr TTL for market data)
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        this.metrics.recordCacheHit('market');
        await job.updateProgress(100);
        return cached;
      }

      this.metrics.recordCacheMiss('market');

      await job.updateProgress(10);

      // Analyze pricing
      const result = await this.marketAgent.analyzePricing(productData, {
        platforms
      });

      await job.updateProgress(90);

      // Cache result (24 hours)
      await this.cache.set(cacheKey, result, 86400);

      await job.updateProgress(100);

      // Record metrics
      this.metrics.recordProcessingTime('market', Date.now() - startTime);

      return result;

    } catch (error: any) {
      this.metrics.recordError('market', error.message);
      throw error;
    }
  }

  /**
   * Auto-scaling based on queue depth
   */
  private startAutoScaling(): void {
    setInterval(async () => {
      if (this.isShuttingDown) return;

      const { autoScale } = this.config;
      if (!autoScale) return;

      // Get queue metrics
      const metrics = await this.metrics.getQueueMetrics();
      const totalWaiting = metrics.vision.waiting + metrics.market.waiting;

      // Scale up if queue is backing up
      if (totalWaiting > autoScale.scaleThreshold) {
        const currentWorkers = this.visionWorkers.length + this.marketWorkers.length;
        if (currentWorkers < autoScale.maxWorkers) {
          console.log(`📈 Scaling up workers (queue depth: ${totalWaiting})`);
          this.spawnVisionWorker(this.visionWorkers.length);
        }
      }

      // Scale down if queue is empty
      if (totalWaiting === 0 && metrics.vision.active === 0 && metrics.market.active === 0) {
        const currentWorkers = this.visionWorkers.length + this.marketWorkers.length;
        if (currentWorkers > autoScale.minWorkers) {
          console.log(`📉 Scaling down workers (idle)`);
          // Remove last worker
          const worker = this.visionWorkers.pop();
          if (worker) {
            await worker.close();
          }
        }
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Get worker pool health
   */
  async getHealth(): Promise<{
    vision: { active: number; total: number };
    market: { active: number; total: number };
    metrics: any;
  }> {
    const metrics = await this.metrics.getMetrics();

    return {
      vision: {
        active: this.visionWorkers.filter(w => !w.isPaused()).length,
        total: this.visionWorkers.length
      },
      market: {
        active: this.marketWorkers.filter(w => !w.isPaused()).length,
        total: this.marketWorkers.length
      },
      metrics
    };
  }

  /**
   * Pause all workers
   */
  async pause(): Promise<void> {
    await Promise.all([
      ...this.visionWorkers.map(w => w.pause()),
      ...this.marketWorkers.map(w => w.pause())
    ]);
    console.log('⏸️  Workers paused');
  }

  /**
   * Resume all workers
   */
  async resume(): Promise<void> {
    await Promise.all([
      ...this.visionWorkers.map(w => w.resume()),
      ...this.marketWorkers.map(w => w.resume())
    ]);
    console.log('▶️  Workers resumed');
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    console.log('🛑 Shutting down worker pool...');

    // Pause all workers
    await this.pause();

    // Wait for active jobs to complete (max 30s)
    const timeout = setTimeout(() => {
      console.warn('⚠️  Shutdown timeout - forcing close');
    }, 30000);

    // Close all workers
    await Promise.all([
      ...this.visionWorkers.map(w => w.close()),
      ...this.marketWorkers.map(w => w.close())
    ]);

    clearTimeout(timeout);

    // Close agents and cache
    await this.marketAgent.close();
    await this.cache.close();

    console.log('✅ Worker pool shut down');
  }
}
