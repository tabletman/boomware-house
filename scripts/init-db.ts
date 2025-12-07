#!/usr/bin/env tsx
/**
 * Database Initialization Script
 * Creates database and initializes schema
 */

import { getDatabase, closeDatabase } from '../src/lib/db/client';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function initializeDatabase() {
  console.log('🚀 Initializing BoomWare House database...\n');

  try {
    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
      console.log('✅ Created data directory');
    }

    // Initialize database
    const db = getDatabase();
    await db.initialize();

    // Get database stats
    const stats = db.getStats();
    console.log('\n📊 Database Statistics:');
    console.log(`   Path: ${join(dataDir, 'inventory.db')}`);
    console.log(`   Size: ${(stats.sizeBytes / 1024).toFixed(2)} KB`);
    console.log(`   WAL Mode: ${stats.walMode ? 'Enabled ✅' : 'Disabled ❌'}`);
    console.log(`   Page Size: ${stats.pageSize} bytes`);
    console.log(`   Page Count: ${stats.pageCount}`);

    console.log('\n🎉 Database initialized successfully!');
    console.log('\nNext steps:');
    console.log('  1. Run: npm run watch');
    console.log('  2. Drop images in watch folder');
    console.log('  3. Check inventory: tsx scripts/boomware-cli.ts inventory');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    closeDatabase();
  }
}

// Run if executed directly
if (require.main === module) {
  initializeDatabase();
}
