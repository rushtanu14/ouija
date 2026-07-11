import { describe, expect, it } from "vitest";
import { analyzeExperiment, evaluateRows, matchExperiment, refreshResultForRows } from "../src/lib/analysis";

describe("experiment matching", () => {
  it("identifies the supported middle/high school experiment types", () => {
    expect(matchExperiment("launch a ball at different angles and measure range").template.id).toBe("projectile-motion");
    expect(matchExperiment("pendulum string length and period of each swing").template.id).toBe("pendulum-period-length");
    expect(matchExperiment("simple circuit measuring current voltage and resistance").template.id).toBe("ohms-law-circuits");
    expect(matchExperiment("temperature changes reaction rate for a tablet").template.id).toBe("reaction-rate-temperature");
    expect(matchExperiment("enzyme catalase activity at different temperatures").template.id).toBe("enzyme-activity-temperature");
    expect(matchExperiment("bean seedlings under red blue green and white light measured for plant height").template.id).toBe("plant-growth-light-color");
    expect(matchExperiment("density layering with corn syrup water and oil").template.id).toBe("density-layering");
    expect(matchExperiment("water filtration turbidity before and after charcoal").template.id).toBe("water-filtration-turbidity");
  });
});

describe("fallback analysis", () => {
  it("returns usable expected results, columns, sources, and hints without credentials", () => {
    const result = analyzeExperiment({
      description: "We launched a ball at angles and measured range."
    });

    expect(result.classification.title).toBe("Projectile Motion");
    expect(result.expectedResult.summary).toContain("45 degrees");
    expect(result.columns.map((column) => column.key)).toContain("rangeM");
    expect(result.sources[0].url).toMatch(/^https:\/\//);
    expect(result.hints.length).toBeGreaterThan(0);
    expect(result.guidedFlow.currentAction).toContain("Write your own claim");
    expect(result.guidedFlow.steps.map((step) => step.id)).toEqual(["identify", "prepare", "understand", "check-data", "plan", "claim"]);
    expect(result.guidedFlow.steps.some((step) => step.id === "claim" && step.status === "next")).toBe(true);
    expect(result.modelStrategy.selectedTemplateId).toBe("projectile-motion");
    expect(result.modelStrategy.candidates).toHaveLength(8);
    expect(result.modelStrategy.candidates[0].evidence).toContain("launch");
    expect(result.modelStrategy.riskControls.some((control) => control.includes("Low-confidence"))).toBe(true);
    expect(result.conceptCoach.level).toBe("middle_high_school");
    expect(result.conceptCoach.vocabulary.some((item) => item.term === "range")).toBe(true);
    expect(result.conceptCoach.misconceptionChecks[0].checkQuestion).toContain("your data");
    expect(result.safetyCoach.status).toBe("classroom_ready");
    expect(result.safetyCoach.checks.some((item) => item.id === "clear-path" && item.required)).toBe(true);
    expect(result.safetyCoach.stopCondition).toContain("Stop");
    expect(result.groundingStatus.mode).toBe("fallback");
    expect(result.dataHandlingLedger.status).toBe("privacy_preserving");
    expect(result.dataHandlingLedger.score).toBeGreaterThanOrEqual(90);
    expect(result.dataHandlingLedger.flows.map((flow) => flow.id)).toEqual([
      "description",
      "table-data",
      "local-snapshot",
      "grounding-sources",
      "server-api-key"
    ]);
    expect(result.dataHandlingLedger.flows.some((flow) => flow.label === "Student data" && flow.storage.includes("Browser"))).toBe(true);
    expect(result.dataHandlingLedger.safeguards).toContain("API key stays server-side; the browser never receives OPENAI_API_KEY.");
    expect(result.dataHandlingLedger.studentRights).toContain("Students can clear saved labs from Settings.");
    expect(result.dataHandlingLedger.judgeTakeaway).toContain("privacy-preserving");
    expect(result.groundingAudit.status).toBe("source_backed");
    expect(result.groundingAudit.score).toBeGreaterThanOrEqual(90);
    expect(result.groundingAudit.checks.some((check) => check.id === "visible-citations" && check.status === "verified")).toBe(true);
    expect(result.modelStrategy.signals.some((signal) => signal.label === "Grounding audit")).toBe(true);
    expect(result.aiEvaluationHarness.status).toBe("review");
    expect(result.aiEvaluationHarness.score).toBeGreaterThanOrEqual(85);
    expect(result.aiEvaluationHarness.coverage).toContain("Eight supported");
    expect(result.aiEvaluationHarness.checks.map((check) => check.id)).toEqual([
      "classification-confidence",
      "coverage-benchmark",
      "source-grounding",
      "pattern-validation",
      "repeat-reliability",
      "row-validator",
      "safety-integrity",
      "fallback-boundary"
    ]);
    expect(result.aiEvaluationHarness.checks.some((check) => check.id === "source-grounding" && check.status === "pass")).toBe(true);
    expect(result.aiEvaluationHarness.checks.some((check) => check.id === "repeat-reliability" && check.status === "review")).toBe(true);
    expect(result.judgeDemoPath.status).toBe("ready");
    expect(result.judgeDemoPath.steps.map((step) => step.id)).toEqual([
      "problem",
      "ai-design",
      "student-workflow",
      "evidence-handoff",
      "submission-proof"
    ]);
    expect(result.judgeDemoPath.nextBestAction).toContain("Model Strategy");
    expect(result.classification.matchQuality).toBe("supported_template");
    expect(result.customLabTriage.patternArchetype.id).toBe("supported_template");
    expect(result.customLabTriage.patternArchetype.graphSuggestion).toContain("Angle");
    expect(result.labBrief.claimStarter).toContain("___");
    expect(result.labBrief.evidenceChecklist.some((item) => item.id === "source-grounding" && item.complete)).toBe(true);
    expect(result.methodAudit.score).toBeGreaterThan(80);
    expect(result.methodAudit.independentVariable).toBe("Angle (deg)");
    expect(result.methodAudit.controlVariables).toContain("launch speed");
    expect(result.expectedComparison.summary).toContain("Dashed expected overlay");
    expect(result.expectedComparison.points).toHaveLength(result.rows.length);
    expect(result.expectedComparison.points.every((point) => point.expectedY !== null)).toBe(true);
    expect(result.nextTrialPlan.status).toBe("ready_to_extend");
    expect(result.nextTrialPlan.nextMeasurement).toContain("45");
    expect(result.nextTrialPlan.checklist.some((item) => item.id === "safety" && item.complete)).toBe(true);
    expect(result.reliabilityCoach.status).toBe("needs_repeats");
    expect(result.reliabilityCoach.summary).toContain("repeat");
    expect(result.reliabilityCoach.repeatGroups.length).toBeGreaterThan(0);
    expect(result.patternEvidence.status).toBe("supports_expected");
    expect(result.patternEvidence.score).toBeGreaterThanOrEqual(85);
    expect(result.patternEvidence.observations.length).toBeGreaterThan(0);
    expect(result.modelStrategy.signals.some((signal) => signal.label === "Pattern evidence")).toBe(true);
    expect(result.impactSnapshot.score).toBeGreaterThanOrEqual(90);
    expect(result.impactSnapshot.metrics.map((metric) => metric.id)).toEqual([
      "student-outcome",
      "data-quality",
      "concept-learning",
      "integrity",
      "pattern-evidence",
      "repeat-reliability",
      "next-trial"
    ]);
    expect(result.impactSnapshot.evidenceLoop).toHaveLength(5);
    expect(result.impactSnapshot.studentOutcome).toContain("student");
    expect(result.studentPilotStudyKit.status).toBe("ready_to_pilot");
    expect(result.studentPilotStudyKit.summary).toContain("10-minute student pilot");
    expect(result.studentPilotStudyKit.consentBoundary).toContain("No names");
    expect(result.studentPilotStudyKit.tasks.map((task) => task.id)).toEqual(["classify", "graph-check", "reflect"]);
    expect(result.studentPilotStudyKit.metrics.map((metric) => metric.id)).toEqual([
      "time-to-graph",
      "data-fix",
      "reflection-readiness",
      "integrity-boundary"
    ]);
    expect(result.studentPilotStudyKit.evidenceToCollect).toContain("Time to first graph");
    expect((result as any).learningExitTicket.status).toBe("ready");
    expect((result as any).learningExitTicket.summary).toContain("exit ticket");
    expect((result as any).learningExitTicket.prompts).toHaveLength(3);
    expect((result as any).learningExitTicket.prompts.map((prompt: { id: string }) => prompt.id)).toEqual([
      "variable-check",
      "pattern-check",
      "next-step-check"
    ]);
    expect((result as any).learningExitTicket.prompts[0].studentPrompt).toContain("independent variable");
    expect((result as any).learningExitTicket.prompts[1].evidenceToUse).toContain("Expected overlay");
    expect((result as any).learningExitTicket.prompts[2].teacherSignal).toContain("repeat");
    expect(result.officialRubricFit.score).toBeGreaterThanOrEqual(90);
    expect(result.officialRubricFit.criteria.map((criterion) => criterion.id)).toEqual([
      "problem-real-world",
      "ai-design-model-strategy",
      "ux-design"
    ]);
    expect(result.officialRubricFit.criteria.every((criterion) => criterion.evidence.length >= 3)).toBe(true);
    expect(result.officialRubricFit.criteria.some((criterion) => criterion.evidence.some((evidence) => evidence.includes("Grounding Audit")))).toBe(true);
    expect(result.officialRubricFit.criteria.some((criterion) => criterion.evidence.some((evidence) => evidence.includes("AI Evaluation Harness")))).toBe(true);
    expect(result.officialRubricFit.criteria.some((criterion) => criterion.evidence.some((evidence) => evidence.includes("Judge Demo Path")))).toBe(true);
    expect(result.officialRubricFit.criteria.some((criterion) => criterion.evidence.some((evidence) => evidence.includes("Data Handling Ledger")))).toBe(true);
    expect(result.officialRubricFit.criteria.some((criterion) => criterion.label === "AI Technical Design and Model Strategy" && criterion.status === "strong")).toBe(true);
    expect(result.aiyesValuesFit.score).toBeGreaterThanOrEqual(90);
    expect(result.aiyesValuesFit.values.map((value) => value.id)).toEqual([
      "democracy",
      "diversity",
      "connectivity",
      "innovation",
      "ethics-inclusion"
    ]);
    expect(result.aiyesValuesFit.values.some((value) => value.label === "Innovation" && value.evidence.includes("AI Evaluation Harness"))).toBe(true);
    expect(result.aiyesValuesFit.values.some((value) => value.label === "Ethics and inclusion" && value.studentAction.includes("own words"))).toBe(true);
    expect(result.developmentJourney.score).toBeGreaterThanOrEqual(90);
    expect(result.developmentJourney.stages.map((stage) => stage.id)).toEqual([
      "problem",
      "data-handling",
      "model-strategy",
      "app-build",
      "testing-evaluation",
      "ux-design",
      "ethics-impact",
      "constraints-submission"
    ]);
    expect(result.developmentJourney.slideCue).toContain("slide-deck spine");
    expect(result.developmentJourney.videoCue).toContain("walkthrough spine");
    expect(result.developmentJourney.stages.some((stage) => stage.label === "Testing and evaluation" && stage.evidence.includes("Deterministic Regression Suite"))).toBe(true);
    expect(result.trackEvidence.score).toBeGreaterThanOrEqual(90);
    expect(result.trackEvidence.readiness).toBe("competitive");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("ground");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("strategy");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("evaluate");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("demo");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("plan");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("pattern");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("reliability");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("learn");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("exit-ticket");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("safety");
    expect(result.trackEvidence.pipeline.map((step) => step.id)).toContain("privacy");
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "ai-technical-design" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "source-grounding" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "model-strategy" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "ai-evaluation-harness" && criterion.status === "review")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "judge-demo-path" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "ux-design" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "adaptive-planning" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "pattern-evidence" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "repeat-reliability" && criterion.status === "review")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "learning-scaffold" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "learning-exit-ticket" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "student-pilot-study" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "safety-responsibility" && criterion.status === "checked")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "data-ethics" && criterion.status === "checked")).toBe(true);
  });

  it("supports plant growth light-color experiments as a full template", () => {
    const result = analyzeExperiment({
      description: "We grew bean seedlings under white, red, blue, green, and dark light and measured plant height after two weeks."
    });

    expect(result.templateId).toBe("plant-growth-light-color");
    expect(result.classification.matchQuality).toBe("supported_template");
    expect(result.classification.title).toBe("Plant Growth vs Light Color");
    expect(result.expectedResult.mixedEvidence).toBe(true);
    expect(result.columns.map((column) => column.key)).toEqual(["lightColor", "heightCm", "days", "trial"]);
    expect(result.sources.map((source) => source.publisher)).toEqual(["Ask A Biologist", "KidsGardening"]);
    expect(result.safetyCoach.status).toBe("adult_review");
    expect(result.conceptCoach.vocabulary.some((item) => item.term === "chlorophyll")).toBe(true);
    expect(result.preLabDesignCoach.variablePlan.independentVariable).toBe("Light Color");
    expect(result.preLabDesignCoach.variablePlan.dependentVariable).toBe("Plant Height");
    expect(result.patternEvidence.status).toBe("supports_expected");
    expect(result.patternEvidence.observations.some((observation) => observation.id === "plant-light-vs-dark")).toBe(true);
    expect(result.nextTrialPlan.controlToTighten).toContain("plant species");
    expect(result.trackEvidence.readiness).toBe("competitive");
  });

  it("explains etiolation instead of treating taller dark-grown seedlings as bad data", () => {
    const issues = evaluateRows("plant-growth-light-color", [
      { id: "light", lightColor: "White light", heightCm: 8, days: 7, trial: "1" },
      { id: "dark", lightColor: "Dark", heightCm: 12, days: 7, trial: "1" }
    ]);

    expect(issues.some((issue) => issue.id === "plant-dark-etiolation-context" && issue.severity === "info")).toBe(true);
    expect(issues.some((issue) => issue.id === "plant-light-dark-pattern")).toBe(false);
  });

  it("marks unsupported descriptions as low-confidence closest matches instead of pretending full coverage", () => {
    const result = analyzeExperiment({
      description: "We compared paper towel brands by measuring how much water each towel absorbed."
    });

    expect(result.classification.matchQuality).toBe("closest_supported");
    expect(result.classification.coverageNote).toContain("Low-confidence");
    expect(result.issues.some((issue) => issue.id === "classification-low-confidence")).toBe(true);
    expect(result.safetyCoach.status).toBe("adult_review");
    expect(result.safetyCoach.checks[0].id).toBe("adult-review");
    expect(result.guidedFlow.currentAction).toContain("Confirm this is the right experiment");
    expect(result.modelStrategy.decisionSummary).toContain("Closest supported match");
    expect(result.impactSnapshot.score).toBeLessThan(80);
    expect(result.studentPilotStudyKit.status).toBe("needs_review");
    expect(result.studentPilotStudyKit.summary).toContain("review gate");
    expect(result.studentPilotStudyKit.metrics.some((metric) => metric.id === "time-to-graph" && metric.status === "watch")).toBe(true);
    expect(result.studentPilotStudyKit.tasks[0].successSignal).toContain("closest-supported boundary");
    expect((result as any).learningExitTicket.status).toBe("review");
    expect((result as any).learningExitTicket.prompts[0].studentPrompt).toContain("closest supported");
    expect(result.impactSnapshot.metrics.some((metric) => metric.id === "student-outcome" && metric.status === "needs_action")).toBe(true);
    expect(result.officialRubricFit.score).toBeLessThan(80);
    expect(result.officialRubricFit.criteria.some((criterion) => criterion.id === "problem-real-world" && criterion.status === "review")).toBe(true);
    expect(result.aiyesValuesFit.status).toBe("ready");
    expect(result.aiyesValuesFit.values.some((value) => value.id === "diversity" && value.status === "ready")).toBe(true);
    expect(result.aiyesValuesFit.values.some((value) => value.id === "innovation" && value.status === "review")).toBe(true);
    expect(result.developmentJourney.stages.some((stage) => stage.id === "problem" && stage.status === "review")).toBe(true);
    expect(result.developmentJourney.stages.some((stage) => stage.id === "constraints-submission" && stage.evidence.includes("Devpost"))).toBe(true);
    expect(result.guidedFlow.steps.some((step) => step.id === "identify" && step.status === "review")).toBe(true);
    expect(result.trackEvidence.readiness).toBe("needs_work");
    expect(result.trackEvidence.pipeline.some((step) => step.id === "classify" && step.status === "review")).toBe(true);
    expect(result.trackEvidence.pipeline.some((step) => step.id === "demo" && step.status === "review")).toBe(true);
    expect(result.trackEvidence.pipeline.some((step) => step.id === "pilot" && step.status === "review")).toBe(true);
    expect(result.trackEvidence.pipeline.some((step) => step.id === "safety" && step.status === "review")).toBe(true);
    expect(result.dataHandlingLedger.status).toBe("privacy_preserving");
    expect(result.dataHandlingLedger.flows.some((flow) => flow.id === "table-data" && flow.studentControl.includes("edit"))).toBe(true);
    expect(result.aiEvaluationHarness.status).toBe("review");
    expect(result.aiEvaluationHarness.checks.some((check) => check.id === "fallback-boundary" && check.status === "pass")).toBe(true);
    expect(result.judgeDemoPath.status).toBe("review");
    expect(result.judgeDemoPath.steps.some((step) => step.id === "problem" && step.status === "review")).toBe(true);
    expect((result as any).customLabTriage.status).toBe("needs_student_details");
    expect((result as any).customLabTriage.inferredFocus).toContain("paper towel absorbency");
    expect((result as any).customLabTriage.suggestedColumns.map((column: { key: string }) => column.key)).toEqual([
      "condition",
      "measurement",
      "trial"
    ]);
    expect((result as any).customLabTriage.sourceSearches[0]).toContain("paper towel absorbency");
    expect((result as any).customLabTriage.clarifyingQuestions).toHaveLength(3);
    expect((result as any).customLabTriage.planner.independentVariable).toBe("Paper towel brand or type");
    expect((result as any).customLabTriage.planner.dependentVariable).toBe("Water absorbed");
    expect((result as any).customLabTriage.planner.controlVariables).toContain("soak time");
    expect((result as any).customLabTriage.planner.repeatPlan).toContain("3 towel pieces");
    expect((result as any).customLabTriage.planner.starterRows.map((row: { condition: string }) => row.condition)).toEqual([
      "Brand A",
      "Brand B",
      "Brand C"
    ]);
    expect((result as any).customLabTriage.planner.hypothesisStarter).toContain("___");
    expect((result as any).customLabTriage.patternArchetype.id).toBe("comparison");
    expect((result as any).customLabTriage.patternArchetype.label).toBe("Comparison experiment");
    expect((result as any).customLabTriage.patternArchetype.graphSuggestion).toContain("Bar chart");
    expect((result as any).customLabTriage.patternArchetype.expectedPattern).toContain("should not assume a winner");
    expect((result as any).customLabTriage.patternArchetype.sourceQuestion).toContain("paper towel absorbency");
    expect((result as any).customLabTriage.patternArchetype.studentCheck).toContain("repeat trials");
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "custom-lab-triage" && criterion.status === "review")).toBe(true);
  });

  it("keeps adult-review safety wording separate from low-confidence wording", () => {
    const result = analyzeExperiment({
      description: "Reaction rate experiment testing how temperature changes tablet reaction speed."
    });

    expect(result.classification.matchQuality).toBe("supported_template");
    expect(result.safetyCoach.status).toBe("adult_review");
    expect(result.safetyCoach.summary).toContain("temperature, glassware");
    expect(result.safetyCoach.summary).not.toContain("closest supported match");
  });

  it("keeps the academic integrity guard when a student asks for report writing", () => {
    const result = analyzeExperiment({
      description: "Write my lab report for a projectile motion lab."
    });

    expect(result.integrityNotice).toContain("will not write");
    expect(result.issues.some((issue) => issue.id === "integrity-report-request")).toBe(true);
    expect(result.labBrief.integrityBoundary).toContain("not write");
  });
});

describe("data checks", () => {
  it("catches missing and invalid numeric cells", () => {
    const issues = evaluateRows("projectile-motion", [
      { id: "bad", angleDeg: "forty", launchSpeedMs: "", rangeM: 100, timeS: 1.5 }
    ]);

    expect(issues.some((issue) => issue.title === "Possible unit or number mismatch")).toBe(true);
    expect(issues.some((issue) => issue.title === "Missing data")).toBe(true);
  });

  it("flags projectile range outliers", () => {
    const issues = evaluateRows("projectile-motion", [
      { id: "p1", angleDeg: 45, launchSpeedMs: 12, rangeM: 3, timeS: 1.7 }
    ]);

    expect(issues.some((issue) => issue.id.includes("projectile-outlier"))).toBe(true);
  });

  it("flags pendulum period values that do not match the length pattern", () => {
    const issues = evaluateRows("pendulum-period-length", [
      { id: "q1", lengthM: 0.2, periodS: 1.6, trial: "bad short" },
      { id: "q2", lengthM: 0.8, periodS: 0.8, trial: "bad long" }
    ]);

    expect(issues.some((issue) => issue.id === "pendulum-period-model-q1")).toBe(true);
    expect(issues.some((issue) => issue.id === "pendulum-period-trend")).toBe(true);
  });

  it("flags reaction-rate patterns that move in the wrong direction", () => {
    const issues = evaluateRows("reaction-rate-temperature", [
      { id: "c1", tempC: 10, reactionTimeS: 50, ratePerS: 0.04 },
      { id: "c2", tempC: 40, reactionTimeS: 80, ratePerS: 0.01 }
    ]);

    expect(issues.some((issue) => issue.id === "reaction-rate-trend")).toBe(true);
  });

  it("flags Ohm's law rows where voltage, current, and resistance disagree", () => {
    const issues = evaluateRows("ohms-law-circuits", [
      { id: "o1", currentA: 0.1, voltageV: 1.0, resistanceOhm: 10, trial: "ok" },
      { id: "o2", currentA: 0.2, voltageV: 4.0, resistanceOhm: 10, trial: "bad" },
      { id: "o3", currentA: 0.3, voltageV: 3.0, resistanceOhm: 10, trial: "ok" }
    ]);

    expect(issues.some((issue) => issue.id === "ohms-v-i-resistance-o2")).toBe(true);
    expect(issues.some((issue) => issue.id === "ohms-resistance-not-constant")).toBe(true);
  });

  it("flags density layers that do not match bottom-to-top density order", () => {
    const issues = evaluateRows("density-layering", [
      { id: "d1", layerOrder: 1, liquid: "oil", densityGml: 0.92, observation: "bottom" },
      { id: "d2", layerOrder: 2, liquid: "corn syrup", densityGml: 1.33, observation: "top" }
    ]);

    expect(issues.some((issue) => issue.id === "density-layer-order-d2")).toBe(true);
  });

  it("turns data quality into a student-safe claim coaching status", () => {
    const result = analyzeExperiment({
      description: "Reaction rate and temperature lab",
      rows: [
        { id: "c1", tempC: 10, reactionTimeS: 50, ratePerS: 0.04 },
        { id: "c2", tempC: 40, reactionTimeS: 80, ratePerS: 0.01 }
      ]
    });

    expect(result.labBrief.status).toBe("needs_checks");
    expect(result.labBrief.signal).toContain("warning");
    expect(result.labBrief.claimStarter).not.toContain("therefore");
    expect(result.labBrief.evidenceChecklist.some((item) => item.id === "data-quality" && !item.complete)).toBe(true);
    expect(result.methodAudit.status).toBe("needs_review");
    expect(result.methodAudit.score).toBeLessThan(80);
    expect(result.methodAudit.confounds[0]).toContain("Rate trend");
    expect(result.nextTrialPlan.status).toBe("fix_first");
    expect(result.nextTrialPlan.priority).toContain("warning");
    expect(result.nextTrialPlan.nextMeasurement).toContain("repeat");
    expect(result.reliabilityCoach.status).toBe("needs_repeats");
    expect(result.patternEvidence.score).toBeLessThan(70);
    expect(result.patternEvidence.observations.some((observation) => observation.status === "contradicts")).toBe(true);
    expect(result.impactSnapshot.metrics.some((metric) => metric.id === "data-quality" && metric.status === "watch")).toBe(true);
    expect(result.impactSnapshot.metrics.some((metric) => metric.id === "pattern-evidence" && metric.status === "needs_action")).toBe(true);
    expect(result.studentPilotStudyKit.metrics.some((metric) => metric.id === "data-fix" && metric.status === "watch")).toBe(true);
    expect(result.officialRubricFit.criteria.some((criterion) => criterion.id === "ux-design" && criterion.status === "ready")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "testing-evaluation" && criterion.status === "review")).toBe(true);
    expect(result.aiEvaluationHarness.status).toBe("review");
    expect(result.aiEvaluationHarness.checks.some((check) => check.id === "pattern-validation" && check.status === "review")).toBe(true);
    expect(result.judgeDemoPath.status).toBe("review");
    expect(result.guidedFlow.currentAction).toContain("Repeat or fix");
    expect(result.guidedFlow.steps.some((step) => step.id === "check-data" && step.status === "review")).toBe(true);
    expect(result.trackEvidence.criteria.some((criterion) => criterion.id === "ux-design" && criterion.status === "checked")).toBe(true);
  });

  it("coaches repeated trials by averaging groups and flagging wide spread", () => {
    const result = analyzeExperiment({
      description: "Pendulum lab measuring string length and period for small swings.",
      rows: [
        { id: "p1", lengthM: 0.4, periodS: 1.15, trial: "1" },
        { id: "p2", lengthM: 0.4, periodS: 1.95, trial: "2" },
        { id: "p3", lengthM: 0.4, periodS: 1.2, trial: "3" },
        { id: "p4", lengthM: 0.8, periodS: 1.79, trial: "1" }
      ]
    });

    expect(result.reliabilityCoach.status).toBe("review_spread");
    expect(result.reliabilityCoach.repeatGroups.some((group) => group.status === "review_spread")).toBe(true);
    expect(result.reliabilityCoach.repeatGroups.some((group) => group.count === 3 && group.average !== null)).toBe(true);
    expect(result.reliabilityCoach.recommendation).toContain("Retest");
    expect(result.impactSnapshot.metrics.some((metric) => metric.id === "repeat-reliability" && metric.status === "watch")).toBe(true);
  });

  it("preserves the integrity warning when table edits recompute row checks", () => {
    const result = analyzeExperiment({
      description: "Write my lab report for a projectile motion lab."
    });

    const refreshed = refreshResultForRows(result, result.rows);

    expect(refreshed.issues.some((issue) => issue.id === "integrity-report-request")).toBe(true);
  });

  it("recomputes method audit when edited rows introduce a warning", () => {
    const result = analyzeExperiment({
      description: "temperature changes reaction rate for a tablet"
    });

    const refreshed = refreshResultForRows(result, [
      { id: "c1", tempC: 10, reactionTimeS: 50, ratePerS: 0.04 },
      { id: "c2", tempC: 40, reactionTimeS: 80, ratePerS: 0.01 }
    ]);

    expect(refreshed.methodAudit.status).toBe("needs_review");
    expect(refreshed.methodAudit.score).toBeLessThan(result.methodAudit.score);
    expect(refreshed.expectedComparison.summary).toContain("Dashed expected overlay");
    expect(refreshed.patternEvidence.score).toBeLessThan(result.patternEvidence.score);
    expect(refreshed.trackEvidence.pipeline.some((step) => step.id === "pattern" && step.status === "blocked")).toBe(true);
    expect(refreshed.nextTrialPlan.status).toBe("fix_first");
    expect(refreshed.impactSnapshot.score).toBeLessThan(result.impactSnapshot.score);
    expect(refreshed.studentPilotStudyKit.metrics.some((metric) => metric.id === "data-fix" && metric.status === "watch")).toBe(true);
    expect(refreshed.officialRubricFit.score).toBeLessThan(result.officialRubricFit.score);
    expect(refreshed.trackEvidence.pipeline.some((step) => step.id === "audit" && step.status === "review")).toBe(true);
  });
});
