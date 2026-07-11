import { apiAllowedHeaders, isAllowedOrigin, readRequestHeader } from "../server/httpSecurity.js";

interface RequestLike {
  method?: string;
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

  if (req.method !== "GET") {
    res.status(405).json({ error: "Use GET /api/health to check the Ouija API." });
    return;
  }

  res.status(200).json({ ok: true, service: "ouija-api" });
}

function setApiHeaders(req: RequestLike, res: ResponseLike) {
  const origin = readRequestHeader(req.headers, "origin");
  if (origin && isAllowedOrigin(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", apiAllowedHeaders);
  res.setHeader("Cache-Control", "no-store");
}
