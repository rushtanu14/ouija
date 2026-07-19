import { handleOptions, sendError, sendJson, withApiBoundary } from "../server/httpResponse.js";
import { requestClientKey } from "../server/httpSecurity.js";
import { enrichWithOpenAIWebSearch, externalGroundingFallbackNote, shouldUseExternalGrounding } from "../server/openaiGrounding.js";
import { consumeRateLimit, resolveAnalyzeRateLimit } from "../server/rateLimit.js";
import { validateAnalyzeRequest } from "../server/requestValidation.js";
import { analyzeExperiment, mergeEnrichment } from "../src/lib/analysis.js";
import type { ApiRequestLike, ApiResponseLike } from "../server/httpResponse.js";

const allowedMethods = "POST, OPTIONS";

async function handler(req: ApiRequestLike & { body?: unknown }, res: ApiResponseLike) {
  if (handleOptions(req, res, allowedMethods)) return;

  if (req.method !== "POST") {
    sendError(res, 405, "Use POST /api/analyze to analyze a student experiment.");
    return;
  }

  const requestLimit = resolveAnalyzeRateLimit();
  const limit = consumeRateLimit(`analyze:${requestClientKey(req.headers)}`, { limit: requestLimit, windowMs: 60_000 });
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    sendError(res, 429, "Too many analysis requests. Try again shortly.");
    return;
  }

  const validation = validateAnalyzeRequest(req.body);
  if (!validation.ok) {
    sendError(res, 400, validation.error);
    return;
  }
  const requestBody = validation.value;
  const { description, rows } = requestBody;

  const fallback = analyzeExperiment({
    description,
    rows
  });

  if (shouldUseExternalGrounding(requestBody)) {
    try {
      const enrichment = await enrichWithOpenAIWebSearch(description, fallback);
      sendJson(res, 200, mergeEnrichment(fallback, enrichment));
      return;
    } catch {
      sendJson(res, 200, {
        ...fallback,
        groundingStatus: {
          mode: "fallback",
          note: "Using built-in science references because web enrichment was unavailable."
        }
      });
      return;
    }
  }

  sendJson(res, 200, {
    ...fallback,
    groundingStatus: {
      mode: "fallback",
      note: externalGroundingFallbackNote(requestBody)
    }
  });
}

export default withApiBoundary(handler, "POST /api/analyze", allowedMethods);
