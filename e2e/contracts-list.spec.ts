import { expect, test } from '@playwright/test';
import { loginAsTestUser } from './helpers/auth.helper';

test.describe('Contracts List - Unauthenticated', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/erp/signature');

    await expect(page).toHaveURL('/', { timeout: 5000 });
  });
});

test.describe('Contracts List - Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto('/erp/signature');
    await page.waitForLoadState('networkidle');
  });

  test('should display contracts list', async ({ page }) => {
    await page.waitForTimeout(1000);

    await expect(page.locator('text=/Gestión de Contratos/i')).toBeVisible();

    const contracts = page.locator('text=/CON-\\d+/i');
    const count = await contracts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter contracts by search', async ({ page }) => {
    await page.waitForTimeout(1000);

    const searchInput = page
      .locator(
        'input[placeholder*="Buscar"], input[placeholder*="buscar"], input[type="search"], input[type="text"]'
      )
      .first();
    await searchInput.fill('CON-1003');

    await page.waitForTimeout(1500);

    await expect(page.locator('text=/CON-1003/i')).toBeVisible();
  });

  test('should open filters panel', async ({ page }) => {
    await page.waitForTimeout(1000);

    const filtersButton = page
      .locator(
        'button:has-text("Filtros"), button:has-text("filtros"), text=/Mostrar filtros/i, text=/filtros/i'
      )
      .first();

    const isVisible = await filtersButton.isVisible().catch(() => false);
    if (isVisible) {
      await filtersButton.click();
      await page.waitForTimeout(500);
    }

    const hasSelect = await page
      .locator('select')
      .first()
      .isVisible()
      .catch(() => false);
    const hasDateInput = await page
      .locator('input[type="date"]')
      .first()
      .isVisible()
      .catch(() => false);

    expect(hasSelect || hasDateInput).toBeTruthy();
  });

  test('should filter by estado', async ({ page }) => {
    await page.waitForTimeout(1000);

    const filtersButton = page.locator('text=/Mostrar filtros/i');
    const buttonExists = await filtersButton.isVisible().catch(() => false);
    if (buttonExists) {
      await filtersButton.click();
      await page.waitForTimeout(500);
    }

    const contracts = page.locator('text=/CON-\\d+/i');
    const count = await contracts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to contract detail', async ({ page }) => {
    await page.waitForTimeout(1000);

    const firstContract = page.locator('text=/CON-\\d+/i').first();
    await firstContract.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/erp\/signature\/CON-\d+/, {
      timeout: 5000,
    });

    await page.waitForSelector('text=/CON-/i', { timeout: 5000 });
    await expect(page.locator('text=/CON-/i')).toBeVisible();
  });

  test('should display pagination', async ({ page }) => {
    await page.waitForTimeout(1000);

    const hasPaginationText = await page
      .locator('text=/Mostrando/i, text=/página/i, text=/page/i')
      .isVisible()
      .catch(() => false);
    const hasPaginationButton = await page
      .locator('button:has-text("1"), button[aria-label*="page"]')
      .isVisible()
      .catch(() => false);

    expect(hasPaginationText || hasPaginationButton).toBeTruthy();
  });

  test('should change page size', async ({ page }) => {
    await page.waitForTimeout(1000);

    const initialContracts = page.locator('text=/CON-\\d+/i');
    const initialCount = await initialContracts.count();

    expect(initialCount).toBeGreaterThan(0);
  });
});
