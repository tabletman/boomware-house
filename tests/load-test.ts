/**
 * Load Testing Suite for BOOMER Agent
 * Tests throughput, latency, and reliability under various loads
 */

import { JobQueueManager } from '../src/lib/queue/job-queue';
import { WorkerPoolManager } from '../src/lib/queue/worker-pool';
import { MetricsCollector } from '../src/lib/metrics/collector';

interface LoadTestConfig {
  name: string;
  itemCount: number;
  duration: number; // seconds
  pattern: 'constant' | 'burst' | 'ramp';
  concurrency?: number;
  expectations: {
    p95Latency?: number; // ms
    errorRate?: number; // 0-1
    throughput?: number; // items/hour
    costPerItem?: number; // $
  };
}

interface LoadTestResult {
  config: LoadTestConfig;
  metrics: {
    totalItems: number;
    successfulItems: number;
    failedItems: number;
    avgLatency: number;
    p50Latency: number;
    p95Latency: number;
    p99Latency: number;
    throughput: number;
    errorRate: number;
    totalCost: number;
    avgCostPerItem: number;
  };
  passed: boolean;
  failures: string[];
}

export class LoadTester {
  private queueManager: JobQueueManager;
  private workerPool: WorkerPoolManager;
  private metrics: MetricsCollector;

  constructor() {
    this.queueManager = new JobQueueManager({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
      },
      concurrency: 10
    });

    this.workerPool = new WorkerPoolManager({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
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
      anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
      tavilyApiKey: process.env.TAVILY_API_KEY,
      perplexityApiKey: process.env.PERPLEXITY_API_KEY
    });

    this.metrics = new MetricsCollector();
  }

  /**
   * Run load test scenario
   */
  async runTest(config: LoadTestConfig): Promise<LoadTestResult> {
    console.log(`\n🧪 Starting load test: ${config.name}`);
    console.log(`   Items: ${config.itemCount}`);
    console.log(`   Duration: ${config.duration}s`);
    console.log(`   Pattern: ${config.pattern}\n`);

    const startTime = Date.now();
    const results: any[] = [];
    const failures: string[] = [];

    try {
      // Start workers
      await this.workerPool.start();

      // Generate load based on pattern
      const jobs = await this.generateLoad(config);

      // Wait for completion
      const jobResults = await this.waitForCompletion(
        jobs,
        config.duration * 1000
      );

      // Collect results
      for (const result of jobResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          failures.push(result.reason.message);
        }
      }

      // Calculate metrics
      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const latencies = results
        .map(r => r.processingTime)
        .filter(t => t !== undefined)
        .sort((a, b) => a - b);

      const metrics = {
        totalItems: config.itemCount,
        successfulItems: results.length,
        failedItems: failures.length,
        avgLatency: this.average(latencies),
        p50Latency: this.percentile(latencies, 0.50),
        p95Latency: this.percentile(latencies, 0.95),
        p99Latency: this.percentile(latencies, 0.99),
        throughput: (results.length / durationMs) * 3600 * 1000, // items/hour
        errorRate: failures.length / config.itemCount,
        totalCost: 0, // TODO: Calculate from actual costs
        avgCostPerItem: 0
      };

      // Validate expectations
      const passed = this.validateExpectations(metrics, config.expectations);

      return {
        config,
        metrics,
        passed,
        failures: failures.slice(0, 10) // First 10 failures
      };

    } finally {
      await this.cleanup();
    }
  }

  /**
   * Run all test scenarios
   */
  async runAllTests(): Promise<LoadTestResult[]> {
    const scenarios: LoadTestConfig[] = [
      {
        name: 'Steady State - 100 items/hour',
        itemCount: 100,
        duration: 3600, // 1 hour
        pattern: 'constant',
        expectations: {
          p95Latency: 10000, // 10s
          errorRate: 0.01, // 1%
          throughput: 100,
          costPerItem: 0.10
        }
      },
      {
        name: 'Burst Load - 500 items',
        itemCount: 500,
        duration: 300, // 5 minutes
        pattern: 'burst',
        expectations: {
          p95Latency: 15000, // 15s (higher under burst)
          errorRate: 0.02 // 2%
        }
      },
      {
        name: 'Ramp Up - 1000 items over 2 hours',
        itemCount: 1000,
        duration: 7200, // 2 hours
        pattern: 'ramp',
        expectations: {
          p95Latency: 12000, // 12s
          errorRate: 0.01,
          throughput: 500
        }
      },
      {
        name: 'Endurance - 2000 items over 10 hours',
        itemCount: 2000,
        duration: 36000, // 10 hours
        pattern: 'constant',
        expectations: {
          p95Latency: 10000,
          errorRate: 0.01,
          throughput: 200
        }
      }
    ];

    const results: LoadTestResult[] = [];

    for (const scenario of scenarios) {
      const result = await this.runTest(scenario);
      results.push(result);

      // Print summary
      this.printTestResult(result);

      // Wait between tests
      await this.sleep(60000); // 1 minute cooldown
    }

    return results;
  }

  /**
   * Generate load based on pattern
   */
  private async generateLoad(config: LoadTestConfig): Promise<string[]> {
    const jobIds: string[] = [];
    const testImages = ['/path/to/test/image1.jpg']; // Mock images

    switch (config.pattern) {
      case 'constant':
        // Evenly distributed over duration
        const interval = (config.duration * 1000) / config.itemCount;
        for (let i = 0; i < config.itemCount; i++) {
          const job = await this.queueManager.addVisionJob(testImages);
          jobIds.push(job.id!);
          if (i < config.itemCount - 1) {
            await this.sleep(interval);
          }
        }
        break;

      case 'burst':
        // All at once
        const jobs = await this.queueManager.addBatchVisionJobs(
          Array(config.itemCount).fill({ imagePaths: testImages })
        );
        jobIds.push(...jobs.map(j => j.id!));
        break;

      case 'ramp':
        // Gradually increase rate
        const rampSteps = 10;
        const itemsPerStep = Math.floor(config.itemCount / rampSteps);
        const stepDuration = config.duration / rampSteps;

        for (let step = 0; step < rampSteps; step++) {
          const stepInterval = (stepDuration * 1000) / itemsPerStep;
          for (let i = 0; i < itemsPerStep; i++) {
            const job = await this.queueManager.addVisionJob(testImages);
            jobIds.push(job.id!);
            await this.sleep(stepInterval);
          }
        }
        break;
    }

    return jobIds;
  }

  /**
   * Wait for all jobs to complete
   */
  private async waitForCompletion(
    jobIds: string[],
    timeoutMs: number
  ): Promise<PromiseSettledResult<any>[]> {
    const startTime = Date.now();

    const promises = jobIds.map(async (jobId) => {
      while (Date.now() - startTime < timeoutMs) {
        const status = await this.queueManager.getJobStatus(jobId);

        if (status.state === 'completed') {
          return status.result;
        } else if (status.state === 'failed') {
          throw new Error(status.failedReason || 'Job failed');
        }

        await this.sleep(1000);
      }

      throw new Error('Timeout waiting for job completion');
    });

    return Promise.allSettled(promises);
  }

  /**
   * Validate test expectations
   */
  private validateExpectations(
    metrics: any,
    expectations: LoadTestConfig['expectations']
  ): boolean {
    const checks: boolean[] = [];

    if (expectations.p95Latency) {
      checks.push(metrics.p95Latency <= expectations.p95Latency);
    }
    if (expectations.errorRate) {
      checks.push(metrics.errorRate <= expectations.errorRate);
    }
    if (expectations.throughput) {
      checks.push(metrics.throughput >= expectations.throughput);
    }
    if (expectations.costPerItem) {
      checks.push(metrics.avgCostPerItem <= expectations.costPerItem);
    }

    return checks.every(Boolean);
  }

  /**
   * Print test result summary
   */
  private printTestResult(result: LoadTestResult): void {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📊 ${result.config.name} - ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Items:       ${result.metrics.successfulItems}/${result.metrics.totalItems} (${Math.round(result.metrics.successfulItems / result.metrics.totalItems * 100)}%)`);
    console.log(`Throughput:  ${Math.round(result.metrics.throughput)} items/hour`);
    console.log(`Avg Latency: ${Math.round(result.metrics.avgLatency)}ms`);
    console.log(`P95 Latency: ${Math.round(result.metrics.p95Latency)}ms`);
    console.log(`P99 Latency: ${Math.round(result.metrics.p99Latency)}ms`);
    console.log(`Error Rate:  ${Math.round(result.metrics.errorRate * 100)}%`);

    if (result.failures.length > 0) {
      console.log(`\nTop Failures:`);
      result.failures.slice(0, 5).forEach((f, i) => {
        console.log(`  ${i + 1}. ${f}`);
      });
    }

    console.log(`${'='.repeat(80)}\n`);
  }

  /**
   * Cleanup resources
   */
  private async cleanup(): Promise<void> {
    await this.workerPool.shutdown();
    await this.queueManager.close();
  }

  /**
   * Utility functions
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private average(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }

  private percentile(arr: number[], p: number): number {
    if (arr.length === 0) return 0;
    const index = Math.ceil(arr.length * p) - 1;
    return arr[index] || 0;
  }
}

/**
 * Run load tests
 */
async function main() {
  const tester = new LoadTester();

  try {
    console.log('🚀 BOOMER Agent Load Testing Suite\n');

    const results = await tester.runAllTests();

    // Final summary
    console.log('\n' + '='.repeat(80));
    console.log('📈 FINAL SUMMARY');
    console.log('='.repeat(80));

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    console.log(`Total Tests: ${results.length}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${Math.round(passed / results.length * 100)}%`);

    process.exit(failed > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Load test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { LoadTester };
