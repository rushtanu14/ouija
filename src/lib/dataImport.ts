import type { DataColumn, StudentDataRow } from "./types";

export interface ParsedPasteData {
  rows: StudentDataRow[];
  usedHeader: boolean;
  ignoredRows: number;
}

export function parsePastedTable(input: string, columns: DataColumn[]): ParsedPasteData {
  const records = parseDelimitedRecords(input)
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

function parseDelimitedRecords(input: string): string[][] {
  const delimiter = detectDelimiter(input);
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => parseDelimitedLine(line, delimiter));
}

function detectDelimiter(input: string): "," | "\t" | ";" {
  const tabCount = countOccurrences(input, "\t");
  const commaCount = countOccurrences(input, ",");
  const semicolonCount = countOccurrences(input, ";");

  if (tabCount >= commaCount && tabCount >= semicolonCount && tabCount > 0) return "\t";
  if (semicolonCount > commaCount && semicolonCount > 0) return ";";
  return ",";
}

function parseDelimitedLine(line: string, delimiter: "," | "\t" | ";"): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      quoted = !quoted;
      continue;
    }

    if (character === delimiter && !quoted) {
      cells.push(current);
      current = "";
      continue;
    }

    current += character;
  }

  cells.push(current);
  return cells;
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

function countOccurrences(input: string, value: string): number {
  return input.split(value).length - 1;
}
