# @next-modular/content-module

MDX-based content management with frontmatter, collections, and dynamic rendering for Next.js.

## Installation

```bash
npx next-modular add @next-modular/content-module
```

## Usage

```ts
import { contentModule } from '@next-modular/content-module'

export const modules = [
  contentModule({
    contentDir: './content',
    collections: ['blog', 'docs'],
  }),
]
```

## Features

- **MDX Rendering** — Write content in MDX with full React component support.
- **Frontmatter** — Parse YAML frontmatter for metadata (title, date, tags, etc.)
- **Collections** — Organize content into typed collections with schema validation.
- **Search** — Built-in content indexing for fast client-side search.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `contentDir` | `string` | `'./content'` | Directory containing MDX files |
| `collections` | `string[]` | `[]` | Named content collections to register |
| `basePath` | `string` | `'/content'` | Base URL path for content routes |
| `search` | `boolean` | `true` | Enable search indexing |

## Routes

The module auto-registers routes for each collection:

- `/{basePath}/{collection}` — Collection listing page
- `/{basePath}/{collection}/[slug]` — Individual content page

## API Routes

| Path | Method | Description |
|------|--------|-------------|
| `/api/content/search` | `GET` | Search across all collections |
| `/api/content/[collection]` | `GET` | List items in a collection |

## Content File Format

```mdx
---
title: My First Post
date: 2025-01-15
tags: [nextjs, tutorial]
---

# Hello World

This is an MDX file with **full React component support**.

<MyCustomComponent prop="value" />
```
