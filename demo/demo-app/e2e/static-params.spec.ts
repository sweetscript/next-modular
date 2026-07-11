import { test, expect } from '@playwright/test';

test.describe('Plan 02: staticParams support', () => {

  test.describe('pre-rendered pages load correctly', () => {
    const staticPaths = [
      '/static-test',
      '/static-test/page-one',
      '/static-test/page-two',
      '/static-test/nested/deep',
      '/static-test/nested/deeper/page',
    ];

    for (const path of staticPaths) {
      test(`renders ${path}`, async ({ page }) => {
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        await expect(page.locator('body')).not.toBeEmpty();
      });
    }
  });

  test.describe('page content reflects correct params', () => {
    test('/static-test/page-one renders with correct slug', async ({ page }) => {
      await page.goto('/static-test/page-one');
      await expect(page.getByTestId('route-param')).toHaveText('page-one');
    });

    test('/static-test/page-two renders with correct slug', async ({ page }) => {
      await page.goto('/static-test/page-two');
      await expect(page.getByTestId('route-param')).toHaveText('page-two');
    });

    test('/static-test/nested/deep renders with correct segments', async ({ page }) => {
      await page.goto('/static-test/nested/deep');
      await expect(page.getByTestId('route-param')).toContainText('deep');
    });

    test('/static-test/nested/deeper/page renders with correct segments', async ({ page }) => {
      await page.goto('/static-test/nested/deeper/page');
      await expect(page.getByTestId('route-param')).toContainText('deeper/page');
    });
  });

  test.describe('paths not in staticParams', () => {
    test('does not return 500 for undeclared path', async ({ page }) => {
      const response = await page.goto('/static-test/not-declared');
      expect(response?.status()).not.toBe(500);
    });
  });

  test.describe('multiple modules do not collide', () => {
    test('static-test root and nested paths both resolve correctly', async ({ page }) => {
      const r1 = await page.goto('/static-test');
      expect(r1?.status()).toBe(200);

      const r2 = await page.goto('/static-test/nested/deep');
      expect(r2?.status()).toBe(200);

      // Verify they render different content
      await page.goto('/static-test/page-one');
      await expect(page.getByTestId('route-param')).toHaveText('page-one');

      await page.goto('/static-test/page-two');
      await expect(page.getByTestId('route-param')).toHaveText('page-two');
    });
  });

});
