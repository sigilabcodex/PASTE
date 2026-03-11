# Unicode Symbol & Emoji Dataset v1 (Static, Privacy-First)

## 1) Proposed schema for symbol entries

Use one normalized entry shape for all symbol-like records, with `kind` and warning metadata differentiating behavior.

```json
{
  "id": "u+2192",
  "kind": "single_code_point",
  "char": "→",
  "codepoints": ["U+2192"],
  "sequence": null,
  "unicode_name": "RIGHTWARDS ARROW",
  "aliases": ["right arrow", "arrow right"],
  "keywords": ["direction", "next", "forward"],
  "category": "arrows",
  "subcategory": "directional",
  "tags": ["common", "ui", "featured_ok"],
  "version": {
    "unicode": "1.1",
    "emoji": null
  },
  "search": {
    "ascii_fold": ["rightwards arrow", "right arrow", "arrow right"],
    "ngrams": ["arr", "rro", "row"],
    "token_priority": {
      "unicode_name": 5,
      "aliases": 4,
      "keywords": 2,
      "category": 1
    }
  },
  "display": {
    "glyph_may_vary": false,
    "invisible": false,
    "render_hint": null,
    "warning_level": "none",
    "warning_note": null
  },
  "related_ids": ["u+27a1", "u+2190"],
  "status": {
    "searchable": true,
    "featured_default": true,
    "sensitive": false
  },
  "source": {
    "primary": "UnicodeData.txt",
    "generated_at": "2026-03-11"
  }
}
```

### Notes on schema choices
- Keep `char` for direct render/copy and `codepoints` for deterministic matching.
- Keep `sequence` for explicit emoji ZWJ/VS/modifier chains (string of code points joined by spaces).
- Precompute `search.*` fields during build to avoid heavy client preprocessing.
- Keep UI behavior in `display` and policy behavior in `status` so filtering is simple and explicit.

---

## 2) Distinctions among symbol types

Use explicit `kind` values:

- `single_code_point`
  - Exactly one scalar value (e.g., `U+2192`).
  - Most symbols, punctuation, currency signs.

- `emoji_sequence`
  - Multiple code points forming one perceived emoji.
  - Includes ZWJ sequences, skin-tone modifiers, flag sequences, keycaps, VS-16 variants.

- `combining_mark`
  - Combining diacritics/overlay marks (`General_Category=Mn/Mc/Me`) not intended standalone.
  - Include rendering note (needs base character preview like `á`).

- `control_or_invisible`
  - Zero-width/control-like or directionality characters, line/paragraph separators, format chars.
  - Must include `display.invisible=true` and warning labels with usage context.

Recommended additional field:

```json
"kind_detail": "zwj_sequence | flag_sequence | variation_selector | bidirectional_format | zero_width | enclosing_mark"
```

---

## 3) Category taxonomy for v1

Keep category count compact for mobile browse speed; use subcategories to avoid over-fragmentation.

1. `arrows`
2. `math`
3. `currency`
4. `punctuation`
5. `quotes_and_dashes`
6. `numbers_and_numerals`
7. `latin_accents_and_diacritics`
8. `greek_cyrillic_and_letterlike`
9. `technical_and_units`
10. `geometric_shapes`
11. `box_drawing_and_blocks`
12. `dingbats_and_misc_symbols`
13. `emoji_faces_people`
14. `emoji_animals_nature`
15. `emoji_food_objects`
16. `emoji_travel_places`
17. `emoji_symbols_flags`
18. `combining_marks`
19. `invisible_and_format_controls`
20. `historical_sensitive_symbols`

Rules:
- Every entry has one primary category and optional subcategory.
- Cross-domain discoverability via tags/keywords, not multi-primary categories.

---

## 4) Tagging strategy

Use controlled tags (bounded vocab), not free-form user tags.

Tag groups:
- **Functional**: `common`, `ui`, `typing`, `math`, `layout`, `decorative`
- **Contextual**: `formal`, `casual`, `technical`, `historical`
- **Safety/display**: `invisible`, `confusable`, `bidirectional`, `rendering_sensitive`
- **Policy**: `featured_ok`, `featured_exclude`, `sensitive_context`

Implementation rules:
- Keep max 8 tags/entry.
- Include at most one policy tag from `featured_ok|featured_exclude`.
- `sensitive_context` does **not** affect searchability; it affects default surfacing.

---

## 5) Search indexing strategy for static deployment

### Client-side architecture
Use prebuilt lightweight index shards plus compact entry payloads.

Files:
- `symbols.min.json` → core display payload (no verbose index fields).
- `index.tokens.json` → token -> posting list of ids with field weights.
- `index.prefix.json` → prefix map for fast typeahead (2–5 chars).
- `index.char.json` → direct map for literal symbol/sequence lookup.
- Optional category shards: `index.category.<name>.json` lazy-loaded.

### Query flow (mobile-first)
1. Normalize query: lowercase, trim, NFC, ASCII fold.
2. If query contains symbol glyphs, hit `index.char.json` first (O(1)-style lookup).
3. Tokenize and consult prefix map for instant candidates.
4. Merge posting lists, score by weighted BM25-lite/field boosts.
5. Re-rank top N with exact/sequence/category heuristics.
6. Return top 50; paginate or "show more".

### Compression / size control
- IDs as short integers in index files.
- Front-coding or shared-prefix compression for sorted tokens.
- Keep verbose fields (`notes`, long aliases) in lazy detail file.
- Gzip/Brotli static hosting.

Target budget (guidance):
- Initial payload + hot index under ~300 KB compressed.
- Full dataset/index lazy-loaded by category or upon deep search.

---

## 6) Ranking strategy

Composite score:

`score = lexical + exact_bonus + symbol_bonus + popularity + recency_penalty + policy_adjustment`

Recommended weighting:
- Exact glyph/code point match: very high boost.
- Unicode name token match: high.
- Alias exact/prefix match: high.
- Keyword/category match: medium/low.
- Prefix-only partials: lower than full token.

Heuristics:
- If query is a single glyph, always pin exact record first.
- If query begins with `u+`/hex, parse and pin matching code point/sequence.
- Penalize noisy broad matches when query length >= 4.
- For emoji, boost exact sequence over base emoji.

Policy behavior:
- `featured_exclude` and `sensitive_context` do **not** reduce search rank for explicit relevant matches.
- They only affect homepage/default modules.

---

## 7) Default featured categories and homepage content

Homepage should optimize frequent utility copy tasks and avoid accidental surfacing of sensitive sets.

### Default featured modules
1. Most used: arrows, checkmarks, bullets, stars, currency.
2. Writing essentials: quotes, dashes, ellipsis, non-breaking space (with clear label).
3. Math quick picks: ± × ÷ ≠ ≤ ≥ ∞ √.
4. Box drawing essentials for terminals.
5. Emoji quick sets: faces, gestures, status symbols.

### Keep out of default featured
- `historical_sensitive_symbols`
- `invisible_and_format_controls`

These remain fully searchable and accessible via category pages and direct query matches.

---

## 8) Classifying controversial/historically sensitive symbols

Create dedicated primary category: `historical_sensitive_symbols` with neutral subcategories, e.g.:
- `ancient_religious_contexts`
- `politically_sensitive_emblems`
- `historical_insignia`

Per-entry metadata:

```json
"status": {
  "searchable": true,
  "featured_default": false,
  "sensitive": true
},
"tags": ["historical", "sensitive_context", "featured_exclude"]
```

Behavior:
- Included in index and normal ranking for relevant terms.
- Excluded from default recommendation carousels.
- Shown with neutral context note.

---

## 9) Warning labels / contextual notes

Use `display.warning_level` enum: `none | info | caution | high`.

Use concise neutral labels:
- Combining marks: "Combines with previous character; may not display alone."
- Invisible/control: "Invisible formatting character; copying may affect text direction or layout."
- Bidi controls: "Can alter display order of surrounding text."
- Historically sensitive symbols: "This symbol has historical and contemporary sensitive uses depending on context."

UI recommendations:
- Show warning pill in search results and detail view.
- Show escaped/code-point preview for invisible entries.
- Offer one-tap copy of literal and one-tap copy of escaped form where applicable.

---

## 10) Suggested build pipeline

### Raw sources
- Unicode Character Database (UCD): `UnicodeData.txt`, `NameAliases.txt`, `DerivedCoreProperties.txt`, `PropList.txt`, `Blocks.txt`.
- Emoji data: `emoji-test.txt`, `emoji-sequences.txt`, `emoji-zwj-sequences.txt`, `emoji-variation-sequences.txt`.
- Curated local files:
  - `aliases.manual.json`
  - `keywords.manual.json`
  - `sensitive.classification.json`
  - `featured.defaults.json`

### Normalization scripts (regenerable)
1. Parse raw Unicode/Emoji files.
2. Generate canonical code point records and sequence records.
3. Attach aliases/keywords/category mappings.
4. Classify `kind`, `kind_detail`, warnings, policy tags.
5. Generate search tokens (NFC, folded, tokenized, prefix table).
6. Produce compact ids + index shards.
7. Validate schema + duplicate/conflict checks.

### Generated output
- `dist/data/symbols.min.json`
- `dist/data/symbols.detail.json`
- `dist/data/index.tokens.json`
- `dist/data/index.prefix.json`
- `dist/data/index.char.json`
- `dist/data/categories.json`
- `dist/data/build-meta.json`

Add CI check: regenerate and assert no diff unless source/version changes.

---

## 11) Example JSON entries

### A) Arrow (single code point)

```json
{
  "id": "u+2192",
  "kind": "single_code_point",
  "char": "→",
  "codepoints": ["U+2192"],
  "unicode_name": "RIGHTWARDS ARROW",
  "aliases": ["right arrow"],
  "keywords": ["direction", "next", "forward"],
  "category": "arrows",
  "subcategory": "directional",
  "tags": ["common", "ui", "featured_ok"],
  "display": {"invisible": false, "warning_level": "none"},
  "status": {"searchable": true, "featured_default": true, "sensitive": false}
}
```

### B) Math symbol

```json
{
  "id": "u+2260",
  "kind": "single_code_point",
  "char": "≠",
  "codepoints": ["U+2260"],
  "unicode_name": "NOT EQUAL TO",
  "aliases": ["not equal", "neq"],
  "keywords": ["math", "comparison", "inequality"],
  "category": "math",
  "subcategory": "operators",
  "tags": ["technical", "featured_ok"],
  "display": {"invisible": false, "warning_level": "none"},
  "status": {"searchable": true, "featured_default": true, "sensitive": false}
}
```

### C) Currency symbol

```json
{
  "id": "u+20ac",
  "kind": "single_code_point",
  "char": "€",
  "codepoints": ["U+20AC"],
  "unicode_name": "EURO SIGN",
  "aliases": ["euro"],
  "keywords": ["currency", "money", "eur"],
  "category": "currency",
  "subcategory": "major",
  "tags": ["common", "featured_ok"],
  "display": {"invisible": false, "warning_level": "none"},
  "status": {"searchable": true, "featured_default": true, "sensitive": false}
}
```

### D) Box drawing

```json
{
  "id": "u+2500",
  "kind": "single_code_point",
  "char": "─",
  "codepoints": ["U+2500"],
  "unicode_name": "BOX DRAWINGS LIGHT HORIZONTAL",
  "aliases": ["box horizontal", "light horizontal line"],
  "keywords": ["terminal", "table", "ascii art"],
  "category": "box_drawing_and_blocks",
  "subcategory": "light",
  "tags": ["layout", "technical", "featured_ok"],
  "display": {"invisible": false, "warning_level": "none"},
  "status": {"searchable": true, "featured_default": true, "sensitive": false}
}
```

### E) Emoji sequence

```json
{
  "id": "emoji:family_man_woman_girl_boy",
  "kind": "emoji_sequence",
  "kind_detail": "zwj_sequence",
  "char": "👨‍👩‍👧‍👦",
  "codepoints": ["U+1F468", "U+200D", "U+1F469", "U+200D", "U+1F467", "U+200D", "U+1F466"],
  "sequence": "U+1F468 U+200D U+1F469 U+200D U+1F467 U+200D U+1F466",
  "unicode_name": "FAMILY: MAN, WOMAN, GIRL, BOY",
  "aliases": ["family"],
  "keywords": ["parents", "children", "emoji"],
  "category": "emoji_faces_people",
  "subcategory": "family",
  "tags": ["common", "rendering_sensitive", "featured_ok"],
  "display": {"glyph_may_vary": true, "invisible": false, "warning_level": "info"},
  "status": {"searchable": true, "featured_default": true, "sensitive": false}
}
```

### F) Combining mark

```json
{
  "id": "u+0301",
  "kind": "combining_mark",
  "char": "́",
  "codepoints": ["U+0301"],
  "unicode_name": "COMBINING ACUTE ACCENT",
  "aliases": ["acute combining mark"],
  "keywords": ["diacritic", "accent", "combining"],
  "category": "combining_marks",
  "subcategory": "accents",
  "tags": ["typing", "rendering_sensitive", "featured_exclude"],
  "display": {
    "invisible": false,
    "render_hint": "show_with_dotted_circle",
    "warning_level": "info",
    "warning_note": "Combines with previous character; may not display alone."
  },
  "status": {"searchable": true, "featured_default": false, "sensitive": false}
}
```

### G) Historically sensitive category example

```json
{
  "id": "u+5350",
  "kind": "single_code_point",
  "char": "卐",
  "codepoints": ["U+5350"],
  "unicode_name": "SWASTIKA",
  "aliases": ["swastika", "historical religious symbol"],
  "keywords": ["historical", "religious", "symbol"],
  "category": "historical_sensitive_symbols",
  "subcategory": "ancient_religious_contexts",
  "tags": ["historical", "sensitive_context", "featured_exclude"],
  "display": {
    "invisible": false,
    "warning_level": "caution",
    "warning_note": "This symbol has historical and contemporary sensitive uses depending on context."
  },
  "status": {"searchable": true, "featured_default": false, "sensitive": true}
}
```

This structure keeps all symbols discoverable while maintaining neutral, explicit controls for default surfacing and UI context.
