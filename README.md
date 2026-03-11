# Unicode & Emoji Map (Static App)

First working version of a mobile-first, static Unicode character + emoji map built with **Vite + React + TypeScript**.

## Features

- Fast local search (name, character, codepoint, keywords)
- Instant copy on card tap/click
- Category filters
- Detail panel for selected symbol
- Light/dark theme toggle (saved to localStorage)
- Local JSON dataset only (no backend)
- No analytics, no cookies
- Controversial symbols remain searchable but are excluded from default featured/home module

## Project structure

```txt
.
├── index.html
├── package.json
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── types.ts
│   ├── components
│   │   ├── CategoryFilters.tsx
│   │   ├── DetailDrawer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SymbolGrid.tsx
│   │   └── ThemeToggle.tsx
│   ├── data
│   │   └── symbols.json
│   ├── hooks
│   │   └── useTheme.ts
│   └── utils
│       └── clipboard.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite (typically `http://localhost:5173`).

## Build for static deployment

```bash
npm run build
```

Build output is generated in `dist/`. Deploy the `dist/` folder to any static host (Netlify, Vercel static, Cloudflare Pages, GitHub Pages, S3 + CDN, etc.).

To test the production build locally:

```bash
npm run preview
```

## Product planning docs

- `CONTENT_CURATION_POLICY.md`
- `docs/v1-ui-architecture.md`
- `docs/v1-taxonomy-desktop-plan.md`

