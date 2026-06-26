import { EXPERIMENT_TEMPLATES } from "./templates";
import type { AnalyzeRequest, AnalyzeResult, ExperimentTemplate, Issue, StudentDataRow } from "./types";

const INTEGRITY_NOTICE = "Hints, checks, and explanations only. Ouija will not write the full lab report or final conclusion for you.";

export function matchExperiment(description: string): { template: ExperimentTemplate; confidence: number } {
  const normalized = description.toLowerCase();
  const scores = EXPERIMENT_TEMPLATES.map((template) => {
    const keywordHits = template.matcherKeywords.filter((keyword) => normalized.includes(keyword)).length;
    const conceptHits = template.concepts.filter((concept) => normalized.includes(concept.toLowerCase())).length;
    return {
      template,
      score: keywordHits * 2 + conceptHits
    };
  }).sort((a, b) => b.score - a.score);

  const best = scores[0];
  const confidence = best.score === 0 ? 0.48 : Math.min(0.94, 0.58 + best.score * 0.08);

  return {
    template: best.template,
    confidence
  };
}

export function analyzeExperiment(request: AnalyzeRequest): AnalyzeResult {
  const { template, confidence } = matchExperiment(request.description);
  const rows = normalizeRows(request.rows?.length ? request.rows : template.sampleRows, template);
  const issues = evaluateRows(template.id, rows);
  const integrityIssues = detectIntegrityRisk(request.description);
  const allIssues = integrityIssues.length ? [...integrityIssues, ...issues] : issues;

  return {
    templateId: template.id,
    classification: {
      subject: template.subject,
      title: template.title,
      confidence,
      concepts: template.concepts
    },
    variables: template.variables,
    expectedResult: template.expectedResult,
    sources: template.fallbackSources,
    columns: template.columns,
    rows,
    issues: allIssues,
    hints: buildHints(template, allIssues),
    explanation: template.explanation,
    integrityNotice: INTEGRITY_NOTICE,
    groundingStatus: {
      mode: "fallback",
      note: "Using built-in middle/high school science references."
    }
  };
}

export function evaluateRows(templateId: string, rows: StudentDataRow[]): Issue[] {
  const template = EXPERIMENT_TEMPLATES.find((candidate) => candidate.id === templateId);
  if (!template) return [];

  const issues: Issue[] = [];
  issues.push(...findMissingOrInvalidCells(template, rows));

  if (templateId === "projectile-motion") {
    issues.push(...evaluateProjectileRows(rows));
  }

  if (templateId === "reaction-rate-temperature") {
    issues.push(...evaluateReactionRateRows(rows));
  }

  if (templateId === "enzyme-activity-temperature") {
    issues.push(...evaluateEnzymeRows(rows));
  }

  if (templateId === "water-filtration-turbidity") {
    issues.push(...evaluateTurbidityRows(rows));
  }

  if (issues.length === 0) {
    issues.push({
      id: "data-pattern-ok",
      severity: "info",
      title: "Data pattern is plausible",
      detail: "The table does not show obvious unit, missing-value, or expected-pattern problems."
    });
  }

  return issues;
}

export function mergeEnrichment(base: AnalyzeResult, enrichment: Partial<AnalyzeResult>): AnalyzeResult {
  return {
    ...base,
    ...enrichment,
    expectedResult: {
      ...base.expectedResult,
      ...enrichment.expectedResult
    },
    sources: enrichment.sources?.length ? enrichment.sources : base.sources,
    issues: enrichment.issues?.length ? enrichment.issues : base.issues,
    hints: enrichment.hints?.length ? enrichment.hints : base.hints
  };
}

function normalizeRows(rows: StudentDataRow[], template: ExperimentTemplate): StudentDataRow[] {
  return rows.map((row, index) => ({
    id: String(row.id ?? `${template.id}-${index + 1}`),
    ...template.columns.reduce<Record<string, string | number>>((acc, column) => {
      acc[column.key] = row[column.key] ?? "";
      return acc;
    }, {})
  }));
}

function findMissingOrInvalidCells(template: ExperimentTemplate, rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];

  for (const row of rows) {
    for (const column of template.columns) {
      const raw = row[column.key];
      if (raw === "" || raw === null || raw === undefined) {
        issues.push({
          id: `missing-${row.id}-${column.key}`,
          severity: "warning",
          title: "Missing data",
          detail: `Row ${row.id} is missing ${column.label}.`
        });
      }

      if (column.numeric && raw !== "" && raw !== null && raw !== undefined && Number.isNaN(Number(raw))) {
        issues.push({
          id: `invalid-${row.id}-${column.key}`,
          severity: "error",
          title: "Possible unit or number mismatch",
          detail: `${column.label} should be numeric${column.unit ? ` in ${column.unit}` : ""}; Ouija read "${raw}".`
        });
      }
    }
  }

  return issues;
}

function evaluateProjectileRows(rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];
  const gravity = 9.8;

  for (const row of rows) {
    const angle = Number(row.angleDeg);
    const speed = Number(row.launchSpeedMs);
    const range = Number(row.rangeM);

    if (Number.isFinite(angle) && (angle <= 0 || angle >= 90)) {
      issues.push({
        id: `projectile-angle-${row.id}`,
        severity: "warning",
        title: "Launch angle looks outside the normal classroom range",
        detail: "Projectile range trials usually use angles between 0 and 90 degrees."
      });
    }

    if (Number.isFinite(speed) && speed <= 0) {
      issues.push({
        id: `projectile-speed-${row.id}`,
        severity: "error",
        title: "Launch speed cannot be zero or negative",
        detail: "Check whether launch speed is recorded in meters per second."
      });
    }

    if (Number.isFinite(angle) && Number.isFinite(speed) && Number.isFinite(range) && speed > 0) {
      const expectedRange = (speed ** 2 * Math.sin((2 * angle * Math.PI) / 180)) / gravity;
      const relativeError = Math.abs(range - expectedRange) / Math.max(expectedRange, 0.1);

      if (relativeError > 0.35) {
        issues.push({
          id: `projectile-outlier-${row.id}`,
          severity: "warning",
          title: "Measured range is far from the simple model",
          detail: `At ${angle} degrees and ${speed} m/s, level-ground range is roughly ${expectedRange.toFixed(1)} m. Your table says ${range} m.`
        });
      }
    }
  }

  return issues;
}

function evaluateReactionRateRows(rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];
  const numericRows = rows
    .map((row) => ({ temp: Number(row.tempC), time: Number(row.reactionTimeS), rate: Number(row.ratePerS), id: row.id }))
    .filter((row) => Number.isFinite(row.temp) && Number.isFinite(row.time) && Number.isFinite(row.rate))
    .sort((a, b) => a.temp - b.temp);

  for (const row of numericRows) {
    if (row.time <= 0 || row.rate <= 0) {
      issues.push({
        id: `reaction-nonpositive-${row.id}`,
        severity: "error",
        title: "Reaction values must be positive",
        detail: "Reaction time and calculated rate should be greater than zero."
      });
    }
  }

  const rateDrops = numericRows.filter((row, index) => index > 0 && row.rate < numericRows[index - 1].rate * 0.85);
  if (rateDrops.length > 0) {
    issues.push({
      id: "reaction-rate-trend",
      severity: "warning",
      title: "Rate trend does not match the expected temperature pattern",
      detail: "For this demo, reaction rate should generally increase as temperature rises if concentration and amounts stay controlled."
    });
  }

  return issues;
}

function evaluateEnzymeRows(rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];
  const numericRows = rows
    .map((row) => ({ temp: Number(row.tempC), activity: Number(row.activity), id: row.id }))
    .filter((row) => Number.isFinite(row.temp) && Number.isFinite(row.activity));

  for (const row of numericRows) {
    if (row.activity < 0 || row.activity > 120) {
      issues.push({
        id: `enzyme-activity-range-${row.id}`,
        severity: "warning",
        title: "Activity value looks outside a normal relative scale",
        detail: "Relative enzyme activity is usually recorded from 0 to 100 percent in this classroom-style setup."
      });
    }
  }

  const peak = numericRows.reduce((best, row) => (row.activity > best.activity ? row : best), numericRows[0]);
  if (peak && (peak.temp < 25 || peak.temp > 45)) {
    issues.push({
      id: "enzyme-peak-temperature",
      severity: "warning",
      title: "Peak activity is not near the expected warm optimum",
      detail: "Many school enzyme demos peak around warm room/body-temperature conditions, then drop after overheating."
    });
  }

  return issues;
}

function evaluateTurbidityRows(rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];
  const turbidity = rows.map((row) => Number(row.turbidityNTU)).filter(Number.isFinite);

  if (turbidity.some((value) => value < 0)) {
    issues.push({
      id: "turbidity-negative",
      severity: "error",
      title: "Turbidity cannot be negative",
      detail: "Check the units or entry for the negative turbidity value."
    });
  }

  if (turbidity.length >= 2 && turbidity[turbidity.length - 1] >= turbidity[0]) {
    issues.push({
      id: "turbidity-not-improved",
      severity: "warning",
      title: "Final sample is not less turbid than the starting sample",
      detail: "A successful filtration trial should generally reduce turbidity from the original water sample."
    });
  }

  return issues;
}

function detectIntegrityRisk(description: string): Issue[] {
  const normalized = description.toLowerCase();
  const asksForReport = ["write my lab report", "write the lab report", "write my conclusion", "do my conclusion", "complete my report"].some((phrase) =>
    normalized.includes(phrase)
  );

  if (!asksForReport) return [];

  return [
    {
      id: "integrity-report-request",
      severity: "warning",
      title: "Ouija will not write the report for you",
      detail: "It can explain the experiment, check your data, and ask reasoning questions, but the final claim needs to be yours."
    }
  ];
}

function buildHints(template: ExperimentTemplate, issues: Issue[]): string[] {
  const hints = [
    `Check whether your independent variable is really ${template.variables[0]}.`,
    `Before writing a conclusion, point to one graph feature that supports your reasoning.`
  ];

  if (issues.some((issue) => issue.title.includes("unit") || issue.title.includes("number"))) {
    hints.unshift("Circle every unit in the table and make sure each column uses one unit consistently.");
  }

  if (issues.some((issue) => issue.severity === "warning")) {
    hints.push("If a point does not match the expected pattern, ask whether it is a real result or a measurement/procedure issue.");
  }

  return Array.from(new Set([...hints, ...template.commonMistakes.slice(0, 2).map((mistake) => `Watch for this: ${mistake}`)]));
}
