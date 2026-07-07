import type { AnalyzeResult } from "./types";

export type ConceptMasteryQuestionId = "independent-variable" | "expected-pattern" | "integrity-boundary";

export type ConceptMasteryAnswerMap = Partial<Record<ConceptMasteryQuestionId, string>>;

export interface ConceptMasteryOption {
  id: string;
  label: string;
  correct: boolean;
}

export interface ConceptMasteryQuestion {
  id: ConceptMasteryQuestionId;
  label: string;
  prompt: string;
  options: ConceptMasteryOption[];
  selectedOptionId?: string;
  status: "unanswered" | "correct" | "review";
  feedback: string;
}

export interface ConceptMasteryCheck {
  score: number;
  readyCount: number;
  totalCount: number;
  status: "not_started" | "in_progress" | "ready";
  summary: string;
  questions: ConceptMasteryQuestion[];
}

export function buildConceptMasteryCheck(result: AnalyzeResult, answers: ConceptMasteryAnswerMap): ConceptMasteryCheck {
  const independent = formatColumnLabel(result, result.expectedResult.xKey);
  const dependent = formatColumnLabel(result, result.expectedResult.yKey);
  const distractor = result.columns.find((column) => column.key !== result.expectedResult.xKey && column.key !== result.expectedResult.yKey);

  const questions = [
    buildQuestion({
      id: "independent-variable",
      label: "Variable check",
      prompt: "Which part of this experiment did the student intentionally change?",
      options: [
        { id: result.expectedResult.xKey, label: independent, correct: true },
        { id: result.expectedResult.yKey, label: dependent, correct: false },
        { id: distractor?.key ?? "trial-or-notes", label: distractor ? formatColumnLabel(result, distractor.key) : "Trial number or notes", correct: false }
      ],
      selectedOptionId: answers["independent-variable"],
      correctFeedback: "Good. That is the independent variable the graph should use on the x-axis.",
      reviewFeedback: "Review the variable plan before writing the claim."
    }),
    buildQuestion({
      id: "expected-pattern",
      label: "Pattern check",
      prompt: "What should the student compare their table against before making a claim?",
      options: [
        { id: "expected-pattern", label: result.expectedResult.pattern, correct: true },
        { id: "single-row", label: "One favorite row from the table", correct: false },
        { id: "unsupported-guess", label: "A claim without graph or source evidence", correct: false }
      ],
      selectedOptionId: answers["expected-pattern"],
      correctFeedback: "Good. The claim should use the full graph pattern, not a single convenient row.",
      reviewFeedback: "Use the expected overlay and Pattern Evidence Engine before choosing a claim."
    }),
    buildQuestion({
      id: "integrity-boundary",
      label: "Integrity check",
      prompt: "Which part must remain student-written?",
      options: [
        { id: "final-claim", label: "The final claim or conclusion paragraph", correct: true },
        { id: "citation-links", label: "The visible citation links", correct: false },
        { id: "table-headers", label: "The editable table headers", correct: false }
      ],
      selectedOptionId: answers["integrity-boundary"],
      correctFeedback: "Good. Ouija can scaffold evidence, but the final claim stays student-owned.",
      reviewFeedback: "Use Claim Coach blanks and write the final claim in your own words."
    })
  ];
  const answeredCount = questions.filter((question) => question.selectedOptionId).length;
  const readyCount = questions.filter((question) => question.status === "correct").length;
  const score = Math.round((readyCount / questions.length) * 100);
  const status = readyCount === questions.length ? "ready" : answeredCount === 0 ? "not_started" : "in_progress";

  return {
    score,
    readyCount,
    totalCount: questions.length,
    status,
    summary: buildSummary(status, readyCount, questions.length),
    questions
  };
}

function buildQuestion({
  id,
  label,
  prompt,
  options,
  selectedOptionId,
  correctFeedback,
  reviewFeedback
}: {
  id: ConceptMasteryQuestionId;
  label: string;
  prompt: string;
  options: ConceptMasteryOption[];
  selectedOptionId?: string;
  correctFeedback: string;
  reviewFeedback: string;
}): ConceptMasteryQuestion {
  const dedupedOptions = dedupeOptions(options);
  const selected = dedupedOptions.find((option) => option.id === selectedOptionId);
  const status = !selected ? "unanswered" : selected.correct ? "correct" : "review";

  return {
    id,
    label,
    prompt,
    options: dedupedOptions,
    selectedOptionId,
    status,
    feedback: !selected ? "Choose an answer to check your understanding." : selected.correct ? correctFeedback : reviewFeedback
  };
}

function dedupeOptions(options: ConceptMasteryOption[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option.id)) return false;
    seen.add(option.id);
    return true;
  });
}

function buildSummary(status: ConceptMasteryCheck["status"], readyCount: number, totalCount: number) {
  if (status === "ready") return "Concept check passed. The student can explain the variables, evidence pattern, and integrity boundary.";
  if (status === "in_progress") return `${readyCount}/${totalCount} checks passed. Review any missed concept before writing the claim.`;
  return "Answer three quick checks to prove understanding before using the evidence packet.";
}

function formatColumnLabel(result: AnalyzeResult, key: string) {
  const column = result.columns.find((candidate) => candidate.key === key);
  if (!column) return key;
  return column.unit ? `${column.label} (${column.unit})` : column.label;
}
