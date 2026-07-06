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

export type StudentReflectionStatus = "not_started" | "drafting" | "ready_for_review";

export type StudentReflectionEntryStatus = "empty" | "too_short" | "ready";

export type StudentReflectionAnswers = Partial<Record<LearningExitTicketPrompt["id"], string>>;

export interface StudentReflectionEntry {
  promptId: LearningExitTicketPrompt["id"];
  label: string;
  studentPrompt: string;
  evidenceToUse: string;
  teacherSignal: string;
  answer: string;
  wordCount: number;
  status: StudentReflectionEntryStatus;
}

export interface StudentReflectionWorkspace {
  status: StudentReflectionStatus;
  summary: string;
  readyCount: number;
  totalCount: number;
  entries: StudentReflectionEntry[];
  nextAction: string;
  integrityBoundary: string;
  teacherTakeaway: string;
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

export interface PreLabVariablePlan {
  independentVariable: string;
  dependentVariable: string;
  controlVariables: string[];
}

export interface PreLabSetupCheck {
  id: "variables" | "controls" | "repeats" | "table" | "safety" | "source-check";
  label: string;
  detail: string;
  status: "ready" | "review" | "blocked";
}

export interface PreLabDesignCoach {
  status: "ready_to_plan" | "needs_teacher_review" | "blocked";
  summary: string;
  variablePlan: PreLabVariablePlan;
  repeatPlan: string;
  tablePlan: DataColumn[];
  hypothesisStarter: string;
  setupChecks: PreLabSetupCheck[];
  sourceTask: string;
  safetyGate: string;
  studentNextAction: string;
  judgeTakeaway: string;
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

export type McpIntegrationStatus = "preview_only" | "server_dry_run" | "ready";

export type McpIntegrationActionId =
  | "composio-search-source-audit"
  | "google-docs-evidence-packet"
  | "google-sheets-data-log"
  | "google-drive-portfolio-archive"
  | "google-classroom-prelab-checkpoint"
  | "google-forms-readiness-check"
  | "google-calendar-next-trial-reminder"
  | "notion-learning-record";

export interface McpIntegrationAction {
  id: McpIntegrationActionId;
  toolkit: "Composio Search" | "Google Docs" | "Google Sheets" | "Google Drive" | "Google Classroom" | "Google Forms" | "Google Calendar" | "Notion";
  label: string;
  studentValue: string;
  composioCapability: string;
  payloadSummary: string;
  mode: "preview" | "server_dry_run" | "server_mcp";
  requiresConsent: boolean;
  safetyNote: string;
  docsUrl: string;
  recommendedTools: string[];
}

export interface McpConnectorReadiness {
  actionId: McpIntegrationActionId;
  toolkit: McpIntegrationAction["toolkit"];
  status: "ready" | "needs_server_setup";
  requiredEnv: string[];
  requiredScopes: string[];
  dataShared: string;
  consentGate: string;
  dryRunStatus: "pass" | "review";
  dryRunDetail: string;
  docsUrl: string;
  recommendedTools: string[];
}

export interface McpDryRunCheck {
  id: "payload" | "least-privilege" | "consent" | "integrity" | "server-bridge" | "server-only";
  label: string;
  status: "pass" | "review";
  detail: string;
}

export interface McpIntegrationPayloadPreview {
  title: string;
  rowCount: number;
  sourceCount: number;
  savedRunCount: number;
  tableColumns: string[];
  includedSections: string[];
  markdownExcerpt: string;
}

export interface McpIntegrationPlan {
  status: McpIntegrationStatus;
  summary: string;
  setupHint: string;
  privacyBoundary: string;
  actions: McpIntegrationAction[];
  readinessMatrix: McpConnectorReadiness[];
  dryRunChecks: McpDryRunCheck[];
  executionBoundary: string;
  payloadPreview: McpIntegrationPayloadPreview;
  safeguards: string[];
  judgeTakeaway: string;
}

export interface McpConnectorCatalogItem {
  id: McpIntegrationActionId;
  toolkit: McpIntegrationAction["toolkit"];
  toolkitSlug: string;
  envSuffix: string;
  requiresAuthConfig?: boolean;
  requiresAllowedToolsEnv?: boolean;
  label: string;
  studentValue: string;
  composioCapability: string;
  safetyNote: string;
  requiredScopes: string[];
  dataShared: string;
  consentGate: string;
  docsUrl: string;
  recommendedTools: string[];
}

export interface McpBridgeToolkitStatus {
  actionId: McpIntegrationActionId;
  toolkit: McpIntegrationAction["toolkit"];
  toolkitSlug: string;
  docsUrl: string;
  configured: boolean;
  authConfigRequired: boolean;
  allowedToolsRequired: boolean;
  authConfigEnv: string;
  allowedToolsEnv: string;
  authConfigConfigured: boolean;
  allowedToolsConfigured: boolean;
  allowedTools: string[];
  recommendedTools: string[];
  missingEnv: string[];
}

export interface McpBridgeStatus {
  status: Extract<McpIntegrationStatus, "server_dry_run" | "ready">;
  mode: "server_dry_run" | "server_mcp";
  liveExportsEnabled: boolean;
  apiKeyConfigured: boolean;
  summary: string;
  executionBoundary: string;
  missingEnv: string[];
  toolkits: McpBridgeToolkitStatus[];
  docs: Array<{ label: string; url: string }>;
}

export interface McpBridgeExportRequest {
  actionId: McpIntegrationActionId;
  consent: boolean;
  payload: {
    title: string;
    description: string;
    evidencePacket: string;
    rows: StudentDataRow[];
    sources: SourceCard[];
    reflectionAnswers?: StudentReflectionAnswers;
  };
}

export interface McpBridgeExportCheck {
  id: "supported-action" | "consent" | "payload" | "integrity" | "credentials";
  label: string;
  status: "pass" | "review" | "blocked";
  detail: string;
}

export interface McpBridgeExportResponse {
  status: "dry_run" | "ready" | "blocked";
  actionId: McpIntegrationActionId;
  toolkit: McpIntegrationAction["toolkit"];
  mode: McpBridgeStatus["mode"];
  summary: string;
  executionBoundary: string;
  checks: McpBridgeExportCheck[];
  target: {
    toolkitSlug: string;
    authConfigEnv: string;
    allowedToolsEnv: string;
    recommendedTools: string[];
    docsUrl: string;
  };
  sanitizedPayload: {
    title: string;
    rowCount: number;
    sourceCount: number;
    descriptionPreview: string;
    evidenceExcerpt: string;
  };
  nextStep: string;
}

export interface McpBridgeSessionResponse {
  status: "dry_run" | "created" | "blocked";
  actionId: McpIntegrationActionId;
  toolkit: McpIntegrationAction["toolkit"];
  mode: McpBridgeStatus["mode"];
  summary: string;
  executionBoundary: string;
  checks: McpBridgeExportCheck[];
  target: McpBridgeExportResponse["target"] & {
    sessionUserEnv: string;
    apiBaseUrlEnv: string;
  };
  sessionPlan: {
    endpoint: string;
    userIdConfigured: boolean;
    authConfigConfigured: boolean;
    allowedToolsConfigured: boolean;
    enabledToolkit: string;
    enabledTools: string[];
    mcpUrlIssued: boolean;
    sessionIdPreview?: string;
  };
  sanitizedPayload: McpBridgeExportResponse["sanitizedPayload"];
  nextStep: string;
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

export interface RuntimeProofSignal {
  id: "classifier" | "grounding" | "evaluation" | "privacy" | "integrity" | "mcp";
  label: string;
  status: "active" | "ready" | "configured" | "review";
  value: string;
  detail: string;
}

export interface RuntimeProof {
  status: "fallback_ready" | "web_enriched_ready";
  generatedAt: string;
  model: string;
  webSearchConfigured: boolean;
  templateCount: number;
  evaluationCaseCount: number;
  evaluationPassed: number;
  serverOnlyKeyBoundary: boolean;
  mcpBridgeMode: McpBridgeStatus["mode"];
  signals: RuntimeProofSignal[];
  judgeTakeaway: string;
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
  preLabDesignCoach: PreLabDesignCoach;
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
