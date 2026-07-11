import { describe, expect, it } from "vitest";
import { extractUrlCitations, parseEnrichmentText } from "../server/openaiGrounding";

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
});
