import type { AnalyzeRequest, StudentDataRow } from "../src/lib/types.js";

const MAX_DESCRIPTION_LENGTH = 2_000;
const MAX_ROWS = 200;
const MAX_ROW_FIELDS = 32;
const MAX_CELL_LENGTH = 500;

type ValidationResult =
  | { ok: true; value: AnalyzeRequest }
  | { ok: false; error: string };

export function validateAnalyzeRequest(rawBody: unknown): ValidationResult {
  const body = parseBody(rawBody);
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (!description) {
    return { ok: false, error: "Describe the experiment before Ouija analyzes expected results." };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { ok: false, error: "Keep the experiment description to 2,000 characters or fewer." };
  }

  if (body?.rows === undefined) {
    return { ok: true, value: { description } };
  }

  if (!Array.isArray(body.rows)) {
    return { ok: false, error: "Send valid table rows as an array." };
  }

  if (body.rows.length > MAX_ROWS) {
    return { ok: false, error: "Send 200 rows or fewer per analysis." };
  }

  if (!body.rows.every(isValidRow)) {
    return { ok: false, error: "Send valid table rows with bounded text or numeric cells." };
  }

  return { ok: true, value: { description, rows: body.rows as StudentDataRow[] } };
}

function parseBody(rawBody: unknown): Record<string, unknown> | null {
  if (typeof rawBody === "string") {
    try {
      const parsed = JSON.parse(rawBody);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return isRecord(rawBody) ? rawBody : null;
}

function isValidRow(value: unknown): value is StudentDataRow {
  if (!isRecord(value) || typeof value.id !== "string" || !value.id.trim()) return false;
  const entries = Object.entries(value);
  if (entries.length > MAX_ROW_FIELDS) return false;

  return entries.every(([key, cell]) => {
    if (!key || key.length > 100) return false;
    if (typeof cell === "number") return Number.isFinite(cell);
    return typeof cell === "string" && cell.length <= MAX_CELL_LENGTH;
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
