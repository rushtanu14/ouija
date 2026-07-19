import { describe, expect, it } from "vitest";
import { analyzeExperiment } from "../src/lib/analysis";
import {
  buildOpenAIGroundingInput,
  extractUrlCitations,
  parseEnrichmentText,
  shouldUseExternalGrounding
} from "../server/openaiGrounding";

describe("OpenAI grounding validation", () => {
  it("accepts only the strict enrichment shape", () => {
    expect(parseEnrichmentText('{"expectedSummary":"Expected","explanation":"Why","confidenceNote":"Mixed evidence"}')).toEqual({
      expectedSummary: "Expected",
      explanation: "Why",
      confidenceNote: "Mixed evidence"
    });
    expect(parseEnrichmentText('{"expectedSummary":42,"explanation":"Why","confidenceNote":"High"}')).toBeNull();
    expect(parseEnrichmentText('prefix {"expectedSummary":"Expected","explanation":"Why","confidenceNote":"High"} suffix')).toBeNull();
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
});
