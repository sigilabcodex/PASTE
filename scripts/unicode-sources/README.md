# Unicode source files

Optional: place official Unicode text files in this directory for full file-driven ingestion mode.

Required filenames:

- `UnicodeData.txt`
- `Blocks.txt`
- `Scripts.txt`
- `emoji-data.txt`
- `emoji-test.txt`

The ingestion script (`scripts/unicode-ingest.mjs`) auto-detects these files.
