# Dataset v1 Notes

## Scope
- English-first labels and keywords.
- Static JSON only; no backend required.
- Includes sensitive/contextual categories (political, ideological, religious, spiritual) but excludes them from featured defaults.

## Data files
- `src/data/symbols.json`: primary symbol dataset.
- `src/data/symbols.schema.json`: JSON Schema for validation.
- `src/data/featured.v1.json`: neutral default featured set.
- `src/data/curated-sets.v1.json`: curated set/pack definitions (`featured`, `author-curated`).

## v1 dataset expansion (this update)
- Expanded practical coverage across punctuation, quotation marks, arrows, math, currency, checks/crosses, stars, geometric shapes, box drawing, technical/computing symbols, whitespace/invisible characters, and emoji control/audio symbols.
- Added author-requested symbols and emoji: anarchy symbol, copyleft symbol, dagaz/wunjo/eihwaz runes, delta, guillemets, parentheses, tilde, and uppercase Ñ.
- Added schema support for:
  - `primaryCategory` (required),
  - `curatedSets` (optional),
  - `contextualNote` (optional; keeps `note` as a backward-compatible alias),
  - `searchKeywords` (kept as optional-friendly array in usage, required in schema).

## Unicode naming assumptions
- Some symbols are commonly referenced by alternate names in different communities (example: `Eihwaz`/`Iwaz`, `quotation mark`/`guillemet`, `control knobs`/`mixer knobs`).
- Where naming conventions vary, entries use neutral descriptive names and include alternate forms in `searchKeywords`.

## Scaling plan (Unicode + CLDR)
1. **Unicode Character Database (UCD)**
   - Source: `UnicodeData.txt`, `Blocks.txt`, `DerivedName.txt`.
   - Use for canonical names, codepoint ranges, and general categories.
2. **emoji-data + emoji-test**
   - Source: `emoji-data.txt`, `emoji-sequences.txt`, `emoji-zwj-sequences.txt`, `emoji-test.txt`.
   - Use for emoji qualification status and multi-codepoint sequence parsing.
3. **CLDR annotations**
   - Source: CLDR annotation XML/JSON (`annotations/en.xml`, `annotationsDerived/en.xml`).
   - Use for English short names + search keywords.
4. **Build pipeline recommendation**
   - Add a small build script that:
     - normalizes codepoints into `U+XXXX` format,
     - merges UCD names + CLDR keywords,
     - emits `symbols.generated.json`,
     - applies local curation patches (`overrides.json`) for category mapping, note text, and featured IDs.
5. **Search optimization**
   - Precompute a lowercase `searchText` per entry at build time.
   - Keep `searchKeywords` concise and deduplicated.
6. **Governance**
   - Keep contextual symbols available with neutral naming.
   - Require explicit `note` review for sensitive entries.
   - Keep featured lists neutral and practical.
