import fs from 'node:fs'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
import { defineConfig } from 'astro/config'
import { expressiveCodeOptions } from './src/site.config'

// Remark plugins
import remarkDirective from 'remark-directive' /* Handle ::: directives as nodes */
import remarkUnwrapImages from 'remark-unwrap-images'
import { remarkAdmonitions } from './src/plugins/remark-admonitions' /* Add admonitions */
import { remarkReadingTime } from './src/plugins/remark-reading-time'

// Rehype plugins
import rehypeExternalLinks from 'rehype-external-links'

// redirect based on previous webiste naming
const redirectList = [
  {
    id: 1,
    source: '/turning-22/',
    destination: '/posts/turning_22/',
    permanent: true,
  },
  {
    id: 2,
    source: '/year-2023/',
    destination: '/posts/year-2023/',
    permanent: true,
  },
  {
    id: 3,
    source: '/prague-diaries-1/',
    destination: '/posts/prague-diaries-1/',
    permanent: true,
  },
  {
    id: 4,
    source: '/pgsqlphriday-14/',
    destination: '/posts/pgsqlphriday_14/',
    permanent: true,
  },
  {
    id: 5,
    source: '/gsoc-post-3/',
    destination: '/posts/gsoc-post-3/',
    permanent: true,
  },
  {
    id: 6,
    source: '/packaging-extensions-in-debian/',
    destination: '/posts/packaging_extensions_in_debian/',
    permanent: true,
  },
  {
    id: 7,
    source: '/magic-with-generate-series/',
    destination: '/posts/magic_with_generate_series/',
    permanent: true,
  },
  {
    id: 7,
    source: '/recursive-macros/',
    destination: '/posts/recursive_macros/',
    permanent: true,
  },
  {
    id: 8,
    source: '/gsoc-post-2/',
    destination: '/posts/gsoc_post_2/',
    permanent: true,
  },
  {
    id: 9,
    source: '/understanding-postgresql/',
    destination: '/posts/understanding_postgresql/',
    permanent: true,
  },
  {
    id: 10,
    source: '/start-with-passion-gsoc23/',
    destination: '/posts/start-with-passion-gsoc23/',
    permanent: true,
  },
  {
    id: 11,
    source: '/music-blog-1/',
    destination: '/posts/music-blog-1',
    permanent: true,
  },
  {
    id: 12,
    source: '/kwoc-2021/',
    destination: '/posts/kwoc-2021/',
    permanent: true,
  },
  {
    id: 13,
    source: '/felvin-intern/',
    destination: '/posts/felvin-intern/',
    permanent: true,
  },
]

const redirects: { [key: string]: string } = {}

for (const redirect of redirectList) {
  redirects[redirect.source] = redirect.destination
}

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ['webmention.io'],
  },
  integrations: [
    expressiveCode(expressiveCodeOptions),
    icon(),
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
    sitemap(),
    mdx(),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ['nofollow, noreferrer'],
          target: '_blank',
        },
      ],
    ],
    remarkPlugins: [remarkUnwrapImages, remarkReadingTime, remarkDirective, remarkAdmonitions],
    remarkRehype: {
      footnoteLabelProperties: {
        className: [''],
      },
    },
  },
  // https://docs.astro.build/en/guides/prefetch/
  prefetch: true,
  // ! Please remember to replace the following site property with your own domain
  site: 'https://rajivharlalka.in/',
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
    plugins: [rawFonts(['.ttf', '.woff'])],
  },
  redirects: redirects
})

function rawFonts(ext: string[]) {
  return {
    name: 'vite-plugin-raw-fonts',
    // @ts-expect-error:next-line
    transform(_, id) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id)
        return {
          code: `export default ${JSON.stringify(buffer)}`,
          map: null,
        }
      }
    },
  }
}
