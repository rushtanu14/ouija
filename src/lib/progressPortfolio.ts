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
  const subjectNames = Array.from(subjects);

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
    story: buildPortfolioStory(orderedSnapshots, subjectNames, scoreDelta, strongest),
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

function buildPortfolioStory(
  orderedSnapshots: ProgressPortfolioSnapshot[],
  subjectNames: string[],
  scoreDelta: number,
  strongest: ProgressPortfolioSnapshot | undefined
): ProgressPortfolio["story"] {
  const savedCount = orderedSnapshots.length;
  const first = orderedSnapshots[0];
  const latest = orderedSnapshots.at(-1);
  const status = savedCount >= 2 ? "ready" : "not_ready";
  const subjectSummary = subjectNames.length ? subjectNames.join(", ") : "no saved subjects yet";

  return {
    status,
    headline:
      status === "ready"
        ? "Use the saved-run evidence to write a short progress story in your own words."
        : "Save two checked labs before writing a progress story.",
    draftStarter:
      status === "ready"
        ? `Across my saved labs, my evidence changed from ${first?.score ?? "__"}/100 to ${latest?.score ?? "__"}/100. The strongest run was ${strongest?.title ?? "__"} because ___. My next controlled step is ___.`
        : "After I save two checked labs, I will compare ___ with ___ and explain what improved because ___.",
    prompts: [
      {
        id: "progress-claim",
        label: "Progress claim",
        prompt: "What changed between your first saved run and your latest saved run?",
        evidenceToUse:
          first && latest
            ? `${first.title}: ${first.score}/100; ${latest.title}: ${latest.score}/100; score trend ${formatScoreDelta(scoreDelta)}.`
            : "Save two checked runs so Ouija can show a first-to-latest score trend.",
        status: savedCount >= 2 ? "ready" : "needs_more_evidence"
      },
      {
        id: "best-evidence",
        label: "Best evidence",
        prompt: "Which saved run best shows that you can reason from data, and what evidence makes it strongest?",
        evidenceToUse: strongest
          ? `${strongest.title}: ${formatReadiness(strongest.readiness)} at ${strongest.score}/100 with ${strongest.issueCount} flag${strongest.issueCount === 1 ? "" : "s"}.`
          : "Save a checked run so Ouija can identify the strongest evidence.",
        status: strongest ? "ready" : "needs_more_evidence"
      },
      {
        id: "transfer-reflection",
        label: "Transfer reflection",
        prompt: "How did the workflow transfer across experiments or science subjects?",
        evidenceToUse:
          subjectNames.length >= 2
            ? `Saved subjects: ${subjectSummary}.`
            : "Save a run from a second subject to prove the workflow transfers beyond one lab type.",
        status: subjectNames.length >= 2 ? "ready" : "needs_more_evidence"
      }
    ],
    integrityBoundary: "Ouija gives prompts and evidence, but the student writes the progress story.",
    judgeTakeaway:
      status === "ready"
        ? "Portfolio Story Builder turns saved runs into student-authored impact evidence for judges."
        : "Portfolio Story Builder waits for enough saved evidence before asking the student to write a progress story."
  };
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
