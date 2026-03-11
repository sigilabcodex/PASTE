# Privacy-First Character & Emoji Map — Technical Blueprint (v1)

## 1) Concise product definition
A **mobile-first, static web app** for quickly finding and copying characters/emoji by tap/click. It prioritizes:
- **Speed** (instant load, fast local search)
- **Privacy** (no trackers, cookies, accounts, or backend logs)
- **Neutral defaults** (no political/ideological featuring)
- **Full access** (controversial symbols remain searchable and categorized, but are not highlighted in default landing/featured content)

Core user loop: **open → search/browse → tap symbol → copied instantly**.

---

## 2) Recommended stack and justification

### Recommended stack
- **Framework:** SvelteKit (static adapter) or Astro + small client islands
- **Language:** TypeScript
- **Styling:** CSS variables + utility layer (hand-rolled or UnoCSS/Tailwind if team prefers)
- **Build tool:** Vite
- **Data format:** JSON (prebuilt search index JSON + symbol catalog JSON)
- **Search engine:** MiniSearch or FlexSearch (client-side, pre-indexed at build)
- **Testing:** Vitest + Playwright
- **Lint/format:** ESLint + Prettier

### Why this stack
- **Static-first by default** with strong DX.
- **No backend required** for v1.
- **Fast client interactivity** for instant copy/search.
- **Type-safe content pipeline** for symbol datasets.
- Easy deployment to GitHub Pages, Netlify, Cloudflare Pages, or VPS.

> If maximum simplicity is preferred over framework ergonomics, v1 can be built with plain Vite + Preact.

---

## 3) System architecture for v1

## Build-time
1. Source datasets (`data/raw/*.json`) hold symbols, aliases, taxonomy, keywords.
2. A build script normalizes data and outputs:
   - `public/data/symbols.min.json`
   - `public/data/search-index.min.json`
   - `public/data/meta.json` (version/checksum)
3. Static site is generated and deployed.

## Runtime (client-only)
1. App shell loads quickly (HTML+critical CSS).
2. Fetch compact index JSON in parallel.
3. Search runs in-memory (optionally Web Worker if index grows).
4. Copy uses Clipboard API with fallback.
5. Optional theme preference stored in `localStorage` (not cookies).

## Privacy model
- No analytics SDKs, no third-party trackers.
- No server API calls required for core use.
- Optional privacy-friendly aggregate analytics (self-hosted Plausible/Umami) disabled by default.

---

## 4) Folder structure

```txt
/
├─ src/
│  ├─ app/
│  │  ├─ routes/
│  │  │  ├─ +page.(svelte|tsx)           # home (neutral featured sets)
│  │  │  ├─ search/+page.(svelte|tsx)    # focused search page
│  │  │  ├─ category/[slug]/+page.*      # taxonomy browsing
│  │  │  └─ about/+page.*
│  │  ├─ components/
│  │  │  ├─ SymbolCard.*
│  │  │  ├─ SymbolGrid.*
│  │  │  ├─ SearchBar.*
│  │  │  ├─ ThemeToggle.*
│  │  │  └─ CopyToast.*
│  │  ├─ lib/
│  │  │  ├─ search.ts
│  │  │  ├─ copy.ts
│  │  │  ├─ taxonomy.ts
│  │  │  └─ theme.ts
│  │  └─ styles/
│  │     ├─ tokens.css
│  │     └─ base.css
│  └─ tests/
│     ├─ unit/
│     └─ e2e/
├─ data/
│  ├─ raw/
│  │  ├─ symbols.json
│  │  ├─ aliases.en.json
│  │  └─ categories.json
│  └─ generated/
├─ scripts/
│  ├─ build-data.ts
│  └─ validate-data.ts
├─ public/
│  ├─ data/
│  │  ├─ symbols.min.json
│  │  ├─ search-index.min.json
│  │  └─ meta.json
│  └─ icons/
├─ docs/
│  ├─ content-policy.md
│  └─ taxonomy-guidelines.md
├─ package.json
└─ README.md
```

---

## 5) Data model proposal for symbols and emoji

```ts
interface SymbolEntry {
  id: string;                    // stable slug, e.g. "latin-a-acute"
  char: string;                  // rendered symbol/emoji
  codepoints: string[];          // ["U+00E1"] or multi-codepoint sequence
  unicodeName: string;           // official Unicode name
  aliases: string[];             // plain-English synonyms
  keywords: string[];            // search expansion terms
  category: string;              // primary taxonomy key
  subcategory?: string;
  scripts?: string[];            // e.g. ["Latin", "Greek"]
  tags?: string[];               // non-ranked labels
  version?: string;              // Unicode version
  controversial?: boolean;       // true if sensitive/controversial context
  hiddenFromFeatured?: boolean;  // enforce non-feature by default
  searchable?: boolean;          // default true
  sortWeight?: number;           // deterministic ordering inside category
}
```

### Content policy encoding (important)
- `controversial=true` does **not** remove visibility from search/category routes.
- Homepage/featured queries include hard filter: `hiddenFromFeatured !== true`.
- Keep policy in `docs/content-policy.md` and enforce in tests.

---

## 6) Search architecture proposal

### Indexing strategy
- Build-time generation of a lightweight inverted index.
- Fields and weights:
  - `aliases` (high)
  - `unicodeName` (high)
  - `keywords` (medium)
  - `category/subcategory` (medium)
  - `codepoints` (low, exact-friendly)

### Query behavior
- Normalize (lowercase, trim, diacritics fold).
- Tokenize by spaces and punctuation.
- Prefix matching for short incremental typing.
- Optional fuzzy threshold (typo tolerance) with strict cap for performance.
- Boost exact matches.

### Performance targets
- Time to interactive under 2s on mid-tier mobile (good network).
- Search response < 50ms for common queries on recent phones.
- Index payload target: < 300KB gzipped for v1.

### Implementation details
- Lazy-load index after first paint, but prefetch when search bar receives focus.
- Debounce input (~50ms) and cancel stale queries.
- If dataset > 15k entries, move search execution to Web Worker.

---

## 7) Theme system proposal

### v1 theme model
- `light`, `dark`, `system` modes.
- CSS variables in `tokens.css`.
- Add `data-theme` attribute on `<html>`.
- Store preference in `localStorage` key `themePreference`.

### Accessibility
- Maintain WCAG AA contrast for text and controls.
- Visible focus states.
- Avoid color-only meaning; use icon+label for copy feedback.

---

## 8) Deployment options

## A) GitHub Pages (fastest)
- Use static export (`dist/`).
- GitHub Actions pipeline: install → test → build → deploy.
- Best for zero-cost MVP; no backend complexity.

## B) Static hosts (Netlify/Cloudflare Pages/Vercel static)
- Similar workflow, often faster global CDN.
- Easy previews per PR.

## C) VPS + Nginx
- Build artifact uploaded to `/var/www/app`.
- Nginx serves static files with gzip/brotli and immutable caching.
- Add strong security headers:
  - `Content-Security-Policy`
  - `Referrer-Policy: no-referrer`
  - `X-Content-Type-Options: nosniff`

### Caching recommendation
- Fingerprinted JS/CSS: long cache (`max-age=31536000, immutable`).
- HTML and data JSON: shorter cache + ETag.

---

## 9) v1 feature list

Must-have:
1. Instant copy on click/tap with subtle toast feedback.
2. Fast search across unicode name, aliases, category, keywords, codepoints.
3. Mobile-first responsive grid/list.
4. Category browsing and basic taxonomy pages.
5. Neutral homepage with non-controversial featured sections only.
6. Theme toggle (light/dark/system).
7. Offline-friendly static assets (basic PWA optional).
8. “No tracking/cookies/accounts” privacy statement.
9. Keyboard navigation + screen reader labels.

Nice-to-have (if time allows):
- Recent copies stored locally (session/local only).
- Deep-link query state (`?q=`).

---

## 10) v1.1 and v2 roadmap

## v1.1 (stability + quality)
- Better ranking model using query analytics **without personal tracking** (local-only optional telemetry export for maintainer testing).
- Expand aliases/keywords coverage.
- Web Worker search by default for larger datasets.
- Import pipeline for Unicode updates.
- Better internationalization groundwork (still English-first UI).

## v2 (advanced UX)
- Multi-language UI packs (community-maintained).
- Optional downloadable offline package.
- User-defined local collections/favorites (stored on-device only).
- Advanced filters (script, Unicode block, tone modifiers).
- Plugin-style data packs for niche symbol sets.

---

## 11) Main technical risks and mitigations

1. **Index bloat / slow mobile performance**  
   - Mitigation: build-time pruning, field compression, worker offload, perf budgets in CI.

2. **Search relevance feels “wrong”**  
   - Mitigation: explicit weighted fields, golden-query tests, manually curated alias lists.

3. **Policy drift for controversial symbols**  
   - Mitigation: data flags + automated test ensuring `hiddenFromFeatured` enforcement in featured/home queries.

4. **Clipboard inconsistencies on some browsers**  
   - Mitigation: Clipboard API + fallback (`execCommand`) + clear user feedback on failure.

5. **Taxonomy becoming biased or hard to maintain**  
   - Mitigation: documented editorial rules, neutral naming conventions, deterministic ordering.

---

## 12) Clear build recommendation (first 3 days)

## Day 1 — foundation + data
- Scaffold app with static build target.
- Implement core `SymbolEntry` schema + validation script.
- Prepare initial dataset (1k–3k entries) with categories and aliases.
- Build `scripts/build-data.ts` to emit minified runtime JSON/index.

## Day 2 — core UX
- Build homepage + search + category pages.
- Implement in-memory search and result ranking.
- Implement `SymbolCard` copy interaction + toast feedback.
- Add controversial-content policy filter in featured/home logic.

## Day 3 — hardening + deploy
- Add unit tests for search normalization/ranking and policy constraints.
- Add e2e tests for copy flow and mobile viewport behavior.
- Optimize bundle size and caching headers.
- Deploy to GitHub Pages (or Cloudflare Pages) with CI pipeline.

### Definition of done for v1 kickoff
- App loads, searches, copies instantly on mobile.
- No backend/database.
- Controversial symbols accessible via search/category but excluded from defaults/featured.
- Privacy statement and zero-tracker implementation validated.
