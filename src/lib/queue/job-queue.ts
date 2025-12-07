/**
 * High-Performance Job Queue System
 * BullMQ-based queue with Redis persistence
 */

import { Queue, Worker, Job, QueueScheduler } from 'bullmq';
import Redis from 'ioredis';

export interface VisionJobData {
  type: 'vision-analysis';
  imagePaths: string[];
  options: {
    platforms?: string[];
    priority?: number;
  };
  cacheKey: string;
  itemId: string;
}

export interface MarketJobData {
  type: 'market-intel';
  productData: any;
  platforms: string[];
  cacheKey: string;
  itemId: string;
}

export type JobData = VisionJobData | MarketJobData;

export interface QueueConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
    maxRetriesPerRequest?: number;
  };
  concurrency?: number;
  removeOnComplete?: number;
  removeOnFail?: number;
}

export class JobQueueManager {
  private visionQueue: Queue<VisionJobData>;
  private marketQueue: Queue<MarketJobData>;
  private connection: Redis;
  private scheduler: QueueScheduler;

  constructor(config: QueueConfig) {
    this.connection = new Redis({
      ...config.redis,
      maxRetriesPerRequest: null, // Required for BullMQ
      enableReadyCheck: false
    });

    // Vision Analysis Queue
    this.visionQueue = new Queue<VisionJobData>('vision-analysis', {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: config.removeOnComplete || 1000,
        removeOnFail: config.removeOnFail || 5000
      }
    });

    // Market Intelligence Queue
    this.marketQueue = new Queue<MarketJobData>('market-intel', {
      connection: this.connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: config.removeOnComplete || 1000,
        removeOnFail: config.removeOnFail || 5000
      }
    });

    // Queue Scheduler (handles delayed/repeated jobs)
    this.scheduler = new QueueScheduler('vision-analysis', {
      connection: this.connection
    });
  }

  /**
   * Add vision analysis job
   */
  async addVisionJob(
    imagePaths: string[],
    options: VisionJobData['options'] = {}
  ): Promise<Job<VisionJobData>> {
    const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cacheKey = this.generateCacheKey('vision', imagePaths);

    return this.visionQueue.add(
      'analyze-product',
      {
        type: 'vision-analysis',
        imagePaths,
        options,
        cacheKey,
        itemId
      },
      {
        priority: options.priority || 10,
        jobId: itemId
      }
    );
  }

  /**
   * Add market intelligence job
   */
  async addMarketJob(
    productData: any,
    platforms: string[]
  ): Promise<Job<MarketJobData>> {
    const itemId = `market_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cacheKey = this.generateCacheKey('market', [
      productData.product.brand,
      productData.product.model,
      productData.condition.state
    ]);

    return this.marketQueue.add(
      'analyze-pricing',
      {
        type: 'market-intel',
        productData,
        platforms,
        cacheKey,
        itemId
      },
      {
        priority: 5,
        jobId: itemId
      }
    );
  }

  /**
   * Batch add jobs with priority
   */
  async addBatchVisionJobs(
    items: Array<{ imagePaths: string[]; priority?: number }>
  ): Promise<Job<VisionJobData>[]> {
    const jobs = items.map((item, index) => ({
      name: 'analyze-product',
      data: {
        type: 'vision-analysis' as const,
        imagePaths: item.imagePaths,
        options: { priority: item.priority },
        cacheKey: this.generateCacheKey('vision', item.imagePaths),
        itemId: `batch_${Date.now()}_${index}`
      },
      opts: {
        priority: item.priority || 10
      }
    }));

    return this.visionQueue.addBulk(jobs);
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<{
    state: string;
    progress: number;
    data?: any;
    result?: any;
    failedReason?: string;
  }> {
    const job = await this.visionQueue.getJob(jobId) ||
                 await this.marketQueue.getJob(jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const state = await job.getState();
    const progress = job.progress;

    return {
      state,
      progress: typeof progress === 'number' ? progress : 0,
      data: job.data,
      result: job.returnvalue,
      failedReason: job.failedReason
    };
  }

  /**
   * Get queue metrics
   */
  async getMetrics(): Promise<{
    vision: QueueMetrics;
    market: QueueMetrics;
  }> {
    return {
      vision: await this.getQueueMetrics(this.visionQueue),
      market: await this.getQueueMetrics(this.marketQueue)
    };
  }

  private async getQueueMetrics(queue: Queue): Promise<QueueMetrics> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount()
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed
    };
  }

  /**
   * Pause queue processing
   */
  async pause(): Promise<void> {
    await Promise.all([
      this.visionQueue.pause(),
      this.marketQueue.pause()
    ]);
  }

  /**
   * Resume queue processing
   */
  async resume(): Promise<void> {
    await Promise.all([
      this.visionQueue.resume(),
      this.marketQueue.resume()
    ]);
  }

  /**
   * Clean completed jobs older than age
   */
  async cleanOldJobs(ageMs: number = 24 * 60 * 60 * 1000): Promise<void> {
    await Promise.all([
      this.visionQueue.clean(ageMs, 'completed'),
      this.marketQueue.clean(ageMs, 'completed'),
      this.visionQueue.clean(ageMs * 7, 'failed')
    ]);
  }

  /**
   * Graceful shutdown
   */
  async close(): Promise<void> {
    await this.pause();
    await this.scheduler.close();
    await this.visionQueue.close();
    await this.marketQueue.close();
    await this.connection.quit();
  }

  /**
   * Generate cache key from data
   */
  private generateCacheKey(type: string, data: string[]): string {
    const crypto = require('crypto');
    const hash = crypto
      .createHash('sha256')
      .update(data.join('|'))
      .digest('hex')
      .substring(0, 16);

    return `${type}:${hash}:v1`;
  }

  /**
   * Get queue instances (for worker setup)
   */
  getQueues() {
    return {
      visionQueue: this.visionQueue,
      marketQueue: this.marketQueue
    };
  }
}

interface QueueMetrics {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  total: number;
}

/**
 * Retry strategy with exponential backoff
 */
export function exponentialBackoff(attemptsMade: number, error: Error): number {
  // Max 5 attempts
  if (attemptsMade >= 5) {
    return -1; // Stop retrying
  }

  // Exponential: 2s, 4s, 8s, 16s, 32s
  return Math.min(1000 * Math.pow(2, attemptsMade), 32000);
}
