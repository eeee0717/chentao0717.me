import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import fs from 'fs-extra'
import Inspect from 'vite-plugin-inspect'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import Vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import AutoImport from 'unplugin-auto-import/vite'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import GitHubAlerts from 'markdown-it-github-alerts'
import UnoCSS from 'unocss/vite'
import SVG from 'vite-svg-loader'
import MarkdownItShiki from '@shikijs/markdown-it'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import MarkdownItMagicLink from 'markdown-it-magic-link'
import MarkdownItFootnote from 'markdown-it-footnote'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Yaml from 'unplugin-yaml/vite'

// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'

const promises: Promise<any>[] = []
const postIdPattern = /^\d+$/
const seenPostIds = new Map<string, string>()

function isPostPage(path: string) {
  return path.includes('/pages/posts/') && path.endsWith('.md') && !path.endsWith('/pages/posts/index.md')
}

export default defineConfig({
  resolve: {
    alias: [
      { find: '~/', replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat',
    ],
  },
  ssr: {
    noExternal: ['gsap'],
  },
  plugins: [
    UnoCSS(),

    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      logs: true,
      extendRoute(route) {
        const path = route.components.get('default')
        if (!path)
          return

        const normalizedPath = path.replaceAll('\\', '/')
        if (normalizedPath.includes('projects.md') || normalizedPath.includes('collections.md') || !normalizedPath.endsWith('.md'))
          return

        const { data } = matter(fs.readFileSync(path, 'utf-8'))
        const frontmatter = { ...data } as Record<string, unknown>

        if (isPostPage(normalizedPath)) {
          const postId = typeof frontmatter.postId === 'string' ? frontmatter.postId.trim() : ''
          if (!postId)
            throw new Error(`Missing "postId" in ${normalizedPath}`)
          if (!postIdPattern.test(postId))
            throw new Error(`Invalid "postId" in ${normalizedPath}: "${postId}". Use digits only.`)

          const duplicatedPath = seenPostIds.get(postId)
          if (duplicatedPath && duplicatedPath !== normalizedPath)
            throw new Error(`Duplicate "postId" ${postId} in ${normalizedPath} and ${duplicatedPath}`)
          seenPostIds.set(postId, normalizedPath)

          route.path = `/posts/${postId}`
          frontmatter.postId = postId
        }

        route.addToMeta({
          frontmatter,
        })
      },
    }),

    Vue({
      include: [/\.vue$/, /\.md$/],
      script: {
        defineModel: true,
      },
    }),

    Markdown({
      wrapperComponent: id => id.includes('/demo/')
        ? 'WrapperDemo'
        : 'WrapperPost',
      wrapperClasses: (id, code) => code.includes('@layout-full-width')
        ? ''
        : 'prose m-auto slide-enter-content',
      headEnabled: true,
      exportFrontmatter: false,
      exposeFrontmatter: false,
      exposeExcerpt: false,
      markdownItOptions: {
        quotes: '""\'\'',
      },
      async markdownItSetup(md) {
        md.use(await MarkdownItShiki({
          themes: {
            dark: 'vitesse-dark',
            light: 'vitesse-light',
          },
          defaultColor: false,
          cssVariablePrefix: '--s-',
          transformers: [
            transformerTwoslash({
              explicitTrigger: true,
              renderer: rendererRich(),
            }),
          ],
        }))

        md.use(anchor, {
          permalink: anchor.permalink.linkInsideHeader({
            symbol: '#',
            renderAttrs: () => ({ 'aria-hidden': 'true' }),
          }),
        })

        md.use(LinkAttributes, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: '_blank',
            rel: 'noopener',
          },
        })

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          containerHeaderHtml: '<div class="table-of-contents-anchor"><div class="i-ri-menu-2-fill" /></div>',
        })

        md.use(MarkdownItMagicLink, {
          linksMap: {
            'CherryStudio': 'https://github.com/CherryHQ/cherry-studio',
            'Leetcode-master': 'https://github.com/youngyangyang04/leetcode-master',
            'CS-base': 'https://github.com/xiaolincoder/CS-Base',
            'Leetcode-extension': 'https://github.com/ccagml/leetcode-extension',
          },
        })

        md.use(GitHubAlerts)
        md.use(MarkdownItFootnote)
      },

    }),

    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        '@vueuse/core',
      ],
    }),

    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),

    Inspect(),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),

    SVG({
      svgo: false,
      defaultImport: 'url',
    }),

    Yaml(),

    {
      name: 'await',
      async closeBundle() {
        await Promise.all(promises)
      },
    },
  ],

  build: {
    rollupOptions: {
      onwarn(warning, next) {
        if (warning.code !== 'UNUSED_EXTERNAL_IMPORT')
          next(warning)
      },
    },
  },

  ssgOptions: {
    formatting: 'minify',
  },
})
