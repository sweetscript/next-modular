export interface RateLimitConfig {
  enabled?: boolean;
  windowMs?: number;
  max?: number;
  headers?: boolean;
  message?: string;
}
