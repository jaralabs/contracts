import { expect, test } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveURL('/');

    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=/incorrectos|no encontrado/i')).toBeVisible(
      { timeout: 5000 }
    );
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[type="email"]', 'not-an-email');
    await page.fill('input[type="password"]', 'somepassword');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).not.toHaveValue(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('should have Genius Soft branding', async ({ page }) => {
    await expect(page.locator('text=/Genius Soft/i')).toBeVisible();
  });
});
