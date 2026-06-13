import { NextResponse } from 'next/server';
import { DEFAULT_HEADERS } from '../constants';
import { buildCspString } from '../utils/csp-builder';
import { buildPermissionsPolicyString } from '../utils/permissions-policy-builder';
import type { SecurityHeadersConfig, ContentSecurityPolicyConfig } from '../types';

export function applyHeaders(response: NextResponse, config: SecurityHeadersConfig, nonce?: string): void {
  const h = { ...DEFAULT_HEADERS, ...config };

  if (h.hidePoweredBy) {
    response.headers.delete('X-Powered-By');
  }

  if (h.xFrameOptions !== false) {
    response.headers.set('X-Frame-Options', h.xFrameOptions as string);
  }

  if (h.xContentTypeOptions !== false) {
    response.headers.set('X-Content-Type-Options', h.xContentTypeOptions as string);
  }

  if (h.referrerPolicy !== false) {
    response.headers.set('Referrer-Policy', h.referrerPolicy as string);
  }

  if (h.hsts !== false && h.hsts) {
    let value = `max-age=${h.hsts.maxAge}`;
    if (h.hsts.includeSubDomains) value += '; includeSubDomains';
    if (h.hsts.preload) value += '; preload';
    response.headers.set('Strict-Transport-Security', value);
  }

  if (h.contentSecurityPolicy !== false && h.contentSecurityPolicy) {
    const cspValue = typeof h.contentSecurityPolicy === 'string'
      ? h.contentSecurityPolicy
      : buildCspString(h.contentSecurityPolicy as ContentSecurityPolicyConfig, nonce);
    response.headers.set('Content-Security-Policy', cspValue);
  }

  if (h.crossOriginResourcePolicy !== false) {
    response.headers.set('Cross-Origin-Resource-Policy', h.crossOriginResourcePolicy as string);
  }

  if (h.crossOriginOpenerPolicy !== false) {
    response.headers.set('Cross-Origin-Opener-Policy', h.crossOriginOpenerPolicy as string);
  }

  if (h.crossOriginEmbedderPolicy !== false) {
    response.headers.set('Cross-Origin-Embedder-Policy', h.crossOriginEmbedderPolicy as string);
  }

  if (h.xDnsPrefetchControl !== false) {
    response.headers.set('X-DNS-Prefetch-Control', h.xDnsPrefetchControl as string);
  }

  if (h.xDownloadOptions !== false) {
    response.headers.set('X-Download-Options', h.xDownloadOptions as string);
  }

  if (h.xPermittedCrossDomainPolicies !== false) {
    response.headers.set('X-Permitted-Cross-Domain-Policies', h.xPermittedCrossDomainPolicies as string);
  }

  if (h.permissionsPolicy !== false && h.permissionsPolicy) {
    response.headers.set('Permissions-Policy', buildPermissionsPolicyString(h.permissionsPolicy));
  }
}
