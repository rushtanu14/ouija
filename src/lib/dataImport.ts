import type { DataColumn, StudentDataRow } from "./types";

export interface ParsedPasteData {
  rows: StudentDataRow[];
  usedHeader: boolean;
  ignoredRows: number;
  error?: string;
}

export function parsePastedTable(input: string, columns: DataColumn[]): ParsedPasteData {
  const parsedRecords = parseDelimitedRecords(input);
  if (!parsedRecords.ok) {
    return { rows: [], usedHeader: false, ignoredRows: 0, error: parsedRecords.error };
  }

  const records = parsedRecords.records
    .map((record) => record.map((cell) => cell.trim()))
    .filter((record) => record.some((cell) => cell.length > 0));

  if (records.length === 0) {
    return { rows: [], usedHeader: false, ignoredRows: 0 };
  }

  const headerMap = buildHeaderMap(records[0], columns);
  const usedHeader = headerMap.matched >= Math.max(2, Math.ceil(columns.length / 2));
  const dataRecords = usedHeader ? records.slice(1) : records;

  const rows = dataRecords
    .map((record, index): StudentDataRow => {
      const mapped = columns.reduce<Record<string, string>>((acc, column, columnIndex) => {
        const sourceIndex = usedHeader ? headerMap.indexes[column.key] : columnIndex;
        acc[column.key] = sourceIndex === undefined ? "" : (record[sourceIndex] ?? "");
        return acc;
      }, {});

      return {
        id: `import-${index + 1}`,
        ...mapped
      };
    })
    .filter((row) => columns.some((column) => String(row[column.key] ?? "").trim().length > 0));

  return {
    rows,
    usedHeader,
    ignoredRows: dataRecords.length - rows.length
  };
}

export function buildPasteExample(columns: DataColumn[], rows: StudentDataRow[]): string {
  const header = columns.map((column) => formatColumnHeader(column)).join("\t");
  const exampleRows = rows
    .slice(0, 2)
    .map((row) => columns.map((column) => String(row[column.key] ?? "")).join("\t"))
    .join("\n");

  return `${header}\n${exampleRows}`;
}

type ParsedDelimitedRecords = { ok: true; records: string[][] } | { ok: false; error: string };

function parseDelimitedRecords(input: string): ParsedDelimitedRecords {
  const delimiter = detectDelimiter(input);
  const records: string[][] = [];
  let record: string[] = [];
  let cell = "";
  let quoted = false;
  let quoteClosed = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const nextCharacter = input[index + 1];

    if (quoted) {
      if (character === '"' && nextCharacter === '"') {
        cell += '"';
        index += 1;
        continue;
      }

      if (character === '"') {
        quoted = false;
        quoteClosed = true;
        continue;
      }

      if (character === "\r") {
        cell += "\n";
        if (nextCharacter === "\n") index += 1;
        continue;
      }

      cell += character;
      continue;
    }

    if (quoteClosed) {
      if (character === delimiter) {
        record.push(cell);
        cell = "";
        quoteClosed = false;
        continue;
      }

      if (character === "\n" || character === "\r") {
        record.push(cell);
        records.push(record);
        record = [];
        cell = "";
        quoteClosed = false;
        if (character === "\r" && nextCharacter === "\n") index += 1;
        continue;
      }

      if (character.trim() === "") continue;

      return {
        ok: false,
        error: `Malformed quoted field near character ${index + 1}: text appears after a closing quote.`
      };
    }

    if (character === '"') {
      if (cell.trim().length > 0) {
        return {
          ok: false,
          error: `Malformed quoted field near character ${index + 1}: quotes must start a cell.`
        };
      }
      quoted = true;
      cell = "";
      continue;
    }

    if (character === delimiter) {
      record.push(cell);
      cell = "";
      continue;
    }

    if (character === "\n" || character === "\r") {
      record.push(cell);
      records.push(record);
      record = [];
      cell = "";
      if (character === "\r" && nextCharacter === "\n") index += 1;
      continue;
    }

    cell += character;
  }

  if (quoted) {
    return {
      ok: false,
      error: "Malformed quoted field: the pasted data ends before the closing quote."
    };
  }

  record.push(cell);
  records.push(record);
  return { ok: true, records };
}

function detectDelimiter(input: string): "," | "\t" | ";" {
  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const firstRecord = readFirstRecord(normalized);
  const tabCount = countTopLevelOccurrences(firstRecord, "\t");
  const commaCount = countTopLevelOccurrences(firstRecord, ",");
  const semicolonCount = countTopLevelOccurrences(firstRecord, ";");

  if (tabCount >= commaCount && tabCount >= semicolonCount && tabCount > 0) return "\t";
  if (semicolonCount > commaCount && semicolonCount > 0) return ";";
  return ",";
}

function readFirstRecord(input: string) {
  let quoted = false;
  let record = "";

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (character === '"' && quoted && input[index + 1] === '"') {
      record += character;
      index += 1;
      continue;
    }

    if (character === '"') {
      quoted = !quoted;
      record += character;
      continue;
    }

    if (character === "\n" && !quoted) return record;

    record += character;
  }

  return record;
}

function buildHeaderMap(header: string[], columns: DataColumn[]) {
  const indexes: Record<string, number> = {};
  let matched = 0;

  columns.forEach((column) => {
    const acceptedNames = [column.key, column.label, formatColumnHeader(column)].map(normalizeHeader);
    const index = header.findIndex((cell) => acceptedNames.includes(normalizeHeader(cell)));

    if (index >= 0) {
      indexes[column.key] = index;
      matched += 1;
    }
  });

  return { indexes, matched };
}

function formatColumnHeader(column: DataColumn): string {
  return column.unit ? `${column.label} (${column.unit})` : column.label;
}

function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function countTopLevelOccurrences(input: string, value: string): number {
  let quoted = false;
  let count = 0;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (character === '"' && quoted && input[index + 1] === '"') {
      index += 1;
      continue;
    }

    if (character === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && character === value) count += 1;
  }

  return count;
}
