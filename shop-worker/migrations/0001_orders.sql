CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  ern TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price_dop INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 5),
  total_dop INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_notes TEXT NOT NULL DEFAULT '',
  pagadito_token TEXT,
  pagadito_reference TEXT,
  status TEXT NOT NULL DEFAULT 'CREATED',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_ern ON orders(ern);
CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(pagadito_token);
