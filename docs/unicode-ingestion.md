# Unicode Ingestion Pipeline

PASTE now includes a build-time Unicode ingestion script that generates large symbol datasets from Unicode character properties.

## Script

- `scripts/unicode-ingest.mjs`
- npm command: `npm run generate:unicode`

## Output structure

Generated files are written to `src/data/generated/`:

- `punctuation.generated.json`
- `arrows.generated.json`
- `math-symbols.generated.json`
- `geometric-shapes.generated.json`
- `box-drawing.generated.json`
- `currency.generated.json`
- `technical-symbols.generated.json`
- `emoji.generated.json`
- `manifest.generated.json` (counts + metadata)

This keeps generated data isolated from manually curated files in `src/data/`.

## Data fields

Each generated entry uses the existing v1 schema-compatible shape used in the app:

- `char`
- `name`
- `codepoints`
- `category` and `primaryCategory`
- `tags`
- `searchKeywords` (keyword search field)
- `script`
- `curatedSets`
- `knowledge.description`
- `knowledge.history`
- `knowledge.externalLinks`

## Curated metadata preservation

When a generated entry matches an existing `src/data/symbols.json` record by `codepoints`, curated metadata is preserved from the curated record (e.g. custom tags, keyword tuning, notes, links, and flags).

## Source modes

The script supports two source modes:

1. **Local Unicode text files (preferred)**
   - Put these files in `scripts/unicode-sources/`:
     - `UnicodeData.txt`
     - `Blocks.txt`
     - `Scripts.txt`
     - `emoji-data.txt`
     - `emoji-test.txt`
   - The script detects all five files and records mode as `local-unicode-text-files` in the manifest.

2. **Python UCD fallback (offline-friendly)**
   - If local files are not present, the script falls back to Python `unicodedata` for name/category extraction and range-based grouping.
   - This mode is recorded as `python-unicodedata-fallback` in the manifest.

## Run

```bash
npm run generate:unicode
```

Then inspect `src/data/generated/manifest.generated.json` for generated counts.
