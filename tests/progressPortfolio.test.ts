import { describe, expect, it } from "vitest";
import { buildProgressPortfolio } from "../src/lib/progressPortfolio";
import type { ProgressPortfolioSnapshot } from "../src/lib/types";

const baseSavedAt = "2026-07-03T12:00:00.000Z";

function snapshot(overrides: Partial<ProgressPortfolioSnapshot>): ProgressPortfolioSnapshot {
  return {
    id: "snapshot-1",
    title: "Reaction Rate vs Temperature",
    subject: "Chemistry",
    savedAt: baseSavedAt,
    score: 94,
    readiness: "competitive",
    issueCount: 0,
    dataOrigin: "student_supplied",
    ...overrides
  };
}

describe("progress portfolio", () => {
  it("tells students to save more than one checked lab before claiming progress", () => {
    const portfolio = buildProgressPortfolio([snapshot({})]);

    expect(portfolio.status).toBe("building");
    expect(portfolio.summary).toContain("Save one more checked lab");
    expect(portfolio.metrics.map((metric) => metric.id)).toEqual([
      "saved-runs",
      "score-trend",
      "subject-breadth",
      "best-readiness"
    ]);
    expect(portfolio.metrics.find((metric) => metric.id === "saved-runs")?.value).toBe("1 saved run");
    expect(portfolio.nextAction).toContain("Save one more");
    expect(portfolio.story.status).toBe("not_ready");
    expect(portfolio.story.draftStarter).toContain("After I save two checked labs");
    expect(portfolio.story.prompts.find((prompt) => prompt.id === "progress-claim")?.status).toBe("needs_more_evidence");
  });

  it("summarizes score trend, subject breadth, and judge takeaway across saved labs", () => {
    const portfolio = buildProgressPortfolio([
      snapshot({
        id: "run-2",
        title: "Reaction Rate vs Temperature",
        subject: "Chemistry",
        savedAt: "2026-07-03T12:10:00.000Z",
        score: 94,
        readiness: "competitive",
        issueCount: 0
      }),
      snapshot({
        id: "run-1",
        title: "Plant Light Color",
        subject: "Biology",
        savedAt: "2026-07-03T12:00:00.000Z",
        score: 75,
        readiness: "needs_work",
        issueCount: 2
      })
    ]);

    expect(portfolio.status).toBe("evidence_ready");
    expect(portfolio.summary).toContain("2 saved labs");
    expect(portfolio.metrics.find((metric) => metric.id === "score-trend")?.value).toBe("+19");
    expect(portfolio.metrics.find((metric) => metric.id === "subject-breadth")?.value).toBe("2 subjects");
    expect(portfolio.metrics.find((metric) => metric.id === "best-readiness")?.value).toBe("Competitive");
    expect(portfolio.milestones.map((milestone) => milestone.id)).toEqual([
      "first-saved-run",
      "strongest-run",
      "latest-next-step"
    ]);
    expect(portfolio.story.status).toBe("ready");
    expect(portfolio.story.draftStarter).toContain("my evidence changed from 75/100 to 94/100");
    expect(portfolio.story.prompts.map((prompt) => prompt.id)).toEqual([
      "progress-claim",
      "best-evidence",
      "transfer-reflection"
    ]);
    expect(portfolio.story.prompts.find((prompt) => prompt.id === "transfer-reflection")?.evidenceToUse).toContain("Biology, Chemistry");
    expect(portfolio.story.integrityBoundary).toContain("student writes the progress story");
    expect(portfolio.judgeTakeaway).toContain("repeated learning evidence");
  });

  it("excludes demo and legacy snapshots from student-evidence readiness", () => {
    const portfolio = buildProgressPortfolio([
      snapshot({
        id: "demo-run",
        title: "Projectile Motion",
        subject: "Physics",
        dataOrigin: "demo_sample"
      }),
      snapshot({
        id: "legacy-run",
        title: "Legacy Saved Lab",
        subject: "Chemistry",
        dataOrigin: "legacy_unknown"
      })
    ]);

    expect(portfolio.status).toBe("building");
    expect(portfolio.summary).toContain("0 student-supplied");
    expect(portfolio.metrics.find((metric) => metric.id === "saved-runs")?.value).toBe("0 student-supplied runs");
    expect(portfolio.story.status).toBe("not_ready");
    expect(portfolio.nextAction).toContain("Save a student-supplied lab");
    expect(portfolio.judgeTakeaway).toContain("Demo and legacy snapshots are excluded");
  });
});
