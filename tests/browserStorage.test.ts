import { describe, expect, it, vi } from "vitest";
import { readStorageList, writeStorageValue } from "../src/lib/browserStorage";

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

    const result = readStorageList(storage, "ouija:test", normalizeEntry, []);

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected blocked storage read to fail.");
    expect(result.value).toEqual([]);
    expect(result.error).toContain("Unable to read saved browser data");
  });

  it("filters invalid saved records through the provided schema normalizer", () => {
    const storage = {
      getItem: vi.fn(() => JSON.stringify([{ id: "a", label: "Saved" }, { id: 7, label: "Broken" }])),
      setItem: vi.fn()
    };

    const result = readStorageList(storage, "ouija:test", normalizeEntry, []);

    expect(result.ok).toBe(true);
    expect(result.value).toEqual([{ id: "a", label: "Saved" }]);
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
