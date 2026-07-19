import OpenAI from "openai";
import type { AnalyzeRequest, AnalyzeResult, SourceCard } from "../src/lib/types.js";

type Enrichment = Partial<Pick<AnalyzeResult, "expectedResult" | "sources" | "explanation" | "groundingStatus">>;
type GroundingEnv = Partial<Pick<NodeJS.ProcessEnv, "OPENAI_API_KEY" | "OPENAI_MODEL" | "OUIJA_EXTERNAL_GROUNDING_ENABLED" | "NODE_ENV">>;
interface ParsedEnrichment {
  expectedSummary: string;
  explanation: string;
  confidenceNote: string;
}

export function shouldUseExternalGrounding(request: Pick<AnalyzeRequest, "allowExternalGrounding">, env: GroundingEnv = process.env) {
  return request.allowExternalGrounding === true
    && env.OUIJA_EXTERNAL_GROUNDING_ENABLED === "true"
    && env.NODE_ENV !== "production"
    && hasValue(env.OPENAI_API_KEY);
}

export function externalGroundingFallbackNote(request: Pick<AnalyzeRequest, "allowExternalGrounding">, env: GroundingEnv = process.env) {
  if (env.NODE_ENV === "production") {
    return "External grounding is disabled in production; using built-in trusted science references.";
  }
  if (!hasValue(env.OPENAI_API_KEY)) {
    return "No OpenAI API key configured; using built-in trusted science references.";
  }
  if (request.allowExternalGrounding !== true) {
    return "External grounding requires explicit opt-in; using built-in trusted science references.";
  }
  if (env.OUIJA_EXTERNAL_GROUNDING_ENABLED !== "true") {
    return "External grounding is disabled on this server; using built-in trusted science references.";
  }
  return "External grounding is unavailable; using built-in trusted science references.";
}

export function buildOpenAIGroundingInput(fallback: AnalyzeResult) {
  return [
    "You are enriching a middle/high school science experiment helper named Ouija.",
    "Use web search only for reputable education or science references.",
    "Do not write a lab report or final conclusion for the student.",
    "Return concise JSON with keys: expectedSummary, explanation, confidenceNote.",
    `Built-in classification: ${fallback.classification.title}`,
    `Subject: ${fallback.classification.subject}`,
    `Concepts: ${fallback.classification.concepts.join(", ")}`,
    `Variables: ${fallback.variables.join(", ")}`,
    `Built-in expected pattern: ${fallback.expectedResult.pattern}`,
    `Current expected summary: ${fallback.expectedResult.summary}`,
    `Grounding audit summary: ${fallback.groundingAudit.summary}`,
    `Grounding consensus: ${fallback.groundingAudit.consensus}`,
    `Source publishers: ${fallback.sources.map((source) => source.publisher).join(", ")}`
  ];
}

export async function enrichWithOpenAIWebSearch(
  description: string,
  fallback: AnalyzeResult
): Promise<Enrichment> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      groundingStatus: {
        mode: "fallback",
        note: "No OpenAI API key configured; using built-in trusted science references."
      }
    };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL ?? "gpt-5.6";

  const response = await client.responses.create({
    model,
    tools: [{ type: "web_search" }],
    max_output_tokens: 700,
    text: {
      format: {
        type: "json_schema",
        name: "ouija_grounding_enrichment",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            expectedSummary: { type: "string", maxLength: 1_500 },
            explanation: { type: "string", maxLength: 2_500 },
            confidenceNote: { type: "string", maxLength: 500 }
          },
          required: ["expectedSummary", "explanation", "confidenceNote"]
        }
      }
    },
    input: buildOpenAIGroundingInput(fallback).join("\n")
  }, { signal: AbortSignal.timeout(15_000) });

  const rawText = response.output_text ?? "";
  const parsed = parseEnrichmentText(rawText);
  const citations = extractUrlCitations(response);

  if (!parsed && citations.length === 0) {
    return {
      groundingStatus: {
        mode: "fallback",
        note: "OpenAI web search returned no usable structured enrichment; using built-in references."
      }
    };
  }

  return {
    expectedResult: {
      ...fallback.expectedResult,
      summary: parsed?.expectedSummary ?? fallback.expectedResult.summary,
      mixedEvidence: parsed?.confidenceNote?.toLowerCase().includes("mixed") ?? fallback.expectedResult.mixedEvidence
    },
    explanation: parsed?.explanation ?? fallback.explanation,
    sources: citations.length > 0 ? citations : fallback.sources,
    groundingStatus: {
      mode: citations.length > 0 ? "web_enriched" : "fallback",
      note:
        citations.length > 0
          ? "Expected results are enriched with web-search citations."
          : "OpenAI enrichment did not include citations, so Ouija kept built-in trusted references."
    }
  };
}

export function parseEnrichmentText(text: string): ParsedEnrichment | null {
  try {
    const value = JSON.parse(text) as unknown;
    if (!isRecord(value)) return null;
    const keys = Object.keys(value).sort();
    if (keys.join(",") !== "confidenceNote,expectedSummary,explanation") return null;
    if (
      !isBoundedString(value.expectedSummary, 1_500)
      || !isBoundedString(value.explanation, 2_500)
      || !isBoundedString(value.confidenceNote, 500)
    ) return null;
    return {
      expectedSummary: value.expectedSummary,
      explanation: value.explanation,
      confidenceNote: value.confidenceNote
    };
  } catch {
    return null;
  }
}

export function extractUrlCitations(response: unknown): SourceCard[] {
  const output = (response as { output?: Array<{ type?: string; content?: Array<{ annotations?: unknown[] }> }> }).output ?? [];
  const sources: SourceCard[] = [];
  const seenUrls = new Set<string>();

  for (const item of output) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      for (const annotation of content.annotations ?? []) {
        const citation = annotation as { type?: string; url?: string; title?: string };
        if (citation.type === "url_citation" && citation.url && isSafeHttpsUrl(citation.url) && !seenUrls.has(citation.url)) {
          seenUrls.add(citation.url);
          sources.push({
            id: `web-${sources.length + 1}`,
            title: citation.title ?? "Web reference",
            url: citation.url,
            publisher: "Web search",
            confidence: "web",
            note: "OpenAI web-search citation used for grounded expected results."
          });
        }
      }
    }
  }

  return sources;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isBoundedString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

function isSafeHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}
