import type { SecurityHeaders, RateLimitConfig, CorsConfig } from './types';

export const DEFAULT_HEADERS: Required<SecurityHeaders> = {
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  hsts: { maxAge: 31536000, includeSubDomains: true },
  csp: '',
};

export const DEFAULT_RATE_LIMIT: Required<RateLimitConfig> = {
  enabled: true,
  window: 60,
  max: 100,
};

export const DEFAULT_CORS: Required<CorsConfig> = {
  enabled: false,
  origins: [],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: false,
};
