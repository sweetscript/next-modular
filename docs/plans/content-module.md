# Content Module Plan

## Package

`@next-modular/content-module`

## Purpose

MDX-based content management. Reads `.mdx` files from a directory and renders them as pages with frontmatter support.

## Features

- Renders MDX files as pages at `/content/[...slug]`
- Frontmatter parsing (title, date, tags, description, etc.)
- Collections (list content by tag/type)
- Table of contents generation
- Code syntax highlighting

## Module Definition

- **basePath:** `/content`
- **Routes:**
  - `/content` (index/listing page)
  - `/content/[...slug]` (individual content pages)
- **API:**
  - `GET /api/content` (list all content with metadata)
  - `GET /api/content/[slug]` (get single content metadata)
- **Middleware:** None

## Config Options

```ts
interface ContentModuleConfig {
  contentDir?: string                     // Default: "./content" (relative to project root)
  collections?: {
    [name: string]: {
      pattern?: string                    // Glob pattern within contentDir
      sort?: 'date' | 'title'
      order?: 'asc' | 'desc'
    }
  }
  syntaxHighlight?: boolean              // Default: true
  tableOfContents?: boolean              // Default: true
}
```

## How It Works

### Runtime approach
1. Request hits `/content/my-post`
2. Module resolves slug to file path: `contentDir/my-post.mdx`
3. Reads file, parses frontmatter with `gray-matter`
4. Compiles MDX with `next-mdx-remote`
5. Renders with layout component

### Build-time approach (preferred if feasible)
1. At build time, scan `contentDir` for all `.mdx` files
2. Generate a manifest with metadata (frontmatter, slug, path)
3. At runtime, use manifest for listing/filtering
4. Individual pages still compile MDX on request (cached) OR pre-compile all at build

### Decision: Runtime for v1
Runtime compilation is simpler to implement within next-modular's module system since modules register at runtime. Build-time would require hooking into Next.js build process which is outside next-modular's current scope. We can add build-time caching/pre-compilation later as an optimisation.

## Exported Utilities

- `getContentList(collection?)` get metadata for all content or by collection
- `getContent(slug)` get single content + compiled MDX
- `ContentRenderer` component to render compiled MDX

## Implementation Tasks

- [ ] Create module scaffold
- [ ] Implement file discovery (scan contentDir, parse frontmatter)
- [ ] Implement MDX compilation using `next-mdx-remote/rsc`
- [ ] Implement route handler for `/content/[...slug]`
- [ ] Implement listing route `/content`
- [ ] Implement API endpoints for metadata
- [ ] Add frontmatter schema validation
- [ ] Add TOC generation from heading nodes
- [ ] Add syntax highlighting (rehype-pretty-code or similar)
- [ ] Write tests
- [ ] Add README

## Dependencies

- `next-mdx-remote` (MDX compilation)
- `gray-matter` (frontmatter parsing)
- `rehype-pretty-code` or `shiki` (syntax highlighting)

## Notes

- basePath is `/content` by default, configurable via module config
- Custom basePath support depends on whether next-modular allows overriding `basePath` at registration time. If `defineModule` already supports this via config, we're good. Otherwise pin on `/content` for now.
