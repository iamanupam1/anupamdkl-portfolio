# anupamdkl Portfolio

A personal portfolio built with [Astro](https://astro.build) featuring dark/light themes, View Transitions, and content-driven architecture.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321)

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint and format with Biome |
| `npm run lint:check` | Check lint without fixing |

## Content

All frontend content is driven by markdown files in `src/content/`. See [docs/content-guide.md](docs/content-guide.md) for details on editing.

## Tech Stack

- **Framework**: Astro 4
- **Fonts**: Syne + Outfit (Google Fonts)
- **Animations**: Motion library
- **Linting**: Biome + lint-staged + Husky
- **Deployment**: Static site (works with Vercel, Netlify, etc.)
