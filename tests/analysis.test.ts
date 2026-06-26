import { describe, expect, it } from "vitest";
import { analyzeExperiment, evaluateRows, matchExperiment } from "../src/lib/analysis";

describe("experiment matching", () => {
  it("identifies the four supported middle/high school experiment types", () => {
    expect(matchExperiment("launch a ball at different angles and measure range").template.id).toBe("projectile-motion");
    expect(matchExperiment("temperature changes reaction rate for a tablet").template.id).toBe("reaction-rate-temperature");
    expect(matchExperiment("enzyme catalase activity at different temperatures").template.id).toBe("enzyme-activity-temperature");
    expect(matchExperiment("water filtration turbidity before and after charcoal").template.id).toBe("water-filtration-turbidity");
  });
});

describe("fallback analysis", () => {
  it("returns usable expected results, columns, sources, and hints without credentials", () => {
    const result = analyzeExperiment({
      description: "We launched a ball at angles and measured range."
    });

    expect(result.classification.title).toBe("Projectile Motion");
    expect(result.expectedResult.summary).toContain("45 degrees");
    expect(result.columns.map((column) => column.key)).toContain("rangeM");
    expect(result.sources[0].url).toMatch(/^https:\/\//);
    expect(result.hints.length).toBeGreaterThan(0);
    expect(result.groundingStatus.mode).toBe("fallback");
  });

  it("keeps the academic integrity guard when a student asks for report writing", () => {
    const result = analyzeExperiment({
      description: "Write my lab report for a projectile motion lab."
    });

    expect(result.integrityNotice).toContain("will not write");
    expect(result.issues.some((issue) => issue.id === "integrity-report-request")).toBe(true);
  });
});

describe("data checks", () => {
  it("catches missing and invalid numeric cells", () => {
    const issues = evaluateRows("projectile-motion", [
      { id: "bad", angleDeg: "forty", launchSpeedMs: "", rangeM: 100, timeS: 1.5 }
    ]);

    expect(issues.some((issue) => issue.title === "Possible unit or number mismatch")).toBe(true);
    expect(issues.some((issue) => issue.title === "Missing data")).toBe(true);
  });

  it("flags projectile range outliers", () => {
    const issues = evaluateRows("projectile-motion", [
      { id: "p1", angleDeg: 45, launchSpeedMs: 12, rangeM: 3, timeS: 1.7 }
    ]);

    expect(issues.some((issue) => issue.id.includes("projectile-outlier"))).toBe(true);
  });

  it("flags reaction-rate patterns that move in the wrong direction", () => {
    const issues = evaluateRows("reaction-rate-temperature", [
      { id: "c1", tempC: 10, reactionTimeS: 50, ratePerS: 0.04 },
      { id: "c2", tempC: 40, reactionTimeS: 80, ratePerS: 0.01 }
    ]);

    expect(issues.some((issue) => issue.id === "reaction-rate-trend")).toBe(true);
  });
});
