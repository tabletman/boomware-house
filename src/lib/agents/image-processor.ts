/**
 * Image Processor Agent
 * Optimize images for maximum conversion across platforms
 */

import sharp from 'sharp';
import axios from 'axios';
import { createHash } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';

export interface EnhanceOptions {
  sharpen?: boolean;
  brighten?: boolean;
  contrast?: boolean;
  autoLevel?: boolean;
  quality?: number;
}

export interface ProcessOptions {
  removeBackground?: boolean;
  enhance?: EnhanceOptions;
  watermark?: string;
  outputDir?: string;
}

export interface PlatformSizes {
  [platform: string]: { width: number; height: number };
}

export class ImageProcessorAgent {
  private readonly platformSizes: PlatformSizes = {
    ebay: { width: 1600, height: 1600 },
    facebook: { width: 1200, height: 1200 },
    mercari: { width: 1080, height: 1080 },
    poshmark: { width: 1280, height: 1280 },
    offerup: { width: 1024, height: 1024 }
  };

  private readonly removeApiKey?: string;
  private readonly cacheDir: string;

  constructor(config?: {
    removeBgApiKey?: string;
    cacheDir?: string;
  }) {
    this.removeApiKey = config?.removeBgApiKey || process.env.REMOVE_BG_API_KEY;
    this.cacheDir = config?.cacheDir || join(process.cwd(), 'data', 'processed-images');

    // Ensure cache directory exists
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Remove background using remove.bg API
   * Cost: ~$0.09 per image (or free tier: 50/month)
   */
  async removeBackground(imagePath: string): Promise<string> {
    if (!this.removeApiKey) {
      throw new Error('remove.bg API key not configured');
    }

    // Check cache first
    const cacheKey = this.getCacheKey(imagePath, 'nobg');
    const cachedPath = join(this.cacheDir, `${cacheKey}.png`);

    if (existsSync(cachedPath)) {
      console.log('💾 Background removal cached hit');
      return cachedPath;
    }

    console.log('🎨 Removing background via remove.bg API...');

    try {
      const formData = new FormData();
      const imageBuffer = await sharp(imagePath).toBuffer();
      const blob = new Blob([imageBuffer]);

      formData.append('image_file', blob);
      formData.append('size', 'auto');

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': this.removeApiKey
          },
          responseType: 'arraybuffer'
        }
      );

      // Save to cache
      await sharp(response.data)
        .png()
        .toFile(cachedPath);

      console.log('✅ Background removed successfully');
      return cachedPath;
    } catch (error: any) {
      throw new Error(`Background removal failed: ${error.message}`);
    }
  }

  /**
   * Enhance image quality
   * Free, uses sharp built-in processing
   */
  async enhance(
    imagePath: string,
    options: EnhanceOptions = {}
  ): Promise<string> {
    const {
      sharpen = true,
      brighten = false,
      contrast = false,
      autoLevel = true,
      quality = 90
    } = options;

    const cacheKey = this.getCacheKey(imagePath, 'enhanced', options);
    const cachedPath = join(this.cacheDir, `${cacheKey}.jpg`);

    if (existsSync(cachedPath)) {
      console.log('💾 Enhancement cached hit');
      return cachedPath;
    }

    console.log('✨ Enhancing image...');

    let pipeline = sharp(imagePath);

    // Auto-level (normalize)
    if (autoLevel) {
      pipeline = pipeline.normalize();
    }

    // Sharpen
    if (sharpen) {
      pipeline = pipeline.sharpen();
    }

    // Brightness
    if (brighten) {
      pipeline = pipeline.modulate({ brightness: 1.1 });
    }

    // Contrast
    if (contrast) {
      pipeline = pipeline.modulate({ saturation: 1.1 });
    }

    // Save enhanced image
    await pipeline
      .jpeg({ quality, mozjpeg: true })
      .toFile(cachedPath);

    console.log('✅ Image enhanced successfully');
    return cachedPath;
  }

  /**
   * Resize image for specific platform
   */
  async resizeForPlatform(
    imagePath: string,
    platform: string
  ): Promise<string> {
    const size = this.platformSizes[platform.toLowerCase()];

    if (!size) {
      throw new Error(`Unknown platform: ${platform}`);
    }

    const cacheKey = this.getCacheKey(imagePath, `${platform}_sized`);
    const cachedPath = join(this.cacheDir, `${cacheKey}.jpg`);

    if (existsSync(cachedPath)) {
      console.log(`💾 Platform resize (${platform}) cached hit`);
      return cachedPath;
    }

    console.log(`📐 Resizing for ${platform} (${size.width}x${size.height})...`);

    await sharp(imagePath)
      .resize(size.width, size.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(cachedPath);

    console.log('✅ Image resized successfully');
    return cachedPath;
  }

  /**
   * Add watermark to image
   */
  async addWatermark(
    imagePath: string,
    text: string
  ): Promise<string> {
    const cacheKey = this.getCacheKey(imagePath, 'watermark', { text });
    const cachedPath = join(this.cacheDir, `${cacheKey}.jpg`);

    if (existsSync(cachedPath)) {
      console.log('💾 Watermark cached hit');
      return cachedPath;
    }

    console.log('🏷️  Adding watermark...');

    // Create watermark SVG
    const watermarkSvg = Buffer.from(`
      <svg width="400" height="50">
        <text x="200" y="25" text-anchor="middle"
              font-family="Arial" font-size="20"
              fill="white" fill-opacity="0.7">
          ${text}
        </text>
      </svg>
    `);

    const image = sharp(imagePath);
    const metadata = await image.metadata();

    await image
      .composite([{
        input: watermarkSvg,
        gravity: 'southeast'
      }])
      .jpeg({ quality: 90 })
      .toFile(cachedPath);

    console.log('✅ Watermark added successfully');
    return cachedPath;
  }

  /**
   * Process complete image gallery
   * Applies all enhancements in optimal order
   */
  async processGallery(
    imagePaths: string[],
    options: ProcessOptions = {}
  ): Promise<string[]> {
    const {
      removeBackground = false,
      enhance: enhanceOpts = { sharpen: true, autoLevel: true },
      watermark,
      outputDir = this.cacheDir
    } = options;

    console.log(`📸 Processing ${imagePaths.length} images...`);

    const results = await Promise.all(
      imagePaths.map(async (imagePath, index) => {
        console.log(`\n[${index + 1}/${imagePaths.length}] Processing: ${basename(imagePath)}`);

        let processedPath = imagePath;

        // Step 1: Remove background (if requested)
        if (removeBackground) {
          processedPath = await this.removeBackground(processedPath);
        }

        // Step 2: Enhance
        processedPath = await this.enhance(processedPath, enhanceOpts);

        // Step 3: Watermark (if requested)
        if (watermark) {
          processedPath = await this.addWatermark(processedPath, watermark);
        }

        return processedPath;
      })
    );

    console.log(`\n✅ Gallery processing complete: ${results.length} images`);
    return results;
  }

  /**
   * Batch process and resize for all platforms
   */
  async processForAllPlatforms(
    imagePaths: string[],
    options: ProcessOptions = {}
  ): Promise<{
    platform: string;
    images: string[];
  }[]> {
    // First, process the gallery (enhance, remove bg, etc.)
    const processedImages = await this.processGallery(imagePaths, options);

    // Then resize for each platform
    const platforms = Object.keys(this.platformSizes);

    const results = await Promise.all(
      platforms.map(async (platform) => {
        console.log(`\n📦 Preparing images for ${platform}...`);

        const platformImages = await Promise.all(
          processedImages.map(async (imagePath) =>
            this.resizeForPlatform(imagePath, platform)
          )
        );

        return {
          platform,
          images: platformImages
        };
      })
    );

    console.log('\n✅ Multi-platform processing complete');
    return results;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    cacheDir: string;
    totalImages: number;
    totalSizeBytes: number;
  } {
    const fs = require('fs');

    if (!existsSync(this.cacheDir)) {
      return {
        cacheDir: this.cacheDir,
        totalImages: 0,
        totalSizeBytes: 0
      };
    }

    const files = fs.readdirSync(this.cacheDir);
    const totalSizeBytes = files.reduce((sum: number, file: string) => {
      const stats = fs.statSync(join(this.cacheDir, file));
      return sum + stats.size;
    }, 0);

    return {
      cacheDir: this.cacheDir,
      totalImages: files.length,
      totalSizeBytes
    };
  }

  /**
   * Clear image cache
   */
  clearCache(): void {
    const fs = require('fs');

    if (!existsSync(this.cacheDir)) {
      return;
    }

    const files = fs.readdirSync(this.cacheDir);
    files.forEach((file: string) => {
      fs.unlinkSync(join(this.cacheDir, file));
    });

    console.log('🧹 Image cache cleared');
  }

  /**
   * Generate cache key from image path and operation
   */
  private getCacheKey(
    imagePath: string,
    operation: string,
    options?: any
  ): string {
    const hash = createHash('sha256')
      .update(imagePath)
      .update(operation)
      .update(JSON.stringify(options || {}))
      .digest('hex')
      .substring(0, 16);

    return `${operation}_${hash}`;
  }

  /**
   * Get platform size requirements
   */
  getPlatformSizes(): PlatformSizes {
    return { ...this.platformSizes };
  }

  /**
   * Add custom platform size
   */
  addPlatformSize(platform: string, width: number, height: number): void {
    this.platformSizes[platform.toLowerCase()] = { width, height };
  }
}
