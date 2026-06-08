# Security Module Plan

## Package

`@next-modular/security-module`

## Purpose

Adds security headers, rate limiting, and CORS to all or scoped routes via middleware.

## Features

- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security, Content-Security-Policy)
- Rate limiting with configurable window and max requests
- CORS configuration
- All features individually toggleable

## Module Definition

- **basePath:** `/` (applies globally)
- **Routes:** None
- **API:** None
- **Middleware:** Yes (runs on all matched requests)

## Config Options

```ts
interface SecurityModuleConfig {
  headers?: {
    xFrameOptions?: string              // Default: "DENY"
    xContentTypeOptions?: string        // Default: "nosniff"
    referrerPolicy?: string             // Default: "strict-origin-when-cross-origin"
    hsts?: { maxAge: number; includeSubDomains?: boolean }
    csp?: string                        // Content-Security-Policy value
  }
  rateLimit?: {
    enabled?: boolean                   // Default: true
    window?: number                     // Seconds. Default: 60
    max?: number                        // Max requests per window. Default: 100
    store?: 'memory' | object           // Pluggable via unstorage later
  }
  cors?: {
    enabled?: boolean                   // Default: false
    origins?: string[]                  // Allowed origins
    methods?: string[]                  // Default: ["GET","POST","PUT","DELETE"]
    credentials?: boolean               // Default: false
  }
}
```

## Implementation Tasks

- [ ] Create module scaffold
- [ ] Implement middleware that applies security headers
- [ ] Implement in-memory rate limiter (IP-based, sliding window)
- [ ] Implement CORS handling (preflight + response headers)
- [ ] Make each feature independently configurable/disableable
- [ ] Write tests
- [ ] Add README

## Dependencies

None for v1 (in-memory rate limit store). Can add unstorage adapter later for distributed rate limiting.
