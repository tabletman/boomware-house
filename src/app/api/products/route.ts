import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// For demonstration purposes, we'll serve data from our generated JSON file
// In production, this would connect to Supabase
async function getProductsFromFile() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const files = await fs.readdir(dataDir);
    const productFile = files.find(file =>
      file.includes('boom-warehouse-products') && file.endsWith('.json')
    );

    if (!productFile) {
      return [];
    }

    const filepath = path.join(dataDir, productFile);
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let products = await getProductsFromFile();

    // Filter by category
    if (category && category !== 'all') {
      products = products.filter((product: any) =>
        product.category.toLowerCase().replace(/\s+/g, '-') === category
      );
    }

    // Filter by condition
    if (condition) {
      products = products.filter((product: any) =>
        product.condition.toLowerCase() === condition.toLowerCase()
      );
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter((product: any) => product.is_featured);
    }

    // Sort by featured first, then by created_at desc
    products.sort((a: any, b: any) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Apply limit
    if (limit) {
      products = products.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      products,
      total: products.length,
      success: true
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // This would handle creating new products in a real implementation
  return NextResponse.json(
    { error: 'Product creation not implemented in demo mode' },
    { status: 501 }
  );
}