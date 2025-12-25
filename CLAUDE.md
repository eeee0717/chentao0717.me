# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website/blog built with Vue 3 and Vite, using Static Site Generation (SSG) for production builds. The site is primarily content-focused, with markdown files automatically converted to Vue components and routes.

**Live site**: https://chentao0717.cn

## Core Architecture

### File-Based Routing System

- Routes are automatically generated from files in the `pages/` directory using `unplugin-vue-router`
- Both `.vue` and `.md` files become routes
- Markdown files are converted to Vue components via `unplugin-vue-markdown`
- Route metadata is extracted from markdown frontmatter during build (see `vite.config.ts:50-61`)

### Markdown Processing Pipeline

Markdown files go through several transformations:

1. **Frontmatter extraction**: Using `gray-matter`, frontmatter is parsed and injected into route meta
2. **Wrapper components**:
   - Files in `/demo/` directory → wrapped with `WrapperDemo`
   - All other markdown → wrapped with `WrapperPost`
3. **Special directives**:
   - `@layout-full-width` in markdown content removes prose wrapper classes
   - `art: 'plum'|'dots'|'random'` in frontmatter adds decorative animations

### Markdown Features

Configured markdown-it plugins provide:

- **Shiki syntax highlighting** with dual themes (vitesse-light/dark)
- **TypeScript Twoslash** for interactive type hovers (requires explicit trigger)
- **Anchor links** with `#` symbols inside headers
- **Table of contents** via `[[toc]]` directive (levels 1-4)
- **GitHub Alerts** for callouts/admonitions
- **Magic Links**: Shortcuts like `CherryStudio`, `MicaApps` expand to full URLs (see `vite.config.ts:121-129`)
- **Auto external links**: External URLs get `target="_blank" rel="noopener"`

### Frontmatter Schema

Standard blog post frontmatter (see `src/types.ts`):

```yaml
---
title: Post Title # Required
date: 2025-01-16 # Required for posts
lang: zh # Optional: 'zh' for Chinese
duration: 10min # Optional: reading time
type: blog # Optional: filters post type
draft: true # Hides from post list
private: true # Prevents Git commit (see below)
art: connections|dots|random # Optional: decorative animation
---
```

### Private Content Protection

Three ways to prevent content from being committed to Git:

1. **Directory-based**: Place files in `pages/private/`
2. **Naming convention**: Use `*.private.md` extension
3. **Frontmatter flag**: Add `private: true`

A pre-commit hook (`script/check-private.cjs`) blocks commits containing private content. Files matching patterns 1-2 are also gitignored.

### Auto-Import System

- **Vue APIs**: `ref`, `computed`, `onMounted`, etc. auto-imported
- **Vue Router**: `useRouter`, `useRoute`, etc. via `unplugin-vue-router`
- **VueUse**: All composables like `useDark`, `useStorage`
- **Components**: All `.vue` files in `src/components/` auto-registered
- **Icons**: Use `<i-{collection}-{name} />` syntax (e.g., `<i-ri-menu-2-fill />`)

Path alias: `~/` resolves to `src/`

### Styling Architecture

- **UnoCSS** for utility-first styling (see `unocss.config.ts`)
- Custom shortcuts: `bg-base`, `color-base`, `border-base` for theme-aware colors
- Dynamic shortcuts: `btn-{color}` generates themed buttons
- Fonts: Inter (sans), DM Mono (mono), Roboto Condensed, Bad Script (decorative)
- Dark mode via `useDark()` composable with View Transition API animation

### Static Site Generation

- Uses `vite-ssg` for pre-rendering all routes at build time
- Build output in `dist/` directory
- Deployed to Netlify (configured in `netlify.toml`)

## Development Commands

```bash
# Development server (port 3333)
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Lint and auto-fix
pnpm lint

# Run Python utility script (for photos/data processing)
pnpm py
```

## Key Technical Details

### Route Filtering Logic

When listing posts (see `src/components/ListPosts.vue:14`), routes are filtered by:

- Path starts with `/posts`
- Has `frontmatter.date`
- NOT marked with `frontmatter.draft`
- Matches `type` prop (e.g., `type: 'blog'`)

### Global State

- `isDark`: Dark mode state (persisted to localStorage)
- `englishOnly`: Language filter state (persisted to localStorage as `chentao-english-only`)

### Special Pages

- `pages/projects.md`: Excluded from frontmatter extraction in routing (see `vite.config.ts:55`)
- `demo/` directory: Uses special wrapper and different styling

### Git Hooks

Managed by `simple-git-hooks`:

- **pre-commit**: Runs private content check, then `lint-staged`
- **lint-staged**: Runs ESLint with auto-fix on all staged files

To reinstall hooks after package.json changes:

```bash
npx simple-git-hooks
```

## Build Output

The SSG build:

1. Pre-renders all routes to static HTML
2. Minifies output (`ssgOptions.formatting: 'minify'`)
3. Generates `dist/` directory ready for static hosting
4. Netlify redirects all routes to `/index.html` for SPA fallback
