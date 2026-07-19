import { describe, expect, it } from "vitest";
import { buildPasteExample, parsePastedTable } from "../src/lib/dataImport";
import type { DataColumn } from "../src/lib/types";

const reactionColumns: DataColumn[] = [
  { key: "tempC", label: "Temperature", unit: "C", numeric: true },
  { key: "reactionTimeS", label: "Reaction time", unit: "s", numeric: true },
  { key: "ratePerS", label: "Rate", unit: "1/s", numeric: true }
];

describe("parsePastedTable", () => {
  it("maps tab-separated spreadsheet rows by header labels", () => {
    const parsed = parsePastedTable(
      "Temperature (C)\tReaction time (s)\tRate (1/s)\n10\t118\t0.008\n22\t74\t0.014",
      reactionColumns
    );

    expect(parsed.usedHeader).toBe(true);
    expect(parsed.rows).toEqual([
      { id: "import-1", tempC: "10", reactionTimeS: "118", ratePerS: "0.008" },
      { id: "import-2", tempC: "22", reactionTimeS: "74", ratePerS: "0.014" }
    ]);
  });

  it("maps rows positionally when headers are omitted", () => {
    const parsed = parsePastedTable("10,118,0.008\n22,74,0.014", reactionColumns);

    expect(parsed.usedHeader).toBe(false);
    expect(parsed.rows[1].ratePerS).toBe("0.014");
  });

  it("uses semicolon delimiters when they dominate the first record", () => {
    const parsed = parsePastedTable("Temperature (C);Reaction time (s);Rate (1/s)\n10;118;0.008", reactionColumns);

    expect(parsed.usedHeader).toBe(true);
    expect(parsed.rows[0]).toEqual({ id: "import-1", tempC: "10", reactionTimeS: "118", ratePerS: "0.008" });
  });

  it("keeps quoted comma cells together", () => {
    const columns: DataColumn[] = [
      { key: "liquid", label: "Liquid", numeric: false },
      { key: "observation", label: "Observation", numeric: false }
    ];

    const parsed = parsePastedTable('Liquid,Observation\n"oil, vegetable","top layer"', columns);

    expect(parsed.rows[0]).toEqual({ id: "import-1", liquid: "oil, vegetable", observation: "top layer" });
  });

  it("keeps quoted multiline cells and escaped quotes in one imported row", () => {
    const columns: DataColumn[] = [
      { key: "sample", label: "Sample", numeric: false },
      { key: "observation", label: "Observation", numeric: false },
      { key: "note", label: "Note", numeric: false }
    ];

    const parsed = parsePastedTable(
      'Sample,Observation,Note\r\nA,"top layer\r\nstill separated","student wrote ""needs repeat"""',
      columns
    );

    expect(parsed.error).toBeUndefined();
    expect(parsed.usedHeader).toBe(true);
    expect(parsed.rows).toEqual([
      {
        id: "import-1",
        sample: "A",
        observation: "top layer\nstill separated",
        note: 'student wrote "needs repeat"'
      }
    ]);
  });

  it("preserves empty fields between delimiters", () => {
    const parsed = parsePastedTable("10,,0.008\n22,74,", reactionColumns);

    expect(parsed.rows).toEqual([
      { id: "import-1", tempC: "10", reactionTimeS: "", ratePerS: "0.008" },
      { id: "import-2", tempC: "22", reactionTimeS: "74", ratePerS: "" }
    ]);
  });

  it("returns a clear error for malformed quoted input", () => {
    const parsed = parsePastedTable('Temperature (C),Reaction time (s)\n"10,118', reactionColumns);

    expect(parsed.rows).toEqual([]);
    expect(parsed.error).toContain("quoted field");
  });

  it("reports quoted fields that start late or have trailing text", () => {
    const lateQuote = parsePastedTable('Temperature (C),Reaction time (s)\n10 "bad",118', reactionColumns);
    const trailingText = parsePastedTable('Temperature (C),Reaction time (s)\n"10"x,118', reactionColumns);

    expect(lateQuote.error).toContain("quotes must start a cell");
    expect(trailingText.error).toContain("text appears after a closing quote");
  });

  it("ignores blank pasted rows", () => {
    const parsed = parsePastedTable("\n\nTemperature (C),Reaction time (s),Rate (1/s)\n\n", reactionColumns);

    expect(parsed.usedHeader).toBe(true);
    expect(parsed.rows).toEqual([]);
    expect(parsed.ignoredRows).toBe(0);
  });

  it("counts ignored records when mapped rows are empty", () => {
    const parsed = parsePastedTable(",,,extra\n10,118,0.008", reactionColumns);

    expect(parsed.rows).toHaveLength(1);
    expect(parsed.ignoredRows).toBe(1);
  });

  it("builds paste examples with formatted unit headers and at most two rows", () => {
    expect(buildPasteExample(reactionColumns, [
      { id: "row-1", tempC: 10, reactionTimeS: 118, ratePerS: 0.008 },
      { id: "row-2", tempC: 22, reactionTimeS: 74, ratePerS: 0.014 },
      { id: "row-3", tempC: 35, reactionTimeS: 42, ratePerS: 0.024 }
    ])).toBe("Temperature (C)\tReaction time (s)\tRate (1/s)\n10\t118\t0.008\n22\t74\t0.014");
  });
});
