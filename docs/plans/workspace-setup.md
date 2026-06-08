# Workspace Setup Plan

## Goal

Convert the `next-modular` repo into an npm workspace monorepo so we can publish multiple packages from a single repo.

## Structure

```
next-modular/
├── src/                  # Core next-modular package source
├── modules/              # Publishable module packages
│   ├── sitemap-module/
│   ├── security-module/
│   ├── session-module/
│   ├── auth-module/
│   └── content-module/
├── docs/                 # Documentation site
├── demo/                 # Demo app
├── cli/                  # CLI tool
├── package.json          # Workspace root
└── tsconfig.json
```

## Tasks

- [ ] Add `"workspaces": ["modules/*"]` to root `package.json`
- [ ] Each module gets its own `package.json` with:
  - Scoped name: `@next-modular/<module-name>`
  - `next-modular` as peer dependency
  - Its own `tsconfig.json`
  - Its own build script
- [ ] Update `.npmignore` or `files` field to keep published packages lean
- [ ] Test that `npm install` from root links everything correctly
- [ ] Test publishing workflow (dry-run)

## Notes

- Modules can depend on each other (e.g. auth depends on session)
- Each module is independently versioned and published
- Can move modules to separate repos later without breaking published packages
