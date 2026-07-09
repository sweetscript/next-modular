import { test, expect } from '@playwright/test';

test.describe('Plan 01: nextConfig extension', () => {

  test.describe('headers', () => {
    test('injects X-Test-Module-Header on module routes', async ({ request }) => {
      const response = await request.get('/next-config-test');
      expect(response.headers()['x-test-module-header']).toBe('present');
    });

    test('injects X-Custom-Cache header on module routes', async ({ request }) => {
      const response = await request.get('/next-config-test');
      expect(response.headers()['x-custom-cache']).toBe('no-store');
    });

    test('does not inject module headers on unrelated routes', async ({ request }) => {
      const response = await request.get('/');
      expect(response.headers()['x-test-module-header']).toBeUndefined();
    });
  });

  test.describe('redirects', () => {
    test('redirects /old-next-config-test to /next-config-test permanently', async ({ request }) => {
      const response = await request.get('/old-next-config-test', {
        maxRedirects: 0,
      });
      // Next.js may return 301 or 308 for permanent redirects depending on version/mode
      expect([301, 308]).toContain(response.status());
      expect(response.headers()['location']).toContain('/next-config-test');
    });
  });

  test.describe('rewrites', () => {
    test('beforeFiles rewrite: /next-config-test-alias serves content without redirecting', async ({ page }) => {
      await page.goto('/next-config-test-alias');
      expect(page.url()).toContain('/next-config-test-alias');
      await expect(page.locator('body')).not.toBeEmpty();
    });

    test('afterFiles rewrite: /next-config-test/legacy/hello serves /next-config-test/hello content', async ({ page }) => {
      await page.goto('/next-config-test/legacy/hello');
      expect(page.url()).toContain('/next-config-test/legacy/hello');
      await expect(page.locator('body')).not.toBeEmpty();
    });
  });

});
