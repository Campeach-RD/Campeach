CREATE TABLE IF NOT EXISTS inventory (
  product_id TEXT PRIMARY KEY,
  stock_total INTEGER NOT NULL CHECK (stock_total >= 0),
  stock_reserved INTEGER NOT NULL DEFAULT 0 CHECK (stock_reserved >= 0),
  stock_sold INTEGER NOT NULL DEFAULT 0 CHECK (stock_sold >= 0),
  updated_at TEXT NOT NULL
);

INSERT INTO inventory (product_id, stock_total, stock_reserved, stock_sold, updated_at)
VALUES
  ('ozark-4', 4, 0, 0, datetime('now')),
  ('ozark-self-inflating-pad', 2, 0, 0, datetime('now'))
ON CONFLICT(product_id) DO UPDATE SET stock_total = excluded.stock_total, updated_at = excluded.updated_at;

ALTER TABLE orders ADD COLUMN reservation_expires_at TEXT;
ALTER TABLE orders ADD COLUMN reservation_released_at TEXT;
ALTER TABLE orders ADD COLUMN stock_committed_at TEXT;
ALTER TABLE orders ADD COLUMN visitor_id TEXT;
ALTER TABLE orders ADD COLUMN session_id TEXT;
ALTER TABLE orders ADD COLUMN utm_source TEXT;
ALTER TABLE orders ADD COLUMN utm_medium TEXT;
ALTER TABLE orders ADD COLUMN utm_campaign TEXT;
ALTER TABLE orders ADD COLUMN utm_content TEXT;

CREATE TABLE IF NOT EXISTS funnel_events (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('PRODUCT_VIEW', 'BEGIN_CHECKOUT', 'CHECKOUT_REDIRECT', 'PAYMENT_RETURN')),
  product_id TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  content TEXT,
  referrer_host TEXT,
  path TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_funnel_created ON funnel_events(created_at);
CREATE INDEX IF NOT EXISTS idx_funnel_stage_product ON funnel_events(event_name, product_id);
CREATE INDEX IF NOT EXISTS idx_funnel_campaign ON funnel_events(campaign, content);
CREATE INDEX IF NOT EXISTS idx_orders_reservation_expiry ON orders(reservation_expires_at, reservation_released_at, stock_committed_at);
