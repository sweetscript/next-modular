import { test, expect } from '@playwright/test';

test.describe('Example module (basePath: /example)', () => {
  test.describe('routes', () => {
    test('renders the home route at /example', async ({ page }) => {
      const response = await page.goto('/example');
      expect(response?.status()).toBe(200);
      await expect(
        page.getByRole('heading', { name: 'Welcome to the example module' }),
      ).toBeVisible();
    });

    test('renders the dynamic detail route at /example/[id]', async ({ page }) => {
      const response = await page.goto('/example/123');
      expect(response?.status()).toBe(200);
      // The id is reflected in the page content.
      await expect(page.getByRole('heading', { level: 1 })).toContainText('123');
    });

    test('renders the static /example/about route (not the dynamic [id] route)', async ({
      page,
    }) => {
      const response = await page.goto('/example/about');
      expect(response?.status()).toBe(200);
      // Static routes are declared before dynamic ones, so /about must resolve
      // to the about page rather than being captured by /[id].
      await expect(
        page.getByRole('heading', {
          name: 'Registered with the direct component form',
        }),
      ).toBeVisible();
    });
  });

  test.describe('route metadata', () => {
    test('static metadata sets the home page title', async ({ page }) => {
      await page.goto('/example');
      await expect(page).toHaveTitle('Example Module');
    });

    test('generateMetadata builds the detail title from the route params', async ({
      page,
    }) => {
      await page.goto('/example/123');
      await expect(page).toHaveTitle('Item 123 — Example Module');
    });
  });

  test.describe('api routes', () => {
    test('GET /api/example/hello returns the module response', async ({ request }) => {
      const response = await request.get('/api/example/hello');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.message).toContain('example-module');
    });

    test('GET /api/example/items/[id] echoes the id', async ({ request }) => {
      const response = await request.get('/api/example/items/42');
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.id).toBe('42');
    });
  });
});
