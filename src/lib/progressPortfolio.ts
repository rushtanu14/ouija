import type { ProgressPortfolio, ProgressPortfolioSnapshot, TrackEvidence } from "./types";

export function buildProgressPortfolio(snapshots: ProgressPortfolioSnapshot[]): ProgressPortfolio {
  const orderedSnapshots = [...snapshots].sort((left, right) => Date.parse(left.savedAt) - Date.parse(right.savedAt));
  const savedCount = orderedSnapshots.length;
  const subjects = new Set(orderedSnapshots.map((snapshot) => snapshot.subject));
  const first = orderedSnapshots[0];
  const latest = orderedSnapshots.at(-1);
  const strongest = [...orderedSnapshots].sort((left, right) => right.score - left.score)[0];
  const scoreDelta = first && latest ? latest.score - first.score : 0;
  const bestReadiness = strongest ? formatReadiness(strongest.readiness) : "No saved runs";

  return {
    status: savedCount === 0 ? "empty" : savedCount === 1 ? "building" : "evidence_ready",
    summary: buildSummary(savedCount, scoreDelta, subjects.size),
    metrics: [
      {
        id: "saved-runs",
        label: "Saved runs",
        value: `${savedCount} saved run${savedCount === 1 ? "" : "s"}`,
        status: savedCount >= 2 ? "strong" : savedCount === 1 ? "watch" : "needs_action",
        detail:
          savedCount >= 2
            ? "Multiple snapshots let a judge see more than one lab moment."
            : "Save one more checked lab before presenting progress."
      },
      {
        id: "score-trend",
        label: "Score trend",
        value: formatScoreDelta(scoreDelta),
        status: savedCount >= 2 && scoreDelta >= 0 ? "strong" : savedCount >= 2 ? "watch" : "needs_action",
        detail:
          savedCount >= 2
            ? `Latest saved run is ${formatScoreDelta(scoreDelta)} points from the first saved run.`
            : "Trend appears after two saved runs."
      },
      {
        id: "subject-breadth",
        label: "Subject breadth",
        value: `${subjects.size} subject${subjects.size === 1 ? "" : "s"}`,
        status: subjects.size >= 2 ? "strong" : subjects.size === 1 ? "watch" : "needs_action",
        detail:
          subjects.size >= 2
            ? "Saved work spans more than one science area."
            : "Save a different subject to prove transfer across labs."
      },
      {
        id: "best-readiness",
        label: "Best readiness",
        value: bestReadiness,
        status: strongest?.readiness === "competitive" ? "strong" : strongest ? "watch" : "needs_action",
        detail: strongest
          ? `${strongest.title} is the strongest saved run at ${strongest.score}/100.`
          : "No saved run is available yet."
      }
    ],
    milestones: buildMilestones(orderedSnapshots, strongest),
    nextAction: buildNextAction(savedCount, subjects.size, scoreDelta),
    judgeTakeaway:
      savedCount >= 2
        ? "Progress Portfolio turns one-off AI help into repeated learning evidence across saved lab runs."
        : "Progress Portfolio is ready to prove repeated learning once a student saves at least two checked labs."
  };
}

function buildSummary(savedCount: number, scoreDelta: number, subjectCount: number) {
  if (savedCount === 0) {
    return "Save at least two checked labs to build a progress portfolio.";
  }

  if (savedCount === 1) {
    return "Save one more checked lab to show a trend instead of a one-off snapshot.";
  }

  return `${savedCount} saved labs show a ${formatScoreDelta(scoreDelta)} score trend across ${subjectCount} subject${subjectCount === 1 ? "" : "s"}.`;
}

function buildMilestones(
  orderedSnapshots: ProgressPortfolioSnapshot[],
  strongest: ProgressPortfolioSnapshot | undefined
): ProgressPortfolio["milestones"] {
  const first = orderedSnapshots[0];
  const latest = orderedSnapshots.at(-1);

  return [
    {
      id: "first-saved-run",
      label: "First saved run",
      title: first?.title ?? "No saved run",
      detail: first ? `${first.score}/100 with ${first.issueCount} flag${first.issueCount === 1 ? "" : "s"}.` : "Save a checked run first."
    },
    {
      id: "strongest-run",
      label: "Strongest run",
      title: strongest?.title ?? "No strongest run yet",
      detail: strongest ? `${formatReadiness(strongest.readiness)} at ${strongest.score}/100.` : "A strongest run appears after saving."
    },
    {
      id: "latest-next-step",
      label: "Latest next step",
      title: latest?.title ?? "No latest run yet",
      detail: latest
        ? latest.issueCount > 0
          ? "Resolve the saved flags before treating this as final evidence."
          : "Use this clean run as the starting point for the next controlled trial."
        : "Save a current analysis to start the portfolio."
    }
  ];
}

function buildNextAction(savedCount: number, subjectCount: number, scoreDelta: number) {
  if (savedCount === 0) {
    return "Save this checked lab, then save a second run after revising or trying another subject.";
  }

  if (savedCount === 1) {
    return "Save one more checked lab so Ouija can show learning progress instead of one snapshot.";
  }

  if (subjectCount < 2) {
    return "Save a run from a different subject to prove the workflow transfers beyond one lab type.";
  }

  if (scoreDelta < 0) {
    return "Use the latest flags to revise the lab, then save a cleaner run before submitting this progress story.";
  }

  return "Use the portfolio in the Judge Brief to show repeated progress, breadth, and a student-owned next step.";
}

function formatScoreDelta(scoreDelta: number) {
  if (scoreDelta > 0) return `+${scoreDelta}`;
  return String(scoreDelta);
}

function formatReadiness(readiness: TrackEvidence["readiness"]) {
  return readiness
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
