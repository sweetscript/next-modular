# Session Module Plan

## Package

`@next-modular/session-module`

## Purpose

Provides server-side session management with encrypted cookies and pluggable storage via unstorage.

## Features

- Encrypted session cookies (iron-session style)
- Pluggable storage backend via unstorage (memory, Redis, filesystem, etc.)
- Session middleware that attaches session data to requests
- Auto-refresh session expiry on activity
- API to get/destroy sessions

## Module Definition

- **basePath:** `/session`
- **Routes:** None
- **API:** 
  - `GET /api/session` returns current session data
  - `DELETE /api/session` destroys session
- **Middleware:** Yes (reads/validates session cookie, attaches to request)

## Config Options

```ts
interface SessionModuleConfig {
  secret: string                          // Required: encryption secret
  cookieName?: string                     // Default: "session"
  maxAge?: number                         // Seconds. Default: 86400 (24h)
  cookie?: {
    httpOnly?: boolean                    // Default: true
    secure?: boolean                     // Default: true in production
    sameSite?: 'lax' | 'strict' | 'none' // Default: "lax"
    path?: string                        // Default: "/"
  }
  storage?: {
    driver: string                       // unstorage driver name
    options?: Record<string, unknown>    // Driver-specific options
  }
}
```

## How It Works

1. Middleware reads session cookie from request
2. Decrypts cookie to get session ID
3. Fetches session data from storage (unstorage)
4. Attaches session to request context (accessible by other modules/handlers)
5. On response, refreshes cookie expiry if session is still valid

## Exported Utilities

- `getSession(req)` helper for other modules to read session
- `setSession(req, data)` helper to write session data
- `destroySession(req)` helper to clear session

## Implementation Tasks

- [ ] Create module scaffold
- [ ] Implement cookie encryption/decryption (using iron-webcrypto or similar)
- [ ] Implement unstorage integration for session data persistence
- [ ] Implement middleware (read cookie, load session, attach to context)
- [ ] Implement API handlers (GET, DELETE)
- [ ] Export helper functions for other modules to use
- [ ] Write tests
- [ ] Add README

## Dependencies

- `unstorage` (storage abstraction)
- `iron-webcrypto` or `@noble/ciphers` (cookie encryption)

## Notes

- The auth module depends on this module for session management
- Users pick their unstorage driver (memory for dev, Redis for prod, etc.)
