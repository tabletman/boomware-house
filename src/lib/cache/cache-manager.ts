/**
 * Multi-Layer Caching System
 * L1: Memory (LRU) - L2: Redis - L3: Database
 */

import Redis from 'ioredis';
import { LRUCache } from 'lru-cache';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  memory?: {
    max: number;
    ttl: number;
  };
}

export class CacheManager {
  private redis: Redis;
  private memoryCache: LRUCache<string, any>;

  constructor(config: CacheConfig) {
    // L1: Memory cache (hot data, 5min TTL)
    this.memoryCache = new LRUCache({
      max: config.memory?.max || 1000,
      ttl: config.memory?.ttl || 5 * 60 * 1000, // 5 minutes
      updateAgeOnGet: true,
      updateAgeOnHas: false
    });

    // L2: Redis cache
    this.redis = new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis cache error:', error);
    });

    this.redis.on('connect', () => {
      console.log('✅ Redis cache connected');
    });
  }

  /**
   * Get from cache (L1 → L2 → L3)
   */
  async get<T = any>(key: string): Promise<T | null> {
    try {
      // L1: Memory cache
      const memCached = this.memoryCache.get(key);
      if (memCached !== undefined) {
        return memCached as T;
      }

      // L2: Redis cache
      const redisCached = await this.redis.get(key);
      if (redisCached) {
        const parsed = JSON.parse(redisCached);
        // Populate L1 cache
        this.memoryCache.set(key, parsed);
        return parsed as T;
      }

      return null;
    } catch (error) {
      console.error(`❌ Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set in cache (L1 + L2)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      // L1: Memory cache
      this.memoryCache.set(key, value);

      // L2: Redis cache
      const serialized = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (error) {
      console.error(`❌ Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Delete from cache
   */
  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await this.redis.del(key);
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();
    await this.redis.flushdb();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      memory: {
        size: this.memoryCache.size,
        max: this.memoryCache.max,
        calculatedSize: this.memoryCache.calculatedSize
      }
    };
  }

  /**
   * Get multiple keys
   */
  async mget(keys: string[]): Promise<(any | null)[]> {
    const results = await Promise.all(keys.map(k => this.get(k)));
    return results;
  }

  /**
   * Set multiple keys
   */
  async mset(entries: Array<{ key: string; value: any; ttl?: number }>): Promise<void> {
    await Promise.all(entries.map(e => this.set(e.key, e.value, e.ttl)));
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    if (this.memoryCache.has(key)) {
      return true;
    }
    const exists = await this.redis.exists(key);
    return exists === 1;
  }

  /**
   * Get keys matching pattern
   */
  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  /**
   * Increment counter
   */
  async incr(key: string, ttl?: number): Promise<number> {
    const result = await this.redis.incr(key);
    if (ttl && result === 1) {
      await this.redis.expire(key, ttl);
    }
    return result;
  }

  /**
   * Decrement counter
   */
  async decr(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  /**
   * Get TTL for key
   */
  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
  }

  /**
   * Extend TTL for key
   */
  async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl);
  }

  /**
   * Close connections
   */
  async close(): Promise<void> {
    this.memoryCache.clear();
    await this.redis.quit();
  }
}

/**
 * Cache key builders for consistent naming
 */
export class CacheKeys {
  static vision(imageHashes: string[]): string {
    const hash = imageHashes.join('|');
    return `vision:${this.hashString(hash)}:v1`;
  }

  static market(brand: string, model: string, condition: string): string {
    return `market:${brand}:${model}:${condition}:v1`.toLowerCase();
  }

  static embeddings(productId: string): string {
    return `embed:${productId}:v1`;
  }

  static ebaySearch(query: string): string {
    return `ebay:search:${this.hashString(query)}:v1`;
  }

  static pricing(platform: string, query: string): string {
    return `pricing:${platform}:${this.hashString(query)}:v1`;
  }

  private static hashString(str: string): string {
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(str)
      .digest('hex')
      .substring(0, 16);
  }
}
