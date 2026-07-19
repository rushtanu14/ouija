import { describe, expect, it } from "vitest";
import {
  buildPilotEvidenceExport,
  createInitialPilotEvidenceEntries,
  formatCsvCell,
  formatPilotEvidenceSeconds,
  normalizePilotEvidenceEntries,
  summarizePilotEvidence
} from "../src/lib/pilotEvidence";
import { PRIVACY_REVIEW_COPY, scanPrivateText } from "../src/lib/privacyText";

describe("pilot evidence tracker", () => {
  it("starts empty and prevents fake user-testing claims", () => {
    const summary = summarizePilotEvidence(createInitialPilotEvidenceEntries());

    expect(summary.status).toBe("needs_evidence");
    expect(summary.qualityStatus).toBe("not_ready");
    expect(summary.qualityScore).toBe(0);
    expect(summary.qualityChecks.map((check) => check.id)).toEqual([
      "observation-count",
      "timing",
      "confidence",
      "issue-reflection",
      "privacy"
    ]);
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
    expect(summary.qualityStatus).toBe("submission_ready");
    expect(summary.qualityScore).toBe(100);
    expect(summary.qualityChecks.every((check) => check.status === "pass")).toBe(true);
    expect(summary.observationCount).toBe(3);
    expect(summary.averageTimeToGraphSeconds).toBe(120);
    expect(summary.averageConfidenceDelta).toBeCloseTo(1);
    expect(summary.issueCaughtCount).toBe(2);
    expect(summary.reflectionReadyCount).toBe(2);
    expect(summary.noteCount).toBe(1);
    expect(formatPilotEvidenceSeconds(summary.averageTimeToGraphSeconds)).toBe("2m");
  });

  it("keeps filled pilot rows in review when evidence quality is incomplete", () => {
    const entries = createInitialPilotEvidenceEntries().map((entry, index) => ({
      ...entry,
      timeToGraphSeconds: String(60 + index * 20),
      confidenceBefore: index === 0 ? "2" : "",
      confidenceAfter: index === 0 ? "4" : "",
      issueCaught: "" as const,
      reflectionReadiness: "" as const,
      note: index === 1 ? "Student can be reached at 555-123-4567." : ""
    }));

    const summary = summarizePilotEvidence(entries);

    expect(summary.status).toBe("evidence_ready");
    expect(summary.qualityStatus).toBe("review");
    expect(summary.qualityScore).toBeLessThan(100);
    expect(summary.directIdentifierRiskCount).toBe(1);
    expect(summary.qualityChecks.find((check) => check.id === "privacy")?.status).toBe("review");
    expect(summary.judgeTakeaway).toContain("quality gate");
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

  it("detects broader private classroom text without claiming complete PII coverage", () => {
    const scanned = scanPrivateText([
      "Email rushil@example.com after period 4.",
      "Student ID 123456 and grade 10.",
      "Meet at 742 Evergreen Street near 37.7749, -122.4194.",
      "Access code ABCD-1234 and face photo attached."
    ].join(" "));

    expect(scanned.safe).toBe(false);
    expect(scanned.reasons.map((reason) => reason.kind)).toEqual([
      "contact",
      "student_or_class_id",
      "grade_or_class_period",
      "address",
      "access_code",
      "coordinates",
      "photo_or_face"
    ]);
    expect(PRIVACY_REVIEW_COPY).toContain("automated screen");
    expect(PRIVACY_REVIEW_COPY).toContain("not a complete guarantee");
  });

  it("neutralizes spreadsheet formula-leading values before CSV quoting", () => {
    expect(formatCsvCell("=IMPORTXML(\"https://example.com\",\"//title\")")).toBe("\"'=IMPORTXML(\"\"https://example.com\"\",\"\"//title\"\")\"");
    expect(formatCsvCell("+SUM(A1:A2)")).toBe("'+SUM(A1:A2)");
    expect(formatCsvCell("-10")).toBe("'-10");
    expect(formatCsvCell("@cmd")).toBe("'@cmd");
    expect(formatCsvCell("normal value")).toBe("normal value");
  });

  it("builds a CSV-ready anonymous export without raw or redacted note content", () => {
    const entries = createInitialPilotEvidenceEntries();
    const nextEntries = entries.map((entry, index) => ({
      ...entry,
      timeToGraphSeconds: index === 0 ? "90" : entry.timeToGraphSeconds,
      confidenceBefore: index === 0 ? "2" : entry.confidenceBefore,
      confidenceAfter: index === 0 ? "4" : entry.confidenceAfter,
      issueCaught: index === 0 ? ("yes" as const) : entry.issueCaught,
      reflectionReadiness: index === 0 ? ("ready" as const) : entry.reflectionReadiness,
      note: index === 0 ? "Student emailed rushil@example.com and used 555-123-4567." : entry.note
    }));
    const summary = summarizePilotEvidence(nextEntries);
    const exported = buildPilotEvidenceExport(nextEntries, summary);

    expect(exported).toContain("Ouija Pilot Evidence Export");
    expect(exported).toContain("Quality status,review");
    expect(exported).toContain("Quality score,80");
    expect(exported).toContain("Anonymous observations,1");
    expect(exported).toContain("Observation 1,90,2,4,'+2.0,yes,ready");
    expect(exported).toContain("Observer notes recorded,1");
    expect(exported).toContain("Raw observer notes stay browser-local");
    expect(exported).toContain("structured metrics and aggregate privacy-risk counts only");
    expect(exported).toContain("no raw or redacted note column");
    expect(exported).not.toContain("Non-identifying note");
    expect(exported).not.toContain("[redacted email]");
    expect(exported).not.toContain("[redacted phone]");
    expect(exported).not.toContain("rushil@example.com");
    expect(exported).not.toContain("555-123-4567");
  });
});
