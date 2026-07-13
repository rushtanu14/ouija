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
  const status: PilotEvidenceSummary["status"] =
    observationCount === 0 ? "needs_evidence" : observationCount >= pilotEvidenceRowCount ? "evidence_ready" : "collect_more";

  return {
    status,
    headline: buildHeadline(status, observationCount),
    observationCount,
    averageTimeToGraphSeconds,
    averageConfidenceDelta,
    issueCaughtCount,
    reflectionReadyCount,
    noteCount,
    judgeTakeaway: buildJudgeTakeaway(status)
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
    `Summary,${formatCsvCell(summary.headline)}`,
    `Anonymous observations,${summary.observationCount}`,
    `Average time to first graph,${formatCsvCell(formatPilotEvidenceSeconds(summary.averageTimeToGraphSeconds))}`,
    `Average confidence shift,${formatCsvCell(formatExportDelta(summary.averageConfidenceDelta))}`,
    `Issues spotted,${summary.issueCaughtCount}`,
    `Exit tickets ready,${summary.reflectionReadyCount}`,
    `Non-identifying notes,${summary.noteCount}`,
    "Privacy boundary,No names contact info grades faces or private classroom details. Review notes before sharing externally."
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

  return [...header, "", ...rows].join("\n");
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

function buildJudgeTakeaway(status: PilotEvidenceSummary["status"]) {
  if (status === "needs_evidence") {
    return "Do not claim completed student testing yet; this tracker shows exactly what evidence still needs to be collected.";
  }
  if (status === "collect_more") {
    return "Early pilot evidence is started, but judges should see it as a small anonymous sample, not a finished study.";
  }
  return "Anonymous pilot evidence is ready to summarize for Forms, Sheets, or Notion while keeping student data private.";
}
