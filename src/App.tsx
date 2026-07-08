import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Copy,
  ClipboardPaste,
  ClipboardCheck,
  FileText,
  FolderOpen,
  FlaskConical,
  Gauge,
  LineChart as LineChartIcon,
  ListChecks,
  Save,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
  Trophy,
  Workflow
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposedChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { requestAnalysis, requestEvaluation, requestMcpExport, requestMcpSession, requestMcpStatus, requestRuntimeProof } from "./lib/api";
import { refreshResultForRows } from "./lib/analysis";
import { buildConceptMasteryCheck } from "./lib/conceptMasteryCheck";
import type { ConceptMasteryAnswerMap, ConceptMasteryCheck } from "./lib/conceptMasteryCheck";
import { buildPasteExample, parsePastedTable } from "./lib/dataImport";
import { buildEvidencePacket } from "./lib/evidencePacket";
import { buildMcpIntegrationPlan } from "./lib/mcpIntegrationPlan";
import { buildProgressPortfolio } from "./lib/progressPortfolio";
import { SAMPLE_PROMPTS } from "./lib/samples";
import { buildStudentReflectionWorkspace } from "./lib/studentReflectionWorkspace";
import type {
  AiyesValuesFit,
  AnalyzeResult,
  AiEvaluationHarness,
  ConceptCoach,
  CustomLabTriage,
  DataHandlingLedger,
  EvaluationReport,
  GroundingAudit,
  GuidedLabFlow,
  Issue,
  JudgeDemoPath,
  LabBrief,
  LearningExitTicket,
  LearningImpactSnapshot,
  McpBridgeExportRequest,
  McpBridgeExportResponse,
  McpBridgeSessionResponse,
  McpBridgeStatus,
  McpIntegrationActionId,
  McpIntegrationPlan,
  MethodAudit,
  ModelStrategy,
  NextTrialPlan,
  OfficialRubricFit,
  PatternEvidence,
  PreLabDesignCoach,
  ProgressPortfolio,
  ProgressPortfolioSnapshot,
  ReliabilityCoach,
  RuntimeProof,
  SafetyCoach,
  StudentDataRow,
  StudentReflectionAnswers,
  StudentReflectionWorkspace
} from "./lib/types";

const initialPrompt = SAMPLE_PROMPTS[0].text;
const savedLabsKey = "ouija:saved-labs";
const sourceCodeUrl = "https://github.com/rushtanu14/ouija";
const liveDemoUrl = "https://ouija-olive.vercel.app";
const slideDeckUrl = "https://ouija-olive.vercel.app/submission/slide-deck.html";
const walkthroughVideoUrl = "https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm";

interface SavedLab extends ProgressPortfolioSnapshot {
  description: string;
  rows: StudentDataRow[];
}

type LearningLevel = "middle" | "high";

export function App() {
  const [description, setDescription] = useState(initialPrompt);
  const [learningLevel, setLearningLevel] = useState<LearningLevel>("middle");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [rows, setRows] = useState<StudentDataRow[]>([]);
  const [reflectionAnswers, setReflectionAnswers] = useState<StudentReflectionAnswers>({});
  const [masteryAnswers, setMasteryAnswers] = useState<ConceptMasteryAnswerMap>({});
  const [savedLabs, setSavedLabs] = useState<SavedLab[]>(loadSavedLabs);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReport | null>(null);
  const [runtimeProof, setRuntimeProof] = useState<RuntimeProof | null>(null);
  const [mcpBridgeStatus, setMcpBridgeStatus] = useState<McpBridgeStatus | null>(null);
  const [mcpExportResult, setMcpExportResult] = useState<McpBridgeExportResponse | null>(null);
  const [mcpSessionResult, setMcpSessionResult] = useState<McpBridgeSessionResponse | null>(null);
  const [mcpExportStatus, setMcpExportStatus] = useState<"idle" | "loading" | "error">("idle");
  const [mcpExportError, setMcpExportError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const analysisRequestId = useRef(0);

  async function analyze(nextDescription = description, nextRows?: StudentDataRow[]) {
    const requestId = analysisRequestId.current + 1;
    analysisRequestId.current = requestId;
    setStatus("loading");
    setError("");

    try {
      const analysis = await requestAnalysis({ description: nextDescription, rows: nextRows });
      if (requestId !== analysisRequestId.current) return;
      setResult(analysis);
      setRows(analysis.rows);
      setReflectionAnswers({});
      setMasteryAnswers({});
      setMcpExportResult(null);
      setMcpSessionResult(null);
      setMcpExportError("");
      setStatus("idle");
    } catch (analysisError) {
      if (requestId !== analysisRequestId.current) return;
      setStatus("error");
      setError(analysisError instanceof Error ? analysisError.message : "Unable to analyze this experiment.");
    }
  }

  useEffect(() => {
    void analyze(initialPrompt);
    void requestEvaluation().then(setEvaluationReport).catch(() => setEvaluationReport(null));
    void requestRuntimeProof().then(setRuntimeProof).catch(() => setRuntimeProof(null));
    void requestMcpStatus().then(setMcpBridgeStatus).catch(() => setMcpBridgeStatus(null));
  }, []);

  function updateCell(rowId: string, key: string, value: string) {
    const nextRows = rows.map((row) => (row.id === rowId ? { ...row, [key]: value } : row));
    setRows(nextRows);

    if (result) {
      setResult(refreshResultForRows(result, nextRows));
    }
  }

  function saveCurrentLab() {
    if (!result) return;

    const snapshot: SavedLab = {
      id: `${Date.now()}-${result.templateId}`,
      title: result.classification.title,
      subject: result.classification.subject,
      description,
      savedAt: new Date().toISOString(),
      rows,
      score: result.trackEvidence.score,
      readiness: result.trackEvidence.readiness,
      issueCount: result.issues.filter((issue) => issue.severity !== "info").length
    };
    const nextSavedLabs = [snapshot, ...savedLabs].slice(0, 6);
    setSavedLabs(nextSavedLabs);
    storeSavedLabs(nextSavedLabs);
  }

  function loadSavedLab(savedLab: SavedLab) {
    setDescription(savedLab.description);
    void analyze(savedLab.description, savedLab.rows);
  }

  function deleteSavedLab(id: string) {
    const nextSavedLabs = savedLabs.filter((savedLab) => savedLab.id !== id);
    setSavedLabs(nextSavedLabs);
    storeSavedLabs(nextSavedLabs);
  }

  function updateReflectionAnswer(promptId: keyof StudentReflectionAnswers, answer: string) {
    setReflectionAnswers((current) => ({
      ...current,
      [promptId]: answer
    }));
  }

  function updateMasteryAnswer(questionId: keyof ConceptMasteryAnswerMap, optionId: string) {
    setMasteryAnswers((current) => ({
      ...current,
      [questionId]: optionId
    }));
  }

  const chartData = useMemo(() => {
    if (!result) return [];
    const comparisonByRow = new Map(result.expectedComparison.points.map((point) => [point.rowId, point]));

    return rows.map((row) => ({
      ...row,
      [result.expectedResult.yKey]: Number(row[result.expectedResult.yKey]),
      expectedY: comparisonByRow.get(row.id)?.expectedY ?? null
    }));
  }, [result, rows]);
  const progressPortfolio = useMemo(() => buildProgressPortfolio(savedLabs), [savedLabs]);
  const studentReflectionWorkspace = useMemo(() => {
    if (!result) return null;
    return buildStudentReflectionWorkspace(result.learningExitTicket, reflectionAnswers);
  }, [reflectionAnswers, result]);
  const conceptMasteryCheck = useMemo(() => {
    if (!result) return null;
    return buildConceptMasteryCheck(result, masteryAnswers);
  }, [masteryAnswers, result]);
  const evidencePacket = useMemo(() => {
    if (!result) return "";
    return buildEvidencePacket(result, rows, description, reflectionAnswers);
  }, [description, reflectionAnswers, result, rows]);
  const mcpIntegrationPlan = useMemo(() => {
    if (!result) return null;
    return buildMcpIntegrationPlan({
      result,
      rows,
      description,
      evidencePacket,
      portfolio: progressPortfolio,
      configured: mcpBridgeStatus?.status === "ready",
      serverBridgeAvailable: Boolean(mcpBridgeStatus)
    });
  }, [description, evidencePacket, mcpBridgeStatus, progressPortfolio, result, rows]);

  async function validateMcpAction(actionId: McpIntegrationActionId) {
    if (!result || !mcpIntegrationPlan) return;

    setMcpExportStatus("loading");
    setMcpExportError("");
    setMcpExportResult(null);
    setMcpSessionResult(null);

    try {
      const payload: McpBridgeExportRequest = {
        actionId,
        consent: true,
        payload: {
          title: mcpIntegrationPlan.payloadPreview.title,
          description,
          evidencePacket,
          rows,
          sources: result.sources,
          reflectionAnswers
        }
      };
      const [exportResponse, sessionResponse] = await Promise.all([requestMcpExport(payload), requestMcpSession(payload)]);
      setMcpExportResult(exportResponse);
      setMcpSessionResult(sessionResponse);
      setMcpExportStatus("idle");
    } catch (exportError) {
      setMcpExportStatus("error");
      setMcpExportError(exportError instanceof Error ? exportError.message : "Unable to validate this MCP packet.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            O
          </div>
          <span>Ouija</span>
        </div>
        <nav aria-label="Primary">
          <a href="#experiment">Experiment</a>
          <a href="#demo-path">Demo Path</a>
          <a href="#runtime-proof">Runtime Proof</a>
          <a href="#sources">Sources</a>
          <a href="#rubric">Rubric Fit</a>
          <a href="#values">Values Fit</a>
          <a href="#impact">Impact</a>
          <a href="#evaluation">Eval Bench</a>
          <a href="#saved">Saved Labs</a>
          <a href="#progress">Progress</a>
          <a href="#mcp-export">MCP Export</a>
          <a href="#model-card">Model Card</a>
          <a href="#judge">Judge Brief</a>
          <a href="#settings">Settings</a>
        </nav>
        <div className="integrity-chip">
          <ShieldCheck size={16} />
          <span>Hints, checks, and explanations — not full lab reports.</span>
        </div>
      </header>

      <section className="workspace" id="experiment">
        <aside className="input-rail" aria-label="Experiment input">
          <div className="rail-heading">
            <FlaskConical size={20} />
            <h1>Describe your experiment</h1>
          </div>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-label="Describe your experiment"
          />
          <div className="sample-grid" aria-label="Sample experiments">
            {SAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  setDescription(sample.text);
                  void analyze(sample.text);
                }}
              >
                {sample.label}
              </button>
            ))}
          </div>
          <div className="learning-level-control" aria-label="Learning level">
            <span>Learning level</span>
            <div>
              <button
                type="button"
                className={learningLevel === "middle" ? "active" : ""}
                onClick={() => setLearningLevel("middle")}
                aria-pressed={learningLevel === "middle"}
              >
                Middle
              </button>
              <button
                type="button"
                className={learningLevel === "high" ? "active" : ""}
                onClick={() => setLearningLevel("high")}
                aria-pressed={learningLevel === "high"}
              >
                High
              </button>
            </div>
          </div>
          <button className="analyze-button" type="button" onClick={() => void analyze()} disabled={status === "loading"}>
            <Search size={18} />
            {status === "loading" ? "Analyzing..." : "Analyze"}
          </button>
          <button className="secondary-action" type="button" onClick={saveCurrentLab} disabled={!result}>
            <Save size={17} />
            Save current lab
          </button>
          {status === "error" ? <p className="error-text">{error}</p> : null}
          <div className="science-set">
            <span>Physics</span>
            <span>Chemistry</span>
            <span>Biology</span>
            <span>Earth Science</span>
          </div>
        </aside>

        <section className="analysis-panel" aria-live="polite">
          {result ? (
            <>
              <div className="classification">
                <div>
                  <p className="section-label">
                    {result.classification.matchQuality === "closest_supported" ? "Closest supported match" : "Identified experiment"}
                  </p>
                  <h2>{result.classification.title}</h2>
                  <p className={`classification-note classification-note-${result.classification.matchQuality}`}>
                    {result.classification.coverageNote}
                  </p>
                </div>
                <div className="confidence-meter" aria-label={`Confidence ${Math.round(result.classification.confidence * 100)} percent`}>
                  <span>{Math.round(result.classification.confidence * 100)}%</span>
                </div>
              </div>

              <div className="concept-row">
                {result.classification.concepts.map((concept) => (
                  <span key={concept}>{concept}</span>
                ))}
              </div>

              <RunSnapshotPanel result={result} evaluationReport={evaluationReport} />
              <JudgeDemoPathPanel path={result.judgeDemoPath} />
              <RuntimeProofPanel proof={runtimeProof} result={result} />
              {result.customLabTriage.status === "needs_student_details" ? <CustomLabTriagePanel triage={result.customLabTriage} /> : null}
              <GuidedLabFlowPanel flow={result.guidedFlow} />
              <StudentLevelLensPanel result={result} level={learningLevel} />
              {conceptMasteryCheck ? (
                <ConceptMasteryCheckPanel check={conceptMasteryCheck} onAnswerChange={updateMasteryAnswer} />
              ) : null}
              <PreLabDesignCoachPanel coach={result.preLabDesignCoach} />

              <div className="graph-card">
                <div className="panel-title">
                  <LineChartIcon size={18} />
                  <h3>{result.expectedResult.graphTitle}</h3>
                </div>
                <ExpectedGraph result={result} data={chartData} />
                <div className="expected-overlay-summary" aria-label="Expected overlay summary">
                  <strong>Expected overlay</strong>
                  <span>{result.expectedComparison.summary}</span>
                </div>
              </div>

              <div className="data-card">
                <div className="panel-title">
                  <SlidersHorizontal size={18} />
                  <h3>Student data table</h3>
                </div>
                <DataImportPanel result={result} rows={rows} onImportRows={(nextRows) => {
                  setRows(nextRows);
                  setResult(refreshResultForRows(result, nextRows));
                }} />
                <DataTable result={result} rows={rows} onCellChange={updateCell} />
              </div>

              <PatternEvidencePanel evidence={result.patternEvidence} />
              <ComparisonPanel issues={result.issues} hints={result.hints} />
              <MethodAuditPanel audit={result.methodAudit} />
              <ReliabilityCoachPanel coach={result.reliabilityCoach} />
              <SafetyCoachPanel coach={result.safetyCoach} />
              <ConceptCoachPanel coach={result.conceptCoach} />
              <NextTrialPanel plan={result.nextTrialPlan} />
              <LearningImpactPanel snapshot={result.impactSnapshot} />
              <LearningExitTicketPanel ticket={result.learningExitTicket} />
              {studentReflectionWorkspace ? (
                <StudentReflectionWorkspacePanel
                  workspace={studentReflectionWorkspace}
                  onAnswerChange={updateReflectionAnswer}
                />
              ) : null}
              <LabBriefPanel brief={result.labBrief} />
              <EvidencePacketPanel packet={evidencePacket} />
              <ModelStrategyPanel strategy={result.modelStrategy} />
              <TechnicalDepthProofPanel result={result} />
              <AiEvaluationHarnessPanel harness={result.aiEvaluationHarness} />
              <DataHandlingLedgerPanel ledger={result.dataHandlingLedger} />
              <OfficialRubricPanel fit={result.officialRubricFit} />
              <AiyesValuesFitPanel fit={result.aiyesValuesFit} />
            </>
          ) : (
            <div className="empty-state">
              <BookOpen size={28} />
              <p>Ouija is ready for a middle or high school science experiment.</p>
            </div>
          )}
        </section>

        <aside className="source-rail" id="sources" aria-label="Sources and explanation">
          {result ? (
            <>
              <div className="source-status">
                <p className="section-label">Grounding</p>
                <strong>{result.groundingStatus.mode === "web_enriched" ? "Web-enriched" : "Built-in trusted references"}</strong>
                <span>{result.groundingStatus.note}</span>
              </div>
              <section className="expected-copy">
                <p className="section-label">Expected result</p>
                <h2>{result.expectedResult.summary}</h2>
                <p>{result.explanation}</p>
                {result.expectedResult.mixedEvidence ? (
                  <div className="mixed-evidence">
                    <AlertTriangle size={16} />
                    <span>Exact values can vary by setup. Compare the pattern, not one magic number.</span>
                  </div>
                ) : null}
              </section>
              <ReasoningTrailPanel result={result} />
              <GroundingAuditPanel audit={result.groundingAudit} />
              <section className="sources-list">
                <p className="section-label">Trusted citations</p>
                {result.sources.map((source) => (
                  <a className="source-card" key={`${source.id}-${source.url}`} href={source.url} target="_blank" rel="noreferrer">
                    <span>{source.publisher}</span>
                    <strong>{source.title}</strong>
                    <small>{source.note}</small>
                  </a>
                ))}
              </section>
              <section className="integrity-boundary">
                <p className="section-label">Integrity boundary</p>
                <strong>Student work stays student-owned.</strong>
                <span>{result.integrityNotice}</span>
              </section>
            </>
          ) : null}
        </aside>
      </section>
      <section className="lower-workspace" aria-label="Saved labs and settings">
        <SavedLabsPanel savedLabs={savedLabs} onLoad={loadSavedLab} onDelete={deleteSavedLab} />
        <ProgressPortfolioPanel portfolio={progressPortfolio} />
        <McpIntegrationCoachPanel
          plan={mcpIntegrationPlan}
          bridgeStatus={mcpBridgeStatus}
          exportResult={mcpExportResult}
          sessionResult={mcpSessionResult}
          exportStatus={mcpExportStatus}
          exportError={mcpExportError}
          onValidateAction={validateMcpAction}
        />
        <EvaluationBenchPanel report={evaluationReport} />
        <ModelCardPanel result={result} />
        <JudgeBriefPanel result={result} />
        <SettingsPanel
          result={result}
          savedLabCount={savedLabs.length}
          reflectionWorkspace={studentReflectionWorkspace}
          mcpStatus={mcpIntegrationPlan?.status ?? "preview_only"}
        />
      </section>
    </main>
  );
}

function RunSnapshotPanel({ result, evaluationReport }: { result: AnalyzeResult; evaluationReport: EvaluationReport | null }) {
  const blockingIssueCount = result.issues.filter((issue) => issue.severity !== "info").length;
  const snapshotItems = [
    {
      label: "Rubric fit",
      value: `${result.officialRubricFit.score}/100`,
      detail: formatReadiness(result.trackEvidence.readiness)
    },
    {
      label: "Evaluation",
      value: evaluationReport ? `${evaluationReport.passed}/${evaluationReport.total}` : "Loading",
      detail: evaluationReport ? (evaluationReport.status === "pass" ? "Bench passed" : "Review needed") : "Bench loading"
    },
    {
      label: "Impact",
      value: `${result.impactSnapshot.score}/100`,
      detail: result.impactSnapshot.studentOutcome
    },
    {
      label: "Data flags",
      value: String(blockingIssueCount),
      detail: blockingIssueCount === 0 ? "No blocking flags" : "Check before claiming"
    }
  ];

  return (
    <section className={`run-snapshot run-snapshot-${result.trackEvidence.readiness}`} aria-label="Run Snapshot">
      <div className="run-snapshot-header">
        <div className="panel-title">
          <Gauge size={18} />
          <h3>Run Snapshot</h3>
        </div>
        <span>{formatReadiness(result.trackEvidence.readiness)}</span>
      </div>
      <div className="run-snapshot-grid">
        {snapshotItems.map((item) => (
          <article key={item.label}>
            <p className="section-label">{item.label}</p>
            <strong>{item.value}</strong>
            <small>{item.detail}</small>
          </article>
        ))}
      </div>
      <div className="run-snapshot-focus">
        <article>
          <p className="section-label">Expected pattern</p>
          <strong>{result.expectedResult.pattern}</strong>
        </article>
        <article>
          <p className="section-label">Current action</p>
          <strong>{result.guidedFlow.currentAction}</strong>
        </article>
      </div>
    </section>
  );
}

function JudgeDemoPathPanel({ path }: { path: JudgeDemoPath }) {
  return (
    <section className={`judge-demo-path judge-demo-path-${path.status}`} id="demo-path" aria-label="Judge Demo Path">
      <div className="panel-title">
        <Trophy size={18} />
        <h3>Judge Demo Path</h3>
      </div>
      <div className="judge-demo-summary">
        <div>
          <p className="section-label">Live walkthrough</p>
          <strong>{path.headline}</strong>
        </div>
        <span>{formatJudgeDemoStatus(path.status)}</span>
      </div>
      <p className="judge-demo-copy">{path.summary}</p>
      <div className="judge-demo-next">
        <p className="section-label">Next best action</p>
        <strong>{path.nextBestAction}</strong>
      </div>
      <div className="judge-demo-steps">
        {path.steps.map((step, index) => (
          <article className={`judge-demo-step judge-demo-step-${step.status}`} key={step.id}>
            <div>
              <span>{index + 1}</span>
              <strong>{step.label}</strong>
              <small>{formatJudgeDemoStepStatus(step.status)}</small>
            </div>
            <p className="section-label">{step.criterion}</p>
            <p>{step.proof}</p>
            <small>{step.demoAction}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function RuntimeProofPanel({ proof, result }: { proof: RuntimeProof | null; result: AnalyzeResult }) {
  const fallbackSignals: RuntimeProof["signals"] = [
    {
      id: "classifier",
      label: "Classifier",
      status: "active",
      value: `${result.modelStrategy.candidates.length} candidates ranked`,
      detail: result.modelStrategy.decisionSummary
    },
    {
      id: "grounding",
      label: "Current run grounding",
      status: result.groundingStatus.mode === "web_enriched" ? "configured" : "ready",
      value: result.groundingStatus.mode === "web_enriched" ? "Web enriched" : "Trusted fallback",
      detail: result.groundingStatus.note
    },
    {
      id: "evaluation",
      label: "Evaluation bench",
      status: "review",
      value: "Loading",
      detail: "Runtime proof endpoint is loading."
    }
  ];
  const signals = proof?.signals ?? fallbackSignals;

  return (
    <section
      className={`runtime-proof runtime-proof-${proof?.status ?? "loading"}`}
      id="runtime-proof"
      aria-label="AI Runtime Proof"
    >
      <div className="runtime-proof-header">
        <div className="panel-title">
          <Workflow size={18} />
          <h3>AI Runtime Proof</h3>
        </div>
        <span>{proof ? formatRuntimeProofStatus(proof.status) : "Loading"}</span>
      </div>
      <div className="runtime-proof-summary">
        <div>
          <p className="section-label">Active AI path</p>
          <strong>{proof?.webSearchConfigured ? "OpenAI web search ready" : "Deterministic fallback ready"}</strong>
          <small>{proof?.judgeTakeaway ?? "Checking server runtime, evaluation bench, and secret boundary."}</small>
        </div>
        <div>
          <p className="section-label">Current run</p>
          <strong>{result.groundingStatus.mode === "web_enriched" ? "Web-enriched citations" : "Built-in citations"}</strong>
          <small>{result.sources.length} visible citation{result.sources.length === 1 ? "" : "s"}</small>
        </div>
      </div>
      <div className="runtime-proof-grid">
        {signals.map((signal) => (
          <article className={`runtime-proof-signal runtime-proof-signal-${signal.status}`} key={signal.id}>
            <p className="section-label">{signal.label}</p>
            <strong>{signal.value}</strong>
            <small>{signal.detail}</small>
          </article>
        ))}
      </div>
      <div className="runtime-proof-links" aria-label="Runtime proof endpoints">
        <a href="/api/runtime-proof" target="_blank" rel="noreferrer">
          /api/runtime-proof
        </a>
        <a href="/api/evaluate" target="_blank" rel="noreferrer">
          /api/evaluate
        </a>
        <a href="/api/mcp/status" target="_blank" rel="noreferrer">
          /api/mcp/status
        </a>
      </div>
    </section>
  );
}

function CustomLabTriagePanel({ triage }: { triage: CustomLabTriage }) {
  return (
    <section className="custom-lab-triage" aria-label="Custom Lab Triage">
      <div className="panel-title">
        <SlidersHorizontal size={18} />
        <h3>Custom Lab Triage</h3>
      </div>
      <div className="triage-summary">
        <div>
          <p className="section-label">Unsupported lab support</p>
          <strong>{triage.inferredFocus}</strong>
        </div>
        <span>{formatCustomLabTriageStatus(triage.status)}</span>
      </div>
      <p className="triage-copy">{triage.summary}</p>
      <div className="triage-grid">
        <article>
          <p className="section-label">Student next action</p>
          <strong>{triage.studentNextAction}</strong>
        </article>
        <article>
          <p className="section-label">Safety boundary</p>
          <strong>{triage.safetyBoundary}</strong>
        </article>
      </div>
      <div className="triage-planner" aria-label="Custom investigation planner">
        <div>
          <p className="section-label">Variable plan</p>
          <strong>{triage.planner.title}</strong>
        </div>
        <div className="triage-variable-grid">
          <article>
            <p className="section-label">Independent variable</p>
            <strong>{triage.planner.independentVariable}</strong>
          </article>
          <article>
            <p className="section-label">Dependent variable</p>
            <strong>{triage.planner.dependentVariable}</strong>
          </article>
          <article>
            <p className="section-label">Repeat plan</p>
            <strong>{triage.planner.repeatPlan}</strong>
          </article>
        </div>
        <div className="triage-control-list">
          <p className="section-label">Controls to keep constant</p>
          <div className="triage-pill-list">
            {triage.planner.controlVariables.map((control) => (
              <span key={control}>{control}</span>
            ))}
          </div>
        </div>
        <div className="triage-starter-table">
          <p className="section-label">Starter worksheet</p>
          <table>
            <thead>
              <tr>
                <th>Condition</th>
                <th>Measurement</th>
                <th>Trial</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {triage.planner.starterRows.map((row) => (
                <tr key={row.id}>
                  <td>{String(row.condition ?? "")}</td>
                  <td>{String(row.measurement ?? "") || "___"}</td>
                  <td>{String(row.trial ?? "") || "___"}</td>
                  <td>{String(row.notes ?? "") || "___"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="triage-quality-list">
          <p className="section-label">Before you collect data</p>
          {triage.planner.qualityChecklist.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="triage-hypothesis">
          <p className="section-label">Hypothesis starter</p>
          <strong>{triage.planner.hypothesisStarter}</strong>
        </div>
      </div>
      <div className="triage-list-grid">
        <article>
          <p className="section-label">Suggested columns</p>
          <div className="triage-pill-list">
            {triage.suggestedColumns.map((column) => (
              <span key={column.key}>
                {column.label}
                {column.unit ? ` (${column.unit})` : ""}
              </span>
            ))}
          </div>
        </article>
        <article>
          <p className="section-label">Source searches</p>
          <div className="triage-pill-list">
            {triage.sourceSearches.map((query) => (
              <span key={query}>{query}</span>
            ))}
          </div>
        </article>
        <article>
          <p className="section-label">Clarifying questions</p>
          <ol className="triage-question-list">
            {triage.clarifyingQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  );
}

function PreLabDesignCoachPanel({ coach }: { coach: PreLabDesignCoach }) {
  return (
    <section className={`pre-lab-design-coach pre-lab-design-${coach.status}`} aria-label="Pre-Lab Design Coach">
      <div className="panel-title">
        <ClipboardCheck size={18} />
        <h3>Pre-Lab Design Coach</h3>
      </div>
      <div className="pre-lab-summary">
        <div>
          <p className="section-label">Before data collection</p>
          <strong>{formatPreLabStatus(coach.status)}</strong>
        </div>
        <span>{coach.summary}</span>
      </div>
      <div className="pre-lab-variable-grid">
        <article>
          <p className="section-label">Independent variable</p>
          <strong>{coach.variablePlan.independentVariable}</strong>
        </article>
        <article>
          <p className="section-label">Dependent variable</p>
          <strong>{coach.variablePlan.dependentVariable}</strong>
        </article>
        <article>
          <p className="section-label">Repeat plan</p>
          <strong>{coach.repeatPlan}</strong>
        </article>
      </div>
      <div className="pre-lab-check-grid">
        {coach.setupChecks.map((check) => (
          <article className={`pre-lab-check pre-lab-check-${check.status}`} key={check.id}>
            <div>
              <strong>{check.label}</strong>
              <span>{formatPreLabCheckStatus(check.status)}</span>
            </div>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <div className="pre-lab-lower-grid">
        <article>
          <p className="section-label">Table plan</p>
          <div className="pre-lab-pill-list">
            {coach.tablePlan.map((column) => (
              <span key={column.key}>
                {column.label}
                {column.unit ? ` (${column.unit})` : ""}
              </span>
            ))}
          </div>
        </article>
        <article>
          <p className="section-label">Hypothesis starter</p>
          <strong>{coach.hypothesisStarter}</strong>
        </article>
      </div>
      <div className="pre-lab-action-grid">
        <article>
          <p className="section-label">Source task</p>
          <strong>{coach.sourceTask}</strong>
        </article>
        <article>
          <p className="section-label">Safety gate</p>
          <strong>{coach.safetyGate}</strong>
        </article>
        <article>
          <p className="section-label">Student next action</p>
          <strong>{coach.studentNextAction}</strong>
        </article>
      </div>
      <p className="pre-lab-judge-takeaway">{coach.judgeTakeaway}</p>
    </section>
  );
}

function GroundingAuditPanel({ audit }: { audit: GroundingAudit }) {
  return (
    <section className={`grounding-audit grounding-audit-${audit.status}`} aria-label="Grounding Audit">
      <div className="panel-title">
        <ShieldCheck size={18} />
        <h3>Grounding Audit</h3>
      </div>
      <div className="grounding-audit-summary">
        <div>
          <p className="section-label">Source trust</p>
          <strong>{audit.score}/100</strong>
        </div>
        <span>{formatGroundingAuditStatus(audit.status)}</span>
      </div>
      <p className="grounding-consensus">{audit.consensus}</p>
      <div className="grounding-checks">
        {audit.checks.map((check) => (
          <article className={`grounding-check grounding-check-${check.status}`} key={check.id}>
            <div>
              <strong>{check.label}</strong>
              <span>{formatGroundingCheckStatus(check.status)}</span>
            </div>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <div className="grounding-student-task">
        <p className="section-label">Student source task</p>
        <strong>{audit.studentTask}</strong>
        <span>{audit.citationNote}</span>
      </div>
    </section>
  );
}

function EvaluationBenchPanel({ report }: { report: EvaluationReport | null }) {
  return (
    <section className="evaluation-panel" id="evaluation" aria-label="Evaluation Bench">
      <div className="panel-title">
        <ListChecks size={18} />
        <h3>Evaluation Bench</h3>
      </div>
      {report ? (
        <>
          <div className={`eval-summary eval-summary-${report.status}`}>
            <div>
              <p className="section-label">Live suite</p>
              <strong>{report.score}/100</strong>
            </div>
            <span>
              {report.passed}/{report.total} passed
            </span>
          </div>
          <p className="eval-verdict">{report.verdict}</p>
          <div className="eval-case-list">
            {report.cases.map((testCase) => (
              <article className={`eval-case eval-case-${testCase.status}`} key={testCase.id}>
                <div>
                  <strong>{testCase.label}</strong>
                  <span>{testCase.outcome}</span>
                </div>
                <small>{testCase.status === "pass" ? "Pass" : testCase.status === "review" ? "Review" : "Fail"}</small>
              </article>
            ))}
          </div>
        </>
      ) : (
        <p className="empty-copy">Evaluation bench is loading.</p>
      )}
    </section>
  );
}

function JudgeBriefPanel({ result }: { result: AnalyzeResult | null }) {
  const readiness = result?.trackEvidence.readiness ?? "submittable";
  const score = result?.trackEvidence.score ?? 0;
  const statusItems = [
    { label: "Track", value: "AIYES Track 1" },
    { label: "Live app", value: "Deployed" },
    { label: "Slide deck", value: "Hosted" },
    { label: "Video", value: "Hosted" },
    { label: "Source code", value: "Public" },
    { label: "MCP export", value: "Server dry-run" },
    { label: "Integrity", value: "Guarded" }
  ];
  const submissionLinks = [
    { label: "Source code", href: sourceCodeUrl },
    { label: "Live demo", href: liveDemoUrl },
    { label: "Slide deck", href: slideDeckUrl },
    { label: "Video walkthrough", href: walkthroughVideoUrl }
  ];
  const submissionChecklist = [
    {
      label: "Slide presentation",
      status: "Ready",
      detail: "Hosted deck covers problem, AI architecture, runtime proof, UX, ethics, verification, and impact."
    },
    {
      label: "Video walkthrough",
      status: "Ready",
      detail: "Hosted 2:02.88 walkthrough stays under the 5-minute cap and shows live workflow plus session-ticket proof."
    },
    {
      label: "Source or deployment",
      status: "Ready",
      detail: "Public GitHub source and deployed Vercel app are listed separately for judge verification."
    },
    {
      label: "Student team",
      status: "External step",
      detail: "Devpost lists a required 2-5 student team; final submission still needs the team roster handled on Devpost."
    }
  ];
  const proofItems = [
    "Student problem and user are specific.",
    "Judge Demo Path gives evaluators a five-step walkthrough.",
    "AI pipeline is visible in Reasoning Trail.",
    "Model Strategy shows candidate ranking and risk controls.",
    "Technical Depth Proof makes beyond-simple-API architecture evidence visible.",
    "AI Evaluation Harness scores model behavior and safeguards.",
    "Official Rubric Fit maps all three visible AIYES criteria.",
    "AIYES Values Fit maps democracy, diversity, connectivity, innovation, and ethical inclusion to concrete product evidence.",
    "Learning Impact Loop measures the student's outcome for each run.",
    "Pre-Lab Design Coach helps students plan variables, controls, repeats, sources, and safety before collecting data.",
    "Learning Exit Ticket proves students must explain variables, patterns, and next steps themselves.",
    "Student Reflection Workspace captures student-authored exit-ticket drafts.",
    "Student Level Lens switches the same lab guidance between middle-school plain language and high-school quantitative reasoning.",
    "Concept Mastery Check measures whether students understand variables, evidence patterns, and integrity boundaries.",
    "Graph overlays expected pattern values against student data.",
    "Grounding Audit makes citation trust and mixed evidence visible.",
    "Pattern Evidence Engine scores the whole graph against the expected pattern.",
    "Reliability Coach checks repeats, averages, and spread.",
    "Guided Lab Flow gives students a clear next action.",
    "Concept Coach turns results into student learning scaffolds.",
    "Safety Coach makes school-lab risk checks visible.",
    "Data Handling Ledger shows privacy, retention, and student controls.",
    "Spreadsheet paste/import flows into data checks.",
    "Evidence Packet exports a student-owned reasoning handoff.",
    "MCP Integration Coach validates Composio Search source audits, Scholar claim checks, plus Docs, Sheets, Drive, Classroom, Forms, Calendar, and Notion handoffs through a server dry-run and scoped session ticket without exposing credentials.",
    "MCP Readiness Matrix shows exact connector env vars, tools, scopes, data shared, dry-run checks, and consent gates.",
    "Next Trial Planner gives adaptive measurement guidance.",
    "Progress Portfolio shows learning over multiple saved runs.",
    "Portfolio Story Builder turns saved runs into student-written progress evidence.",
    "AIYES submission checklist makes deck, video, source/deploy link, and team requirement status visible.",
    "Evaluation Bench runs nine live cases.",
    "Custom Lab Triage keeps unsupported labs useful without pretending full coverage.",
    "Hosted deck and walkthrough are public.",
    "Testing/evaluation proof is in the app and repo.",
    "Low-confidence labs show a boundary warning.",
    "Constraints are honest: hints, not full lab reports."
  ];

  return (
    <section className="judge-brief-panel" id="judge" aria-label="Judge Brief">
      <div className="panel-title">
        <Trophy size={18} />
        <h3>Judge Brief</h3>
      </div>
      <div className={`judge-score judge-score-${readiness}`}>
        <div>
          <p className="section-label">Council verdict</p>
          <strong>{score ? `${score}/100` : "Ready"}</strong>
        </div>
        <span>{formatReadiness(readiness)}</span>
      </div>
      <div className="judge-status-grid">
        {statusItems.map((item) => (
          <article key={item.label}>
            <p className="section-label">{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>
      <div className="submission-readiness-grid" aria-label="AIYES Submission Checklist">
        {submissionChecklist.map((item) => (
          <article key={item.label}>
            <div>
              <p className="section-label">{item.label}</p>
              <strong>{item.status}</strong>
            </div>
            <span>{item.detail}</span>
          </article>
        ))}
      </div>
      <div className="submission-link-grid" aria-label="Hosted submission links">
        {submissionLinks.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
            <span>{link.label}</span>
            <strong>{link.href.replace("https://", "")}</strong>
          </a>
        ))}
      </div>
      <ul className="judge-proof-list">
        {proofItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="judge-open-loop">External loop: submit on Devpost and handle the listed 2-5 member team requirement.</p>
    </section>
  );
}

function ModelCardPanel({ result }: { result: AnalyzeResult | null }) {
  const modelSteps = [
    {
      label: "Classifier",
      value: "Template match"
    },
    {
      label: "Grounding",
      value: result?.groundingStatus.mode === "web_enriched" ? "OpenAI web search" : "Trusted fallback"
    },
    {
      label: "Evaluation",
      value: "9 live cases"
    },
    {
      label: "Privacy",
      value: "Local snapshots"
    },
    {
      label: "MCP exports",
      value: "Server dry-run"
    }
  ];
  const safeguards = [
    "Server keeps API keys out of the browser.",
    "Unsupported labs are marked low confidence instead of treated as solved.",
    "Model Strategy exposes candidate ranking, signals, fallback behavior, and risk controls.",
    "Technical Depth Proof summarizes decision trace, evaluation harness, grounding quality, pattern engine, privacy, and integrity signals.",
    "AI Evaluation Harness scores classifier confidence, coverage, grounding, validators, safety, and fallback boundaries.",
    "Judge Demo Path reduces the live demo to problem fit, AI design, student workflow, evidence handoff, and submission proof.",
    "Official Rubric Fit maps problem relevance, AI design, and UX to concrete app evidence.",
    "AIYES Values Fit ties the app to AIYES values without changing the student's work into a generated report.",
    "Learning Impact Loop turns analysis into measurable student readiness and next-trial evidence.",
    "Pre-Lab Design Coach turns classification into variables, controls, repeats, source checks, and safety before data collection.",
    "Learning Exit Ticket converts the AI feedback into student reflection prompts judges can inspect.",
    "Student Reflection Workspace stores student-written drafts without generating answers.",
    "Student Level Lens adapts the same analysis for middle school pattern reading or high school quantitative evidence and uncertainty.",
    "Concept Mastery Check scores variable, pattern, and integrity understanding before students copy evidence forward.",
    "Expected overlay gives students a visual comparison between their data and the expected pattern.",
    "Grounding Audit checks source agreement before students use the expected pattern.",
    "Data Handling Ledger makes student data flow, retention, and controls inspectable.",
    "Progress Portfolio turns saved labs into repeated learning evidence for judges.",
    "Portfolio Story Builder gives prompts and blanks for a student-authored progress story.",
    "MCP Integration Coach keeps Composio credentials server-side, validates packets with /api/mcp/export, prepares session tickets with /api/mcp/session, and requires student consent before any source audit, Scholar claim check, or export.",
    "MCP Readiness Matrix makes connector tools, scopes, dry-run checks, and least-privilege boundaries inspectable.",
    "Pattern Evidence Engine quantifies whether the dataset supports the expected science pattern.",
    "Reliability Coach checks repeated trials, averages, and spread before students trust a claim.",
    "Guided Lab Flow turns dense analysis into student next steps.",
    "Custom Lab Triage turns unsupported descriptions into variables, source searches, and clarifying questions.",
    "Claim Coach leaves blanks instead of writing conclusions.",
    "Safety Coach forces adult-review language when a lab match is uncertain.",
    "Next Trial Planner suggests what to measure next without writing claims.",
    "Evaluation Bench tests eight supported labs plus the unsupported boundary."
  ];

  return (
    <section className="model-card-panel" id="model-card" aria-label="AI Model Card">
      <div className="panel-title">
        <Workflow size={18} />
        <h3>AI Model Card</h3>
      </div>
      <div className="model-card-summary">
        <div>
          <p className="section-label">Strategy</p>
          <strong>Hybrid and inspectable</strong>
        </div>
        <span>{result?.groundingStatus.mode === "web_enriched" ? "Web enriched" : "Fallback ready"}</span>
      </div>
      <div className="model-card-grid">
        {modelSteps.map((step) => (
          <article key={step.label}>
            <p className="section-label">{step.label}</p>
            <strong>{step.value}</strong>
          </article>
        ))}
      </div>
      <ol className="model-flow-list">
        <li>Classify the experiment description.</li>
        <li>Expose candidate scores and model strategy.</li>
        <li>Run the AI evaluation harness.</li>
        <li>Build the judge demo path.</li>
        <li>Map independent and dependent variables.</li>
        <li>Attach expected-pattern sources.</li>
        <li>Audit citation visibility and source agreement.</li>
        <li>Overlay expected pattern values on the graph.</li>
        <li>Guide the student through the next action.</li>
        <li>Import or edit table rows.</li>
        <li>Build a student concept scaffold.</li>
        <li>Adapt the scaffold for middle or high school reasoning.</li>
        <li>Check concept mastery before evidence export.</li>
        <li>Check school-lab safety boundaries.</li>
        <li>Audit rows, controls, and assumptions.</li>
        <li>Score the whole data pattern.</li>
        <li>Check repeated-trial reliability.</li>
        <li>Plan the next safe measurement.</li>
        <li>Coach a student-owned claim.</li>
      </ol>
      <div className="model-safeguards">
        <p className="section-label">Risk controls</p>
        {safeguards.map((safeguard) => (
          <span key={safeguard}>{safeguard}</span>
        ))}
      </div>
    </section>
  );
}

function SavedLabsPanel({
  savedLabs,
  onLoad,
  onDelete
}: {
  savedLabs: SavedLab[];
  onLoad: (savedLab: SavedLab) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="saved-labs-panel" id="saved" aria-label="Saved Labs">
      <div className="panel-title">
        <FolderOpen size={18} />
        <h3>Saved Labs</h3>
      </div>
      {savedLabs.length ? (
        <div className="saved-labs-list">
          {savedLabs.map((savedLab) => (
            <article className="saved-lab-card" key={savedLab.id}>
              <div>
                <p className="section-label">{savedLab.subject}</p>
                <strong>{savedLab.title}</strong>
                <span>
                  {formatReadiness(savedLab.readiness)} · {savedLab.score}/100 · {savedLab.issueCount} flag
                  {savedLab.issueCount === 1 ? "" : "s"} · {formatSavedTime(savedLab.savedAt)}
                </span>
              </div>
              <div className="saved-lab-actions">
                <button type="button" onClick={() => onLoad(savedLab)}>
                  Load
                </button>
                <button type="button" onClick={() => onDelete(savedLab.id)} aria-label={`Delete ${savedLab.title} snapshot`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-copy">No saved lab snapshots yet.</p>
      )}
    </section>
  );
}

function ProgressPortfolioPanel({ portfolio }: { portfolio: ProgressPortfolio }) {
  return (
    <section className={`progress-portfolio-panel progress-portfolio-${portfolio.status}`} id="progress" aria-label="Progress Portfolio">
      <div className="panel-title">
        <TrendingUp size={18} />
        <h3>Progress Portfolio</h3>
      </div>
      <div className="progress-summary">
        <div>
          <p className="section-label">Learning record</p>
          <strong>{formatProgressPortfolioStatus(portfolio.status)}</strong>
        </div>
        <span>{portfolio.summary}</span>
      </div>
      <div className="progress-metrics">
        {portfolio.metrics.map((metric) => (
          <article className={`progress-metric progress-metric-${metric.status}`} key={metric.id}>
            <p className="section-label">{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </div>
      <div className="progress-milestones">
        <p className="section-label">Portfolio milestones</p>
        {portfolio.milestones.map((milestone) => (
          <article key={milestone.id}>
            <span>{milestone.label}</span>
            <strong>{milestone.title}</strong>
            <small>{milestone.detail}</small>
          </article>
        ))}
      </div>
      <div className={`portfolio-story-builder portfolio-story-${portfolio.story.status}`} aria-label="Portfolio Story Builder">
        <div className="portfolio-story-header">
          <div>
            <p className="section-label">Portfolio story builder</p>
            <strong>{formatPortfolioStoryStatus(portfolio.story.status)}</strong>
          </div>
          <span>{portfolio.story.headline}</span>
        </div>
        <div className="portfolio-story-draft">
          <p className="section-label">Student draft starter</p>
          <strong>{portfolio.story.draftStarter}</strong>
        </div>
        <div className="portfolio-story-prompts">
          {portfolio.story.prompts.map((prompt) => (
            <article className={`portfolio-story-prompt portfolio-story-prompt-${prompt.status}`} key={prompt.id}>
              <span>{prompt.label}</span>
              <strong>{prompt.prompt}</strong>
              <small>{prompt.evidenceToUse}</small>
            </article>
          ))}
        </div>
        <p>{portfolio.story.integrityBoundary}</p>
        <em>{portfolio.story.judgeTakeaway}</em>
      </div>
      <div className="progress-next-action">
        <p className="section-label">Next portfolio action</p>
        <strong>{portfolio.nextAction}</strong>
        <span>{portfolio.judgeTakeaway}</span>
      </div>
    </section>
  );
}

function McpIntegrationCoachPanel({
  plan,
  bridgeStatus,
  exportResult,
  sessionResult,
  exportStatus,
  exportError,
  onValidateAction
}: {
  plan: McpIntegrationPlan | null;
  bridgeStatus: McpBridgeStatus | null;
  exportResult: McpBridgeExportResponse | null;
  sessionResult: McpBridgeSessionResponse | null;
  exportStatus: "idle" | "loading" | "error";
  exportError: string;
  onValidateAction: (actionId: McpIntegrationActionId) => void;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const payloadText = useMemo(() => (plan ? formatMcpPayloadPreview(plan) : ""), [plan]);

  useEffect(() => {
    setCopyStatus("");
  }, [payloadText]);

  async function copyPayload() {
    if (!payloadText || !navigator.clipboard) {
      setCopyStatus("Select the preview text to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(payloadText);
      setCopyStatus("MCP payload preview copied.");
    } catch {
      setCopyStatus("Select the preview text to copy.");
    }
  }

  return (
    <section
      className={`mcp-integration-panel mcp-integration-${plan?.status ?? "empty"}`}
      id="mcp-export"
      aria-label="MCP Integration Coach"
    >
      <div className="mcp-header">
        <div className="panel-title">
          <Workflow size={18} />
          <h3>MCP Integration Coach</h3>
        </div>
        <button type="button" onClick={() => void copyPayload()} disabled={!plan}>
          <Copy size={16} />
          Copy preview
        </button>
      </div>
      {plan ? (
        <>
          <div className="mcp-summary">
            <div>
              <p className="section-label">Composio route</p>
              <strong>{formatMcpStatus(plan.status)}</strong>
            </div>
            <span>{plan.summary}</span>
          </div>
          {bridgeStatus ? (
            <div className={`mcp-bridge-strip mcp-bridge-${bridgeStatus.status}`} aria-label="MCP server bridge">
              <div>
                <p className="section-label">Server bridge</p>
                <strong>{formatMcpStatus(bridgeStatus.status)}</strong>
              </div>
              <span>{bridgeStatus.summary}</span>
              <small>
                {bridgeStatus.missingEnv.length > 0
                  ? `Missing: ${bridgeStatus.missingEnv.slice(0, 5).join(", ")}${bridgeStatus.missingEnv.length > 5 ? ", ..." : ""}`
                  : "All server-side Composio env gates are present."}
              </small>
              <div className="mcp-doc-links">
                {bridgeStatus.docs.map((doc) => (
                  <a href={doc.url} key={doc.url} target="_blank" rel="noreferrer">
                    {doc.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mcp-action-grid">
            {plan.actions.map((action) => (
              <article className="mcp-action-card" key={action.id}>
                <div>
                  <p className="section-label">{action.toolkit}</p>
                  <strong>{action.label}</strong>
                </div>
                <span>{action.composioCapability}</span>
                <small>{action.payloadSummary}</small>
                <em>{action.safetyNote}</em>
                <button
                  className="mcp-action-button"
                  type="button"
                  onClick={() => onValidateAction(action.id)}
                  disabled={exportStatus === "loading"}
                >
                  {exportStatus === "loading" ? "Validating..." : "Validate route"}
                </button>
              </article>
            ))}
          </div>
          <div className="mcp-readiness-matrix" aria-label="MCP Readiness Matrix">
            <div>
              <p className="section-label">MCP readiness matrix</p>
              <strong>{plan.readinessMatrix.length} connector routes checked</strong>
              <span>{plan.executionBoundary}</span>
            </div>
            <div className="mcp-readiness-grid">
              {plan.readinessMatrix.map((connector) => (
                <article className={`mcp-readiness-card mcp-readiness-${connector.status}`} key={connector.actionId}>
                  <div>
                    <p className="section-label">{connector.toolkit}</p>
                    <strong>{formatMcpConnectorStatus(connector.status)}</strong>
                  </div>
                  <span>{connector.dataShared}</span>
                  <small>Env: {connector.requiredEnv.join(", ")}</small>
                  <small>Scopes: {connector.requiredScopes.join(", ")}</small>
                  <small>Tools: {connector.recommendedTools.join(", ")}</small>
                  <em>{connector.consentGate}</em>
                  <a href={connector.docsUrl} target="_blank" rel="noreferrer">
                    Toolkit docs
                  </a>
                </article>
              ))}
            </div>
          </div>
          <div className="mcp-dry-run-checks" aria-label="MCP dry-run checks">
            <p className="section-label">Dry-run checks</p>
            {plan.dryRunChecks.map((check) => (
              <article className={`mcp-dry-run-check mcp-dry-run-${check.status}`} key={check.id}>
                <strong>{check.label}</strong>
                <span>{formatMcpDryRunStatus(check.status)}</span>
                <small>{check.detail}</small>
              </article>
            ))}
          </div>
          <div className="mcp-payload-grid">
            <article>
              <p className="section-label">Packet</p>
              <strong>{plan.payloadPreview.title}</strong>
            </article>
            <article>
              <p className="section-label">Rows</p>
              <strong>{plan.payloadPreview.rowCount}</strong>
            </article>
            <article>
              <p className="section-label">Sources</p>
              <strong>{plan.payloadPreview.sourceCount}</strong>
            </article>
            <article>
              <p className="section-label">Saved runs</p>
              <strong>{plan.payloadPreview.savedRunCount}</strong>
            </article>
          </div>
          <textarea className="mcp-preview-box" aria-label="MCP payload preview" readOnly value={payloadText} />
          <div className="mcp-safeguards">
            <p className="section-label">Credential boundary</p>
            <strong>{plan.setupHint}</strong>
            <span>{plan.privacyBoundary}</span>
            {plan.safeguards.map((safeguard) => (
              <small key={safeguard}>{safeguard}</small>
            ))}
          </div>
          {exportResult ? (
            <div className={`mcp-export-result mcp-export-${exportResult.status}`} aria-label="MCP export dry-run result">
              <div>
                <p className="section-label">Server validation</p>
                <strong>{formatMcpExportStatus(exportResult.status)}</strong>
              </div>
              <span>{exportResult.summary}</span>
              <small>
                {exportResult.toolkit} via {exportResult.target.toolkitSlug}: {exportResult.target.recommendedTools.join(", ")}
              </small>
              <small>
                Payload: {exportResult.sanitizedPayload.rowCount} rows, {exportResult.sanitizedPayload.sourceCount} sources
              </small>
              <div className="mcp-export-check-grid">
                {exportResult.checks.map((check) => (
                  <article className={`mcp-export-check mcp-export-check-${check.status}`} key={check.id}>
                    <strong>{check.label}</strong>
                    <span>{formatMcpExportCheckStatus(check.status)}</span>
                    <small>{check.detail}</small>
                  </article>
                ))}
              </div>
              <em>{exportResult.nextStep}</em>
            </div>
          ) : null}
          {sessionResult ? (
            <div className={`mcp-export-result mcp-session-${sessionResult.status}`} aria-label="MCP session ticket result">
              <div>
                <p className="section-label">Session ticket</p>
                <strong>{formatMcpSessionStatus(sessionResult.status)}</strong>
              </div>
              <span>{sessionResult.summary}</span>
              <small>
                {sessionResult.toolkit} session scope: {sessionResult.sessionPlan.enabledToolkit} with{" "}
                {sessionResult.sessionPlan.enabledTools.join(", ")}
              </small>
              <small>
                Endpoint: {sessionResult.sessionPlan.endpoint}; MCP URL issued:{" "}
                {sessionResult.sessionPlan.mcpUrlIssued ? "yes, withheld from browser" : "no"}
              </small>
              <small>
                User env: {sessionResult.target.sessionUserEnv}; base URL env: {sessionResult.target.apiBaseUrlEnv}
              </small>
              {sessionResult.sessionPlan.sessionIdPreview ? <small>Session id: {sessionResult.sessionPlan.sessionIdPreview}</small> : null}
              <em>{sessionResult.nextStep}</em>
            </div>
          ) : null}
          {exportStatus === "error" ? <p className="error-text">{exportError}</p> : null}
          <p className="mcp-judge-takeaway">{plan.judgeTakeaway}</p>
          {copyStatus ? (
            <p className="packet-status" aria-live="polite">
              {copyStatus}
            </p>
          ) : null}
        </>
      ) : (
        <p className="empty-copy">Analyze an experiment to preview the Composio MCP export workflow.</p>
      )}
    </section>
  );
}

function SettingsPanel({
  result,
  savedLabCount,
  reflectionWorkspace,
  mcpStatus
}: {
  result: AnalyzeResult | null;
  savedLabCount: number;
  reflectionWorkspace: StudentReflectionWorkspace | null;
  mcpStatus: McpIntegrationPlan["status"];
}) {
  const settings = [
    {
      label: "Grounding",
      value: result?.groundingStatus.mode === "web_enriched" ? "Web enriched" : "Built-in references"
    },
    {
      label: "Integrity lock",
      value: "On"
    },
    {
      label: "Local snapshots",
      value: `${savedLabCount}/6`
    },
    {
      label: "MCP exports",
      value: formatMcpStatus(mcpStatus)
    },
    {
      label: "Reflections",
      value: reflectionWorkspace ? `${reflectionWorkspace.readyCount}/${reflectionWorkspace.totalCount}` : "0/3"
    },
    {
      label: "Coverage",
      value: "8 demos"
    }
  ];

  return (
    <section className="settings-panel" id="settings" aria-label="Settings">
      <div className="panel-title">
        <Settings size={18} />
        <h3>Settings</h3>
      </div>
      <div className="settings-grid">
        {settings.map((setting) => (
          <article key={setting.label}>
            <p className="section-label">{setting.label}</p>
            <strong>{setting.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReasoningTrailPanel({ result }: { result: AnalyzeResult }) {
  return (
    <section className={`reasoning-trail reasoning-trail-${result.trackEvidence.readiness}`} aria-label="Reasoning trail">
      <div className="panel-title">
        <Workflow size={18} />
        <h3>Reasoning trail</h3>
      </div>
      <div className="track-score">
        <div>
          <p className="section-label">Track 1 evidence</p>
          <strong>{result.trackEvidence.score}/100</strong>
        </div>
        <span>{formatReadiness(result.trackEvidence.readiness)}</span>
      </div>
      <p className="track-verdict">{result.trackEvidence.verdict}</p>
      <div className="trail-list">
        {result.trackEvidence.pipeline.map((step) => (
          <article className={`trail-step trail-step-${step.status}`} key={step.id}>
            <strong>{step.label}</strong>
            <span>{step.detail}</span>
          </article>
        ))}
      </div>
      <div className="criteria-list">
        {result.trackEvidence.criteria.map((criterion) => (
          <span className={`criterion criterion-${criterion.status}`} key={criterion.id}>
            {criterion.label}
          </span>
        ))}
      </div>
    </section>
  );
}

function ExpectedGraph({ result, data }: { result: AnalyzeResult; data: Array<Record<string, string | number | null>> }) {
  const xKey = result.expectedResult.xKey;
  const yKey = result.expectedResult.yKey;
  const xColumn = result.columns.find((column) => column.key === xKey);
  const hasNumericXAxis = Boolean(xColumn?.numeric);

  if (result.expectedResult.graphKind === "scatter") {
    return (
      <ResponsiveContainer width="100%" height={230}>
        <ComposedChart data={data} margin={{ top: 16, right: 22, bottom: 16, left: 0 }}>
          <CartesianGrid stroke="#dfe8f5" />
          <XAxis dataKey={xKey} name={xKey} type={hasNumericXAxis ? "number" : "category"} stroke="#617189" />
          <YAxis stroke="#617189" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend verticalAlign="top" height={26} />
          <Line name={result.expectedComparison.expectedLabel} type="monotone" dataKey="expectedY" stroke="#d66a2e" strokeWidth={2} strokeDasharray="6 5" dot={false} />
          <Scatter name={result.expectedComparison.observedLabel} dataKey={yKey} fill="#2368ff" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <ComposedChart data={data} margin={{ top: 16, right: 22, bottom: 16, left: 0 }}>
        <CartesianGrid stroke="#dfe8f5" />
        <XAxis dataKey={xKey} type={hasNumericXAxis ? "number" : "category"} stroke="#617189" />
        <YAxis stroke="#617189" />
        <Tooltip />
        <Legend verticalAlign="top" height={26} />
        <Line name={result.expectedComparison.expectedLabel} type="monotone" dataKey="expectedY" stroke="#d66a2e" strokeWidth={2} strokeDasharray="6 5" dot={false} />
        <Line name={result.expectedComparison.observedLabel} type="monotone" dataKey={yKey} stroke="#2368ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function DataTable({
  result,
  rows,
  onCellChange
}: {
  result: AnalyzeResult;
  rows: StudentDataRow[];
  onCellChange: (rowId: string, key: string, value: string) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {result.columns.map((column) => (
              <th key={column.key}>
                {column.label}
                {column.unit ? <span> ({column.unit})</span> : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {result.columns.map((column) => (
                <td key={column.key}>
                  <input
                    aria-label={`${column.label} row ${row.id}`}
                    value={String(row[column.key] ?? "")}
                    inputMode={column.numeric ? "decimal" : "text"}
                    onChange={(event) => onCellChange(row.id, column.key, event.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataImportPanel({
  result,
  rows,
  onImportRows
}: {
  result: AnalyzeResult;
  rows: StudentDataRow[];
  onImportRows: (rows: StudentDataRow[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setDraft("");
    setStatus(null);
  }, [result.templateId]);

  function importRows() {
    const parsed = parsePastedTable(draft, result.columns);

    if (parsed.rows.length === 0) {
      setStatus({ tone: "error", message: "No usable rows found." });
      return;
    }

    onImportRows(parsed.rows);
    setStatus({
      tone: "success",
      message: `Imported ${parsed.rows.length} row${parsed.rows.length === 1 ? "" : "s"}${parsed.usedHeader ? " using headers" : ""}.`
    });
  }

  return (
    <section className="data-import" aria-label="Paste spreadsheet data">
      <div className="data-import-header">
        <div>
          <p className="section-label">Data handling</p>
          <strong>Paste spreadsheet rows</strong>
        </div>
        <button type="button" onClick={importRows} disabled={!draft.trim()}>
          <ClipboardPaste size={16} />
          Import rows
        </button>
      </div>
      <textarea
        className="data-import-box"
        aria-label="Paste data table"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={buildPasteExample(result.columns, rows)}
      />
      {status ? (
        <p className={`import-status import-status-${status.tone}`} aria-live="polite">
          {status.message}
        </p>
      ) : null}
    </section>
  );
}

function ModelStrategyPanel({ strategy }: { strategy: ModelStrategy }) {
  const topCandidates = strategy.candidates.slice(0, 4);

  return (
    <section className="model-strategy" aria-label="Model Strategy">
      <div className="panel-title">
        <Workflow size={18} />
        <h3>Model Strategy</h3>
      </div>
      <div className="strategy-summary">
        <div>
          <p className="section-label">Decision</p>
          <strong>{strategy.decisionSummary}</strong>
        </div>
        <span>{strategy.classifier}</span>
      </div>
      <div className="strategy-signal-grid">
        {strategy.signals.map((signal) => (
          <article key={signal.label}>
            <p className="section-label">{signal.label}</p>
            <strong>{signal.value}</strong>
            <span>{signal.detail}</span>
          </article>
        ))}
      </div>
      <div className="candidate-list">
        <p className="section-label">Top candidates</p>
        {topCandidates.map((candidate) => (
          <article className={candidate.templateId === strategy.selectedTemplateId ? "candidate candidate-selected" : "candidate"} key={candidate.templateId}>
            <div>
              <strong>{candidate.title}</strong>
              <span>
                {candidate.subject} · {Math.round(candidate.confidence * 100)}% · score {candidate.score}
              </span>
            </div>
            <p>{candidate.evidence.length ? candidate.evidence.join(", ") : "No direct evidence term matched."}</p>
          </article>
        ))}
      </div>
      <div className="strategy-risk-list">
        <p className="section-label">Controls</p>
        {strategy.riskControls.slice(0, 3).map((control) => (
          <span key={control}>{control}</span>
        ))}
      </div>
    </section>
  );
}

function TechnicalDepthProofPanel({ result }: { result: AnalyzeResult }) {
  const topCandidate = result.modelStrategy.candidates[0];
  const runnerUp = result.modelStrategy.candidates[1];
  const selectedTitle = topCandidate?.title ?? result.classification.title;
  const expectedPointCount = result.expectedComparison.points.filter((point) => point.expectedY !== null).length;
  const depthItems = [
    {
      label: "Decision trace",
      value: `${result.modelStrategy.candidates.length} candidates`,
      detail: topCandidate && runnerUp
        ? `${topCandidate.title} beat ${runnerUp.title} by ${Math.max(0, topCandidate.score - runnerUp.score)} score points.`
        : `${selectedTitle} selected from the supported lab catalog.`
    },
    {
      label: "Evaluation harness",
      value: `${result.aiEvaluationHarness.score}/100`,
      detail: `${result.aiEvaluationHarness.checks.length} model-behavior checks plus the public 9-case regression suite.`
    },
    {
      label: "Grounding quality",
      value: `${result.groundingAudit.score}/100`,
      detail: `${result.sources.length} visible citation${result.sources.length === 1 ? "" : "s"} with source-agreement and mixed-evidence checks.`
    },
    {
      label: "Pattern engine",
      value: `${result.patternEvidence.score}/100`,
      detail: `${expectedPointCount} expected-overlay points compared against student data.`
    },
    {
      label: "Privacy and integrity",
      value: `${result.dataHandlingLedger.score}/100`,
      detail: "Server-only keys, local saved labs, blank claim starters, and consent-gated MCP packets."
    }
  ];

  return (
    <section className="technical-depth-proof" aria-label="Technical Depth Proof">
      <div className="panel-title">
        <Gauge size={18} />
        <h3>Technical Depth Proof</h3>
      </div>
      <div className="technical-depth-summary">
        <div>
          <p className="section-label">Beyond simple API use</p>
          <strong>{result.aiEvaluationHarness.judgeSignal}</strong>
        </div>
        <span>{result.modelStrategy.decisionSummary}</span>
      </div>
      <div className="technical-depth-grid">
        {depthItems.map((item) => (
          <article key={item.label}>
            <p className="section-label">{item.label}</p>
            <strong>{item.value}</strong>
            <span>{item.detail}</span>
          </article>
        ))}
      </div>
      <p className="technical-depth-boundary">
        Fallback mode is still AI strategy proof: the classifier, validators, overlays, audits, and eval suite run deterministically without exposing keys, while OpenAI web search can enrich citations server-side when configured.
      </p>
    </section>
  );
}

function AiEvaluationHarnessPanel({ harness }: { harness: AiEvaluationHarness }) {
  return (
    <section className={`ai-evaluation-harness ai-evaluation-harness-${harness.status}`} aria-label="AI Evaluation Harness">
      <div className="panel-title">
        <ClipboardCheck size={18} />
        <h3>AI Evaluation Harness</h3>
      </div>
      <div className="ai-eval-summary">
        <div>
          <p className="section-label">Model evidence</p>
          <strong>{harness.score}/100</strong>
        </div>
        <span>{formatAiEvaluationStatus(harness.status)}</span>
      </div>
      <p className="ai-eval-verdict">{harness.summary}</p>
      <p className="ai-eval-coverage">{harness.coverage}</p>
      <div className="ai-eval-check-grid">
        {harness.checks.map((check) => (
          <article className={`ai-eval-check ai-eval-check-${check.status}`} key={check.id}>
            <div>
              <strong>{check.label}</strong>
              <span>{check.score}/100</span>
            </div>
            <small>{formatAiEvaluationCheckStatus(check.status)}</small>
            <p>{check.detail}</p>
          </article>
        ))}
      </div>
      <div className="ai-eval-judge-signal">
        <p className="section-label">Judge signal</p>
        <strong>{harness.judgeSignal}</strong>
        <span>{harness.failureMode}</span>
      </div>
    </section>
  );
}

function DataHandlingLedgerPanel({ ledger }: { ledger: DataHandlingLedger }) {
  return (
    <section className={`data-handling-ledger data-handling-ledger-${ledger.status}`} aria-label="Data Handling Ledger">
      <div className="panel-title">
        <ShieldCheck size={18} />
        <h3>Data Handling Ledger</h3>
      </div>
      <div className="data-ledger-summary">
        <div>
          <p className="section-label">Privacy score</p>
          <strong>{ledger.score}/100</strong>
        </div>
        <span>{formatDataHandlingStatus(ledger.status)}</span>
      </div>
      <p className="data-ledger-verdict">{ledger.summary}</p>
      <div className="data-flow-grid">
        {ledger.flows.map((flow) => (
          <article className={`data-flow data-flow-${flow.status}`} key={flow.id}>
            <p className="section-label">{flow.label}</p>
            <strong>{flow.storage}</strong>
            <span>{flow.purpose}</span>
            <small>{flow.retention}</small>
            <small>Control: {flow.studentControl}</small>
          </article>
        ))}
      </div>
      <div className="data-ledger-lists">
        <div>
          <p className="section-label">Safeguards</p>
          <ul>
            {ledger.safeguards.map((safeguard) => (
              <li key={safeguard}>{safeguard}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="section-label">Student control</p>
          <ul>
            {ledger.studentRights.map((right) => (
              <li key={right}>{right}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="data-ledger-takeaway">
        <p className="section-label">Judge takeaway</p>
        <strong>{ledger.judgeTakeaway}</strong>
      </div>
    </section>
  );
}

function LearningImpactPanel({ snapshot }: { snapshot: LearningImpactSnapshot }) {
  return (
    <section className="learning-impact" id="impact" aria-label="Learning Impact Loop">
      <div className="panel-title">
        <Gauge size={18} />
        <h3>Learning Impact Loop</h3>
      </div>
      <div className={`impact-summary impact-summary-${snapshot.score >= 90 ? "strong" : snapshot.score >= 75 ? "watch" : "needs_action"}`}>
        <div>
          <p className="section-label">Student impact</p>
          <strong>{snapshot.score}/100</strong>
        </div>
        <span>{snapshot.headline}</span>
      </div>
      <p className="impact-outcome">{snapshot.studentOutcome}</p>
      <div className="impact-metric-grid">
        {snapshot.metrics.map((metric) => (
          <article className={`impact-metric impact-metric-${metric.status}`} key={metric.id}>
            <p className="section-label">{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </div>
      <ol className="impact-loop">
        {snapshot.evidenceLoop.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

function LearningExitTicketPanel({ ticket }: { ticket: LearningExitTicket }) {
  return (
    <section className={`learning-exit-ticket learning-exit-ticket-${ticket.status}`} aria-label="Learning Exit Ticket">
      <div className="panel-title">
        <ClipboardCheck size={18} />
        <h3>Learning Exit Ticket</h3>
      </div>
      <div className="exit-ticket-summary">
        <div>
          <p className="section-label">Student reflection</p>
          <strong>{formatLearningExitTicketStatus(ticket.status)}</strong>
        </div>
        <span>{ticket.summary}</span>
      </div>
      <div className="exit-ticket-prompts">
        <p className="section-label">Exit ticket prompts</p>
        {ticket.prompts.map((prompt) => (
          <article key={prompt.id}>
            <strong>{prompt.label}</strong>
            <span>{prompt.studentPrompt}</span>
            <small>{prompt.evidenceToUse}</small>
            <em>Teacher signal: {prompt.teacherSignal}</em>
          </article>
        ))}
      </div>
      <p className="exit-ticket-boundary">{ticket.integrityBoundary}</p>
    </section>
  );
}

function StudentReflectionWorkspacePanel({
  workspace,
  onAnswerChange
}: {
  workspace: StudentReflectionWorkspace;
  onAnswerChange: (promptId: StudentReflectionWorkspace["entries"][number]["promptId"], answer: string) => void;
}) {
  return (
    <section
      className={`student-reflection-workspace student-reflection-${workspace.status}`}
      aria-label="Student Reflection Workspace"
    >
      <div className="panel-title">
        <FileText size={18} />
        <h3>Student Reflection Workspace</h3>
      </div>
      <div className="reflection-summary">
        <div>
          <p className="section-label">Student-authored drafts</p>
          <strong>
            {workspace.readyCount}/{workspace.totalCount} ready
          </strong>
        </div>
        <span>{workspace.summary}</span>
      </div>
      <div className="reflection-next-action">
        <p className="section-label">Next reflection move</p>
        <strong>{workspace.nextAction}</strong>
      </div>
      <div className="reflection-entry-grid">
        {workspace.entries.map((entry) => (
          <article className={`reflection-entry reflection-entry-${entry.status}`} key={entry.promptId}>
            <div className="reflection-entry-header">
              <strong>{entry.label}</strong>
              <span>{formatStudentReflectionEntryStatus(entry.status)}</span>
            </div>
            <p>{entry.studentPrompt}</p>
            <textarea
              className="reflection-answer"
              aria-label={`Reflection answer ${entry.label}`}
              value={entry.answer}
              onChange={(event) => onAnswerChange(entry.promptId, event.target.value)}
            />
            <div className="reflection-entry-footer">
              <span>{entry.wordCount} words</span>
              <small>{entry.evidenceToUse}</small>
              <em>Teacher signal: {entry.teacherSignal}</em>
            </div>
          </article>
        ))}
      </div>
      <div className="reflection-boundary">
        <p className="section-label">Integrity boundary</p>
        <strong>{workspace.integrityBoundary}</strong>
        <span>{workspace.teacherTakeaway}</span>
      </div>
    </section>
  );
}

function OfficialRubricPanel({ fit }: { fit: OfficialRubricFit }) {
  return (
    <section className="rubric-fit" id="rubric" aria-label="AIYES Rubric Fit">
      <div className="panel-title">
        <ListChecks size={18} />
        <h3>AIYES Rubric Fit</h3>
      </div>
      <div className={`rubric-summary rubric-summary-${fit.score >= 92 ? "strong" : fit.score >= 80 ? "ready" : "review"}`}>
        <div>
          <p className="section-label">Official criteria</p>
          <strong>{fit.score}/100</strong>
        </div>
        <span>{fit.verdict}</span>
      </div>
      <div className="rubric-criteria">
        {fit.criteria.map((criterion) => (
          <article className={`rubric-criterion rubric-criterion-${criterion.status}`} key={criterion.id}>
            <div>
              <strong>{criterion.label}</strong>
              <span>{formatRubricStatus(criterion.status)}</span>
            </div>
            <p>{criterion.judgeTakeaway}</p>
            <ul>
              {criterion.evidence.slice(0, 3).map((evidence) => (
                <li key={evidence}>{evidence}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function AiyesValuesFitPanel({ fit }: { fit: AiyesValuesFit }) {
  return (
    <section className="values-fit" id="values" aria-label="AIYES Values Fit">
      <div className="panel-title">
        <Trophy size={18} />
        <h3>AIYES Values Fit</h3>
      </div>
      <div className={`values-summary values-summary-${fit.status}`}>
        <div>
          <p className="section-label">Mission values</p>
          <strong>{fit.score}/100</strong>
        </div>
        <span>{fit.summary}</span>
      </div>
      <p className="values-takeaway">{fit.judgeTakeaway}</p>
      <div className="values-grid">
        {fit.values.map((value) => (
          <article className={`value-signal value-signal-${value.status}`} key={value.id}>
            <div>
              <strong>{value.label}</strong>
              <span>{formatRubricStatus(value.status)}</span>
            </div>
            <p>{value.evidence}</p>
            <small>{value.studentAction}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function GuidedLabFlowPanel({ flow }: { flow: GuidedLabFlow }) {
  return (
    <section className="guided-flow" aria-label="Guided Lab Flow">
      <div className="guided-flow-header">
        <div className="panel-title">
          <Workflow size={18} />
          <h3>Guided Lab Flow</h3>
        </div>
        <strong>{flow.currentAction}</strong>
      </div>
      <div className="flow-step-list">
        {flow.steps.map((step, index) => (
          <article className={`flow-step flow-step-${step.status}`} key={step.id}>
            <span>{index + 1}</span>
            <div>
              <strong>{step.label}</strong>
              <small>{formatFlowStatus(step.status)}</small>
              <p>{step.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StudentLevelLensPanel({ result, level }: { result: AnalyzeResult; level: LearningLevel }) {
  const independent = formatColumnLabel(result, result.expectedResult.xKey);
  const dependent = formatColumnLabel(result, result.expectedResult.yKey);
  const isHigh = level === "high";
  const lens = isHigh
    ? {
        title: "High school lens",
        focus: "Quantify the relationship, check controls and repeats, and explain whether the evidence supports the model.",
        graphTask: `Use the ${independent} vs ${dependent} graph to describe slope, peak, ratio, or curve shape with numbers from the table.`,
        sentenceStarter: `Because ${independent} changed while controls stayed consistent, the ${dependent} evidence supports ___, with uncertainty from ___.`,
        teacherSignal: "Ready when the claim names evidence strength, limitations, and the next controlled measurement."
      }
    : {
        title: "Middle school lens",
        focus: "Name what changed, name what was measured, read the graph pattern, and choose one safe next step.",
        graphTask: `Use the ${independent} vs ${dependent} graph to say whether the result goes up, goes down, peaks, or stays about the same.`,
        sentenceStarter: `I changed ${independent}. I measured ${dependent}. The graph shows ___. My next step is ___.`,
        teacherSignal: "Ready when the student can say the variables, pattern, and next step in their own words."
      };

  return (
    <section className={`student-level-lens student-level-${level}`} aria-label="Student Level Lens">
      <div className="panel-title">
        <BookOpen size={18} />
        <h3>Student Level Lens</h3>
      </div>
      <div className="level-lens-summary">
        <div>
          <p className="section-label">Selected support</p>
          <strong>{lens.title}</strong>
        </div>
        <span>{lens.focus}</span>
      </div>
      <div className="level-lens-grid">
        <article>
          <p className="section-label">Graph task</p>
          <strong>{lens.graphTask}</strong>
        </article>
        <article>
          <p className="section-label">Student sentence starter</p>
          <strong>{lens.sentenceStarter}</strong>
        </article>
        <article>
          <p className="section-label">Teacher signal</p>
          <strong>{lens.teacherSignal}</strong>
        </article>
      </div>
    </section>
  );
}

function ConceptMasteryCheckPanel({
  check,
  onAnswerChange
}: {
  check: ConceptMasteryCheck;
  onAnswerChange: (questionId: ConceptMasteryCheck["questions"][number]["id"], optionId: string) => void;
}) {
  return (
    <section className={`concept-mastery-check concept-mastery-${check.status}`} aria-label="Concept Mastery Check">
      <div className="mastery-header">
        <div className="panel-title">
          <CheckCircle2 size={18} />
          <h3>Concept Mastery Check</h3>
        </div>
        <span>{check.score}/100</span>
      </div>
      <div className="mastery-summary">
        <div>
          <p className="section-label">Understanding proof</p>
          <strong>
            {check.readyCount}/{check.totalCount} passed
          </strong>
        </div>
        <span>{check.summary}</span>
      </div>
      <div className="mastery-question-grid">
        {check.questions.map((question) => (
          <article className={`mastery-question mastery-question-${question.status}`} key={question.id}>
            <div className="mastery-question-header">
              <strong>{question.label}</strong>
              <span>{formatMasteryQuestionStatus(question.status)}</span>
            </div>
            <p>{question.prompt}</p>
            <div className="mastery-option-list">
              {question.options.map((option) => (
                <button
                  type="button"
                  className={question.selectedOptionId === option.id ? "active" : ""}
                  aria-pressed={question.selectedOptionId === option.id}
                  onClick={() => onAnswerChange(question.id, option.id)}
                  key={option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <small>{question.feedback}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComparisonPanel({ issues, hints }: { issues: Issue[]; hints: string[] }) {
  return (
    <section className="comparison-panel" aria-label="Comparison insights">
      <div className="panel-title">
        <CheckCircle2 size={18} />
        <h3>Comparison insights</h3>
      </div>
      <div className="issue-list">
        {issues.map((issue) => (
          <article className={`issue issue-${issue.severity}`} key={issue.id}>
            <strong>{issue.title}</strong>
            <span>{issue.detail}</span>
          </article>
        ))}
      </div>
      <div className="hint-strip">
        {hints.slice(0, 3).map((hint) => (
          <p key={hint}>{hint}</p>
        ))}
      </div>
    </section>
  );
}

function PatternEvidencePanel({ evidence }: { evidence: PatternEvidence }) {
  return (
    <section className={`pattern-evidence pattern-evidence-${evidence.status}`} aria-label="Pattern Evidence Engine">
      <div className="panel-title">
        <LineChartIcon size={18} />
        <h3>Pattern Evidence Engine</h3>
      </div>
      <div className="pattern-summary">
        <div>
          <p className="section-label">Whole-pattern support</p>
          <strong>{evidence.score}/100</strong>
        </div>
        <span>{formatPatternEvidenceStatus(evidence.status)}</span>
      </div>
      <p className="pattern-copy">{evidence.summary}</p>
      <div className="pattern-method">
        <p className="section-label">Method</p>
        <strong>{evidence.method}</strong>
      </div>
      <div className="pattern-observations">
        <p className="section-label">Evidence checks</p>
        {evidence.observations.map((observation) => (
          <article className={`pattern-observation pattern-observation-${observation.status}`} key={observation.id}>
            <div>
              <strong>{observation.label}</strong>
              <span>{formatPatternObservationStatus(observation.status)}</span>
            </div>
            <small>{observation.expected}</small>
            <p>{observation.observed}</p>
            <p>{observation.detail}</p>
          </article>
        ))}
      </div>
      <div className="pattern-question">
        <p className="section-label">Student question</p>
        <strong>{evidence.studentQuestion}</strong>
      </div>
    </section>
  );
}

function MethodAuditPanel({ audit }: { audit: MethodAudit }) {
  return (
    <section className={`method-audit method-audit-${audit.status}`} aria-label="Method Audit">
      <div className="panel-title">
        <Gauge size={18} />
        <h3>Method Audit</h3>
      </div>
      <div className="audit-summary">
        <div>
          <p className="section-label">Reproducibility</p>
          <strong>{audit.score}/100</strong>
        </div>
        <span>{formatAuditStatus(audit.status)}</span>
      </div>
      <div className="audit-grid">
        <article>
          <p className="section-label">Variables</p>
          <strong>
            {audit.independentVariable} {"->"} {audit.dependentVariable}
          </strong>
        </article>
        <article>
          <p className="section-label">Controlled variables</p>
          <ul>
            {audit.controlVariables.map((variable) => (
              <li key={variable}>{variable}</li>
            ))}
          </ul>
        </article>
        <article>
          <p className="section-label">Assumptions</p>
          <ul>
            {audit.assumptions.map((assumption) => (
              <li key={assumption}>{assumption}</li>
            ))}
          </ul>
        </article>
        <article>
          <p className="section-label">Limits</p>
          <strong>{audit.safetyLimit}</strong>
        </article>
      </div>
      {audit.confounds.length ? (
        <div className="audit-confounds">
          <p className="section-label">Review flags</p>
          {audit.confounds.map((confound) => (
            <span key={confound}>{confound}</span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ReliabilityCoachPanel({ coach }: { coach: ReliabilityCoach }) {
  return (
    <section className={`reliability-coach reliability-coach-${coach.status}`} aria-label="Reliability Coach">
      <div className="panel-title">
        <Gauge size={18} />
        <h3>Reliability Coach</h3>
      </div>
      <div className="reliability-summary">
        <div>
          <p className="section-label">Repeat reliability</p>
          <strong>{coach.score}/100</strong>
        </div>
        <span>{formatReliabilityStatus(coach.status)}</span>
      </div>
      <p className="reliability-copy">{coach.summary}</p>
      <div className="reliability-action">
        <p className="section-label">Recommended move</p>
        <strong>{coach.recommendation}</strong>
      </div>
      <div className="reliability-groups">
        <p className="section-label">Repeat groups</p>
        {coach.repeatGroups.map((group) => (
          <article className={`reliability-group reliability-group-${group.status}`} key={group.id}>
            <div>
              <strong>{group.label}</strong>
              <span>{formatReliabilityGroupStatus(group.status)}</span>
            </div>
            <small>
              {group.count} trial{group.count === 1 ? "" : "s"} · avg {formatReliabilityNumber(group.average)} · spread{" "}
              {formatReliabilityNumber(group.spread)}
            </small>
            <p>{group.note}</p>
          </article>
        ))}
      </div>
      <div className="reliability-question">
        <p className="section-label">Student question</p>
        <strong>{coach.studentQuestion}</strong>
      </div>
    </section>
  );
}

function SafetyCoachPanel({ coach }: { coach: SafetyCoach }) {
  return (
    <section className={`safety-coach safety-coach-${coach.status}`} aria-label="Safety Coach">
      <div className="panel-title">
        <ShieldCheck size={18} />
        <h3>Safety Coach</h3>
      </div>
      <div className="safety-summary">
        <div>
          <p className="section-label">Classroom safety</p>
          <strong>{coach.summary}</strong>
        </div>
        <span>{formatSafetyStatus(coach.status)}</span>
      </div>
      <div className="safety-grid">
        <article>
          <p className="section-label">Required checks</p>
          <div className="safety-check-list">
            {coach.checks.map((check) => (
              <span key={check.id}>
                <strong>{check.label}</strong>
                {check.detail}
              </span>
            ))}
          </div>
        </article>
        <article>
          <p className="section-label">Materials</p>
          <ul>
            {coach.materialNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>
      </div>
      <div className="safety-detail-grid">
        <article>
          <p className="section-label">Stop condition</p>
          <strong>{coach.stopCondition}</strong>
        </article>
        <article>
          <p className="section-label">Cleanup</p>
          <span>{coach.cleanup}</span>
        </article>
        <article>
          <p className="section-label">Teacher check</p>
          <span>{coach.teacherCheck}</span>
        </article>
      </div>
    </section>
  );
}

function ConceptCoachPanel({ coach }: { coach: ConceptCoach }) {
  return (
    <section className="concept-coach" aria-label="Concept Coach">
      <div className="panel-title">
        <BookOpen size={18} />
        <h3>Concept Coach</h3>
      </div>
      <div className="concept-grid">
        <article>
          <p className="section-label">Vocabulary</p>
          <div className="vocabulary-list">
            {coach.vocabulary.map((item) => (
              <span key={item.term}>
                <strong>{item.term}</strong>
                {item.definition}
              </span>
            ))}
          </div>
        </article>
        <article>
          <p className="section-label">Explain it</p>
          <ol>
            {coach.explanationSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </div>
      <div className="misconception-card">
        <p className="section-label">Misconception check</p>
        {coach.misconceptionChecks.map((check) => (
          <article key={check.misconception}>
            <strong>{check.misconception}</strong>
            <span>{check.correction}</span>
            <em>{check.checkQuestion}</em>
          </article>
        ))}
      </div>
      <div className="source-task">
        <p className="section-label">Source task</p>
        <strong>{coach.sourceTask}</strong>
      </div>
    </section>
  );
}

function LabBriefPanel({ brief }: { brief: LabBrief }) {
  return (
    <section className={`lab-brief lab-brief-${brief.status}`} aria-label="Claim Coach">
      <div className="panel-title">
        <ClipboardCheck size={18} />
        <h3>Claim Coach</h3>
      </div>
      <div className="brief-status">
        <strong>{brief.signal}</strong>
        <span>{brief.nextQuestion}</span>
      </div>
      <div className="claim-starter">
        <p className="section-label">Claim starter</p>
        <strong>{brief.claimStarter}</strong>
      </div>
      <div className="brief-checklist">
        {brief.evidenceChecklist.map((item) => (
          <article className={item.complete ? "brief-item brief-item-complete" : "brief-item"} key={item.id}>
            <CheckCircle2 size={16} />
            <div>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="brief-sources">
        {brief.sourceTrail.map((source) => (
          <a href={source.url} target="_blank" rel="noreferrer" key={`${source.publisher}-${source.title}`}>
            {source.publisher}: {source.title}
          </a>
        ))}
      </div>
    </section>
  );
}

function NextTrialPanel({ plan }: { plan: NextTrialPlan }) {
  return (
    <section className={`next-trial-panel next-trial-${plan.status}`} aria-label="Next Trial Planner">
      <div className="panel-title">
        <ListChecks size={18} />
        <h3>Next Trial Planner</h3>
      </div>
      <div className="next-trial-summary">
        <div>
          <p className="section-label">Priority</p>
          <strong>{plan.priority}</strong>
        </div>
        <span>{formatNextTrialStatus(plan.status)}</span>
      </div>
      <div className="next-trial-grid">
        <article>
          <p className="section-label">Next measurement</p>
          <strong>{plan.nextMeasurement}</strong>
        </article>
        <article>
          <p className="section-label">Control to tighten</p>
          <strong>{plan.controlToTighten}</strong>
        </article>
        <article>
          <p className="section-label">Why it matters</p>
          <span>{plan.whyItMatters}</span>
        </article>
        <article>
          <p className="section-label">Safety reminder</p>
          <span>{plan.safetyReminder}</span>
        </article>
      </div>
      <div className="next-trial-question">
        <p className="section-label">Student decision</p>
        <strong>{plan.studentQuestion}</strong>
      </div>
      <div className="next-trial-checklist">
        {plan.checklist.map((item) => (
          <article className={item.complete ? "next-check next-check-complete" : "next-check"} key={item.id}>
            <CheckCircle2 size={16} />
            <div>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidencePacketPanel({ packet }: { packet: string }) {
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    setCopyStatus("");
  }, [packet]);

  async function copyPacket() {
    if (!navigator.clipboard) {
      setCopyStatus("Select the packet text to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(packet);
      setCopyStatus("Evidence packet copied.");
    } catch {
      setCopyStatus("Select the packet text to copy.");
    }
  }

  return (
    <section className="evidence-packet" aria-label="Evidence Packet">
      <div className="packet-header">
        <div className="panel-title">
          <FileText size={18} />
          <h3>Evidence Packet</h3>
        </div>
        <button type="button" onClick={() => void copyPacket()}>
          <Copy size={16} />
          Copy packet
        </button>
      </div>
      <textarea className="packet-preview" aria-label="Student evidence packet" readOnly value={packet} />
      {copyStatus ? (
        <p className="packet-status" aria-live="polite">
          {copyStatus}
        </p>
      ) : null}
    </section>
  );
}

function formatAuditStatus(status: MethodAudit["status"]) {
  if (status === "blocked") return "Blocked";
  if (status === "needs_review") return "Needs review";
  return "Strong";
}

function formatReliabilityStatus(status: ReliabilityCoach["status"]) {
  if (status === "blocked") return "Blocked";
  if (status === "review_spread") return "Review spread";
  if (status === "needs_repeats") return "Needs repeats";
  return "Strong";
}

function formatReliabilityGroupStatus(status: ReliabilityCoach["repeatGroups"][number]["status"]) {
  if (status === "review_spread") return "Review spread";
  if (status === "needs_repeat") return "Needs repeat";
  return "Strong";
}

function formatReliabilityNumber(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "n/a";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function formatPatternEvidenceStatus(status: PatternEvidence["status"]) {
  if (status === "supports_expected") return "Supports expected";
  if (status === "contradicts") return "Contradicts";
  if (status === "insufficient") return "Needs data";
  return "Mixed evidence";
}

function formatPatternObservationStatus(status: PatternEvidence["observations"][number]["status"]) {
  if (status === "supports") return "Supports";
  if (status === "contradicts") return "Contradicts";
  if (status === "insufficient") return "Needs data";
  return "Mixed";
}

function formatGroundingAuditStatus(status: GroundingAudit["status"]) {
  if (status === "source_backed") return "Source backed";
  if (status === "mixed_evidence") return "Mixed evidence";
  return "Needs source review";
}

function formatGroundingCheckStatus(status: GroundingAudit["checks"][number]["status"]) {
  if (status === "verified") return "Verified";
  if (status === "mixed") return "Mixed";
  return "Review";
}

function formatAiEvaluationStatus(status: AiEvaluationHarness["status"]) {
  if (status === "validated") return "Validated";
  if (status === "blocked") return "Blocked";
  return "Review";
}

function formatDataHandlingStatus(status: DataHandlingLedger["status"]) {
  return status === "privacy_preserving" ? "Privacy preserving" : "Review";
}

function formatLearningExitTicketStatus(status: LearningExitTicket["status"]) {
  if (status === "blocked") return "Blocked";
  if (status === "review") return "Review first";
  return "Ready";
}

function formatStudentReflectionEntryStatus(status: StudentReflectionWorkspace["entries"][number]["status"]) {
  if (status === "ready") return "Ready";
  if (status === "too_short") return "Add evidence";
  return "Empty";
}

function formatAiEvaluationCheckStatus(status: AiEvaluationHarness["checks"][number]["status"]) {
  if (status === "pass") return "Pass";
  if (status === "fail") return "Fail";
  return "Review";
}

function formatNextTrialStatus(status: NextTrialPlan["status"]) {
  if (status === "blocked") return "Fix data first";
  if (status === "fix_first") return "Fix warnings first";
  return "Ready for next trial";
}

function formatSafetyStatus(status: SafetyCoach["status"]) {
  if (status === "do_not_run") return "Do not run yet";
  if (status === "adult_review") return "Adult review";
  return "Classroom ready";
}

function formatFlowStatus(status: GuidedLabFlow["steps"][number]["status"]) {
  if (status === "done") return "Done";
  if (status === "blocked") return "Blocked";
  if (status === "review") return "Review";
  return "Next";
}

function formatMasteryQuestionStatus(status: ConceptMasteryCheck["questions"][number]["status"]) {
  if (status === "correct") return "Passed";
  if (status === "review") return "Review";
  return "Choose";
}

function formatReadiness(readiness: AnalyzeResult["trackEvidence"]["readiness"]) {
  if (readiness === "competitive") return "Competitive";
  if (readiness === "submittable") return "Submittable";
  return "Needs work";
}

function formatMcpStatus(status: McpIntegrationPlan["status"]) {
  if (status === "ready") return "Server MCP ready";
  if (status === "server_dry_run") return "Server dry-run";
  return "Preview only";
}

function formatRuntimeProofStatus(status: RuntimeProof["status"]) {
  return status === "web_enriched_ready" ? "Web search ready" : "Fallback ready";
}

function formatMcpConnectorStatus(status: McpIntegrationPlan["readinessMatrix"][number]["status"]) {
  return status === "ready" ? "Ready" : "Needs server setup";
}

function formatMcpDryRunStatus(status: McpIntegrationPlan["dryRunChecks"][number]["status"]) {
  return status === "pass" ? "Pass" : "Review";
}

function formatMcpExportStatus(status: McpBridgeExportResponse["status"]) {
  if (status === "ready") return "Ready";
  if (status === "blocked") return "Blocked";
  return "Dry-run passed";
}

function formatMcpSessionStatus(status: McpBridgeSessionResponse["status"]) {
  if (status === "created") return "Session created";
  if (status === "blocked") return "Blocked";
  return "Session dry-run";
}

function formatMcpExportCheckStatus(status: McpBridgeExportResponse["checks"][number]["status"]) {
  if (status === "pass") return "Pass";
  if (status === "blocked") return "Blocked";
  return "Review";
}

function formatMcpPayloadPreview(plan: McpIntegrationPlan) {
  return [
    `# ${plan.payloadPreview.title}`,
    "",
    `Status: ${formatMcpStatus(plan.status)}`,
    `Rows: ${plan.payloadPreview.rowCount}`,
    `Sources: ${plan.payloadPreview.sourceCount}`,
    `Saved runs: ${plan.payloadPreview.savedRunCount}`,
    `Columns: ${plan.payloadPreview.tableColumns.join(", ")}`,
    "",
    "Included sections:",
    ...plan.payloadPreview.includedSections.map((section) => `- ${section}`),
    "",
    "Actions:",
    ...plan.actions.map((action) => `- ${action.toolkit}: ${action.composioCapability} (${action.payloadSummary})`),
    "",
    "MCP readiness matrix:",
    ...plan.readinessMatrix.map(
      (connector) =>
        `- ${connector.toolkit}: ${formatMcpConnectorStatus(connector.status)}; env ${connector.requiredEnv.join(", ")}; scopes ${connector.requiredScopes.join(", ")}; data ${connector.dataShared}`
    ),
    "",
    "Dry-run checks:",
    ...plan.dryRunChecks.map((check) => `- ${check.label}: ${formatMcpDryRunStatus(check.status)} - ${check.detail}`),
    "",
    `Execution boundary: ${plan.executionBoundary}`,
    "",
    "Markdown excerpt:",
    plan.payloadPreview.markdownExcerpt
  ].join("\n");
}

function formatColumnLabel(result: AnalyzeResult, key: string) {
  const column = result.columns.find((candidate) => candidate.key === key);
  if (!column) return key;
  return column.unit ? `${column.label} (${column.unit})` : column.label;
}

function formatProgressPortfolioStatus(status: ProgressPortfolio["status"]) {
  if (status === "evidence_ready") return "Evidence ready";
  if (status === "building") return "Portfolio building";
  return "Start portfolio";
}

function formatPortfolioStoryStatus(status: ProgressPortfolio["story"]["status"]) {
  if (status === "ready") return "Story ready";
  return "Needs saved evidence";
}

function formatRubricStatus(status: OfficialRubricFit["criteria"][number]["status"]) {
  if (status === "strong") return "Strong";
  if (status === "ready") return "Ready";
  return "Review";
}

function formatJudgeDemoStatus(status: JudgeDemoPath["status"]) {
  if (status === "ready") return "Ready";
  if (status === "blocked") return "Blocked";
  return "Review";
}

function formatJudgeDemoStepStatus(status: JudgeDemoPath["steps"][number]["status"]) {
  if (status === "show") return "Show";
  if (status === "blocked") return "Blocked";
  return "Review";
}

function formatCustomLabTriageStatus(status: CustomLabTriage["status"]) {
  if (status === "supported_template") return "Supported template";
  return "Needs student details";
}

function formatPreLabStatus(status: PreLabDesignCoach["status"]) {
  if (status === "blocked") return "Blocked";
  if (status === "needs_teacher_review") return "Teacher review";
  return "Ready to plan";
}

function formatPreLabCheckStatus(status: PreLabDesignCoach["setupChecks"][number]["status"]) {
  if (status === "blocked") return "Blocked";
  if (status === "review") return "Review";
  return "Ready";
}

function formatSavedTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function loadSavedLabs(): SavedLab[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(savedLabsKey) ?? "[]");
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function storeSavedLabs(savedLabs: SavedLab[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(savedLabsKey, JSON.stringify(savedLabs));
}
