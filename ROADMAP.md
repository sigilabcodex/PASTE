# PASTE Roadmap

This roadmap reflects the current product direction: desktop-first, mobile-usable, static-first, no backend in v1, and privacy-by-default.

## Phase 1 — v1 core browsing + copy UX (current)

**Goal:** make symbol lookup and copy reliable, fast, and neutral.

- [x] Static React app with no backend dependency
- [x] Search-first symbol discovery
- [x] Instant copy on click/tap
- [x] Featured + category browsing
- [x] Sensitive/controversial symbols accessible but not featured by default
- [x] Local theme preference
- [x] Local Recently Used history

## Phase 2 — local personalization

**Goal:** add convenience features without adding tracking infrastructure.

- [ ] Favorites (localStorage only)
- [ ] Pin/favorite UI in grid and detail drawer
- [ ] Fast toggles: Featured / Recent / Favorites
- [ ] Export/import local preferences (optional JSON file)

## Phase 3 — curated packs

**Goal:** support thematic, practical entry points while keeping neutral defaults.

- [ ] Curated pack browsing UI
- [ ] Pack metadata (id, title, description, inclusion rationale)
- [ ] Pack-level ordering and quality review process
- [ ] “Not featured by default” rule enforcement for sensitive symbols

## Phase 4 — richer symbol dataset

**Goal:** increase utility and consistency of metadata.

- [ ] Broaden coverage across Unicode ranges and practical symbol families
- [ ] Consistent primary categories and search keyword quality
- [ ] Better contextual notes for multi-meaning symbols
- [ ] Improved schema validation in CI

## Phase 5 — search and ranking improvements

**Goal:** make search results feel more relevant and predictable.

- [ ] Weighted ranking (name/codepoint exact matches > keywords > tags > notes)
- [ ] Token normalization and typo tolerance
- [ ] Optional transliteration and alias support
- [ ] Search performance optimization for larger datasets

## Phase 6 — keyboard-first navigation

**Goal:** improve desktop productivity and accessibility.

- [ ] Arrow-key navigation in results grid
- [ ] Enter to copy focused symbol
- [ ] Keyboard shortcuts for focus/search/category switches
- [ ] Improved focus management and visible states

## Phase 7 — Unicode ingestion pipeline

**Goal:** reduce manual data maintenance and keep Unicode data up to date.

- [ ] Ingestion scripts for UCD + emoji data + CLDR annotations
- [ ] Generated base dataset + local override patches
- [ ] Versioned update process and changelog
- [ ] Validation gates for schema and editorial constraints

## Phase 8 — structured knowledge layer

**Goal:** provide neutral, factual symbol context where useful.

- [ ] Extend symbol knowledge fields (context, usage scope, references)
- [ ] Add structured references per symbol
- [ ] Prefer Unicode / Wikidata / DBpedia / CLDR / other neutral open references
- [ ] Keep “Wikipedia-first” behavior out of default linking

## Phase 9 — optional PWA/offline support

**Goal:** improve resilience without changing privacy posture.

- [ ] Add installable PWA shell (optional)
- [ ] Offline caching for app shell + dataset
- [ ] Cache update strategy that preserves predictable behavior
