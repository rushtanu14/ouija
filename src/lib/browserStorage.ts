export type StorageResult<T> = { ok: true; value: T } | { ok: false; error: string };

export interface BrowserStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function readStorageList<T>(
  storage: BrowserStorageLike | null | undefined,
  key: string,
  normalizeItem: (value: unknown) => T | null
): StorageResult<T[]> {
  if (!storage) {
    return {
      ok: false,
      error: "Browser storage is unavailable. The app will keep working without loading saved entries."
    };
  }

  try {
    const raw = storage.getItem(key);
    if (!raw) return { ok: true, value: [] };

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return {
        ok: false,
        error: "Saved browser data had an unexpected shape and was ignored."
      };
    }

    return {
      ok: true,
      value: parsed.map(normalizeItem).filter((item): item is T => item !== null)
    };
  } catch {
    return {
      ok: false,
      error: "Unable to read saved browser data. The app will keep working without loading saved entries."
    };
  }
}

export function readStorageValue<T>(
  storage: BrowserStorageLike | null | undefined,
  key: string,
  normalizeValue: (value: unknown) => T
): StorageResult<T | null> {
  if (!storage) {
    return {
      ok: false,
      error: "Browser storage is unavailable. The app will keep working without loading saved entries."
    };
  }

  try {
    const raw = storage.getItem(key);
    if (!raw) return { ok: true, value: null };

    return {
      ok: true,
      value: normalizeValue(JSON.parse(raw))
    };
  } catch {
    return {
      ok: false,
      error: "Unable to read saved browser data. The app will keep working without loading saved entries."
    };
  }
}

export function writeStorageValue(storage: BrowserStorageLike | null | undefined, key: string, value: unknown): StorageResult<null> {
  if (!storage) return { ok: true, value: null };

  try {
    storage.setItem(key, JSON.stringify(value));
    return { ok: true, value: null };
  } catch {
    return {
      ok: false,
      error: "Unable to save browser data. Your current work remains visible, but it may not persist after refresh."
    };
  }
}
