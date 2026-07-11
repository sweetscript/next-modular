import { test, expect } from '@playwright/test';

test.describe('Method Restricter', () => {
  test('allows GET requests when not restricted', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).not.toBe(405);
  });
});
