import { handleOptions, sendError, sendJson, withApiBoundary } from "../server/httpResponse.js";
import { buildRuntimeProof } from "../src/lib/runtimeProof.js";
import { getMcpBridgeStatus } from "../server/mcpBridge.js";
import type { ApiRequestLike, ApiResponseLike } from "../server/httpResponse.js";

const allowedMethods = "GET, OPTIONS";

function handler(req: ApiRequestLike, res: ApiResponseLike) {
  if (handleOptions(req, res, allowedMethods)) return;

  if (req.method !== "GET") {
    sendError(res, 405, "Use GET /api/runtime-proof to inspect Ouija runtime proof.");
    return;
  }

  sendJson(
    res,
    200,
    buildRuntimeProof({
      mcpBridgeMode: getMcpBridgeStatus().mode
    })
  );
}

export default withApiBoundary(handler, "GET /api/runtime-proof", allowedMethods);
