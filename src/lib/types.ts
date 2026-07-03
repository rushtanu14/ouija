export type SubjectArea = "Physics" | "Chemistry" | "Biology" | "Earth Science";

export type GraphKind = "line" | "scatter" | "stage";

export interface StudentDataRow {
  id: string;
  [key: string]: string | number;
}

export interface DataColumn {
  key: string;
  label: string;
  unit?: string;
  numeric: boolean;
}

export interface SourceCard {
  id: string;
  title: string;
  url: string;
  publisher: string;
  confidence: "built-in" | "web" | "mixed";
  note: string;
}

export interface ExpectedResult {
  summary: string;
  pattern: string;
  graphTitle: string;
  xKey: string;
  yKey: string;
  graphKind: GraphKind;
  mixedEvidence: boolean;
}

export interface ExperimentTemplate {
  id: string;
  subject: SubjectArea;
  title: string;
  shortName: string;
  matcherKeywords: string[];
  concepts: string[];
  variables: string[];
  columns: DataColumn[];
  sampleRows: StudentDataRow[];
  expectedResult: ExpectedResult;
  explanation: string;
  commonMistakes: string[];
  fallbackSources: SourceCard[];
}

export interface Issue {
  id: string;
  severity: "info" | "warning" | "error";
  title: string;
  detail: string;
}

export interface LabBriefChecklistItem {
  id: string;
  label: string;
  detail: string;
  complete: boolean;
}

export interface LabBrief {
  status: "ready_to_reason" | "needs_checks" | "blocked";
  signal: string;
  claimStarter: string;
  evidenceChecklist: LabBriefChecklistItem[];
  sourceTrail: Array<Pick<SourceCard, "publisher" | "title" | "url">>;
  nextQuestion: string;
  integrityBoundary: string;
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface MisconceptionCheck {
  misconception: string;
  correction: string;
  checkQuestion: string;
}

export interface ConceptCoach {
  level: "middle_high_school";
  vocabulary: VocabularyTerm[];
  explanationSteps: string[];
  misconceptionChecks: MisconceptionCheck[];
  sourceTask: string;
}

export interface SafetyCheck {
  id: string;
  label: string;
  detail: string;
  required: boolean;
}

export interface SafetyCoach {
  status: "classroom_ready" | "adult_review" | "do_not_run";
  summary: string;
  checks: SafetyCheck[];
  materialNotes: string[];
  cleanup: string;
  stopCondition: string;
  teacherCheck: string;
}

export interface GuidedFlowStep {
  id: string;
  label: string;
  status: "done" | "review" | "next" | "blocked";
  detail: string;
}

export interface GuidedLabFlow {
  currentAction: string;
  steps: GuidedFlowStep[];
}

export interface ModelStrategySignal {
  label: string;
  value: string;
  detail: string;
}

export interface ClassificationCandidate {
  templateId: string;
  title: string;
  subject: SubjectArea;
  score: number;
  confidence: number;
  evidence: string[];
  missingSignals: string[];
}

export interface ModelStrategy {
  classifier: string;
  selectedTemplateId: string;
  decisionSummary: string;
  fallbackStrategy: string;
  groundingMode: "fallback" | "web_enriched";
  signals: ModelStrategySignal[];
  candidates: ClassificationCandidate[];
  riskControls: string[];
}

export interface ImpactMetric {
  id: "student-outcome" | "data-quality" | "concept-learning" | "integrity" | "pattern-evidence" | "repeat-reliability" | "next-trial";
  label: string;
  value: string;
  status: "strong" | "watch" | "needs_action";
  detail: string;
}

export interface LearningImpactSnapshot {
  score: number;
  headline: string;
  studentOutcome: string;
  metrics: ImpactMetric[];
  evidenceLoop: string[];
}

export interface LearningExitTicketPrompt {
  id: "variable-check" | "pattern-check" | "next-step-check";
  label: string;
  studentPrompt: string;
  evidenceToUse: string;
  teacherSignal: string;
}

export interface LearningExitTicket {
  status: "ready" | "review" | "blocked";
  summary: string;
  prompts: LearningExitTicketPrompt[];
  integrityBoundary: string;
  judgeTakeaway: string;
}

export interface MethodAudit {
  status: "strong" | "needs_review" | "blocked";
  score: number;
  independentVariable: string;
  dependentVariable: string;
  controlVariables: string[];
  assumptions: string[];
  confounds: string[];
  safetyLimit: string;
}

export interface ExpectedComparisonPoint {
  rowId: string;
  xValue: string | number;
  observedY: number | null;
  expectedY: number | null;
  delta: number | null;
  label: string;
  note: string;
}

export interface ExpectedComparison {
  observedLabel: string;
  expectedLabel: string;
  summary: string;
  points: ExpectedComparisonPoint[];
}

export interface ReliabilityGroup {
  id: string;
  label: string;
  count: number;
  average: number | null;
  spread: number | null;
  status: "strong" | "needs_repeat" | "review_spread";
  note: string;
}

export interface ReliabilityCoach {
  status: "strong" | "needs_repeats" | "review_spread" | "blocked";
  score: number;
  summary: string;
  xLabel: string;
  yLabel: string;
  repeatGroups: ReliabilityGroup[];
  recommendation: string;
  studentQuestion: string;
}

export interface PatternEvidenceObservation {
  id: string;
  label: string;
  expected: string;
  observed: string;
  status: "supports" | "mixed" | "contradicts" | "insufficient";
  detail: string;
}

export interface PatternEvidence {
  status: "supports_expected" | "mixed" | "contradicts" | "insufficient";
  score: number;
  summary: string;
  method: string;
  observations: PatternEvidenceObservation[];
  studentQuestion: string;
}

export interface GroundingAuditCheck {
  id: string;
  label: string;
  status: "verified" | "review" | "mixed";
  detail: string;
}

export interface GroundingAudit {
  status: "source_backed" | "mixed_evidence" | "needs_review";
  score: number;
  summary: string;
  modeLabel: string;
  consensus: string;
  sourceCount: number;
  checks: GroundingAuditCheck[];
  studentTask: string;
  citationNote: string;
}

export interface AiEvaluationCheck {
  id: string;
  label: string;
  status: "pass" | "review" | "fail";
  score: number;
  detail: string;
}

export interface AiEvaluationHarness {
  status: "validated" | "review" | "blocked";
  score: number;
  summary: string;
  coverage: string;
  checks: AiEvaluationCheck[];
  judgeSignal: string;
  failureMode: string;
}

export interface DataHandlingFlow {
  id: "description" | "table-data" | "local-snapshot" | "grounding-sources" | "server-api-key";
  label: string;
  purpose: string;
  storage: string;
  retention: string;
  studentControl: string;
  status: "protected" | "review";
}

export interface DataHandlingLedger {
  status: "privacy_preserving" | "review";
  score: number;
  summary: string;
  flows: DataHandlingFlow[];
  safeguards: string[];
  studentRights: string[];
  judgeTakeaway: string;
}

export interface JudgeDemoStep {
  id: "problem" | "ai-design" | "student-workflow" | "evidence-handoff" | "submission-proof";
  label: string;
  criterion: "Problem Definition & Real-World Relevance" | "AI Technical Design & Model Strategy" | "User Experience & Design" | "Submission Proof";
  status: "show" | "review" | "blocked";
  proof: string;
  demoAction: string;
}

export interface JudgeDemoPath {
  status: "ready" | "review" | "blocked";
  headline: string;
  summary: string;
  nextBestAction: string;
  steps: JudgeDemoStep[];
}

export interface CustomLabPlanner {
  title: string;
  independentVariable: string;
  dependentVariable: string;
  controlVariables: string[];
  repeatPlan: string;
  starterRows: StudentDataRow[];
  qualityChecklist: string[];
  hypothesisStarter: string;
}

export interface CustomLabTriage {
  status: "supported_template" | "needs_student_details";
  summary: string;
  inferredFocus: string;
  suggestedColumns: DataColumn[];
  sourceSearches: string[];
  clarifyingQuestions: string[];
  planner: CustomLabPlanner;
  safetyBoundary: string;
  studentNextAction: string;
}

export interface NextTrialChecklistItem {
  id: string;
  label: string;
  detail: string;
  complete: boolean;
}

export interface NextTrialPlan {
  status: "ready_to_extend" | "fix_first" | "blocked";
  priority: string;
  nextMeasurement: string;
  controlToTighten: string;
  whyItMatters: string;
  safetyReminder: string;
  studentQuestion: string;
  checklist: NextTrialChecklistItem[];
}

export interface ReasoningTraceStep {
  id: string;
  label: string;
  status: "checked" | "review" | "blocked";
  detail: string;
}

export interface TrackEvidence {
  readiness: "competitive" | "submittable" | "needs_work";
  score: number;
  verdict: string;
  criteria: ReasoningTraceStep[];
  pipeline: ReasoningTraceStep[];
}

export interface ProgressPortfolioSnapshot {
  id: string;
  title: string;
  subject: string;
  savedAt: string;
  score: number;
  readiness: TrackEvidence["readiness"];
  issueCount: number;
}

export interface ProgressPortfolioMetric {
  id: "saved-runs" | "score-trend" | "subject-breadth" | "best-readiness";
  label: string;
  value: string;
  status: "strong" | "watch" | "needs_action";
  detail: string;
}

export interface ProgressPortfolioMilestone {
  id: "first-saved-run" | "strongest-run" | "latest-next-step";
  label: string;
  title: string;
  detail: string;
}

export interface ProgressPortfolio {
  status: "empty" | "building" | "evidence_ready";
  summary: string;
  metrics: ProgressPortfolioMetric[];
  milestones: ProgressPortfolioMilestone[];
  nextAction: string;
  judgeTakeaway: string;
}

export type RubricStatus = "strong" | "ready" | "review";

export interface RubricCriterionFit {
  id: "problem-real-world" | "ai-design-model-strategy" | "ux-design";
  label: string;
  status: RubricStatus;
  evidence: string[];
  judgeTakeaway: string;
}

export interface OfficialRubricFit {
  score: number;
  verdict: string;
  criteria: RubricCriterionFit[];
}

export interface EvaluationCaseResult {
  id: string;
  label: string;
  goal: string;
  status: "pass" | "review" | "fail";
  expected: string;
  outcome: string;
  evidence: string[];
}

export interface EvaluationReport {
  suiteLabel: string;
  score: number;
  passed: number;
  total: number;
  status: "pass" | "review";
  verdict: string;
  cases: EvaluationCaseResult[];
}

export interface AnalyzeRequest {
  description: string;
  rows?: StudentDataRow[];
}

export interface AnalyzeResult {
  templateId: string;
  classification: {
    subject: SubjectArea;
    title: string;
    confidence: number;
    matchQuality: "supported_template" | "closest_supported";
    coverageNote: string;
    concepts: string[];
  };
  variables: string[];
  expectedResult: ExpectedResult;
  sources: SourceCard[];
  columns: DataColumn[];
  rows: StudentDataRow[];
  issues: Issue[];
  hints: string[];
  guidedFlow: GuidedLabFlow;
  modelStrategy: ModelStrategy;
  conceptCoach: ConceptCoach;
  safetyCoach: SafetyCoach;
  labBrief: LabBrief;
  methodAudit: MethodAudit;
  expectedComparison: ExpectedComparison;
  reliabilityCoach: ReliabilityCoach;
  patternEvidence: PatternEvidence;
  groundingAudit: GroundingAudit;
  aiEvaluationHarness: AiEvaluationHarness;
  dataHandlingLedger: DataHandlingLedger;
  judgeDemoPath: JudgeDemoPath;
  customLabTriage: CustomLabTriage;
  nextTrialPlan: NextTrialPlan;
  impactSnapshot: LearningImpactSnapshot;
  learningExitTicket: LearningExitTicket;
  officialRubricFit: OfficialRubricFit;
  trackEvidence: TrackEvidence;
  explanation: string;
  integrityNotice: string;
  groundingStatus: {
    mode: "fallback" | "web_enriched";
    note: string;
  };
}
