import { buildRuntimeProof } from "../src/lib/runtimeProof.js";
import { getMcpBridgeStatus } from "../server/mcpBridge.js";

interface RequestLike {
  method?: string;
}

interface ResponseLike {
  setHeader(name: string, value: string): void;
  status(code: number): ResponseLike;
  json(body: unknown): void;
  end(): void;
}

export default function handler(req: RequestLike, res: ResponseLike) {
  setApiHeaders(res);

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

function setApiHeaders(res: ResponseLike) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
}
