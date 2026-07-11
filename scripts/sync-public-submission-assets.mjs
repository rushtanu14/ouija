import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicSubmissionDir = resolve(repoRoot, "public", "submission");
const publicAssetDir = resolve(publicSubmissionDir, "assets");

const copies = [
  ["docs/submission-hub.html", "public/submission/index.html"],
  ["docs/aiyes-slide-deck.html", "public/submission/slide-deck.html"],
  ["docs/assets/ouija-walkthrough.webm", "public/submission/assets/ouija-walkthrough.webm"],
  ["docs/assets/ouija-demo-desktop.png", "public/submission/assets/ouija-demo-desktop.png"],
  ["docs/assets/ouija-demo-mobile.png", "public/submission/assets/ouija-demo-mobile.png"],
  ["docs/assets/ouija-custom-triage.png", "public/submission/assets/ouija-custom-triage.png"],
  ["docs/assets/ouija-warning-state.png", "public/submission/assets/ouija-warning-state.png"]
];

mkdirSync(publicAssetDir, { recursive: true });

for (const [source, target] of copies) {
  const sourcePath = resolve(repoRoot, source);
  const targetPath = resolve(repoRoot, target);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing submission asset: ${source}`);
  }

  copyFileSync(sourcePath, targetPath);
}

const videoPath = resolve(repoRoot, "public/submission/assets/ouija-walkthrough.webm");
const videoSize = statSync(videoPath).size;

if (videoSize < 100_000) {
  throw new Error("Walkthrough video asset is unexpectedly small.");
}

console.log(`Submission assets synced to ${publicSubmissionDir}`);
