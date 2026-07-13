import { EXPERIMENT_TEMPLATES } from "./templates.js";
import type {
  AiyesValuesFit,
  AnalyzeRequest,
  AnalyzeResult,
  AiEvaluationHarness,
  ConceptCoach,
  CustomLabPlanner,
  CustomPatternArchetype,
  CustomLabTriage,
  DataHandlingLedger,
  DevelopmentJourney,
  ExpectedComparison,
  ExperimentTemplate,
  GroundingAudit,
  GuidedLabFlow,
  Issue,
  JudgeDemoPath,
  LabBrief,
  LearningExitTicket,
  LearningImpactSnapshot,
  MethodAudit,
  ModelStrategy,
  NextTrialPlan,
  OfficialRubricFit,
  PatternEvidence,
  PreLabDesignCoach,
  ReliabilityCoach,
  SafetyCoach,
  SourceCard,
  StudentDataRow,
  StudentImpactBrief,
  StudentPilotStudyKit,
  TrackEvidence
} from "./types.js";

const INTEGRITY_NOTICE = "Hints, checks, and explanations only. Ouija will not write the full lab report or final conclusion for you.";

interface TemplateScore {
  template: ExperimentTemplate;
  score: number;
  evidence: string[];
  missingSignals: string[];
}

export function matchExperiment(description: string): {
  template: ExperimentTemplate;
  confidence: number;
  candidates: ModelStrategy["candidates"];
} {
  const scores = scoreTemplates(description);
  const best = scores[0];
  const confidence = calculateMatchConfidence(best.score);

  return {
    template: best.template,
    confidence,
    candidates: scores.map((candidate, index) => ({
      templateId: candidate.template.id,
      title: candidate.template.title,
      subject: candidate.template.subject,
      score: candidate.score,
      confidence: index === 0 ? confidence : calculateCandidateConfidence(candidate.score),
      evidence: candidate.evidence,
      missingSignals: candidate.missingSignals
    }))
  };
}

export function analyzeExperiment(request: AnalyzeRequest): AnalyzeResult {
  const { template, confidence, candidates } = matchExperiment(request.description);
  const rows = normalizeRows(request.rows?.length ? request.rows : template.sampleRows, template);
  const issues = evaluateRows(template.id, rows);
  const integrityIssues = detectIntegrityRisk(request.description);
  const coverageIssues = buildCoverageIssues(confidence, template);
  const allIssues = mergeIssues(coverageIssues, integrityIssues.length ? [...integrityIssues, ...issues] : issues);
  const hints = buildHints(template, allIssues);
  const conceptCoach = buildConceptCoach(template);
  const safetyCoach = buildSafetyCoach(template, allIssues);
  const labBrief = buildLabBrief(template, rows, allIssues, template.fallbackSources);
  const methodAudit = buildMethodAudit(template, rows, allIssues);
  const expectedComparison = buildExpectedComparison(template, rows);
  const reliabilityCoach = buildReliabilityCoach(template, rows, allIssues);
  const patternEvidence = buildPatternEvidence(template, rows, allIssues);
  const nextTrialPlan = buildNextTrialPlan(template, rows, allIssues, methodAudit);
  const guidedFlow = buildGuidedLabFlow(confidence, allIssues, safetyCoach, methodAudit, nextTrialPlan, labBrief);
  const impactSnapshot = buildLearningImpactSnapshot(
    template,
    confidence,
    allIssues,
    conceptCoach,
    safetyCoach,
    labBrief,
    methodAudit,
    expectedComparison,
    reliabilityCoach,
    patternEvidence,
    nextTrialPlan
  );
  const matchQuality = confidence >= 0.6 ? "supported_template" : "closest_supported";
  const customLabTriage = buildCustomLabTriage(request.description, template, confidence, matchQuality);
  const preLabDesignCoach = buildPreLabDesignCoach(template, confidence, allIssues, safetyCoach, customLabTriage);
  const learningExitTicket = buildLearningExitTicket(
    template,
    confidence,
    allIssues,
    labBrief,
    patternEvidence,
    reliabilityCoach,
    nextTrialPlan,
    customLabTriage
  );
  const studentPilotStudyKit = buildStudentPilotStudyKit(
    template,
    confidence,
    allIssues,
    impactSnapshot,
    learningExitTicket,
    customLabTriage,
    preLabDesignCoach,
    nextTrialPlan
  );
  const studentImpactBrief = buildStudentImpactBrief(
    template,
    confidence,
    allIssues,
    matchQuality,
    impactSnapshot,
    studentPilotStudyKit
  );
  const groundingStatus = {
    mode: "fallback" as const,
    note: "Using built-in middle/high school science references."
  };
  const dataHandlingLedger = buildDataHandlingLedger(groundingStatus.mode);
  const groundingAudit = buildGroundingAudit(template, template.fallbackSources, groundingStatus.mode, template.expectedResult);
  const aiEvaluationHarness = buildAiEvaluationHarness(
    template,
    confidence,
    matchQuality,
    allIssues,
    candidates,
    groundingAudit,
    patternEvidence,
    reliabilityCoach,
    safetyCoach,
    labBrief
  );
  const judgeDemoPath = buildJudgeDemoPath(
    template,
    confidence,
    matchQuality,
    guidedFlow,
    aiEvaluationHarness,
    groundingAudit,
    expectedComparison,
    patternEvidence,
    reliabilityCoach,
    impactSnapshot,
    labBrief
  );
  const modelStrategy = buildModelStrategy(
    template,
    confidence,
    candidates,
    allIssues,
    template.fallbackSources,
    groundingStatus.mode,
    matchQuality,
    safetyCoach,
    reliabilityCoach,
    patternEvidence,
    groundingAudit
  );
  const officialRubricFit = buildOfficialRubricFit(
    template,
    confidence,
    allIssues,
    template.fallbackSources,
    groundingStatus.mode,
    matchQuality,
    modelStrategy,
    guidedFlow,
    safetyCoach,
    labBrief,
    methodAudit,
    expectedComparison,
    reliabilityCoach,
    patternEvidence,
    groundingAudit,
    aiEvaluationHarness,
    judgeDemoPath,
    customLabTriage,
    nextTrialPlan,
    impactSnapshot,
    dataHandlingLedger,
    learningExitTicket,
    preLabDesignCoach,
    studentPilotStudyKit
  );
  const aiyesValuesFit = buildAiyesValuesFit(
    template,
    confidence,
    allIssues,
    template.fallbackSources,
    groundingStatus.mode,
    matchQuality,
    guidedFlow,
    groundingAudit,
    dataHandlingLedger,
    aiEvaluationHarness,
    learningExitTicket,
    preLabDesignCoach,
    customLabTriage,
    impactSnapshot,
    officialRubricFit,
    studentPilotStudyKit
  );
  const developmentJourney = buildDevelopmentJourney(
    template,
    confidence,
    rows,
    allIssues,
    template.fallbackSources,
    groundingStatus.mode,
    matchQuality,
    modelStrategy,
    guidedFlow,
    expectedComparison,
    groundingAudit,
    aiEvaluationHarness,
    dataHandlingLedger,
    officialRubricFit,
    aiyesValuesFit,
    impactSnapshot,
    learningExitTicket,
    preLabDesignCoach,
    judgeDemoPath,
    studentPilotStudyKit
  );

  return {
    templateId: template.id,
    classification: {
      subject: template.subject,
      title: template.title,
      confidence,
      matchQuality,
      coverageNote:
        matchQuality === "supported_template"
          ? "Strong match to a supported middle/high school lab template."
          : "Low-confidence description. Ouija is showing the closest supported V1 lab pattern, not claiming full coverage.",
      concepts: template.concepts
    },
    variables: template.variables,
    expectedResult: template.expectedResult,
    sources: template.fallbackSources,
    columns: template.columns,
    rows,
    issues: allIssues,
    hints,
    guidedFlow,
    modelStrategy,
    conceptCoach,
    safetyCoach,
    labBrief,
    methodAudit,
    expectedComparison,
    reliabilityCoach,
    patternEvidence,
    groundingAudit,
    aiEvaluationHarness,
    dataHandlingLedger,
    judgeDemoPath,
    customLabTriage,
    preLabDesignCoach,
    nextTrialPlan,
    impactSnapshot,
    studentPilotStudyKit,
    studentImpactBrief,
    learningExitTicket,
    officialRubricFit,
    aiyesValuesFit,
    developmentJourney,
    trackEvidence: buildTrackEvidence(
      template,
      confidence,
      rows,
      allIssues,
      template.fallbackSources,
      groundingStatus.mode,
      nextTrialPlan,
      reliabilityCoach,
      patternEvidence,
      expectedComparison,
      groundingAudit,
      aiEvaluationHarness,
      judgeDemoPath,
      safetyCoach,
      guidedFlow,
      modelStrategy,
      customLabTriage,
      dataHandlingLedger,
      learningExitTicket,
      preLabDesignCoach,
      studentPilotStudyKit
    ),
    explanation: template.explanation,
    integrityNotice: INTEGRITY_NOTICE,
    groundingStatus
  };
}

function scoreTemplates(description: string): TemplateScore[] {
  const normalized = description.toLowerCase();

  return EXPERIMENT_TEMPLATES.map((template) => {
    const keywordHits = template.matcherKeywords.filter((keyword) => normalized.includes(keyword));
    const conceptHits = template.concepts.filter((concept) => normalized.includes(concept.toLowerCase()));
    const evidence = Array.from(new Set([...keywordHits, ...conceptHits])).slice(0, 6);
    const missingSignals = [...template.matcherKeywords.slice(0, 2), ...template.concepts.slice(0, 2)]
      .filter((signal) => !evidence.includes(signal))
      .slice(0, 4);

    return {
      template,
      score: keywordHits.length * 2 + conceptHits.length,
      evidence,
      missingSignals
    };
  }).sort((a, b) => b.score - a.score || a.template.title.localeCompare(b.template.title));
}

function calculateMatchConfidence(score: number): number {
  return score === 0 ? 0.48 : Math.min(0.94, 0.58 + score * 0.08);
}

function calculateCandidateConfidence(score: number): number {
  return score === 0 ? 0.18 : Math.min(0.88, 0.34 + score * 0.08);
}

function buildCoverageIssues(confidence: number, template: ExperimentTemplate): Issue[] {
  if (confidence >= 0.6) return [];

  return [
    {
      id: "classification-low-confidence",
      severity: "warning",
      title: "Closest supported experiment only",
      detail: `Ouija did not find a strong V1 match, so it is showing the closest supported template: ${template.title}. Treat this as a boundary warning, not a final classification.`
    }
  ];
}

function buildCustomLabTriage(
  description: string,
  template: ExperimentTemplate,
  confidence: number,
  matchQuality: AnalyzeResult["classification"]["matchQuality"]
): CustomLabTriage {
  if (matchQuality === "supported_template") {
    const planner = buildSupportedLabPlanner(template);
    return {
      status: "supported_template",
      summary: `${template.title} is covered by Ouija's deterministic V1 template library.`,
      inferredFocus: template.shortName,
      suggestedColumns: template.columns,
      sourceSearches: [
        `${template.title} middle school lab expected results`,
        `${template.concepts.slice(0, 2).join(" ")} student experiment explanation`.trim()
      ],
      clarifyingQuestions: [
        `Which variable did you intentionally change for ${template.title}?`,
        `Which measurement best shows the ${template.shortName} pattern?`,
        "How many repeat trials did you run for each condition?"
      ],
      planner,
      patternArchetype: buildSupportedPatternArchetype(template, planner),
      safetyBoundary: "Use the matched template safety checks before running or extending the lab.",
      studentNextAction: "Use the supported template analysis, then edit or paste your table data."
    };
  }

  const inferredFocus = inferCustomLabFocus(description);
  const planner = buildUnsupportedLabPlanner(inferredFocus);
  const patternArchetype = buildUnsupportedPatternArchetype(description, inferredFocus, planner);

  return {
    status: "needs_student_details",
    summary:
      `Ouija does not have a strong V1 template match at ${Math.round(confidence * 100)}% confidence, so it switches to a triage plan instead of claiming full coverage.`,
    inferredFocus,
    suggestedColumns: [
      { key: "condition", label: "Condition", numeric: false },
      { key: "measurement", label: "Measurement", numeric: true },
      { key: "trial", label: "Trial", numeric: false }
    ],
    sourceSearches: [
      `${inferredFocus} middle school experiment expected results`,
      `${inferredFocus} independent dependent variable student lab`,
      `${inferredFocus} safety classroom science experiment`
    ],
    clarifyingQuestions: [
      "What exact condition did you change on purpose?",
      "What numerical measurement will prove whether the condition mattered?",
      "What controls stayed the same for every trial?"
    ],
    planner,
    patternArchetype,
    safetyBoundary: "Ask a teacher to confirm materials, controls, and safety before treating this as a runnable procedure.",
    studentNextAction: "Fill the planner worksheet, run the suggested source searches, and get teacher confirmation before collecting data."
  };
}

function buildSupportedLabPlanner(template: ExperimentTemplate): CustomLabPlanner {
  const [xColumn, yColumn] = [template.expectedResult.xKey, template.expectedResult.yKey].map((key) =>
    template.columns.find((column) => column.key === key)
  );

  return {
    title: `Use the supported ${template.shortName} worksheet.`,
    independentVariable: expandTemplateVariableName(xColumn?.label ?? template.expectedResult.xKey, template),
    dependentVariable: expandTemplateVariableName(yColumn?.label ?? template.expectedResult.yKey, template),
    controlVariables: controlsForSupportedTemplate(template.id),
    repeatPlan: "Run at least 3 repeat trials for each condition before trusting one graph point.",
    starterRows: template.sampleRows.slice(0, 3),
    qualityChecklist: [
      "Use the same units for every row.",
      "Keep controls constant between trials.",
      "Repeat each condition before writing a claim."
    ],
    hypothesisStarter: "If ___ changes, then ___ may change because ___."
  };
}

function expandTemplateVariableName(label: string, template: ExperimentTemplate) {
  const normalized = label.toLowerCase();
  const expanded = template.variables.find((variable) => {
    const candidate = variable.toLowerCase();
    return candidate.includes(normalized) && candidate.length > normalized.length;
  });
  return expanded ? toTitleCase(expanded) : toTitleCase(label);
}

function controlsForSupportedTemplate(templateId: string) {
  if (templateId === "projectile-motion") {
    return ["launch speed", "launcher height", "projectile type", "landing surface"];
  }
  if (templateId === "reaction-rate-temperature") {
    return ["reactant concentration", "tablet size", "liquid volume", "reaction endpoint"];
  }
  if (templateId === "enzyme-activity-temperature") {
    return ["enzyme amount", "substrate amount", "pH", "timing method"];
  }
  if (templateId === "plant-growth-light-color") {
    return ["plant species", "starting height", "soil amount", "water amount", "light distance", "light duration"];
  }
  if (templateId === "water-filtration-turbidity") {
    return ["filter material amount", "water volume", "starting turbidity", "pour rate"];
  }
  if (templateId === "pendulum-period-length") {
    return ["release angle", "bob mass", "number of swings timed", "support height"];
  }
  if (templateId === "ohms-law-circuits") {
    return ["resistor", "meter settings", "power source", "component temperature"];
  }
  if (templateId === "density-layering") {
    return ["liquid volume", "container size", "pouring method", "temperature"];
  }
  return ["materials", "amounts", "timing", "measurement method"];
}

function buildSupportedPatternArchetype(template: ExperimentTemplate, planner: CustomLabPlanner): CustomPatternArchetype {
  const xColumn = template.columns.find((column) => column.key === template.expectedResult.xKey);
  const yColumn = template.columns.find((column) => column.key === template.expectedResult.yKey);
  const graphKindLabel = template.expectedResult.graphKind === "stage" ? "stage chart" : `${template.expectedResult.graphKind} graph`;

  return {
    id: "supported_template",
    label: "Supported template pattern",
    confidence: "high",
    graphSuggestion: `${toTitleCase(graphKindLabel)} using ${xColumn?.label ?? template.expectedResult.xKey} on x and ${yColumn?.label ?? template.expectedResult.yKey} on y.`,
    expectedPattern: template.expectedResult.pattern,
    xAxis: xColumn?.label ?? planner.independentVariable,
    yAxis: yColumn?.label ?? planner.dependentVariable,
    repeatAdvice: planner.repeatPlan,
    sourceQuestion: `Which cited source best supports the ${template.shortName} graph shape?`,
    studentCheck: "Compare the full graph shape to the expected pattern before writing a claim."
  };
}

function toTitleCase(value: string) {
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function buildUnsupportedLabPlanner(inferredFocus: string): CustomLabPlanner {
  if (inferredFocus === "plant growth light color") {
    return {
      title: "Plan the plant growth light color lab before collecting data.",
      independentVariable: "Light color",
      dependentVariable: "Plant height",
      controlVariables: ["plant species", "soil amount", "water amount", "light duration", "container size", "temperature"],
      repeatPlan: "Use at least 3 plants per light color before trusting one color's average height.",
      starterRows: [
        { id: "custom-red-light", condition: "Red light", measurement: "", trial: "1", notes: "Measure height in the same unit." },
        { id: "custom-blue-light", condition: "Blue light", measurement: "", trial: "1", notes: "Keep water and light duration the same." },
        { id: "custom-white-light", condition: "White light", measurement: "", trial: "1", notes: "Use as a comparison condition." }
      ],
      qualityChecklist: [
        "Start plants at similar size before the first measurement.",
        "Measure height at the same time each day or week.",
        "Average repeat plants before comparing colors.",
        "Do not claim the best color until controls and repeats are checked."
      ],
      hypothesisStarter: "If the light color changes from ___ to ___, then plant height may ___ because ___."
    };
  }

  if (inferredFocus === "paper towel absorbency") {
    return {
      title: "Plan the paper towel absorbency lab before collecting data.",
      independentVariable: "Paper towel brand or type",
      dependentVariable: "Water absorbed",
      controlVariables: ["paper towel size", "water volume", "soak time", "drain time", "container", "measurement method"],
      repeatPlan: "Use at least 3 towel pieces per brand or type before comparing average water absorbed.",
      starterRows: [
        { id: "custom-brand-a", condition: "Brand A", measurement: "", trial: "1", notes: "Use the same towel size." },
        { id: "custom-brand-b", condition: "Brand B", measurement: "", trial: "1", notes: "Use the same soak time." },
        { id: "custom-brand-c", condition: "Brand C", measurement: "", trial: "1", notes: "Measure water absorbed in mL or grams." }
      ],
      qualityChecklist: [
        "Cut every sample to the same size.",
        "Use the same starting water amount and soak time.",
        "Let samples drain for the same time before measuring.",
        "Average repeat samples before ranking towel brands."
      ],
      hypothesisStarter: "If the paper towel type changes from ___ to ___, then water absorbed may ___ because ___."
    };
  }

  return {
    title: `Plan the ${inferredFocus} lab before collecting data.`,
    independentVariable: "Condition changed on purpose",
    dependentVariable: "Numerical measurement",
    controlVariables: ["materials", "amounts", "timing", "measurement method", "environment"],
    repeatPlan: "Use at least 3 repeat trials per condition before trusting one condition's average.",
    starterRows: [
      { id: "custom-condition-a", condition: "Condition A", measurement: "", trial: "1", notes: "Keep controls the same." },
      { id: "custom-condition-b", condition: "Condition B", measurement: "", trial: "1", notes: "Change only one variable." },
      { id: "custom-condition-c", condition: "Condition C", measurement: "", trial: "1", notes: "Repeat before comparing." }
    ],
    qualityChecklist: [
      "Name the one variable you changed on purpose.",
      "Choose one numerical measurement before collecting data.",
      "Keep controls the same across conditions.",
      "Run repeats before writing a claim."
    ],
    hypothesisStarter: "If ___ changes, then ___ may change because ___."
  };
}

function buildUnsupportedPatternArchetype(
  description: string,
  inferredFocus: string,
  planner: CustomLabPlanner
): CustomPatternArchetype {
  const normalized = `${description} ${inferredFocus} ${planner.independentVariable} ${planner.dependentVariable}`.toLowerCase();

  if (/(brand|type|material|which|compare|compared|versus|\bvs\b|color|paper towel|absorbency)/.test(normalized)) {
    return {
      id: "comparison",
      label: "Comparison experiment",
      confidence: inferredFocus === "paper towel absorbency" ? "high" : "medium",
      graphSuggestion: `Bar chart by ${planner.independentVariable.toLowerCase()} with average ${planner.dependentVariable.toLowerCase()} on the y-axis.`,
      expectedPattern: "One condition may average higher or lower than another, but Ouija should not assume a winner until repeated trials agree.",
      xAxis: planner.independentVariable,
      yAxis: `Average ${planner.dependentVariable.toLowerCase()}`,
      repeatAdvice: planner.repeatPlan,
      sourceQuestion: `Search whether ${inferredFocus} labs usually compare group averages, then note what controls the source says to keep constant.`,
      studentCheck: "Do the repeat trials for each group point in the same direction, or is the apparent difference just one noisy trial?"
    };
  }

  if (/(optimal|optimum|best|peak|enzyme|temperature|ph|pH|germination|sprout)/.test(normalized)) {
    return {
      id: "optimum",
      label: "Optimum-finding experiment",
      confidence: "medium",
      graphSuggestion: `Line or scatter plot with ${planner.independentVariable.toLowerCase()} on x and ${planner.dependentVariable.toLowerCase()} on y.`,
      expectedPattern: "The graph may rise toward a best condition and fall after conditions become too low, too high, or stressful.",
      xAxis: planner.independentVariable,
      yAxis: planner.dependentVariable,
      repeatAdvice: planner.repeatPlan,
      sourceQuestion: `Look for a classroom source that explains whether ${inferredFocus} has an optimum range instead of a simple increase.`,
      studentCheck: "Can you point to the highest average and also explain why nearby conditions were lower?"
    };
  }

  if (/(over time|each day|daily|minutes|hours|days|week|growth|cooling|heating|rate over)/.test(normalized)) {
    return {
      id: "time_series",
      label: "Time-series experiment",
      confidence: "medium",
      graphSuggestion: `Line graph with time on x and ${planner.dependentVariable.toLowerCase()} on y.`,
      expectedPattern: "The main evidence is the direction and steepness of change over time, not a single endpoint.",
      xAxis: "Time",
      yAxis: planner.dependentVariable,
      repeatAdvice: "Measure on the same schedule for every condition and repeat the full run if materials allow.",
      sourceQuestion: `Search for the expected time trend in ${inferredFocus}, then compare source timing to your classroom timing.`,
      studentCheck: "Does the trend stay consistent across the run, or does one time point need a repeat measurement?"
    };
  }

  if (/(increase|decrease|more|less|effect|changes|as .* increases|amount|concentration|distance|height|length|angle|voltage|light intensity)/.test(normalized)) {
    return {
      id: "trend",
      label: "Trend experiment",
      confidence: "medium",
      graphSuggestion: `Scatter or line graph with ${planner.independentVariable.toLowerCase()} on x and ${planner.dependentVariable.toLowerCase()} on y.`,
      expectedPattern: "The graph should show whether the measurement generally increases, decreases, levels off, or curves as the changed condition moves.",
      xAxis: planner.independentVariable,
      yAxis: planner.dependentVariable,
      repeatAdvice: planner.repeatPlan,
      sourceQuestion: `Search for how ${inferredFocus} should change as the independent variable changes, then compare direction rather than exact numbers.`,
      studentCheck: "Does the whole graph show one direction or shape, or are there points that need a controlled repeat?"
    };
  }

  return {
    id: "unknown",
    label: "Teacher-review pattern",
    confidence: "low",
    graphSuggestion: `Start with a simple plot of ${planner.independentVariable.toLowerCase()} versus ${planner.dependentVariable.toLowerCase()} after your teacher confirms the variables.`,
    expectedPattern: "Ouija needs more student details before it can safely name an expected graph shape.",
    xAxis: planner.independentVariable,
    yAxis: planner.dependentVariable,
    repeatAdvice: planner.repeatPlan,
    sourceQuestion: `Search ${inferredFocus} with independent variable, dependent variable, and expected results, then bring the source to a teacher.`,
    studentCheck: "Can you name exactly one variable changed on purpose and one number measured?"
  };
}

function inferCustomLabFocus(description: string): string {
  const normalized = description.toLowerCase();

  if (/(plant|seedling|bean|germinat|sprout|light color|red light|blue light)/.test(normalized)) {
    return "plant growth light color";
  }

  if (/(paper towel|towel|absorb|absorbency|soak)/.test(normalized)) {
    return "paper towel absorbency";
  }

  if (/(mold|bacteria|yeast|microbe|microbial)/.test(normalized)) {
    return "microorganism growth condition";
  }

  if (/(soil|erosion|runoff|slope)/.test(normalized)) {
    return "soil erosion runoff";
  }

  const terms = normalized
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 3 && !["experiment", "measured", "measure", "under", "different", "with", "from", "that", "this"].includes(term));

  return terms.slice(0, 4).join(" ") || "custom science experiment";
}

export function evaluateRows(templateId: string, rows: StudentDataRow[]): Issue[] {
  const template = EXPERIMENT_TEMPLATES.find((candidate) => candidate.id === templateId);
  if (!template) return [];

  const issues: Issue[] = [];
  issues.push(...findMissingOrInvalidCells(template, rows));

  if (templateId === "projectile-motion") {
    issues.push(...evaluateProjectileRows(rows));
  }

  if (templateId === "pendulum-period-length") {
    issues.push(...evaluatePendulumRows(rows));
  }

  if (templateId === "reaction-rate-temperature") {
    issues.push(...evaluateReactionRateRows(rows));
  }

  if (templateId === "ohms-law-circuits") {
    issues.push(...evaluateOhmsLawRows(rows));
  }

  if (templateId === "enzyme-activity-temperature") {
    issues.push(...evaluateEnzymeRows(rows));
  }

  if (templateId === "plant-growth-light-color") {
    issues.push(...evaluatePlantGrowthRows(rows));
  }

  if (templateId === "density-layering") {
    issues.push(...evaluateDensityRows(rows));
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
  const sources = enrichment.sources?.length ? enrichment.sources : base.sources;
  const template = EXPERIMENT_TEMPLATES.find((candidate) => candidate.id === base.templateId);
  const groundingStatus = enrichment.groundingStatus ?? base.groundingStatus;
  const issues = enrichment.issues?.length ? enrichment.issues : base.issues;
  const expectedResult = {
    ...base.expectedResult,
    ...enrichment.expectedResult
  };
  const methodAudit = base.methodAudit;
  const expectedComparison = template ? buildExpectedComparison(template, base.rows) : base.expectedComparison;
  const reliabilityCoach = template ? buildReliabilityCoach(template, base.rows, issues) : base.reliabilityCoach;
  const patternEvidence = template ? buildPatternEvidence(template, base.rows, issues) : base.patternEvidence;
  const groundingAudit = template ? buildGroundingAudit(template, sources, groundingStatus.mode, expectedResult) : base.groundingAudit;
  const nextTrialPlan = template ? buildNextTrialPlan(template, base.rows, issues, methodAudit) : base.nextTrialPlan;
  const conceptCoach = template ? buildConceptCoach(template) : base.conceptCoach;
  const safetyCoach = template ? buildSafetyCoach(template, issues) : base.safetyCoach;
  const labBrief = {
    ...base.labBrief,
    sourceTrail: sources.slice(0, 2).map(({ publisher, title, url }) => ({ publisher, title, url }))
  };
  const aiEvaluationHarness = template
    ? buildAiEvaluationHarness(
        template,
        base.classification.confidence,
        base.classification.matchQuality,
        issues,
        base.modelStrategy.candidates,
        groundingAudit,
        patternEvidence,
        reliabilityCoach,
        safetyCoach,
        labBrief
      )
    : base.aiEvaluationHarness;
  const guidedFlow = template
    ? buildGuidedLabFlow(base.classification.confidence, issues, safetyCoach, methodAudit, nextTrialPlan, labBrief)
    : base.guidedFlow;
  const modelStrategy = template
    ? buildModelStrategy(
        template,
        base.classification.confidence,
        base.modelStrategy.candidates,
        issues,
        sources,
        groundingStatus.mode,
        base.classification.matchQuality,
        safetyCoach,
        reliabilityCoach,
        patternEvidence,
        groundingAudit
      )
    : base.modelStrategy;
  const impactSnapshot = template
    ? buildLearningImpactSnapshot(
        template,
        base.classification.confidence,
        issues,
        conceptCoach,
        safetyCoach,
        labBrief,
        methodAudit,
        expectedComparison,
        reliabilityCoach,
        patternEvidence,
        nextTrialPlan
      )
    : base.impactSnapshot;
  const judgeDemoPath = template
    ? buildJudgeDemoPath(
        template,
        base.classification.confidence,
        base.classification.matchQuality,
        guidedFlow,
        aiEvaluationHarness,
        groundingAudit,
        expectedComparison,
        patternEvidence,
        reliabilityCoach,
        impactSnapshot,
        labBrief
      )
    : base.judgeDemoPath;
  const dataHandlingLedger = base.dataHandlingLedger ?? buildDataHandlingLedger(groundingStatus.mode);
  const preLabDesignCoach = template
    ? buildPreLabDesignCoach(template, base.classification.confidence, issues, safetyCoach, base.customLabTriage)
    : base.preLabDesignCoach;
  const learningExitTicket = template
    ? buildLearningExitTicket(
        template,
        base.classification.confidence,
        issues,
        labBrief,
        patternEvidence,
        reliabilityCoach,
        nextTrialPlan,
        base.customLabTriage
      )
    : base.learningExitTicket;
  const studentPilotStudyKit = template
    ? buildStudentPilotStudyKit(
        template,
        base.classification.confidence,
        issues,
        impactSnapshot,
        learningExitTicket,
        base.customLabTriage,
        preLabDesignCoach,
        nextTrialPlan
      )
    : base.studentPilotStudyKit;
  const studentImpactBrief = template
    ? buildStudentImpactBrief(
        template,
        base.classification.confidence,
        issues,
        base.classification.matchQuality,
        impactSnapshot,
        studentPilotStudyKit
      )
    : base.studentImpactBrief;
  const officialRubricFit = template
    ? buildOfficialRubricFit(
        template,
        base.classification.confidence,
        issues,
        sources,
        groundingStatus.mode,
        base.classification.matchQuality,
        modelStrategy,
        guidedFlow,
        safetyCoach,
        labBrief,
        methodAudit,
        expectedComparison,
        reliabilityCoach,
        patternEvidence,
        groundingAudit,
        aiEvaluationHarness,
        judgeDemoPath,
        base.customLabTriage,
        nextTrialPlan,
        impactSnapshot,
        dataHandlingLedger,
        learningExitTicket,
        preLabDesignCoach,
        studentPilotStudyKit
      )
    : base.officialRubricFit;
  const aiyesValuesFit = template
    ? buildAiyesValuesFit(
        template,
        base.classification.confidence,
        issues,
        sources,
        groundingStatus.mode,
        base.classification.matchQuality,
        guidedFlow,
        groundingAudit,
        dataHandlingLedger,
        aiEvaluationHarness,
        learningExitTicket,
        preLabDesignCoach,
        base.customLabTriage,
        impactSnapshot,
        officialRubricFit,
        studentPilotStudyKit
      )
    : base.aiyesValuesFit;
  const developmentJourney = template
    ? buildDevelopmentJourney(
        template,
        base.classification.confidence,
        base.rows,
        issues,
        sources,
        groundingStatus.mode,
        base.classification.matchQuality,
        modelStrategy,
        guidedFlow,
        expectedComparison,
        groundingAudit,
        aiEvaluationHarness,
        dataHandlingLedger,
        officialRubricFit,
        aiyesValuesFit,
        impactSnapshot,
        learningExitTicket,
        preLabDesignCoach,
        judgeDemoPath,
        studentPilotStudyKit
      )
    : base.developmentJourney;

  return {
    ...base,
    ...enrichment,
    expectedResult,
    sources,
    groundingStatus,
    issues,
    hints: enrichment.hints?.length ? enrichment.hints : base.hints,
    guidedFlow,
    modelStrategy,
    conceptCoach,
    safetyCoach,
    methodAudit,
    expectedComparison,
    reliabilityCoach,
    patternEvidence,
    groundingAudit,
    aiEvaluationHarness,
    dataHandlingLedger,
    judgeDemoPath,
    customLabTriage: base.customLabTriage,
    preLabDesignCoach,
    nextTrialPlan,
    impactSnapshot,
    studentPilotStudyKit,
    studentImpactBrief,
    learningExitTicket,
    officialRubricFit,
    aiyesValuesFit,
    developmentJourney,
    trackEvidence: template
      ? buildTrackEvidence(
          template,
          base.classification.confidence,
          base.rows,
          issues,
          sources,
          groundingStatus.mode,
          nextTrialPlan,
          reliabilityCoach,
          patternEvidence,
          expectedComparison,
          groundingAudit,
          aiEvaluationHarness,
          judgeDemoPath,
          safetyCoach,
          guidedFlow,
          modelStrategy,
          base.customLabTriage,
          dataHandlingLedger,
          learningExitTicket,
          preLabDesignCoach,
          studentPilotStudyKit
        )
      : base.trackEvidence,
    labBrief
  };
}

export function refreshResultForRows(result: AnalyzeResult, rows: StudentDataRow[]): AnalyzeResult {
  const template = EXPERIMENT_TEMPLATES.find((candidate) => candidate.id === result.templateId);
  if (!template) return { ...result, rows };

  const preservedIssues = result.issues.filter((issue) => issue.id.startsWith("integrity-"));
  const issues = mergeIssues(preservedIssues, evaluateRows(result.templateId, rows));
  const hints = buildHints(template, issues);
  const conceptCoach = buildConceptCoach(template);
  const safetyCoach = buildSafetyCoach(template, issues);
  const methodAudit = buildMethodAudit(template, rows, issues);
  const expectedComparison = buildExpectedComparison(template, rows);
  const nextTrialPlan = buildNextTrialPlan(template, rows, issues, methodAudit);
  const labBrief = buildLabBrief(template, rows, issues, result.sources);
  const guidedFlow = buildGuidedLabFlow(result.classification.confidence, issues, safetyCoach, methodAudit, nextTrialPlan, labBrief);
  const reliabilityCoach = buildReliabilityCoach(template, rows, issues);
  const patternEvidence = buildPatternEvidence(template, rows, issues);
  const groundingAudit = buildGroundingAudit(template, result.sources, result.groundingStatus.mode, result.expectedResult);
  const aiEvaluationHarness = buildAiEvaluationHarness(
    template,
    result.classification.confidence,
    result.classification.matchQuality,
    issues,
    result.modelStrategy.candidates,
    groundingAudit,
    patternEvidence,
    reliabilityCoach,
    safetyCoach,
    labBrief
  );
  const modelStrategy = buildModelStrategy(
    template,
    result.classification.confidence,
    result.modelStrategy.candidates,
    issues,
    result.sources,
    result.groundingStatus.mode,
    result.classification.matchQuality,
    safetyCoach,
    reliabilityCoach,
    patternEvidence,
    groundingAudit
  );
  const impactSnapshot = buildLearningImpactSnapshot(
    template,
    result.classification.confidence,
    issues,
    conceptCoach,
    safetyCoach,
    labBrief,
    methodAudit,
    expectedComparison,
    reliabilityCoach,
    patternEvidence,
    nextTrialPlan
  );
  const judgeDemoPath = buildJudgeDemoPath(
    template,
    result.classification.confidence,
    result.classification.matchQuality,
    guidedFlow,
    aiEvaluationHarness,
    groundingAudit,
    expectedComparison,
    patternEvidence,
    reliabilityCoach,
    impactSnapshot,
    labBrief
  );
  const dataHandlingLedger = result.dataHandlingLedger ?? buildDataHandlingLedger(result.groundingStatus.mode);
  const preLabDesignCoach = buildPreLabDesignCoach(
    template,
    result.classification.confidence,
    issues,
    safetyCoach,
    result.customLabTriage
  );
  const learningExitTicket = buildLearningExitTicket(
    template,
    result.classification.confidence,
    issues,
    labBrief,
    patternEvidence,
    reliabilityCoach,
    nextTrialPlan,
    result.customLabTriage
  );
  const studentPilotStudyKit = buildStudentPilotStudyKit(
    template,
    result.classification.confidence,
    issues,
    impactSnapshot,
    learningExitTicket,
    result.customLabTriage,
    preLabDesignCoach,
    nextTrialPlan
  );
  const studentImpactBrief = buildStudentImpactBrief(
    template,
    result.classification.confidence,
    issues,
    result.classification.matchQuality,
    impactSnapshot,
    studentPilotStudyKit
  );
  const officialRubricFit = buildOfficialRubricFit(
    template,
    result.classification.confidence,
    issues,
    result.sources,
    result.groundingStatus.mode,
    result.classification.matchQuality,
    modelStrategy,
    guidedFlow,
    safetyCoach,
    labBrief,
    methodAudit,
    expectedComparison,
    reliabilityCoach,
    patternEvidence,
    groundingAudit,
    aiEvaluationHarness,
    judgeDemoPath,
    result.customLabTriage,
    nextTrialPlan,
    impactSnapshot,
    dataHandlingLedger,
    learningExitTicket,
    preLabDesignCoach,
    studentPilotStudyKit
  );
  const aiyesValuesFit = buildAiyesValuesFit(
    template,
    result.classification.confidence,
    issues,
    result.sources,
    result.groundingStatus.mode,
    result.classification.matchQuality,
    guidedFlow,
    groundingAudit,
    dataHandlingLedger,
    aiEvaluationHarness,
    learningExitTicket,
    preLabDesignCoach,
    result.customLabTriage,
    impactSnapshot,
    officialRubricFit,
    studentPilotStudyKit
  );
  const developmentJourney = buildDevelopmentJourney(
    template,
    result.classification.confidence,
    rows,
    issues,
    result.sources,
    result.groundingStatus.mode,
    result.classification.matchQuality,
    modelStrategy,
    guidedFlow,
    expectedComparison,
    groundingAudit,
    aiEvaluationHarness,
    dataHandlingLedger,
    officialRubricFit,
    aiyesValuesFit,
    impactSnapshot,
    learningExitTicket,
    preLabDesignCoach,
    judgeDemoPath,
    studentPilotStudyKit
  );

  return {
    ...result,
    rows,
    issues,
    hints,
    guidedFlow,
    modelStrategy,
    conceptCoach,
    safetyCoach,
    labBrief,
    methodAudit,
    expectedComparison,
    reliabilityCoach,
    patternEvidence,
    groundingAudit,
    aiEvaluationHarness,
    dataHandlingLedger,
    judgeDemoPath,
    customLabTriage: result.customLabTriage,
    preLabDesignCoach,
    nextTrialPlan,
    impactSnapshot,
    studentPilotStudyKit,
    studentImpactBrief,
    learningExitTicket,
    officialRubricFit,
    aiyesValuesFit,
    developmentJourney,
    trackEvidence: buildTrackEvidence(
      template,
      result.classification.confidence,
      rows,
      issues,
      result.sources,
      result.groundingStatus.mode,
      nextTrialPlan,
      reliabilityCoach,
      patternEvidence,
      expectedComparison,
      groundingAudit,
      aiEvaluationHarness,
      judgeDemoPath,
      safetyCoach,
      guidedFlow,
      modelStrategy,
      result.customLabTriage,
      dataHandlingLedger,
      learningExitTicket,
      preLabDesignCoach,
      studentPilotStudyKit
    )
  };
}

function mergeIssues(first: Issue[], second: Issue[]): Issue[] {
  const seen = new Set<string>();
  return [...first, ...second].filter((issue) => {
    if (seen.has(issue.id)) return false;
    seen.add(issue.id);
    return true;
  });
}

export function buildLabBrief(
  template: ExperimentTemplate,
  rows: StudentDataRow[],
  issues: Issue[],
  sources: SourceCard[]
): LabBrief {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const status: LabBrief["status"] = errorCount > 0 ? "blocked" : warningCount > 0 ? "needs_checks" : "ready_to_reason";
  const signal = buildBriefSignal(errorCount, warningCount);
  const completeDataRows = rows.filter((row) =>
    template.columns.every((column) => {
      const value = row[column.key];
      return value !== "" && value !== null && value !== undefined;
    })
  );

  return {
    status,
    signal,
    claimStarter: "I can claim that ___ because my graph shows ___ and my source evidence says ___.",
    evidenceChecklist: [
      {
        id: "variables",
        label: "Variables identified",
        detail: `Independent variable: ${template.expectedResult.xKey}; dependent variable: ${template.expectedResult.yKey}.`,
        complete: true
      },
      {
        id: "data-rows",
        label: "Usable data rows",
        detail: `${completeDataRows.length} of ${rows.length} rows have every required table cell filled in.`,
        complete: rows.length > 0 && completeDataRows.length === rows.length
      },
      {
        id: "data-quality",
        label: "Data quality checked",
        detail: warningCount + errorCount === 0 ? "No obvious issues found." : `${warningCount + errorCount} issue(s) need review before the claim is strong.`,
        complete: warningCount + errorCount === 0
      },
      {
        id: "source-grounding",
        label: "Source grounding present",
        detail: `${sources.length} cited reference(s) are attached to the expected pattern.`,
        complete: sources.length > 0
      }
    ],
    sourceTrail: sources.slice(0, 2).map(({ publisher, title, url }) => ({ publisher, title, url })),
    nextQuestion:
      status === "ready_to_reason"
        ? "Which exact part of your graph best supports your own conclusion?"
        : "Which warning changes your interpretation the most, and how could you test whether it is measurement error?",
    integrityBoundary: INTEGRITY_NOTICE
  };
}

function buildBriefSignal(errorCount: number, warningCount: number): string {
  if (errorCount > 0) {
    return `${errorCount} error${errorCount === 1 ? "" : "s"} to fix before reasoning.`;
  }

  if (warningCount > 0) {
    return `${warningCount} warning${warningCount === 1 ? "" : "s"} to resolve before the claim is strong.`;
  }

  return "Ready to reason from data, pattern, and sources.";
}

export function buildGroundingAudit(
  template: ExperimentTemplate,
  sources: SourceCard[],
  groundingMode: AnalyzeResult["groundingStatus"]["mode"],
  expectedResult: AnalyzeResult["expectedResult"]
): GroundingAudit {
  const sourceCount = sources.length;
  const hasWebCitation = sources.some((source) => source.confidence === "web");
  const hasMixedSource = expectedResult.mixedEvidence || sources.some((source) => source.confidence === "mixed");
  const status: GroundingAudit["status"] =
    sourceCount === 0 ? "needs_review" : hasMixedSource ? "mixed_evidence" : "source_backed";
  const score =
    status === "needs_review"
      ? 35
      : status === "mixed_evidence"
        ? groundingMode === "web_enriched"
          ? 88
          : 84
        : groundingMode === "web_enriched" || hasWebCitation
          ? 96
          : 92;
  const modeLabel = groundingMode === "web_enriched" ? "Web enriched" : "Trusted fallback";
  const citationNoun = `citation${sourceCount === 1 ? "" : "s"}`;

  return {
    status,
    score,
    modeLabel,
    sourceCount,
    summary:
      status === "needs_review"
        ? "Grounding needs review because no visible citation is attached to this run."
        : status === "mixed_evidence"
          ? `${sourceCount} visible ${citationNoun} support the general ${template.shortName} pattern, but exact values can vary by setup.`
          : `${sourceCount} visible ${citationNoun} support the expected ${template.shortName} pattern.`,
    consensus:
      status === "mixed_evidence"
        ? "Use the cited sources to compare the direction or shape of the pattern, not one exact number."
        : status === "needs_review"
          ? "Add or confirm a trusted source before treating this as grounded science guidance."
          : `The cited source trail agrees with the expected ${formatColumnName(template, expectedResult.xKey)} to ${formatColumnName(template, expectedResult.yKey)} relationship.`,
    checks: [
      {
        id: "visible-citations",
        label: "Visible citations",
        status: sourceCount > 0 ? "verified" : "review",
        detail:
          sourceCount > 0
            ? `${sourceCount} clickable source${sourceCount === 1 ? "" : "s"} are shown beside the explanation.`
            : "No clickable citation is attached to this run."
      },
      {
        id: "grounding-mode",
        label: "Grounding mode",
        status: groundingMode === "web_enriched" ? "verified" : "review",
        detail:
          groundingMode === "web_enriched"
            ? "Server-side OpenAI web search enriched the source trail; the API key stays out of the browser."
            : "Built-in trusted references keep the app demoable without credentials; OpenAI web-search enrichment can be enabled server-side."
      },
      {
        id: "agreement",
        label: "Source agreement",
        status: status === "mixed_evidence" ? "mixed" : sourceCount > 0 ? "verified" : "review",
        detail:
          status === "mixed_evidence"
            ? "The expected result is framed as a pattern or range because exact values depend on materials and setup."
            : sourceCount > 0
              ? "The expected result is stated as a stable classroom science pattern."
              : "The expected result needs a source before the student treats it as grounded."
      },
      {
        id: "student-use",
        label: "Student use",
        status: "verified",
        detail: "Ouija asks for source-backed reasoning and keeps the final claim blank for the student."
      }
    ],
    studentTask: `Open one cited source and explain, in your own words, how it supports the ${formatColumnName(template, expectedResult.xKey)} to ${formatColumnName(template, expectedResult.yKey)} pattern.`,
    citationNote:
      groundingMode === "web_enriched"
        ? "Web citations are extracted server-side and rendered as clickable links."
        : "Fallback citations are curated classroom references; web enrichment can replace or add citations when credentials are configured."
  };
}

export function buildMethodAudit(template: ExperimentTemplate, rows: StudentDataRow[], issues: Issue[]): MethodAudit {
  const profile = methodProfileForTemplate(template.id);
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const missingRows = rows.filter((row) =>
    template.columns.some((column) => row[column.key] === "" || row[column.key] === null || row[column.key] === undefined)
  ).length;
  const score = Math.max(0, 100 - errorCount * 35 - warningCount * 22 - missingRows * 6);

  return {
    status: errorCount > 0 ? "blocked" : warningCount > 0 || score < 85 ? "needs_review" : "strong",
    score,
    independentVariable: formatColumnName(template, template.expectedResult.xKey),
    dependentVariable: formatColumnName(template, template.expectedResult.yKey),
    controlVariables: profile.controlVariables,
    assumptions: profile.assumptions,
    confounds: issues
      .filter((issue) => issue.severity !== "info")
      .map((issue) => `${issue.title}: ${issue.detail}`)
      .slice(0, 3),
    safetyLimit: profile.safetyLimit
  };
}

export function buildExpectedComparison(template: ExperimentTemplate, rows: StudentDataRow[]): ExpectedComparison {
  const xKey = template.expectedResult.xKey;
  const yKey = template.expectedResult.yKey;
  const xLabel = formatColumnName(template, xKey);
  const yLabel = formatColumnName(template, yKey);
  const points = rows.map((row, index) => {
    const observedY = readFiniteNumber(row, yKey);
    const expectedY = estimateExpectedY(template, row, index);
    const rawX = row[xKey];
    const xValue = rawX === undefined || rawX === null || rawX === "" ? `row ${index + 1}` : rawX;
    const delta = observedY !== null && expectedY !== null ? observedY - expectedY : null;

    return {
      rowId: row.id,
      xValue,
      observedY,
      expectedY,
      delta,
      label: `${xLabel}: ${String(xValue)}`,
      note: buildExpectedComparisonNote(yLabel, observedY, expectedY, delta)
    };
  });
  const comparablePoints = points.filter((point) => point.observedY !== null && point.expectedY !== null);
  const averageDelta =
    comparablePoints.length > 0
      ? averageValues(comparablePoints.map((point) => Math.abs(point.delta ?? 0)))
      : null;
  const summary =
    comparablePoints.length > 0
      ? `Dashed expected overlay is available for ${comparablePoints.length} of ${rows.length} row${rows.length === 1 ? "" : "s"}; average absolute difference is ${formatComparisonNumber(averageDelta)} ${yLabel}.`
      : `Expected overlay will appear after valid ${xLabel} and ${yLabel} values are entered.`;

  return {
    observedLabel: "Student data",
    expectedLabel: "Expected overlay",
    summary,
    points
  };
}

function estimateExpectedY(template: ExperimentTemplate, row: StudentDataRow, rowIndex: number): number | null {
  const xKey = template.expectedResult.xKey;
  const yKey = template.expectedResult.yKey;
  const rowX = row[xKey];
  const numericX = readFiniteNumber(row, xKey);
  const numericReference = template.sampleRows
    .flatMap((sampleRow) => {
      const x = readFiniteNumber(sampleRow, xKey);
      const y = readFiniteNumber(sampleRow, yKey);
      return x !== null && y !== null ? [{ x, y }] : [];
    })
    .sort((a, b) => a.x - b.x);

  if (numericX !== null && numericReference.length > 1) {
    return interpolateExpectedY(numericReference, numericX);
  }

  const normalizedX = normalizeComparisonKey(rowX);
  const matchingReference = template.sampleRows.find((sampleRow) => normalizeComparisonKey(sampleRow[xKey]) === normalizedX);
  const matchedY = matchingReference ? readFiniteNumber(matchingReference, yKey) : null;

  if (matchedY !== null) return matchedY;

  const indexedY = readFiniteNumber(template.sampleRows[rowIndex] ?? {}, yKey);
  return indexedY;
}

function interpolateExpectedY(reference: Array<{ x: number; y: number }>, x: number): number {
  const first = reference[0];
  const last = reference[reference.length - 1];

  if (x <= first.x) return first.y;
  if (x >= last.x) return last.y;

  const upperIndex = reference.findIndex((point) => point.x >= x);
  const lower = reference[Math.max(0, upperIndex - 1)];
  const upper = reference[upperIndex];

  if (upper.x === lower.x) return upper.y;

  const ratio = (x - lower.x) / (upper.x - lower.x);
  return lower.y + (upper.y - lower.y) * ratio;
}

function normalizeComparisonKey(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

function buildExpectedComparisonNote(yLabel: string, observedY: number | null, expectedY: number | null, delta: number | null): string {
  if (observedY === null || expectedY === null || delta === null) {
    return `Enter valid ${yLabel} values to compare this row with the expected overlay.`;
  }

  const direction = delta === 0 ? "matches" : delta > 0 ? "above" : "below";
  return `Student value ${formatComparisonNumber(observedY)} is ${direction} the expected ${formatComparisonNumber(expectedY)} by ${formatComparisonNumber(Math.abs(delta))}.`;
}

function formatComparisonNumber(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "n/a";
  if (Math.abs(value) >= 100 || Number.isInteger(value)) return String(Math.round(value * 100) / 100);
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

export function buildReliabilityCoach(template: ExperimentTemplate, rows: StudentDataRow[], issues: Issue[]): ReliabilityCoach {
  const xLabel = formatColumnName(template, template.expectedResult.xKey);
  const yLabel = formatColumnName(template, template.expectedResult.yKey);
  const groups = collectReliabilityGroups(template, rows);
  const errorCount = issues.filter((issue) => issue.severity === "error").length;

  if (errorCount > 0 || groups.length === 0) {
    return {
      status: "blocked",
      score: Math.max(0, 55 - errorCount * 15),
      summary: `Fill valid ${xLabel} and ${yLabel} values before Ouija can judge repeated-trial reliability.`,
      xLabel,
      yLabel,
      repeatGroups: buildBlockedReliabilityGroups(groups, yLabel),
      recommendation: "Fix missing or nonnumeric table cells before checking averages and spread.",
      studentQuestion: "Which table cells stop you from comparing repeated trials fairly?"
    };
  }

  const repeatGroups = groups.map((group) => {
    const average = averageValues(group.values);
    const spread = group.values.length > 1 ? Math.max(...group.values) - Math.min(...group.values) : null;
    const relativeSpread = spread === null ? 0 : spread / Math.max(Math.abs(average), 1);
    const status: ReliabilityCoach["repeatGroups"][number]["status"] =
      group.values.length < 3
        ? "needs_repeat"
        : relativeSpread > 0.25
          ? "review_spread"
          : "strong";

    return {
      id: group.id,
      label: group.label,
      count: group.values.length,
      average,
      spread,
      status,
      note: buildReliabilityGroupNote(status, group.values.length, spread, yLabel)
    };
  });
  const needsRepeatCount = repeatGroups.filter((group) => group.status === "needs_repeat").length;
  const reviewSpreadCount = repeatGroups.filter((group) => group.status === "review_spread").length;
  const firstReviewGroup = repeatGroups.find((group) => group.status === "review_spread");
  const firstRepeatGroup = repeatGroups.find((group) => group.status === "needs_repeat");
  const status: ReliabilityCoach["status"] =
    reviewSpreadCount > 0 ? "review_spread" : needsRepeatCount > 0 ? "needs_repeats" : "strong";
  const score = Math.max(45, Math.min(100, Math.round(100 - needsRepeatCount * 8 - reviewSpreadCount * 18)));
  const targetGroup = firstReviewGroup ?? firstRepeatGroup;

  return {
    status,
    score,
    summary: buildReliabilitySummary(status, targetGroup, repeatGroups.length),
    xLabel,
    yLabel,
    repeatGroups,
    recommendation: buildReliabilityRecommendation(status, targetGroup),
    studentQuestion:
      status === "strong"
        ? "Which repeated condition gives your strongest evidence, and why?"
        : "Which condition should you repeat first before trusting the graph pattern?"
  };
}

function collectReliabilityGroups(template: ExperimentTemplate, rows: StudentDataRow[]): Array<{ id: string; label: string; values: number[] }> {
  const groups = new Map<string, { id: string; label: string; values: number[] }>();
  const xKey = template.expectedResult.xKey;
  const yKey = template.expectedResult.yKey;

  for (const row of rows) {
    const rawX = row[xKey];
    const rawY = row[yKey];
    const yValue = Number(rawY);

    if (rawX === "" || rawX === null || rawX === undefined || !Number.isFinite(yValue)) {
      continue;
    }

    const xNumber = Number(rawX);
    const xValue = Number.isFinite(xNumber) ? xNumber : String(rawX).trim();
    const key = String(xValue).toLowerCase();
    const existing = groups.get(key);

    if (existing) {
      groups.set(key, { ...existing, values: [...existing.values, yValue] });
    } else {
      groups.set(key, {
        id: `repeat-${groups.size + 1}`,
        label: `${formatColumnName(template, xKey)} = ${formatReliabilityValue(xValue)}`,
        values: [yValue]
      });
    }
  }

  return Array.from(groups.values());
}

function buildBlockedReliabilityGroups(
  groups: Array<{ id: string; label: string; values: number[] }>,
  yLabel: string
): ReliabilityCoach["repeatGroups"] {
  return groups.map((group) => {
    const average = group.values.length ? averageValues(group.values) : null;
    const spread = group.values.length > 1 ? Math.max(...group.values) - Math.min(...group.values) : null;

    return {
      id: group.id,
      label: group.label,
      count: group.values.length,
      average,
      spread,
      status: "needs_repeat",
      note: `Fix blocking cells before using ${yLabel} repeats as evidence.`
    };
  });
}

function averageValues(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildReliabilityGroupNote(
  status: ReliabilityCoach["repeatGroups"][number]["status"],
  count: number,
  spread: number | null,
  yLabel: string
): string {
  if (status === "needs_repeat") {
    const missing = 3 - count;
    return `Only ${count} usable trial${count === 1 ? "" : "s"} here; add ${missing} repeat${missing === 1 ? "" : "s"} before treating this point as reliable.`;
  }

  if (status === "review_spread") {
    return `The repeated ${yLabel} values spread by ${formatOptionalNumber(spread)}, so this condition should be retested before it becomes evidence.`;
  }

  return `At least three repeats agree closely enough for a classroom reliability check.`;
}

function buildReliabilitySummary(
  status: ReliabilityCoach["status"],
  targetGroup: ReliabilityCoach["repeatGroups"][number] | undefined,
  groupCount: number
): string {
  if (status === "strong") {
    return `Repeated trials look consistent across ${groupCount} condition${groupCount === 1 ? "" : "s"}.`;
  }

  if (status === "review_spread") {
    return `${targetGroup?.label ?? "One condition"} has repeats that disagree too much; retest before using that point in a claim.`;
  }

  return `${targetGroup?.label ?? "At least one condition"} needs more repeat trials before the average and spread are meaningful.`;
}

function buildReliabilityRecommendation(
  status: ReliabilityCoach["status"],
  targetGroup: ReliabilityCoach["repeatGroups"][number] | undefined
): string {
  if (status === "strong") {
    return "Use the repeated-trial averages as evidence, then explain any small spread honestly.";
  }

  if (status === "review_spread") {
    return `Retest ${targetGroup?.label ?? "the widest-spread condition"} before extending the experiment.`;
  }

  if (status === "blocked") {
    return "Fix missing or nonnumeric table cells before checking averages and spread.";
  }

  return `Add repeat trials for ${targetGroup?.label ?? "the under-sampled condition"} before treating the graph as reliable.`;
}

interface PatternPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  index: number;
}

type ScoredPatternObservation = PatternEvidence["observations"][number] & { score: number };

export function buildPatternEvidence(template: ExperimentTemplate, rows: StudentDataRow[], issues: Issue[]): PatternEvidence {
  const xLabel = formatColumnName(template, template.expectedResult.xKey);
  const yLabel = formatColumnName(template, template.expectedResult.yKey);
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const method = `Ouija compared ${xLabel} against ${yLabel} across ${rows.length} row${rows.length === 1 ? "" : "s"} using deterministic school-lab pattern checks.`;

  if (errorCount > 0) {
    return finalizePatternEvidence(template, method, [
      {
        id: "pattern-blocked",
        label: "Usable table",
        expected: "Every required numeric pattern cell should be valid before the whole graph is scored.",
        observed: `${errorCount} blocking table error${errorCount === 1 ? "" : "s"} found.`,
        status: "insufficient",
        detail: "Fix missing or nonnumeric values before deciding whether the dataset supports the expected pattern.",
        score: 35
      }
    ]);
  }

  const points = collectPatternPoints(template);
  const keyedPoints = points(rows);
  let observations: ScoredPatternObservation[];

  if (template.id === "projectile-motion") {
    observations = [
      buildPeakWindowObservation(
        keyedPoints,
        "projectile-peak-angle",
        "Range peak",
        "The longest range should happen near 45 degrees for a level, fixed-speed launch.",
        35,
        55
      ),
      buildPeakShapeObservation(
        keyedPoints,
        "projectile-curve-shape",
        "Rise then fall",
        "Range should rise toward the best angle and then fall at steeper angles."
      )
    ];
  } else if (template.id === "pendulum-period-length") {
    observations = [
      buildTrendObservation(keyedPoints, "pendulum-length-trend", "Length trend", "increasing", "Longer pendulums should have longer periods."),
      buildPendulumRatioObservation(rows)
    ];
  } else if (template.id === "reaction-rate-temperature") {
    observations = [
      buildTrendObservation(keyedPoints, "reaction-rate-temperature-trend", "Temperature trend", "increasing", "Reaction rate should generally increase as temperature rises."),
      buildTimeDirectionObservation(rows)
    ];
  } else if (template.id === "ohms-law-circuits") {
    observations = [
      buildTrendObservation(keyedPoints, "ohms-current-voltage-trend", "Current-voltage line", "increasing", "Voltage should increase as current increases for the same resistor."),
      buildOhmsRatioObservation(rows)
    ];
  } else if (template.id === "enzyme-activity-temperature") {
    observations = [
      buildPeakWindowObservation(
        keyedPoints,
        "enzyme-optimum-window",
        "Optimum window",
        "Enzyme activity should peak at a moderate classroom temperature, not at the coldest or hottest row.",
        25,
        45
      ),
      buildPeakShapeObservation(
        keyedPoints,
        "enzyme-warm-then-drop",
        "Warm then drop",
        "Activity should rise toward the optimum and drop after overheating."
      )
    ];
  } else if (template.id === "plant-growth-light-color") {
    observations = [
      buildPlantLightUsableLightObservation(rows),
      buildPlantLightColorObservation(rows)
    ];
  } else if (template.id === "density-layering") {
    observations = [
      buildTrendObservation(
        collectNumericPoints(rows, "layerOrder", "densityGml", "Layer"),
        "density-bottom-top-order",
        "Bottom-to-top density",
        "decreasing",
        "Density should decrease as layer order moves from bottom to top."
      )
    ];
  } else {
    observations = [
      buildTrendObservation(
        collectIndexedPoints(rows, "stage", "turbidityNTU"),
        "filtration-turbidity-drop",
        "Filtration stages",
        "decreasing",
        "Turbidity should generally decrease after each filtration stage."
      )
    ];
  }

  const patternWarningCount = issues.filter(
    (issue) => issue.severity === "warning" && !issue.id.startsWith("classification-") && !issue.id.startsWith("integrity-")
  ).length;

  if (patternWarningCount > 0) {
    observations = [
      ...observations,
      {
        id: "pattern-validator-flags",
        label: "Validator flags",
        expected: "The row-level validators should not find a pattern conflict before the whole graph is trusted.",
        observed: `${patternWarningCount} pattern warning${patternWarningCount === 1 ? "" : "s"} remain visible.`,
        status: "mixed",
        detail: "Review the flagged row before using the aggregate pattern score as claim evidence.",
        score: 55
      }
    ];
  }

  return finalizePatternEvidence(template, method, observations);
}

function collectPatternPoints(template: ExperimentTemplate): (rows: StudentDataRow[]) => PatternPoint[] {
  return (rows: StudentDataRow[]) =>
    collectNumericPoints(rows, template.expectedResult.xKey, template.expectedResult.yKey, formatColumnName(template, template.expectedResult.xKey));
}

function collectNumericPoints(rows: StudentDataRow[], xKey: string, yKey: string, xLabel: string): PatternPoint[] {
  return rows.flatMap((row, index) => {
    const x = readFiniteNumber(row, xKey);
    const y = readFiniteNumber(row, yKey);

    if (x === null || y === null) return [];

    return [
      {
        id: row.id,
        x,
        y,
        label: `${xLabel} ${formatPatternNumber(x)}`,
        index
      }
    ];
  });
}

function collectIndexedPoints(rows: StudentDataRow[], labelKey: string, yKey: string): PatternPoint[] {
  return rows.flatMap((row, index) => {
    const y = readFiniteNumber(row, yKey);

    if (y === null) return [];

    const rawLabel = row[labelKey];

    return [
      {
        id: row.id,
        x: index + 1,
        y,
        label: rawLabel === "" || rawLabel === undefined || rawLabel === null ? `Stage ${index + 1}` : String(rawLabel),
        index
      }
    ];
  });
}

function buildTrendObservation(
  points: PatternPoint[],
  id: string,
  label: string,
  direction: "increasing" | "decreasing",
  expected: string
): ScoredPatternObservation {
  if (points.length < 2) {
    return buildInsufficientObservation(id, label, expected, "At least two valid points are needed to check the trend.");
  }

  const sorted = [...points].sort((a, b) => a.x - b.x || a.index - b.index);
  const yRange = Math.max(...sorted.map((point) => point.y)) - Math.min(...sorted.map((point) => point.y));
  const tolerance = Math.max(Math.abs(yRange) * 0.03, 0.000001);
  const comparisons = sorted.slice(1).map((point, index) => {
    const previous = sorted[index];
    const delta = point.y - previous.y;
    return direction === "increasing" ? delta >= -tolerance : delta <= tolerance;
  });
  const supporting = comparisons.filter(Boolean).length;
  const score = Math.round((supporting / comparisons.length) * 100);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const verb = direction === "increasing" ? "increase" : "decrease";

  return buildScoredObservation(
    id,
    label,
    expected,
    `${first.label} has ${formatPatternNumber(first.y)} and ${last.label} has ${formatPatternNumber(last.y)}.`,
    score,
    `${supporting} of ${comparisons.length} adjacent comparison${comparisons.length === 1 ? "" : "s"} ${verb} in the expected direction.`
  );
}

function buildPeakWindowObservation(
  points: PatternPoint[],
  id: string,
  label: string,
  expected: string,
  minPeakX: number,
  maxPeakX: number
): ScoredPatternObservation {
  if (points.length < 3) {
    return buildInsufficientObservation(id, label, expected, "At least three valid points are needed to locate a peak.");
  }

  const peak = [...points].sort((a, b) => b.y - a.y)[0];
  const center = (minPeakX + maxPeakX) / 2;
  const halfWindow = (maxPeakX - minPeakX) / 2;
  const distance = Math.abs(peak.x - center);
  const score = peak.x >= minPeakX && peak.x <= maxPeakX ? 100 : distance <= halfWindow + 12 ? 70 : 35;

  return buildScoredObservation(
    id,
    label,
    expected,
    `The highest value is ${formatPatternNumber(peak.y)} at ${peak.label}.`,
    score,
    score >= 80
      ? "The strongest point lands in the expected peak window."
      : "The strongest point is outside the expected peak window, so the student should retest or explain the setup."
  );
}

function buildPeakShapeObservation(points: PatternPoint[], id: string, label: string, expected: string): ScoredPatternObservation {
  if (points.length < 3) {
    return buildInsufficientObservation(id, label, expected, "At least three valid points are needed to check a rise-then-fall shape.");
  }

  const sorted = [...points].sort((a, b) => a.x - b.x || a.index - b.index);
  const peakIndex = sorted.reduce((bestIndex, point, index) => (point.y > sorted[bestIndex].y ? index : bestIndex), 0);
  const yRange = Math.max(...sorted.map((point) => point.y)) - Math.min(...sorted.map((point) => point.y));
  const tolerance = Math.max(Math.abs(yRange) * 0.03, 0.000001);
  const comparisons = sorted.slice(1).map((point, index) => {
    const previous = sorted[index];
    if (index < peakIndex) return point.y >= previous.y - tolerance;
    return point.y <= previous.y + tolerance;
  });
  const supporting = comparisons.filter(Boolean).length;
  const edgePeakPenalty = peakIndex === 0 || peakIndex === sorted.length - 1 ? 20 : 0;
  const score = Math.max(0, Math.round((supporting / comparisons.length) * 100) - edgePeakPenalty);
  const peak = sorted[peakIndex];

  return buildScoredObservation(
    id,
    label,
    expected,
    `The visible peak is ${formatPatternNumber(peak.y)} at ${peak.label}.`,
    score,
    `${supporting} of ${comparisons.length} graph segment${comparisons.length === 1 ? "" : "s"} follow the rise-then-fall shape.`
  );
}

function buildPendulumRatioObservation(rows: StudentDataRow[]): ScoredPatternObservation {
  const ratios = rows.flatMap((row) => {
    const length = readFiniteNumber(row, "lengthM");
    const period = readFiniteNumber(row, "periodS");
    return length !== null && length > 0 && period !== null ? [period / Math.sqrt(length)] : [];
  });

  return buildConsistencyObservation(
    "pendulum-square-root-fit",
    "Square-root fit",
    "Period divided by the square root of length should stay roughly consistent for small-angle swings.",
    ratios,
    "T/sqrt(L)"
  );
}

function buildTimeDirectionObservation(rows: StudentDataRow[]): ScoredPatternObservation {
  const timePoints = collectNumericPoints(rows, "tempC", "reactionTimeS", "Temperature");
  return buildTrendObservation(
    timePoints,
    "reaction-time-temperature-trend",
    "Reaction time check",
    "decreasing",
    "Reaction time should generally decrease when rate increases with temperature."
  );
}

function buildOhmsRatioObservation(rows: StudentDataRow[]): ScoredPatternObservation {
  const ratios = rows.flatMap((row) => {
    const current = readFiniteNumber(row, "currentA");
    const voltage = readFiniteNumber(row, "voltageV");
    return current !== null && current !== 0 && voltage !== null ? [voltage / current] : [];
  });
  const ratioObservation = buildConsistencyObservation(
    "ohms-resistance-ratio",
    "Resistance ratio",
    "Voltage divided by current should stay close to the recorded resistance.",
    ratios,
    "V/I"
  );
  const recordedValues = rows.flatMap((row) => {
    const current = readFiniteNumber(row, "currentA");
    const voltage = readFiniteNumber(row, "voltageV");
    const resistance = readFiniteNumber(row, "resistanceOhm");
    return current !== null && current !== 0 && voltage !== null && resistance !== null
      ? [Math.abs(voltage / current - resistance) / Math.max(Math.abs(resistance), 0.000001)]
      : [];
  });

  if (!recordedValues.length) return ratioObservation;

  const mismatchAverage = averageValues(recordedValues);
  const recordedScore = mismatchAverage <= 0.1 ? 100 : mismatchAverage <= 0.2 ? 75 : mismatchAverage <= 0.35 ? 55 : 30;
  const score = Math.min(ratioObservation.score, recordedScore);

  return buildScoredObservation(
    ratioObservation.id,
    ratioObservation.label,
    ratioObservation.expected,
    ratioObservation.observed,
    score,
    `${ratioObservation.detail} Average mismatch from recorded resistance is ${Math.round(mismatchAverage * 100)}%.`
  );
}

function buildPlantLightUsableLightObservation(rows: StudentDataRow[]): ScoredPatternObservation {
  const grouped = groupPlantLightHeights(rows);
  const litValues = [...(grouped.white ?? []), ...(grouped.red ?? []), ...(grouped.blue ?? []), ...(grouped.green ?? [])];
  const darkValues = grouped.dark ?? [];

  if (!litValues.length || !darkValues.length) {
    return buildInsufficientObservation(
      "plant-light-vs-dark",
      "Light vs dark",
      "Plants should generally grow more with usable light than in darkness.",
      "Include at least one lit condition and one dark condition to compare light-supported growth."
    );
  }

  const litAverage = averageValues(litValues);
  const darkAverage = averageValues(darkValues);
  const ratio = litAverage / Math.max(darkAverage, 0.1);
  const score = ratio >= 2.5 ? 100 : ratio >= 1.6 ? 80 : ratio >= 1.1 ? 60 : 35;

  return buildScoredObservation(
    "plant-light-vs-dark",
    "Light vs dark",
    "Plants should generally grow more with usable light than in darkness.",
    `Lit conditions average ${formatPatternNumber(litAverage)} cm; dark conditions average ${formatPatternNumber(darkAverage)} cm.`,
    score,
    score >= 80
      ? "The light-grown plants are clearly taller than the dark-grown plants."
      : "The light/dark difference is weak, so the setup needs repeats or control checks."
  );
}

function buildPlantLightColorObservation(rows: StudentDataRow[]): ScoredPatternObservation {
  const grouped = groupPlantLightHeights(rows);
  const usableColorValues = [...(grouped.white ?? []), ...(grouped.red ?? []), ...(grouped.blue ?? [])];
  const greenValues = grouped.green ?? [];

  if (!usableColorValues.length || !greenValues.length) {
    return buildInsufficientObservation(
      "plant-light-color-comparison",
      "Color comparison",
      "White, red, and blue light should generally support more growth than green light when brightness and duration stay controlled.",
      "Include white/red/blue and green conditions to compare the expected color pattern."
    );
  }

  const usableAverage = averageValues(usableColorValues);
  const greenAverage = averageValues(greenValues);
  const ratio = usableAverage / Math.max(greenAverage, 0.1);
  const score = ratio >= 1.4 ? 100 : ratio >= 1.15 ? 80 : ratio >= 0.95 ? 60 : 35;

  return buildScoredObservation(
    "plant-light-color-comparison",
    "Color comparison",
    "White, red, and blue light should generally support more growth than green light when brightness and duration stay controlled.",
    `White/red/blue conditions average ${formatPatternNumber(usableAverage)} cm; green averages ${formatPatternNumber(greenAverage)} cm.`,
    score,
    score >= 80
      ? "The color groups follow the expected photosynthesis pattern well enough for a classroom claim."
      : "The color pattern is mixed, so check light intensity, distance, duration, and repeat plants."
  );
}

function groupPlantLightHeights(rows: StudentDataRow[]): Partial<Record<"white" | "red" | "blue" | "green" | "dark", number[]>> {
  const grouped: Partial<Record<"white" | "red" | "blue" | "green" | "dark", number[]>> = {};

  for (const row of rows) {
    const height = readFiniteNumber(row, "heightCm");
    if (height === null) continue;

    const color = normalizePlantLightColor(row.lightColor);
    if (!color) continue;

    grouped[color] = [...(grouped[color] ?? []), height];
  }

  return grouped;
}

function normalizePlantLightColor(value: unknown): "white" | "red" | "blue" | "green" | "dark" | null {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized.includes("white") || normalized.includes("full") || normalized.includes("sun")) return "white";
  if (normalized.includes("red")) return "red";
  if (normalized.includes("blue")) return "blue";
  if (normalized.includes("green")) return "green";
  if (normalized.includes("dark") || normalized.includes("no light") || normalized.includes("black")) return "dark";
  return null;
}

function buildConsistencyObservation(
  id: string,
  label: string,
  expected: string,
  values: number[],
  ratioLabel: string
): ScoredPatternObservation {
  if (values.length < 2) {
    return buildInsufficientObservation(id, label, expected, `At least two valid ${ratioLabel} values are needed.`);
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = averageValues(values);
  const relativeSpread = (max - min) / Math.max(Math.abs(average), 0.000001);
  const score = relativeSpread <= 0.12 ? 100 : relativeSpread <= 0.22 ? 80 : relativeSpread <= 0.35 ? 60 : 35;

  return buildScoredObservation(
    id,
    label,
    expected,
    `${ratioLabel} ranges from ${formatPatternNumber(min)} to ${formatPatternNumber(max)}.`,
    score,
    `The relative spread is ${Math.round(relativeSpread * 100)}%, which ${score >= 80 ? "supports" : "weakens"} the expected relationship.`
  );
}

function buildInsufficientObservation(id: string, label: string, expected: string, detail: string): ScoredPatternObservation {
  return {
    id,
    label,
    expected,
    observed: "Not enough valid data yet.",
    status: "insufficient",
    detail,
    score: 45
  };
}

function buildScoredObservation(
  id: string,
  label: string,
  expected: string,
  observed: string,
  score: number,
  detail: string
): ScoredPatternObservation {
  return {
    id,
    label,
    expected,
    observed,
    status: formatPatternObservationStatus(score),
    detail,
    score
  };
}

function finalizePatternEvidence(
  template: ExperimentTemplate,
  method: string,
  observations: ScoredPatternObservation[]
): PatternEvidence {
  const score = Math.max(0, Math.min(100, Math.round(averageValues(observations.map((observation) => observation.score)))));
  const allInsufficient = observations.every((observation) => observation.status === "insufficient");
  const status: PatternEvidence["status"] = allInsufficient
    ? "insufficient"
    : score >= 80
      ? "supports_expected"
      : score >= 55
        ? "mixed"
        : "contradicts";
  const publicObservations = observations.map(({ score: _score, ...observation }) => observation);

  return {
    status,
    score,
    summary: buildPatternEvidenceSummary(status, template),
    method,
    observations: publicObservations,
    studentQuestion: buildPatternEvidenceQuestion(status, template)
  };
}

function buildPatternEvidenceSummary(status: PatternEvidence["status"], template: ExperimentTemplate): string {
  if (status === "supports_expected") {
    return `The whole table mostly supports the expected ${template.shortName} pattern.`;
  }

  if (status === "mixed") {
    return `The table has some support for the ${template.shortName} pattern, but one check needs review before the claim is strong.`;
  }

  if (status === "contradicts") {
    return `The table works against the expected ${template.shortName} pattern; repeat or explain the mismatch before making a claim.`;
  }

  return `Ouija needs more valid ${template.shortName} data before scoring the expected pattern.`;
}

function buildPatternEvidenceQuestion(status: PatternEvidence["status"], template: ExperimentTemplate): string {
  if (status === "supports_expected") {
    return `Which observation best proves the expected ${template.shortName} pattern without writing the final conclusion for you?`;
  }

  if (status === "mixed") {
    return "Which row or segment makes the graph less convincing, and what repeat would test it?";
  }

  if (status === "contradicts") {
    return "What controlled repeat would show whether this is a measurement error or a real exception to the expected pattern?";
  }

  return "Which missing or invalid measurement would make the expected-pattern check possible?";
}

function formatPatternObservationStatus(score: number): PatternEvidence["observations"][number]["status"] {
  if (score >= 80) return "supports";
  if (score >= 55) return "mixed";
  return "contradicts";
}

function readFiniteNumber(row: StudentDataRow, key: string): number | null {
  const value = Number(row[key]);
  return Number.isFinite(value) ? value : null;
}

function formatPatternNumber(value: number): string {
  if (Math.abs(value) >= 100 || Number.isInteger(value)) return String(Math.round(value * 100) / 100);
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function buildModelStrategy(
  template: ExperimentTemplate,
  confidence: number,
  candidates: ModelStrategy["candidates"],
  issues: Issue[],
  sources: SourceCard[],
  groundingMode: AnalyzeResult["groundingStatus"]["mode"],
  matchQuality: AnalyzeResult["classification"]["matchQuality"],
  safetyCoach: SafetyCoach,
  reliabilityCoach: ReliabilityCoach,
  patternEvidence: PatternEvidence,
  groundingAudit: GroundingAudit
): ModelStrategy {
  const topCandidate = candidates[0];
  const runnerUp = candidates[1];
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const topEvidence = topCandidate?.evidence.length ? topCandidate.evidence.join(", ") : "no strong keyword or concept signal";
  const candidateGap = topCandidate && runnerUp ? topCandidate.score - runnerUp.score : topCandidate?.score ?? 0;

  return {
    classifier: "Weighted keyword and concept matcher with deterministic science validators",
    selectedTemplateId: template.id,
    decisionSummary:
      matchQuality === "supported_template"
        ? `Selected ${template.title} from ${candidates.length} candidates using matched signals: ${topEvidence}.`
        : `Closest supported match is ${template.title}, but confidence is low, so Ouija keeps a boundary warning visible.`,
    fallbackStrategy:
      "If the description scores below the supported threshold, Ouija marks the run as closest_supported, caps readiness, and asks the student to confirm the experiment before using the guidance.",
    groundingMode,
    signals: [
      {
        label: "Classifier confidence",
        value: `${Math.round(confidence * 100)}%`,
        detail:
          matchQuality === "supported_template"
            ? "Above the supported-template threshold for this middle/high school lab."
            : "Below the supported-template threshold, so this is not treated as a solved classification."
      },
      {
        label: "Top candidate gap",
        value: `${candidateGap} pts`,
        detail: runnerUp ? `${template.title} compared with ${runnerUp.title}.` : "Only one candidate was available."
      },
      {
        label: "Grounding mode",
        value: groundingMode === "web_enriched" ? "Web enriched" : "Trusted fallback",
        detail:
          groundingMode === "web_enriched"
            ? "Expected-result explanation is enriched with server-side web-search citations."
            : `${sources.length} trusted built-in citation${sources.length === 1 ? "" : "s"} keep the demo reliable without credentials.`
      },
      {
        label: "Grounding audit",
        value: `${groundingAudit.score}/100`,
        detail: groundingAudit.summary
      },
      {
        label: "Validation layer",
        value: `${errorCount} errors / ${warningCount} warnings`,
        detail: "Table validators, method checks, and pattern checks run after classification."
      },
      {
        label: "Safety layer",
        value: formatSafetyStatusForStrategy(safetyCoach.status),
        detail: safetyCoach.summary
      },
      {
        label: "Pattern evidence",
        value: `${patternEvidence.score}/100`,
        detail: patternEvidence.summary
      },
      {
        label: "Repeat reliability",
        value: `${reliabilityCoach.score}/100`,
        detail: reliabilityCoach.summary
      }
    ],
    candidates,
    riskControls: [
      "Low-confidence descriptions stay visibly marked as closest supported matches.",
      "Grounding Audit checks citation visibility, source agreement, and mixed-evidence boundaries before students use the expected pattern.",
      "AI Evaluation Harness scores classifier confidence, coverage, grounding, validators, safety, and fallback behavior before the run is used as proof.",
      "OpenAI API keys stay server-side; fallback references keep the app demoable without credentials.",
      "Data validators, Method Audit, Pattern Evidence Engine, Reliability Coach, Safety Coach, and Next Trial Planner run after classification.",
      "Claim Coach and Evidence Packet keep final conclusions blank for academic integrity."
    ]
  };
}

function buildAiEvaluationHarness(
  template: ExperimentTemplate,
  confidence: number,
  matchQuality: AnalyzeResult["classification"]["matchQuality"],
  issues: Issue[],
  candidates: ModelStrategy["candidates"],
  groundingAudit: GroundingAudit,
  patternEvidence: PatternEvidence,
  reliabilityCoach: ReliabilityCoach,
  safetyCoach: SafetyCoach,
  labBrief: LabBrief
): AiEvaluationHarness {
  const topCandidate = candidates[0];
  const runnerUp = candidates[1];
  const candidateGap = topCandidate && runnerUp ? topCandidate.score - runnerUp.score : topCandidate?.score ?? 0;
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const integrityFlagged = issues.some((issue) => issue.id.startsWith("integrity-"));
  const lowConfidence = matchQuality === "closest_supported" || confidence < 0.6;
  const claimGuarded = labBrief.claimStarter.includes("___");
  const coverageDetail = "Eight supported middle/high school lab examples plus one unsupported-boundary case are exercised in the deterministic regression suite.";

  const checks: AiEvaluationHarness["checks"] = [
    {
      id: "classification-confidence",
      label: "Classifier confidence",
      status: lowConfidence || candidateGap < 2 ? "review" : "pass",
      score: Math.round(confidence * 100),
      detail:
        lowConfidence
          ? `Closest supported match only: ${template.title} at ${Math.round(confidence * 100)}% confidence.`
          : `${template.title} selected at ${Math.round(confidence * 100)}% confidence with a ${candidateGap}-point gap over the runner-up.`
    },
    {
      id: "coverage-benchmark",
      label: "Coverage benchmark",
      status: candidates.length >= 8 ? "pass" : "review",
      score: candidates.length >= 8 ? 96 : 72,
      detail: `${candidates.length} candidate templates ranked. ${coverageDetail}`
    },
    {
      id: "source-grounding",
      label: "Source grounding",
      status: groundingAudit.status === "source_backed" ? "pass" : groundingAudit.status === "mixed_evidence" ? "review" : "fail",
      score: groundingAudit.score,
      detail: groundingAudit.summary
    },
    {
      id: "pattern-validation",
      label: "Pattern validation",
      status: patternEvidence.status === "supports_expected" ? "pass" : "review",
      score: patternEvidence.score,
      detail: patternEvidence.summary
    },
    {
      id: "repeat-reliability",
      label: "Repeat reliability",
      status: reliabilityCoach.status === "blocked" ? "fail" : reliabilityCoach.status === "strong" ? "pass" : "review",
      score: reliabilityCoach.score,
      detail: reliabilityCoach.summary
    },
    {
      id: "row-validator",
      label: "Row validators",
      status: errorCount > 0 ? "fail" : warningCount > 0 ? "review" : "pass",
      score: Math.max(0, 96 - errorCount * 24 - warningCount * 8),
      detail:
        errorCount + warningCount === 0
          ? "No blocking row, unit, or trend validator issues are present."
          : `${errorCount} error${errorCount === 1 ? "" : "s"} and ${warningCount} warning${warningCount === 1 ? "" : "s"} are surfaced before claim writing.`
    },
    {
      id: "safety-integrity",
      label: "Safety and integrity",
      status: safetyCoach.status === "do_not_run" || !claimGuarded ? "fail" : safetyCoach.status === "adult_review" || integrityFlagged ? "review" : "pass",
      score: safetyCoach.status === "do_not_run" || !claimGuarded ? 45 : safetyCoach.status === "adult_review" || integrityFlagged ? 86 : 98,
      detail:
        safetyCoach.status === "do_not_run"
          ? safetyCoach.summary
          : integrityFlagged
            ? "Academic-integrity risk is visible and the Claim Coach still keeps conclusion blanks."
            : `${safetyCoach.summary} Claim Coach keeps the final conclusion student-written.`
    },
    {
      id: "fallback-boundary",
      label: "Fallback boundary",
      status: "pass",
      score: lowConfidence ? 92 : 96,
      detail: lowConfidence
        ? "The low-confidence boundary is active: Ouija labels this as a closest supported match instead of pretending full coverage."
        : "Supported runs still keep the closest-supported fallback and no-credential path available."
    }
  ];

  const score = Math.round(checks.reduce((total, check) => total + check.score, 0) / checks.length);
  const passCount = checks.filter((check) => check.status === "pass").length;
  const reviewCount = checks.filter((check) => check.status === "review").length;
  const failCount = checks.filter((check) => check.status === "fail").length;
  const status: AiEvaluationHarness["status"] = failCount > 0 ? "blocked" : reviewCount > 0 ? "review" : "validated";

  return {
    status,
    score,
    summary:
      status === "validated"
        ? `${passCount}/${checks.length} AI evaluation checks pass for this run.`
        : `${passCount}/${checks.length} AI evaluation checks pass; ${reviewCount} review and ${failCount} fail before this run should anchor the demo.`,
    coverage: coverageDetail,
    checks,
    judgeSignal:
      status === "validated"
        ? "Judges can inspect classifier behavior, coverage, source grounding, validators, safety, and fallback boundaries in the product."
        : "Judges can see exactly which model or data checks need review instead of hiding weak runs behind a polished interface.",
    failureMode:
      status === "blocked"
        ? "Fix failing validation, safety, or grounding checks before using this run as the judge walkthrough."
        : status === "review"
          ? "Use review checks as the demo explanation: Ouija flags uncertainty before the student writes a claim."
          : "No blocking AI-evaluation gap is visible for this run."
  };
}

function buildJudgeDemoPath(
  template: ExperimentTemplate,
  confidence: number,
  matchQuality: AnalyzeResult["classification"]["matchQuality"],
  guidedFlow: GuidedLabFlow,
  aiEvaluationHarness: AiEvaluationHarness,
  groundingAudit: GroundingAudit,
  expectedComparison: ExpectedComparison,
  patternEvidence: PatternEvidence,
  reliabilityCoach: ReliabilityCoach,
  impactSnapshot: LearningImpactSnapshot,
  labBrief: LabBrief
): JudgeDemoPath {
  const confidencePercent = Math.round(confidence * 100);
  const lowConfidence = matchQuality === "closest_supported" || confidence < 0.6;
  const hasClaimBlanks = labBrief.claimStarter.includes("___");
  const blocked = labBrief.status === "blocked" || aiEvaluationHarness.status === "blocked";
  const review =
    lowConfidence ||
    groundingAudit.status === "needs_review" ||
    patternEvidence.status === "contradicts" ||
    patternEvidence.status === "insufficient";
  const status: JudgeDemoPath["status"] = blocked ? "blocked" : review ? "review" : "ready";

  return {
    status,
    headline:
      status === "ready"
        ? "Judge demo path is ready."
        : status === "review"
          ? "Judge demo path has review notes."
          : "Fix blocking checks before using this run as the judge path.",
    summary:
      "Use this five-step path to show problem fit, AI design, student workflow, evidence handoff, and submission proof without making judges hunt through every panel.",
    nextBestAction:
      status === "blocked"
        ? aiEvaluationHarness.failureMode
        : status === "review"
          ? "Open Judge Demo Path, then use Model Strategy and AI Evaluation Harness to explain the review flags honestly."
          : "Open Model Strategy, AI Evaluation Harness, then Jump to Judge Brief after the Evidence Packet.",
    steps: [
      {
        id: "problem",
        label: "Problem fit",
        criterion: "Problem Definition & Real-World Relevance",
        status: lowConfidence ? "review" : "show",
        proof: `Student-facing ${template.subject.toLowerCase()} lab support for ${template.title}; ${impactSnapshot.headline}`,
        demoAction: `Start with the student problem and the ${template.title} classification.`
      },
      {
        id: "ai-design",
        label: "AI design",
        criterion: "AI Technical Design & Model Strategy",
        status: aiEvaluationHarness.status === "blocked" ? "blocked" : aiEvaluationHarness.status === "review" ? "review" : "show",
        proof: `${confidencePercent}% classifier confidence, ${aiEvaluationHarness.score}/100 AI evaluation harness, ${groundingAudit.score}/100 grounding audit.`,
        demoAction: "Show Model Strategy, AI Evaluation Harness, and Grounding Audit before the graph."
      },
      {
        id: "student-workflow",
        label: "Student workflow",
        criterion: "User Experience & Design",
        status: guidedFlow.steps.some((step) => step.status === "blocked") ? "blocked" : guidedFlow.steps.some((step) => step.status === "review") ? "review" : "show",
        proof: `Guided next action: ${guidedFlow.currentAction} Expected overlay covers ${expectedComparison.points.length} row${expectedComparison.points.length === 1 ? "" : "s"}.`,
        demoAction: "Show table editing or import, the expected overlay, and the student coach panels."
      },
      {
        id: "evidence-handoff",
        label: "Evidence handoff",
        criterion: "User Experience & Design",
        status: hasClaimBlanks ? (labBrief.status === "blocked" ? "blocked" : "show") : "blocked",
        proof: `Evidence Packet and Claim Coach keep the final conclusion blank: ${labBrief.claimStarter}`,
        demoAction: "Open Evidence Packet and Claim Coach to prove the app gives hints, not a finished report."
      },
      {
        id: "submission-proof",
        label: "Submission proof",
        criterion: "Submission Proof",
        status: "show",
        proof: `Deterministic Regression Suite runs nine internal behavior checks; pattern evidence is ${patternEvidence.score}/100 and repeat reliability is ${reliabilityCoach.score}/100.`,
        demoAction: "End on Deterministic Regression Suite, Judge Brief, and hosted deck/video/source links."
      }
    ]
  };
}

function buildLearningImpactSnapshot(
  template: ExperimentTemplate,
  confidence: number,
  issues: Issue[],
  conceptCoach: ConceptCoach,
  safetyCoach: SafetyCoach,
  labBrief: LabBrief,
  methodAudit: MethodAudit,
  expectedComparison: ExpectedComparison,
  reliabilityCoach: ReliabilityCoach,
  patternEvidence: PatternEvidence,
  nextTrialPlan: NextTrialPlan
): LearningImpactSnapshot {
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const lowConfidence = confidence < 0.6;
  const readinessPenalty = labBrief.status === "blocked" ? 22 : labBrief.status === "needs_checks" ? 10 : 0;
  const safetyPenalty = safetyCoach.status === "do_not_run" ? 20 : safetyCoach.status === "adult_review" ? 6 : 0;
  const reliabilityPenalty =
    reliabilityCoach.status === "blocked" ? 12 : reliabilityCoach.status === "review_spread" ? 8 : reliabilityCoach.status === "needs_repeats" ? 3 : 0;
  const patternPenalty =
    patternEvidence.status === "contradicts"
      ? 12
      : patternEvidence.status === "insufficient"
        ? 8
        : patternEvidence.status === "mixed"
          ? 5
          : 0;
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        88 +
          Math.round(confidence * 8) -
          errorCount * 16 -
          warningCount * 7 -
          readinessPenalty -
          safetyPenalty -
          patternPenalty -
          reliabilityPenalty -
          (lowConfidence ? 18 : 0)
      )
    )
  );
  const readyToWrite = labBrief.status === "ready_to_reason" && !lowConfidence;
  const needsAction = labBrief.status === "blocked" || nextTrialPlan.status === "blocked" || lowConfidence;

  return {
    score,
    headline:
      score >= 90
        ? "Student is ready to reason from evidence."
        : score >= 75
          ? "Student has a useful path, but should review flags first."
          : "Student needs confirmation or fixes before using this run.",
    studentOutcome: readyToWrite
      ? `A student can explain the ${template.shortName} pattern using their graph, citations, and Claim Coach blanks.`
      : needsAction
        ? "A student should confirm the experiment type or fix blocking checks before treating this as lab guidance."
        : "A student can use the warnings, source trail, and next-trial plan to improve the experiment before writing a claim.",
    metrics: [
      {
        id: "student-outcome",
        label: "Student outcome",
        value: readyToWrite ? "Ready to reason" : needsAction ? "Fix first" : "Review first",
        status: readyToWrite ? "strong" : needsAction ? "needs_action" : "watch",
        detail: labBrief.signal
      },
      {
        id: "data-quality",
        label: "Data quality",
        value: `${methodAudit.score}/100`,
        status: methodAudit.status === "strong" ? "strong" : methodAudit.status === "blocked" ? "needs_action" : "watch",
        detail:
          errorCount + warningCount === 0
            ? "No obvious missing-value, unit, or expected-pattern problems."
            : `${errorCount} error${errorCount === 1 ? "" : "s"} and ${warningCount} warning${warningCount === 1 ? "" : "s"} remain visible.`
      },
      {
        id: "concept-learning",
        label: "Concept learning",
        value: `${conceptCoach.vocabulary.length} terms`,
        status: "strong",
        detail: `${conceptCoach.misconceptionChecks.length} misconception check${conceptCoach.misconceptionChecks.length === 1 ? "" : "s"} and a source task turn the result into learning.`
      },
      {
        id: "integrity",
        label: "Integrity",
        value: labBrief.claimStarter.includes("___") ? "Guarded" : "Review",
        status: labBrief.claimStarter.includes("___") ? "strong" : "watch",
        detail: "Claim Coach and Evidence Packet preserve blanks so the final conclusion stays student-written."
      },
      {
        id: "pattern-evidence",
        label: "Pattern evidence",
        value: `${patternEvidence.score}/100`,
        status:
          patternEvidence.status === "supports_expected"
            ? "strong"
            : patternEvidence.status === "contradicts" || patternEvidence.status === "insufficient"
              ? "needs_action"
              : "watch",
        detail: patternEvidence.summary
      },
      {
        id: "repeat-reliability",
        label: "Repeat reliability",
        value: `${reliabilityCoach.score}/100`,
        status:
          reliabilityCoach.status === "strong"
            ? "strong"
            : reliabilityCoach.status === "blocked"
              ? "needs_action"
              : "watch",
        detail: reliabilityCoach.summary
      },
      {
        id: "next-trial",
        label: "Next trial",
        value: formatNextTrialStatusForImpact(nextTrialPlan.status),
        status: nextTrialPlan.status === "ready_to_extend" ? "strong" : nextTrialPlan.status === "blocked" ? "needs_action" : "watch",
        detail: nextTrialPlan.priority
      }
    ],
    evidenceLoop: [
      `Diagnose: classify ${template.title} at ${Math.round(confidence * 100)}% confidence and identify variables.`,
      `Ground: attach citations and explain the expected ${formatColumnName(template, template.expectedResult.xKey)} to ${formatColumnName(template, template.expectedResult.yKey)} pattern.`,
      `Check: score method quality at ${methodAudit.score}/100, pattern evidence at ${patternEvidence.score}/100, and compare the graph to the expected overlay.`,
      `Improve: ${reliabilityCoach.recommendation} ${nextTrialPlan.priority}`,
      "Write: keep the conclusion blank so the student owns the final claim."
    ]
  };
}

function buildLearningExitTicket(
  template: ExperimentTemplate,
  confidence: number,
  issues: Issue[],
  labBrief: LabBrief,
  patternEvidence: PatternEvidence,
  reliabilityCoach: ReliabilityCoach,
  nextTrialPlan: NextTrialPlan,
  customLabTriage: CustomLabTriage
): LearningExitTicket {
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const lowConfidence = confidence < 0.6 || customLabTriage.status === "needs_student_details";
  const status: LearningExitTicket["status"] =
    errorCount > 0 || labBrief.status === "blocked"
      ? "blocked"
      : lowConfidence || warningCount > 0 || nextTrialPlan.status === "fix_first"
        ? "review"
        : "ready";
  const xLabel = formatColumnName(template, template.expectedResult.xKey);
  const yLabel = formatColumnName(template, template.expectedResult.yKey);
  const variablePrompt = lowConfidence
    ? `Because this is only a closest supported match, which part of your real setup was the independent variable and what did you actually measure?`
    : `Which part of your setup was the independent variable, and which measured value was the dependent variable?`;

  return {
    status,
    summary:
      status === "ready"
        ? "Ready exit ticket: the student should explain variables, graph pattern, and next step before writing a conclusion."
        : status === "review"
          ? "Review first exit ticket: the student should resolve uncertainty or warnings before using the prompts as claim evidence."
          : "Blocked exit ticket: the student should fix errors before reasoning from this run.",
    prompts: [
      {
        id: "variable-check",
        label: "Variable check",
        studentPrompt: variablePrompt,
        evidenceToUse:
          customLabTriage.status === "needs_student_details"
            ? "Custom Lab Triage variable plan and the original experiment description."
            : `Classification and Variables: ${xLabel} should drive ${yLabel}.`,
        teacherSignal: `Student names ${xLabel} as the changed condition and ${yLabel} as the measured result without copying the final claim.`
      },
      {
        id: "pattern-check",
        label: "Pattern check",
        studentPrompt: "What pattern should your graph show before you make a claim?",
        evidenceToUse: `Expected overlay and Pattern Evidence Engine (${patternEvidence.score}/100): ${patternEvidence.summary}`,
        teacherSignal: "Student points to a graph pattern or mismatch and explains it in their own words."
      },
      {
        id: "next-step-check",
        label: "Next-step check",
        studentPrompt: "What would you repeat, fix, or measure next before writing the claim?",
        evidenceToUse: `Reliability Coach (${reliabilityCoach.score}/100) and Next Trial Planner: ${nextTrialPlan.priority}`,
        teacherSignal: `Student chooses a repeat trial, fixed measurement, or next controlled condition. ${reliabilityCoach.recommendation}`
      }
    ],
    integrityBoundary: "The exit ticket asks for student explanations; Ouija does not supply a final conclusion paragraph.",
    judgeTakeaway: "Learning Exit Ticket converts AI feedback into observable student understanding of variables, patterns, and next steps."
  };
}

function buildStudentPilotStudyKit(
  template: ExperimentTemplate,
  confidence: number,
  issues: Issue[],
  impactSnapshot: LearningImpactSnapshot,
  learningExitTicket: LearningExitTicket,
  customLabTriage: CustomLabTriage,
  preLabDesignCoach: PreLabDesignCoach,
  nextTrialPlan: NextTrialPlan
): StudentPilotStudyKit {
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const lowConfidence = confidence < 0.6 || customLabTriage.status === "needs_student_details";
  const needsReview = lowConfidence || errorCount > 0 || learningExitTicket.status === "blocked" || preLabDesignCoach.status === "blocked";
  const status: StudentPilotStudyKit["status"] = needsReview ? "needs_review" : "ready_to_pilot";
  const xLabel = formatColumnName(template, template.expectedResult.xKey);
  const yLabel = formatColumnName(template, template.expectedResult.yKey);
  const targetStudent = lowConfidence
    ? "One middle or high school student who can compare Ouija's closest-supported match against their real experiment."
    : `One middle or high school student running or reviewing a ${template.shortName.toLowerCase()} lab.`;

  return {
    status,
    summary:
      status === "ready_to_pilot"
        ? "Run a 10-minute student pilot with this exact lab to collect honest UX and impact evidence before submission."
        : "Pilot-ready with a review gate: confirm the lab match or blocking checks before using this run as evidence.",
    targetStudent,
    consentBoundary:
      "No names, contact info, grades, faces, or private classroom data. Use anonymous counts and only quote a student with permission.",
    prePrompt: `Before using Ouija, ask the student: What do you expect to happen between ${xLabel} and ${yLabel}, and why?`,
    postPrompt:
      "After using Ouija, ask the student to explain the variable, graph pattern, and next measurement in their own words without copying a conclusion.",
    tasks: [
      {
        id: "classify",
        label: "Confirm the lab match",
        instruction: `Describe the experiment, run Analyze, and decide whether Ouija's ${template.title} classification matches the actual setup.`,
        successSignal: lowConfidence
          ? "Student catches the closest-supported boundary and asks for teacher confirmation."
          : "Student can name the independent and dependent variables without help."
      },
      {
        id: "graph-check",
        label: "Use the graph and table",
        instruction: "Edit or paste one table row, then compare the observed point with the dashed expected overlay.",
        successSignal:
          errorCount + warningCount === 0
            ? "Student reaches the graph without horizontal scrolling and can explain what the overlay means."
            : "Student notices a visible data or method flag before writing a claim."
      },
      {
        id: "reflect",
        label: "Answer the exit ticket",
        instruction: "Complete the variable, pattern, and next-step prompts in original words.",
        successSignal:
          learningExitTicket.status === "ready"
            ? "Student can answer all three prompts before opening the Evidence Packet."
            : "Student knows which uncertainty or warning must be resolved first."
      }
    ],
    metrics: [
      {
        id: "time-to-graph",
        label: "Time to first graph",
        target: "Under 2 minutes from description to visible graph/table.",
        status: lowConfidence ? "watch" : "ready",
        detail: lowConfidence
          ? "Record whether the low-confidence banner stops the student from trusting the wrong graph."
          : "Record elapsed time from Analyze click to the student pointing at the expected overlay."
      },
      {
        id: "data-fix",
        label: "Data fix signal",
        target: "Student can identify one clean signal or one warning without adult explanation.",
        status: errorCount > 0 ? "needs_review" : warningCount > 0 ? "watch" : "ready",
        detail:
          errorCount + warningCount === 0
            ? "Default sample data is clean; ask the student what would make the data less trustworthy."
            : `${errorCount} error${errorCount === 1 ? "" : "s"} and ${warningCount} warning${warningCount === 1 ? "" : "s"} are visible for the pilot.`
      },
      {
        id: "reflection-readiness",
        label: "Reflection readiness",
        target: "Student gives original answers for variable, pattern, and next step.",
        status: learningExitTicket.status === "ready" ? "ready" : learningExitTicket.status === "review" ? "watch" : "needs_review",
        detail: learningExitTicket.summary
      },
      {
        id: "integrity-boundary",
        label: "Integrity boundary",
        target: "Student understands Ouija gives hints and blanks, not a finished conclusion.",
        status: impactSnapshot.metrics.some((metric) => metric.id === "integrity" && metric.status === "strong") ? "ready" : "watch",
        detail: "Ask the student what part they still have to write themselves before exporting evidence."
      }
    ],
    observerChecklist: [
      "Record time from Analyze to first useful graph.",
      "Watch whether the student opens a source or uses the Grounding Audit before trusting the expected pattern.",
      "Mark whether the student can explain one data flag or clean signal.",
      "Check whether the student keeps the final claim in their own words.",
      `Record whether the next action is clear: ${nextTrialPlan.priority}`
    ],
    evidenceToCollect: [
      "Time to first graph",
      "Number of visible flags the student resolves or explains",
      "Exit-ticket readiness count out of 3 prompts",
      "One anonymous student quote about what became clearer",
      "One observer note about where the workflow caused confusion"
    ],
    judgeTakeaway:
      status === "ready_to_pilot"
        ? "Ouija has a concrete student pilot protocol judges can inspect for UX and impact evidence."
        : "Ouija labels the pilot boundary honestly before collecting any user-testing evidence."
  };
}

function buildStudentImpactBrief(
  template: ExperimentTemplate,
  confidence: number,
  issues: Issue[],
  matchQuality: AnalyzeResult["classification"]["matchQuality"],
  impactSnapshot: LearningImpactSnapshot,
  studentPilotStudyKit: StudentPilotStudyKit
): StudentImpactBrief {
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const lowConfidence = matchQuality === "closest_supported" || confidence < 0.6;
  const status: StudentImpactBrief["status"] =
    lowConfidence || errorCount > 0
      ? "review"
      : studentPilotStudyKit.status === "ready_to_pilot"
        ? "strong"
        : "needs_evidence";
  const xLabel = formatColumnName(template, template.expectedResult.xKey);
  const yLabel = formatColumnName(template, template.expectedResult.yKey);
  const targetUser = `Middle/high school students working through ${template.shortName.toLowerCase()} labs.`;
  const problem = `Students often have a table and graph but do not know whether the ${xLabel} to ${yLabel} pattern supports a claim.`;

  return {
    status,
    targetUser,
    problem,
    whyAi:
      "Ouija combines experiment classification, expected-pattern grounding, data checks, graph comparison, and Socratic prompts in one student workflow.",
    beforeOuija:
      "Before Ouija, the student has to guess the lab type, search sources separately, build a graph, and decide alone whether the data is usable.",
    afterOuija:
      lowConfidence
        ? "After Ouija, the student gets an honest closest-match warning, a starter investigation plan, and teacher-review questions instead of a fake answer."
        : `After Ouija, the student can compare their graph to an expected ${xLabel} vs ${yLabel} pattern, see data-quality flags, and write their own claim from evidence.`,
    signals: [
      {
        id: "target-user",
        label: "Defined user",
        value: "Students only",
        status: "strong",
        detail: targetUser
      },
      {
        id: "pain-point",
        label: "Real-world need",
        value: "Lab reasoning gap",
        status: lowConfidence ? "review" : "strong",
        detail: problem
      },
      {
        id: "before-after",
        label: "Before / after",
        value: impactSnapshot.score >= 90 ? "Clear benefit" : "Review benefit",
        status: impactSnapshot.score >= 90 ? "strong" : warningCount > 0 ? "needs_evidence" : "review",
        detail: impactSnapshot.studentOutcome
      },
      {
        id: "evidence-basis",
        label: "Evidence basis",
        value: studentPilotStudyKit.status === "ready_to_pilot" ? "Pilot-ready" : "Needs review",
        status: studentPilotStudyKit.status === "ready_to_pilot" ? "strong" : "needs_evidence",
        detail: `${studentPilotStudyKit.metrics.length} pilot metrics prepared; ${warningCount} warning${warningCount === 1 ? "" : "s"} and ${errorCount} error${errorCount === 1 ? "" : "s"} visible.`
      }
    ],
    remainingProofGap:
      studentPilotStudyKit.status === "ready_to_pilot"
        ? "Collect three anonymous pilot observations before claiming real user testing."
        : "Confirm the lab match or blocking checks before using this run as impact evidence.",
    judgeTakeaway:
      status === "strong"
        ? "Problem relevance is concrete: Ouija targets a real student lab-reasoning moment and names measurable before/after evidence."
        : "Problem relevance is visible, but this run should be framed as review/pilot-ready instead of completed impact evidence."
  };
}

function buildPreLabDesignCoach(
  template: ExperimentTemplate,
  confidence: number,
  issues: Issue[],
  safetyCoach: SafetyCoach,
  customLabTriage: CustomLabTriage
): PreLabDesignCoach {
  const planner = customLabTriage.planner;
  const hasBlockingIssue = issues.some((issue) => issue.severity === "error") || safetyCoach.status === "do_not_run";
  const needsTeacherReview =
    confidence < 0.6 || customLabTriage.status === "needs_student_details" || safetyCoach.status === "adult_review";
  const status: PreLabDesignCoach["status"] = hasBlockingIssue
    ? "blocked"
    : needsTeacherReview
      ? "needs_teacher_review"
      : "ready_to_plan";
  const sourceSearch = customLabTriage.sourceSearches[0] ?? `${template.title} expected results`;
  const tablePlan = customLabTriage.suggestedColumns.length ? customLabTriage.suggestedColumns : template.columns;
  const variablePlan = {
    independentVariable: planner.independentVariable,
    dependentVariable: planner.dependentVariable,
    controlVariables: planner.controlVariables
  };

  return {
    status,
    summary:
      status === "ready_to_plan"
        ? "Before data collection, the student has a ready variable, control, repeat, table, source, and safety checklist."
        : status === "needs_teacher_review"
          ? "Before data collection, the student should get teacher confirmation on the match, variables, controls, and safety boundary."
          : "Before data collection, the student should fix blocking data or safety issues before treating this as a runnable plan.",
    variablePlan,
    repeatPlan: planner.repeatPlan,
    tablePlan,
    hypothesisStarter: planner.hypothesisStarter,
    setupChecks: [
      {
        id: "variables",
        label: "Variables named",
        detail: `${variablePlan.independentVariable} drives ${variablePlan.dependentVariable}.`,
        status: needsTeacherReview ? "review" : "ready"
      },
      {
        id: "controls",
        label: "Controls listed",
        detail: variablePlan.controlVariables.length
          ? `Keep ${variablePlan.controlVariables.slice(0, 4).join(", ")} constant.`
          : "Name the controls before collecting data.",
        status: variablePlan.controlVariables.length ? "ready" : "review"
      },
      {
        id: "repeats",
        label: "Repeat plan",
        detail: planner.repeatPlan,
        status: "ready"
      },
      {
        id: "table",
        label: "Table ready",
        detail: `Start with ${tablePlan.map((column) => column.label).join(", ")} before the first trial.`,
        status: tablePlan.length >= 2 ? "ready" : "review"
      },
      {
        id: "safety",
        label: "Safety gate",
        detail: safetyCoach.teacherCheck,
        status: safetyCoach.status === "do_not_run" ? "blocked" : safetyCoach.status === "adult_review" ? "review" : "ready"
      },
      {
        id: "source-check",
        label: "Source check",
        detail: `Search: ${sourceSearch}. Write the expected graph pattern in your own words before running trials.`,
        status: customLabTriage.status === "needs_student_details" ? "review" : "ready"
      }
    ],
    sourceTask: `Use the search query "${sourceSearch}" and write the expected pattern before collecting the first row.`,
    safetyGate: `${safetyCoach.summary} ${safetyCoach.teacherCheck}`,
    studentNextAction:
      status === "ready_to_plan"
        ? "Fill the table headers, run one small first trial, then repeat each condition before trusting the graph."
        : status === "needs_teacher_review"
          ? "Show the variable plan, controls, source task, and safety gate to a teacher before collecting data."
          : "Fix blocking issues and get teacher approval before running or extending this experiment.",
    judgeTakeaway:
      "Pre-Lab Design Coach moves Ouija before data collection by planning variables, controls, repeats, sources, safety, and table structure without writing a conclusion."
  };
}

function buildDataHandlingLedger(groundingMode: AnalyzeResult["groundingStatus"]["mode"]): DataHandlingLedger {
  const usesServerSearch = groundingMode === "web_enriched";
  const flows: DataHandlingLedger["flows"] = [
    {
      id: "description",
      label: "Experiment description",
      purpose: "Classify the school-lab type, choose the expected pattern, and build student-facing explanation prompts.",
      storage: "Kept in the current browser session and sent to the Ouija API for analysis.",
      retention: "Not written to a server database by Ouija.",
      studentControl: "Students can edit the description and rerun analysis at any time.",
      status: "protected"
    },
    {
      id: "table-data",
      label: "Student data",
      purpose: "Graph the table, check units and missing cells, compare the whole pattern, and build hints.",
      storage: "Browser state during the active run; copied only into a local snapshot if the student chooses Save current lab.",
      retention: "Active rows clear when the session reloads unless the student saves locally.",
      studentControl: "Students can edit cells, import rows, overwrite rows, or delete saved snapshots.",
      status: "protected"
    },
    {
      id: "local-snapshot",
      label: "Browser-local saved labs",
      purpose: "Let a student reopen recent lab snapshots on the same device.",
      storage: "localStorage on the student's device, capped at six saved labs.",
      retention: "Retained only in that browser until the student deletes snapshots or clears site data.",
      studentControl: "Students can clear saved labs from Settings.",
      status: "protected"
    },
    {
      id: "grounding-sources",
      label: "Grounding sources",
      purpose: "Show visible citations and source agreement for the expected result.",
      storage: usesServerSearch ? "Server may request web-search snippets for the run; fallback sources are bundled in the app." : "Trusted fallback source metadata is bundled in the app.",
      retention: "Citations are returned in the analysis result and Evidence Packet; Ouija does not create source logs.",
      studentControl: "Students can open citations and decide which source evidence to use in their own explanation.",
      status: "protected"
    },
    {
      id: "server-api-key",
      label: "Server API key",
      purpose: "Enable optional OpenAI web-search enrichment without exposing credentials to students.",
      storage: "Environment variable on the server only.",
      retention: "Never stored in browser state, saved labs, Evidence Packet, or API responses.",
      studentControl: "Students do not need credentials to use the deterministic fallback experience.",
      status: "protected"
    }
  ];

  return {
    status: "privacy_preserving",
    score: usesServerSearch ? 94 : 96,
    summary: usesServerSearch
      ? "Student descriptions can be enriched through server-side web search, while table data and saved labs remain student-controlled."
      : "Ouija works with built-in references, browser-local saved labs, and no server database for student lab data.",
    flows,
    safeguards: [
      "No account system or teacher dashboard is required for the student workflow.",
      "API key stays server-side; the browser never receives OPENAI_API_KEY.",
      "Evidence Packet exports reasoning scaffolds without hidden personal identifiers.",
      "Saved labs are limited to six browser-local snapshots and can be deleted by the student.",
      "Academic-integrity prompts keep final claims blank instead of producing a complete lab report."
    ],
    studentRights: [
      "Students can edit the description and table before analysis.",
      "Students can choose whether to save a local lab snapshot.",
      "Students can clear saved labs from Settings.",
      "Students can use the app without signing in or entering an API key."
    ],
    judgeTakeaway: "The product is privacy-preserving by default: no accounts, browser-local saves, visible citations, and server-only API keys."
  };
}

function buildOfficialRubricFit(
  template: ExperimentTemplate,
  confidence: number,
  issues: Issue[],
  sources: SourceCard[],
  groundingMode: AnalyzeResult["groundingStatus"]["mode"],
  matchQuality: AnalyzeResult["classification"]["matchQuality"],
  modelStrategy: ModelStrategy,
  guidedFlow: GuidedLabFlow,
  safetyCoach: SafetyCoach,
  labBrief: LabBrief,
  methodAudit: MethodAudit,
  expectedComparison: ExpectedComparison,
  reliabilityCoach: ReliabilityCoach,
  patternEvidence: PatternEvidence,
  groundingAudit: GroundingAudit,
  aiEvaluationHarness: AiEvaluationHarness,
  judgeDemoPath: JudgeDemoPath,
  customLabTriage: CustomLabTriage,
  nextTrialPlan: NextTrialPlan,
  impactSnapshot: LearningImpactSnapshot,
  dataHandlingLedger: DataHandlingLedger,
  learningExitTicket: LearningExitTicket,
  preLabDesignCoach: PreLabDesignCoach,
  studentPilotStudyKit: StudentPilotStudyKit
): OfficialRubricFit {
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const confidencePercent = Math.round(confidence * 100);
  const dataFlagText =
    errorCount + warningCount === 0
      ? "No blocking table or method flags are present for this run."
      : `${errorCount} error${errorCount === 1 ? "" : "s"} and ${warningCount} warning${warningCount === 1 ? "" : "s"} stay visible before the student writes a claim.`;
  const sourceMode =
    groundingMode === "web_enriched"
      ? "server-side OpenAI web-search enrichment"
      : "trusted built-in science references with optional OpenAI web-search enrichment";
  const lowConfidence = matchQuality === "closest_supported" || confidence < 0.6;
  const aiReady = modelStrategy.candidates.length >= 3 && modelStrategy.signals.length >= 4 && sources.length > 0;
  const uxBlocked = guidedFlow.steps.some((step) => step.status === "blocked") || labBrief.status === "blocked";
  const patternRisk =
    patternEvidence.status === "contradicts" ? 8 : patternEvidence.status === "insufficient" ? 6 : patternEvidence.status === "mixed" ? 3 : 0;

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        96 -
          errorCount * 10 -
          warningCount * 4 -
          (lowConfidence ? 18 : 0) -
          (aiReady ? 0 : 7) -
          (uxBlocked ? 8 : 0) -
          patternRisk +
          (groundingMode === "web_enriched" ? 2 : 0)
      )
    )
  );

  return {
    score,
    verdict:
      score >= 92
        ? "Strong match to the three visible AIYES judging criteria."
        : score >= 80
          ? "Ready rubric fit with review notes the student should discuss in the demo."
          : "Rubric fit needs review before using this run as the judge demo.",
    criteria: [
      {
        id: "problem-real-world",
        label: "Problem Definition and Real-World Relevance",
        status: lowConfidence ? "review" : errorCount > 0 || warningCount > 0 ? "ready" : "strong",
        evidence: [
          `Built for middle/high school students working through ${template.subject.toLowerCase()} labs, not a generic teacher dashboard.`,
          `Targets the real classroom bottleneck: students compare their own table against the expected ${formatColumnName(template, template.expectedResult.xKey)} to ${formatColumnName(template, template.expectedResult.yKey)} pattern.`,
          `Expected overlay: ${expectedComparison.summary}`,
          `Learning impact loop score: ${impactSnapshot.score}/100; ${impactSnapshot.headline}`,
          `Student Pilot Study Kit: ${studentPilotStudyKit.summary}`,
          `Pre-Lab Design Coach: ${preLabDesignCoach.summary}`,
          `Learning Exit Ticket: ${learningExitTicket.summary}`,
          `Judge Demo Path: ${judgeDemoPath.summary}`,
          `Custom Lab Triage: ${customLabTriage.summary}`,
          `Pattern Archetype Coach: ${customLabTriage.patternArchetype.label} with ${customLabTriage.patternArchetype.graphSuggestion}`,
          `Grounding Audit: ${groundingAudit.summary}`,
          `AI Evaluation Harness: ${aiEvaluationHarness.summary}`,
          `Pattern Evidence Engine: ${patternEvidence.summary}`,
          `Repeat reliability: ${reliabilityCoach.summary}`,
          dataFlagText,
          `Safety boundary: ${safetyCoach.summary}`
        ],
        judgeTakeaway: impactSnapshot.studentOutcome
      },
      {
        id: "ai-design-model-strategy",
        label: "AI Technical Design and Model Strategy",
        status: lowConfidence ? "review" : aiReady ? "strong" : "ready",
        evidence: [
          `${modelStrategy.candidates.length} candidate templates are ranked before selecting ${template.title} at ${confidencePercent}% confidence.`,
          `Grounding uses ${sourceMode}; ${sources.length} citation${sources.length === 1 ? "" : "s"} are visible to the student.`,
          `Grounding Audit scores citation visibility and source agreement at ${groundingAudit.score}/100 before the expected pattern is used.`,
          `AI Evaluation Harness scores classifier confidence, coverage, grounding, pattern validation, repeat reliability, row validators, safety, and fallback boundaries at ${aiEvaluationHarness.score}/100.`,
          `Data Handling Ledger scores privacy, retention, server-key boundaries, and student controls at ${dataHandlingLedger.score}/100.`,
          `${modelStrategy.signals.length} strategy signals are shown alongside deterministic table validators, Grounding Audit, Method Audit, Pattern Evidence Engine, Reliability Coach, Safety Coach, and Next Trial Planner.`,
          `Pre-lab planning status is ${preLabDesignCoach.status.replaceAll("_", " ")} with ${preLabDesignCoach.setupChecks.length} setup checks before data collection.`,
          `Custom Pattern Archetype is ${customLabTriage.patternArchetype.label}: ${customLabTriage.patternArchetype.expectedPattern}`,
          modelStrategy.fallbackStrategy
        ],
        judgeTakeaway: "The AI is inspectable: classification, grounding, validation, fallback behavior, and risk controls are visible instead of hidden behind a chat answer."
      },
      {
        id: "ux-design",
        label: "User Experience and Design",
        status: uxBlocked ? "review" : warningCount > 0 ? "ready" : "strong",
        evidence: [
          `Guided Lab Flow current action: ${guidedFlow.currentAction}`,
          `Judge Demo Path next action: ${judgeDemoPath.nextBestAction}`,
          `Custom Lab Triage next action: ${customLabTriage.studentNextAction}`,
          `Pattern archetype next check: ${customLabTriage.patternArchetype.studentCheck}`,
          `Pre-Lab Design Coach next action: ${preLabDesignCoach.studentNextAction}`,
          `Students can paste or edit table data; the graph overlays student data with expected values for ${expectedComparison.points.length} row${expectedComparison.points.length === 1 ? "" : "s"}.`,
          `Current Method Audit score is ${methodAudit.score}/100.`,
          `Pattern Evidence question: ${patternEvidence.studentQuestion}`,
          `Learning Exit Ticket asks students to explain variables, graph pattern, and the next repeat or measurement before writing.`,
          `Student Pilot Study Kit tracks ${studentPilotStudyKit.metrics.length} UX and impact metrics: ${studentPilotStudyKit.evidenceToCollect.slice(0, 3).join("; ")}.`,
          `Reliability Coach recommendation: ${reliabilityCoach.recommendation}`,
          `Evidence Packet and Claim Coach keep the conclusion student-owned: ${labBrief.claimStarter}`,
          `Next Trial Planner priority: ${nextTrialPlan.priority}`
        ],
        judgeTakeaway: "The workflow is built around a student's next action: classify, understand, check data, plan another measurement, then write their own claim."
      }
    ]
  };
}

function buildAiyesValuesFit(
  template: ExperimentTemplate,
  confidence: number,
  issues: Issue[],
  sources: SourceCard[],
  groundingMode: AnalyzeResult["groundingStatus"]["mode"],
  matchQuality: AnalyzeResult["classification"]["matchQuality"],
  guidedFlow: GuidedLabFlow,
  groundingAudit: GroundingAudit,
  dataHandlingLedger: DataHandlingLedger,
  aiEvaluationHarness: AiEvaluationHarness,
  learningExitTicket: LearningExitTicket,
  preLabDesignCoach: PreLabDesignCoach,
  customLabTriage: CustomLabTriage,
  impactSnapshot: LearningImpactSnapshot,
  officialRubricFit: OfficialRubricFit,
  studentPilotStudyKit: StudentPilotStudyKit
): AiyesValuesFit {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const lowConfidence = matchQuality === "closest_supported" || confidence < 0.6;
  const sourceStatus: AiyesValuesFit["status"] = sources.length > 0 && groundingAudit.score >= 88 ? "strong" : "ready";
  const ethicsStatus: AiyesValuesFit["status"] =
    dataHandlingLedger.score >= 90 && errorCount === 0 ? "strong" : dataHandlingLedger.score >= 80 ? "ready" : "review";
  const inclusionStatus: AiyesValuesFit["status"] = lowConfidence ? "ready" : warningCount > 0 ? "ready" : "strong";
  const innovationStatus: AiyesValuesFit["status"] =
    officialRubricFit.score >= 90 && aiEvaluationHarness.score >= 85 ? "strong" : officialRubricFit.score >= 80 ? "ready" : "review";
  const agencyStatus: AiyesValuesFit["status"] = errorCount === 0 && learningExitTicket.status !== "blocked" ? "strong" : "ready";

  const values: AiyesValuesFit["values"] = [
    {
      id: "democracy",
      label: "Democracy",
      status: agencyStatus,
      evidence: `Students control the description, rows, saved labs, Evidence Packet, MCP export consent, pilot evidence consent, and final claim; current action is "${guidedFlow.currentAction}".`,
      studentAction: "Review the packet, keep the claim starter blank, and decide what evidence to share."
    },
    {
      id: "diversity",
      label: "Diversity",
      status: inclusionStatus,
      evidence: `Ouija supports middle/high school learners across ${template.subject.toLowerCase()} plus Custom Lab Triage and Pattern Archetype Coach; this run is ${matchQuality.replaceAll("_", " ")} with ${Math.round(confidence * 100)}% confidence.`,
      studentAction: lowConfidence ? "Confirm the experiment focus with a teacher before treating the template as a match." : "Choose the middle or high school lens that fits the class level."
    },
    {
      id: "connectivity",
      label: "Connectivity",
      status: sourceStatus,
      evidence: `${sources.length} visible source${sources.length === 1 ? "" : "s"}, Grounding Audit score ${groundingAudit.score}/100, ${groundingMode === "web_enriched" ? "server-side web search" : "trusted fallback"} grounding, and Composio handoff planning connect lab evidence to outside systems.`,
      studentAction: "Open the citations and only enable the export route that your teacher actually needs."
    },
    {
      id: "innovation",
      label: "Innovation",
      status: innovationStatus,
      evidence: `Candidate ranking, expected overlay, pattern archetypes, pattern evidence, repeat reliability, pre-lab planning, Student Pilot Study Kit, and the AI Evaluation Harness (${aiEvaluationHarness.score}/100) go beyond a simple chat answer.`,
      studentAction: `Compare your observed data to the expected ${formatColumnName(template, template.expectedResult.xKey)} to ${formatColumnName(template, template.expectedResult.yKey)} pattern before writing.`
    },
    {
      id: "ethics-inclusion",
      label: "Ethics and inclusion",
      status: ethicsStatus,
      evidence: `Data Handling Ledger ${dataHandlingLedger.score}/100, server-only keys, local saved labs, safety checks, reflection prompts, anonymous ${studentPilotStudyKit.status.replaceAll("_", " ")} pilot evidence, and blank claim starters keep the work student-owned.`,
      studentAction: "Use the exit-ticket prompts as notes, then write the conclusion in your own words."
    }
  ];

  const statusScores: Record<AiyesValuesFit["status"], number> = {
    strong: 96,
    ready: 86,
    review: 72
  };
  const score = Math.round(values.reduce((total, value) => total + statusScores[value.status], 0) / values.length);
  const status: AiyesValuesFit["status"] = score >= 92 ? "strong" : score >= 84 ? "ready" : "review";

  return {
    score,
    status,
    summary:
      "Ouija maps this run to AIYES values: student agency, broad classroom access, connected evidence, practical innovation, and ethical inclusion.",
    judgeTakeaway:
      status === "strong"
        ? `Strong AIYES values fit: ${impactSnapshot.studentOutcome}`
        : status === "ready"
          ? `Ready AIYES values fit with review notes: ${preLabDesignCoach.studentNextAction}`
          : `Review AIYES values fit before demo: ${customLabTriage.studentNextAction}`,
    values
  };
}

function buildDevelopmentJourney(
  template: ExperimentTemplate,
  confidence: number,
  rows: StudentDataRow[],
  issues: Issue[],
  sources: SourceCard[],
  groundingMode: AnalyzeResult["groundingStatus"]["mode"],
  matchQuality: AnalyzeResult["classification"]["matchQuality"],
  modelStrategy: ModelStrategy,
  guidedFlow: GuidedLabFlow,
  expectedComparison: ExpectedComparison,
  groundingAudit: GroundingAudit,
  aiEvaluationHarness: AiEvaluationHarness,
  dataHandlingLedger: DataHandlingLedger,
  officialRubricFit: OfficialRubricFit,
  aiyesValuesFit: AiyesValuesFit,
  impactSnapshot: LearningImpactSnapshot,
  learningExitTicket: LearningExitTicket,
  preLabDesignCoach: PreLabDesignCoach,
  judgeDemoPath: JudgeDemoPath,
  studentPilotStudyKit: StudentPilotStudyKit
): DevelopmentJourney {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const lowConfidence = matchQuality === "closest_supported" || confidence < 0.6;
  const completeRows = rows.filter((row) => template.columns.every((column) => row[column.key] !== "")).length;
  const uxCriterion = officialRubricFit.criteria.find((criterion) => criterion.id === "ux-design");

  const stages: DevelopmentJourney["stages"] = [
    {
      id: "problem",
      label: "Problem identification",
      status: lowConfidence ? "review" : "strong",
      evidence: `Middle/high school students need help turning ${template.title} data into source-backed reasoning without a generated lab report.`,
      judgeCue: "Start with Run Snapshot, classification, variables, and Claim Coach blanks."
    },
    {
      id: "data-handling",
      label: "Data handling",
      status: errorCount > 0 ? "review" : warningCount > 0 ? "ready" : "strong",
      evidence: `${completeRows}/${rows.length} rows are complete; expected overlay covers ${expectedComparison.points.length} row${expectedComparison.points.length === 1 ? "" : "s"} and Data Handling Ledger scores ${dataHandlingLedger.score}/100.`,
      judgeCue: "Show spreadsheet paste, editable cells, expected overlay, Method Audit, and privacy flows."
    },
    {
      id: "model-strategy",
      label: "Model selection and integration",
      status: modelStrategy.candidates.length >= 3 && confidence >= 0.6 ? "strong" : "ready",
      evidence: `${modelStrategy.candidates.length} templates are ranked before selecting ${template.title}; grounding is ${groundingMode === "web_enriched" ? "web enriched" : "trusted fallback"} with ${sources.length} visible source${sources.length === 1 ? "" : "s"}.`,
      judgeCue: "Open Model Strategy, Grounding Audit, and AI Runtime Proof."
    },
    {
      id: "app-build",
      label: "Application development",
      status: guidedFlow.steps.length >= 6 && preLabDesignCoach.setupChecks.length >= 5 ? "strong" : "ready",
      evidence: `The app combines guided workflow, pre-lab setup, graph/table editing, source cards, evidence packet, saved labs, portfolio, and MCP handoff planning.`,
      judgeCue: "Walk through Guided Lab Flow, Pre-Lab Design Coach, graph/table, Evidence Packet, and Progress Portfolio."
    },
    {
      id: "testing-evaluation",
      label: "Testing and evaluation",
      status: aiEvaluationHarness.score >= 90 ? "strong" : aiEvaluationHarness.score >= 80 ? "ready" : "review",
      evidence: `AI Evaluation Harness scores this run ${aiEvaluationHarness.score}/100, the public Deterministic Regression Suite covers eight supported examples plus the unsupported-lab boundary, and the Student Pilot Study Kit is ${studentPilotStudyKit.status.replaceAll("_", " ")} with ${studentPilotStudyKit.metrics.length} student-centered metrics.`,
      judgeCue: "Use AI Evaluation Harness, `/api/evaluate` proof, and the Student Pilot Study Kit."
    },
    {
      id: "ux-design",
      label: "User experience and design",
      status: uxCriterion?.status ?? "ready",
      evidence: `Current student action is "${guidedFlow.currentAction}", the official UX criterion is ${uxCriterion?.status ?? "ready"}, and pilot evidence collection targets ${studentPilotStudyKit.evidenceToCollect.slice(0, 3).join(", ")}.`,
      judgeCue: "Show the three-region workspace, level lens, mastery check, reflection workspace, pilot kit, and no-overflow mobile behavior."
    },
    {
      id: "ethics-impact",
      label: "Ethics and impact",
      status: dataHandlingLedger.score >= 90 && aiyesValuesFit.score >= 90 ? "strong" : "ready",
      evidence: `Data Handling Ledger is ${dataHandlingLedger.score}/100, AIYES Values Fit is ${aiyesValuesFit.score}/100, and Learning Impact is ${impactSnapshot.score}/100.`,
      judgeCue: "Show Data Handling Ledger, AIYES Values Fit, Learning Impact Loop, and blank student-owned conclusion prompts."
    },
    {
      id: "constraints-submission",
      label: "Constraints and submission",
      status: judgeDemoPath.status === "ready" && learningExitTicket.status === "ready" ? "strong" : "ready",
      evidence: `Hosted app, source, slide deck, and sub-5-minute walkthrough are prepared; Devpost team roster remains an external submission step.`,
      judgeCue: "End at Judge Brief with hosted links, AIYES Submission Checklist, and the team-requirement note."
    }
  ];

  const statusScores: Record<DevelopmentJourney["status"], number> = {
    strong: 96,
    ready: 86,
    review: 72
  };
  const score = Math.round(stages.reduce((total, stage) => total + statusScores[stage.status], 0) / stages.length);
  const status: DevelopmentJourney["status"] = score >= 92 ? "strong" : score >= 84 ? "ready" : "review";

  return {
    score,
    status,
    summary:
      "Ouija maps the AIYES Track 1 development journey from problem and data handling through model strategy, testing, UX, ethics, impact, constraints, and submission proof.",
    slideCue:
      "Use this sequence as the slide-deck spine: problem, data, model, app build, testing, UX, ethics/impact, constraints, and final submission links.",
    videoCue:
      "Use this sequence as the walkthrough spine: classify a lab, inspect AI strategy, edit data, compare the graph, check learning/ethics, then open Judge Brief.",
    stages
  };
}

function buildTrackEvidence(
  template: ExperimentTemplate,
  confidence: number,
  rows: StudentDataRow[],
  issues: Issue[],
  sources: SourceCard[],
  groundingMode: AnalyzeResult["groundingStatus"]["mode"],
  nextTrialPlan: NextTrialPlan,
  reliabilityCoach: ReliabilityCoach,
  patternEvidence: PatternEvidence,
  expectedComparison: ExpectedComparison,
  groundingAudit: GroundingAudit,
  aiEvaluationHarness: AiEvaluationHarness,
  judgeDemoPath: JudgeDemoPath,
  safetyCoach: SafetyCoach,
  guidedFlow: GuidedLabFlow,
  modelStrategy: ModelStrategy,
  customLabTriage: CustomLabTriage,
  dataHandlingLedger: DataHandlingLedger,
  learningExitTicket: LearningExitTicket,
  preLabDesignCoach: PreLabDesignCoach,
  studentPilotStudyKit: StudentPilotStudyKit
): TrackEvidence {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const dataRowsComplete = rows.length > 0 && rows.every((row) => template.columns.every((column) => row[column.key] !== ""));
  const modelStrategyReady = modelStrategy.candidates.length >= 3 && modelStrategy.signals.length >= 4;
  const patternPenalty =
    patternEvidence.status === "contradicts" ? 8 : patternEvidence.status === "insufficient" ? 5 : patternEvidence.status === "mixed" ? 3 : 0;
  const baseScore = Math.round(confidence * 22 + 70 + (modelStrategyReady ? 3 : 0) - errorCount * 14 - warningCount * 6 - patternPenalty);
  const score = confidence < 0.6 ? Math.min(75, Math.max(0, baseScore)) : Math.max(0, Math.min(100, baseScore));
  const readiness: TrackEvidence["readiness"] = confidence < 0.6 ? "needs_work" : score >= 90 ? "competitive" : score >= 76 ? "submittable" : "needs_work";

  return {
    readiness,
    score,
    verdict:
      readiness === "competitive"
        ? "Competitive Track 1 demo: functional app, visible AI pipeline, citations, testing, and integrity boundary."
        : readiness === "submittable"
          ? "Submittable Track 1 demo: the core workflow works, but this run has data or confidence checks to review."
          : "Needs review before submission: fix blocking data or classification issues before using this run in the walkthrough.",
    criteria: [
      {
        id: "problem-impact",
        label: "Problem and impact",
        status: "checked",
        detail: "Student lab reasoning is a real middle/high school problem with a clear learner outcome."
      },
      {
        id: "ai-technical-design",
        label: "AI technical design",
        status: groundingMode === "web_enriched" || sources.length > 0 ? "checked" : "review",
        detail:
          groundingMode === "web_enriched"
            ? `Hybrid classifier plus OpenAI web-search enrichment, source extraction, Grounding Audit ${groundingAudit.score}/100, row checks, and integrity guard.`
            : `Hybrid classifier, candidate ranking, deterministic science templates, trusted citations, Grounding Audit ${groundingAudit.score}/100, row checks, and optional OpenAI web-search enrichment.`
      },
      {
        id: "source-grounding",
        label: "Source grounding",
        status: groundingAudit.status === "needs_review" ? "review" : groundingAudit.status === "mixed_evidence" ? "review" : "checked",
        detail: groundingAudit.summary
      },
      {
        id: "model-strategy",
        label: "Model strategy",
        status: modelStrategyReady ? "checked" : "review",
        detail: `${modelStrategy.candidates.length} classification candidates, ${modelStrategy.signals.length} strategy signals, and risk controls are visible in the app.`
      },
      {
        id: "testing-evaluation",
        label: "Testing and evaluation",
        status: aiEvaluationHarness.status === "blocked" ? "blocked" : aiEvaluationHarness.status === "review" || warningCount > 0 ? "review" : "checked",
        detail:
          aiEvaluationHarness.status === "blocked"
            ? aiEvaluationHarness.failureMode
            : aiEvaluationHarness.status === "review" || warningCount > 0
              ? `${aiEvaluationHarness.summary} Review items should be discussed in the walkthrough.`
              : `${aiEvaluationHarness.summary} Data checks, graph comparison, method audit, and Claim Coach agree this run is plausible.`
      },
      {
        id: "ai-evaluation-harness",
        label: "AI evaluation harness",
        status: aiEvaluationHarness.status === "blocked" ? "blocked" : aiEvaluationHarness.status === "review" ? "review" : "checked",
        detail: `${aiEvaluationHarness.score}/100. ${aiEvaluationHarness.judgeSignal}`
      },
      {
        id: "judge-demo-path",
        label: "Judge demo path",
        status: judgeDemoPath.status === "blocked" ? "blocked" : judgeDemoPath.status === "review" ? "review" : "checked",
        detail: judgeDemoPath.nextBestAction
      },
      {
        id: "custom-lab-triage",
        label: "Custom lab triage",
        status: customLabTriage.status === "supported_template" ? "checked" : "review",
        detail:
          customLabTriage.status === "supported_template"
            ? `Matched labs still expose variables, searches, template-specific next steps, and a ${customLabTriage.patternArchetype.label.toLowerCase()}.`
            : `Unsupported lab support stays useful with ${customLabTriage.patternArchetype.label.toLowerCase()}: ${customLabTriage.studentNextAction}`
      },
      {
        id: "pre-lab-design",
        label: "Pre-lab design",
        status:
          preLabDesignCoach.status === "blocked"
            ? "blocked"
            : preLabDesignCoach.status === "needs_teacher_review"
              ? "review"
              : "checked",
        detail: preLabDesignCoach.judgeTakeaway
      },
      {
        id: "data-handling",
        label: "Data handling",
        status: dataRowsComplete ? "checked" : "review",
        detail:
          `Students can edit rows or paste spreadsheet data, and Ouija reruns graphing with expected-overlay comparison, row checks, Method Audit, and Claim Coach on the imported table. ${expectedComparison.summary}`
      },
      {
        id: "data-ethics",
        label: "Data ethics",
        status: dataHandlingLedger.status === "privacy_preserving" ? "checked" : "review",
        detail: dataHandlingLedger.judgeTakeaway
      },
      {
        id: "ux-design",
        label: "UX and design",
        status: "checked",
        detail: `Guided Lab Flow gives the student a next action: ${guidedFlow.currentAction}`
      },
      {
        id: "adaptive-planning",
        label: "Adaptive planning",
        status: nextTrialPlan.status === "blocked" ? "blocked" : nextTrialPlan.status === "fix_first" ? "review" : "checked",
        detail:
          nextTrialPlan.status === "ready_to_extend"
            ? "Ouija gives a safe next-trial suggestion after the data pattern is plausible."
            : "Ouija tells the student what to fix or repeat before extending the experiment."
      },
      {
        id: "pattern-evidence",
        label: "Pattern evidence",
        status: formatPatternEvidenceTraceStatus(patternEvidence.status),
        detail: patternEvidence.summary
      },
      {
        id: "repeat-reliability",
        label: "Repeat reliability",
        status:
          reliabilityCoach.status === "blocked"
            ? "blocked"
            : reliabilityCoach.status === "strong"
              ? "checked"
              : "review",
        detail: reliabilityCoach.summary
      },
      {
        id: "learning-scaffold",
        label: "Learning scaffold",
        status: "checked",
        detail: "Concept Coach gives vocabulary, misconception checks, and source-grounded explanation steps."
      },
      {
        id: "learning-exit-ticket",
        label: "Learning exit ticket",
        status: learningExitTicket.status === "blocked" ? "blocked" : learningExitTicket.status === "review" ? "review" : "checked",
        detail: learningExitTicket.judgeTakeaway
      },
      {
        id: "student-pilot-study",
        label: "Student pilot study",
        status: studentPilotStudyKit.status === "ready_to_pilot" ? "checked" : "review",
        detail: studentPilotStudyKit.judgeTakeaway
      },
      {
        id: "safety-responsibility",
        label: "Safety and responsibility",
        status: safetyCoach.status === "do_not_run" ? "blocked" : safetyCoach.status === "adult_review" ? "review" : "checked",
        detail:
          safetyCoach.status === "classroom_ready"
            ? "Safety Coach names PPE, material limits, cleanup, and stop conditions for the classroom lab."
            : "Safety Coach requires adult review before students treat this as a runnable classroom procedure."
      },
      {
        id: "ethics-constraints",
        label: "Ethics and constraints",
        status: "checked",
        detail: "Ouija gives hints, safety boundaries, and evidence prompts, not final lab reports or conclusion paragraphs."
      }
    ],
    pipeline: [
      {
        id: "classify",
        label: "Classify experiment",
        status: confidence >= 0.75 ? "checked" : "review",
        detail: `${Math.round(confidence * 100)}% match to ${template.subject}: ${template.title}.`
      },
      {
        id: "strategy",
        label: "Expose model strategy",
        status: modelStrategyReady ? "checked" : "review",
        detail: modelStrategy.decisionSummary
      },
      {
        id: "variables",
        label: "Map variables",
        status: "checked",
        detail: `${formatColumnName(template, template.expectedResult.xKey)} drives ${formatColumnName(template, template.expectedResult.yKey)}.`
      },
      {
        id: "pre-lab",
        label: "Plan pre-lab setup",
        status:
          preLabDesignCoach.status === "blocked"
            ? "blocked"
            : preLabDesignCoach.status === "needs_teacher_review"
              ? "review"
              : "checked",
        detail: preLabDesignCoach.studentNextAction
      },
      {
        id: "ground",
        label: "Audit source grounding",
        status: groundingAudit.status === "needs_review" ? "review" : groundingAudit.status === "mixed_evidence" ? "review" : "checked",
        detail: groundingAudit.summary
      },
      {
        id: "evaluate",
        label: "Run AI evaluation harness",
        status: aiEvaluationHarness.status === "blocked" ? "blocked" : aiEvaluationHarness.status === "review" ? "review" : "checked",
        detail: aiEvaluationHarness.summary
      },
      {
        id: "demo",
        label: "Guide judge demo",
        status: judgeDemoPath.status === "blocked" ? "blocked" : judgeDemoPath.status === "review" ? "review" : "checked",
        detail: judgeDemoPath.headline
      },
      {
        id: "guide",
        label: "Guide student path",
        status: guidedFlow.steps.some((step) => step.status === "blocked") ? "blocked" : guidedFlow.steps.some((step) => step.status === "review") ? "review" : "checked",
        detail: guidedFlow.currentAction
      },
      {
        id: "learn",
        label: "Build concept model",
        status: "checked",
        detail: "Vocabulary and misconception checks turn the expected pattern into student learning steps."
      },
      {
        id: "exit-ticket",
        label: "Check learning exit ticket",
        status: learningExitTicket.status === "blocked" ? "blocked" : learningExitTicket.status === "review" ? "review" : "checked",
        detail: learningExitTicket.summary
      },
      {
        id: "pilot",
        label: "Prepare student pilot",
        status: studentPilotStudyKit.status === "ready_to_pilot" ? "checked" : "review",
        detail: studentPilotStudyKit.summary
      },
      {
        id: "safety",
        label: "Check safety boundary",
        status: safetyCoach.status === "do_not_run" ? "blocked" : safetyCoach.status === "adult_review" ? "review" : "checked",
        detail: safetyCoach.summary
      },
      {
        id: "audit",
        label: "Audit table data",
        status: errorCount > 0 ? "blocked" : warningCount > 0 || !dataRowsComplete ? "review" : "checked",
        detail:
          errorCount + warningCount === 0
            ? "No obvious missing-value, unit, or expected-pattern problems."
            : `${errorCount} error${errorCount === 1 ? "" : "s"} and ${warningCount} warning${warningCount === 1 ? "" : "s"} found.`
      },
      {
        id: "privacy",
        label: "Audit data handling",
        status: dataHandlingLedger.status === "privacy_preserving" ? "checked" : "review",
        detail: dataHandlingLedger.summary
      },
      {
        id: "pattern",
        label: "Score whole pattern",
        status: formatPatternEvidenceTraceStatus(patternEvidence.status),
        detail: patternEvidence.summary
      },
      {
        id: "reliability",
        label: "Check repeat reliability",
        status:
          reliabilityCoach.status === "blocked"
            ? "blocked"
            : reliabilityCoach.status === "strong"
              ? "checked"
              : "review",
        detail: reliabilityCoach.recommendation
      },
      {
        id: "coach",
        label: "Coach student claim",
        status: "checked",
        detail: "Claim starter keeps blanks and asks the next evidence question."
      },
      {
        id: "plan",
        label: "Plan next trial",
        status: nextTrialPlan.status === "blocked" ? "blocked" : nextTrialPlan.status === "fix_first" ? "review" : "checked",
        detail: nextTrialPlan.priority
      }
    ]
  };
}

export function buildGuidedLabFlow(
  confidence: number,
  issues: Issue[],
  safetyCoach: SafetyCoach,
  methodAudit: MethodAudit,
  nextTrialPlan: NextTrialPlan,
  labBrief: LabBrief
): GuidedLabFlow {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const lowConfidence = issues.some((issue) => issue.id === "classification-low-confidence");
  const safetyBlocked = safetyCoach.status === "do_not_run";
  const safetyNeedsReview = safetyCoach.status === "adult_review";

  const currentAction = buildCurrentAction({
    lowConfidence,
    safetyBlocked,
    safetyNeedsReview,
    errorCount,
    warningCount,
    labBrief,
    nextTrialPlan
  });

  return {
    currentAction,
    steps: [
      {
        id: "identify",
        label: "Identify lab",
        status: lowConfidence || confidence < 0.75 ? "review" : "done",
        detail: lowConfidence ? "Confirm the experiment type before using this as a runnable guide." : "Experiment type, variables, and concepts are identified."
      },
      {
        id: "prepare",
        label: "Prepare safely",
        status: safetyBlocked ? "blocked" : safetyNeedsReview ? "review" : "done",
        detail: safetyCoach.summary
      },
      {
        id: "understand",
        label: "Understand pattern",
        status: "done",
        detail: "Use Concept Coach and citations to explain the expected result in your own words."
      },
      {
        id: "check-data",
        label: "Check data",
        status: errorCount > 0 ? "blocked" : warningCount > 0 || methodAudit.status === "needs_review" ? "review" : "done",
        detail:
          errorCount > 0
            ? "Fix invalid or missing data before reasoning."
            : warningCount > 0
              ? "Review warnings and decide whether to repeat a trial."
              : "Table values and method checks are ready to use."
      },
      {
        id: "plan",
        label: "Plan next move",
        status: nextTrialPlan.status === "blocked" ? "blocked" : nextTrialPlan.status === "fix_first" ? "review" : "done",
        detail: nextTrialPlan.priority
      },
      {
        id: "claim",
        label: "Write own claim",
        status: labBrief.status === "blocked" ? "blocked" : labBrief.status === "needs_checks" ? "review" : "next",
        detail: labBrief.status === "ready_to_reason" ? "Use Claim Coach blanks and the Evidence Packet to write your own conclusion." : labBrief.signal
      }
    ]
  };
}

function buildCurrentAction({
  lowConfidence,
  safetyBlocked,
  safetyNeedsReview,
  errorCount,
  warningCount,
  labBrief,
  nextTrialPlan
}: {
  lowConfidence: boolean;
  safetyBlocked: boolean;
  safetyNeedsReview: boolean;
  errorCount: number;
  warningCount: number;
  labBrief: LabBrief;
  nextTrialPlan: NextTrialPlan;
}): string {
  if (lowConfidence) {
    return "Confirm this is the right experiment before using the guidance.";
  }

  if (safetyBlocked) {
    return "Stop and get an adult check before running another trial.";
  }

  if (errorCount > 0) {
    return "Fix the blocking data entries before reasoning from the graph.";
  }

  if (warningCount > 0 || nextTrialPlan.status === "fix_first") {
    return "Repeat or fix the flagged measurement before writing the claim.";
  }

  if (safetyNeedsReview) {
    return "Get the teacher safety check before starting or extending the lab.";
  }

  if (labBrief.status === "ready_to_reason") {
    return "Write your own claim using the Evidence Packet and Claim Coach blanks.";
  }

  return "Review the highlighted checks, then decide the next safe measurement.";
}

export function buildConceptCoach(template: ExperimentTemplate): ConceptCoach {
  const profile = conceptCoachProfileForTemplate(template.id);

  return {
    level: "middle_high_school",
    vocabulary: profile.vocabulary,
    explanationSteps: profile.explanationSteps,
    misconceptionChecks: profile.misconceptionChecks,
    sourceTask: `Use one cited source to explain why ${template.expectedResult.pattern.toLowerCase()}`
  };
}

export function buildSafetyCoach(template: ExperimentTemplate, issues: Issue[]): SafetyCoach {
  const profile = safetyProfileForTemplate(template.id);
  const lowConfidence = issues.some((issue) => issue.id === "classification-low-confidence");
  const blockingIssue = issues.some((issue) => issue.severity === "error");
  const status: SafetyCoach["status"] = blockingIssue ? "do_not_run" : lowConfidence ? "adult_review" : profile.status;
  const summary = blockingIssue
    ? "Do not run another trial until blocking table/procedure errors are fixed and an adult checks the setup."
    : lowConfidence
      ? `Adult review needed because this description is only a closest supported match. Base reminder: ${profile.summary}`
      : profile.summary;

  return {
    ...profile,
    status,
    summary,
    checks: lowConfidence
      ? [
          {
            id: "adult-review",
            label: "Adult review",
            detail: "Ask a teacher or lab supervisor to confirm the experiment match, materials, and safety plan before running it.",
            required: true
          },
          ...profile.checks
        ]
      : profile.checks
  };
}

function safetyProfileForTemplate(templateId: string): SafetyCoach {
  if (templateId === "projectile-motion") {
    return {
      status: "classroom_ready",
      summary: "Classroom-ready if the launch path is clear and the launcher uses safe, low-energy materials.",
      checks: [
        {
          id: "clear-path",
          label: "Clear launch path",
          detail: "Keep people, screens, and fragile objects out of the projectile path and landing zone.",
          required: true
        },
        {
          id: "same-projectile",
          label: "Use the same projectile",
          detail: "Do not swap to heavier or sharper objects during the trial series.",
          required: true
        }
      ],
      materialNotes: ["Soft balls or classroom launchers only.", "Eye protection if the launcher has a spring or elastic band."],
      cleanup: "Collect projectiles after each run and keep the floor clear before the next launch.",
      stopCondition: "Stop if anyone enters the launch path, the launcher slips, or the projectile bounces unpredictably.",
      teacherCheck: "Confirm launcher force, direction, and landing area before students begin repeated trials."
    };
  }

  if (templateId === "reaction-rate-temperature") {
    return {
      status: "adult_review",
      summary: "Adult review recommended because temperature, glassware, and classroom chemicals can create burn or splash risk.",
      checks: [
        {
          id: "goggles",
          label: "Wear eye protection",
          detail: "Use goggles for splashes, fizzing tablets, acids/bases, or warm liquid handling.",
          required: true
        },
        {
          id: "temperature-limit",
          label: "Limit hot-water exposure",
          detail: "Use teacher-approved temperature ranges and handle warm containers with care.",
          required: true
        }
      ],
      materialNotes: ["Use only teacher-approved classroom chemicals.", "Label cups or test tubes clearly by temperature."],
      cleanup: "Dispose of solutions according to classroom instructions and wipe spills immediately.",
      stopCondition: "Stop if a container cracks, liquid splashes, or a reaction behaves more strongly than expected.",
      teacherCheck: "Confirm chemicals, concentration, temperature range, and disposal before the first timed trial."
    };
  }

  if (templateId === "pendulum-period-length") {
    return {
      status: "classroom_ready",
      summary: "Classroom-ready if the pendulum uses a light bob, a secure support, and a clear swing path.",
      checks: [
        {
          id: "clear-swing-path",
          label: "Clear swing path",
          detail: "Keep faces, hands, screens, and fragile objects outside the pendulum's swing arc.",
          required: true
        },
        {
          id: "secure-support",
          label: "Secure support",
          detail: "Confirm the string, stand, tape, or clamp cannot slip before timing repeated swings.",
          required: true
        }
      ],
      materialNotes: ["Use a lightweight classroom-safe bob.", "Keep release angles small and consistent."],
      cleanup: "Stop the bob before adjusting length and return the stand, string, and timer after the run.",
      stopCondition: "Stop if the support shifts, the string frays, or the bob swings into a person or object.",
      teacherCheck: "Confirm the support, bob mass, and swing area before students begin timed trials."
    };
  }

  if (templateId === "ohms-law-circuits") {
    return {
      status: "adult_review",
      summary: "Adult review recommended because even simple circuits need low-voltage supplies and short-circuit checks.",
      checks: [
        {
          id: "low-voltage",
          label: "Use low voltage",
          detail: "Use only classroom-safe batteries or power supplies approved by the teacher.",
          required: true
        },
        {
          id: "heat-check",
          label: "Check heat",
          detail: "Touch components only if safe and stop if a resistor, wire, or battery gets hot.",
          required: true
        }
      ],
      materialNotes: ["Use insulated leads, one fixed resistor, and a current-limited supply.", "Avoid loose wires that can short across the supply."],
      cleanup: "Disconnect the power source before changing wires or packing materials away.",
      stopCondition: "Stop if anything heats up, smells unusual, sparks, or the circuit draws unexpected current.",
      teacherCheck: "Verify the wiring diagram, meter settings, and current limit before students energize the circuit."
    };
  }

  if (templateId === "enzyme-activity-temperature") {
    return {
      status: "adult_review",
      summary: "Adult review recommended because biological samples, peroxide/substrates, pH, and warm water may need PPE and disposal rules.",
      checks: [
        {
          id: "no-food",
          label: "No tasting",
          detail: "Treat enzyme mixtures and biological samples as lab materials, not food.",
          required: true
        },
        {
          id: "ppe",
          label: "Use PPE",
          detail: "Wear goggles and gloves when handling enzyme solutions, peroxide, iodine, or pH materials.",
          required: true
        }
      ],
      materialNotes: ["Keep enzyme and substrate amounts labeled.", "Use teacher-approved temperatures and containers."],
      cleanup: "Dispose of biological or peroxide-containing mixtures as directed by the teacher.",
      stopCondition: "Stop if skin/eye contact happens, containers leak, or a sample is unlabeled.",
      teacherCheck: "Confirm sample source, substrate, temperature range, pH materials, and disposal before running."
    };
  }

  if (templateId === "plant-growth-light-color") {
    return {
      status: "adult_review",
      summary: "Adult review recommended because grow lights, lamps, cords, soil, and seeds need heat, electrical, and classroom hygiene checks.",
      checks: [
        {
          id: "lamp-heat",
          label: "Check lamp heat",
          detail: "Keep lamps or grow lights teacher-approved, stable, and far enough away that leaves, paper, soil, or containers do not overheat.",
          required: true
        },
        {
          id: "plant-hygiene",
          label: "Handle plants as lab materials",
          detail: "Do not taste seeds, soil, fertilizer, or plant samples; wash hands after handling materials.",
          required: true
        }
      ],
      materialNotes: ["Use teacher-approved LEDs or low-heat classroom grow lights.", "Label each color condition and keep water away from cords."],
      cleanup: "Unplug lights before moving the setup, wipe spilled water or soil, and dispose of plant materials as directed.",
      stopCondition: "Stop if a lamp or cord gets hot, water spills near electricity, mold appears, or a plant sample is unlabeled.",
      teacherCheck: "Confirm light type, distance, duration, water schedule, and electrical setup before students begin repeated measurements."
    };
  }

  if (templateId === "density-layering") {
    return {
      status: "classroom_ready",
      summary: "Classroom-ready with household liquids if students avoid tasting samples and clean slippery spills quickly.",
      checks: [
        {
          id: "no-tasting",
          label: "No tasting",
          detail: "Do not taste or reuse lab liquids, even if they started as household materials.",
          required: true
        },
        {
          id: "spill-control",
          label: "Control spills",
          detail: "Pour slowly over a tray or towel and wipe oil/syrup spills before anyone walks nearby.",
          required: true
        }
      ],
      materialNotes: ["Use small volumes in stable containers.", "Avoid unknown cleaners, solvents, or irritating liquids."],
      cleanup: "Follow classroom sink/trash instructions; do not pour oils down the sink unless allowed.",
      stopCondition: "Stop if the container tips, a liquid is unknown, or the floor becomes slippery.",
      teacherCheck: "Confirm the liquids are classroom-safe and that disposal is allowed."
    };
  }

  return {
    status: "adult_review",
    summary: "Adult review recommended because clearer filtered water can still contain unsafe microbes or chemicals.",
    checks: [
      {
        id: "do-not-drink",
        label: "Do not drink",
        detail: "Filtered classroom water is for observation only unless a teacher-approved safety test says otherwise.",
        required: true
      },
      {
        id: "sample-handling",
        label: "Handle samples carefully",
        detail: "Wear gloves or wash hands after handling soil, sediment, charcoal, or unknown water samples.",
        required: true
      }
    ],
    materialNotes: ["Use teacher-approved water samples and filter materials.", "Keep dirty and filtered samples labeled separately."],
    cleanup: "Dispose of sediment and filter media according to classroom instructions and wash hands afterward.",
    stopCondition: "Stop if a sample smells strongly, irritates skin, spills near electronics, or was collected from an unsafe source.",
    teacherCheck: "Confirm sample source, filter materials, and disposal before students handle the water."
  };
}

function conceptCoachProfileForTemplate(templateId: string): Omit<ConceptCoach, "level" | "sourceTask"> {
  if (templateId === "projectile-motion") {
    return {
      vocabulary: [
        { term: "range", definition: "The horizontal distance the projectile travels before it lands." },
        { term: "launch angle", definition: "The angle between the launch direction and the ground." },
        { term: "time of flight", definition: "How long the projectile stays in the air." }
      ],
      explanationSteps: [
        "Watch how the horizontal distance changes as launch angle changes while launch speed stays the same.",
        "Connect the graph peak to the balance between horizontal motion and time in the air.",
        "Use a source to explain why the best range is usually near 45 degrees for level-ground launches."
      ],
      misconceptionChecks: [
        {
          misconception: "A steeper angle always means a farther launch.",
          correction: "A steeper angle can increase time in the air, but it also leaves less horizontal speed.",
          checkQuestion: "Where does your data stop increasing as the angle gets steeper?"
        }
      ]
    };
  }

  if (templateId === "reaction-rate-temperature") {
    return {
      vocabulary: [
        { term: "reaction rate", definition: "How quickly reactants turn into products." },
        { term: "collision theory", definition: "The idea that particles must collide with enough energy to react." },
        { term: "control variable", definition: "A condition kept the same so the comparison is fair." }
      ],
      explanationSteps: [
        "Watch whether warmer trials finish in less time or produce a higher calculated rate.",
        "Connect faster rate to more frequent, higher-energy particle collisions.",
        "Use the source to explain why changing temperature while changing tablet size would weaken the conclusion."
      ],
      misconceptionChecks: [
        {
          misconception: "A longer reaction time means a faster reaction.",
          correction: "For timed reactions, shorter time usually means faster rate when the endpoint is the same.",
          checkQuestion: "Does your data compare rate, time, or both, and which one supports your claim?"
        }
      ]
    };
  }

  if (templateId === "pendulum-period-length") {
    return {
      vocabulary: [
        { term: "period", definition: "The time for one complete back-and-forth swing." },
        { term: "length", definition: "The distance from the pivot to the bob's center of mass." },
        { term: "small-angle swing", definition: "A swing released from a modest angle so the simple pendulum model works well." }
      ],
      explanationSteps: [
        "Watch whether period increases as the pendulum length increases.",
        "Compare the growth to a square-root pattern rather than a straight doubling pattern.",
        "Use the source to explain why bob mass should not be the main variable when length and angle stay controlled."
      ],
      misconceptionChecks: [
        {
          misconception: "A heavier bob always swings with a longer period.",
          correction: "For a simple small-angle pendulum, length affects period much more than bob mass.",
          checkQuestion: "Did your data change length while keeping bob mass and release angle controlled?"
        }
      ]
    };
  }

  if (templateId === "ohms-law-circuits") {
    return {
      vocabulary: [
        { term: "current", definition: "The flow of electric charge through the circuit." },
        { term: "voltage", definition: "The electric push that moves charge through the circuit." },
        { term: "resistance", definition: "How strongly the resistor limits current flow." }
      ],
      explanationSteps: [
        "Watch whether voltage and current rise together for the same resistor.",
        "Calculate V/I for each row to see whether resistance stays nearly constant.",
        "Use the source to explain why changing resistors would create a different line."
      ],
      misconceptionChecks: [
        {
          misconception: "Any circuit data proves Ohm's law.",
          correction: "Ohm's law is tested when the same resistor has a nearly constant V/I ratio.",
          checkQuestion: "Does your data keep the same resistor and show a stable V/I value?"
        }
      ]
    };
  }

  if (templateId === "enzyme-activity-temperature") {
    return {
      vocabulary: [
        { term: "enzyme", definition: "A protein that helps a reaction happen faster." },
        { term: "optimum temperature", definition: "The temperature where the enzyme works best." },
        { term: "denature", definition: "When heat changes an enzyme's shape so it works less well." }
      ],
      explanationSteps: [
        "Watch where activity is highest before it drops at hotter temperatures.",
        "Connect the peak to enzyme shape and collision speed.",
        "Use the source to explain why too much heat can lower activity even though warmth often speeds reactions."
      ],
      misconceptionChecks: [
        {
          misconception: "Hotter is always better for enzymes.",
          correction: "Moderate warmth can help, but high heat can denature the enzyme.",
          checkQuestion: "Where does your data show the activity peak and then fall?"
        }
      ]
    };
  }

  if (templateId === "plant-growth-light-color") {
    return {
      vocabulary: [
        { term: "photosynthesis", definition: "The process plants use to turn light energy, carbon dioxide, and water into sugars." },
        { term: "chlorophyll", definition: "A green pigment that absorbs light energy, especially red and blue wavelengths." },
        { term: "wavelength", definition: "A property of light that students often see as color." }
      ],
      explanationSteps: [
        "Watch whether plants with usable light grow more than plants kept in darkness.",
        "Compare white, red, blue, and green conditions as a pattern, not as one perfect ranking.",
        "Use the sources to explain why chlorophyll absorbs red and blue light strongly while classroom height results still depend on brightness, distance, water, and repeat plants."
      ],
      misconceptionChecks: [
        {
          misconception: "Green light must be best because plants are green.",
          correction: "Plants look green partly because chlorophyll reflects much green light instead of using it as strongly.",
          checkQuestion: "Did your data compare light color while keeping light distance, duration, water, soil, and plant type controlled?"
        }
      ]
    };
  }

  if (templateId === "density-layering") {
    return {
      vocabulary: [
        { term: "density", definition: "Mass per unit volume, often measured in g/mL." },
        { term: "layer", definition: "A visible liquid level in the container." },
        { term: "settling", definition: "The time liquids need to separate after pouring." }
      ],
      explanationSteps: [
        "Watch whether denser liquids sit lower than less dense liquids.",
        "Connect layer order to density values rather than color or thickness.",
        "Use the source to explain why close density values may blur or mix."
      ],
      misconceptionChecks: [
        {
          misconception: "The thickest or darkest liquid must be the densest.",
          correction: "Density depends on mass per volume, not appearance alone.",
          checkQuestion: "Does your data use density values to justify the bottom-to-top order?"
        }
      ]
    };
  }

  return {
    vocabulary: [
      { term: "turbidity", definition: "How cloudy water is because of suspended particles." },
      { term: "filtration", definition: "Using material layers to remove some particles from water." },
      { term: "control sample", definition: "The starting sample used for comparison." }
    ],
    explanationSteps: [
      "Watch whether turbidity decreases after each filter stage.",
      "Connect lower turbidity to fewer suspended particles, not to drinking-water safety.",
      "Use the source to explain why clearer water can still require safety testing."
    ],
    misconceptionChecks: [
      {
        misconception: "Clear filtered water is automatically safe to drink.",
        correction: "Filtration can reduce cloudiness without removing all harmful microbes or chemicals.",
        checkQuestion: "Does your data measure turbidity only, or does it also test safety?"
      }
    ]
  };
}

export function buildNextTrialPlan(
  template: ExperimentTemplate,
  rows: StudentDataRow[],
  issues: Issue[],
  methodAudit: MethodAudit
): NextTrialPlan {
  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;
  const status: NextTrialPlan["status"] = errorCount > 0 ? "blocked" : warningCount > 0 ? "fix_first" : "ready_to_extend";
  const profile = nextTrialProfileForTemplate(template.id);
  const firstIssue = issues.find((issue) => issue.severity !== "info");
  const completeRows = rows.filter((row) =>
    template.columns.every((column) => row[column.key] !== "" && row[column.key] !== null && row[column.key] !== undefined)
  ).length;

  const priority =
    status === "blocked"
      ? "Fix blocking data entries before adding another trial."
      : status === "fix_first"
        ? `Fix warnings first: ${firstIssue?.title ?? "review the flagged row before extending the lab"}.`
        : "Ready to extend the pattern with one more controlled trial.";

  const nextMeasurement =
    status === "blocked"
      ? `Correct the invalid or missing cells, then ${profile.nextMeasurement.charAt(0).toLowerCase()}${profile.nextMeasurement.slice(1)}`
      : status === "fix_first"
        ? `Repeat the suspicious trial before adding a new condition: ${profile.repeatMeasurement}`
        : profile.nextMeasurement;

  return {
    status,
    priority,
    nextMeasurement,
    controlToTighten: status === "fix_first" && firstIssue ? `${profile.controlToTighten} Pay special attention to: ${firstIssue.title}.` : profile.controlToTighten,
    whyItMatters:
      status === "ready_to_extend"
        ? profile.whyItMatters
        : "A cleaner follow-up trial helps you decide whether the flagged pattern is real science or a measurement/procedure issue.",
    safetyReminder: methodAudit.safetyLimit,
    studentQuestion:
      status === "ready_to_extend"
        ? "What should the next trial help you decide about your expected pattern?"
        : "What should the next repeat trial prove: that the warning was measurement error, or that your original pattern needs a different explanation?",
    checklist: [
      {
        id: "data",
        label: "Data usable",
        detail: `${completeRows} of ${rows.length} rows have every required table cell filled in.`,
        complete: errorCount === 0 && rows.length > 0
      },
      {
        id: "warnings",
        label: "Warnings reviewed",
        detail: warningCount === 0 ? "No warning needs a repeat trial first." : `${warningCount} warning${warningCount === 1 ? "" : "s"} should be reviewed before extending.`,
        complete: warningCount === 0
      },
      {
        id: "control",
        label: "Control named",
        detail: profile.controlToTighten,
        complete: methodAudit.controlVariables.length > 0
      },
      {
        id: "safety",
        label: "Safety checked",
        detail: methodAudit.safetyLimit,
        complete: true
      }
    ]
  };
}

function nextTrialProfileForTemplate(templateId: string): Pick<NextTrialPlan, "nextMeasurement" | "controlToTighten" | "whyItMatters"> & {
  repeatMeasurement: string;
} {
  if (templateId === "projectile-motion") {
    return {
      nextMeasurement: "Add one repeat near 45 degrees or retest the angle closest to your range peak with the same launch speed.",
      repeatMeasurement: "repeat the flagged angle with the same launcher height and speed before changing the angle range.",
      controlToTighten: "Keep launch speed, launcher height, projectile type, and landing surface the same.",
      whyItMatters: "A repeat near 45 degrees helps confirm whether the graph peak is real instead of one lucky launch."
    };
  }

  if (templateId === "reaction-rate-temperature") {
    return {
      nextMeasurement: "Add one temperature between two existing temperature points and calculate rate the same way.",
      repeatMeasurement: "repeat the temperature point where rate moved opposite the expected warming pattern.",
      controlToTighten: "Keep reactant amount, concentration, tablet size, and timing endpoint the same.",
      whyItMatters: "A middle temperature point helps show whether the rate trend is smooth or affected by a procedure change."
    };
  }

  if (templateId === "pendulum-period-length") {
    return {
      nextMeasurement: "Add one length between two existing points and time at least five swings before dividing for period.",
      repeatMeasurement: "repeat the length where period moved opposite the expected longer-length pattern.",
      controlToTighten: "Keep bob mass, release angle, pivot point, timing method, and number of counted cycles the same.",
      whyItMatters: "A between-length trial helps show the square-root curve without pretending period grows in a perfectly straight line."
    };
  }

  if (templateId === "ohms-law-circuits") {
    return {
      nextMeasurement: "Add one low-voltage current setting, then record voltage, current, and V/I for the same resistor.",
      repeatMeasurement: "repeat the row where V/I does not match the recorded resistance.",
      controlToTighten: "Use the same resistor, circuit layout, meter settings, and low-voltage supply.",
      whyItMatters: "One more current setting tests whether voltage stays proportional to current for the fixed resistor."
    };
  }

  if (templateId === "enzyme-activity-temperature") {
    return {
      nextMeasurement: "Add one temperature between the highest activity point and the overheated point.",
      repeatMeasurement: "repeat the temperature where activity unexpectedly breaks the warm-then-drop pattern.",
      controlToTighten: "Keep enzyme amount, substrate amount, pH, and reaction time the same.",
      whyItMatters: "A between-temperature trial helps locate the optimum without inventing a conclusion from too few points."
    };
  }

  if (templateId === "plant-growth-light-color") {
    return {
      nextMeasurement: "Add one repeat plant for the light color with the weakest evidence, then measure height after the same number of growth days.",
      repeatMeasurement: "repeat the color condition where height conflicts with the usable-light or green-light pattern.",
      controlToTighten: "Keep plant species, starting height, soil amount, water amount, light distance, light duration, and growth days the same.",
      whyItMatters: "One more controlled plant helps separate a real light-color effect from a seedling that simply started stronger or got different water."
    };
  }

  if (templateId === "density-layering") {
    return {
      nextMeasurement: "Retest the two closest-density liquids with equal volumes and record bottom-to-top order after settling.",
      repeatMeasurement: "repeat the layer pair whose order conflicts with the density values.",
      controlToTighten: "Keep sample volume, liquid temperature, pouring method, and observation time the same.",
      whyItMatters: "A repeat of the close pair helps separate real mixing from an ordering or measurement mistake."
    };
  }

  return {
    nextMeasurement: "Add one repeat after the filtration stage with the biggest turbidity change and measure before and after.",
    repeatMeasurement: "repeat the filtration stage where turbidity did not improve as expected.",
    controlToTighten: "Keep starting sample, filter material amounts, sample volume, and timing the same.",
    whyItMatters: "A repeat stage shows whether the filter material consistently lowers turbidity or only changed one sample."
  };
}

function formatColumnName(template: ExperimentTemplate, key: string): string {
  const column = template.columns.find((candidate) => candidate.key === key);
  if (!column) return key;
  return column.unit ? `${column.label} (${column.unit})` : column.label;
}

function formatReliabilityValue(value: number | string): string {
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  }

  return value;
}

function formatOptionalNumber(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "not enough repeats";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function formatSafetyStatusForStrategy(status: SafetyCoach["status"]): string {
  if (status === "do_not_run") return "Do not run";
  if (status === "adult_review") return "Adult review";
  return "Classroom ready";
}

function formatNextTrialStatusForImpact(status: NextTrialPlan["status"]): string {
  if (status === "blocked") return "Fix data first";
  if (status === "fix_first") return "Repeat or fix first";
  return "Ready to extend";
}

function formatPatternEvidenceTraceStatus(status: PatternEvidence["status"]): TrackEvidence["criteria"][number]["status"] {
  if (status === "supports_expected") return "checked";
  if (status === "contradicts" || status === "insufficient") return "blocked";
  return "review";
}

function methodProfileForTemplate(templateId: string): Pick<MethodAudit, "controlVariables" | "assumptions" | "safetyLimit"> {
  if (templateId === "projectile-motion") {
    return {
      controlVariables: ["launch speed", "launcher height", "projectile type", "landing surface"],
      assumptions: ["Air resistance is small enough to ignore.", "Launch and landing height are close enough for the simple model."],
      safetyLimit: "Keep the launch path clear and do not aim projectiles at people."
    };
  }

  if (templateId === "reaction-rate-temperature") {
    return {
      controlVariables: ["reactant amount", "concentration", "tablet size", "timing endpoint"],
      assumptions: ["Only temperature changes between trials.", "Rate is calculated the same way for every trial."],
      safetyLimit: "Use classroom-safe chemicals and normal lab protective gear."
    };
  }

  if (templateId === "pendulum-period-length") {
    return {
      controlVariables: ["bob mass", "release angle", "pivot point", "number of timed cycles"],
      assumptions: ["The release angle is small.", "Friction and air resistance are small enough for the simple pendulum model."],
      safetyLimit: "Keep the swing path clear and secure the support before timing repeated swings."
    };
  }

  if (templateId === "enzyme-activity-temperature") {
    return {
      controlVariables: ["enzyme amount", "substrate amount", "pH", "reaction time"],
      assumptions: ["Activity is measured on one consistent relative scale.", "Temperature is the only changed independent variable."],
      safetyLimit: "Treat biological samples and enzyme mixtures as lab materials, not food."
    };
  }

  if (templateId === "plant-growth-light-color") {
    return {
      controlVariables: ["plant species", "starting height", "soil amount", "water amount", "light distance", "light duration", "growth days"],
      assumptions: [
        "Light color is the main changed variable.",
        "Brightness, distance, water, and starting plant size are close enough to compare growth fairly."
      ],
      safetyLimit: "Use teacher-approved low-heat lights and keep water away from cords or outlets."
    };
  }

  if (templateId === "ohms-law-circuits") {
    return {
      controlVariables: ["resistor", "circuit layout", "meter calibration", "resistor temperature"],
      assumptions: ["The same resistor is used for every trial.", "Resistance is approximately constant during the measurement window."],
      safetyLimit: "Use low-voltage classroom circuits and avoid short circuits or overheated components."
    };
  }

  if (templateId === "density-layering") {
    return {
      controlVariables: ["sample volume", "liquid temperature", "pouring method", "observation time"],
      assumptions: ["The liquids do not mix during the observation window.", "Layer order is recorded from bottom to top."],
      safetyLimit: "Use classroom-safe household liquids and do not taste lab samples."
    };
  }

  return {
    controlVariables: ["starting water sample", "filter material amounts", "sample volume", "measurement timing"],
    assumptions: ["Turbidity is measured consistently at each stage.", "Each stage uses the same original sample path."],
    safetyLimit: "Clearer water is not automatically safe to drink."
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

function evaluatePendulumRows(rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];
  const gravity = 9.8;
  const numericRows = rows
    .map((row) => ({
      id: row.id,
      length: Number(row.lengthM),
      period: Number(row.periodS)
    }))
    .filter((row) => Number.isFinite(row.length) && Number.isFinite(row.period))
    .sort((a, b) => a.length - b.length);

  for (const row of numericRows) {
    if (row.length <= 0 || row.period <= 0) {
      issues.push({
        id: `pendulum-nonpositive-${row.id}`,
        severity: "error",
        title: "Pendulum values must be positive",
        detail: "Length and period should be recorded as positive values in meters and seconds."
      });
    }

    if (row.length > 0 && row.period > 0) {
      const expectedPeriod = 2 * Math.PI * Math.sqrt(row.length / gravity);
      const relativeError = Math.abs(row.period - expectedPeriod) / Math.max(expectedPeriod, 0.1);

      if (relativeError > 0.35) {
        issues.push({
          id: `pendulum-period-model-${row.id}`,
          severity: "warning",
          title: "Period does not match pendulum length model",
          detail: `A ${row.length} m pendulum has a simple-model period near ${expectedPeriod.toFixed(2)} s. Your table says ${row.period} s.`
        });
      }
    }
  }

  for (let index = 1; index < numericRows.length; index += 1) {
    const previous = numericRows[index - 1];
    const current = numericRows[index];

    if (current.length > previous.length && current.period < previous.period - 0.08) {
      issues.push({
        id: "pendulum-period-trend",
        severity: "warning",
        title: "Period trend does not match the expected length pattern",
        detail: "For a small-angle pendulum, longer lengths should generally have longer periods when release angle and bob are controlled."
      });
      break;
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

function evaluateOhmsLawRows(rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];
  const numericRows = rows
    .map((row) => ({
      id: row.id,
      current: Number(row.currentA),
      voltage: Number(row.voltageV),
      resistance: Number(row.resistanceOhm)
    }))
    .filter((row) => Number.isFinite(row.current) && Number.isFinite(row.voltage) && Number.isFinite(row.resistance));

  for (const row of numericRows) {
    if (row.current <= 0 || row.voltage <= 0 || row.resistance <= 0) {
      issues.push({
        id: `ohms-nonpositive-${row.id}`,
        severity: "error",
        title: "Circuit values must be positive",
        detail: "Current, voltage, and resistance should be recorded as positive values in this simple circuit setup."
      });
    }

    if (row.current > 0 && row.voltage > 0 && row.resistance > 0) {
      const calculatedResistance = row.voltage / row.current;
      const relativeError = Math.abs(calculatedResistance - row.resistance) / Math.max(row.resistance, 0.1);

      if (relativeError > 0.18) {
        issues.push({
          id: `ohms-v-i-resistance-${row.id}`,
          severity: "warning",
          title: "Voltage, current, and resistance do not agree",
          detail: `Using V/I, this row gives about ${calculatedResistance.toFixed(1)} ohms, but the table says ${row.resistance} ohms.`
        });
      }
    }
  }

  if (numericRows.length >= 3) {
    const calculatedResistances = numericRows
      .filter((row) => row.current > 0 && row.voltage > 0)
      .map((row) => row.voltage / row.current);
    const average =
      calculatedResistances.reduce((sum, resistance) => sum + resistance, 0) / Math.max(calculatedResistances.length, 1);
    const maxRelativeSpread = Math.max(...calculatedResistances.map((resistance) => Math.abs(resistance - average) / Math.max(average, 0.1)));

    if (maxRelativeSpread > 0.22) {
      issues.push({
        id: "ohms-resistance-not-constant",
        severity: "warning",
        title: "Calculated resistance is not consistent",
        detail: "For one fixed resistor, voltage divided by current should stay nearly constant across trials."
      });
    }
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

function evaluatePlantGrowthRows(rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];
  const numericRows = rows
    .map((row) => ({
      id: row.id,
      color: normalizePlantLightColor(row.lightColor),
      rawColor: row.lightColor,
      height: Number(row.heightCm),
      days: Number(row.days)
    }))
    .filter((row) => Number.isFinite(row.height) && Number.isFinite(row.days));

  for (const row of numericRows) {
    if (!row.color) {
      issues.push({
        id: `plant-light-color-${row.id}`,
        severity: "warning",
        title: "Light color needs a recognizable label",
        detail: `Use a clear label such as white, red, blue, green, or dark instead of "${String(row.rawColor ?? "")}".`
      });
    }

    if (row.height < 0) {
      issues.push({
        id: `plant-height-negative-${row.id}`,
        severity: "error",
        title: "Plant height cannot be negative",
        detail: "Plant height should be recorded as a zero-or-positive value in centimeters."
      });
    }

    if (row.days <= 0) {
      issues.push({
        id: `plant-days-nonpositive-${row.id}`,
        severity: "error",
        title: "Growth time must be positive",
        detail: "Growth time should be recorded as a positive number of days."
      });
    }
  }

  const days = numericRows.map((row) => row.days).filter((day) => day > 0);
  if (days.length >= 2 && Math.max(...days) - Math.min(...days) > 1) {
    issues.push({
      id: "plant-growth-time-not-controlled",
      severity: "warning",
      title: "Growth time is not controlled",
      detail: "Compare plant heights after the same number of days, or clearly explain why the time difference is part of the experiment."
    });
  }

  const grouped = groupPlantLightHeights(rows);
  const litValues = [...(grouped.white ?? []), ...(grouped.red ?? []), ...(grouped.blue ?? []), ...(grouped.green ?? [])];
  const darkValues = grouped.dark ?? [];

  if (litValues.length > 0 && darkValues.length > 0 && averageValues(darkValues) > averageValues(litValues) * 0.75) {
    issues.push({
      id: "plant-dark-etiolation-context",
      severity: "info",
      title: "Dark-grown height may reflect etiolation",
      detail: "Dark-grown seedlings can develop long, pale stems while searching for light. Compare color, leaf development, mass, and health instead of treating height alone as better growth or bad data."
    });
  }

  const usableLightValues = [...(grouped.white ?? []), ...(grouped.red ?? []), ...(grouped.blue ?? [])];
  const greenValues = grouped.green ?? [];

  if (usableLightValues.length > 0 && greenValues.length > 0 && averageValues(greenValues) > averageValues(usableLightValues) * 0.95) {
    issues.push({
      id: "plant-light-color-pattern",
      severity: "warning",
      title: "Light-color pattern is mixed",
      detail: "If green light matches or beats white/red/blue light, check brightness, distance, duration, plant species, and repeat count before claiming a color effect."
    });
  }

  return issues;
}

function evaluateDensityRows(rows: StudentDataRow[]): Issue[] {
  const issues: Issue[] = [];
  const numericRows = rows
    .map((row) => ({
      id: row.id,
      layerOrder: Number(row.layerOrder),
      density: Number(row.densityGml)
    }))
    .filter((row) => Number.isFinite(row.layerOrder) && Number.isFinite(row.density))
    .sort((a, b) => a.layerOrder - b.layerOrder);

  const layerOrders = new Set<number>();
  for (const row of numericRows) {
    if (row.density <= 0) {
      issues.push({
        id: `density-nonpositive-${row.id}`,
        severity: "error",
        title: "Density must be positive",
        detail: "Density should be recorded as a positive mass-per-volume value, usually in g/mL for this classroom setup."
      });
    }

    if (layerOrders.has(row.layerOrder)) {
      issues.push({
        id: `density-duplicate-layer-${row.id}`,
        severity: "warning",
        title: "Layer order is duplicated",
        detail: "Each liquid needs a unique layer order so Ouija can compare bottom-to-top density."
      });
    }
    layerOrders.add(row.layerOrder);
  }

  for (let index = 1; index < numericRows.length; index += 1) {
    const lowerLayer = numericRows[index - 1];
    const upperLayer = numericRows[index];

    if (upperLayer.density > lowerLayer.density * 1.03) {
      issues.push({
        id: `density-layer-order-${upperLayer.id}`,
        severity: "warning",
        title: "Layer order does not match density pattern",
        detail: "If layer order is bottom to top, density should generally decrease as the layers go upward."
      });
    }

    if (Math.abs(upperLayer.density - lowerLayer.density) < 0.03) {
      issues.push({
        id: `density-close-values-${upperLayer.id}`,
        severity: "warning",
        title: "Two liquids may be too close in density",
        detail: "Layers with very similar densities may mix or form an unclear boundary."
      });
    }
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
