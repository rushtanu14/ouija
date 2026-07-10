import { analyzeExperiment } from "./analysis.js";
import type { EvaluationCaseResult, EvaluationReport } from "./types.js";

interface EvaluationCase {
  id: string;
  label: string;
  description: string;
  goal: string;
  expectedTemplateId?: string;
  expectedMatchQuality: "supported_template" | "closest_supported";
  expectedReadiness: "competitive" | "submittable" | "needs_work";
  expectedIssueId?: string;
}

const EVALUATION_CASES: EvaluationCase[] = [
  {
    id: "eval-projectile",
    label: "Physics coverage",
    description: "Projectile motion lab measuring launch angle, launch speed, time, and range.",
    goal: "Classify projectile motion and return a competitive supported run.",
    expectedTemplateId: "projectile-motion",
    expectedMatchQuality: "supported_template",
    expectedReadiness: "competitive"
  },
  {
    id: "eval-pendulum",
    label: "Pendulum coverage",
    description: "Pendulum lab measuring string length and period for small swings.",
    goal: "Classify pendulum period vs length and return a competitive supported run.",
    expectedTemplateId: "pendulum-period-length",
    expectedMatchQuality: "supported_template",
    expectedReadiness: "competitive"
  },
  {
    id: "eval-reaction-rate",
    label: "Chemistry coverage",
    description: "Reaction rate experiment testing how temperature changes tablet reaction speed.",
    goal: "Classify reaction rate vs temperature and return a competitive supported run.",
    expectedTemplateId: "reaction-rate-temperature",
    expectedMatchQuality: "supported_template",
    expectedReadiness: "competitive"
  },
  {
    id: "eval-ohms-law",
    label: "Circuit coverage",
    description: "Ohm's law lab measuring current and voltage across one resistor in a simple circuit.",
    goal: "Classify Ohm's law circuit data and return a competitive supported run.",
    expectedTemplateId: "ohms-law-circuits",
    expectedMatchQuality: "supported_template",
    expectedReadiness: "competitive"
  },
  {
    id: "eval-enzyme",
    label: "Biology coverage",
    description: "Catalase enzyme activity experiment at cold, room temperature, warm, and hot conditions.",
    goal: "Classify enzyme activity vs temperature and return a competitive supported run.",
    expectedTemplateId: "enzyme-activity-temperature",
    expectedMatchQuality: "supported_template",
    expectedReadiness: "competitive"
  },
  {
    id: "eval-plant-light",
    label: "Plant light coverage",
    description: "Bean seedlings grown under white, red, blue, green, and dark light with plant height measured after two weeks.",
    goal: "Classify plant growth vs light color and return a competitive supported run.",
    expectedTemplateId: "plant-growth-light-color",
    expectedMatchQuality: "supported_template",
    expectedReadiness: "competitive"
  },
  {
    id: "eval-turbidity",
    label: "Earth science coverage",
    description: "Water filtration turbidity before gravel, sand, and charcoal filter stages.",
    goal: "Classify water filtration and return a competitive supported run.",
    expectedTemplateId: "water-filtration-turbidity",
    expectedMatchQuality: "supported_template",
    expectedReadiness: "competitive"
  },
  {
    id: "eval-density",
    label: "Density coverage",
    description: "Density layering lab with corn syrup, salt water, water, and oil in a graduated cylinder.",
    goal: "Classify density layering and return a competitive supported run.",
    expectedTemplateId: "density-layering",
    expectedMatchQuality: "supported_template",
    expectedReadiness: "competitive"
  },
  {
    id: "eval-unsupported-boundary",
    label: "Coverage boundary",
    description: "We compared paper towel brands by measuring how much water each towel absorbed.",
    goal: "Mark an unsupported lab as low confidence instead of pretending full coverage.",
    expectedMatchQuality: "closest_supported",
    expectedReadiness: "needs_work",
    expectedIssueId: "classification-low-confidence"
  }
];

export function runEvaluationSuite(): EvaluationReport {
  const cases = EVALUATION_CASES.map(runEvaluationCase);
  const passed = cases.filter((testCase) => testCase.status === "pass").length;
  const score = Math.round((passed / cases.length) * 100);

  return {
    suiteLabel: "Ouija V1 Track 1 evaluation suite",
    score,
    passed,
    total: cases.length,
    status: passed === cases.length ? "pass" : "review",
    verdict:
      passed === cases.length
        ? "Evaluation bench passes supported coverage, source-backed reasoning, and the unsupported-lab boundary."
        : "Evaluation bench found a coverage or readiness gap that should be fixed before the final walkthrough.",
    cases
  };
}

function runEvaluationCase(testCase: EvaluationCase): EvaluationCaseResult {
  const result = analyzeExperiment({ description: testCase.description });
  const checks = [
    !testCase.expectedTemplateId || result.templateId === testCase.expectedTemplateId,
    result.classification.matchQuality === testCase.expectedMatchQuality,
    result.trackEvidence.readiness === testCase.expectedReadiness,
    !testCase.expectedIssueId || result.issues.some((issue) => issue.id === testCase.expectedIssueId)
  ];
  const allPassed = checks.every(Boolean);

  return {
    id: testCase.id,
    label: testCase.label,
    goal: testCase.goal,
    status: allPassed ? "pass" : "fail",
    expected: `${testCase.expectedMatchQuality.replace("_", " ")} / ${testCase.expectedReadiness}`,
    outcome: `${result.classification.title}: ${result.classification.matchQuality.replace("_", " ")} / ${result.trackEvidence.readiness}`,
    evidence: [
      `${Math.round(result.classification.confidence * 100)}% classification confidence`,
      `${result.trackEvidence.score}/100 Track 1 score`,
      `${result.modelStrategy.candidates.length} model candidates ranked`,
      `${result.officialRubricFit.criteria.length} official rubric criteria mapped`,
      `${result.impactSnapshot.score}/100 learning impact score`,
      `${result.studentPilotStudyKit.metrics.length} pilot metrics (${result.studentPilotStudyKit.status.replaceAll("_", " ")})`,
      `${result.learningExitTicket.prompts.length} learning exit ticket prompts (${result.learningExitTicket.status})`,
      `${result.groundingAudit.score}/100 grounding audit`,
      `${result.aiEvaluationHarness.score}/100 AI evaluation harness`,
      `${result.dataHandlingLedger.score}/100 data handling ledger`,
      `${result.judgeDemoPath.steps.length} judge demo steps (${result.judgeDemoPath.status})`,
      `${result.guidedFlow.steps.length} guided workflow steps`,
      `${result.nextTrialPlan.status.replaceAll("_", " ")} next-trial plan`,
      `${result.expectedComparison.points.filter((point) => point.expectedY !== null).length} expected overlay points`,
      `${result.patternEvidence.score}/100 pattern evidence`,
      `${result.reliabilityCoach.score}/100 repeat reliability`,
      `${result.customLabTriage.patternArchetype.label} custom pattern archetype`,
      `${result.conceptCoach.vocabulary.length} concept terms`,
      `${result.safetyCoach.status.replaceAll("_", " ")} safety coach`,
      `${result.customLabTriage.status.replaceAll("_", " ")} custom lab triage`,
      `${result.customLabTriage.planner.starterRows.length} custom planner rows`,
      `${result.preLabDesignCoach.setupChecks.length} pre-lab setup checks (${result.preLabDesignCoach.status.replaceAll("_", " ")})`,
      `${result.sources.length} visible citation${result.sources.length === 1 ? "" : "s"}`
    ]
  };
}
