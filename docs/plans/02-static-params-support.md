# Feature: Module Static Params Support

## Summary

Allow modules to declare static params so Next.js can statically generate module pages at build time via `generateStaticParams`.

## Problem

The catch-all `[...module]/page.tsx` currently only works dynamically at runtime. There's no way for modules to tell Next.js which paths to pre-render. This means all module pages are server-rendered on every request, even when the content is static (like MDX files).

## Decision

- Add an optional `staticParams` function to `ModuleDefinition`
- Provide a `getAllModuleStaticParams()` helper that the catch-all page exports as `generateStaticParams`
- Each module returns its own path segments; the core prefixes them with the module's `basePath` segments
- The helper converts these into the `{ module: string[] }` format the catch-all expects

## API Design

### Module side

```typescript
defineModule({
  name: 'content-module',
  basePath: '/content',
  staticParams: async () => [
    { path: '/hello-world' },
    { path: '/getting-started' },
    { path: '/nested/deep-page' },
  ],
  routes: [...],
})
```

Each entry's `path` is relative to the module's `basePath`. The core converts `/content` + `/hello-world` into `{ module: ['content', 'hello-world'] }`.

### Core helper

```typescript
import { getAllModuleStaticParams } from 'next-modular';

// In app/[...module]/page.tsx
export async function generateStaticParams() {
  return getAllModuleStaticParams();
}
```

### Return format

```typescript
// Output from getAllModuleStaticParams():
[
  { module: ['content', 'hello-world'] },
  { module: ['content', 'getting-started'] },
  { module: ['content', 'nested', 'deep-page'] },
  { module: ['example-module'] },
]
```

## How It Works at Build Time

1. `next build` encounters `[...module]/page.tsx`
2. Calls `generateStaticParams()`
3. The function imports `next-modular.runtime` (modules get registered)
4. Loops all modules, calls `staticParams()` on those that have it
5. Returns combined array
6. Next.js renders each path statically

## Content Module Integration

The content module would implement `staticParams` by scanning its content directory:

```typescript
staticParams: async () => {
  const slugs = await getContentSlugs(contentDir);
  return slugs.map(slug => ({ path: `/${slug}` }));
}
```

---

## Tasks

### Task 1: Add `staticParams` to `ModuleDefinition` type
- [ ] Define `ModuleStaticParam` type: `{ path: string }`
- [ ] Add optional `staticParams?: () => Promise<ModuleStaticParam[]>` to `ModuleDefinition`

### Task 2: Implement `getAllModuleStaticParams` helper
- [ ] Create logic in `src/staticParams.ts`
- [ ] Loop registered modules, call `staticParams()` on modules that declare it
- [ ] Convert basePath + param path into `{ module: string[] }` format
- [ ] Split paths on `/` to create segment arrays
- [ ] Export from `src/index.ts`

### Task 3: Update `defineModule` to pass through `staticParams`
- [ ] Ensure `staticParams` is preserved in configurable module creation
- [ ] Ensure it's included when module is called with user config

### Task 4: Update content module to declare `staticParams`
- [ ] Export a `getContentSlugs(contentDir)` function from content module
- [ ] Use it in the module's `staticParams` function
- [ ] Handle nested content (subdirectories) if applicable

### Task 5: Update demo app catch-all page
- [ ] Add `generateStaticParams` export to `app/[...module]/page.tsx`
- [ ] Call `getAllModuleStaticParams()`
- [ ] Ensure `next-modular.runtime` import runs before the function

### Task 6: Tests
- [ ] Test `getAllModuleStaticParams` with multiple modules
- [ ] Test path segment conversion (basePath + relative path → array)
- [ ] Test modules without `staticParams` are skipped
- [ ] Test empty staticParams returns empty array

---

## Test Module: `static-params-test-module`

Located at `modules/static-params-test-module/`. Purpose is to verify static generation works end-to-end with a known fixed set of paths. Uses hardcoded paths so the test is fully deterministic — no filesystem scanning, no external data.

### What it declares

```typescript
export const staticParamsTestModule = defineModule({
  name: 'static-params-test-module',
  basePath: '/static-test',
  staticParams: async () => [
    { path: '/' },               // Tests basePath root
    { path: '/page-one' },       // Tests single segment
    { path: '/page-two' },       // Tests multiple paths at same level
    { path: '/nested/deep' },    // Tests nested path segments
    { path: '/nested/deeper/page' }, // Tests 3-level nesting
  ],
  routes: [
    { path: '/', component: StaticTestIndexPage },
    { path: '/[slug]', component: StaticTestPage },
    { path: '/nested/[...segments]', component: StaticTestNestedPage },
  ],
})
```

### What to verify

1. Run `next build` — should pre-render exactly these paths:
   - `/static-test`
   - `/static-test/page-one`
   - `/static-test/page-two`
   - `/static-test/nested/deep`
   - `/static-test/nested/deeper/page`
2. Verify `.next/server/app/static-test/...` contains the pre-rendered HTML files
3. Verify a path not in `staticParams` (e.g. `/static-test/unknown`) returns 404 in static export mode
4. Verify that adding a second module with `staticParams` produces both sets of paths (no collision)

---

## E2E Tests

File: `demo/demo-app/e2e/static-params.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Plan 02: staticParams support', () => {

  test.describe('pre-rendered pages load correctly', () => {
    const staticPaths = [
      '/static-test',
      '/static-test/page-one',
      '/static-test/page-two',
      '/static-test/nested/deep',
      '/static-test/nested/deeper/page',
    ];

    for (const path of staticPaths) {
      test(`renders ${path}`, async ({ page }) => {
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        await expect(page.locator('body')).not.toBeEmpty();
      });
    }
  });

  test.describe('page content reflects correct params', () => {
    test('/static-test/page-one renders with correct slug', async ({ page }) => {
      await page.goto('/static-test/page-one');
      // The test page component should render the slug/param visibly
      await expect(page.getByTestId('route-param')).toHaveText('page-one');
    });

    test('/static-test/nested/deep renders with correct segments', async ({ page }) => {
      await page.goto('/static-test/nested/deep');
      await expect(page.getByTestId('route-param')).toContainText('deep');
    });
  });

  test.describe('paths not in staticParams', () => {
    test('returns 404 for unknown path outside declared staticParams', async ({ page }) => {
      const response = await page.goto('/static-test/not-declared');
      // In static export: 404. In hybrid: may still SSR — depends on config.
      // At minimum the page should not crash with a 500
      expect(response?.status()).not.toBe(500);
    });
  });

  test.describe('multiple modules static params do not collide', () => {
    test('static-test paths and example-module paths both resolve correctly', async ({ page }) => {
      const r1 = await page.goto('/static-test/page-one');
      expect(r1?.status()).toBe(200);

      const r2 = await page.goto('/example-module');
      expect(r2?.status()).toBe(200);
    });
  });

});
```
