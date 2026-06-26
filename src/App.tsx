import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  LineChart as LineChartIcon,
  Search,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { requestAnalysis } from "./lib/api";
import { evaluateRows } from "./lib/analysis";
import { SAMPLE_PROMPTS } from "./lib/samples";
import type { AnalyzeResult, Issue, StudentDataRow } from "./lib/types";

const initialPrompt = SAMPLE_PROMPTS[0].text;

export function App() {
  const [description, setDescription] = useState(initialPrompt);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [rows, setRows] = useState<StudentDataRow[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function analyze(nextDescription = description, nextRows?: StudentDataRow[]) {
    setStatus("loading");
    setError("");

    try {
      const analysis = await requestAnalysis({ description: nextDescription, rows: nextRows });
      setResult(analysis);
      setRows(analysis.rows);
      setStatus("idle");
    } catch (analysisError) {
      setStatus("error");
      setError(analysisError instanceof Error ? analysisError.message : "Unable to analyze this experiment.");
    }
  }

  useEffect(() => {
    void analyze(initialPrompt);
  }, []);

  function updateCell(rowId: string, key: string, value: string) {
    const nextRows = rows.map((row) => (row.id === rowId ? { ...row, [key]: value } : row));
    setRows(nextRows);

    if (result) {
      const issues = evaluateRows(result.templateId, nextRows);
      setResult({
        ...result,
        rows: nextRows,
        issues,
        hints: mergeHints(result.hints, issues)
      });
    }
  }

  const chartData = useMemo(() => {
    if (!result) return [];
    return rows.map((row) => ({
      ...row,
      [result.expectedResult.yKey]: Number(row[result.expectedResult.yKey])
    }));
  }, [result, rows]);

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
          <a href="#sources">Sources</a>
          <a href="#saved">Saved Labs</a>
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
          <button className="analyze-button" type="button" onClick={() => void analyze()} disabled={status === "loading"}>
            <Search size={18} />
            {status === "loading" ? "Analyzing..." : "Analyze"}
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
                  <p className="section-label">Identified experiment</p>
                  <h2>{result.classification.title}</h2>
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

              <div className="graph-card">
                <div className="panel-title">
                  <LineChartIcon size={18} />
                  <h3>{result.expectedResult.graphTitle}</h3>
                </div>
                <ExpectedGraph result={result} data={chartData} />
              </div>

              <div className="data-card">
                <div className="panel-title">
                  <SlidersHorizontal size={18} />
                  <h3>Student data table</h3>
                </div>
                <DataTable result={result} rows={rows} onCellChange={updateCell} />
              </div>

              <ComparisonPanel issues={result.issues} hints={result.hints} />
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
            </>
          ) : null}
        </aside>
      </section>
    </main>
  );
}

function ExpectedGraph({ result, data }: { result: AnalyzeResult; data: Array<Record<string, string | number>> }) {
  const xKey = result.expectedResult.xKey;
  const yKey = result.expectedResult.yKey;

  if (result.expectedResult.graphKind === "scatter") {
    return (
      <ResponsiveContainer width="100%" height={230}>
        <ScatterChart margin={{ top: 16, right: 22, bottom: 16, left: 0 }}>
          <CartesianGrid stroke="#dfe8f5" />
          <XAxis dataKey={xKey} name={xKey} stroke="#617189" />
          <YAxis dataKey={yKey} name={yKey} stroke="#617189" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill="#2368ff" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={data} margin={{ top: 16, right: 22, bottom: 16, left: 0 }}>
        <CartesianGrid stroke="#dfe8f5" />
        <XAxis dataKey={xKey} stroke="#617189" />
        <YAxis stroke="#617189" />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke="#2368ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
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

function mergeHints(existingHints: string[], issues: Issue[]) {
  const extra = issues.some((issue) => issue.severity === "warning")
    ? ["Before changing your conclusion, decide whether the odd point is measurement error or a real exception."]
    : [];

  return Array.from(new Set([...extra, ...existingHints]));
}
