# PASTE

PASTE is a privacy-first Unicode character and emoji map for people who frequently copy symbols into chats, documents, code, design files, and social posts. It is optimized for **desktop-first workflows** while remaining fully usable on mobile.

## What it is

PASTE is a static React + TypeScript web app that lets you:
- search Unicode symbols and emoji quickly,
- click/tap a symbol to copy instantly,
- browse by practical categories,
- inspect symbol metadata in a side drawer,
- keep local convenience history (Recently Used).

## Who it is for

- writers, editors, support teams, and operations staff
- developers and technical writers
- designers and researchers
- anyone who often needs symbols beyond a standard keyboard

## Why it exists

Most symbol pickers are either hard to search, overloaded with decorative content, or tied to tracking-heavy platforms. PASTE exists to provide a fast, neutral, privacy-respecting symbol utility with practical defaults.

## Current direction (v1)

- Desktop-first, mobile-usable
- Static-first deployment
- No backend in v1
- Search-first workflow
- Instant copy on click/tap
- Neutral featured/default content
- Sensitive/controversial symbols remain accessible via search and category navigation (not featured)

## Current features

- Instant copy from symbol grid cards
- Search across character, name, codepoint, category, tags, keywords, and contextual notes
- Category filtering (including sensitive categories)
- Featured set + all-symbol browsing
- Recently Used section (stored in localStorage)
- Light / Dark / System theme toggle (stored in localStorage)
- Detail drawer with codepoints, keywords, tags, and optional context notes
- Static JSON dataset + curated set metadata

## Current limitations

- No backend sync (favorites/history do not sync across devices)
- No account system, cloud backup, or collaborative curation
- English-first metadata
- Favorites UX is planned but not implemented yet
- No Unicode auto-ingestion pipeline yet (dataset is currently maintained in-repo)

## Privacy principles

PASTE v1 follows a strict privacy baseline:
- no trackers,
- no analytics SDKs,
- no cookies,
- no server-side profiling,
- localStorage only for personal convenience features (theme + Recently Used; Favorites planned).

## Project philosophy

- Utility over novelty
- Neutral defaults, explicit access to everything else
- Practical editorial standards over ad-hoc curation
- Open, inspectable static architecture
- Fast iteration without compromising user privacy

## Tech stack

- Vite
- React 18
- TypeScript
- Static JSON dataset files in `src/data/`

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

## Build

```bash
npm run build
```

Build artifacts are emitted to `dist/`.

To preview the production build locally:

```bash
npm run preview
```

## Deploy to GitHub Pages

This repo is already configured with `base: '/PASTE/'` in `vite.config.ts`, which matches project-pages hosting.

Typical deployment flow:

1. Build locally:
   ```bash
   npm ci
   npm run build
   ```
2. Publish `dist/` to the `gh-pages` branch (via GitHub Action or manual publish tool).
3. In GitHub repo settings, set Pages source to `gh-pages` branch (or `GitHub Actions` if using an action workflow).

### Example GitHub Actions workflow (recommended)

Create `.github/workflows/deploy.yml` that:
- runs on push to `main`,
- installs dependencies,
- runs `npm run build`,
- uploads and deploys `dist/` with `actions/deploy-pages`.

## Important docs

- `ROADMAP.md` – phased implementation plan
- `CONTRIBUTING.md` – coding, data, and editorial contribution rules
- `ARCHITECTURE.md` – UI/data/storage boundaries and future ingestion design
- `CONTENT_CURATION_POLICY.md` – neutral and sensitive-content curation policy
- `SYMBOL_DATASET_V1.md` – dataset notes and schema guidance
