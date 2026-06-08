import { NextRequest, NextResponse } from 'next/server';
import { getModuleConfig } from 'next-modular';
import { DEFAULT_RATE_LIMIT, DEFAULT_CORS } from '../constants';
import { getClientIp } from '../utils/get-client-ip';
import { checkRateLimit } from '../utils/rate-limit-store';
import { applySecurityHeaders } from '../utils/headers';
import { applyCors } from '../utils/cors';
import type { SecurityModuleConfig } from '../types';

export async function securityMiddleware(req: NextRequest): Promise<NextResponse | void> {
  const config = getModuleConfig<SecurityModuleConfig>('security-module') ?? {};

  const rateLimitConfig = { ...DEFAULT_RATE_LIMIT, ...config.rateLimit };
  const corsConfig = { ...DEFAULT_CORS, ...config.cors };

  // Rate limiting
  if (rateLimitConfig.enabled) {
    const ip = getClientIp(req);
    const allowed = checkRateLimit(ip, rateLimitConfig);

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': String(rateLimitConfig.window) },
        }
      );
    }
  }

  const response = NextResponse.next();

  // Security headers
  applySecurityHeaders(response, config.headers ?? {});

  // CORS
  const corsResponse = applyCors(req, response, corsConfig);
  if (corsResponse) return corsResponse;

  return response;
}
