import { describe, expect, it } from "vitest";
import { analyzeExperiment } from "../src/lib/analysis";
import { buildConceptMasteryCheck } from "../src/lib/conceptMasteryCheck";

describe("buildConceptMasteryCheck", () => {
  it("starts with three unanswered checks derived from the current experiment", () => {
    const result = analyzeExperiment({
      description: "We launched a ball at angles and measured range."
    });

    const check = buildConceptMasteryCheck(result, {});

    expect(check.status).toBe("not_started");
    expect(check.score).toBe(0);
    expect(check.questions).toHaveLength(3);
    expect(check.questions[0].options.find((option) => option.correct)?.label).toBe("Angle (deg)");
    expect(check.questions[1].options.find((option) => option.correct)?.label).toContain("near 45 degrees");
  });

  it("scores correct answers and keeps the final claim student-owned", () => {
    const result = analyzeExperiment({
      description: "temperature changes reaction rate for a tablet"
    });

    const check = buildConceptMasteryCheck(result, {
      "independent-variable": "tempC",
      "expected-pattern": "expected-pattern",
      "integrity-boundary": "final-claim"
    });

    expect(check.status).toBe("ready");
    expect(check.score).toBe(100);
    expect(check.readyCount).toBe(3);
    expect(check.questions[0].options.find((option) => option.correct)?.label).toBe("Temperature (C)");
    expect(check.questions[2].feedback).toContain("final claim stays student-owned");
  });

  it("marks missed checks for review without changing the scientific result", () => {
    const result = analyzeExperiment({
      description: "enzyme catalase activity at different temperatures"
    });

    const check = buildConceptMasteryCheck(result, {
      "independent-variable": "activity",
      "expected-pattern": "single-row",
      "integrity-boundary": "final-claim"
    });

    expect(check.status).toBe("in_progress");
    expect(check.score).toBe(33);
    expect(check.questions.filter((question) => question.status === "review")).toHaveLength(2);
    expect(check.questions[1].feedback).toContain("expected overlay");
  });
});
