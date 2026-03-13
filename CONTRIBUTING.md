# Contributing to PASTE

Thanks for contributing to PASTE. This project prioritizes utility, neutrality, and privacy. Contributions should improve real-world symbol lookup and copy workflows.

## Core expectations

- Keep the app static-first and backend-free for v1.
- Do not add trackers, analytics SDKs, cookies, or fingerprinting logic.
- Keep interactions fast: search and copy must remain immediate.
- Prefer clear, maintainable TypeScript over framework-heavy abstractions.

## Development workflow

1. Install dependencies: `npm install`
2. Run locally: `npm run dev`
3. Build check before PR: `npm run build`
4. Keep PRs focused (UI, data, docs, or architecture; avoid mixed large PRs when possible).

## Coding expectations

- Use TypeScript types/interfaces for app and data contracts.
- Preserve current UI patterns (functional React components + hooks).
- Keep components focused; avoid large multi-purpose components.
- Avoid introducing global state libraries unless there is clear need.
- Preserve accessibility behavior (keyboard support, semantic controls, visible focus).

## Data and schema expectations

Symbol entries should stay consistent with `src/types.ts` and `src/data/symbols.schema.json`.

Required practical expectations:
- Stable `id`
- Correct `char` and `codepoints`
- Meaningful `name`
- Valid `primaryCategory`
- Useful `searchKeywords` and `tags`

Optional but encouraged:
- `contextualNote` for symbols with ambiguous or sensitive interpretation
- `curatedSets` for pack membership metadata
- `flags.sensitive` where needed for moderation-aware UI treatment (not deletion)

## UI principles

- Desktop-first, mobile-usable layouts
- Search-first interaction model
- Click/tap to copy instantly
- Neutral default surfaces (avoid sensational “featured” choices)
- Avoid unnecessary animation and visual noise

## Editorial rules for categories and featured content

- Featured/default content must prioritize broad, everyday utility.
- Sensitive categories (political, religious, extremist-associated, conflict-linked) remain searchable and category-accessible.
- Sensitive/controversial symbols are not removed solely due to sensitivity.
- Sensitive/controversial symbols should not be featured by default.

## Rules for sensitive/controversial symbols

When adding or editing these symbols:
- Use factual, non-advocacy language.
- Prefer “associated with” phrasing over absolute claims.
- Add context scope when relevant (historical period, region, modern usage).
- Keep notes concise and neutral.
- Do not convert curation decisions into hidden suppression.

## Preferred knowledge sources

For symbol metadata and references, prefer:
1. Unicode (UCD and official Unicode references)
2. CLDR annotations
3. Wikidata
4. DBpedia
5. Other neutral, open references

Avoid a Wikipedia-first sourcing pattern in model design or default linking behavior.

## Curated packs guidelines

Curated packs are allowed and encouraged when they add practical value.

Pack expectations:
- clear use-case-driven theme,
- neutral naming,
- documented inclusion rationale,
- no implicit ranking of ideology/religion/politics in default surfaces.

If a pack contains sensitive symbols, keep the pack discoverable by explicit navigation/search rather than homepage default promotion.

## Proposing new symbols or metadata

Please include in your PR description:
- symbol `id`
- character + codepoint(s)
- proposed category
- search keywords/tags
- whether it is sensitive/contextual
- whether it belongs in featured or only in non-featured categories
- source references (Unicode/CLDR/Wikidata/DBpedia/etc.)

For larger data changes, include a short note on expected search impact and any category trade-offs.
