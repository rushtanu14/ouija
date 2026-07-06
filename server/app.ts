import cors from "cors";
import express from "express";
import path from "node:path";
import { analyzeExperiment, mergeEnrichment } from "../src/lib/analysis";
import { runEvaluationSuite } from "../src/lib/evaluation";
import { buildRuntimeProof } from "../src/lib/runtimeProof";
import type { AnalyzeRequest } from "../src/lib/types";
import { getMcpBridgeStatus, validateMcpExportRequest } from "./mcpBridge";
import { enrichWithOpenAIWebSearch } from "./openaiGrounding";

interface AppOptions {
  staticDir?: string;
}

export function createApp(options: AppOptions = {}) {
  const app = express();

  app.use(cors());
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

  app.post("/api/analyze", async (req, res) => {
    const body = req.body as Partial<AnalyzeRequest>;
    const description = typeof body.description === "string" ? body.description.trim() : "";

    if (!description) {
      return res.status(400).json({
        error: "Describe the experiment before Ouija analyzes expected results."
      });
    }

    const fallback = analyzeExperiment({
      description,
      rows: Array.isArray(body.rows) ? body.rows : undefined
    });

    try {
      const enrichment = await enrichWithOpenAIWebSearch(description, fallback);
      return res.json(mergeEnrichment(fallback, enrichment));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown enrichment error";
      return res.json({
        ...fallback,
        groundingStatus: {
          mode: "fallback",
          note: `Using built-in science references because web enrichment was unavailable: ${message}`
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
