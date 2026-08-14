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

async function pagaditoConnect(env: PagaditoEnv): Promise<{ code: string; message: string; value?: string }> {
  const endpoint = env.PAGADITO_MODE === "production"
    ? "https://comercios.pagadito.com/wspg/charges.php"
    : "https://sandbox.pagadito.com/comercios/wspg/charges.php";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "urn:ws#connect",
    },
    body: soapEnvelope("connect", {
      uid: env.PAGADITO_UID,
      wsk: env.PAGADITO_WSK,
      format_return: "json",
    }),
  });
  if (!response.ok) throw new Error(`Pagadito HTTP ${response.status}`);
  const xml = await response.text();
  const match = xml.match(/<return[^>]*>([\s\S]*?)<\/return>/i);
  if (!match) throw new Error("Respuesta SOAP de Pagadito no reconocida");
  return JSON.parse(decodeXml(match[1])) as { code: string; message: string; value?: string };
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
        const result = await pagaditoConnect(env as PagaditoEnv);
        return json({ ok: result.code === "PG1001", code: result.code, mode: env.PAGADITO_MODE });
      } catch (error) {
        console.error(JSON.stringify({ event: "pagadito_connection_failed", error: String(error) }));
        return json({ ok: false, code: "CONNECTION_FAILED", mode: env.PAGADITO_MODE }, 502);
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
