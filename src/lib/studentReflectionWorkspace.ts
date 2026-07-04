import type { LearningExitTicket, StudentReflectionAnswers, StudentReflectionEntry, StudentReflectionWorkspace } from "./types";

const readyWordThreshold = 8;

export function buildStudentReflectionWorkspace(
  ticket: LearningExitTicket,
  answers: StudentReflectionAnswers = {}
): StudentReflectionWorkspace {
  const entries = ticket.prompts.map<StudentReflectionEntry>((prompt) => {
    const answer = getAnswer(answers[prompt.id]);
    const normalizedAnswer = normalizeForScoring(answer);
    const wordCount = countWords(normalizedAnswer);
    const status = normalizedAnswer.length === 0 ? "empty" : wordCount >= readyWordThreshold ? "ready" : "too_short";

    return {
      promptId: prompt.id,
      label: prompt.label,
      studentPrompt: prompt.studentPrompt,
      evidenceToUse: prompt.evidenceToUse,
      teacherSignal: prompt.teacherSignal,
      answer,
      wordCount,
      status
    };
  });

  const readyCount = entries.filter((entry) => entry.status === "ready").length;
  const startedCount = entries.filter((entry) => entry.status !== "empty").length;
  const totalCount = entries.length;
  const status =
    startedCount === 0 ? "not_started" : readyCount === totalCount && totalCount > 0 ? "ready_for_review" : "drafting";
  const shortEntry = entries.find((entry) => entry.status === "too_short");
  const emptyEntry = entries.find((entry) => entry.status === "empty");

  return {
    status,
    summary: buildSummary(readyCount, totalCount, status),
    readyCount,
    totalCount,
    entries,
    nextAction: buildNextAction(status, emptyEntry, shortEntry),
    integrityBoundary: "Ouija does not write reflection answers or final conclusions; the student drafts them.",
    teacherTakeaway: buildTeacherTakeaway(status, readyCount, totalCount)
  };
}

function getAnswer(value: string | undefined) {
  return typeof value === "string" ? value : "";
}

function normalizeForScoring(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function countWords(value: string) {
  if (!value) return 0;
  return value.split(/\s+/).filter(Boolean).length;
}

function buildSummary(readyCount: number, totalCount: number, status: StudentReflectionWorkspace["status"]) {
  if (status === "ready_for_review") return `${readyCount} of ${totalCount} reflection drafts are ready for teacher review.`;
  return `${readyCount} of ${totalCount} reflection drafts are ready.`;
}

function buildNextAction(
  status: StudentReflectionWorkspace["status"],
  emptyEntry: StudentReflectionEntry | undefined,
  shortEntry: StudentReflectionEntry | undefined
) {
  if (status === "ready_for_review") {
    return "Use these student-authored reflections to write the final conclusion yourself.";
  }

  if (shortEntry) {
    return `Revise ${shortEntry.label}: add evidence from the graph, table, or source trail.`;
  }

  if (emptyEntry) {
    return `Start with ${emptyEntry.label}: ${emptyEntry.studentPrompt}`;
  }

  return "Finish each reflection with one piece of evidence from your own run.";
}

function buildTeacherTakeaway(status: StudentReflectionWorkspace["status"], readyCount: number, totalCount: number) {
  if (status === "ready_for_review") {
    return "All exit-ticket responses are student-authored and ready for teacher review.";
  }

  return `${readyCount} of ${totalCount} student-authored responses have enough evidence for review.`;
}
