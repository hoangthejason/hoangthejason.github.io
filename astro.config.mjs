import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeCitation from 'rehype-citation';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight
} from '@shikijs/transformers';

import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { remarkCallouts } from './src/plugins/remark-callouts.mjs';
import { rehypeFigure } from './src/plugins/rehype-figure.mjs';
import { rehypeMermaid } from './src/plugins/rehype-mermaid.mjs';

const site = process.env.PUBLIC_SITE_URL || 'https://hoangthejason.github.io';

export default defineConfig({
  site,
  base: '/',
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true,
      transformers: [
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: 'v3' }),
        transformerNotationHighlight({ matchAlgorithm: 'v3' }),
        transformerNotationErrorLevel({ matchAlgorithm: 'v3' })
      ]
    },
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkDirective,
      remarkReadingTime,
      remarkCallouts
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['heading-anchor'],
            ariaLabel: 'Permalink for this section'
          },
          content: [{ type: 'text', value: ' #' }]
        }
      ],
      rehypeKatex,
      rehypeFigure,
      rehypeMermaid,
      rehypeCitation
    ]
  }
});
