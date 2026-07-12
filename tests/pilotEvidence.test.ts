import { describe, expect, it } from "vitest";
import {
  createInitialPilotEvidenceEntries,
  formatPilotEvidenceSeconds,
  normalizePilotEvidenceEntries,
  summarizePilotEvidence
} from "../src/lib/pilotEvidence";

describe("pilot evidence tracker", () => {
  it("starts empty and prevents fake user-testing claims", () => {
    const summary = summarizePilotEvidence(createInitialPilotEvidenceEntries());

    expect(summary.status).toBe("needs_evidence");
    expect(summary.observationCount).toBe(0);
    expect(summary.headline).toContain("No pilot observations");
    expect(summary.judgeTakeaway).toContain("Do not claim completed student testing");
    expect(summary.averageTimeToGraphSeconds).toBeNull();
  });

  it("summarizes anonymous pilot observations without personal data", () => {
    const entries = createInitialPilotEvidenceEntries().map((entry, index) => ({
      ...entry,
      timeToGraphSeconds: String(90 + index * 30),
      confidenceBefore: index === 2 ? "3" : "2",
      confidenceAfter: index === 0 ? "4" : "3",
      issueCaught: index < 2 ? ("yes" as const) : ("no" as const),
      reflectionReadiness: index < 2 ? ("ready" as const) : ("partial" as const),
      note: index === 0 ? "Student pointed to the warning before writing." : ""
    }));

    const summary = summarizePilotEvidence(entries);

    expect(summary.status).toBe("evidence_ready");
    expect(summary.observationCount).toBe(3);
    expect(summary.averageTimeToGraphSeconds).toBe(120);
    expect(summary.averageConfidenceDelta).toBeCloseTo(1);
    expect(summary.issueCaughtCount).toBe(2);
    expect(summary.reflectionReadyCount).toBe(2);
    expect(summary.noteCount).toBe(1);
    expect(formatPilotEvidenceSeconds(summary.averageTimeToGraphSeconds)).toBe("2m");
  });

  it("normalizes stored rows and ignores unsupported values", () => {
    const normalized = normalizePilotEvidenceEntries([
      {
        timeToGraphSeconds: "120 seconds",
        confidenceBefore: "7",
        confidenceAfter: "5",
        issueCaught: "private",
        reflectionReadiness: "ready",
        note: "x".repeat(200)
      }
    ]);

    expect(normalized).toHaveLength(3);
    expect(normalized[0].timeToGraphSeconds).toBe("120");
    expect(normalized[0].confidenceBefore).toBe("");
    expect(normalized[0].confidenceAfter).toBe("5");
    expect(normalized[0].issueCaught).toBe("");
    expect(normalized[0].reflectionReadiness).toBe("ready");
    expect(normalized[0].note).toHaveLength(160);
  });
});
