import type { PilotEvidenceEntry, PilotEvidenceSummary } from "./types";

const pilotEvidenceRowCount = 3;

export function createInitialPilotEvidenceEntries(): PilotEvidenceEntry[] {
  return Array.from({ length: pilotEvidenceRowCount }, (_, index) => ({
    id: `pilot-${index + 1}`,
    label: `Observation ${index + 1}`,
    timeToGraphSeconds: "",
    confidenceBefore: "",
    confidenceAfter: "",
    issueCaught: "",
    reflectionReadiness: "",
    note: ""
  }));
}

export function normalizePilotEvidenceEntries(value: unknown): PilotEvidenceEntry[] {
  if (!Array.isArray(value)) return createInitialPilotEvidenceEntries();

  const defaultEntries = createInitialPilotEvidenceEntries();

  return defaultEntries.map((defaultEntry, index) => {
    const candidate = value[index];
    if (!candidate || typeof candidate !== "object") return defaultEntry;

    const record = candidate as Partial<PilotEvidenceEntry>;

    return {
      ...defaultEntry,
      timeToGraphSeconds: cleanNumberText(record.timeToGraphSeconds),
      confidenceBefore: cleanConfidence(record.confidenceBefore),
      confidenceAfter: cleanConfidence(record.confidenceAfter),
      issueCaught:
        record.issueCaught === "yes" || record.issueCaught === "no" || record.issueCaught === "unsure"
          ? record.issueCaught
          : "",
      reflectionReadiness:
        record.reflectionReadiness === "ready" ||
        record.reflectionReadiness === "partial" ||
        record.reflectionReadiness === "not_ready"
          ? record.reflectionReadiness
          : "",
      note: typeof record.note === "string" ? record.note.slice(0, 160) : ""
    };
  });
}

export function summarizePilotEvidence(entries: PilotEvidenceEntry[]): PilotEvidenceSummary {
  const observations = entries.filter(hasPilotEvidence);
  const timeValues = observations.map((entry) => toPositiveNumber(entry.timeToGraphSeconds)).filter(isNumber);
  const confidenceDeltas = observations
    .map((entry) => {
      const before = toPositiveNumber(entry.confidenceBefore);
      const after = toPositiveNumber(entry.confidenceAfter);
      return before === null || after === null ? null : after - before;
    })
    .filter(isNumber);
  const observationCount = observations.length;
  const averageTimeToGraphSeconds = average(timeValues);
  const averageConfidenceDelta = average(confidenceDeltas);
  const issueCaughtCount = observations.filter((entry) => entry.issueCaught === "yes").length;
  const reflectionReadyCount = observations.filter((entry) => entry.reflectionReadiness === "ready").length;
  const noteCount = observations.filter((entry) => entry.note.trim().length > 0).length;
  const directIdentifierRiskCount = observations.filter((entry) => hasDirectIdentifierRisk(entry.note)).length;
  const qualityChecks = buildQualityChecks(observations);
  const qualityScore = calculateQualityScore(qualityChecks, observationCount);
  const qualityStatus: PilotEvidenceSummary["qualityStatus"] =
    observationCount === 0 ? "not_ready" : qualityChecks.every((check) => check.status === "pass") ? "submission_ready" : "review";
  const status: PilotEvidenceSummary["status"] =
    observationCount === 0 ? "needs_evidence" : observationCount >= pilotEvidenceRowCount ? "evidence_ready" : "collect_more";

  return {
    status,
    qualityStatus,
    qualityScore,
    qualityChecks,
    headline: buildHeadline(status, observationCount),
    observationCount,
    averageTimeToGraphSeconds,
    averageConfidenceDelta,
    issueCaughtCount,
    reflectionReadyCount,
    noteCount,
    directIdentifierRiskCount,
    judgeTakeaway: buildJudgeTakeaway(status, qualityStatus)
  };
}

export function formatPilotEvidenceSeconds(seconds: number | null): string {
  if (seconds === null) return "Not measured";
  const rounded = Math.round(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainder = rounded % 60;
  if (minutes === 0) return `${remainder}s`;
  if (remainder === 0) return `${minutes}m`;
  return `${minutes}m ${remainder}s`;
}

export function buildPilotEvidenceExport(entries: PilotEvidenceEntry[], summary: PilotEvidenceSummary): string {
  const header = [
    "Ouija Pilot Evidence Export",
    `Status,${formatCsvCell(summary.status)}`,
    `Quality status,${formatCsvCell(summary.qualityStatus)}`,
    `Quality score,${summary.qualityScore}`,
    `Summary,${formatCsvCell(summary.headline)}`,
    `Anonymous observations,${summary.observationCount}`,
    `Average time to first graph,${formatCsvCell(formatPilotEvidenceSeconds(summary.averageTimeToGraphSeconds))}`,
    `Average confidence shift,${formatCsvCell(formatExportDelta(summary.averageConfidenceDelta))}`,
    `Issues spotted,${summary.issueCaughtCount}`,
    `Exit tickets ready,${summary.reflectionReadyCount}`,
    `Non-identifying notes,${summary.noteCount}`,
    `Direct identifier risks,${summary.directIdentifierRiskCount}`,
    "Privacy boundary,No names contact info grades faces or private classroom details. Review notes before sharing externally."
  ];
  const checks = [
    "Quality checks",
    ...summary.qualityChecks.map((check) => `${formatCsvCell(check.label)},${formatCsvCell(check.status)},${formatCsvCell(check.detail)}`)
  ];
  const rows = [
    "Observation,Time to graph seconds,Confidence before,Confidence after,Confidence delta,Issue spotted,Exit ticket readiness,Non-identifying note",
    ...entries.map((entry) =>
      [
        entry.label,
        entry.timeToGraphSeconds || "not recorded",
        entry.confidenceBefore || "not rated",
        entry.confidenceAfter || "not rated",
        formatEntryDelta(entry),
        formatEvidenceSignal(entry.issueCaught),
        formatReflectionSignal(entry.reflectionReadiness),
        redactSensitiveNote(entry.note.trim() || "none")
      ]
        .map(formatCsvCell)
        .join(",")
    )
  ];

  return [...header, "", ...checks, "", ...rows].join("\n");
}

function cleanNumberText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/[^\d.]/g, "").slice(0, 6);
}

function cleanConfidence(value: unknown) {
  if (value === "1" || value === "2" || value === "3" || value === "4" || value === "5") return value;
  return "";
}

function hasPilotEvidence(entry: PilotEvidenceEntry) {
  return Boolean(
    entry.timeToGraphSeconds ||
      entry.confidenceBefore ||
      entry.confidenceAfter ||
      entry.issueCaught ||
      entry.reflectionReadiness ||
      entry.note.trim()
  );
}

function toPositiveNumber(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function isNumber(value: number | null): value is number {
  return value !== null;
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildQualityChecks(observations: PilotEvidenceEntry[]): PilotEvidenceSummary["qualityChecks"] {
  const observationCount = observations.length;
  const timingCount = observations.filter((entry) => toPositiveNumber(entry.timeToGraphSeconds) !== null).length;
  const confidencePairCount = observations.filter(
    (entry) => toPositiveNumber(entry.confidenceBefore) !== null && toPositiveNumber(entry.confidenceAfter) !== null
  ).length;
  const issueReflectionCount = observations.filter((entry) => entry.issueCaught && entry.reflectionReadiness).length;
  const directIdentifierRiskCount = observations.filter((entry) => hasDirectIdentifierRisk(entry.note)).length;

  return [
    {
      id: "observation-count",
      label: "Three anonymous observations",
      status: observationCount >= pilotEvidenceRowCount ? "pass" : observationCount > 0 ? "review" : "fail",
      detail:
        observationCount >= pilotEvidenceRowCount
          ? "Three anonymous student runs are logged."
          : observationCount > 0
            ? `${observationCount}/3 observations logged; collect three before claiming pilot evidence.`
            : "No pilot observations have been logged yet."
    },
    {
      id: "timing",
      label: "Time-to-graph recorded",
      status: timingCount === observationCount && observationCount > 0 ? "pass" : timingCount > 0 ? "review" : "fail",
      detail:
        timingCount === observationCount && observationCount > 0
          ? "Every logged observation includes time to first graph."
          : timingCount > 0
            ? `${timingCount}/${observationCount} logged observations include timing.`
            : "Record seconds from Analyze to graph/table understanding."
    },
    {
      id: "confidence",
      label: "Confidence before/after paired",
      status: confidencePairCount === observationCount && observationCount > 0 ? "pass" : confidencePairCount > 0 ? "review" : "fail",
      detail:
        confidencePairCount === observationCount && observationCount > 0
          ? "Every logged observation includes before/after confidence."
          : confidencePairCount > 0
            ? `${confidencePairCount}/${observationCount} observations include paired confidence ratings.`
            : "Record before and after confidence for each anonymous run."
    },
    {
      id: "issue-reflection",
      label: "Issue and reflection signals",
      status: issueReflectionCount === observationCount && observationCount > 0 ? "pass" : issueReflectionCount > 0 ? "review" : "fail",
      detail:
        issueReflectionCount === observationCount && observationCount > 0
          ? "Every logged observation includes issue spotting and exit-ticket readiness."
          : issueReflectionCount > 0
            ? `${issueReflectionCount}/${observationCount} observations include both signals.`
            : "Record whether the student spotted an issue and whether the exit ticket was ready."
    },
    {
      id: "privacy",
      label: "Privacy scan",
      status: directIdentifierRiskCount === 0 && observationCount > 0 ? "pass" : directIdentifierRiskCount > 0 ? "review" : "fail",
      detail:
        directIdentifierRiskCount === 0 && observationCount > 0
          ? "No email or phone-like strings detected in observer notes."
          : directIdentifierRiskCount > 0
            ? `${directIdentifierRiskCount} note${directIdentifierRiskCount === 1 ? "" : "s"} may contain direct identifiers; review before sharing.`
            : "Add only non-identifying notes; no names, contact info, grades, faces, or private class details."
    }
  ];
}

function calculateQualityScore(checks: PilotEvidenceSummary["qualityChecks"], observationCount: number) {
  const rawScore = checks.reduce((score, check) => {
    if (check.status === "pass") return score + 20;
    if (check.status === "review") return score + 10;
    return score;
  }, 0);
  if (observationCount > 0 && observationCount < pilotEvidenceRowCount) return Math.min(rawScore, 80);
  return rawScore;
}

function formatEntryDelta(entry: PilotEvidenceEntry) {
  const before = toPositiveNumber(entry.confidenceBefore);
  const after = toPositiveNumber(entry.confidenceAfter);
  if (before === null || after === null) return "not measured";
  return formatExportDelta(after - before);
}

function formatExportDelta(delta: number | null) {
  if (delta === null) return "not measured";
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}`;
}

function formatEvidenceSignal(value: PilotEvidenceEntry["issueCaught"]) {
  if (value === "yes") return "yes";
  if (value === "no") return "no";
  if (value === "unsure") return "unsure";
  return "not recorded";
}

function formatReflectionSignal(value: PilotEvidenceEntry["reflectionReadiness"]) {
  if (value === "ready") return "ready";
  if (value === "partial") return "partial";
  if (value === "not_ready") return "not ready";
  return "not recorded";
}

function redactSensitiveNote(note: string) {
  return note
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted email]")
    .replace(/\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g, "[redacted phone]")
    .replace(/\s+/g, " ")
    .slice(0, 160);
}

function hasDirectIdentifierRisk(note: string) {
  return /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(note) || /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/.test(note);
}

function formatCsvCell(value: string | number) {
  const text = String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

function buildHeadline(status: PilotEvidenceSummary["status"], observationCount: number) {
  if (status === "needs_evidence") return "No pilot observations yet.";
  if (status === "collect_more") {
    return `${observationCount} anonymous observation${observationCount === 1 ? "" : "s"} logged; collect three before claiming pilot evidence.`;
  }
  return `${observationCount} anonymous observations logged for early pilot evidence.`;
}

function buildJudgeTakeaway(status: PilotEvidenceSummary["status"], qualityStatus: PilotEvidenceSummary["qualityStatus"]) {
  if (status === "needs_evidence") {
    return "Do not claim completed student testing yet; this tracker shows exactly what evidence still needs to be collected.";
  }
  if (qualityStatus === "review") {
    return "Pilot observations exist, but the quality gate is still in review; finish timing, confidence, issue/reflection, and privacy checks before claiming submission-ready evidence.";
  }
  if (status === "collect_more") {
    return "Early pilot evidence is started, but judges should see it as a small anonymous sample, not a finished study.";
  }
  return "Anonymous pilot evidence is ready to summarize for Forms, Sheets, or Notion while keeping student data private.";
}
