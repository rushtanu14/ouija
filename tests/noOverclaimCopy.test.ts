import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

interface ClaimRule {
  category: string;
  pattern: RegExp;
}

interface ClaimHit {
  file: string;
  line: number;
  phrase: string;
  category: string;
}

const scannedRoots = [
  { path: "README.md", recursive: false },
  { path: "docs", recursive: true },
  { path: "public/submission", recursive: true },
  { path: "src", recursive: true }
];

const scannedExtensions = new Set([".css", ".html", ".md", ".ts", ".tsx"]);

const ignoredPathParts = new Set(["node_modules", ".git", "dist", "assets"]);

const prohibitedClaimRules: ClaimRule[] = [
  {
    category: "diagnostic or clinical claim",
    pattern: /\b(?:diagnosis|diagnoses|diagnostic|clinical(?:ly)?|medical(?:ly)?|cure(?:s|d)?|patient(?:s)?)\b/gi
  },
  {
    category: "forensic claim",
    pattern: /\bforensic(?:-grade|ally)?\b/gi
  },
  {
    category: "guaranteed award claim",
    pattern: /\b(?:guaranteed|guarantees?|will\s+win|certain\s+to\s+win|sure\s+to\s+win|locks?\s+(?:in|up))\b.{0,80}\b(?:gold|award|win|winner|prize|first\s+place)\b/gi
  },
  {
    category: "completed pilot or user-testing claim",
    pattern: /\b(?:completed|finished|validated|proven|confirmed)\b.{0,80}\b(?:student\s+testing|user\s+testing|pilot(?:\s+study|\s+observations?)?|classroom\s+pilot|student\s+pilot)\b/gi
  },
  {
    category: "final lab report claim",
    pattern: /\b(?:writes?|generates?|creates?|completes?|finishes?|produces?)\b.{0,80}\b(?:final\s+)?lab\s+report\b/gi
  },
  {
    category: "stale pilot export privacy copy",
    pattern: /\b(?:direct-contact redaction|automatic direct-contact redaction|csv-ready,\s+redacted handoff|emails and phone-like strings are redacted automatically|non-identifying observer notes|non-identifying note)\b/gi
  },
  {
    category: "stale external grounding gate copy",
    pattern: /\b(?:OpenAI web search can enrich citations server-side when configured|When\s+`OPENAI_API_KEY`\s+is configured|optional web-search grounding)\b/gi
  }
];

function walkScannedFiles(): string[] {
  const files: string[] = [];

  function walk(path: string, recursive: boolean) {
    if (!existsSync(path)) return;

    const stats = statSync(path);
    if (stats.isFile()) {
      if (isScannable(path)) files.push(path);
      return;
    }

    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (ignoredPathParts.has(entry.name)) continue;

      const entryPath = join(path, entry.name);
      if (entry.isDirectory()) {
        if (recursive) walk(entryPath, recursive);
      } else if (entry.isFile() && isScannable(entryPath)) {
        files.push(entryPath);
      }
    }
  }

  for (const root of scannedRoots) {
    walk(root.path, root.recursive);
  }

  return Array.from(new Set(files)).sort();
}

function isScannable(path: string): boolean {
  return Array.from(scannedExtensions).some((extension) => path.endsWith(extension));
}

function findOverclaimHits(file: string, content: string): ClaimHit[] {
  const hits: ClaimHit[] = [];

  for (const rule of prohibitedClaimRules) {
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    for (const match of content.matchAll(pattern)) {
      const phrase = match[0].trim().replace(/\s+/g, " ");
      const lineStart = content.lastIndexOf("\n", match.index) + 1;
      const lineEnd = content.indexOf("\n", match.index);
      const lineText = content.slice(lineStart, lineEnd === -1 ? content.length : lineEnd);
      const contextText = content.slice(Math.max(0, match.index - 160), Math.min(content.length, match.index + match[0].length + 80));
      if (isAllowedBoundaryLanguage(rule.category, lineText, contextText, phrase)) continue;

      const line = content.slice(0, match.index).split("\n").length;
      hits.push({ file: relative(process.cwd(), file), line, phrase, category: rule.category });
    }
  }

  return hits;
}

function isAllowedBoundaryLanguage(category: string, lineText: string, contextText: string, phrase: string): boolean {
  const normalizedLine = lineText.toLowerCase();
  const normalizedContext = contextText.toLowerCase().replace(/\s+/g, " ");
  const normalizedPhrase = phrase.toLowerCase();

  if (category === "guaranteed award claim") {
    return hasBoundaryQualifier(normalizedContext, normalizedPhrase, ["not", "does not", "no ", "without", "instead of promising"]);
  }

  if (category === "completed pilot or user-testing claim") {
    return hasBoundaryQualifier(normalizedContext, normalizedPhrase, [
      "do not claim",
      "not to claim",
      "before claiming",
      "before the team can claim",
      "without claiming",
      "without letting the team claim",
      "prevents fake"
    ]);
  }

  if (category === "final lab report claim") {
    if (normalizedPhrase.includes("does not") || normalizedPhrase.includes("will not")) return true;
    if (normalizedLine.includes("asksforreport") || normalizedLine.includes("\"write my lab report\"")) return true;
    return hasBoundaryQualifier(normalizedContext, normalizedPhrase, ["not", "does not", "will not", "without", "instead of", "prevents"]);
  }

  return false;
}

function hasBoundaryQualifier(lineText: string, phrase: string, qualifiers: string[]): boolean {
  const phraseIndex = lineText.indexOf(phrase);
  if (phraseIndex === -1) return false;

  const prefix = lineText.slice(Math.max(0, phraseIndex - 120), phraseIndex);
  return qualifiers.some((qualifier) => prefix.includes(qualifier));
}

describe("repo-wide no-overclaim copy scanner", () => {
  it("keeps public and user-facing copy inside the student-experiment evidence boundary", () => {
    const hits = walkScannedFiles().flatMap((file) => findOverclaimHits(file, readFileSync(file, "utf8")));

    expect(hits, JSON.stringify(hits, null, 2)).toEqual([]);
  });
});
