import { buildStudentReflectionWorkspace } from "./studentReflectionWorkspace";
import { buildConceptMasteryCheck } from "./conceptMasteryCheck";
import type { AnalyzeResult, StudentDataRow, StudentReflectionAnswers } from "./types";

export function buildEvidencePacket(
  result: AnalyzeResult,
  rows: StudentDataRow[],
  description: string,
  reflectionAnswers: StudentReflectionAnswers = {}
): string {
  const warnings = result.issues.filter((issue) => issue.severity !== "info");
  const dataTable = formatDataTable(result, rows);
  const sourceList = result.sources.map((source) => `- ${source.publisher}: ${source.title} (${source.url})`).join("\n");
  const reflectionWorkspace = buildStudentReflectionWorkspace(result.learningExitTicket, reflectionAnswers);
  const conceptMasteryCheck = buildConceptMasteryCheck(result, {});
  const issueList =
    warnings.length > 0
      ? warnings.map((issue) => `- ${issue.title}: ${issue.detail}`).join("\n")
      : "- No blocking warnings detected by Ouija.";

  return [
    `# Ouija Evidence Packet: ${result.classification.title}`,
    "",
    "## Student Description",
    description.trim(),
    "",
    "## Variables",
    `- Independent variable: ${formatColumnLabel(result, result.expectedResult.xKey)}`,
    `- Dependent variable: ${formatColumnLabel(result, result.expectedResult.yKey)}`,
    `- Concepts: ${result.classification.concepts.join(", ")}`,
    "",
    "## Expected Pattern",
    result.expectedResult.summary,
    "",
    "## Grounding Audit",
    `- Score: ${result.groundingAudit.score}/100 (${formatGroundingAuditStatus(result.groundingAudit.status)})`,
    `- Summary: ${result.groundingAudit.summary}`,
    `- Consensus: ${result.groundingAudit.consensus}`,
    `- Student source task: ${result.groundingAudit.studentTask}`,
    "- Checks:",
    ...result.groundingAudit.checks.map((check) => `  - ${check.label} (${formatGroundingCheckStatus(check.status)}): ${check.detail}`),
    "",
    "## Expected Overlay",
    `- Summary: ${result.expectedComparison.summary}`,
    "- Row comparison:",
    ...result.expectedComparison.points
      .slice(0, 6)
      .map(
        (point) =>
          `  - ${point.label}: observed ${formatNullableNumber(point.observedY)}, expected ${formatNullableNumber(point.expectedY)}, difference ${formatNullableNumber(point.delta)} - ${point.note}`
      ),
    "",
    "## Model Strategy",
    `- Decision: ${result.modelStrategy.decisionSummary}`,
    `- Classifier: ${result.modelStrategy.classifier}`,
    `- Grounding mode: ${result.modelStrategy.groundingMode === "web_enriched" ? "web enriched" : "trusted fallback"}`,
    "- Top candidates:",
    ...result.modelStrategy.candidates
      .slice(0, 3)
      .map((candidate) => `  - ${candidate.title}: ${Math.round(candidate.confidence * 100)}% confidence, score ${candidate.score}, evidence ${candidate.evidence.join(", ") || "none"}`),
    "- Controls:",
    ...result.modelStrategy.riskControls.slice(0, 3).map((control) => `  - ${control}`),
    "",
    "## Technical Depth Proof",
    "- Beyond simple API use:",
    `  - Decision trace: ${result.modelStrategy.candidates.length} candidates ranked; selected ${result.classification.title}.`,
    `  - Evaluation harness: ${result.aiEvaluationHarness.score}/100 across ${result.aiEvaluationHarness.checks.length} model-behavior checks plus the public 9-case suite.`,
    `  - Grounding quality: ${result.groundingAudit.score}/100 with ${result.sources.length} visible citation${result.sources.length === 1 ? "" : "s"} and mixed-evidence checks.`,
    `  - Pattern engine: ${result.patternEvidence.score}/100 with ${result.expectedComparison.points.filter((point) => point.expectedY !== null).length} expected-overlay points.`,
    `  - Privacy and integrity: ${result.dataHandlingLedger.score}/100 with server-only keys, local saved labs, blank claim starters, and consent-gated MCP packets.`,
    "- Boundary: deterministic fallback keeps the demo inspectable without credentials; OpenAI web search can enrich citations server-side when configured.",
    "",
    "## AI Evaluation Harness",
    `- Score: ${result.aiEvaluationHarness.score}/100 (${formatAiEvaluationStatus(result.aiEvaluationHarness.status)})`,
    `- Summary: ${result.aiEvaluationHarness.summary}`,
    `- Coverage: ${result.aiEvaluationHarness.coverage}`,
    `- Judge signal: ${result.aiEvaluationHarness.judgeSignal}`,
    `- Failure mode: ${result.aiEvaluationHarness.failureMode}`,
    "- Checks:",
    ...result.aiEvaluationHarness.checks.map((check) => `  - ${check.label}: ${check.score}/100 (${formatAiEvaluationCheckStatus(check.status)}) - ${check.detail}`),
    "",
    "## Data Handling Ledger",
    `- Privacy score: ${result.dataHandlingLedger.score}/100 (${formatDataHandlingStatus(result.dataHandlingLedger.status)})`,
    `- Summary: ${result.dataHandlingLedger.summary}`,
    `- Judge takeaway: ${result.dataHandlingLedger.judgeTakeaway}`,
    "- Data flows:",
    ...result.dataHandlingLedger.flows.map(
      (flow) =>
        `  - ${flow.label}: ${flow.purpose} Storage: ${flow.storage} Retention: ${flow.retention} Student control: ${flow.studentControl}`
    ),
    "- Safeguards:",
    ...result.dataHandlingLedger.safeguards.map((safeguard) => `  - ${safeguard}`),
    "- Student rights:",
    ...result.dataHandlingLedger.studentRights.map((right) => `  - ${right}`),
    "",
    "## Judge Demo Path",
    `- Status: ${formatJudgeDemoStatus(result.judgeDemoPath.status)}`,
    `- Headline: ${result.judgeDemoPath.headline}`,
    `- Summary: ${result.judgeDemoPath.summary}`,
    `- Next best action: ${result.judgeDemoPath.nextBestAction}`,
    "- Steps:",
    ...result.judgeDemoPath.steps.map(
      (step) =>
        `  - ${step.label} (${formatJudgeDemoStepStatus(step.status)}): ${step.criterion} - ${step.proof} Demo action: ${step.demoAction}`
    ),
    "",
    "## Custom Lab Triage",
    `- Status: ${formatCustomLabTriageStatus(result.customLabTriage.status)}`,
    `- Focus: ${result.customLabTriage.inferredFocus}`,
    `- Summary: ${result.customLabTriage.summary}`,
    `- Next action: ${result.customLabTriage.studentNextAction}`,
    `- Safety boundary: ${result.customLabTriage.safetyBoundary}`,
    "- Variable plan:",
    `  - Independent variable: ${result.customLabTriage.planner.independentVariable}`,
    `  - Dependent variable: ${result.customLabTriage.planner.dependentVariable}`,
    `  - Controls: ${result.customLabTriage.planner.controlVariables.join(", ")}`,
    `  - Repeat plan: ${result.customLabTriage.planner.repeatPlan}`,
    `  - Hypothesis starter: ${result.customLabTriage.planner.hypothesisStarter}`,
    "- Pattern Archetype Coach:",
    `  - Archetype: ${result.customLabTriage.patternArchetype.label} (${result.customLabTriage.patternArchetype.confidence} confidence)`,
    `  - Expected pattern: ${result.customLabTriage.patternArchetype.expectedPattern}`,
    `  - Graph suggestion: ${result.customLabTriage.patternArchetype.graphSuggestion}`,
    `  - Axes: ${result.customLabTriage.patternArchetype.xAxis} to ${result.customLabTriage.patternArchetype.yAxis}`,
    `  - Source question: ${result.customLabTriage.patternArchetype.sourceQuestion}`,
    `  - Student check: ${result.customLabTriage.patternArchetype.studentCheck}`,
    "- Suggested columns:",
    ...result.customLabTriage.suggestedColumns.map(
      (column) => `  - ${column.label}${column.unit ? ` (${column.unit})` : ""}: ${column.numeric ? "number" : "text"}`
    ),
    "- Starter worksheet:",
    ...result.customLabTriage.planner.starterRows.map(
      (row) =>
        `  - ${String(row.condition ?? "Condition")}: measurement ${String(row.measurement ?? "") || "___"}, trial ${String(row.trial ?? "___")}, notes ${String(row.notes ?? "") || "___"}`
    ),
    "- Quality checklist:",
    ...result.customLabTriage.planner.qualityChecklist.map((item) => `  - ${item}`),
    "- Source searches:",
    ...result.customLabTriage.sourceSearches.map((query) => `  - ${query}`),
    "- Clarifying questions:",
    ...result.customLabTriage.clarifyingQuestions.map((question) => `  - ${question}`),
    "",
    "## Pre-Lab Design Coach",
    `- Status: ${formatPreLabStatus(result.preLabDesignCoach.status)}`,
    `- Summary: ${result.preLabDesignCoach.summary}`,
    "- Variable plan:",
    `  - Independent variable: ${result.preLabDesignCoach.variablePlan.independentVariable}`,
    `  - Dependent variable: ${result.preLabDesignCoach.variablePlan.dependentVariable}`,
    `  - Controls: ${result.preLabDesignCoach.variablePlan.controlVariables.join(", ")}`,
    `  - Repeat plan: ${result.preLabDesignCoach.repeatPlan}`,
    `  - Hypothesis starter: ${result.preLabDesignCoach.hypothesisStarter}`,
    `- Source task: ${result.preLabDesignCoach.sourceTask}`,
    `- Safety gate: ${result.preLabDesignCoach.safetyGate}`,
    "- Setup checks:",
    ...result.preLabDesignCoach.setupChecks.map((check) => `  - ${check.label} (${check.status}): ${check.detail}`),
    "- Table plan:",
    ...result.preLabDesignCoach.tablePlan.map(
      (column) => `  - ${column.label}${column.unit ? ` (${column.unit})` : ""}: ${column.numeric ? "number" : "text"}`
    ),
    `- Student next action: ${result.preLabDesignCoach.studentNextAction}`,
    `- Judge takeaway: ${result.preLabDesignCoach.judgeTakeaway}`,
    "",
    "## AIYES Rubric Fit",
    `- Score: ${result.officialRubricFit.score}/100`,
    `- Verdict: ${result.officialRubricFit.verdict}`,
    ...result.officialRubricFit.criteria.flatMap((criterion) => [
      `- ${criterion.label} (${criterion.status}): ${criterion.judgeTakeaway}`,
      ...criterion.evidence.slice(0, 3).map((evidence) => `  - ${evidence}`)
    ]),
    "",
    "## AIYES Values Fit",
    `- Score: ${result.aiyesValuesFit.score}/100 (${formatAiyesValueStatus(result.aiyesValuesFit.status)})`,
    `- Summary: ${result.aiyesValuesFit.summary}`,
    `- Judge takeaway: ${result.aiyesValuesFit.judgeTakeaway}`,
    "- Values:",
    ...result.aiyesValuesFit.values.flatMap((value) => [
      `  - ${value.label} (${formatAiyesValueStatus(value.status)}): ${value.evidence}`,
      `    - Student action: ${value.studentAction}`
    ]),
    "",
    "## AIYES Development Journey",
    `- Score: ${result.developmentJourney.score}/100 (${formatAiyesValueStatus(result.developmentJourney.status)})`,
    `- Summary: ${result.developmentJourney.summary}`,
    `- Slide cue: ${result.developmentJourney.slideCue}`,
    `- Video cue: ${result.developmentJourney.videoCue}`,
    "- Stages:",
    ...result.developmentJourney.stages.flatMap((stage) => [
      `  - ${stage.label} (${formatAiyesValueStatus(stage.status)}): ${stage.evidence}`,
      `    - Judge cue: ${stage.judgeCue}`
    ]),
    "",
    "## Learning Impact Loop",
    `- Score: ${result.impactSnapshot.score}/100`,
    `- Headline: ${result.impactSnapshot.headline}`,
    `- Student outcome: ${result.impactSnapshot.studentOutcome}`,
    "- Metrics:",
    ...result.impactSnapshot.metrics.map((metric) => `  - ${metric.label}: ${metric.value} (${metric.status}) - ${metric.detail}`),
    "- Evidence loop:",
    ...result.impactSnapshot.evidenceLoop.map((step) => `  - ${step}`),
    "",
    "## Student Pilot Study Kit",
    `- Status: ${result.studentPilotStudyKit.status.replaceAll("_", " ")}`,
    `- Summary: ${result.studentPilotStudyKit.summary}`,
    `- Target student: ${result.studentPilotStudyKit.targetStudent}`,
    `- Consent boundary: ${result.studentPilotStudyKit.consentBoundary}`,
    `- Pre prompt: ${result.studentPilotStudyKit.prePrompt}`,
    `- Post prompt: ${result.studentPilotStudyKit.postPrompt}`,
    "- Pilot tasks:",
    ...result.studentPilotStudyKit.tasks.map(
      (task) => `  - ${task.label}: ${task.instruction} Success signal: ${task.successSignal}`
    ),
    "- Pilot metrics:",
    ...result.studentPilotStudyKit.metrics.map(
      (metric) => `  - ${metric.label}: ${metric.target} (${metric.status.replaceAll("_", " ")}) - ${metric.detail}`
    ),
    "- Observer checklist:",
    ...result.studentPilotStudyKit.observerChecklist.map((item) => `  - ${item}`),
    "- Evidence to collect:",
    ...result.studentPilotStudyKit.evidenceToCollect.map((item) => `  - ${item}`),
    `- Judge takeaway: ${result.studentPilotStudyKit.judgeTakeaway}`,
    "",
    "## Learning Exit Ticket",
    `- Status: ${formatLearningExitTicketStatus(result.learningExitTicket.status)}`,
    `- Summary: ${result.learningExitTicket.summary}`,
    `- Judge takeaway: ${result.learningExitTicket.judgeTakeaway}`,
    "- Prompts:",
    ...result.learningExitTicket.prompts.flatMap((prompt) => [
      `  - ${prompt.label}`,
      `    - Exit ticket prompt: ${prompt.studentPrompt}`,
      `    - Evidence to use: ${prompt.evidenceToUse}`,
      `    - Teacher signal: ${prompt.teacherSignal}`
    ]),
    `- Integrity boundary: ${result.learningExitTicket.integrityBoundary}`,
    "",
    "## Student Reflection Drafts",
    `- Reflection status: ${formatStudentReflectionStatus(reflectionWorkspace.status)}`,
    `- Summary: ${reflectionWorkspace.summary}`,
    `- Integrity boundary: ${reflectionWorkspace.integrityBoundary}`,
    "- Drafts:",
    ...reflectionWorkspace.entries.flatMap((entry) => [
      `  - ${entry.label}: Student draft: ${entry.answer || "No student reflection draft entered yet."}`,
      `    - Word count: ${entry.wordCount}`,
      `    - Evidence to use: ${entry.evidenceToUse}`,
      `    - Teacher signal: ${entry.teacherSignal}`
    ]),
    `- Teacher takeaway: ${reflectionWorkspace.teacherTakeaway}`,
    "",
    "## Student Level Lens",
    "- Middle school support: name what changed, name what was measured, read the graph pattern, and choose one safe next step.",
    "- High school support: quantify the relationship, check controls and repeats, and explain uncertainty from the data.",
    `- Graph focus: ${formatColumnLabel(result, result.expectedResult.xKey)} vs ${formatColumnLabel(result, result.expectedResult.yKey)}`,
    "- Integrity boundary: sentence starters keep blanks so the student writes the actual claim.",
    "",
    "## Concept Mastery Check",
    `- Purpose: ${conceptMasteryCheck.summary}`,
    "- Checks:",
    ...conceptMasteryCheck.questions.map((question) => `  - ${question.label}: ${question.prompt}`),
    "- Boundary: students answer these checks themselves before copying evidence into a final claim.",
    "",
    "## Pattern Evidence",
    `- Pattern score: ${result.patternEvidence.score}/100 (${formatPatternEvidenceStatus(result.patternEvidence.status)})`,
    `- Summary: ${result.patternEvidence.summary}`,
    `- Method: ${result.patternEvidence.method}`,
    "- Observations:",
    ...result.patternEvidence.observations.map(
      (observation) =>
        `  - ${observation.label} (${formatPatternObservationStatus(observation.status)}): expected ${observation.expected} Observed ${observation.observed} ${observation.detail}`
    ),
    `- Student question: ${result.patternEvidence.studentQuestion}`,
    "",
    "## Guided Lab Flow",
    `- Current action: ${result.guidedFlow.currentAction}`,
    ...result.guidedFlow.steps.map((step) => `- ${formatFlowStatus(step.status)}: ${step.label} - ${step.detail}`),
    "",
    "## Concept Coach",
    ...result.conceptCoach.vocabulary.map((item) => `- ${item.term}: ${item.definition}`),
    `- Misconception check: ${result.conceptCoach.misconceptionChecks[0]?.misconception ?? "None"} ${result.conceptCoach.misconceptionChecks[0]?.correction ?? ""}`,
    `- Source task: ${result.conceptCoach.sourceTask}`,
    "",
    "## Safety Coach",
    `- Status: ${formatSafetyStatus(result.safetyCoach.status)}`,
    `- Summary: ${result.safetyCoach.summary}`,
    ...result.safetyCoach.checks.map((check) => `- ${check.required ? "Required" : "Recommended"}: ${check.label} - ${check.detail}`),
    `- Stop condition: ${result.safetyCoach.stopCondition}`,
    `- Cleanup: ${result.safetyCoach.cleanup}`,
    `- Teacher check: ${result.safetyCoach.teacherCheck}`,
    "",
    "## Reliability Coach",
    `- Status: ${formatReliabilityStatus(result.reliabilityCoach.status)} (${result.reliabilityCoach.score}/100)`,
    `- Summary: ${result.reliabilityCoach.summary}`,
    `- Recommendation: ${result.reliabilityCoach.recommendation}`,
    "- Repeat groups:",
    ...result.reliabilityCoach.repeatGroups
      .slice(0, 5)
      .map(
        (group) =>
          `  - ${group.label}: ${group.count} trial${group.count === 1 ? "" : "s"}, average ${formatNullableNumber(group.average)}, spread ${formatNullableNumber(group.spread)} - ${group.note}`
      ),
    `- Student question: ${result.reliabilityCoach.studentQuestion}`,
    "",
    "## Student Data",
    dataTable,
    "",
    "## Data And Method Checks",
    `- Method audit: ${result.methodAudit.score}/100 (${formatAuditStatus(result.methodAudit.status)})`,
    issueList,
    "",
    "## Next Trial Plan",
    `- Priority: ${result.nextTrialPlan.priority}`,
    `- Next measurement: ${result.nextTrialPlan.nextMeasurement}`,
    `- Control to tighten: ${result.nextTrialPlan.controlToTighten}`,
    `- Why it matters: ${result.nextTrialPlan.whyItMatters}`,
    `- Safety reminder: ${result.nextTrialPlan.safetyReminder}`,
    "",
    "## Sources",
    sourceList,
    "",
    "## Claim Starter",
    result.labBrief.claimStarter,
    "",
    "## Next Reasoning Question",
    result.labBrief.nextQuestion,
    "",
    "## Integrity Boundary",
    "Use this packet to write your own conclusion. Ouija does not write the final lab report."
  ].join("\n");
}

function formatDataTable(result: AnalyzeResult, rows: StudentDataRow[]): string {
  const header = result.columns.map((column) => formatColumnLabel(result, column.key));
  const body = rows.map((row) => result.columns.map((column) => String(row[column.key] ?? "")));
  const lines = [header, header.map(() => "---"), ...body];

  return lines.map((line) => `| ${line.join(" | ")} |`).join("\n");
}

function formatStudentReflectionStatus(status: ReturnType<typeof buildStudentReflectionWorkspace>["status"]) {
  if (status === "ready_for_review") return "ready for review";
  if (status === "not_started") return "not started";
  return "drafting";
}

function formatColumnLabel(result: AnalyzeResult, key: string): string {
  const column = result.columns.find((candidate) => candidate.key === key);
  if (!column) return key;
  return column.unit ? `${column.label} (${column.unit})` : column.label;
}

function formatAuditStatus(status: AnalyzeResult["methodAudit"]["status"]): string {
  if (status === "blocked") return "blocked";
  if (status === "needs_review") return "needs review";
  return "strong";
}

function formatSafetyStatus(status: AnalyzeResult["safetyCoach"]["status"]): string {
  if (status === "do_not_run") return "do not run yet";
  if (status === "adult_review") return "adult review";
  return "classroom ready";
}

function formatReliabilityStatus(status: AnalyzeResult["reliabilityCoach"]["status"]): string {
  if (status === "blocked") return "blocked";
  if (status === "review_spread") return "review spread";
  if (status === "needs_repeats") return "needs repeats";
  return "strong";
}

function formatPatternEvidenceStatus(status: AnalyzeResult["patternEvidence"]["status"]): string {
  if (status === "supports_expected") return "supports expected";
  if (status === "contradicts") return "contradicts";
  if (status === "insufficient") return "needs data";
  return "mixed evidence";
}

function formatPatternObservationStatus(status: AnalyzeResult["patternEvidence"]["observations"][number]["status"]): string {
  if (status === "supports") return "supports";
  if (status === "contradicts") return "contradicts";
  if (status === "insufficient") return "needs data";
  return "mixed";
}

function formatGroundingAuditStatus(status: AnalyzeResult["groundingAudit"]["status"]): string {
  if (status === "source_backed") return "source backed";
  if (status === "mixed_evidence") return "mixed evidence";
  return "needs source review";
}

function formatGroundingCheckStatus(status: AnalyzeResult["groundingAudit"]["checks"][number]["status"]): string {
  if (status === "verified") return "verified";
  if (status === "mixed") return "mixed";
  return "review";
}

function formatAiEvaluationStatus(status: AnalyzeResult["aiEvaluationHarness"]["status"]): string {
  if (status === "validated") return "validated";
  if (status === "blocked") return "blocked";
  return "review";
}

function formatDataHandlingStatus(status: AnalyzeResult["dataHandlingLedger"]["status"]): string {
  return status === "privacy_preserving" ? "privacy preserving" : "review";
}

function formatAiyesValueStatus(status: AnalyzeResult["aiyesValuesFit"]["status"]): string {
  if (status === "strong") return "strong";
  if (status === "ready") return "ready";
  return "review";
}

function formatLearningExitTicketStatus(status: AnalyzeResult["learningExitTicket"]["status"]): string {
  if (status === "blocked") return "blocked";
  if (status === "review") return "review first";
  return "ready";
}

function formatAiEvaluationCheckStatus(status: AnalyzeResult["aiEvaluationHarness"]["checks"][number]["status"]): string {
  if (status === "pass") return "pass";
  if (status === "fail") return "fail";
  return "review";
}

function formatJudgeDemoStatus(status: AnalyzeResult["judgeDemoPath"]["status"]): string {
  if (status === "ready") return "ready";
  if (status === "blocked") return "blocked";
  return "review";
}

function formatJudgeDemoStepStatus(status: AnalyzeResult["judgeDemoPath"]["steps"][number]["status"]): string {
  if (status === "show") return "show";
  if (status === "blocked") return "blocked";
  return "review";
}

function formatCustomLabTriageStatus(status: AnalyzeResult["customLabTriage"]["status"]): string {
  if (status === "supported_template") return "supported template";
  return "needs student details";
}

function formatPreLabStatus(status: AnalyzeResult["preLabDesignCoach"]["status"]): string {
  if (status === "blocked") return "blocked";
  if (status === "needs_teacher_review") return "needs teacher review";
  return "ready to plan";
}

function formatNullableNumber(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "n/a";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function formatFlowStatus(status: AnalyzeResult["guidedFlow"]["steps"][number]["status"]): string {
  if (status === "done") return "Done";
  if (status === "blocked") return "Blocked";
  if (status === "review") return "Review";
  return "Next";
}
