# Feature: Module Next.js Config Extension

## Summary

Allow modules to declare Next.js configuration (headers, redirects, rewrites, webpack) that gets merged automatically via `withNextModular`.

## Problem

Currently modules can only provide routes, API routes, and middleware. They cannot influence Next.js config, which means things like custom response headers, URL rewrites (e.g. serving `/sitemap.xml` from an API route), or redirects must be manually configured by the user outside the module system.

## Decision

- Add an optional `nextConfig` property to `ModuleDefinition`
- `withNextModular` merges all module configs together with the user's config
- Supported properties: `headers`, `redirects`, `rewrites`, `webpack`
- Array-based configs (headers, redirects) get concatenated
- `rewrites` object gets merged by key (`beforeFiles`, `afterFiles`, `fallback`)
- `webpack` functions get composed (each module's webpack fn wraps the previous)

## API Design

```typescript
defineModule({
  name: 'my-module',
  basePath: '/my-module',
  nextConfig: {
    headers: async () => [
      {
        source: '/my-module/:path*',
        headers: [{ key: 'X-Custom', value: 'true' }],
      },
    ],
    redirects: async () => [
      { source: '/old-path', destination: '/my-module/new-path', permanent: true },
    ],
    rewrites: async () => ({
      beforeFiles: [
        { source: '/sitemap.xml', destination: '/api/my-module/sitemap' },
      ],
    }),
    webpack: (config, context) => {
      // modify webpack config
      return config;
    },
  },
})
```

## Merge Strategy

| Property | Strategy |
|----------|----------|
| `headers` | Concatenate all module arrays, then user's |
| `redirects` | Concatenate all module arrays, then user's |
| `rewrites` | Merge `beforeFiles`, `afterFiles`, `fallback` arrays separately |
| `webpack` | Compose functions — each module wraps the previous, user's runs last |

User's config always takes precedence (runs last / appears last in arrays).

---

## Tasks

### Task 1: Add `ModuleNextConfig` type to `types.ts`
- [ ] Define `ModuleNextConfig` interface with optional `headers`, `redirects`, `rewrites`, `webpack`
- [ ] Add optional `nextConfig?: ModuleNextConfig` to `ModuleDefinition`
- [ ] Ensure types align with Next.js config types (import from `next`)

### Task 2: Update `defineModule` to pass through `nextConfig`
- [ ] Ensure `nextConfig` is preserved when creating configurable module
- [ ] Ensure `nextConfig` is included when module is called with user config

### Task 3: Implement config merge logic
- [ ] Create `src/configMerge.ts` with merge functions
- [ ] `mergeHeaders(modules): async () => Header[]` — concatenates all module header arrays
- [ ] `mergeRedirects(modules): async () => Redirect[]` — concatenates all module redirect arrays
- [ ] `mergeRewrites(modules): async () => Rewrites` — merges by key
- [ ] `mergeWebpack(modules): WebpackConfigFn` — composes webpack functions
- [ ] Export a single `mergeModuleConfigs(modules, userConfig)` function

### Task 4: Update `withNextModular` to use merge logic
- [ ] Call `mergeModuleConfigs` with all registered modules
- [ ] Apply merged config to the returned Next.js config object
- [ ] Ensure user's existing `headers`/`redirects`/`rewrites`/`webpack` are preserved and run last

### Task 5: Update demo app
- [ ] Use `withNextModular` in demo's `next.config.ts`
- [ ] Add example `nextConfig` usage to example module or content module

### Task 6: Tests
- [ ] Test merging multiple modules' headers
- [ ] Test merging rewrites with overlapping keys
- [ ] Test webpack composition order
- [ ] Test that user config takes precedence
- [ ] Test modules with no `nextConfig` (backward compat)

---

## Test Module: `next-config-test-module`

Located at `modules/next-config-test-module/`. Purpose is solely to verify every aspect of the `nextConfig` merge works correctly. Not meant to be useful — meant to be explicit.

### What it declares

```typescript
export const nextConfigTestModule = defineModule({
  name: 'next-config-test-module',
  basePath: '/next-config-test',
  nextConfig: {
    // Test: headers merge
    headers: async () => [
      {
        source: '/next-config-test/:path*',
        headers: [
          { key: 'X-Test-Module-Header', value: 'present' },
          { key: 'X-Custom-Cache', value: 'no-store' },
        ],
      },
    ],
    // Test: redirects merge
    redirects: async () => [
      {
        source: '/old-next-config-test',
        destination: '/next-config-test',
        permanent: true,
      },
    ],
    // Test: rewrites merge (beforeFiles and afterFiles)
    rewrites: async () => ({
      beforeFiles: [
        { source: '/next-config-test-alias', destination: '/next-config-test' },
      ],
      afterFiles: [
        { source: '/next-config-test/legacy/:slug', destination: '/next-config-test/:slug' },
      ],
    }),
    // Test: webpack composition
    webpack: (config) => {
      config.plugins = config.plugins ?? [];
      config.plugins.push({ apply: () => { /* test plugin */ } });
      return config;
    },
  },
  // No routes, no apiRoutes, no middleware — nextConfig is its only contribution
})
```

### What to verify in demo app

1. Hit `/old-next-config-test` — should 301 redirect to `/next-config-test`
2. Hit `/next-config-test-alias` — should rewrite to `/next-config-test`
3. Inspect response headers on any `/next-config-test/*` route — should include `X-Test-Module-Header: present`
4. Verify `next build` completes without webpack errors
5. Add a second module with its own `nextConfig` and verify both sets of headers/redirects/rewrites are present (merge test)

---

## E2E Tests

File: `demo/demo-app/e2e/next-config.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Plan 01: nextConfig extension', () => {

  test.describe('headers', () => {
    test('injects X-Test-Module-Header on module routes', async ({ request }) => {
      const response = await request.get('/next-config-test');
      expect(response.headers()['x-test-module-header']).toBe('present');
    });

    test('injects X-Custom-Cache header on module routes', async ({ request }) => {
      const response = await request.get('/next-config-test');
      expect(response.headers()['x-custom-cache']).toBe('no-store');
    });

    test('does not inject module headers on unrelated routes', async ({ request }) => {
      const response = await request.get('/');
      expect(response.headers()['x-test-module-header']).toBeUndefined();
    });
  });

  test.describe('redirects', () => {
    test('redirects /old-next-config-test to /next-config-test permanently', async ({ request }) => {
      const response = await request.get('/old-next-config-test', {
        maxRedirects: 0,
      });
      expect(response.status()).toBe(301);
      expect(response.headers()['location']).toContain('/next-config-test');
    });
  });

  test.describe('rewrites', () => {
    test('beforeFiles rewrite: /next-config-test-alias serves /next-config-test content', async ({ page }) => {
      await page.goto('/next-config-test-alias');
      // Should render same content as /next-config-test without redirecting
      expect(page.url()).toContain('/next-config-test-alias');
      await expect(page.locator('body')).not.toBeEmpty();
    });

    test('afterFiles rewrite: /next-config-test/legacy/foo rewrites to /next-config-test/foo', async ({ page }) => {
      await page.goto('/next-config-test/legacy/hello');
      expect(page.url()).toContain('/next-config-test/legacy/hello');
      await expect(page.locator('body')).not.toBeEmpty();
    });
  });

  test.describe('multiple modules config merge', () => {
    test('headers from both modules are present on their respective routes', async ({ request }) => {
      const moduleOneResponse = await request.get('/next-config-test');
      expect(moduleOneResponse.headers()['x-test-module-header']).toBe('present');
      // If a second test module is added, verify its headers here
    });
  });

});
```
