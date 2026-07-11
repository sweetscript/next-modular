import { test, expect } from '@playwright/test';

test.describe('CORS', () => {
  test('sets CORS headers for allowed origin', async ({ request }) => {
    const res = await request.get('/', {
      headers: { origin: 'http://localhost:3001' },
    });
    expect(res.headers()['access-control-allow-origin']).toBe('http://localhost:3001');
  });

  test('sets allowed methods header', async ({ request }) => {
    const res = await request.get('/', {
      headers: { origin: 'http://localhost:3001' },
    });
    expect(res.headers()['access-control-allow-methods']).toContain('GET');
  });

  test('does not set CORS headers for disallowed origin', async ({ request }) => {
    const res = await request.get('/', {
      headers: { origin: 'http://evil.com' },
    });
    expect(res.headers()['access-control-allow-origin']).toBeUndefined();
  });

  test('handles preflight OPTIONS request', async ({ request }) => {
    const res = await request.fetch('/', {
      method: 'OPTIONS',
      headers: { origin: 'http://localhost:3001' },
    });
    // Proxy sets CORS headers but Next.js controls the status for page routes
    expect(res.headers()['access-control-allow-origin']).toBe('http://localhost:3001');
    expect(res.headers()['access-control-max-age']).toBeTruthy();
  });
});
