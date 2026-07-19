# Task 1 Report: Data Provenance and Evidence Gates

## Result

DONE

## Implementation

- Added `DataOrigin` and `SavedDataOrigin` types.
- Added `AnalyzeResult.dataOrigin` and `ProgressPortfolioSnapshot.dataOrigin`.
- Made `analyzeExperiment` mark omitted or empty rows as `demo_sample`, and non-empty supplied rows as `student_supplied`.
- Made `refreshResultForRows` preserve the same non-empty row rule.
- Added demo and student provenance labels to Evidence Packet output.
- Excluded `demo_sample` and `legacy_unknown` snapshots from Progress Portfolio readiness, metrics, milestones, and story prompts.
- Normalized older saved-lab storage records without provenance to `legacy_unknown`.
- Added UI demo banners and disabled save, pilot evidence export/editing, Evidence Packet copy, and MCP copy/validation until rows are `student_supplied`.
- Updated MCP integration test fixtures so saved runs explicitly declare `student_supplied` provenance.

## RED

- Added failing tests for demo vs student origin calculation in `tests/analysis.test.ts`.
- Added failing Evidence Packet provenance-label tests in `tests/evidencePacket.test.ts`.
- Added failing Progress Portfolio exclusion test for demo and legacy snapshots in `tests/progressPortfolio.test.ts`.
- Initial focused run failed as expected with missing `dataOrigin` and portfolio readiness still counting excluded snapshots.

## GREEN

- Focused suites pass: `npm test -- --run tests/analysis.test.ts tests/evidencePacket.test.ts tests/progressPortfolio.test.ts`
- Full unit suite passes: `npm test`
- Build passes: `npm run build`
- Whitespace check passes: `git diff --check`

## REFACTOR

- Centralized saved-lab origin normalization in `loadSavedLabs`.
- Reused one `studentEvidenceReady` UI flag for outbound gates.
- Tightened `refreshResultForRows` so an empty refreshed row array cannot unlock student evidence.

## Concerns

- `npm run build` still emits the existing Vite large chunk warning for the bundled app output; build exits successfully.
