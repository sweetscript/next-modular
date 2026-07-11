import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_RATE_LIMIT } from '../constants';
import { getClientIp } from '../utils';
import type { RateLimitConfig } from '../types';

const store = new Map<string, { count: number; resetAt: number }>();

export function applyRateLimit(req: NextRequest, config: RateLimitConfig): NextResponse | null {
  const c = { ...DEFAULT_RATE_LIMIT, ...config };
  if (!c.enabled) return null;

  const ip = getClientIp(req);
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + c.windowMs });
  } else {
    record.count += 1;

    if (record.count > c.max) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      };

      if (c.headers) {
        headers['X-RateLimit-Limit'] = String(c.max);
        headers['X-RateLimit-Remaining'] = '0';
        headers['X-RateLimit-Reset'] = String(record.resetAt);
      }

      return new NextResponse(
        JSON.stringify({ error: c.message }),
        { status: 429, headers }
      );
    }
  }

  return null;
}
