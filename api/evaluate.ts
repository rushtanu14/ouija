import { handleOptions, sendError, sendJson, withApiBoundary } from "../server/httpResponse.js";
import { runEvaluationSuite } from "../src/lib/evaluation.js";
import type { ApiRequestLike, ApiResponseLike } from "../server/httpResponse.js";

const allowedMethods = "GET, OPTIONS";

function handler(req: ApiRequestLike, res: ApiResponseLike) {
  if (handleOptions(req, res, allowedMethods)) return;

  if (req.method !== "GET") {
    sendError(res, 405, "Use GET /api/evaluate to run the Ouija deterministic regression suite.");
    return;
  }

  sendJson(res, 200, runEvaluationSuite());
}

export default withApiBoundary(handler, "GET /api/evaluate", allowedMethods);
