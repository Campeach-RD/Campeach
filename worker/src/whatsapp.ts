type WhatsAppMessage = {
  id?: string;
  from?: string;
  timestamp?: string;
  type?: string;
  text?: { body?: string };
  image?: { id?: string; caption?: string };
  video?: { id?: string; caption?: string };
  audio?: { id?: string };
  document?: { id?: string; caption?: string; filename?: string };
  button?: { text?: string };
  interactive?: { button_reply?: { title?: string }; list_reply?: { title?: string } };
  context?: { id?: string };
};

type WhatsAppPayload = {
  object?: string;
  entry?: Array<{ changes?: Array<{ field?: string; value?: {
    contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
    messages?: WhatsAppMessage[];
    statuses?: Array<{ id?: string; status?: string; timestamp?: string }>;
  } }> }>;
};

const isoTime = (unix?: string) => unix && /^\d+$/.test(unix) ? new Date(Number(unix) * 1000).toISOString() : new Date().toISOString();

const messageText = (message: WhatsAppMessage) =>
  message.text?.body ?? message.image?.caption ?? message.video?.caption ?? message.document?.caption ??
  message.button?.text ?? message.interactive?.button_reply?.title ?? message.interactive?.list_reply?.title ?? null;

const mediaId = (message: WhatsAppMessage) =>
  message.image?.id ?? message.video?.id ?? message.audio?.id ?? message.document?.id ?? null;

export const storeWhatsAppWebhook = async (payload: WhatsAppPayload, env: Env) => {
  if (payload.object !== 'whatsapp_business_account') return { messages: 0, statuses: 0 };
  let messages = 0;
  let statuses = 0;
  for (const entry of payload.entry ?? []) for (const change of entry.changes ?? []) {
    if (change.field !== 'messages') continue;
    const value = change.value ?? {};
    const names = new Map((value.contacts ?? []).filter((item) => item.wa_id).map((item) => [item.wa_id!, item.profile?.name ?? null]));
    for (const message of value.messages ?? []) {
      if (!message.id || !message.from) continue;
      const sentAt = isoTime(message.timestamp);
      await env.WHATSAPP_DB.batch([
        env.WHATSAPP_DB.prepare(`INSERT INTO whatsapp_contacts (wa_id, profile_name, first_seen_at, last_seen_at)
          VALUES (?, ?, ?, ?) ON CONFLICT(wa_id) DO UPDATE SET profile_name=COALESCE(excluded.profile_name, profile_name), last_seen_at=excluded.last_seen_at`)
          .bind(message.from, names.get(message.from) ?? null, sentAt, sentAt),
        env.WHATSAPP_DB.prepare(`INSERT OR IGNORE INTO whatsapp_messages
          (id, wa_id, direction, message_type, text_body, media_id, reply_to_id, sent_at, received_at, raw_json)
          VALUES (?, ?, 'inbound', ?, ?, ?, ?, ?, ?, ?)`)
          .bind(message.id, message.from, message.type ?? 'unknown', messageText(message), mediaId(message), message.context?.id ?? null, sentAt, new Date().toISOString(), JSON.stringify(message)),
      ]);
      messages += 1;
    }
    for (const status of value.statuses ?? []) {
      if (!status.id || !status.status) continue;
      const statusAt = isoTime(status.timestamp);
      await env.WHATSAPP_DB.prepare(`INSERT OR IGNORE INTO whatsapp_statuses (message_id, status, status_at, raw_json) VALUES (?, ?, ?, ?)`)
        .bind(status.id, status.status, statusAt, JSON.stringify(status)).run();
      statuses += 1;
    }
  }
  console.log(JSON.stringify({ event: 'whatsapp_webhook_stored', messages, statuses }));
  return { messages, statuses };
};

export const listWhatsAppConversations = async (env: Env, limit: number) =>
  env.WHATSAPP_DB.prepare(`SELECT c.wa_id, c.profile_name, c.last_seen_at,
    (SELECT text_body FROM whatsapp_messages m WHERE m.wa_id=c.wa_id ORDER BY sent_at DESC LIMIT 1) AS last_message,
    (SELECT COUNT(*) FROM whatsapp_messages m WHERE m.wa_id=c.wa_id) AS message_count
    FROM whatsapp_contacts c ORDER BY c.last_seen_at DESC LIMIT ?`).bind(limit).all();

export const getWhatsAppMessages = async (env: Env, waId: string, limit: number) =>
  env.WHATSAPP_DB.prepare(`SELECT id, wa_id, direction, message_type, text_body, media_id, reply_to_id, sent_at
    FROM whatsapp_messages WHERE wa_id=? ORDER BY sent_at DESC LIMIT ?`).bind(waId, limit).all();
