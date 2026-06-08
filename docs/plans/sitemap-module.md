# Sitemap Module Plan

## Package

`@next-modular/sitemap-module`

## Purpose

Generates a `sitemap.xml` from registered module routes and user-defined entries.

## Features

- Auto-generates sitemap from all registered module routes
- Supports custom static entries
- Configurable priority and change frequency per route
- Exclude paths via pattern matching

## Module Definition

- **basePath:** `/sitemap`
- **Routes:** `/sitemap.xml` (returns XML response)
- **API:** None
- **Middleware:** None

## Config Options

```ts
interface SitemapModuleConfig {
  baseUrl: string                         // Required: e.g. "https://mysite.com"
  additionalEntries?: SitemapEntry[]      // Extra URLs not from modules
  excludePaths?: string[]                 // Glob patterns to exclude
  defaultChangeFrequency?: string         // Default: "weekly"
  defaultPriority?: number               // Default: 0.5
}
```

## Implementation Tasks

- [ ] Create module scaffold (package.json, tsconfig, src/index.ts)
- [ ] Implement route that reads `moduleRegistry.getAllModules()` and collects routes
- [ ] Build XML string from collected routes + config
- [ ] Return proper XML response with correct content-type
- [ ] Handle `additionalEntries` and `excludePaths`
- [ ] Write tests
- [ ] Add README

## Dependencies

None (uses core `next-modular` registry API only)
