/**
 * Metrics Collection System
 * Tracks performance, costs, and reliability metrics
 */

import { EventEmitter } from 'events';

export interface Metrics {
  // Throughput
  itemsPerHour: number;
  avgProcessingTime: number;
  totalProcessed: number;

  // Quality
  successRate: number;
  errorRate: number;
  cacheHitRate: number;

  // Resources
  queueDepth: number;
  workerUtilization: number;
  memoryUsage: number;

  // Cost
  totalCost: number;
  avgCostPerItem: number;
  costBreakdown: {
    vision: number;
    market: number;
    infrastructure: number;
  };

  // Latency percentiles
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
}

export class MetricsCollector extends EventEmitter {
  private processingTimes: { type: string; duration: number; timestamp: number }[] = [];
  private errors: { type: string; message: string; timestamp: number }[] = [];
  private cacheHits = { vision: 0, market: 0 };
  private cacheMisses = { vision: 0, market: 0 };
  private jobsCompleted = { vision: 0, market: 0 };
  private jobsFailed = { vision: 0, market: 0 };
  private costs = { vision: 0, market: 0, infrastructure: 0 };

  private windowSize = 60 * 60 * 1000; // 1 hour rolling window

  constructor() {
    super();

    // Cleanup old metrics every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Record job completion
   */
  recordJobCompleted(type: 'vision' | 'market', jobId: string, duration: number): void {
    this.jobsCompleted[type]++;
    this.emit('job:completed', { type, jobId, duration });
  }

  /**
   * Record job failure
   */
  recordJobFailed(type: 'vision' | 'market', jobId: string, error: string): void {
    this.jobsFailed[type]++;
    this.errors.push({
      type,
      message: error,
      timestamp: Date.now()
    });
    this.emit('job:failed', { type, jobId, error });
  }

  /**
   * Record processing time
   */
  recordProcessingTime(type: string, duration: number): void {
    this.processingTimes.push({
      type,
      duration,
      timestamp: Date.now()
    });
  }

  /**
   * Record cache hit
   */
  recordCacheHit(type: 'vision' | 'market'): void {
    this.cacheHits[type]++;
    this.emit('cache:hit', { type });
  }

  /**
   * Record cache miss
   */
  recordCacheMiss(type: 'vision' | 'market'): void {
    this.cacheMisses[type]++;
    this.emit('cache:miss', { type });
  }

  /**
   * Record error
   */
  recordError(type: string, message: string): void {
    this.errors.push({
      type,
      message,
      timestamp: Date.now()
    });
    this.emit('error', { type, message });
  }

  /**
   * Record cost
   */
  recordCost(type: 'vision' | 'market' | 'infrastructure', amount: number): void {
    this.costs[type] += amount;
    this.emit('cost', { type, amount });
  }

  /**
   * Get current metrics
   */
  async getMetrics(): Promise<Metrics> {
    const now = Date.now();
    const hourAgo = now - this.windowSize;

    // Filter to 1-hour window
    const recentProcessing = this.processingTimes.filter(p => p.timestamp > hourAgo);
    const recentErrors = this.errors.filter(e => e.timestamp > hourAgo);

    // Calculate latency percentiles
    const sortedTimes = recentProcessing.map(p => p.duration).sort((a, b) => a - b);
    const p50 = this.percentile(sortedTimes, 0.50);
    const p95 = this.percentile(sortedTimes, 0.95);
    const p99 = this.percentile(sortedTimes, 0.99);

    // Calculate rates
    const totalJobs = this.jobsCompleted.vision + this.jobsCompleted.market;
    const totalFailed = this.jobsFailed.vision + this.jobsFailed.market;
    const successRate = totalJobs > 0 ? (totalJobs - totalFailed) / totalJobs : 0;
    const errorRate = totalJobs > 0 ? totalFailed / totalJobs : 0;

    // Cache hit rate
    const totalCacheRequests =
      this.cacheHits.vision + this.cacheMisses.vision +
      this.cacheHits.market + this.cacheMisses.market;
    const totalCacheHits = this.cacheHits.vision + this.cacheHits.market;
    const cacheHitRate = totalCacheRequests > 0 ? totalCacheHits / totalCacheRequests : 0;

    // Average processing time
    const avgProcessingTime = recentProcessing.length > 0
      ? recentProcessing.reduce((sum, p) => sum + p.duration, 0) / recentProcessing.length
      : 0;

    // Items per hour
    const itemsPerHour = recentProcessing.length;

    // Cost metrics
    const totalCost = this.costs.vision + this.costs.market + this.costs.infrastructure;
    const avgCostPerItem = totalJobs > 0 ? totalCost / totalJobs : 0;

    return {
      itemsPerHour,
      avgProcessingTime: Math.round(avgProcessingTime),
      totalProcessed: totalJobs,
      successRate: Math.round(successRate * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100,
      cacheHitRate: Math.round(cacheHitRate * 100) / 100,
      queueDepth: 0, // Populated by queue manager
      workerUtilization: 0, // Populated by worker pool
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      totalCost: Math.round(totalCost * 100) / 100,
      avgCostPerItem: Math.round(avgCostPerItem * 1000) / 1000,
      costBreakdown: {
        vision: Math.round(this.costs.vision * 100) / 100,
        market: Math.round(this.costs.market * 100) / 100,
        infrastructure: Math.round(this.costs.infrastructure * 100) / 100
      },
      p50Latency: Math.round(p50),
      p95Latency: Math.round(p95),
      p99Latency: Math.round(p99)
    };
  }

  /**
   * Get queue metrics (populated by queue manager)
   */
  async getQueueMetrics(): Promise<any> {
    // Override by queue manager
    return {
      vision: { waiting: 0, active: 0, completed: 0, failed: 0 },
      market: { waiting: 0, active: 0, completed: 0, failed: 0 }
    };
  }

  /**
   * Get recent errors
   */
  getRecentErrors(count: number = 10): any[] {
    return this.errors
      .slice(-count)
      .reverse()
      .map(e => ({
        type: e.type,
        message: e.message,
        timestamp: new Date(e.timestamp).toISOString()
      }));
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      vision: {
        hits: this.cacheHits.vision,
        misses: this.cacheMisses.vision,
        hitRate: this.cacheHits.vision / (this.cacheHits.vision + this.cacheMisses.vision) || 0
      },
      market: {
        hits: this.cacheHits.market,
        misses: this.cacheMisses.market,
        hitRate: this.cacheHits.market / (this.cacheHits.market + this.cacheMisses.market) || 0
      }
    };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.processingTimes = [];
    this.errors = [];
    this.cacheHits = { vision: 0, market: 0 };
    this.cacheMisses = { vision: 0, market: 0 };
    this.jobsCompleted = { vision: 0, market: 0 };
    this.jobsFailed = { vision: 0, market: 0 };
    this.costs = { vision: 0, market: 0, infrastructure: 0 };
  }

  /**
   * Cleanup old metrics
   */
  private cleanup(): void {
    const cutoff = Date.now() - this.windowSize;
    this.processingTimes = this.processingTimes.filter(p => p.timestamp > cutoff);
    this.errors = this.errors.filter(e => e.timestamp > cutoff);
  }

  /**
   * Calculate percentile
   */
  private percentile(arr: number[], p: number): number {
    if (arr.length === 0) return 0;
    const index = Math.ceil(arr.length * p) - 1;
    return arr[index] || 0;
  }

  /**
   * Export metrics to Prometheus format
   */
  toPrometheus(): string {
    const metrics = this.getMetrics();

    return `
# HELP boomer_items_per_hour Items processed per hour
# TYPE boomer_items_per_hour gauge
boomer_items_per_hour ${metrics.then(m => m.itemsPerHour)}

# HELP boomer_success_rate Job success rate
# TYPE boomer_success_rate gauge
boomer_success_rate ${metrics.then(m => m.successRate)}

# HELP boomer_cache_hit_rate Cache hit rate
# TYPE boomer_cache_hit_rate gauge
boomer_cache_hit_rate ${metrics.then(m => m.cacheHitRate)}

# HELP boomer_p95_latency 95th percentile latency in ms
# TYPE boomer_p95_latency gauge
boomer_p95_latency ${metrics.then(m => m.p95Latency)}

# HELP boomer_cost_per_item Average cost per item
# TYPE boomer_cost_per_item gauge
boomer_cost_per_item ${metrics.then(m => m.avgCostPerItem)}
    `.trim();
  }
}
