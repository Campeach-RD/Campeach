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
};

type PagaditoResponse = { code: string; message: string; value?: string | Record<string, string> };

const PRODUCTS = {
  "ozark-3": { name: "Ozark Trail Clip & Camp para 3 personas", price: 5990 },
  "ozark-4": { name: "Ozark Trail Clip & Camp para 4 personas", price: 7490 },
  "ozark-6": { name: "Ozark Trail Clip & Camp para 6 personas", price: 12490 },
  "ozark-8": { name: "Ozark Trail Clip & Camp para 8 personas", price: 17990 },
} as const;

type ProductId = keyof typeof PRODUCTS;

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
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

  if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 5
      || customerName.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
      || customerPhone.length < 8 || deliveryAddress.length < 10) {
    return json({ error: "Revisa los datos del pedido." }, 400);
  }

  const id = crypto.randomUUID();
  const ern = `CP-${Date.now()}-${id.slice(0, 8)}`;
  const total = product.price * quantity;
  const now = new Date().toISOString();
  await env.ORDERS_DB.prepare(
    `INSERT INTO orders (id, ern, product_id, product_name, unit_price_dop, quantity, total_dop,
      customer_name, customer_email, customer_phone, delivery_address, delivery_notes, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CREATED', ?, ?)`,
  ).bind(id, ern, productId, product.name, product.price, quantity, total, customerName,
    customerEmail, customerPhone, deliveryAddress, deliveryNotes, now, now).run();

  const connection = await pagaditoConnect(env);
  if (connection.code !== "PG1001" || typeof connection.value !== "string") {
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
    await env.ORDERS_DB.prepare("UPDATE orders SET status = 'PAYMENT_ERROR', updated_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), id).run();
    console.error(JSON.stringify({ event: "pagadito_transaction_rejected", orderId: id, code: transaction.code }));
    return json({ error: "Pagadito no pudo registrar el pago. Inténtalo nuevamente." }, 502);
  }
  await env.ORDERS_DB.prepare("UPDATE orders SET status = 'REGISTERED', checkout_url = ?, updated_at = ? WHERE id = ?")
    .bind(transaction.value, new Date().toISOString(), id).run();
  return json({ checkoutUrl: transaction.value, orderId: id });
}

async function handlePagaditoReturn(url: URL, env: PagaditoEnv): Promise<Response> {
  const token = cleanText(url.searchParams.get("token"), 128);
  const ern = cleanText(url.searchParams.get("ern"), 80);
  const destination = new URL("https://campeach-rd.github.io/Campeach/");
  if (!token || !ern) {
    destination.searchParams.set("payment", "invalid");
    return Response.redirect(destination.toString(), 303);
  }
  const order = await env.ORDERS_DB.prepare("SELECT id FROM orders WHERE ern = ?").bind(ern).first<{ id: string }>();
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
