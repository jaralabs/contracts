import { Page, expect } from '@playwright/test';

export function hasValidTestCredentials(): boolean {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  return (
    !!email &&
    !!password &&
    email !== 'test@geniussoft.com' &&
    email !== 'your-test-user@example.com' &&
    password !== 'TestPassword123!' &&
    password !== 'YourTestPassword123!'
  );
}

export async function loginAsTestUser(page: Page) {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.test'
    );
  }

  await page.goto('/');

  await expect(page.locator('input[type="email"]')).toBeVisible({
    timeout: 10000,
  });

  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  await page.click('button[type="submit"]');

  await page.waitForURL((url) => url.pathname !== '/', { timeout: 15000 });

  const isNewPasswordRequired =
    page.url().includes('new-password') ||
    (await page
      .locator('text=/nueva contraseña/i')
      .isVisible()
      .catch(() => false));

  if (isNewPasswordRequired) {
    console.log('New password required - skipping this test scenario');
    throw new Error('New password required for test user');
  }

  await expect(page).toHaveURL(/\/erp/, { timeout: 10000 });

  return true;
}

export async function logout(page: Page) {
  await page.click('button:has-text("Cerrar Sesión")').catch(() => {
    page.click('[aria-label="User menu"]').then(() => {
      page.click('button:has-text("Cerrar Sesión")');
    });
  });

  await expect(page).toHaveURL('/', { timeout: 5000 });
}
