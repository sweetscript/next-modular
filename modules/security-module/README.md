# @next-modular/security-module

Security headers, rate limiting, CORS configuration, XSS validation, CSRF protection, and more for your Next.js app.

## Installation

```bash
npx next-modular add @next-modular/security-module
```

## Usage

```ts
import { securityModule } from '@next-modular/security-module'

export const modules = [
  securityModule({
    headers: {
      xFrameOptions: 'SAMEORIGIN',
      referrerPolicy: 'strict-origin-when-cross-origin',
    },
    rateLimit: {
      enabled: true,
      windowMs: 60_000,
      max: 100,
    },
    cors: {
      enabled: true,
      origins: ['https://example.com'],
      methods: ['GET', 'POST'],
    },
  }),
]
```

## Configuration

```ts
interface SecurityModuleConfig {
  headers?: SecurityHeadersConfig | false;
  rateLimit?: RateLimitConfig | false;
  cors?: CorsConfig | false;
  csrf?: CsrfConfig | false;
  methodRestricter?: MethodRestricterConfig | false;
  requestSize?: RequestSizeConfig | false;
  xss?: XssConfig | false;
  nonce?: NonceConfig | false;
}
```

Set any feature to `false` to disable it entirely.

## Features

### Security Headers

Sets recommended security headers on all responses.

```ts
interface SecurityHeadersConfig {
  xFrameOptions?: string | false;             // default: 'SAMEORIGIN'
  xContentTypeOptions?: string | false;       // default: 'nosniff'
  referrerPolicy?: string | false;            // default: 'strict-origin-when-cross-origin'
  hsts?: HstsConfig | false;                  // default: { maxAge: 31536000, includeSubDomains: true }
  contentSecurityPolicy?: ContentSecurityPolicyConfig | string | false;
  crossOriginResourcePolicy?: string | false; // default: 'same-origin'
  crossOriginOpenerPolicy?: string | false;   // default: 'same-origin'
  crossOriginEmbedderPolicy?: string | false; // default: 'credentialless'
  xDnsPrefetchControl?: string | false;       // default: 'off'
  xDownloadOptions?: string | false;          // default: 'noopen'
  xPermittedCrossDomainPolicies?: string | false; // default: 'none'
  permissionsPolicy?: PermissionsPolicyConfig | false;
  hidePoweredBy?: boolean;                    // default: true
}
```

Default CSP:

```ts
{
  'base-uri': ["'none'"],
  'font-src': ["'self'", 'https:', 'data:'],
  'form-action': ["'self'"],
  'frame-ancestors': ["'self'"],
  'img-src': ["'self'", 'data:'],
  'object-src': ["'none'"],
  'script-src-attr': ["'none'"],
  'style-src': ["'self'", 'https:', "'unsafe-inline'"],
  'script-src': ["'self'", 'https:', "'unsafe-inline'"],
  'upgrade-insecure-requests': true,
}
```

Default Permissions Policy:

```ts
{
  camera: [],
  'display-capture': [],
  fullscreen: [],
  geolocation: [],
  microphone: [],
}
```

### Rate Limiting

Protects against brute force and abuse with sliding window counters.

```ts
interface RateLimitConfig {
  enabled?: boolean;    // default: true
  windowMs?: number;    // default: 60000 (1 minute)
  max?: number;         // default: 100
  headers?: boolean;    // default: false (set X-RateLimit-* headers)
  message?: string;     // default: 'Too many requests'
}
```

### CORS

Configure Cross-Origin Resource Sharing.

```ts
interface CorsConfig {
  enabled?: boolean;        // default: false
  origins?: string[];       // default: []
  methods?: string[];       // default: ['GET','HEAD','PUT','PATCH','POST','DELETE']
  allowedHeaders?: string[];  // default: []
  exposedHeaders?: string[];  // default: []
  credentials?: boolean;    // default: false
  maxAge?: number;          // default: 86400
}
```

### CSRF Protection

Cookie-based CSRF token validation for unsafe methods (POST, PUT, PATCH, DELETE).

```ts
interface CsrfConfig {
  enabled?: boolean;        // default: false
  cookieName?: string;      // default: '__csrf'
  headerName?: string;      // default: 'x-csrf-token'
  excludePaths?: string[];  // default: []
}
```

### HTTP Method Restricter

Restrict which HTTP methods are allowed.

```ts
interface MethodRestricterConfig {
  enabled?: boolean;          // default: false
  methods?: string[] | '*';   // default: '*' (all allowed)
}
```

### Request Size Limiter

Block oversized request bodies.

```ts
interface RequestSizeConfig {
  enabled?: boolean;      // default: true
  maxBodySize?: number;   // default: 2000000 (2MB)
  maxUploadSize?: number; // default: 8000000 (8MB, for multipart)
}
```

### XSS Validation

Blocks requests containing common XSS patterns in URL and query parameters.

```ts
interface XssConfig {
  enabled?: boolean;      // default: true
  patterns?: RegExp[];    // default: built-in patterns for script tags, event handlers, etc.
}
```

### Nonce Generation

Generates a cryptographic nonce per request, exposed via the `x-nonce` response header.

```ts
interface NonceConfig {
  enabled?: boolean;  // default: true
}
```

To use the nonce in CSP, add the `'nonce-{{nonce}}'` placeholder to your `script-src`:

```ts
securityModule({
  nonce: { enabled: true },
  headers: {
    contentSecurityPolicy: {
      'script-src': ["'self'", "'nonce-{{nonce}}'"],
    },
  },
})
```

Note: Using nonce in CSP requires dynamic rendering in Next.js (`export const dynamic = 'force-dynamic'` on your pages) so that Next.js can read the nonce and apply it to script tags.

## Middleware Execution Order

1. Method restricter (early reject)
2. Request size limiter (early reject)
3. Rate limiting (early reject)
4. XSS validation (early reject)
5. CSRF protection
6. Security headers + nonce
7. CORS

## Disabling Features

Any feature can be disabled by setting it to `false`:

```ts
securityModule({
  cors: false,
  csrf: false,
  xss: false,
  nonce: false,
})
```
