/**
 * Image Processor Agent Tests
 * Unit tests for image processing operations
 */

import { ImageProcessorAgent } from '../../src/lib/agents/image-processor';
import { existsSync, writeFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const TEST_IMAGE_DIR = join(__dirname, 'test-images');
const TEST_OUTPUT_DIR = join(__dirname, 'test-output');

describe('ImageProcessorAgent', () => {
  let agent: ImageProcessorAgent;
  let testImagePath: string;

  beforeAll(async () => {
    // Create test directories
    if (!existsSync(TEST_IMAGE_DIR)) {
      mkdirSync(TEST_IMAGE_DIR, { recursive: true });
    }
    if (!existsSync(TEST_OUTPUT_DIR)) {
      mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
    }

    // Create test image (solid red square)
    testImagePath = join(TEST_IMAGE_DIR, 'test-product.jpg');
    await sharp({
      create: {
        width: 1000,
        height: 1000,
        channels: 3,
        background: { r: 255, g: 0, b: 0 }
      }
    })
      .jpeg()
      .toFile(testImagePath);
  });

  beforeEach(() => {
    agent = new ImageProcessorAgent({
      cacheDir: TEST_OUTPUT_DIR
    });
  });

  afterEach(() => {
    // Clear cache after each test
    agent.clearCache();
  });

  afterAll(() => {
    // Cleanup test files
    if (existsSync(testImagePath)) {
      unlinkSync(testImagePath);
    }

    // Remove test directories
    const fs = require('fs');
    if (existsSync(TEST_IMAGE_DIR)) {
      fs.rmSync(TEST_IMAGE_DIR, { recursive: true });
    }
    if (existsSync(TEST_OUTPUT_DIR)) {
      fs.rmSync(TEST_OUTPUT_DIR, { recursive: true });
    }
  });

  describe('enhance', () => {
    it('should enhance image with default options', async () => {
      const enhancedPath = await agent.enhance(testImagePath);

      expect(existsSync(enhancedPath)).toBe(true);

      const metadata = await sharp(enhancedPath).metadata();
      expect(metadata.format).toBe('jpeg');
    });

    it('should use cache on second call', async () => {
      const path1 = await agent.enhance(testImagePath);
      const path2 = await agent.enhance(testImagePath);

      expect(path1).toBe(path2);
    });

    it('should apply custom enhancement options', async () => {
      const enhancedPath = await agent.enhance(testImagePath, {
        sharpen: true,
        brighten: true,
        contrast: true,
        autoLevel: true,
        quality: 95
      });

      expect(existsSync(enhancedPath)).toBe(true);
    });
  });

  describe('resizeForPlatform', () => {
    it('should resize for eBay (1600x1600)', async () => {
      const resizedPath = await agent.resizeForPlatform(testImagePath, 'ebay');

      expect(existsSync(resizedPath)).toBe(true);

      const metadata = await sharp(resizedPath).metadata();
      expect(metadata.width).toBeLessThanOrEqual(1600);
      expect(metadata.height).toBeLessThanOrEqual(1600);
    });

    it('should resize for Facebook (1200x1200)', async () => {
      const resizedPath = await agent.resizeForPlatform(testImagePath, 'facebook');

      const metadata = await sharp(resizedPath).metadata();
      expect(metadata.width).toBeLessThanOrEqual(1200);
      expect(metadata.height).toBeLessThanOrEqual(1200);
    });

    it('should throw error for unknown platform', async () => {
      await expect(
        agent.resizeForPlatform(testImagePath, 'unknown-platform')
      ).rejects.toThrow('Unknown platform');
    });

    it('should maintain aspect ratio', async () => {
      // Create wide image (2:1 ratio)
      const wideImagePath = join(TEST_IMAGE_DIR, 'wide.jpg');
      await sharp({
        create: {
          width: 2000,
          height: 1000,
          channels: 3,
          background: { r: 0, g: 0, b: 255 }
        }
      })
        .jpeg()
        .toFile(wideImagePath);

      const resizedPath = await agent.resizeForPlatform(wideImagePath, 'ebay');
      const metadata = await sharp(resizedPath).metadata();

      // Should fit within 1600x1600 while maintaining 2:1 ratio
      expect(metadata.width).toBeLessThanOrEqual(1600);
      expect(metadata.height).toBeLessThanOrEqual(1600);

      const ratio = metadata.width! / metadata.height!;
      expect(ratio).toBeCloseTo(2, 1);

      unlinkSync(wideImagePath);
    });
  });

  describe('addWatermark', () => {
    it('should add watermark text to image', async () => {
      const watermarkedPath = await agent.addWatermark(
        testImagePath,
        'BoomWare House'
      );

      expect(existsSync(watermarkedPath)).toBe(true);
    });

    it('should use cache for same watermark', async () => {
      const path1 = await agent.addWatermark(testImagePath, 'Test');
      const path2 = await agent.addWatermark(testImagePath, 'Test');

      expect(path1).toBe(path2);
    });
  });

  describe('processGallery', () => {
    it('should process multiple images', async () => {
      // Create second test image
      const testImage2Path = join(TEST_IMAGE_DIR, 'test-product-2.jpg');
      await sharp({
        create: {
          width: 800,
          height: 800,
          channels: 3,
          background: { r: 0, g: 255, b: 0 }
        }
      })
        .jpeg()
        .toFile(testImage2Path);

      const processedPaths = await agent.processGallery([
        testImagePath,
        testImage2Path
      ]);

      expect(processedPaths).toHaveLength(2);
      expect(existsSync(processedPaths[0])).toBe(true);
      expect(existsSync(processedPaths[1])).toBe(true);

      unlinkSync(testImage2Path);
    });

    it('should apply watermark to all images in gallery', async () => {
      const processedPaths = await agent.processGallery([testImagePath], {
        watermark: 'Test Watermark'
      });

      expect(processedPaths).toHaveLength(1);
      expect(existsSync(processedPaths[0])).toBe(true);
    });

    it('should process gallery in parallel', async () => {
      const images = Array(5).fill(testImagePath);

      const startTime = Date.now();
      const processedPaths = await agent.processGallery(images);
      const duration = Date.now() - startTime;

      expect(processedPaths).toHaveLength(5);
      // Parallel processing should be faster than sequential
      // (This is a rough check, actual timing may vary)
      expect(duration).toBeLessThan(5000);
    });
  });

  describe('processForAllPlatforms', () => {
    it('should create platform-specific versions', async () => {
      const results = await agent.processForAllPlatforms([testImagePath]);

      expect(results).toHaveLength(5); // 5 platforms
      expect(results[0].platform).toBeDefined();
      expect(results[0].images).toHaveLength(1);

      // Check eBay version
      const ebayResult = results.find((r) => r.platform === 'ebay');
      expect(ebayResult).toBeDefined();
      expect(existsSync(ebayResult!.images[0])).toBe(true);

      const metadata = await sharp(ebayResult!.images[0]).metadata();
      expect(metadata.width).toBeLessThanOrEqual(1600);
    });
  });

  describe('cache management', () => {
    it('should report cache statistics', async () => {
      await agent.enhance(testImagePath);
      await agent.resizeForPlatform(testImagePath, 'ebay');

      const stats = agent.getCacheStats();

      expect(stats.totalImages).toBeGreaterThan(0);
      expect(stats.totalSizeBytes).toBeGreaterThan(0);
      expect(stats.cacheDir).toBe(TEST_OUTPUT_DIR);
    });

    it('should clear cache successfully', async () => {
      await agent.enhance(testImagePath);

      agent.clearCache();

      const stats = agent.getCacheStats();
      expect(stats.totalImages).toBe(0);
    });
  });

  describe('platform management', () => {
    it('should return all platform sizes', () => {
      const sizes = agent.getPlatformSizes();

      expect(sizes.ebay).toEqual({ width: 1600, height: 1600 });
      expect(sizes.facebook).toEqual({ width: 1200, height: 1200 });
      expect(sizes.mercari).toEqual({ width: 1080, height: 1080 });
      expect(sizes.poshmark).toEqual({ width: 1280, height: 1280 });
      expect(sizes.offerup).toEqual({ width: 1024, height: 1024 });
    });

    it('should add custom platform size', () => {
      agent.addPlatformSize('etsy', 2000, 2000);

      const sizes = agent.getPlatformSizes();
      expect(sizes.etsy).toEqual({ width: 2000, height: 2000 });
    });
  });
});
