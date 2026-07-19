import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const assetPaths = [
  "docs/assets/ouija-custom-triage.png",
  "docs/assets/ouija-demo-desktop.png",
  "docs/assets/ouija-demo-mobile.png",
  "docs/assets/ouija-walkthrough.webm",
  "docs/assets/ouija-warning-state.png"
];

const manifestPath = "docs/assets/asset-manifest.json";

const manifest = {
  version: 1,
  assets: assetPaths.map((relativePath) => {
    if (!existsSync(relativePath)) {
      throw new Error(`Missing asset: ${relativePath}`);
    }

    const bytes = readFileSync(relativePath);
    const entry = {
      relativePath,
      bytes: statSync(relativePath).size,
      sha256: createHash("sha256").update(bytes).digest("hex")
    };

    if (relativePath.endsWith(".png")) {
      return {
        ...entry,
        ...pngDimensions(bytes)
      };
    }

    if (relativePath.endsWith(".webm")) {
      return {
        ...entry,
        ...videoMetadata(relativePath)
      };
    }

    return entry;
  })
};

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Asset manifest written to ${manifestPath}`);

function pngDimensions(bytes) {
  if (bytes.toString("ascii", 1, 4) !== "PNG") {
    throw new Error("PNG signature was not found.");
  }

  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20)
  };
}

function videoMetadata(path) {
  try {
    const output = execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height:format=duration",
        "-of",
        "json",
        path
      ],
      { encoding: "utf8" }
    );
    const parsed = JSON.parse(output);
    const width = parsed.streams?.[0]?.width;
    const height = parsed.streams?.[0]?.height;
    const durationSeconds = Number(parsed.format?.duration);

    if (!Number.isFinite(width) || !Number.isFinite(height) || !Number.isFinite(durationSeconds)) {
      throw new Error("ffprobe returned incomplete video metadata.");
    }

    return {
      width,
      height,
      durationSeconds: Number(durationSeconds.toFixed(2))
    };
  } catch (error) {
    throw new Error(`ffprobe is required to generate video metadata for ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
