import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_XSS } from '../constants';
import type { XssConfig } from '../types';

export function applyXssValidation(req: NextRequest, config: XssConfig): NextResponse | null {
  const c = { ...DEFAULT_XSS, ...config };
  if (!c.enabled) return null;

  const url = req.nextUrl.toString();
  const params = req.nextUrl.searchParams;

  // Check URL path
  if (containsXss(url, c.patterns)) {
    return blocked();
  }

  // Check query parameters
  for (const [_key, value] of params.entries()) {
    if (containsXss(value, c.patterns)) {
      return blocked();
    }
  }

  return null;
}

function containsXss(input: string, patterns: RegExp[]): boolean {
  const decoded = decodeURIComponent(input);
  return patterns.some((pattern) => pattern.test(decoded));
}

function blocked(): NextResponse {
  return new NextResponse(
    JSON.stringify({ error: 'Potentially unsafe content detected' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
