CREATE TABLE funnel_events_v2 (
  id TEXT PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL CHECK (event_name IN ('PRODUCT_VIEW', 'BEGIN_CHECKOUT', 'CHECKOUT_REDIRECT', 'PAYMENT_RETURN', 'WHATSAPP_CLICK')),
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

INSERT INTO funnel_events_v2
SELECT id, visitor_id, session_id, event_name, product_id, source, medium, campaign, content, referrer_host, path, metadata_json, created_at
FROM funnel_events;

DROP TABLE funnel_events;
ALTER TABLE funnel_events_v2 RENAME TO funnel_events;

CREATE INDEX idx_funnel_created ON funnel_events(created_at);
CREATE INDEX idx_funnel_stage_product ON funnel_events(event_name, product_id);
CREATE INDEX idx_funnel_campaign ON funnel_events(campaign, content);
