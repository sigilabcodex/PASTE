# Dataset v2 Unified Schema Proposal (Symbols + Emoji + Scripts)

This proposal keeps PASTE practical: curated coverage, fast search, static JSON, and no attempt at full-Unicode ingestion in this phase.

## 1) Unified entry schema

Use one entry shape for all character-like records (`symbol`, `emoji`, `letter`, `script_character`) so the app can render/search consistently.

```json
{
  "id": "latin-ae-ligature",
  "char": "Æ",
  "name": "LATIN CAPITAL LETTER AE",
  "codepoints": ["U+00C6"],
  "category": "letters_and_scripts",
  "entryType": "letter",
  "script": "Latin",
  "writingSystemGroup": "Alphabetic",
  "tags": ["latin_extended", "orthography", "common"],
  "keywords": ["ae", "ash", "nordic", "ligature"],
  "curatedSets": ["latin-extended-essentials", "multilingual-writing"],
  "description": "Used in multiple languages including Danish, Norwegian, and Icelandic.",
  "history": "From Latin scribal ligature of A + E; standardized in modern orthographies.",
  "externalLinks": [
    {
      "label": "Unicode code chart",
      "url": "https://www.unicode.org/charts/"
    }
  ],
  "flags": {
    "supportsSkinTone": false,
    "isCombiningMark": false,
    "isInvisible": false,
    "isConfusable": false
  },
  "searchPriority": 0.75,
  "status": {
    "searchable": true,
    "featuredDefault": false
  }
}
```

### Required fields
- `id`: stable slug-like identifier.
- `char`: displayed grapheme (single code point or sequence).
- `name`: primary display name.
- `codepoints`: array of normalized values (`U+XXXX`).
- `category`: high-level UI category.
- `entryType`: one of `symbol | emoji | letter | script_character`.
- `tags`: controlled vocabulary tags.
- `keywords`: search keywords/synonyms.

### Recommended optional fields
- `script`: e.g., `Latin`, `Greek`, `Cyrillic`, `Hiragana`, `Katakana`, `Han`.
- `writingSystemGroup`: e.g., `Alphabetic`, `Syllabary`, `Logographic`, `Abugida`, `Abjad`.
- `curatedSets`: pack IDs for browse shortcuts and editorial bundles.
- `description`: short practical usage note.
- `history`: concise origin/context note.
- `externalLinks`: list of trusted references.
- `flags`: behavior/rendering metadata (`supportsSkinTone`, combining/invisible/confusable).
- `status`: search/featured controls.

### Why this shape works
- One model supports old symbol/emoji workflows and new script coverage.
- Script-aware fields remain optional, so symbols/emoji stay lightweight.
- Knowledge fields are additive, not required, keeping curation practical.

---

## 2) Top-level categories and filters (non-cluttered UI)

Keep top-level category count compact. Add script content without flooding the main browse grid.

### Recommended top-level categories
1. `symbols`
2. `emoji`
3. `letters_and_scripts`
4. `technical_controls` (invisible/formatting/combining)

### Script-related filters (inside `letters_and_scripts`)
- `Script`: Latin, Greek, Cyrillic, Hiragana, Katakana, Han (Starter), etc.
- `Writing system type`: Alphabetic / Syllabary / Logographic.
- `Use case`: `phonetic`, `loanwords`, `math_science`, `names`, `starter_learning`.
- `Pack`: curated set filter (`latin-extended-essentials`, etc.).

This keeps the homepage clean while enabling focused script exploration.

---

## 3) Dataset architecture recommendation

Use static modular files so payloads remain fast.

### Core files
- `src/data/entries.v2.core.json`
  - Minimal fields needed for render + quick search (`id`, `char`, `name`, `codepoints`, `category`, `entryType`, `script`, `tags`, `keywords`, `curatedSets`).
- `src/data/entries.v2.details.json`
  - Optional heavy fields (`description`, `history`, `externalLinks`, detailed notes).
- `src/data/curated-sets.v2.json`
  - Pack metadata and ordered IDs.
- `src/data/schema/entry.v2.schema.json`
  - JSON Schema for validation.

### Search index files (prebuilt)
- `src/data/index/v2.tokens.json` (token -> ids + weights)
- `src/data/index/v2.prefix.json` (typeahead)
- `src/data/index/v2.char.json` (exact glyph/codepoint lookup)
- optional lazy shards by category/script if file size grows.

### Editorial governance
- Controlled vocab lists for `category`, `entryType`, `script`, `writingSystemGroup`, and major tags.
- Curated packs are first-class objects, not inferred from tags.
- Keep `history` short (1–3 sentences), never encyclopedia-length.

---

## 4) Practical writing-system coverage plan

Do not ingest full Unicode now. Use phased curation.

## Phase A: Starter coverage (ship first)

### Latin extended essentials
- Keep base Latin plus high-frequency additions used in European names/words.
- Include: `ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝÞß`, lowercase counterparts, and key marks in practical contexts.

### Greek essentials
- Core modern Greek alphabet uppercase/lowercase.
- Include tonos forms in common modern usage.
- Include a few technical crossover letters often used in math/science (`Δ`, `π`, `Ω`) as dual-tagged where appropriate.

### Cyrillic essentials
- Core Russian-oriented starter set (upper/lower), then shared letters used broadly across common Cyrillic languages.
- Keep small and utility-first for names/basic text recognition.

### Hiragana starter set
- Gojūon basics + small kana used frequently in beginner-level text.
- Include dakuten/handakuten variants as explicit entries where needed for searchability.

### Katakana starter set
- Gojūon basics + small kana + long vowel mark (`ー`) for practical loanword reading.

### Simplified Chinese starter set (curated small)
- A tightly curated list of high-frequency characters useful for basic recognition and interface text.
- Target roughly 150–300 characters for phase A, not thousands.

### Optional additions (if capacity permits)
- `Hebrew starter` (basic consonant set) OR `Arabic starter` (isolated-letter reference set), but only one additional script in phase A to keep scope controlled.

## Phase B: Expanded coverage (after usage feedback)
- Broaden each script pack with practical frequency tiers.
- Add additional script packs (Hebrew, Arabic, Devanagari, Thai, Hangul Jamo/syllables starter).
- Expand Han coverage by curated theme packs (UI essentials, signage, common verbs/nouns) rather than bulk block dumps.

## Phase C: Future exhaustive ingestion (not now)
- Introduce automated Unicode ingestion pipeline with heavy filtering + curation overlays.
- Keep UI default scoped to curated packs even if backend dataset grows.
- Full-Unicode completeness remains a backend/data milestone, not a UX default.

---

## 5) How script characters should appear in the product

### Search
- Exact character match should pin the exact entry.
- Romanized/common-name keyword matches should surface script results (e.g., `sigma`, `katakana`, `ni`).
- Mixed search should work: codepoint (`U+03C0`), name, keyword, script filter.

### Category browsing
- Script content primarily browsed under `letters_and_scripts` with script tabs/filters.
- Avoid placing script packs across many top-level categories.

### Curated packs
- Script packs should be explicit and practical: `greek-essentials`, `hiragana-starter`, `han-simplified-starter`.
- Packs should be orderable and human-curated, not autogenerated by Unicode range alone.

### Detail panel
For script entries, show:
- Character (`char`) and `codepoints`
- Name
- Script + writing system group
- Short usage description
- Optional history note
- External links for trusted references

Keep detail panel concise by default with optional “more” expansion.

---

## 6) Sample entries (cross-script)

```json
[
  {
    "id": "sym-right-arrow",
    "char": "→",
    "name": "RIGHTWARDS ARROW",
    "codepoints": ["U+2192"],
    "category": "symbols",
    "entryType": "symbol",
    "tags": ["navigation", "common", "ui"],
    "keywords": ["arrow", "right", "next"],
    "curatedSets": ["quick-ui-symbols"],
    "flags": { "supportsSkinTone": false }
  },
  {
    "id": "emoji-thumbs-up",
    "char": "👍",
    "name": "THUMBS UP",
    "codepoints": ["U+1F44D"],
    "category": "emoji",
    "entryType": "emoji",
    "tags": ["gesture", "approval", "common"],
    "keywords": ["like", "ok", "thumbs up"],
    "curatedSets": ["emoji-quick-reactions"],
    "flags": { "supportsSkinTone": true }
  },
  {
    "id": "latin-enye-upper",
    "char": "Ñ",
    "name": "LATIN CAPITAL LETTER N WITH TILDE",
    "codepoints": ["U+00D1"],
    "category": "letters_and_scripts",
    "entryType": "letter",
    "script": "Latin",
    "writingSystemGroup": "Alphabetic",
    "tags": ["latin_extended", "names"],
    "keywords": ["enye", "spanish", "n tilde"],
    "curatedSets": ["latin-extended-essentials"]
  },
  {
    "id": "greek-pi-small",
    "char": "π",
    "name": "GREEK SMALL LETTER PI",
    "codepoints": ["U+03C0"],
    "category": "letters_and_scripts",
    "entryType": "script_character",
    "script": "Greek",
    "writingSystemGroup": "Alphabetic",
    "tags": ["greek", "math_science", "common"],
    "keywords": ["pi", "circle constant"],
    "curatedSets": ["greek-essentials", "math-symbol-crossovers"]
  },
  {
    "id": "cyrillic-zhe-small",
    "char": "ж",
    "name": "CYRILLIC SMALL LETTER ZHE",
    "codepoints": ["U+0436"],
    "category": "letters_and_scripts",
    "entryType": "script_character",
    "script": "Cyrillic",
    "writingSystemGroup": "Alphabetic",
    "tags": ["cyrillic", "starter_learning"],
    "keywords": ["zhe", "russian"],
    "curatedSets": ["cyrillic-essentials"]
  },
  {
    "id": "hiragana-a",
    "char": "あ",
    "name": "HIRAGANA LETTER A",
    "codepoints": ["U+3042"],
    "category": "letters_and_scripts",
    "entryType": "script_character",
    "script": "Hiragana",
    "writingSystemGroup": "Syllabary",
    "tags": ["hiragana", "starter_learning"],
    "keywords": ["a", "japanese"],
    "curatedSets": ["hiragana-starter"]
  },
  {
    "id": "katakana-ka",
    "char": "カ",
    "name": "KATAKANA LETTER KA",
    "codepoints": ["U+30AB"],
    "category": "letters_and_scripts",
    "entryType": "script_character",
    "script": "Katakana",
    "writingSystemGroup": "Syllabary",
    "tags": ["katakana", "starter_learning"],
    "keywords": ["ka", "japanese", "loanword"],
    "curatedSets": ["katakana-starter"]
  },
  {
    "id": "han-ren",
    "char": "人",
    "name": "CJK UNIFIED IDEOGRAPH-4EBA",
    "codepoints": ["U+4EBA"],
    "category": "letters_and_scripts",
    "entryType": "script_character",
    "script": "Han",
    "writingSystemGroup": "Logographic",
    "tags": ["han_simplified_starter", "high_frequency"],
    "keywords": ["person", "ren", "human"],
    "curatedSets": ["han-simplified-starter"]
  }
]
```

---

## 7) Practical implementation checklist

1. Add `entry.v2.schema.json` and validate all new entries in CI.
2. Keep v1 dataset readable; add a converter script to map v1 -> v2 base fields.
3. Launch with phase-A packs only.
4. Measure search logs locally (no trackers; optional local debug mode only) for missing characters.
5. Expand to phase B only after validating pack usefulness.

This keeps PASTE a clean utility atlas with broad practical coverage, without turning it into an unbounded Unicode encyclopedia.
