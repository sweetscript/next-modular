# Module Development Plan

## Overview

We're converting the `next-modular` repo into an npm workspace monorepo to publish multiple module packages alongside the core package.

## First Batch of Modules

| # | Module | Package | Category | Status |
|---|--------|---------|----------|--------|
| 1 | Sitemap | `@next-modular/sitemap-module` | SEO | Not started |
| 2 | Security | `@next-modular/security-module` | Security | Not started |
| 3 | Session | `@next-modular/session-module` | Authentication | Not started |
| 4 | Auth | `@next-modular/auth-module` | Authentication | Not started |
| 5 | Content | `@next-modular/content-module` | Content | Not started |

## Dependency Chain

```
sitemap-module     (standalone)
security-module    (standalone)
session-module     (standalone, uses unstorage)
auth-module        (depends on session-module, uses Auth.js)
content-module     (standalone, uses next-mdx-remote)
```

## Implementation Order

1. **Workspace setup** (convert repo to npm workspaces)
2. **Session module** (needed by auth, good to validate module patterns)
3. **Sitemap module** (simplest, good first proof of concept)
4. **Security module** (middleware-only pattern)
5. **Auth module** (most complex, depends on session)
6. **Content module** (independent, can be parallel)

## Key Decisions Made

- **Workspace:** npm workspaces in this repo, scoped under `@next-modular/`
- **Auth approach:** Wrap Auth.js (NextAuth v5). Ship default login/register pages styled with CSS modules. Pages are disableable. Form components are exported for custom use. Labels/wording configurable.
- **Session storage:** Use `unstorage` library. Users select their driver (memory, Redis, etc.) via config.
- **Content compilation:** Runtime MDX for v1 (simpler within module system). Build-time caching as future optimisation.
- **Custom basePath:** Currently supported via `defineModule({ basePath })`. If users need to override at registration time, we can add that later. Pin content module to `/content` for now.

## Individual Plans

- [Workspace Setup](./workspace-setup.md)
- [Sitemap Module](./sitemap-module.md)
- [Security Module](./security-module.md)
- [Session Module](./session-module.md)
- [Auth Module](./auth-module.md)
- [Content Module](./content-module.md)
