import { NextResponse } from 'next/server';
import { DEFAULT_HEADERS } from '../constants';
import type { SecurityHeaders } from '../types';

export function applySecurityHeaders(response: NextResponse, headers: SecurityHeaders): void {
  const h = { ...DEFAULT_HEADERS, ...headers };

  if (h.xFrameOptions) response.headers.set('X-Frame-Options', h.xFrameOptions);
  if (h.xContentTypeOptions) response.headers.set('X-Content-Type-Options', h.xContentTypeOptions);
  if (h.referrerPolicy) response.headers.set('Referrer-Policy', h.referrerPolicy);
  if (h.hsts) {
    const value = `max-age=${h.hsts.maxAge}${h.hsts.includeSubDomains ? '; includeSubDomains' : ''}`;
    response.headers.set('Strict-Transport-Security', value);
  }
  if (h.csp) response.headers.set('Content-Security-Policy', h.csp);
}
