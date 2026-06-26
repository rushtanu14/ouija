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
    concepts: string[];
  };
  variables: string[];
  expectedResult: ExpectedResult;
  sources: SourceCard[];
  columns: DataColumn[];
  rows: StudentDataRow[];
  issues: Issue[];
  hints: string[];
  explanation: string;
  integrityNotice: string;
  groundingStatus: {
    mode: "fallback" | "web_enriched";
    note: string;
  };
}
