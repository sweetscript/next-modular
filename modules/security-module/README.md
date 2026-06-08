# @next-modular/security-module

Security headers, rate limiting, CORS configuration, and input sanitization for your Next.js app.

## Installation

```bash
npx next-modular add @next-modular/security-module
```

## Usage

```ts
import { securityModule } from '@next-modular/security-module'

export const modules = [
  securityModule({
    headers: true,
    cors: {
      origin: ['https://example.com'],
      methods: ['GET', 'POST'],
    },
    rateLimit: {
      windowMs: 60_000,
      max: 100,
    },
  }),
]
```

## Features

- **Security Headers** — Automatically sets recommended security headers (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.)
- **CORS** — Configure allowed origins, methods, and headers per module or globally.
- **Rate Limiting** — Protect API routes with configurable rate limits using sliding window counters.
- **Helmet-style Defaults** — Sensible defaults inspired by helmet.js, zero config required.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `headers` | `boolean` | `true` | Enable security headers |
| `cors` | `CorsOptions \| false` | `false` | CORS configuration |
| `cors.origin` | `string[]` | `[]` | Allowed origins |
| `cors.methods` | `string[]` | `['GET','POST','PUT','DELETE']` | Allowed methods |
| `rateLimit` | `RateLimitOptions \| false` | `false` | Rate limiting configuration |
| `rateLimit.windowMs` | `number` | `60000` | Time window in milliseconds |
| `rateLimit.max` | `number` | `100` | Max requests per window |

## API Routes

This module does not register any API routes. It operates purely through middleware.

## Middleware

The security middleware runs on all routes matched by the module's `basePath`. It applies headers, checks CORS, and enforces rate limits before passing the request to the next handler.
