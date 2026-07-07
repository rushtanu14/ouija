import { describe, expect, it } from "vitest";
import { analyzeExperiment } from "../src/lib/analysis";
import { buildEvidencePacket } from "../src/lib/evidencePacket";

describe("buildEvidencePacket", () => {
  it("creates a student-owned packet without writing the final conclusion", () => {
    const result = analyzeExperiment({
      description: "We launched a ball at angles and measured range."
    });

    const packet = buildEvidencePacket(result, result.rows, "We launched a ball at angles and measured range.");

    expect(packet).toContain("# Ouija Evidence Packet: Projectile Motion");
    expect(packet).toContain("## Student Data");
    expect(packet).toContain("## Model Strategy");
    expect(packet).toContain("Top candidates:");
    expect(packet).toContain("## Technical Depth Proof");
    expect(packet).toContain("Beyond simple API use:");
    expect(packet).toContain("Decision trace:");
    expect(packet).toContain("Pattern engine:");
    expect(packet).toContain("## AI Evaluation Harness");
    expect(packet).toContain("Coverage:");
    expect(packet).toContain("Judge signal:");
    expect(packet).toContain("## Data Handling Ledger");
    expect(packet).toContain("Privacy score:");
    expect(packet).toContain("Browser-local saved labs");
    expect(packet).toContain("API key stays server-side");
    expect(packet).toContain("Student control:");
    expect(packet).toContain("## Judge Demo Path");
    expect(packet).toContain("Next best action:");
    expect(packet).toContain("## Pre-Lab Design Coach");
    expect(packet).toContain("Hypothesis starter:");
    expect(packet).toContain("Safety gate:");
    expect(packet).toContain("Setup checks:");
    expect(packet).toContain("## AIYES Rubric Fit");
    expect(packet).toContain("Problem Definition and Real-World Relevance");
    expect(packet).toContain("AI Technical Design and Model Strategy");
    expect(packet).toContain("## Grounding Audit");
    expect(packet).toContain("Student source task:");
    expect(packet).toContain("## Expected Overlay");
    expect(packet).toContain("Row comparison:");
    expect(packet).toContain("## Learning Impact Loop");
    expect(packet).toContain("Student outcome:");
    expect(packet).toContain("Evidence loop:");
    expect(packet).toContain("## Learning Exit Ticket");
    expect(packet).toContain("Exit ticket prompt:");
    expect(packet).toContain("Teacher signal:");
    expect(packet).toContain("## Student Reflection Drafts");
    expect(packet).toContain("No student reflection draft entered yet.");
    expect(packet).toContain("## Student Level Lens");
    expect(packet).toContain("Middle school support");
    expect(packet).toContain("High school support");
    expect(packet).toContain("Graph focus:");
    expect(packet).toContain("## Concept Mastery Check");
    expect(packet).toContain("Variable check");
    expect(packet).toContain("Pattern check");
    expect(packet).toContain("Integrity check");
    expect(packet).toContain("## Pattern Evidence");
    expect(packet).toContain("Pattern score:");
    expect(packet).toContain("## Guided Lab Flow");
    expect(packet).toContain("Current action:");
    expect(packet).toContain("## Concept Coach");
    expect(packet).toContain("Misconception check:");
    expect(packet).toContain("## Safety Coach");
    expect(packet).toContain("Stop condition:");
    expect(packet).toContain("Teacher check:");
    expect(packet).toContain("## Reliability Coach");
    expect(packet).toContain("Repeat groups:");
    expect(packet).toContain("## Sources");
    expect(packet).toContain("## Next Trial Plan");
    expect(packet).toContain("Next measurement:");
    expect(packet).toContain("I can claim that ___");
    expect(packet).toContain("write your own conclusion");
    expect(packet).not.toContain("therefore");
  });

  it("includes warnings when imported or edited data needs review", () => {
    const result = analyzeExperiment({
      description: "temperature changes reaction rate for a tablet",
      rows: [
        { id: "import-1", tempC: 10, reactionTimeS: 50, ratePerS: 0.04 },
        { id: "import-2", tempC: 40, reactionTimeS: 80, ratePerS: 0.01 }
      ]
    });

    const packet = buildEvidencePacket(result, result.rows, "temperature changes reaction rate for a tablet");

    expect(packet).toContain("Rate trend does not match");
    expect(packet).toContain("Pattern score:");
    expect(packet).toContain("AI Evaluation Harness");
    expect(packet).toContain("Method audit:");
    expect(packet).toContain("Learning Exit Ticket");
    expect(packet).toContain("Repeat");
  });

  it("exports custom lab triage for unsupported descriptions", () => {
    const result = analyzeExperiment({
      description: "We compared paper towel brands by measuring how much water each towel absorbed."
    });

    const packet = buildEvidencePacket(result, result.rows, "We compared paper towel brands by measuring how much water each towel absorbed.");

    expect(packet).toContain("## Custom Lab Triage");
    expect(packet).toContain("paper towel absorbency");
    expect(packet).toContain("Variable plan:");
    expect(packet).toContain("Independent variable: Paper towel brand or type");
    expect(packet).toContain("Starter worksheet:");
    expect(packet).toContain("## Pre-Lab Design Coach");
    expect(packet).toContain("Status: needs teacher review");
    expect(packet).toContain("Brand A");
    expect(packet).toContain("What exact condition did you change on purpose?");
    expect(packet).toContain("closest supported");
  });

  it("exports student-authored reflection drafts without filling them in", () => {
    const result = analyzeExperiment({
      description: "temperature changes reaction rate for a tablet"
    });

    const packet = buildEvidencePacket(result, result.rows, "temperature changes reaction rate for a tablet", {
      "variable-check": "The independent variable was water temperature and the dependent variable was reaction rate.",
      "pattern-check": "The graph shows rate increased as the water temperature increased.",
      "next-step-check": "I would repeat the hottest trial while keeping water volume and tablet size the same."
    });

    expect(packet).toContain("## Student Reflection Drafts");
    expect(packet).toContain("Student draft: The independent variable was water temperature");
    expect(packet).toContain("Student draft: The graph shows rate increased");
    expect(packet).toContain("Student draft: I would repeat the hottest trial");
    expect(packet).toContain("Reflection status: ready for review");
    expect(packet).not.toContain("Ouija draft:");
  });
});
