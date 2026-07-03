import OpenAI from "openai";
import type { AnalyzeResult, SourceCard } from "../src/lib/types.js";

type Enrichment = Partial<Pick<AnalyzeResult, "expectedResult" | "sources" | "explanation" | "groundingStatus">>;

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
  const model = process.env.OPENAI_MODEL ?? "gpt-5.5";

  const response = await client.responses.create({
    model,
    tools: [{ type: "web_search" }],
    input: [
      "You are enriching a middle/high school science experiment helper named Ouija.",
      "Use web search only for reputable education or science references.",
      "Do not write a lab report or final conclusion for the student.",
      "Return concise JSON with keys: expectedSummary, explanation, confidenceNote.",
      `Experiment description: ${description}`,
      `Built-in classification: ${fallback.classification.title}`,
      `Built-in expected pattern: ${fallback.expectedResult.pattern}`
    ].join("\n")
  });

  const rawText = response.output_text ?? "";
  const parsed = parseJsonObject(rawText);
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

function parseJsonObject(text: string): Record<string, string> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const value = JSON.parse(match[0]);
    return typeof value === "object" && value ? value : null;
  } catch {
    return null;
  }
}

function extractUrlCitations(response: unknown): SourceCard[] {
  const output = (response as { output?: Array<{ type?: string; content?: Array<{ annotations?: unknown[] }> }> }).output ?? [];
  const sources: SourceCard[] = [];

  for (const item of output) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      for (const annotation of content.annotations ?? []) {
        const citation = annotation as { type?: string; url?: string; title?: string };
        if (citation.type === "url_citation" && citation.url) {
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
