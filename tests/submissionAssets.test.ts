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
    expect(deck).toContain("Student/Judge views");
    expect(deck).toContain("?judge=1");
    expect(deck).toContain("Student Focus");
    expect(deck).toContain("Composio Search source-audit");
    expect(deck).toContain("Scholar claim-check");
    expect(deck).toContain("Semantic Scholar reference-check");
    expect(deck).toContain("Composio Browser source-capture");
    expect(deck).toContain("Canvas assignment-context");
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
    const hub = read("docs/submission-hub.html");
    const pack = read("docs/devpost-submission-pack.html");

    expect(copy).toContain("Project Title");
    expect(copy).toContain("Ouija");
    expect(copy).toContain("Built With");
    expect(copy).toContain("Progress Portfolio");
    expect(copy).toContain("Portfolio Story Builder");
    expect(copy).toContain("Student Reflection Workspace");
    expect(copy).toContain("Student/Judge views");
    expect(copy).toContain("?judge=1");
    expect(copy).toContain("Student Focus");
    expect(copy).toContain("Submission Hub");
    expect(copy).toContain("Concept Mastery Check");
    expect(copy).toContain("Pre-Lab Design Coach");
    expect(copy).toContain("MCP Integration Coach");
    expect(copy).toContain("/api/mcp/session");
    expect(copy).toContain("Composio Search source audit");
    expect(copy).toContain("Composio Scholar claim check");
    expect(copy).toContain("Semantic Scholar reference check");
    expect(copy).toContain("Composio Browser source capture");
    expect(copy).toContain("DeepWiki public-source proof");
    expect(copy).toContain("Canvas assignment-context");
    expect(copy).toContain("AIYES Values Fit");
    expect(copy).toContain("AIYES Development Journey");
    expect(copy).toContain("Technical Depth Proof");
    expect(copy).toContain("Google Classroom");
    expect(assets).toContain("Progress Portfolio");
    expect(assets).toContain("Portfolio Story Builder");
    expect(assets).toContain("Submission hub");
    expect(assets).toContain("Devpost pack");
    expect(assets).toContain("Concept Mastery Check");
    expect(assets).toContain("npm run capture:submission");
    expect(assets).toContain("npm run record:walkthrough");
    expect(assets).toContain("npm run sync:public-submission");
    expect(copy).toContain("https://ouija-olive.vercel.app/submission/slide-deck.html");
    expect(copy).toContain("https://ouija-olive.vercel.app/submission/");
    expect(copy).toContain("https://ouija-olive.vercel.app/submission/devpost-pack.html");
    expect(copy).toContain("https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm");
    expect(copy).toContain("https://github.com/rushtanu14/ouija");
    expect(assets).toContain("https://github.com/rushtanu14/ouija");
    expect(assets).toContain("https://ouija-olive.vercel.app/submission/");
    expect(assets).toContain("https://ouija-olive.vercel.app/submission/devpost-pack.html");
    expect(assets).toContain("ouija-walkthrough.webm");
    expect(hub).toContain("AIYES Track 1 Submission Hub");
    expect(hub).toContain("https://ouija-olive.vercel.app/?judge=1");
    expect(hub).toContain("/submission/devpost-pack.html");
    expect(hub).toContain("/submission/slide-deck.html");
    expect(hub).toContain("/submission/assets/ouija-walkthrough.webm");
    expect(hub).toContain("https://github.com/rushtanu14/ouija");
    expect(hub).toContain("/api/evaluate");
    expect(hub).toContain("/api/runtime-proof");
    expect(hub).toContain("/api/mcp/status");
    expect(hub).toContain("13 routes");
    expect(pack).toContain("Devpost Submission Pack");
    expect(pack).toContain("DeepWiki public repo audit");
    expect(pack).toContain("Canvas read-only import");
    expect(pack).toContain("Team Roster Worksheet");
    expect(pack).toContain("https://ouija-olive.vercel.app/?judge=1");
    expect(`${copy}\n${assets}\n${hub}\n${pack}`).not.toMatch(/TODO|TBD|placeholder|use the repository URL|use the final recorded/i);
    expect(`${copy}\n${assets}\n${hub}\n${pack}`).not.toMatch(/upload the walkthrough video|finalize the video walkthrough URL/i);
  });

  it("syncs public submission links for hosted Devpost materials", () => {
    expect(existsSync("public/submission/index.html")).toBe(true);
    expect(existsSync("public/submission/devpost-pack.html")).toBe(true);
    expect(existsSync("public/submission/slide-deck.html")).toBe(true);
    expect(existsSync("public/submission/assets/ouija-walkthrough.webm")).toBe(true);
    expect(read("public/submission/index.html")).toContain("AIYES Track 1 Submission Hub");
    expect(read("public/submission/devpost-pack.html")).toContain("Devpost Submission Pack");
    expect(statSync("public/submission/assets/ouija-walkthrough.webm").size).toBeGreaterThan(100_000);
  });
});
