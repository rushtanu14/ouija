import { describe, expect, it, vi } from "vitest";
import { readStorageList, readStorageValue, writeStorageValue } from "../src/lib/browserStorage";

interface FakeEntry {
  id: string;
  label: string;
}

describe("browser storage helpers", () => {
  it("returns unavailable errors when read storage is missing", () => {
    expect(readStorageList(null, "ouija:test", normalizeEntry)).toMatchObject({
      ok: false,
      error: expect.stringContaining("Browser storage is unavailable")
    });
    expect(readStorageValue(undefined, "ouija:test", (value) => value)).toMatchObject({
      ok: false,
      error: expect.stringContaining("Browser storage is unavailable")
    });
  });

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

  it("rejects saved lists with an unexpected persisted shape", () => {
    const storage = {
      getItem: vi.fn(() => JSON.stringify({ id: "not-a-list" })),
      setItem: vi.fn()
    };

    const result = readStorageList(storage, "ouija:test", normalizeEntry);

    expect(result).toMatchObject({
      ok: false,
      error: expect.stringContaining("unexpected shape")
    });
  });

  it("returns null for missing singleton storage so callers can construct defaults", () => {
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn()
    };

    const result = readStorageValue(storage, "ouija:test", (value) => value);

    expect(result).toEqual({ ok: true, value: null });
  });

  it("normalizes singleton values and reports parse failures", () => {
    const validStorage = {
      getItem: vi.fn(() => JSON.stringify({ id: "a", label: "Saved" })),
      setItem: vi.fn()
    };
    const invalidStorage = {
      getItem: vi.fn(() => "{not json"),
      setItem: vi.fn()
    };

    expect(readStorageValue(validStorage, "ouija:test", normalizeEntry)).toEqual({
      ok: true,
      value: { id: "a", label: "Saved" }
    });
    expect(readStorageValue(invalidStorage, "ouija:test", normalizeEntry)).toMatchObject({
      ok: false,
      error: expect.stringContaining("Unable to read saved browser data")
    });
  });

  it("treats missing write storage as a no-op so the app keeps running", () => {
    expect(writeStorageValue(null, "ouija:test", { id: "a" })).toEqual({ ok: true, value: null });
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
