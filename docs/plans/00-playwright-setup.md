# Setup: Playwright E2E Testing in Demo App

## Summary

Set up Playwright inside `demo/demo-app` as the e2e test environment for validating all three feature plans. Each plan's test module gets registered in the demo app and tested via Playwright.

## Decision

- Playwright lives in `demo/demo-app`
- Tests live in `demo/demo-app/e2e/`
- Playwright starts the Next.js dev server automatically via `webServer` config
- CI runs `next build && next start` for a production-accurate environment
- Each feature plan has its own test file under `e2e/`

## Cleanup Required

- Remove stale `@next-modular/sitemap-module` from `demo/demo-app/package.json` — the module directory does not exist

## Project Structure After Setup

```
demo/demo-app/
├── e2e/
│   ├── next-config.spec.ts      # Tests for plan 01
│   ├── static-params.spec.ts    # Tests for plan 02
│   └── edge-runtime.spec.ts     # Tests for plan 03
├── playwright.config.ts
├── package.json                 # + playwright deps and scripts
└── ...
```

## Scripts to Add

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug"
}
```

## Playwright Config

```typescript
// demo/demo-app/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

---

## Tasks

### Task 1: Clean up demo app
- [ ] Remove `@next-modular/sitemap-module` from `demo/demo-app/package.json`

### Task 2: Install Playwright
- [ ] Add `@playwright/test` to `demo/demo-app` devDependencies
- [ ] Run `npx playwright install chromium` (chromium only — sufficient for these tests)

### Task 3: Create playwright config
- [ ] Create `demo/demo-app/playwright.config.ts` with config above
- [ ] Set `webServer` to use `npm run dev` locally, `npm run start` in CI

### Task 4: Create e2e directory and placeholder files
- [ ] Create `demo/demo-app/e2e/next-config.spec.ts`
- [ ] Create `demo/demo-app/e2e/static-params.spec.ts`
- [ ] Create `demo/demo-app/e2e/edge-runtime.spec.ts`

### Task 5: Add scripts to demo app package.json
- [ ] Add `test:e2e`, `test:e2e:ui`, `test:e2e:debug` scripts

### Task 6: Add to CI workflow
- [ ] Update `.github/workflows/check.yml` to run `npm run test:e2e` in the demo app
- [ ] Ensure Playwright browsers are installed in CI (`npx playwright install --with-deps chromium`)
