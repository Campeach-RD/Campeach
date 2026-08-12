CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  wa_id TEXT PRIMARY KEY,
  profile_name TEXT,
  first_seen_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id TEXT PRIMARY KEY,
  wa_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK(direction IN ('inbound', 'outbound')),
  message_type TEXT NOT NULL,
  text_body TEXT,
  media_id TEXT,
  reply_to_id TEXT,
  sent_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  raw_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_contact_time
  ON whatsapp_messages(wa_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_time
  ON whatsapp_messages(sent_at DESC);

CREATE TABLE IF NOT EXISTS whatsapp_statuses (
  message_id TEXT NOT NULL,
  status TEXT NOT NULL,
  status_at TEXT NOT NULL,
  raw_json TEXT NOT NULL,
  PRIMARY KEY(message_id, status, status_at)
);
