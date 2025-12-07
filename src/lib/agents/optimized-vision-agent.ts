/**
 * Optimized Vision Agent with Prompt Caching
 * 75% cost reduction through cache + model selection
 */

import Anthropic from '@anthropic-ai/sdk';
import sharp from 'sharp';

export interface OptimizedVisionConfig {
  anthropicApiKey: string;
  defaultModel?: 'sonnet' | 'haiku';
  enablePromptCaching?: boolean;
  maxTokens?: number;
}

export class OptimizedVisionAgent {
  private client: Anthropic;
  private config: OptimizedVisionConfig;

  // Model configurations
  private models = {
    sonnet: 'claude-3-5-sonnet-20241022',  // Complex analysis
    haiku: 'claude-3-5-haiku-20241022'     // Fast tasks
  };

  // Cached system prompts (5min TTL)
  private SYSTEM_PROMPT_FULL = {
    type: 'text' as const,
    text: this.buildFullAnalysisPrompt(),
    cache_control: { type: 'ephemeral' as const }
  };

  private SYSTEM_PROMPT_CONDITION = {
    type: 'text' as const,
    text: this.buildConditionPrompt(),
    cache_control: { type: 'ephemeral' as const }
  };

  constructor(config: OptimizedVisionConfig) {
    this.config = {
      defaultModel: 'sonnet',
      enablePromptCaching: true,
      maxTokens: 4096,
      ...config
    };

    this.client = new Anthropic({
      apiKey: config.anthropicApiKey
    });
  }

  /**
   * Full product analysis (Sonnet + caching)
   * Cost: ~$0.015 first call, ~$0.004 cached
   */
  async analyzeProduct(
    imagePaths: string[],
    platforms: string[] = ['ebay']
  ): Promise<any> {
    const imageContents = await Promise.all(
      imagePaths.map(async (path) => ({
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: 'image/jpeg' as const,
          data: await this.prepareImage(path)
        }
      }))
    );

    const response = await this.client.messages.create({
      model: this.models.sonnet,
      max_tokens: this.config.maxTokens!,
      system: this.config.enablePromptCaching
        ? [this.SYSTEM_PROMPT_FULL]
        : [{ type: 'text', text: this.buildFullAnalysisPrompt() }],
      messages: [{
        role: 'user',
        content: [
          ...imageContents,
          {
            type: 'text',
            text: `Analyze for platforms: ${platforms.join(', ')}`
          }
        ]
      }]
    });

    // Track cache usage
    const usage = response.usage as any;
    const cacheHit = usage.cache_read_input_tokens > 0;

    console.log(`🎯 Vision analysis (${cacheHit ? 'CACHED' : 'FULL'})`);
    console.log(`   Input tokens: ${usage.input_tokens}`);
    console.log(`   Cached tokens: ${usage.cache_read_input_tokens || 0}`);
    console.log(`   Output tokens: ${usage.output_tokens}`);

    return this.parseAnalysis(response.content[0].text);
  }

  /**
   * Fast condition assessment (Haiku)
   * Cost: ~$0.001 per call
   */
  async assessCondition(imagePath: string): Promise<{
    state: string;
    confidence: number;
    notes: string;
  }> {
    const imageData = await this.prepareImage(imagePath);

    const response = await this.client.messages.create({
      model: this.models.haiku,
      max_tokens: 512,
      system: this.config.enablePromptCaching
        ? [this.SYSTEM_PROMPT_CONDITION]
        : [{ type: 'text', text: this.buildConditionPrompt() }],
      messages: [{
        role: 'user',
        content: [{
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageData
          }
        }]
      }]
    });

    return this.parseCondition(response.content[0].text);
  }

  /**
   * Batch image analysis (3 images at once)
   * 3x speedup vs sequential
   */
  async analyzeBatch(
    imageSets: string[][],
    platforms: string[] = ['ebay']
  ): Promise<any[]> {
    const tasks = imageSets.map(images =>
      this.analyzeProduct(images, platforms)
    );

    return Promise.all(tasks);
  }

  /**
   * Smart routing: Haiku for simple, Sonnet for complex
   */
  async analyzeWithRouting(
    imagePaths: string[],
    complexity: 'simple' | 'complex' = 'complex'
  ): Promise<any> {
    if (complexity === 'simple') {
      // Use Haiku for basic product identification
      const condition = await this.assessCondition(imagePaths[0]);
      return {
        product: { confidence: condition.confidence },
        condition
      };
    } else {
      // Use Sonnet for full analysis
      return this.analyzeProduct(imagePaths);
    }
  }

  /**
   * Generate title variations (Haiku)
   * Cost: ~$0.001 per call
   */
  async generateTitles(
    productData: any,
    count: number = 5
  ): Promise<string[]> {
    const response = await this.client.messages.create({
      model: this.models.haiku,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Generate ${count} eBay titles (max 80 chars) for:
${productData.product.brand} ${productData.product.name}
Category: ${productData.product.category}
Condition: ${productData.condition.state}

Return JSON array: ["title1", "title2", ...]`
      }]
    });

    const text = response.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  }

  /**
   * Prepare image: resize + compress + base64
   */
  private async prepareImage(imagePath: string): Promise<string> {
    const buffer = await sharp(imagePath)
      .resize(1568, 1568, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toBuffer();

    return buffer.toString('base64');
  }

  /**
   * Full analysis prompt (cached)
   */
  private buildFullAnalysisPrompt(): string {
    return `You are an expert product analyst for e-commerce marketplaces.

ANALYSIS FRAMEWORK:
1. Product Identification - exact name, brand, model, category, features
2. Condition Assessment - state (NEW/LIKE_NEW/GOOD/FAIR/POOR), defects, completeness
3. Market Positioning - target buyer, use cases, competitors, USPs
4. Platform Optimization - eBay (search-optimized, 80 chars), Facebook (conversational), Poshmark (style-focused)
5. Pricing Intelligence - retail value range based on brand, condition, demand

OUTPUT FORMAT (JSON only):
{
  "product": {
    "name": "string",
    "brand": "string",
    "category": "string",
    "model": "string | null",
    "features": ["string"],
    "confidence": 0.0-1.0
  },
  "condition": {
    "state": "NEW|LIKE_NEW|GOOD|FAIR|POOR",
    "notes": "string",
    "defects": ["string"],
    "confidence": 0.0-1.0
  },
  "marketPositioning": {
    "targetBuyer": "string",
    "useCases": ["string"],
    "uniqueSellingPoints": ["string"],
    "competitorProducts": ["string"]
  },
  "platformContent": {
    "ebay": {
      "title": "string (max 80 chars)",
      "description": "string",
      "itemSpecifics": {"Brand": "string", "Type": "string"}
    }
  },
  "estimatedRetailValue": {
    "low": number,
    "high": number,
    "confidence": 0.0-1.0
  }
}`;
  }

  /**
   * Condition assessment prompt (cached)
   */
  private buildConditionPrompt(): string {
    return `Assess product condition from image.

CONDITION STATES:
- NEW: Unopened, sealed, pristine
- LIKE_NEW: Opened but unused, no wear
- GOOD: Minor wear, fully functional
- FAIR: Noticeable wear, functional
- POOR: Heavy wear or damage

Return JSON:
{
  "state": "NEW|LIKE_NEW|GOOD|FAIR|POOR",
  "confidence": 0.0-1.0,
  "notes": "string"
}`;
  }

  /**
   * Parse full analysis response
   */
  private parseAnalysis(text: string): any {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`Failed to parse AI response: ${error}`);
    }
  }

  /**
   * Parse condition response
   */
  private parseCondition(text: string): any {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Get cost estimate for operation
   */
  getCostEstimate(
    operation: 'full' | 'condition' | 'title',
    cached: boolean = false
  ): number {
    const costs = {
      full: cached ? 0.004 : 0.015,
      condition: 0.001,
      title: 0.001
    };

    return costs[operation];
  }
}
