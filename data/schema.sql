-- BoomWare House v2 - Inventory Database Schema
-- SQLite database for autonomous listing management

-- Product inventory tracking
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  product_data JSON NOT NULL,
  images JSON NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Platform listings (1 inventory item -> N listings)
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  inventory_id TEXT NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  listing_id TEXT,
  listing_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'sold', 'expired', 'removed')),
  listed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sold_at DATETIME,
  sold_price DECIMAL(10,2),
  UNIQUE(inventory_id, platform)
);

-- Price history for analytics
CREATE TABLE IF NOT EXISTS price_history (
  id TEXT PRIMARY KEY,
  inventory_id TEXT NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agent operation logs for debugging and learning
CREATE TABLE IF NOT EXISTS agent_logs (
  id TEXT PRIMARY KEY,
  agent TEXT NOT NULL,
  action TEXT NOT NULL,
  input JSON,
  output JSON,
  duration_ms INTEGER,
  error TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Performance metrics for optimization
CREATE TABLE IF NOT EXISTS performance_metrics (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  avg_days_to_sell DECIMAL(5,2),
  avg_sold_price DECIMAL(10,2),
  total_listings INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,4),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for query optimization
CREATE INDEX IF NOT EXISTS idx_inventory_created ON inventory(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_inventory ON listings(inventory_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_platform ON listings(platform);
CREATE INDEX IF NOT EXISTS idx_price_history_inventory ON price_history(inventory_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent ON agent_logs(agent, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON agent_logs(created_at DESC);

-- Create trigger to update inventory.updated_at
CREATE TRIGGER IF NOT EXISTS update_inventory_timestamp
AFTER UPDATE ON inventory
BEGIN
  UPDATE inventory SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Create trigger to record price changes
CREATE TRIGGER IF NOT EXISTS track_price_changes
AFTER INSERT ON listings
BEGIN
  INSERT INTO price_history (id, inventory_id, platform, price)
  VALUES (
    'ph_' || NEW.id || '_' || strftime('%s', 'now'),
    NEW.inventory_id,
    NEW.platform,
    NEW.price
  );
END;
