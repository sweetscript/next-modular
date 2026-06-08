import type { RateLimitConfig } from '../types';

const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, config: Required<RateLimitConfig>): boolean {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + config.window * 1000 });
    return true;
  }

  record.count += 1;
  return record.count <= config.max;
}
