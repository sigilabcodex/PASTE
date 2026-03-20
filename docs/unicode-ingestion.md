# Unicode Ingestion Pipeline

PASTE now uses a staged Unicode ingestion pipeline that is designed for incremental expansion instead of one oversized generation step.

## Command

```bash
npm run generate:unicode
```

This runs `scripts/unicode-ingest.mjs`.

## Goals of the staged generator

- keep generated files small and reviewable,
- prove the file-driven ingestion path before full Unicode import,
- emit deterministic JSON shards for future expansion,
- separate ingestion infrastructure from app-curated source data.

## Current output structure

Generated files are written to `data/generated/`:

- `arrows.json`
- `math.json`
- `currency.json`
- `shapes.json`
- `punctuation.json`
- `emoji-core.json`
- `latin-extended.json`
- `greek.json`
- `cyrillic.json`
- `manifest.json`

Only `arrows.json` and `math.json` currently contain sample entries. The other files are intentionally emitted as empty arrays so the folder layout is stable for future staged expansion.

## Current schema shape

Each generated record includes the staged compatibility fields requested for ingestion work:

- `char`
- `name`
- `codepoints`
- `category`
- `tags`
- `keywords`
- `script`

For compatibility with the current app search field, generated sample records also include `searchKeywords` as an alias of `keywords`.

## Source modes

### 1. Official Unicode text files

If present, the generator reads these files from `scripts/unicode-sources/`:

- `UnicodeData.txt`
- `emoji-data.txt`

### 2. Bundled sample files

If the official files are not present, the generator falls back to tiny sample files in `scripts/unicode-sources/sample/`.

This keeps the repo lightweight while still exercising the parsing and transformation pipeline.

## Implementation structure

- `scripts/unicode-ingest.mjs` – entry point, source resolution, manifest writing.
- `scripts/unicode-ingest/config.mjs` – category shard definitions and sample limits.
- `scripts/unicode-ingest/parsers.mjs` – plain-text Unicode and emoji file parsers.
- `scripts/unicode-ingest/transformers.mjs` – mapping into the staged PASTE dataset shape.
- `scripts/unicode-ingest/writer.mjs` – deterministic JSON output writer.

## How to expand later

1. Replace the bundled sample source files with official Unicode text files in `scripts/unicode-sources/`.
2. Add new category ranges and output mappings in `scripts/unicode-ingest/config.mjs`.
3. Introduce category-specific keyword enrichment in `KEYWORD_HINTS` if needed.
4. Raise `sampleLimit` values gradually so each expansion stays reviewable.
5. When the app is ready to consume generated shards directly, wire `data/generated/` into the runtime data loading path.

## Determinism guarantees

The generator keeps output deterministic by:

- sorting records by code point,
- applying fixed sample limits,
- using stable pretty-printed JSON,
- generating the full shard file set on every run.
