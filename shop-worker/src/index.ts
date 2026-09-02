function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "https://campeach-rd.github.io",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

type PagaditoEnv = Omit<Env, "PAGADITO_MODE"> & {
  PAGADITO_MODE: string;
  PAGADITO_UID: string;
  PAGADITO_WSK: string;
  SHOP_ADMIN_TOKEN: string;
};

const RESERVATION_MINUTES = 60;
const TRACK_EVENTS = new Set(["PRODUCT_VIEW", "BEGIN_CHECKOUT", "CHECKOUT_REDIRECT", "PAYMENT_RETURN", "WHATSAPP_CLICK"]);

type PagaditoResponse = { code: string; message: string; value?: string | Record<string, string> };

const PRODUCTS = {
  "ozark-3": { name: "Ozark Trail Clip & Camp para 3 personas", price: 5990, stock: 0 },
  "ozark-4": { name: "Ozark Trail Clip & Camp para 4 personas", price: 7490, stock: 4 },
  "ozark-6": { name: "Ozark Trail Clip & Camp para 6 personas", price: 12490, stock: 0 },
  "ozark-8": { name: "Ozark Trail Clip & Camp para 8 personas", price: 17990, stock: 0 },
  "ozark-sleeping-pad": { name: "Sleeping pad Ozark Trail Essential", price: 3490, stock: 0 },
  "ozark-self-inflating-pad": { name: "Sleeping pad autoinflable Ozark Trail", price: 5490, stock: 2 },
  "lifestraw-personal": { name: "Filtro de agua LifeStraw Personal", price: 2490, stock: 0 },
  "lepro-headlamp-2": { name: "Linternas frontales Lepro recargables (2)", price: 2990, stock: 0 },
  "ozark-towel": { name: "Toalla de secado rápido Ozark Trail", price: 1790, stock: 0 },
  "ozark-waterproof-pouch": { name: "Pouches impermeables Ozark Trail (2)", price: 1990, stock: 0 },
  "emergency-blankets-12": { name: "Mantas térmicas de emergencia (12)", price: 2490, stock: 0 },
  "ozark-tarp-9x12": { name: "Lona heavy-duty Ozark Trail 9 x 12", price: 3990, stock: 0 },
  "ozark-air-pump": { name: "Bomba de aire portátil Ozark Trail", price: 2490, stock: 0 },
  "ozark-sleeping-bag-50": { name: "Sleeping bag Ozark Trail 50 F", price: 3490, stock: 0 },
  "coghlans-stakes-4": { name: "Estacas Coghlan's heavy-duty de 10 pulgadas (4)", price: 1990, stock: 0 },
} as const;

type ProductId = keyof typeof PRODUCTS;

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function releaseExpiredReservations(env: PagaditoEnv): Promise<void> {
  const now = new Date().toISOString();
  const expired = await env.ORDERS_DB.prepare(
    `SELECT id, product_id, quantity FROM orders
     WHERE reservation_expires_at <= ? AND reservation_released_at IS NULL AND stock_committed_at IS NULL`,
  ).bind(now).all<{ id: string; product_id: string; quantity: number }>();
  for (const order of expired.results) {
    await env.ORDERS_DB.batch([
      env.ORDERS_DB.prepare(
        "UPDATE inventory SET stock_reserved = MAX(0, stock_reserved - ?), updated_at = ? WHERE product_id = ?",
      ).bind(order.quantity, now, order.product_id),
      env.ORDERS_DB.prepare(
        "UPDATE orders SET status = 'EXPIRED', reservation_released_at = ?, updated_at = ? WHERE id = ? AND reservation_released_at IS NULL AND stock_committed_at IS NULL",
      ).bind(now, now, order.id),
    ]);
  }
}

async function releaseReservation(env: PagaditoEnv, orderId: string, productId: string, quantity: number, status: string): Promise<void> {
  const now = new Date().toISOString();
  await env.ORDERS_DB.batch([
    env.ORDERS_DB.prepare("UPDATE inventory SET stock_reserved = MAX(0, stock_reserved - ?), updated_at = ? WHERE product_id = ?")
      .bind(quantity, now, productId),
    env.ORDERS_DB.prepare("UPDATE orders SET status = ?, reservation_released_at = ?, updated_at = ? WHERE id = ? AND reservation_released_at IS NULL AND stock_committed_at IS NULL")
      .bind(status, now, now, orderId),
  ]);
}

async function inventoryResponse(env: PagaditoEnv): Promise<Response> {
  await releaseExpiredReservations(env);
  const rows = await env.ORDERS_DB.prepare(
    "SELECT product_id, MAX(0, stock_total - stock_reserved - stock_sold) AS available FROM inventory ORDER BY product_id",
  ).all<{ product_id: string; available: number }>();
  return json({ inventory: Object.fromEntries(rows.results.map((row) => [row.product_id, row.available])) });
}

async function trackFunnel(request: Request, env: PagaditoEnv): Promise<Response> {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const eventName = cleanText(body?.eventName, 32).toUpperCase();
  const visitorId = cleanText(body?.visitorId, 80);
  const sessionId = cleanText(body?.sessionId, 80);
  if (!TRACK_EVENTS.has(eventName) || !visitorId || !sessionId) return json({ error: "Invalid event" }, 400);
  const metadata = body?.metadata && typeof body.metadata === "object" ? JSON.stringify(body.metadata).slice(0, 1000) : "{}";
  await env.ORDERS_DB.prepare(
    `INSERT INTO funnel_events (id, visitor_id, session_id, event_name, product_id, source, medium, campaign, content, referrer_host, path, metadata_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(crypto.randomUUID(), visitorId, sessionId, eventName, cleanText(body?.productId, 40), cleanText(body?.source, 80),
    cleanText(body?.medium, 80), cleanText(body?.campaign, 120), cleanText(body?.content, 120), cleanText(body?.referrerHost, 120),
    cleanText(body?.path, 200), metadata, new Date().toISOString()).run();
  return json({ ok: true }, 202);
}

function timingSafeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

async function adminFunnel(request: Request, url: URL, env: PagaditoEnv): Promise<Response> {
  const supplied = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!env.SHOP_ADMIN_TOKEN || !timingSafeEqual(supplied, env.SHOP_ADMIN_TOKEN)) return json({ error: "Unauthorized" }, 401);
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days")) || 7));
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const [stages, products, campaigns, orders, inventory] = await Promise.all([
    env.ORDERS_DB.prepare("SELECT event_name, COUNT(*) events, COUNT(DISTINCT visitor_id) visitors FROM funnel_events WHERE created_at >= ? GROUP BY event_name").bind(since).all(),
    env.ORDERS_DB.prepare("SELECT product_id, event_name, COUNT(*) events, COUNT(DISTINCT visitor_id) visitors FROM funnel_events WHERE created_at >= ? GROUP BY product_id, event_name").bind(since).all(),
    env.ORDERS_DB.prepare("SELECT campaign, content, event_name, COUNT(*) events, COUNT(DISTINCT visitor_id) visitors FROM funnel_events WHERE created_at >= ? GROUP BY campaign, content, event_name").bind(since).all(),
    env.ORDERS_DB.prepare("SELECT product_id, status, COUNT(*) orders, SUM(quantity) units FROM orders WHERE created_at >= ? GROUP BY product_id, status").bind(since).all(),
    env.ORDERS_DB.prepare("SELECT product_id, stock_total, stock_reserved, stock_sold, MAX(0, stock_total-stock_reserved-stock_sold) available FROM inventory ORDER BY product_id").all(),
  ]);
  return json({ days, since, stages: stages.results, products: products.results, campaigns: campaigns.results, orders: orders.results, inventory: inventory.results });
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function soapEnvelope(method: string, parameters: Record<string, string>): string {
  const body = Object.entries(parameters)
    .map(([key, value]) => `<${key} xsi:type="xsd:string">${escapeXml(value)}</${key}>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:wspg" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><SOAP-ENV:Body><ns1:${method}>${body}</ns1:${method}></SOAP-ENV:Body></SOAP-ENV:Envelope>`;
}

function decodeXml(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function pagaditoEndpoint(env: PagaditoEnv): string {
  return env.PAGADITO_MODE === "production"
    ? "https://comercios.pagadito.com/wspg/charges.php?utf8_enc"
    : "https://sandbox.pagadito.com/comercios/wspg/charges.php?utf8_enc";
}

async function pagaditoCall(env: PagaditoEnv, method: string, parameters: Record<string, string>): Promise<PagaditoResponse> {
  const response = await fetch(pagaditoEndpoint(env), {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: `urn:ws#${method}`,
    },
    body: soapEnvelope(method, parameters),
  });
  if (!response.ok) throw new Error(`Pagadito HTTP ${response.status}`);
  const xml = await response.text();
  const match = xml.match(/<return[^>]*>([\s\S]*?)<\/return>/i);
  if (!match) throw new Error("Respuesta SOAP de Pagadito no reconocida");
  return JSON.parse(decodeXml(match[1])) as PagaditoResponse;
}

async function pagaditoConnect(env: PagaditoEnv): Promise<PagaditoResponse> {
  return pagaditoCall(env, "connect", {
    uid: env.PAGADITO_UID.trim(),
    wsk: env.PAGADITO_WSK.trim(),
    format_return: "json",
  });
}

async function createCheckout(request: Request, env: PagaditoEnv): Promise<Response> {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const productId = cleanText(body?.productId, 32) as ProductId;
  const product = PRODUCTS[productId];
  const quantity = Number(body?.quantity);
  const customerName = cleanText(body?.customerName, 100);
  const customerEmail = cleanText(body?.customerEmail, 160).toLowerCase();
  const customerPhone = cleanText(body?.customerPhone, 40);
  const deliveryAddress = cleanText(body?.deliveryAddress, 300);
  const deliveryNotes = cleanText(body?.deliveryNotes, 300);
  const visitorId = cleanText(body?.visitorId, 80);
  const sessionId = cleanText(body?.sessionId, 80);

  if (!product || product.stock < 1 || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stock
      || customerName.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
      || customerPhone.length < 8 || deliveryAddress.length < 10) {
    return json({ error: "Revisa los datos del pedido." }, 400);
  }

  const id = crypto.randomUUID();
  const ern = `CP-${Date.now()}-${id.slice(0, 8)}`;
  const total = product.price * quantity;
  const now = new Date().toISOString();
  await releaseExpiredReservations(env);
  const reserved = await env.ORDERS_DB.prepare(
    `UPDATE inventory SET stock_reserved = stock_reserved + ?, updated_at = ?
     WHERE product_id = ? AND stock_total - stock_reserved - stock_sold >= ?`,
  ).bind(quantity, now, productId, quantity).run();
  if (reserved.meta.changes !== 1) return json({ error: "Ya no quedan suficientes unidades disponibles." }, 409);
  const reservationExpiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60000).toISOString();
  try {
    await env.ORDERS_DB.prepare(
    `INSERT INTO orders (id, ern, product_id, product_name, unit_price_dop, quantity, total_dop,
      customer_name, customer_email, customer_phone, delivery_address, delivery_notes, status, created_at, updated_at,
      reservation_expires_at, visitor_id, session_id, utm_source, utm_medium, utm_campaign, utm_content)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CREATED', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(id, ern, productId, product.name, product.price, quantity, total, customerName,
      customerEmail, customerPhone, deliveryAddress, deliveryNotes, now, now, reservationExpiresAt, visitorId, sessionId,
      cleanText(body?.source, 80), cleanText(body?.medium, 80), cleanText(body?.campaign, 120), cleanText(body?.content, 120)).run();

  const connection = await pagaditoConnect(env);
  if (connection.code !== "PG1001" || typeof connection.value !== "string") {
    await releaseReservation(env, id, productId, quantity, "PAYMENT_ERROR");
    console.error(JSON.stringify({ event: "pagadito_connect_rejected", orderId: id, code: connection.code }));
    return json({ error: "No pudimos iniciar el pago. Inténtalo nuevamente." }, 502);
  }
  const details = JSON.stringify([{
    quantity,
    description: product.name,
    price: product.price,
    url_product: `https://campeach-rd.github.io/Campeach/?product=${productId}`,
  }]);
  const transaction = await pagaditoCall(env, "exec_trans", {
    token: connection.value,
    ern,
    amount: total.toFixed(2),
    details,
    format_return: "json",
    currency: "DOP",
    custom_params: JSON.stringify({ param1: id, param2: customerPhone }),
  });
  if (transaction.code !== "PG1002" || typeof transaction.value !== "string") {
    await releaseReservation(env, id, productId, quantity, "PAYMENT_ERROR");
    console.error(JSON.stringify({ event: "pagadito_transaction_rejected", orderId: id, code: transaction.code }));
    return json({ error: "Pagadito no pudo registrar el pago. Inténtalo nuevamente." }, 502);
  }
  await env.ORDERS_DB.prepare("UPDATE orders SET status = 'REGISTERED', checkout_url = ?, updated_at = ? WHERE id = ?")
    .bind(transaction.value, new Date().toISOString(), id).run();
    return json({ checkoutUrl: transaction.value, orderId: id });
  } catch (error) {
    await releaseReservation(env, id, productId, quantity, "PAYMENT_ERROR");
    throw error;
  }
}

async function handlePagaditoReturn(url: URL, env: PagaditoEnv): Promise<Response> {
  const token = cleanText(url.searchParams.get("token"), 128);
  const ern = cleanText(url.searchParams.get("ern"), 80);
  const destination = new URL("https://campeach-rd.github.io/Campeach/");
  if (!token || !ern) {
    destination.searchParams.set("payment", "invalid");
    return Response.redirect(destination.toString(), 303);
  }
  const order = await env.ORDERS_DB.prepare("SELECT id, product_id, quantity, stock_committed_at, reservation_released_at FROM orders WHERE ern = ?")
    .bind(ern).first<{ id: string; product_id: string; quantity: number; stock_committed_at: string | null; reservation_released_at: string | null }>();
  if (!order) {
    destination.searchParams.set("payment", "not-found");
    return Response.redirect(destination.toString(), 303);
  }
  const connection = await pagaditoConnect(env);
  if (connection.code !== "PG1001" || typeof connection.value !== "string") {
    destination.searchParams.set("payment", "verification-error");
    return Response.redirect(destination.toString(), 303);
  }
  const statusResult = await pagaditoCall(env, "get_status", {
    token: connection.value,
    token_trans: token,
    format_return: "json",
  });
  const value = typeof statusResult.value === "object" && statusResult.value ? statusResult.value : {};
  const paymentStatus = cleanText(value.status, 30) || "UNKNOWN";
  const reference = cleanText(value.reference, 100);
  await env.ORDERS_DB.prepare(
    "UPDATE orders SET status = ?, pagadito_token = ?, pagadito_reference = ?, updated_at = ? WHERE id = ?",
  ).bind(paymentStatus, token, reference, new Date().toISOString(), order.id).run();
  const normalizedStatus = paymentStatus.toUpperCase();
  const paid = ["COMPLETED", "APPROVED", "SUCCESS"].includes(normalizedStatus);
  if (paid && !order.stock_committed_at) {
    const now = new Date().toISOString();
    if (!order.reservation_released_at) {
      await env.ORDERS_DB.batch([
        env.ORDERS_DB.prepare("UPDATE inventory SET stock_reserved = MAX(0, stock_reserved - ?), stock_sold = stock_sold + ?, updated_at = ? WHERE product_id = ?")
          .bind(order.quantity, order.quantity, now, order.product_id),
        env.ORDERS_DB.prepare("UPDATE orders SET stock_committed_at = ?, updated_at = ? WHERE id = ? AND stock_committed_at IS NULL")
          .bind(now, now, order.id),
      ]);
    } else {
      const committed = await env.ORDERS_DB.prepare(
        "UPDATE inventory SET stock_sold = stock_sold + ?, updated_at = ? WHERE product_id = ? AND stock_total-stock_reserved-stock_sold >= ?",
      ).bind(order.quantity, now, order.product_id, order.quantity).run();
      await env.ORDERS_DB.prepare("UPDATE orders SET status = ?, stock_committed_at = ?, updated_at = ? WHERE id = ?")
        .bind(committed.meta.changes === 1 ? normalizedStatus : "PAID_STOCK_REVIEW", committed.meta.changes === 1 ? now : null, now, order.id).run();
    }
  } else if (["CANCELLED", "FAILED", "REJECTED"].includes(normalizedStatus) && !order.reservation_released_at && !order.stock_committed_at) {
    await releaseReservation(env, order.id, order.product_id, order.quantity, normalizedStatus);
  }
  destination.searchParams.set("payment", paymentStatus.toLowerCase());
  destination.searchParams.set("order", order.id);
  return Response.redirect(destination.toString(), 303);
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "campeach-shop",
        paymentProvider: "pagadito",
        mode: env.PAGADITO_MODE,
      });
    }

    if (request.method === "GET" && url.pathname === "/inventory") return inventoryResponse(env as PagaditoEnv);
    if (request.method === "POST" && url.pathname === "/track") return trackFunnel(request, env as PagaditoEnv);
    if (request.method === "GET" && url.pathname === "/admin/funnel") return adminFunnel(request, url, env as PagaditoEnv);

    if (request.method === "GET" && url.pathname === "/health/pagadito") {
      try {
        const pagaditoEnv = env as PagaditoEnv;
        const uidFormatValid = /^[A-Za-z0-9]{32}$/.test(pagaditoEnv.PAGADITO_UID.trim());
        const wskFormatValid = /^[A-Za-z0-9]{32}$/.test(pagaditoEnv.PAGADITO_WSK.trim());
        const result = await pagaditoConnect(pagaditoEnv);
        return json({ ok: result.code === "PG1001", code: result.code, mode: env.PAGADITO_MODE, uidFormatValid, wskFormatValid });
      } catch (error) {
        console.error(JSON.stringify({ event: "pagadito_connection_failed", error: String(error) }));
        return json({ ok: false, code: "CONNECTION_FAILED", mode: env.PAGADITO_MODE }, 502);
      }
    }

    if (request.method === "POST" && url.pathname === "/checkout") {
      try {
        return await createCheckout(request, env as PagaditoEnv);
      } catch (error) {
        console.error(JSON.stringify({ event: "checkout_failed", error: String(error) }));
        return json({ error: "No pudimos iniciar el pago. Inténtalo nuevamente." }, 500);
      }
    }

    if (request.method === "GET" && url.pathname === "/pagadito/return") {
      try {
        return await handlePagaditoReturn(url, env as PagaditoEnv);
      } catch (error) {
        console.error(JSON.stringify({ event: "pagadito_return_failed", error: String(error) }));
        return Response.redirect("https://campeach-rd.github.io/Campeach/?payment=verification-error", 303);
      }
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "https://campeach-rd.github.io",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    return json({ error: "Not found" }, 404);
  },
} satisfies ExportedHandler<Env>;
