import { buildRuntimeProof } from "../src/lib/runtimeProof.js";
import { apiAllowedHeaders, isAllowedOrigin, readRequestHeader } from "../server/httpSecurity.js";
import { getMcpBridgeStatus } from "../server/mcpBridge.js";

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
    res.status(405).json({ error: "Use GET /api/runtime-proof to inspect Ouija runtime proof." });
    return;
  }

  res.status(200).json(
    buildRuntimeProof({
      mcpBridgeMode: getMcpBridgeStatus().mode
    })
  );
}

function setApiHeaders(req: RequestLike, res: ResponseLike) {
  const origin = readRequestHeader(req.headers, "origin");
  if (origin && isAllowedOrigin(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", apiAllowedHeaders);
  res.setHeader("Cache-Control", "no-store");
}
