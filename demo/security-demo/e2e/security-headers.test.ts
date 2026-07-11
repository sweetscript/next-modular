import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('sets X-Frame-Options', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['x-frame-options']).toBe('SAMEORIGIN');
  });

  test('sets X-Content-Type-Options', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['x-content-type-options']).toBe('nosniff');
  });

  test('sets Referrer-Policy', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
  });

  test('sets Strict-Transport-Security', async ({ request }) => {
    const res = await request.get('/');
    const hsts = res.headers()['strict-transport-security'];
    expect(hsts).toContain('max-age=');
  });

  test('sets Cross-Origin headers', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['cross-origin-resource-policy']).toBe('same-origin');
    expect(res.headers()['cross-origin-opener-policy']).toBe('same-origin');
  });

  test('sets X-DNS-Prefetch-Control', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['x-dns-prefetch-control']).toBe('off');
  });

  test('sets Content-Security-Policy', async ({ request }) => {
    const res = await request.get('/');
    const csp = res.headers()['content-security-policy'];
    expect(csp).toBeTruthy();
    expect(csp).toContain("'self'");
  });

  test('sets Permissions-Policy', async ({ request }) => {
    const res = await request.get('/');
    const pp = res.headers()['permissions-policy'];
    expect(pp).toBeTruthy();
    expect(pp).toContain('camera=()');
  });

  test('includes nonce header', async ({ request }) => {
    const res = await request.get('/');
    const nonce = res.headers()['x-nonce'];
    expect(nonce).toBeTruthy();
  });
});
