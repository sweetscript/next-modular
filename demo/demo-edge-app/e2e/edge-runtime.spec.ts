import { test, expect } from '@playwright/test';

test.describe('Plan 03: Edge runtime compatibility', () => {

  test.describe('API routes via stateless edge handler', () => {
    test('GET /api/edge-test/ping returns { pong: true }', async ({ request }) => {
      const response = await request.get('/api/edge-test/ping');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.pong).toBe(true);
    });

    test('GET /api/edge-test/headers echoes request headers as JSON', async ({ request }) => {
      const response = await request.get('/api/edge-test/headers', {
        headers: { 'X-Test-Probe': 'hello' },
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body['x-test-probe']).toBe('hello');
    });

    test('GET /api/edge-test/abc returns dynamic param { id: "abc" }', async ({ request }) => {
      const response = await request.get('/api/edge-test/abc');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.id).toBe('abc');
    });

    test('GET /api/edge-test/xyz returns dynamic param { id: "xyz" }', async ({ request }) => {
      const response = await request.get('/api/edge-test/xyz');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.id).toBe('xyz');
    });
  });

  test.describe('middleware via stateless edge handler', () => {
    test('response on /edge-test/* includes X-Edge-Module header', async ({ request }) => {
      const response = await request.get('/edge-test');
      expect(response.headers()['x-edge-module']).toBe('true');
    });

    test('response on /api/edge-test/* includes X-Edge-Module header', async ({ request }) => {
      const response = await request.get('/api/edge-test/ping');
      expect(response.headers()['x-edge-module']).toBe('true');
    });
  });

  test.describe('page routes via stateless handler', () => {
    test('GET /edge-test renders page successfully', async ({ page }) => {
      const response = await page.goto('/edge-test');
      expect(response?.status()).toBe(200);
      await expect(page.locator('body')).not.toBeEmpty();
    });

    test('GET /edge-test/42 renders detail page with correct id', async ({ page }) => {
      await page.goto('/edge-test/42');
      await expect(page.getByTestId('route-param')).toHaveText('42');
    });
  });

});
