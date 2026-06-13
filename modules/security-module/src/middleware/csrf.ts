import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_CSRF } from '../constants';
import { generateNonce } from '../utils';
import type { CsrfConfig } from '../types';

const UNSAFE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export function applyCsrf(req: NextRequest, response: NextResponse, config: CsrfConfig): NextResponse | null {
  const c = { ...DEFAULT_CSRF, ...config };
  if (!c.enabled) return null;

  const isExcluded = c.excludePaths.some((path) => req.nextUrl.pathname.startsWith(path));
  if (isExcluded) return null;

  const isUnsafe = UNSAFE_METHODS.includes(req.method);

  if (isUnsafe) {
    const cookieToken = req.cookies.get(c.cookieName)?.value;
    const headerToken = req.headers.get(c.headerName);

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF token mismatch' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Set CSRF cookie if not present
  if (!req.cookies.get(c.cookieName)) {
    const token = generateNonce();
    response.cookies.set(c.cookieName, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
    });
  }

  return null;
}
