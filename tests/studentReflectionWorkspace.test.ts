import { describe, expect, it } from "vitest";
import { analyzeExperiment } from "../src/lib/analysis";
import { buildStudentReflectionWorkspace } from "../src/lib/studentReflectionWorkspace";

describe("student reflection workspace", () => {
  it("starts as not ready until the student writes their own exit-ticket answers", () => {
    const result = analyzeExperiment({
      description: "Temperature changes reaction rate for an effervescent tablet."
    });

    const workspace = buildStudentReflectionWorkspace(result.learningExitTicket, {});

    expect(workspace.status).toBe("not_started");
    expect(workspace.readyCount).toBe(0);
    expect(workspace.totalCount).toBe(3);
    expect(workspace.summary).toContain("0 of 3");
    expect(workspace.entries.every((entry) => entry.status === "empty")).toBe(true);
    expect(workspace.nextAction).toContain("Start with");
    expect(workspace.integrityBoundary).toContain("Ouija does not write");
  });

  it("marks short drafts for revision and full student drafts as ready for review", () => {
    const result = analyzeExperiment({
      description: "Temperature changes reaction rate for an effervescent tablet."
    });

    const partial = buildStudentReflectionWorkspace(result.learningExitTicket, {
      "variable-check": "temperature"
    });

    expect(partial.status).toBe("drafting");
    expect(partial.entries[0].status).toBe("too_short");
    expect(partial.entries[0].wordCount).toBe(1);
    expect(partial.nextAction).toContain("add evidence");

    const ready = buildStudentReflectionWorkspace(result.learningExitTicket, {
      "variable-check": "The independent variable was water temperature and the dependent variable was the reaction rate.",
      "pattern-check": "My graph shows the rate went up as the temperature increased, matching the expected pattern.",
      "next-step-check": "I would repeat the warmest trial and keep tablet size and water volume controlled."
    });

    expect(ready.status).toBe("ready_for_review");
    expect(ready.readyCount).toBe(3);
    expect(ready.entries.every((entry) => entry.status === "ready")).toBe(true);
    expect(ready.summary).toContain("3 of 3");
    expect(ready.teacherTakeaway).toContain("student-authored");
  });
});
