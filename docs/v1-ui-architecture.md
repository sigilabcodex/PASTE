# Unicode Character + Emoji Map — v1 UX & Interface Plan

## 1) Information architecture

### Primary entities
- **Symbol**: one Unicode character or emoji plus metadata.
  - `char`, `codePoint` (e.g., `U+1F44D`), `name`, `keywords`, `category`, `group`, optional `aliases`, optional `tags`.
- **Category**: high-level grouping for browsing (e.g., Arrows, Math, Currency, Faces).
- **Set**: curated list for homepage featured modules (neutral and utility-focused).
- **Recent (local-only, optional)**: last copied symbols in-memory/session only (no cookies, no server tracking).

### Top-level IA (flat, low-friction)
1. **Home/Search (default route `/`)**
   - Search-first interface
   - Featured neutral sets
   - Quick category chips
2. **Browse by Category (`/category/:slug`)**
   - Same search bar pinned at top
   - Filtered symbol grid
3. **About/Privacy (`/about`)**
   - Explicit no-tracking/no-cookie statement
   - Keyboard shortcuts + accessibility notes

### Data strategy
- Ship a static JSON (or compacted TS module) at build time.
- Optional precomputed lightweight search index in static assets.
- No network calls required for core browsing/copy.

---

## 2) Main screens/views

## A. Home (mobile-first)
- Sticky top bar: search + theme toggle.
- Horizontal quick chips: “All”, “Recently used” (session), top categories.
- Featured sets blocks (neutral, practical).
- Symbol grid below fold.

## B. Category view
- Same sticky search bar.
- Category header + optional subfilters.
- Grid scoped to selected category.

## C. Detail drawer/modal
- Open from symbol long-press/click info affordance.
- Shows larger glyph, official name, codepoint, UTF-16/UTF-8 snippets, related symbols.
- Includes explicit “Copy character” and “Copy codepoint” actions.

## D. About/Privacy
- Minimal static page.
- Explains privacy-first behavior and no persistence policy.

---

## 3) Component hierarchy (React + TypeScript)

```txt
<App>
  <AppShell>
    <TopBar>
      <SearchInput />
      <ThemeToggle />
    </TopBar>

    <QuickFilterChips />

    <MainContent>
      <FeaturedSets />
      <SymbolGrid>
        <SymbolCard /> x N
      </SymbolGrid>
    </MainContent>

    <CopyToast />
    <SymbolDetailDrawer />
  </AppShell>
</App>
```

### Suggested file structure
```txt
src/
  app/
    App.tsx
    routes.tsx
  components/
    topbar/SearchInput.tsx
    topbar/ThemeToggle.tsx
    filters/QuickFilterChips.tsx
    symbol/SymbolGrid.tsx
    symbol/SymbolCard.tsx
    symbol/SymbolDetailDrawer.tsx
    feedback/CopyToast.tsx
  hooks/
    useSearchIndex.ts
    useClipboardCopy.ts
    useTheme.ts
    useKeyboardNavigation.ts
  data/
    symbols.min.json
    featuredSets.ts
    categories.ts
  styles/
    tokens.css
    globals.css
```

---

## 4) Mobile-first interaction flow

1. User lands on `/` and immediately sees focused search bar.
2. User types query (name, keyword, or codepoint).
3. Grid updates instantly (debounce kept tiny or none for local indexed search).
4. User taps a symbol card.
5. Character is copied immediately.
6. Lightweight toast confirms copy (non-blocking).
7. Optional long-press or info icon opens detail drawer.
8. Drawer supports additional copy actions without leaving context.

Design principle: **tap = copy**; deeper metadata is secondary.

---

## 5) Desktop interaction flow

1. Autofocus search input on page load.
2. Arrow keys move card focus in grid.
3. Enter copies focused symbol.
4. `Cmd/Ctrl + K` focuses search at any time.
5. `Esc` closes drawer/modals and clears transient UI states.
6. Hover reveals subtle info affordance; click info opens detail drawer.

---

## 6) Search bar behavior

### Functional behavior
- Match against:
  - symbol name
  - aliases/keywords
  - literal character input
  - codepoint formats (`U+1F600`, `1F600`)
- Case-insensitive, diacritic-insensitive matching.
- Prefix + fuzzy contains scoring.
- Highlight matched terms in result metadata (optional).

### UX behavior
- Sticky at top.
- Clear (“×”) control appears when non-empty.
- Instant result count (e.g., “128 results”).
- Empty query = featured + default category browsing state.

### Performance target
- Input-to-render feedback under ~50ms on mid-range mobile devices for common queries.

---

## 7) Symbol card behavior

### Default card content
- Large glyph centered.
- Optional tiny label beneath (shortened name or codepoint).

### Interaction
- **Tap/click primary area**: copy glyph instantly.
- **Long-press (mobile) / info button (desktop)**: open detail drawer.
- Visual states: default, pressed, copied-success flash.

### Size/spacing
- Minimum touch target: 44×44px (prefer 48×48px).
- Dense but breathable grid: 5–7 columns on small phones depending on size mode.

---

## 8) Copy confirmation behavior

- Use a single global toast, bottom-center on mobile, bottom-right on desktop.
- Message format: `Copied: ★` or `Copied U+2605` for alternate copy modes.
- Duration: ~900–1400ms.
- Queue strategy: latest copy replaces prior toast (no stack clutter).
- Add subtle haptic feedback on supported mobile browsers (optional progressive enhancement).

---

## 9) Detail drawer/modal behavior

### Mobile
- Bottom sheet drawer with drag handle.
- Snap points: 60% and 90% height.
- Swipe down or `Esc` (hardware keyboard) to close.

### Desktop
- Right-side drawer or centered modal (right drawer recommended for continuity).
- Focus trap while open.

### Content order
1. Large symbol preview
2. Name and codepoint
3. Copy actions (char/codepoint/HTML entity where relevant)
4. Related symbols
5. Category breadcrumbs

---

## 10) Theme toggle behavior

- Toggle in top bar with sun/moon icon.
- Modes: `light`, `dark`, `system`.
- Default = `system` via `prefers-color-scheme`.
- Persist choice in `localStorage` (acceptable; not a tracker/cookie).
- No animated theme transitions that cause jank.

---

## 11) Accessibility recommendations

- Proper landmarks: `header`, `main`, `nav`, `footer`.
- Search input with explicit `<label>` (visually hidden is fine).
- Cards as real buttons for keyboard/AT semantics.
- Visible focus ring (high contrast).
- Ensure 4.5:1 text contrast minimum.
- `aria-live="polite"` region for copy toast.
- Respect reduced motion (`prefers-reduced-motion`).
- Avoid color-only status indicators; include icon/text.

---

## 12) Clipboard API error/edge-case handling

## Primary path
- `navigator.clipboard.writeText(symbol)` in secure contexts.

## Fallback path
- Hidden textarea + `document.execCommand('copy')` fallback for older browsers.

## Edge cases and responses
- **Permission denied**: show inline/toast “Copy blocked. Long-press to copy manually.”
- **Non-secure context (http)**: same fallback message + expose selectable symbol text in drawer.
- **iOS oddities**: retry once after microtask; if fail, open detail drawer with pre-selected text.
- **Rapid repeated taps**: throttle internal copy calls to avoid race spam, while preserving perceived instant response.

---

## 13) Visual style direction (in words)

- Minimal, calm, utility-first aesthetic.
- Neutral grayscale base with one accent color for focus/active states.
- Soft corners, subtle borders, almost-flat cards (very light elevation only when active).
- Typography: highly legible sans-serif, medium weight for labels, larger glyph emphasis.
- Generous spacing around primary controls, tight spacing inside dense grids.
- Avoid ornamental illustrations; let symbols be the visual focus.

---

## 14) Starter implementation plan

## A. App shell
- Build static React + TypeScript app (Vite + SSG-compatible deployment).
- Add route structure (`/`, `/category/:slug`, `/about`).
- Implement top bar and responsive layout container.

## B. Search UI
- Create `SearchInput` with controlled value and clear action.
- Add keyboard shortcut (`Cmd/Ctrl+K`) and autofocus behavior.
- Wire to `useSearchIndex` hook with memoized results.

## C. Category filters
- Implement horizontal chip row with overflow scroll on mobile.
- “All” and selected category states.
- Keep interaction one-tap without nested menus.

## D. Symbol grid
- CSS Grid with auto-fit columns and consistent card sizing.
- Virtualization optional for very large data; start without it if performance is acceptable.
- Keyboard navigation map (row/column aware).

## E. Copy toast
- Global toast provider.
- `showToast({ type: 'copied', payload })` API.
- `aria-live` integration.

## F. Detail panel
- Bottom sheet on mobile, side drawer on desktop via responsive component.
- Reusable metadata rows and copy action buttons.
- Close by backdrop tap, Esc, and swipe (mobile).

---

## 15) Optional nice-to-have enhancements (later)

- Favorites pinned locally (localStorage, explicit opt-in).
- Recently copied history toggle (local-only).
- Skin tone / variation selector for relevant emoji.
- Multi-copy mode (build a temporary string).
- Offline PWA cache for full no-network usage.
- URL-encoded search state for shareable links.
- Advanced filters (Unicode blocks, script families, symbol width).

---

## Proposed homepage layout

1. **Sticky top row**
   - Search input (dominant)
   - Theme toggle icon
2. **Quick filter chips** (horizontal scroll)
   - All, Recently used, top categories
3. **Featured sets** (2-column cards on mobile, compact)
   - Neutral practical collections
4. **Symbol grid**
   - Immediate tap-to-copy cards
5. **Tiny footer link**
   - About/Privacy

---

## Proposed default featured sets (useful + politically neutral)

1. Punctuation Essentials
2. Arrows & Directions
3. Math & Operators
4. Currency Symbols
5. Checkmarks & Status
6. Stars, Shapes & Bullets
7. Fractions & Superscripts
8. Technical/Editing Symbols
9. Common Emoji Faces
10. Gestures (general use)
11. Weather & Nature Basics
12. Time & Calendar

### Policy handling for controversial symbols
- Keep searchable by exact name/keywords.
- Do not include in featured sets or homepage highlights.
- Ensure neutral ranking defaults prioritize common utility and non-controversial usage.

---

## Suggestions to avoid visual overload on small screens

- Show only one metadata line per card (or none by default).
- Limit featured blocks above fold (max 2 rows).
- Collapse advanced controls behind a single “Filters” sheet.
- Keep iconography minimal and consistent.
- Use one accent color only.
- Maintain strong whitespace rhythm between sections.
- Avoid persistent banners/popups; use transient toast only.
- Cap category chip count initially, expose “More” overflow.
