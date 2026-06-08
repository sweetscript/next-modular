import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_CORS } from '../constants';
import type { CorsConfig } from '../types';

export function applyCors(req: NextRequest, response: NextResponse, config: Required<CorsConfig>): NextResponse | void {
  if (!config.enabled) return;

  const origin = req.headers.get('origin') ?? '';
  const isAllowed = config.origins.length === 0 || config.origins.includes(origin) || config.origins.includes('*');

  if (!isAllowed) return;

  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', config.methods.join(', '));

  if (config.credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    response.headers.set('Access-Control-Max-Age', '86400');
    return new NextResponse(null, { status: 204, headers: response.headers }) as NextResponse;
  }
}
