import { test, expect } from '@playwright/test';

test.describe('Request Size Limiter', () => {
  test('allows normal sized requests', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).not.toBe(413);
  });

  test('blocks oversized requests', async ({ request }) => {
    const largeBody = 'x'.repeat(3_000_000);
    const res = await request.fetch('/', {
      method: 'GET',
      headers: {
        'content-length': String(largeBody.length),
      },
    });
    expect(res.status()).toBe(413);
  });
});
