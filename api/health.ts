import { handleOptions, sendError, sendJson } from "../server/httpResponse.js";
import type { ApiRequestLike, ApiResponseLike } from "../server/httpResponse.js";

const allowedMethods = "GET, OPTIONS";

export default function handler(req: ApiRequestLike, res: ApiResponseLike) {
  if (handleOptions(req, res, allowedMethods)) return;

  if (req.method !== "GET") {
    sendError(res, 405, "Use GET /api/health to check the Ouija API.");
    return;
  }

  sendJson(res, 200, { ok: true, service: "ouija-api" });
}
