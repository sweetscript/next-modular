import { NextRequest, NextResponse } from 'next/server';
import { getModuleConfig } from 'next-modular';
import {
  applyHeaders,
  applyRateLimit,
  applyCors,
  applyCsrf,
  applyMethodRestricter,
  applyRequestSize,
  applyXssValidation,
} from '../middleware';
import { generateNonce } from '../utils';
import type { SecurityModuleConfig } from '../types';

export async function securityMiddleware(req: NextRequest): Promise<NextResponse | void> {
  const config = getModuleConfig<SecurityModuleConfig>('security-module') ?? {};

  // Method restricter (early reject)
  if (config.methodRestricter !== false) {
    const result = applyMethodRestricter(req, config.methodRestricter ?? {});
    if (result) return result;
  }

  // Request size limiter (early reject)
  if (config.requestSize !== false) {
    const result = applyRequestSize(req, config.requestSize ?? {});
    if (result) return result;
  }

  // Rate limiting (early reject)
  if (config.rateLimit !== false) {
    const result = applyRateLimit(req, config.rateLimit ?? {});
    if (result) return result;
  }

  // XSS validation (early reject)
  if (config.xss !== false) {
    const result = applyXssValidation(req, config.xss ?? {});
    if (result) return result;
  }

  // Generate nonce for CSP
  let nonce: string | undefined;
  if (config.nonce !== false) {
    nonce = generateNonce();
  }

  // Clone request headers and add nonce so Next.js can read it during rendering
  const requestHeaders = new Headers(req.headers);
  if (nonce) {
    requestHeaders.set('x-nonce', nonce);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // CSRF protection
  if (config.csrf !== false) {
    const result = applyCsrf(req, response, config.csrf ?? {});
    if (result) return result;
  }

  // Security headers (with nonce if enabled)
  if (config.headers !== false) {
    applyHeaders(response, config.headers ?? {}, nonce);
  }

  // Also set nonce on response for downstream consumers
  if (nonce) {
    response.headers.set('x-nonce', nonce);
  }

  // CORS
  if (config.cors !== false) {
    const result = applyCors(req, response, config.cors ?? {});
    if (result) return result;
  }

  return response;
}
