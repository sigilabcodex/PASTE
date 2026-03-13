# PASTE — Feature Architecture and Product Structure (v1)

## 1) Feature model

### A) Local user features (device-only, `localStorage`)
- `recentlyUsed`: bounded LRU list of copied symbols (e.g., max 100).
- `favorites`: explicit user-saved symbol IDs.
- UI preferences: theme, density, last selected category/pack.
- Local-only interaction state: pinned detail panel mode, keyboard hints dismissed.

Implementation notes:
- Never sync; no account model in v1.
- Store only symbol IDs and timestamps, not search history text.
- All local features must work offline.

### B) Dataset/editorial features (shipped static assets)
- Canonical symbol records (Unicode + app metadata).
- Neutral default featured set.
- Author-curated packs (e.g., TG Lab / Sigilab).
- Optional thematic packs (utility, typography, rituals, etc.).
- Category/group taxonomy and search keywords.

Implementation notes:
- Version dataset (`datasetVersion`) for safe migrations.
- Keep curation declarative: pack files reference symbol IDs only.

### C) Knowledge/reference features (in-app, concise)
- Short description/explanation per symbol.
- Optional context notes (historical/cultural usage notes).
- Optional cautionary context for loaded symbols (non-blocking).
- Source links panel (“Read more”).

Implementation notes:
- Keep primary interaction copy/search-first; knowledge appears in detail panel.
- Knowledge text should be summary-length, not article-length.

### D) Future external data features (deferred)
- Optional remote enrichment feeds (versioned JSON endpoints).
- External dataset refresh checks.
- Community/partner packs loaded from signed manifests.

Implementation notes:
- Keep v1 fully static; define interfaces now, implement network later.

---

## 2) Recommended homepage structure

1. **Search bar (sticky, autofocus desktop)**
2. **Category chips** (All + top categories)
3. **Recently used** (if non-empty)
4. **Favorites** (if non-empty)
5. **Featured (default neutral)**
6. **Curated pack spotlight** (e.g., TG Lab / Sigilab)
7. **Results grid** (primary surface)
8. **Detail panel/drawer** (secondary knowledge + copy variants)

Behavior rules:
- Empty query: show sections 2–6 + default grid.
- Active query: collapse section modules and prioritize results grid.
- Copy remains 1-click/tap from grid; detail never required for copy.

---

## 3) Pack model

## Pack types
- **Default featured pack**: dataset-owned, neutral, broad utility.
- **User favorites pack**: local-only, user-owned.
- **Recently used pack**: local-only, auto-generated.
- **Author-curated packs**: dataset-owned, editorial identity allowed.
- **Thematic packs**: dataset-owned, topic-specific collections.

## Storage ownership
- Local-only: `favorites`, `recentlyUsed`.
- Dataset: featured, curated, thematic.

## Suggested schema
```ts
interface SymbolPack {
  id: string;
  kind: 'featured' | 'curated' | 'thematic' | 'favorites' | 'recent';
  title: string;
  description?: string;
  symbolIds: string[]; // local packs can be computed IDs
  source?: {
    type: 'core' | 'editorial' | 'local';
    author?: string;
    attributionUrl?: string;
  };
  visibility: 'home' | 'browse' | 'hidden';
  order?: number;
}
```

---

## 4) TG Lab / Sigilab curated pack recommendation

### UI placement
- Show as a labeled card/block on home: “Curated by TG Lab / Sigilab”.
- Include short one-line editorial intent and pack size.
- Open as filterable pack view with same grid interactions.

### Opinionation level
- Allow clear point of view in selection and naming.
- Do not replace or override neutral default featured set.
- Keep tone descriptive; avoid normative ranking language.

### Protect broad usefulness
- Default landing remains neutral featured + categories.
- Curated pack is discoverable but optional.
- Persist last-used pack locally, but provide clear “Back to All/Featured”.

---

## 5) Knowledge-layer recommendation

### Fields in core dataset (inline)
Per symbol:
- `id`, `char`, `codePoint`, `name`, `category`, `keywords[]`
- `shortDescription` (1–2 lines)
- `usageNotes[]` (0–3 concise bullets)
- `sensitivity` metadata (tags, not suppression)
- `relatedSymbolIds[]`
- `refs[]` lightweight links

Reference object:
```ts
interface SymbolRef {
  kind: 'unicode' | 'cldr' | 'wikidata' | 'dbpedia' | 'article' | 'standard';
  title: string;
  url: string;
  lang?: string;
}
```

### External references that are appropriate
- Standards/spec references (Unicode, CLDR).
- Structured entity references (Wikidata, DBpedia).
- High-quality neutral explainers (encyclopedic or institutional).

### How much text is too much
- Card: none/minimal.
- Detail panel: target ~60–320 words total equivalent, mostly bullets.
- If content exceeds this, move to external links.

### Avoid Wikipedia-first design
- Present app-authored summary first.
- Keep external links in collapsible “Read more” section.
- Never route core UX through external pages.

### Metadata interoperability
- Keep optional IDs: `unicodeVersion`, `cldrAnnotations`, `wikidataQid`, `dbpediaResource`.
- Treat external IDs as enrichment fields; app remains fully usable without them.

---

## 6) Phased implementation order

## Phase 1 (core UX + local personalization)
- Fast local search + copy flow hardening.
- Local `recentlyUsed` and `favorites`.
- Homepage modules + neutral featured pack.

## Phase 2 (editorial packs)
- Pack schema + pack switcher/filter.
- Add TG Lab / Sigilab curated pack.
- Add 1–2 thematic packs for validation.

## Phase 3 (knowledge layer v1)
- Detail panel shortDescription + usageNotes.
- Reference links support (`refs[]`).
- Related symbols and lightweight context tags.

## Phase 4 (sensitive-symbol editorial framework)
- Add interpretation/context note templates.
- Add multi-perspective note fields and source guidance.
- QA pass for consistency across loaded symbols.

## Phase 5 (external enrichment, optional)
- External ID wiring and optional refreshable references.
- Partner/community pack manifest format.

Dependencies:
- Phase 3+ depends on richer symbol metadata.
- Phase 5 depends on versioned data contracts and cache strategy.

---

## 7) Editorial recommendations

### Sensitive/culturally loaded symbols
- Include; do not hide by default.
- Add concise context note explaining common interpretations and variance.
- Avoid prescriptive language; emphasize “context-dependent usage”.

### Multiple interpretations
- Use structured bullets: “Common use”, “Alternative use”, “Regional/contextual use”.
- Prefer sourced statements; avoid speculative claims.

### Religious/spiritual symbols
- Keep descriptions factual and brief.
- Mention major traditions of use where relevant.
- Avoid reducing symbol meaning to a single modern context.

### Political/ideological symbols
- Mark as `sensitivity: ['political']` (and others as needed).
- Provide neutral usage-history summary and contemporary usage note.
- Link to standards/reference entries for deeper reading.

### Editorial consistency rules
- One style guide for tense, tone, and note length.
- Require at least one reference for non-trivial claims.
- Prefer “what/where/how used” over interpretation-heavy prose.
