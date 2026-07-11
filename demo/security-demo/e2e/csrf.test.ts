import { test, expect } from '@playwright/test';

// CSRF is disabled by default in demo config
// These tests verify it doesn't interfere when disabled
test.describe('CSRF Protection', () => {
  test('allows requests without CSRF token when disabled', async ({ request }) => {
    const res = await request.get('/api/example-module/hello');
    expect(res.status()).not.toBe(403);
  });
});
