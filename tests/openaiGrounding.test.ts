import { afterEach, describe, expect, it, vi } from "vitest";
import { analyzeExperiment } from "../src/lib/analysis";

const { mockResponsesCreate } = vi.hoisted(() => ({
  mockResponsesCreate: vi.fn()
}));

vi.mock("openai", () => ({
  default: class MockOpenAI {
    responses = {
      create: mockResponsesCreate
    };
  }
}));

import {
  buildOpenAIGroundingInput,
  enrichWithOpenAIWebSearch,
  externalGroundingFallbackNote,
  extractUrlCitations,
  parseEnrichmentText,
  shouldUseExternalGrounding
} from "../server/openaiGrounding";

const originalKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.OPENAI_MODEL;

afterEach(() => {
  mockResponsesCreate.mockReset();
  restoreEnv("OPENAI_API_KEY", originalKey);
  restoreEnv("OPENAI_MODEL", originalModel);
});

describe("OpenAI grounding validation", () => {
  it("accepts only the strict enrichment shape", () => {
    expect(parseEnrichmentText('{"expectedSummary":"Expected","explanation":"Why","confidenceNote":"Mixed evidence"}')).toEqual({
      expectedSummary: "Expected",
      explanation: "Why",
      confidenceNote: "Mixed evidence"
    });
    expect(parseEnrichmentText('{"expectedSummary":42,"explanation":"Why","confidenceNote":"High"}')).toBeNull();
    expect(parseEnrichmentText('prefix {"expectedSummary":"Expected","explanation":"Why","confidenceNote":"High"} suffix')).toBeNull();
    expect(parseEnrichmentText('{"expectedSummary":"Expected","explanation":"Why","confidenceNote":"High","extra":"no"}')).toBeNull();
    expect(parseEnrichmentText(JSON.stringify({ expectedSummary: "x".repeat(1_501), explanation: "Why", confidenceNote: "High" }))).toBeNull();
    expect(parseEnrichmentText("[]")).toBeNull();
  });

  it("keeps unique HTTPS citations and rejects unsafe schemes", () => {
    const response = {
      output: [{
        type: "message",
        content: [{
          annotations: [
            { type: "url_citation", url: "https://science.example/source", title: "Science" },
            { type: "url_citation", url: "https://science.example/source", title: "Duplicate" },
            { type: "url_citation", url: "javascript:alert(1)", title: "Unsafe" },
            { type: "url_citation", url: "http://insecure.example", title: "Insecure" }
          ]
        }]
      }]
    };

    expect(extractUrlCitations(response)).toEqual([
      expect.objectContaining({ url: "https://science.example/source", title: "Science" })
    ]);
  });

  it("requires explicit request opt-in, server enablement, and non-production mode", () => {
    expect(shouldUseExternalGrounding({ allowExternalGrounding: true }, {
      OPENAI_API_KEY: "   ",
      OUIJA_EXTERNAL_GROUNDING_ENABLED: "true",
      NODE_ENV: "development"
    })).toBe(false);
    expect(shouldUseExternalGrounding({ allowExternalGrounding: true }, {
      OPENAI_API_KEY: "sk-test",
      OUIJA_EXTERNAL_GROUNDING_ENABLED: "true",
      NODE_ENV: "production"
    })).toBe(false);
    expect(shouldUseExternalGrounding({}, {
      OPENAI_API_KEY: "sk-test",
      OUIJA_EXTERNAL_GROUNDING_ENABLED: "true",
      NODE_ENV: "development"
    })).toBe(false);
    expect(shouldUseExternalGrounding({ allowExternalGrounding: true }, {
      OPENAI_API_KEY: "sk-test",
      OUIJA_EXTERNAL_GROUNDING_ENABLED: "true",
      NODE_ENV: "development"
    })).toBe(true);
  });

  it("explains every external grounding fallback gate without leaking secrets", () => {
    expect(externalGroundingFallbackNote({ allowExternalGrounding: true }, { NODE_ENV: "production", OPENAI_API_KEY: "sk-secret" })).toContain("disabled in production");
    expect(externalGroundingFallbackNote({ allowExternalGrounding: true }, { NODE_ENV: "development" })).toContain("No OpenAI API key");
    expect(externalGroundingFallbackNote({ allowExternalGrounding: false }, { NODE_ENV: "development", OPENAI_API_KEY: "sk-secret" })).toContain("explicit opt-in");
    expect(externalGroundingFallbackNote({ allowExternalGrounding: true }, { NODE_ENV: "development", OPENAI_API_KEY: "sk-secret", OUIJA_EXTERNAL_GROUNDING_ENABLED: "false" })).toContain("disabled on this server");
    expect(externalGroundingFallbackNote({ allowExternalGrounding: true }, { NODE_ENV: "development", OPENAI_API_KEY: "sk-secret", OUIJA_EXTERNAL_GROUNDING_ENABLED: "true" })).toContain("unavailable");
  });

  it("builds OpenAI prompts from allowlisted structured fields only", () => {
    const result = analyzeExperiment({
      description: "Projectile lab for Jordan in period 4.",
      rows: [{ id: "row-1", angleDeg: "=IMPORTXML(\"https://evil.example\",\"//title\")", rangeM: 4.2 }]
    });
    const input = buildOpenAIGroundingInput(result);
    const serialized = input.join("\n");

    expect(serialized).toContain(`Built-in classification: ${result.classification.title}`);
    expect(serialized).toContain("Built-in expected pattern:");
    expect(serialized).toContain("Grounding audit summary:");
    expect(serialized).not.toContain("Jordan");
    expect(serialized).not.toContain("period 4");
    expect(serialized).not.toContain("IMPORTXML");
    expect(serialized).not.toContain("row-1");
    expect(serialized).not.toContain("reflection");
    expect(serialized).not.toContain("Evidence Packet");
  });

  it("returns fallback status without constructing a client when no API key exists", async () => {
    delete process.env.OPENAI_API_KEY;
    const fallback = analyzeExperiment({ description: "Projectile launch angle and range." });

    await expect(enrichWithOpenAIWebSearch("Projectile launch angle and range.", fallback)).resolves.toMatchObject({
      groundingStatus: {
        mode: "fallback",
        note: expect.stringContaining("No OpenAI API key")
      }
    });
    expect(mockResponsesCreate).not.toHaveBeenCalled();
  });

  it("merges valid web enrichment and safe citations", async () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.OPENAI_MODEL = "gpt-test";
    const fallback = analyzeExperiment({ description: "Projectile launch angle and range." });
    mockResponsesCreate.mockResolvedValue({
      output_text: '{"expectedSummary":"External summary","explanation":"External explanation","confidenceNote":"Mixed evidence from sources"}',
      output: [{
        type: "message",
        content: [{
          annotations: [{ type: "url_citation", url: "https://science.example/projectile", title: "Projectile source" }]
        }]
      }]
    });

    const enriched = await enrichWithOpenAIWebSearch("Student raw description should not be sent directly.", fallback);

    expect(mockResponsesCreate).toHaveBeenCalledWith(expect.objectContaining({
      model: "gpt-test",
      tools: [{ type: "web_search" }],
      input: expect.stringContaining("Built-in classification:")
    }), expect.objectContaining({ signal: expect.any(AbortSignal) }));
    expect(enriched.expectedResult?.summary).toBe("External summary");
    expect(enriched.expectedResult?.mixedEvidence).toBe(true);
    expect(enriched.explanation).toBe("External explanation");
    expect(enriched.sources?.[0]).toMatchObject({
      id: "web-1",
      title: "Projectile source",
      url: "https://science.example/projectile",
      confidence: "web"
    });
    expect(enriched.groundingStatus?.mode).toBe("web_enriched");
  });

  it("keeps built-in references when enrichment has no safe citations", async () => {
    process.env.OPENAI_API_KEY = "sk-test";
    const fallback = analyzeExperiment({ description: "Projectile launch angle and range." });
    mockResponsesCreate.mockResolvedValueOnce({
      output_text: '{"expectedSummary":"External summary","explanation":"External explanation","confidenceNote":"High"}',
      output: []
    });
    mockResponsesCreate.mockResolvedValueOnce({
      output_text: "not-json",
      output: []
    });

    const parsedOnly = await enrichWithOpenAIWebSearch("Projectile", fallback);
    const empty = await enrichWithOpenAIWebSearch("Projectile", fallback);

    expect(parsedOnly.sources).toBe(fallback.sources);
    expect(parsedOnly.groundingStatus?.mode).toBe("fallback");
    expect(parsedOnly.groundingStatus?.note).toContain("did not include citations");
    expect(empty).toEqual({
      groundingStatus: {
        mode: "fallback",
        note: "OpenAI web search returned no usable structured enrichment; using built-in references."
      }
    });
  });
});

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
