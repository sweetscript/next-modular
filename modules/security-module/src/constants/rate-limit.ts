import type { RateLimitConfig } from '../types';

export const DEFAULT_RATE_LIMIT: Required<RateLimitConfig> = {
  enabled: true,
  windowMs: 60_000,
  max: 100,
  headers: false,
  message: 'Too many requests',
};
