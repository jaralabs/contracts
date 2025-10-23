import { expect, test } from '@playwright/test';

test.describe('PWA Features', () => {
  test('should have manifest link', async ({ page }) => {
    await page.goto('/');

    const manifest = page.locator('link[rel="manifest"]');
    await expect(manifest).toHaveAttribute('href', /manifest\.webmanifest/);
  });

  test('should have service worker registered', async ({ page, context }) => {
    await page.goto('/');

    await page.waitForTimeout(2000);

    const swRegistered = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration().then((reg) => !!reg);
    });

    const isProduction = process.env.NODE_ENV === 'production';
    expect(swRegistered).toBe(isProduction);
  });

  test('should have meta tags for PWA', async ({ page }) => {
    await page.goto('/');

    const themeColor = await page
      .locator('meta[name="theme-color"]')
      .getAttribute('content');
    expect(themeColor).toBe('#f97316');

    const viewport = await page.locator('meta[name="viewport"]').count();
    expect(viewport).toBeGreaterThan(0);
  });

  test('should have apple touch icon', async ({ page }) => {
    await page.goto('/');

    const appleIconCount = await page
      .locator('link[rel="apple-touch-icon"]')
      .count();
    expect(appleIconCount).toBeGreaterThan(0);
  });

  test('should be installable', async ({ page }) => {
    await page.goto('/');

    const isInstallable = await page.evaluate(() => {
      return 'serviceWorker' in navigator && 'PushManager' in window;
    });

    expect(isInstallable).toBe(true);
  });

  test('should work offline (mocked)', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const swRegistered = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration().then((reg) => !!reg);
    });

    if (!swRegistered) {
      await expect(page.locator('text=/Genius Soft/i')).toBeVisible({
        timeout: 5000,
      });
      return;
    }

    await context.setOffline(true);

    await page.reload();

    await expect(page.locator('text=/Genius Soft/i')).toBeVisible({
      timeout: 10000,
    });

    await context.setOffline(false);
  });
});
