import { analyzeExperiment, mergeEnrichment } from "../src/lib/analysis.js";
import type { AnalyzeRequest } from "../src/lib/types.js";
import { enrichWithOpenAIWebSearch } from "../server/openaiGrounding.js";

interface RequestLike {
  method?: string;
  body?: unknown;
}

interface ResponseLike {
  setHeader(name: string, value: string): void;
  status(code: number): ResponseLike;
  json(body: unknown): void;
  end(): void;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  setApiHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST /api/analyze to analyze a student experiment." });
    return;
  }

  const body = parseBody(req.body);
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (!description) {
    res.status(400).json({
      error: "Describe the experiment before Ouija analyzes expected results."
    });
    return;
  }

  const fallback = analyzeExperiment({
    description,
    rows: Array.isArray(body?.rows) ? body.rows : undefined
  });

  try {
    const enrichment = await enrichWithOpenAIWebSearch(description, fallback);
    res.status(200).json(mergeEnrichment(fallback, enrichment));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown enrichment error";
    res.status(200).json({
      ...fallback,
      groundingStatus: {
        mode: "fallback",
        note: `Using built-in science references because web enrichment was unavailable: ${message}`
      }
    });
  }
}

function parseBody(rawBody: unknown): Partial<AnalyzeRequest> | null {
  if (typeof rawBody === "string") {
    try {
      const parsed = JSON.parse(rawBody);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }

  return rawBody && typeof rawBody === "object" ? (rawBody as Partial<AnalyzeRequest>) : null;
}

function setApiHeaders(res: ResponseLike) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
}
