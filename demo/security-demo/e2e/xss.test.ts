import { test, expect } from '@playwright/test';

test.describe('XSS Validation', () => {
  test('allows safe query parameters', async ({ request }) => {
    const res = await request.get('/?search=hello');
    expect(res.status()).not.toBe(400);
  });

  test('blocks script tags in query params', async ({ request }) => {
    const res = await request.get('/?q=%3Cscript%3Ealert(1)%3C/script%3E');
    expect(res.status()).toBe(400);
  });

  test('blocks javascript: protocol in params', async ({ request }) => {
    const res = await request.get('/?url=javascript:void(0)');
    expect(res.status()).toBe(400);
  });

  test('blocks event handler patterns', async ({ request }) => {
    const res = await request.get('/?x=test%20onload%3Dalert(1)');
    expect(res.status()).toBe(400);
  });
});
