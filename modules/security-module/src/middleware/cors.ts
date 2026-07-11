import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_CORS } from '../constants';
import type { CorsConfig } from '../types';

export function applyCors(req: NextRequest, response: NextResponse, config: CorsConfig): NextResponse | null {
  const c = { ...DEFAULT_CORS, ...config };
  if (!c.enabled) return null;

  const origin = req.headers.get('origin') ?? '';
  const isAllowed = c.origins.length === 0
    || c.origins.includes('*')
    || c.origins.includes(origin);

  if (!isAllowed) return null;

  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', c.methods.join(', '));

  if (c.allowedHeaders.length > 0) {
    response.headers.set('Access-Control-Allow-Headers', c.allowedHeaders.join(', '));
  }

  if (c.exposedHeaders.length > 0) {
    response.headers.set('Access-Control-Expose-Headers', c.exposedHeaders.join(', '));
  }

  if (c.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    response.headers.set('Access-Control-Max-Age', String(c.maxAge));
    return new NextResponse(null, { status: 204, headers: Object.fromEntries(response.headers.entries()) });
  }

  return null;
}
