import { describe, expect, it, vi } from "vitest";
import { readStorageList, readStorageValue, writeStorageValue } from "../src/lib/browserStorage";

interface FakeEntry {
  id: string;
  label: string;
}

describe("browser storage helpers", () => {
  it("returns a storage result instead of throwing when reads are blocked", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new DOMException("Blocked", "SecurityError");
      }),
      setItem: vi.fn()
    };

    const result = readStorageList(storage, "ouija:test", normalizeEntry);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected blocked storage read to fail.");
    expect(result).not.toHaveProperty("value");
    expect(result.error).toContain("Unable to read saved browser data");
  });

  it("filters invalid saved records through the provided schema normalizer", () => {
    const storage = {
      getItem: vi.fn(() => JSON.stringify([{ id: "a", label: "Saved" }, { id: 7, label: "Broken" }])),
      setItem: vi.fn()
    };

    const result = readStorageList(storage, "ouija:test", normalizeEntry);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected storage read to succeed.");
    expect(result.value).toEqual([{ id: "a", label: "Saved" }]);
  });

  it("returns an empty successful list when no saved entry exists", () => {
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn()
    };

    const result = readStorageList(storage, "ouija:test", normalizeEntry);

    expect(result).toEqual({ ok: true, value: [] });
  });

  it("returns null for missing singleton storage so callers can construct defaults", () => {
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn()
    };

    const result = readStorageValue(storage, "ouija:test", (value) => value);

    expect(result).toEqual({ ok: true, value: null });
  });

  it("returns a storage result instead of throwing when quota writes fail", () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      })
    };

    const result = writeStorageValue(storage, "ouija:test", [{ id: "a", label: "Saved" }]);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected blocked storage write to fail.");
    expect(result).not.toHaveProperty("value");
    expect(result.error).toContain("Unable to save browser data");
  });
});

function normalizeEntry(value: unknown): FakeEntry | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<FakeEntry>;
  return typeof record.id === "string" && typeof record.label === "string"
    ? { id: record.id, label: record.label }
    : null;
}
