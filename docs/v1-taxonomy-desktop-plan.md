# V1 Taxonomy + Desktop-First UX Plan

## 1) V1 taxonomy redesign (implementation target)

### Primary entities
- `symbol` (codepoint-backed item)
- `category` (single primary classification used for nav chips)
- `tags[]` (secondary metadata for search/filter/context)
- `flags[]` (UI behavior flags, e.g., hide-from-featured)

### Data model (practical)
```ts
interface SymbolItem {
  id: string;
  char: string;
  name: string;
  codepoint: string;
  category: CategorySlug;   // one primary nav category
  tags: string[];           // multi-context classification
  keywords: string[];       // search synonyms
  aliases?: string[];
  flags?: {
    excludeFromFeatured?: boolean;
    contextualNote?: boolean;
  };
  context?: {
    regions?: string[];
    eras?: string[];
    notes?: string;
  };
}
```

---

## 2) Category + tags model

### Main categories (navigation chips)
Use short, utility-first chips for top-level browsing:
- `Punctuation & Writing`
- `Math & Logic`
- `Arrows & Navigation`
- `Currency & Finance`
- `Technical & Computing`
- `Shapes & Bullets`
- `Units & Measurement`
- `Latin Accents & Letters`
- `Emoji (People)`
- `Emoji (Objects)`
- `Emoji (Nature)`
- `Emoji (Symbols)`
- `Religious & Spiritual`
- `Political & Ideological`
- `Historical & Cultural`

### Tags only (metadata/search, not top-chip by default)
- Context: `state`, `military`, `civic`, `ceremonial`, `devotional`, `protest`, `movement`, `heritage`, `mythic`
- Time: `ancient`, `medieval`, `modern`, `contemporary`
- Region: `global`, `europe`, `mena`, `south-asia`, `east-asia`, `africa`, `americas`
- Usage: `formal-writing`, `accessibility`, `office`, `education`, `programming`, `typography`
- Sensitivity handling: `context-dependent`, `contested-usage`, `historically-traumatic`, `extremist-association`

---

## 3) Overlap handling (religious/political/historical/cultural)

Implementation rule:
- Keep **one primary category** for stable chip placement.
- Add **multiple tags** for secondary meanings.
- Add a short `context.notes` line when interpretation is commonly context-dependent.

Practical precedence for assigning primary category:
1. Unicode/common-name dominant use
2. Highest-frequency modern use in general reference datasets
3. If still ambiguous: choose `Historical & Cultural` + tags for current domains

Example:
- Symbol X → `category: "Historical & Cultural"`
- `tags: ["religious", "political", "context-dependent", "modern"]`

---

## 4) Neutral naming set for sensitive groupings

Recommended production labels:
- Political / ideological → `Political & Ideological`
- Religious / spiritual → `Religious & Spiritual`
- Historical / cultural → `Historical & Cultural`
- Sensitive/contextual overlay (tag/flag, not major featured chip) → `Context-Dependent` (tag) and `excludeFromFeatured: true` (flag)

Avoid labels that imply editorial judgement; keep meaning in tags + short notes.

---

## 5) Desktop-first UX refinement plan

### Layout hierarchy (desktop)
1. Sticky top bar: search, theme, quick shortcuts
2. Left filter rail (chips + subfilters)
3. Wide center results grid
4. Persistent right details panel (selected symbol preview + copy variants)

### Wider desktop grid
- `xl`: 10–14 columns (size mode dependent)
- `lg`: 8–10 columns
- `md`: 6–8 columns
- Keep larger glyph size with compact metadata row

### Persistent side preview/details panel
- Always visible on desktop (`min-width >= 1100px`)
- Shows selected symbol, unicode metadata, tags, related symbols
- Contains copy actions: char, codepoint, HTML entity

### Keyboard navigation
- `/` or `Cmd/Ctrl + K` → focus search
- Arrow keys → move selection in grid
- `Enter` → copy selected symbol
- `Shift + Enter` → open details focus
- `Esc` → clear overlays/focus state

### Search-first workflow
- Search is default entry state on desktop
- Query + category filters compose (AND logic)
- Result count + active filter pills always visible
- Recent local searches (device-only storage) optional

### Copy interaction
- Single-click copy on grid item
- Non-blocking toast in lower-right desktop
- Keep selection on copied card for rapid repeated copying
- Optional multi-copy tray (phase 2)

---

## 6) Mobile fallback (usable, not primary design center)

- Keep top search bar sticky
- Collapse left rail into horizontal chip scroller + “More filters” sheet
- Grid reduced to 4–6 columns based on viewport
- Details panel becomes bottom sheet
- Keep keyboard shortcuts where hardware keyboards exist
- Preserve identical taxonomy and tag semantics

---

## 7) Homepage/featured structure review

Desktop-first v1 homepage should shift from “showcase cards” to “workbench”:
- Primary: large search input + quick category chips
- Secondary: utility starter sets (punctuation, arrows, math, currency, UI marks)
- Tertiary: recent copies (local only)

Keep policy:
- Sensitive/context-dependent symbols remain searchable and category-browsable
- Exclude those from featured defaults via `excludeFromFeatured` flag

---

## 8) Immediate codebase changes (next actions)

1. **Types/data migration**
   - Extend `src/types.ts` with `tags`, `flags`, and `context` fields.
   - Backfill `src/data/symbols.json` with new category slugs + metadata tags.

2. **Filter architecture**
   - Update `CategoryFilters.tsx` for desktop left-rail layout and tag filter support.
   - Keep tag filters optional/secondary (search metadata level).

3. **Desktop shell**
   - Refactor `App.tsx` and `styles.css` to 3-column desktop layout with persistent right panel.
   - Keep current mobile drawer behavior as fallback.

4. **Selection state + keyboard support**
   - Add focused-card index and key handlers in `SymbolGrid.tsx` + `App.tsx`.
   - Support `Cmd/Ctrl + K`, arrows, `Enter`, and `Esc` behavior.

5. **Featured gating**
   - Ensure homepage/featured logic filters `flags.excludeFromFeatured === true`.
   - Do not remove from search results.

6. **Search indexing quality**
   - Expand search index fields to include tags/aliases/context terms.
   - Keep exact char/codepoint matches highest priority.
