# Unicode Map Content Curation Policy

## 1) Homepage/default content policy
- Default surfaces (homepage, hero, onboarding, starter packs) should prioritize everyday utility: punctuation, math, currency, arrows, accessibility, office/workflow, and general emoji.
- Do not place political, religious, extremist, militia, or historically traumatic symbols in default promotional placements.
- Use stable, documented inclusion criteria based on utility and frequency across broad use cases, not ideology.
- Keep the homepage function-first: search, category entry points, recent history, and user-customized shortcuts.

## 2) Rules for featured/default symbol sets
A symbol is eligible for featured/default sets only if all are true:
- Primary use is general-purpose (communication, formatting, measurement, navigation, status, or common expression).
- It is not strongly associated with a specific ideology, movement, conflict, or proselytizing context.
- It does not require historical/political context to interpret safely.
- It is broadly useful across geographies and sectors.

Exclusion from featured/default sets includes:
- Political emblems, campaign marks, party symbols.
- Religious icons used devotionally or sectarianly.
- Extremist or hate-associated marks.
- War/conflict insignia and symbols strongly tied to atrocities.

## 3) Rules for search/category-only availability
The following should remain fully available but only through explicit search or category navigation:
- Political and governmental emblems.
- Religious and spiritual symbols.
- Extremist, hate-associated, or historically traumatic symbols.
- Military insignia and conflict-era iconography.
- Region-specific symbols with known contentious interpretation.

Access principles:
- No hidden removal from database/reference.
- No indexing suppression in normal search relevance.
- No promotional boosts, "trending" boosts, or default pinning.

## 4) Neutral taxonomy strategy for sensitive/controversial symbols
Use descriptive, non-judgmental metadata fields:
- `domain`: politics, religion, state, military, historical, civic, culture.
- `context`: ceremonial, devotional, historical, extremist-association, reclaimed, ambiguous.
- `time-scope`: ancient, medieval, modern, contemporary.
- `region-scope`: global or region tags.
- `sensitivity`: informational flag for UI handling only (not deletion).

Taxonomy rules:
- Separate character identity from social context (codepoint data vs. usage notes).
- Support multi-tagging for cross-cultural meaning.
- Maintain changelogged metadata updates as norms evolve.

## 5) Suggested label language for sensitive categories
Use plain and consistent labels:
- "Political symbols"
- "Religious symbols"
- "Historical symbols"
- "Military and state insignia"
- "Symbols with extremist associations"
- "Multi-context / contested interpretation"

Label style guidance:
- Prefer "associated with" over absolute statements.
- Avoid moralizing adjectives in category names.
- Keep labels short; put nuance in expandable notes.

## 6) Contextual notes without preachiness
For sensitive entries, include optional short notes:
- Structure: **What it is** → **Common contexts** → **Potential sensitivity**.
- Keep factual and concise (1–3 lines).
- Example template: "Used in [historical/cultural/religious] contexts; interpretation varies by region and era. In some modern contexts, it may be associated with [movement/ideology]."
- Link to neutral references only when needed.
- Avoid advocacy language, directives, or rhetorical framing.

## 7) Edge-case recommendations (multiple meanings)
For symbols with diverging meanings across cultures/history:
- Attach parallel context tags rather than selecting a single "true" meaning.
- Show region/time qualifiers near meaning summaries.
- Default sort should not prioritize the most controversial meaning first.
- If one meaning has high risk of misuse, display a brief "context varies" note before copy/export.
- Keep original Unicode name visible to reduce editorial reinterpretation.

## 8) Default featured symbol pack (non-political, broadly useful)
Recommended starter pack categories:
- Core punctuation: `… — • · § ¶`
- Arrows and direction: `← ↑ → ↓ ↔ ⇧ ⇩`
- Math/common operators: `± × ÷ ≈ ≠ ≤ ≥ ∞`
- Currency and commerce: `$ € £ ¥ ₹ ¢`
- Check/status/UI marks: `✓ ✔ ✕ ✖ ○ ● ◻ ◼`
- Time/weather basics: `☀ ☁ ☂ ☎ ⏰`
- Accessibility and wayfinding basics: `♿ 🚻 ℹ`
- Common neutral emoji: `🙂 👍 👎 👋 🙌 ✅ ❗`

Pack constraints:
- No flags, party marks, religious icons, or conflict-linked symbols.
- Revalidate quarterly based on neutrality and utility criteria.

## 9) Avoiding accidental ideological prominence
- Do not rank sensitive symbols by global popularity on homepage modules.
- Exclude sensitive categories from random "discover" carousels by default.
- Use deterministic, utility-first featured ordering (editorial list + periodic review).
- Separate "recently searched" (private/user-level) from public "trending" displays.
- Add guardrails in recommendation systems: no auto-promotion from controversy-driven spikes.
- Log and review exposure metrics for sensitive classes in featured surfaces.

## 10) Editorial guidelines for future maintainers
- Apply the same inclusion/exclusion standards across all ideologies and religions.
- Document every featured-set decision with a short rationale.
- Require two-person review for taxonomy changes affecting sensitive labels.
- Version metadata and keep an auditable change history.
- Reassess labels periodically for neutrality and clarity.
- Treat availability and promotion as separate decisions: searchable access is broad; featured visibility is constrained.
- If uncertain, default to search/category availability rather than homepage featuring.
