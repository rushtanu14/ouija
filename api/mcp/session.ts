import { createMcpSessionTicket } from "../../server/mcpBridge.js";
import { consumeRateLimit } from "../../server/rateLimit.js";
import { apiAllowedHeaders, isAllowedOrigin, readRequestHeader, requestClientKey } from "../../server/httpSecurity.js";

interface RequestLike {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

interface ResponseLike {
  setHeader(name: string, value: string): void;
  status(code: number): ResponseLike;
  json(body: unknown): void;
  end(): void;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  setApiHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST /api/mcp/session with execution preview or create." });
    return;
  }

  const limit = consumeRateLimit(`mcp-session:${requestClientKey(req.headers)}`, { limit: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    res.status(429).json({ error: "Too many MCP session requests. Try again shortly." });
    return;
  }

  const authorization = readRequestHeader(req.headers, "authorization");
  const response = await createMcpSessionTicket(req.body, process.env, fetch, authorization);
  res.status(response.statusCode).json(response.body);
}

function setApiHeaders(req: RequestLike, res: ResponseLike) {
  const origin = readRequestHeader(req.headers, "origin");
  if (origin && isAllowedOrigin(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", apiAllowedHeaders);
  res.setHeader("Cache-Control", "no-store");
}
