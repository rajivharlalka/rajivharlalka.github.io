# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

Personal blog/site of Rajiv Harlalka, built with **Astro 5** (static output), Tailwind CSS 3,
MDX content collections, and deployed to **GitHub Pages** via `.github/workflows/ci.yml`
(push to `master` triggers build + deploy; production site is https://rajivharlalka.in/).

Based on the `astro-cactus` theme (heavily modified). Package name in `package.json` is a
leftover from the theme — not meaningful.

## Commands

Package manager is **pnpm** (`pnpm-lock.yaml`). Use pnpm for everything.

| Command         | What it does                                              |
| --------------- | --------------------------------------------------------- |
| `pnpm dev`      | Dev server at localhost:4321                              |
| `pnpm build`    | Full production build to `dist/` + pagefind search index  |
| `pnpm preview`  | Preview the built site                                    |
| `pnpm lint`     | Biome lint                                                |
| `pnpm format`   | Format everything (Biome for ts/js, Prettier for .astro) |
| `pnpm check`    | `astro check` TypeScript diagnostics for .astro files     |

Verification workflow before finishing any task:

1. `pnpm check` — type errors (strictest TS config)
2. `pnpm lint` — Biome
3. If you touched formatting-sensitive files: `pnpm format`

There are no tests. Do not invent a test framework.

## Architecture

```
src/
├── site.config.ts        # Site-wide config: title, author, dates, menu links, webmentions,
│                         # expressive-code theme options. Import via alias `@/site-config`.
├── types.ts              # Shared types (SiteConfig etc.), import via `@/types`
├── content/
│   ├── config.ts         # Zod schema for the `post` collection (see below)
│   └── post/<slug>/index.{md,mdx}   # One directory per post, co-located images/assets
├── data/post.ts          # Post helpers: getAllPosts, sorting, grouping by year, tags
├── plugins/              # Remark plugins: remark-admonitions, remark-reading-time
├── layouts/              # Base.astro (HTML shell), BlogPost.astro, MDXLayout.astro
├── components/           # BaseHead (SEO/meta), layout/{Header,Footer}, blog/*, ThemeToggle...
├── pages/                # File-based routes (see Routing below)
├── styles/global.css     # Global CSS + tailwind layers
└── utils/                # date.ts, generateToc.ts, webmentions.ts, domElement.ts
```

### Path aliases

Configured in both `tsconfig.json` and used across code:

- `@/components/*`, `@/layouts/*`, `@/utils/*`, `@/data/*`, `@/assets/*`
- `@/site-config` → `src/site.config.ts`
- `@/types` → `src/types.ts`

## Content Authoring

Posts live in `src/content/post/<slug>/index.md` or `index.mdx`. The slug becomes the URL:
`https://rajivharlalka.in/posts/<slug>/`.

Frontmatter schema (enforced by Zod in `src/content/config.ts`):

```yaml
---
title: 'Max 60 chars'            # required
description: '40–160 chars'      # required, min 40 max 160
publishDate: '3 January 2026'    # required, parsed to Date
draft: false                     # optional, default false
tags: ['life', 'tech']           # optional, lowercased + deduped automatically
coverImage:                      # optional { src: image(), alt: string }
ogImage: '/path/to/image'        # optional override
updatedDate: '...'               # optional
---
```

Notes:

- Drafts are hidden only in production builds (`import.meta.env.PROD` check in
  `src/data/post.ts`); they appear in dev.
- Images referenced in frontmatter `coverImage.src` are processed by Astro's image pipeline;
  put them next to the post and use relative paths.
- Admonitions are available via `:::note`, `:::tip`, etc. directives
  (implemented in `src/plugins/remark-admonitions.ts`).
- External links automatically get `target="_blank"` + nofollow/noreferrer.

When changing an existing post's slug, add a redirect entry to `redirectList` in
`astro.config.ts` (many legacy slugs use underscores there).

## Routing

- `/` home (`src/pages/index.astro`)
- `/posts/` paginated list (`[...page].astro`), `/posts/<slug>/` single post (`[...slug].astro`)
- `/tags/<tag>/...` tag listings
- Static pages: `/about/`, `/now/` (MDX), `/contact/`, `/resume/`
- `/rss.xml` feed, sitemap via integration
- OG images generated per-post at build time by `src/pages/og-image/[...slug].png.ts`
  using satori + resvg (requires `@resvg/resvg-js`; excluded from vite optimizeDeps)

## Styling & Formatting

- Tailwind 3 via `@astrojs/tailwind` with `applyBaseStyles: false`; config in
  `tailwind.config.ts`, base styles in `src/styles/global.css`.
- Dark mode: class-based via `[data-theme='dark']` (see `ThemeProvider.astro`).
- Formatting is split: **Biome** formats ts/js/json (tabs, double quotes, semicolons,
  trailing commas); **Prettier** (with prettier-plugin-astro + tailwindcss plugins) handles
  `.astro` files which Biome ignores. Markdown/mdx are excluded from formatting.
- Indentation: tabs, width 2. Line width: 100 (80 for markdown).
- TS config extends `astro/tsconfigs/strictest` — expect strict null checks, no implicit any.

## Gotchas

- `astro.config.ts` contains a long hand-written `redirectList` preserving URLs from a
  previous site; don't remove entries when refactoring.
- `site` property must stay `https://rajivharlalka.in/` (canonical URLs, RSS, sitemap).
- Webmentions are wired through webmention.io (`WEBMENTION_API_KEY` secret at build time);
  related code in `src/utils/webmentions.ts` and `src/components/blog/webmentions/`.
- Search is client-side pagefind, built by the `postbuild` script against `dist/` — it does
  not exist during `pnpm dev`.
- Fonts in `src/assets/*.ttf` are inlined via a custom vite plugin (`rawFonts`) in
  `astro.config.ts`.
