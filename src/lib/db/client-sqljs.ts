/**
 * SQLite Database Client (sql.js implementation)
 * Pure JavaScript SQLite - no native compilation required
 */

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface DatabaseConfig {
  path: string;
  readonly?: boolean;
  verbose?: boolean;
}

export class DatabaseClient {
  private db: SqlJsDatabase | null = null;
  private readonly config: DatabaseConfig;
  private SQL: any;

  constructor(config: DatabaseConfig) {
    this.config = {
      readonly: false,
      verbose: false,
      ...config
    };
  }

  /**
   * Initialize database connection
   */
  async connect(): Promise<void> {
    this.SQL = await initSqlJs();

    if (existsSync(this.config.path)) {
      const buffer = readFileSync(this.config.path);
      this.db = new this.SQL.Database(buffer);
    } else {
      this.db = new this.SQL.Database();
    }

    // Enable foreign keys
    this.exec('PRAGMA foreign_keys = ON');

    if (this.config.verbose) {
      console.log('✅ Database connected:', this.config.path);
    }
  }

  /**
   * Initialize database schema
   */
  async initialize(): Promise<void> {
    if (!this.db) {
      await this.connect();
    }

    const schemaPath = join(__dirname, '../../../data/schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Execute schema
    this.exec(schema);

    // Save to disk
    this.save();

    console.log('✅ Database initialized successfully');
  }

  /**
   * Execute SQL (no results expected)
   */
  exec(sql: string): void {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    this.db.exec(sql);
  }

  /**
   * Run a query that modifies data (INSERT, UPDATE, DELETE)
   */
  run(sql: string, params?: any[]): { changes: number; lastInsertRowid: number } {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    this.db.run(sql, params);

    return {
      changes: this.db.getRowsModified(),
      lastInsertRowid: 0 // sql.js doesn't expose this easily
    };
  }

  /**
   * Get a single row
   */
  get<T = any>(sql: string, params?: any[]): T | undefined {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const stmt = this.db.prepare(sql);
    if (params) {
      stmt.bind(params);
    }

    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row as T;
    }

    stmt.free();
    return undefined;
  }

  /**
   * Get all matching rows
   */
  all<T = any>(sql: string, params?: any[]): T[] {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const results: T[] = [];
    const stmt = this.db.prepare(sql);

    if (params) {
      stmt.bind(params);
    }

    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }

    stmt.free();
    return results;
  }

  /**
   * Execute multiple statements in a transaction
   */
  transaction<T>(fn: () => T): T {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    try {
      this.exec('BEGIN TRANSACTION');
      const result = fn();
      this.exec('COMMIT');
      return result;
    } catch (error) {
      this.exec('ROLLBACK');
      throw error;
    }
  }

  /**
   * Save database to disk
   */
  save(): void {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const data = this.db.export();
    writeFileSync(this.config.path, data);
  }

  /**
   * Get database statistics
   */
  getStats(): {
    pageCount: number;
    pageSize: number;
    sizeBytes: number;
  } {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const pageCount = this.get<{ page_count: number }>('PRAGMA page_count')?.page_count || 0;
    const pageSize = this.get<{ page_size: number }>('PRAGMA page_size')?.page_size || 4096;

    return {
      pageCount,
      pageSize,
      sizeBytes: pageCount * pageSize
    };
  }

  /**
   * Optimize database (VACUUM)
   */
  optimize(): void {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    this.exec('VACUUM');
    this.save();
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.save();
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Check if database is open
   */
  isOpen(): boolean {
    return this.db !== null;
  }
}

/**
 * Singleton database instance
 */
let dbInstance: DatabaseClient | null = null;

export function getDatabase(config?: DatabaseConfig): DatabaseClient {
  if (!dbInstance) {
    const defaultConfig: DatabaseConfig = {
      path: join(process.cwd(), 'data', 'inventory.db'),
      readonly: false,
      verbose: process.env.NODE_ENV === 'development'
    };

    dbInstance = new DatabaseClient(config || defaultConfig);
  }

  return dbInstance;
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}
