import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string) {
  return readFileSync(path, "utf8");
}

describe("AIYES submission assets", () => {
  it("includes a complete slide deck outline for the required presentation", () => {
    const deck = read("docs/aiyes-slide-deck.html");

    for (const section of [
      "Problem",
      "Solution",
      "AI Architecture",
      "Runtime Proof",
      "Technical Depth",
      "Academic Integrity",
      "Demo Flow",
      "Verification"
    ]) {
      expect(deck).toContain(section);
    }

    expect(deck).toContain("/api/runtime-proof");
    expect(deck).toContain("/api/mcp/session");
    expect(deck).toContain("Composio Search source-audit");
    expect(deck).toContain("Scholar claim-check");
    expect(deck).toContain("AIYES Values Fit");
    expect(deck).toContain("AIYES Development Journey");
    expect(deck).toContain("Technical Depth Proof");
    expect(deck).toContain("Concept Mastery Check");
    expect(deck).toContain("plant growth vs light color");
    expect(deck).not.toMatch(/TODO|TBD|placeholder/i);
  });

  it("includes Devpost-ready copy and asset instructions", () => {
    const copy = read("docs/devpost-submission-copy.md");
    const assets = read("docs/submission-assets.md");

    expect(copy).toContain("Project Title");
    expect(copy).toContain("Ouija");
    expect(copy).toContain("Built With");
    expect(copy).toContain("Progress Portfolio");
    expect(copy).toContain("Portfolio Story Builder");
    expect(copy).toContain("Student Reflection Workspace");
    expect(copy).toContain("Concept Mastery Check");
    expect(copy).toContain("Pre-Lab Design Coach");
    expect(copy).toContain("MCP Integration Coach");
    expect(copy).toContain("/api/mcp/session");
    expect(copy).toContain("Composio Search source audit");
    expect(copy).toContain("Composio Scholar claim check");
    expect(copy).toContain("AIYES Values Fit");
    expect(copy).toContain("AIYES Development Journey");
    expect(copy).toContain("Technical Depth Proof");
    expect(copy).toContain("Google Classroom");
    expect(assets).toContain("Progress Portfolio");
    expect(assets).toContain("Portfolio Story Builder");
    expect(assets).toContain("Concept Mastery Check");
    expect(assets).toContain("npm run capture:submission");
    expect(assets).toContain("npm run record:walkthrough");
    expect(assets).toContain("npm run sync:public-submission");
    expect(copy).toContain("https://ouija-olive.vercel.app/submission/slide-deck.html");
    expect(copy).toContain("https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm");
    expect(copy).toContain("https://github.com/rushtanu14/ouija");
    expect(assets).toContain("https://github.com/rushtanu14/ouija");
    expect(assets).toContain("ouija-walkthrough.webm");
    expect(`${copy}\n${assets}`).not.toMatch(/TODO|TBD|placeholder|use the repository URL|use the final recorded/i);
    expect(`${copy}\n${assets}`).not.toMatch(/upload the walkthrough video|finalize the video walkthrough URL/i);
  });

  it("syncs public submission links for hosted Devpost materials", () => {
    expect(existsSync("public/submission/slide-deck.html")).toBe(true);
    expect(existsSync("public/submission/assets/ouija-walkthrough.webm")).toBe(true);
    expect(statSync("public/submission/assets/ouija-walkthrough.webm").size).toBeGreaterThan(100_000);
  });
});
