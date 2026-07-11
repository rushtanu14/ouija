import cors from "cors";
import express from "express";
import path from "node:path";
import { analyzeExperiment, mergeEnrichment } from "../src/lib/analysis";
import { runEvaluationSuite } from "../src/lib/evaluation";
import { buildRuntimeProof } from "../src/lib/runtimeProof";
import { createMcpSessionTicket, getMcpBridgeStatus, validateMcpExportRequest } from "./mcpBridge";
import { enrichWithOpenAIWebSearch } from "./openaiGrounding";
import { validateAnalyzeRequest } from "./requestValidation";
import { consumeRateLimit } from "./rateLimit";
import { isAllowedOrigin } from "./httpSecurity";

interface AppOptions {
  staticDir?: string;
  enrichExperiment?: typeof enrichWithOpenAIWebSearch;
}

export function createApp(options: AppOptions = {}) {
  const app = express();
  const enrichExperiment = options.enrichExperiment ?? enrichWithOpenAIWebSearch;

  app.use(cors({ origin: allowCorsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "ouija-api" });
  });

  app.get("/api/evaluate", (_req, res) => {
    res.json(runEvaluationSuite());
  });

  app.get("/api/runtime-proof", (_req, res) => {
    res.json(
      buildRuntimeProof({
        mcpBridgeMode: getMcpBridgeStatus().mode
      })
    );
  });

  app.get("/api/mcp/status", (_req, res) => {
    res.json(getMcpBridgeStatus());
  });

  app.post("/api/mcp/export", (req, res) => {
    const response = validateMcpExportRequest(req.body);
    res.status(response.statusCode).json(response.body);
  });

  app.post("/api/mcp/session", async (req, res) => {
    const limit = consumeRateLimit(`mcp-session:${req.ip}`, { limit: 10, windowMs: 60_000 });
    if (!limit.allowed) {
      res.setHeader("Retry-After", String(limit.retryAfterSeconds));
      return res.status(429).json({ error: "Too many MCP session requests. Try again shortly." });
    }
    const response = await createMcpSessionTicket(req.body, process.env, fetch, req.header("authorization"));
    res.status(response.statusCode).json(response.body);
  });

  app.post("/api/analyze", async (req, res) => {
    const requestLimit = process.env.OPENAI_API_KEY ? 20 : 120;
    const limit = consumeRateLimit(`analyze:${req.ip}`, { limit: requestLimit, windowMs: 60_000 });
    if (!limit.allowed) {
      res.setHeader("Retry-After", String(limit.retryAfterSeconds));
      return res.status(429).json({ error: "Too many analysis requests. Try again shortly." });
    }
    const validation = validateAnalyzeRequest(req.body);
    if (!validation.ok) return res.status(400).json({ error: validation.error });
    const { description, rows } = validation.value;

    const fallback = analyzeExperiment({
      description,
      rows
    });

    try {
      const enrichment = await enrichExperiment(description, fallback);
      return res.json(mergeEnrichment(fallback, enrichment));
    } catch (error) {
      return res.json({
        ...fallback,
        groundingStatus: {
          mode: "fallback",
          note: "Using built-in science references because web enrichment was unavailable."
        }
      });
    }
  });

  if (options.staticDir) {
    app.use(express.static(options.staticDir));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) {
        return next();
      }

      return res.sendFile(path.join(options.staticDir as string, "index.html"));
    });
  }

  return app;
}

function allowCorsOrigin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
  return callback(null, isAllowedOrigin(origin));
}
