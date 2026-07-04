import { describe, expect, it } from "vitest";
import { analyzeExperiment } from "../src/lib/analysis";

describe("Pre-Lab Design Coach", () => {
  it("turns a supported lab into a pre-collection checklist", () => {
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });

    expect(result.preLabDesignCoach.status).toBe("ready_to_plan");
    expect(result.preLabDesignCoach.summary).toContain("Before data collection");
    expect(result.preLabDesignCoach.variablePlan.independentVariable).toContain("Launch");
    expect(result.preLabDesignCoach.variablePlan.dependentVariable).toContain("Range");
    expect(result.preLabDesignCoach.variablePlan.controlVariables).toContain("launch speed");
    expect(result.preLabDesignCoach.variablePlan.controlVariables).not.toContain("range");
    expect(result.preLabDesignCoach.setupChecks.map((check) => check.id)).toEqual([
      "variables",
      "controls",
      "repeats",
      "table",
      "safety",
      "source-check"
    ]);
    expect(result.preLabDesignCoach.hypothesisStarter).toContain("If");
    expect(result.preLabDesignCoach.judgeTakeaway).toContain("before data collection");
  });

  it("keeps unsupported labs in teacher-review mode", () => {
    const result = analyzeExperiment({
      description: "Bean seedlings under red, blue, and white light for plant growth."
    });

    expect(result.preLabDesignCoach.status).toBe("needs_teacher_review");
    expect(result.preLabDesignCoach.variablePlan.independentVariable).toBe("Light color");
    expect(result.preLabDesignCoach.variablePlan.dependentVariable).toBe("Plant height");
    expect(result.preLabDesignCoach.sourceTask).toContain("plant growth light color");
    expect(result.preLabDesignCoach.studentNextAction).toContain("teacher");
  });
});
