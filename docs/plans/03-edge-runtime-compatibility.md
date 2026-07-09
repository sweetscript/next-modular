# Feature: Edge Runtime Compatibility

## Summary

Ensure the next-modular core can run in Edge Runtime environments. Adds a `next-modular/edge` entry point with stateless handlers that have zero Node.js dependencies, allowing apps to run their catch-all routes on edge runtime.

## Problem

Edge Runtime is a subset of Web APIs — no Node.js `fs`, no global mutable state that persists across requests reliably, no `node:` modules. Currently:

- The module registry uses a global in-memory `Map` (works in Node.js, unreliable in Edge)
- `ensureModulesInitialized()` relies on mutable global state
- All handlers read from the global registry — not safe for edge

The core routing/matching logic itself is pure and stateless — it just needs modules passed in. The problem is how modules get registered and accessed.

## Decision

- Add stateless handler variants that accept modules directly — no registry, no Node.js
- Expose these via a `next-modular/edge` entry point that is guaranteed Node.js-free
- The existing Node.js handlers remain unchanged — no breaking changes
- Edge runtime is an app-level choice: the app owner adds `export const runtime = 'edge'` to their catch-all route files and uses `next-modular/edge` handlers
- Modules don't need to change — they just write handlers using Web APIs. If a module uses Node.js APIs (like content-module using `fs`), it simply cannot be used in an edge app. That's a module concern, not a framework concern.

## Runtime Constraint

Because `export const runtime` applies to an entire Next.js route file, a single catch-all route is either all-edge or all-Node.js. Apps that mix edge and Node.js modules need two separate apps. This is a Next.js constraint, not a next-modular constraint.

## Testing Strategy

A separate `demo/demo-edge-app/` is used to test edge runtime. It:
- Only registers edge-compatible modules
- Declares `export const runtime = 'edge'` on all catch-all routes
- Runs on port 3001 locally via `next dev`
- Next.js simulates edge runtime locally — no deployment needed
- Any Node.js API leak throws immediately in dev/build

The existing `demo/demo-app/` is unaffected and continues to run on Node.js.

## Architecture

### Before (Node.js only)

```
modules.config.ts → configureModules() → global moduleRegistry
                                               ↓
handlers.ts → ensureModulesInitialized() → reads from registry
```

### After (both runtimes supported)

```
Node.js app:
  next-modular.runtime.ts → configureModules() → global registry
  app/api/[...module]/route.ts → handleApiRoute(req, pathname)  ← unchanged

Edge app:
  modules.config.ts → imported directly (no registry)
  app/api/[...module]/route.ts
    export const runtime = 'edge'
    → handleApiRouteWith(modules, req, pathname)  ← stateless
```

## API Design

```typescript
// app/api/[...module]/route.ts (edge app)
export const runtime = 'edge';

import { handleApiRouteWith, handleMiddlewareWith } from 'next-modular/edge';
import { modules } from '../../modules.config';

export async function GET(req: Request, context) {
  const params = await context.params;
  const pathname = '/api/' + params.module.join('/');
  return handleApiRouteWith(modules, req, pathname, context);
}
```

```typescript
// proxy.ts (edge app)
export const runtime = 'edge';

import { handleMiddlewareWith } from 'next-modular/edge';
import { modules } from './modules.config';

export async function proxy(req: Request) {
  const result = await handleMiddlewareWith(modules, req);
  if (result) return result;
  return NextResponse.next();
}
```

---

## Tasks

### Task 1: Refactor route matchers to accept modules array
- [ ] Update `matchRoute(path, modules)` to accept modules as parameter
- [ ] Update `matchApiRoute(path, modules)` to accept modules as parameter
- [ ] Keep backward-compatible wrappers that read from registry for existing API

### Task 2: Create stateless handler functions
- [ ] Create `src/handlers-stateless.ts`
- [ ] `handleRouteWith(modules, pathname)` — stateless version of `handleRoute`
- [ ] `handleApiRouteWith(modules, req, pathname, context)` — stateless version of `handleApiRoute`
- [ ] `handleMiddlewareWith(modules, req)` — stateless version of `handleMiddleware`
- [ ] No imports from `registry.ts` or `config.ts`

### Task 3: Create `next-modular/edge` entry point
- [ ] Create `src/edge.ts` exporting stateless handlers and route matchers
- [ ] Ensure zero imports from `registry.ts`, `config.ts`, or anything with Node.js deps
- [ ] Add `"./edge"` to `package.json` exports map with types

### Task 4: Update `package.json` exports
- [ ] Add `"./edge"` export entry with `types`, `require`, `import` fields
- [ ] Verify tree-shaking: importing `next-modular/edge` must not pull in registry or config

### Task 5: Create `demo/demo-edge-app/`
- [ ] Scaffold a fresh Next.js app at `demo/demo-edge-app/`
- [ ] Add to root workspace `package.json`
- [ ] Add `app/[...module]/page.tsx` with `export const runtime = 'edge'` using `handleRouteWith`
- [ ] Add `app/api/[...module]/route.ts` with `export const runtime = 'edge'` using `handleApiRouteWith`
- [ ] Add `proxy.ts` with `export const runtime = 'edge'` using `handleMiddlewareWith`
- [ ] Register only edge-compatible modules (edge-test-module)
- [ ] Configure to run on port 3001

### Task 6: Create `edge-test-module` as local module in `demo/demo-edge-app/modules/`
- [ ] `edgePingHandler` — returns `{ pong: true }` using only Web APIs
- [ ] `edgeHeadersHandler` — echoes request headers as JSON
- [ ] `edgeItemHandler` — returns dynamic param `{ id }`
- [ ] `edgeTestMiddleware` — adds `X-Edge-Module: true` response header
- [ ] Page components for `/edge-test` and `/edge-test/[id]` with `data-testid="route-param"`

### Task 7: Set up Playwright for edge demo app
- [ ] Add `playwright.config.ts` to `demo/demo-edge-app/` pointing at port 3001
- [ ] Add `test:e2e` script to `demo/demo-edge-app/package.json`
- [ ] Update CI workflow to build and run e2e for edge demo app

### Task 8: Unit tests
- [ ] Test stateless handlers produce same results as registry-based handlers
- [ ] Test `matchRoute` and `matchApiRoute` with modules passed directly
- [ ] Verify `src/edge.ts` has no imports from registry or config

### Task 9: E2E tests in `demo/demo-edge-app/e2e/edge-runtime.spec.ts`
- Write after implementation is complete

---

## Test Module: `edge-test-module`

Located at `demo/demo-edge-app/modules/edge-test-module/`. All handlers use only `Request`, `Response`, `Headers` — zero Node.js APIs.

```typescript
export const edgeTestModule = defineModule({
  name: 'edge-test-module',
  basePath: '/edge-test',
  routes: [
    { path: '/', component: EdgeTestPage },
    { path: '/[id]', component: EdgeTestDetailPage },
  ],
  apiRoutes: [
    { path: '/ping', handler: edgePingHandler },
    { path: '/headers', handler: edgeHeadersHandler },
    { path: '/[id]', handler: edgeItemHandler },
  ],
  middleware: {
    handler: edgeTestMiddleware,
  },
})
```
