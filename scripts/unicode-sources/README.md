# Unicode source files

The staged Unicode generator reads plain-text Unicode data files from `scripts/unicode-sources/`.

## Supported inputs today

- `UnicodeData.txt` for UCD character records.
- `emoji-data.txt` for emoji property ranges.

## Bundled sample mode

This repository includes tiny seed files in `scripts/unicode-sources/sample/` so `npm run generate:unicode` works without downloading the full Unicode Character Database.

The sample mode is intentionally small and currently only emits non-empty dataset shards for:

- `arrows.json`
- `math.json`

All other generated category files are created as empty arrays until larger staged ingestion is enabled.

## Expanding later

When you are ready to expand ingestion:

1. Copy official Unicode text files into `scripts/unicode-sources/`.
2. Add new category rules in `scripts/unicode-ingest/config.mjs`.
3. Extend the parsers and transformers as needed.
4. Raise sample limits gradually to keep commits reviewable.
