# Auth Module Plan

## Package

`@next-modular/auth-module`

## Purpose

Authentication module wrapping Auth.js (NextAuth v5). Provides login, register, session validation, and optional pre-built UI pages.

## Features

- Login and register API endpoints
- Pre-built login and register pages (styled with CSS modules, optional)
- Exportable form components (LoginForm, RegisterForm) for custom pages
- Configurable auth providers (credentials, OAuth via Auth.js)
- Session integration via session-module
- Customisable wording/labels via config

## Module Definition

- **basePath:** `/auth`
- **Routes:**
  - `/auth/login` (login page, disableable)
  - `/auth/register` (register page, disableable)
- **API:**
  - `POST /api/auth/login` (credential login)
  - `POST /api/auth/register` (create account)
  - `POST /api/auth/logout` (destroy session)
  - `GET /api/auth/session` (get current user)
  - `GET/POST /api/auth/[...provider]` (OAuth callbacks via Auth.js)
- **Middleware:** Optionally protect routes (redirect to login if no session)

## Config Options

```ts
interface AuthModuleConfig {
  providers: AuthProvider[]               // Auth.js provider configs
  pages?: {
    login?: boolean                       // Default: true (show built-in login page)
    register?: boolean                    // Default: true (show built-in register page)
  }
  labels?: {
    loginTitle?: string                   // Default: "Sign In"
    registerTitle?: string                // Default: "Create Account"
    loginButton?: string                  // Default: "Sign In"
    registerButton?: string              // Default: "Create Account"
  }
  protectedPaths?: string[]              // Paths that require auth (middleware redirects)
  redirectAfterLogin?: string            // Default: "/"
  redirectAfterRegister?: string         // Default: "/"
}
```

## Exported Components

- `LoginForm` React component (styled with CSS modules)
- `RegisterForm` React component (styled with CSS modules)
- `useAuth()` client hook (current user, login/logout methods)
- `getUser(req)` server helper

## Implementation Tasks

- [ ] Create module scaffold
- [ ] Set up Auth.js integration (configure, expose handlers)
- [ ] Implement credential provider (email/password with hashing)
- [ ] Implement login API handler
- [ ] Implement register API handler
- [ ] Implement logout handler (calls session-module destroy)
- [ ] Build LoginForm component (CSS modules)
- [ ] Build RegisterForm component (CSS modules)
- [ ] Implement middleware for protected routes
- [ ] Export `useAuth` hook
- [ ] Export `getUser` server helper
- [ ] Write tests
- [ ] Add README

## Dependencies

- `next-auth` (Auth.js v5)
- `@next-modular/session-module` (peer dependency)
- `bcryptjs` or `@noble/hashes` (password hashing)

## Decisions Made

- Ship default login/register pages styled with CSS modules
- Pages can be disabled via config if user wants custom UI
- Export form components so users can embed them in their own pages
- Wording/labels are configurable
- Auth methods (credentials, OAuth) configured via Auth.js providers

## Open Questions

- Where are users stored? Auth.js needs an adapter (database). Should we require users to provide an Auth.js adapter in config, or ship a default in-memory/file adapter for dev?
- Password reset flow: include in v1 or defer?
