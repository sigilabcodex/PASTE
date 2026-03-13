# PASTE Architecture (v1)

This document describes the current architecture and near-term extension points.

## 1) System overview

PASTE is a static Vite + React + TypeScript app with in-repo JSON datasets.

High-level boundaries:
- **UI state:** transient interaction state in React components/hooks
- **Dataset:** versioned static JSON files in `src/data/`
- **Local user storage:** browser `localStorage` for convenience features only

There is no backend in v1.

## 2) UI state

Main state currently lives in `src/App.tsx`:
- search query
- selected category
- selected symbol for drawer
- copied symbol feedback state
- recent symbol IDs (hydrated from localStorage)

Current UX flow:
1. User types search and/or selects category.
2. App filters in-memory dataset.
3. User clicks/taps symbol card.
4. App attempts clipboard write.
5. On success, app records symbol in Recently Used and shows copied feedback.

## 3) Dataset layer

Current dataset files:
- `src/data/symbols.json` — primary symbol records
- `src/data/featured.v1.json` — IDs used for neutral default featured surface
- `src/data/curated-sets.v1.json` — curated pack metadata
- `src/data/symbols.schema.json` — schema validation contract

Type model is defined in `src/types.ts` (`SymbolEntry`, `SymbolCategory`, etc.).

### Current symbol model (conceptual)

- identity: `id`, `char`, `name`, `codepoints`
- classification: `primaryCategory` (+ legacy `category` compatibility)
- search metadata: `searchKeywords`, `tags`
- curation metadata: `curatedSets`, `featured`
- context metadata: `contextualNote` (plus `note` alias)
- flags: `flags.sensitive` for UI/editorial handling

## 4) Local user storage model

PASTE uses localStorage for personal convenience, never tracking.

Current keys:
- `unicode-map:recent-symbols` — ordered array of recently copied symbol IDs (max 24)
- theme key is managed by `useTheme` for light/dark/system preference

Behavior rules:
- storage is local to the browser/device
- no sync to server
- no cookies used
- no analytics payload derived from these values

## 5) Favorites and Recently Used design

### Recently Used (implemented)

- Trigger: successful copy action
- Store: prepend symbol ID, dedupe, cap to limit
- Display: shown in Featured view when there is no active search query

### Favorites (planned)

Planned storage shape:
- key: `unicode-map:favorites`
- value: ordered array of symbol IDs (or object with stable ordering metadata)

Planned constraints:
- fully local only
- simple export/import path for portability (future)

## 6) Curated packs representation

Curated packs should be represented as dataset metadata, not hardcoded UI logic.

Recommended pack shape:
- `id`
- `title`
- `description`
- `symbolIds`
- optional `tags`
- optional `containsSensitive` flag for editorial review tooling

Operational rule:
- packs may include sensitive symbols,
- default featured/home surfaces remain neutral and utility-first.

## 7) Symbol knowledge fields

To support richer neutral context, extend records with structured knowledge fields (incrementally):

- `contextualNote`: short local editorial summary
- `knowledge`: array of typed references, e.g.
  - `source` (`unicode`, `cldr`, `wikidata`, `dbpedia`, `other-open`)
  - `idOrUrl`
  - optional `label`
  - optional `scope` (`historical`, `regional`, `modern-usage`, etc.)

Source preference order should prioritize Unicode/CLDR/Wikidata/DBpedia and neutral open references.

## 8) Future Unicode ingestion pipeline

v1 data is hand-maintained. Future versions should move to a repeatable ingestion pipeline:

1. Fetch upstream sources:
   - UCD (UnicodeData, Blocks, DerivedName)
   - emoji data/sequence files
   - CLDR annotations
2. Generate normalized base symbol dataset.
3. Apply local override patches for:
   - category mapping
   - search keyword tuning
   - curated pack membership
   - contextual notes and sensitivity flags
4. Validate generated output against schema.
5. Emit versioned artifacts committed to repo.

Key principle: upstream Unicode truth + transparent local editorial layer.
