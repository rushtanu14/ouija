import { analyzeExperiment, mergeEnrichment } from "../src/lib/analysis.js";
import { enrichWithOpenAIWebSearch } from "../server/openaiGrounding.js";
import { validateAnalyzeRequest } from "../server/requestValidation.js";
import { apiAllowedHeaders, isAllowedOrigin, readRequestHeader, requestClientKey } from "../server/httpSecurity.js";
import { consumeRateLimit } from "../server/rateLimit.js";

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
    res.status(405).json({ error: "Use POST /api/analyze to analyze a student experiment." });
    return;
  }

  const requestLimit = process.env.OPENAI_API_KEY ? 20 : 120;
  const limit = consumeRateLimit(`analyze:${requestClientKey(req.headers)}`, { limit: requestLimit, windowMs: 60_000 });
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    res.status(429).json({ error: "Too many analysis requests. Try again shortly." });
    return;
  }

  const validation = validateAnalyzeRequest(req.body);
  if (!validation.ok) {
    res.status(400).json({ error: validation.error });
    return;
  }
  const { description, rows } = validation.value;

  const fallback = analyzeExperiment({
    description,
    rows
  });

  try {
    const enrichment = await enrichWithOpenAIWebSearch(description, fallback);
    res.status(200).json(mergeEnrichment(fallback, enrichment));
  } catch (error) {
    res.status(200).json({
      ...fallback,
      groundingStatus: {
        mode: "fallback",
        note: "Using built-in science references because web enrichment was unavailable."
      }
    });
  }
}

function setApiHeaders(req: RequestLike, res: ResponseLike) {
  const origin = readRequestHeader(req.headers, "origin");
  if (origin && isAllowedOrigin(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", apiAllowedHeaders);
  res.setHeader("Cache-Control", "no-store");
}
