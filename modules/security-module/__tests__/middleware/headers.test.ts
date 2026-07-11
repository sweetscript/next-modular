import { describe, it, expect } from 'vitest';
import { applyHeaders } from '../../src/middleware/headers';
import { createResponse } from '../helpers';

describe('applyHeaders', () => {
  it('sets default security headers', () => {
    const response = createResponse();
    applyHeaders(response, {});

    expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(response.headers.get('X-DNS-Prefetch-Control')).toBe('off');
    expect(response.headers.get('X-Download-Options')).toBe('noopen');
    expect(response.headers.get('X-Permitted-Cross-Domain-Policies')).toBe('none');
    expect(response.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin');
    expect(response.headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
    expect(response.headers.get('Cross-Origin-Embedder-Policy')).toBe('credentialless');
  });

  it('sets HSTS header with includeSubDomains', () => {
    const response = createResponse();
    applyHeaders(response, { hsts: { maxAge: 31536000, includeSubDomains: true } });

    expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
  });

  it('sets HSTS header with preload', () => {
    const response = createResponse();
    applyHeaders(response, { hsts: { maxAge: 31536000, includeSubDomains: true, preload: true } });

    expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains; preload');
  });

  it('disables specific headers when set to false', () => {
    const response = createResponse();
    applyHeaders(response, { xFrameOptions: false, xContentTypeOptions: false });

    expect(response.headers.get('X-Frame-Options')).toBeNull();
    expect(response.headers.get('X-Content-Type-Options')).toBeNull();
  });

  it('sets custom CSP string', () => {
    const response = createResponse();
    applyHeaders(response, { contentSecurityPolicy: "default-src 'self'" });

    expect(response.headers.get('Content-Security-Policy')).toBe("default-src 'self'");
  });

  it('builds CSP from object config', () => {
    const response = createResponse();
    applyHeaders(response, {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
      },
    });

    const csp = response.headers.get('Content-Security-Policy');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("img-src 'self' data:");
  });

  it('injects nonce into CSP when placeholder is used', () => {
    const response = createResponse();
    applyHeaders(response, {
      contentSecurityPolicy: {
        'script-src': ["'self'", "'nonce-{{nonce}}'"],
      },
    }, 'test-nonce-123');

    const csp = response.headers.get('Content-Security-Policy');
    expect(csp).toContain("'nonce-test-nonce-123'");
  });

  it('sets Permissions-Policy header', () => {
    const response = createResponse();
    applyHeaders(response, {
      permissionsPolicy: { camera: [], geolocation: ['self'] },
    });

    const pp = response.headers.get('Permissions-Policy');
    expect(pp).toContain('camera=()');
    expect(pp).toContain('geolocation=("self")');
  });
});
