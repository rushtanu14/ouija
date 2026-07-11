import { validateMcpExportRequest } from "../../server/mcpBridge.js";
import { apiAllowedHeaders, isAllowedOrigin, readRequestHeader } from "../../server/httpSecurity.js";

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

export default function handler(req: RequestLike, res: ResponseLike) {
  setApiHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST /api/mcp/export to dry-run a consent-gated Composio MCP packet." });
    return;
  }

  const response = validateMcpExportRequest(req.body);
  res.status(response.statusCode).json(response.body);
}

function setApiHeaders(req: RequestLike, res: ResponseLike) {
  const origin = readRequestHeader(req.headers, "origin");
  if (origin && isAllowedOrigin(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", apiAllowedHeaders);
  res.setHeader("Cache-Control", "no-store");
}
