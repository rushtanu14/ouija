import cors from "cors";
import express from "express";
import { analyzeExperiment, mergeEnrichment } from "../src/lib/analysis";
import type { AnalyzeRequest } from "../src/lib/types";
import { enrichWithOpenAIWebSearch } from "./openaiGrounding";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "ouija-api" });
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

  return app;
}
