# rajivharlalka.in

Personal blog of Rajiv Harlalka — https://rajivharlalka.in/

Built with [Astro](https://astro.build) (MDX + Tailwind CSS), deployed to GitHub Pages.

## Development

Requires Node 18+ and pnpm.

```sh
pnpm install
pnpm dev      # dev server at localhost:4321
pnpm build    # production build to dist/ (includes pagefind search index)
pnpm check    # type diagnostics
pnpm lint     # Biome lint
pnpm format   # format all files
```

Content lives in `src/content/post/<slug>/index.{md,mdx}`. See
[AGENTS.md](./AGENTS.md) for full architecture notes and authoring conventions.
