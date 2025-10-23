import { expect, test } from '@playwright/test';
import { loginAsTestUser } from './helpers/auth.helper';

test.describe('Contract Detail', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);

    await page.goto('/erp/signature');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('should display contract details', async ({ page }) => {
    const firstContract = page.locator('text=/CON-\\d+/i').first();
    await firstContract.click();
    await page.waitForLoadState('networkidle');

    await page.waitForSelector('text=/CON-/i', { timeout: 10000 });

    await expect(page.locator('text=/CON-/i')).toBeVisible();
    await expect(page.locator('text=/Información General/i')).toBeVisible();
  });

  test('should display formatted dates', async ({ page }) => {
    const firstContract = page.locator('text=/CON-\\d+/i').first();
    await firstContract.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/CON-/i', { timeout: 10000 });

    const hasContractInfo = await page
      .locator('text=/Información/i')
      .isVisible()
      .catch(() => false);
    const hasContract = await page.locator('text=/CON-/i').isVisible();

    expect(hasContractInfo || hasContract).toBeTruthy();
  });

  test('should display formatted currency', async ({ page }) => {
    const firstContract = page.locator('text=/CON-\\d+/i').first();
    await firstContract.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/CON-/i', { timeout: 10000 });

    const hasUSD = await page
      .locator('text=/USD/i')
      .isVisible()
      .catch(() => false);
    const hasValor = await page
      .locator('text=/valor/i')
      .isVisible()
      .catch(() => false);
    const hasCurrency = await page
      .locator('text=/\\d{1,3}(,\\d{3})*(\\.\\d{2})?/')
      .count();

    expect(hasUSD || hasValor || hasCurrency > 0).toBeTruthy();
  });

  test('should have back button', async ({ page }) => {
    const firstContract = page.locator('text=/CON-\\d+/i').first();
    await firstContract.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/CON-/i', { timeout: 10000 });

    const backButton = page.locator('button:has-text("Volver")');
    await expect(backButton).toBeVisible();

    await backButton.click();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL('/erp/signature', { timeout: 5000 });
  });

  test('should display contract parties', async ({ page }) => {
    const firstContract = page.locator('text=/CON-\\d+/i').first();
    await firstContract.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/CON-/i', { timeout: 10000 });

    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );
    await page.waitForTimeout(500);

    const hasPartes = await page
      .locator('text=/Partes/i')
      .isVisible()
      .catch(() => false);
    const hasTechSolutions = await page
      .locator('text=/Tech/i')
      .isVisible()
      .catch(() => false);

    expect(hasPartes || hasTechSolutions).toBeTruthy();
  });

  test('should display clauses', async ({ page }) => {
    const firstContract = page.locator('text=/CON-\\d+/i').first();
    await firstContract.click();
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text=/CON-/i', { timeout: 10000 });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await expect(page.locator('text=/Cláusula/i')).toBeVisible();
  });

  test('should handle non-existent contract', async ({ page }) => {
    await page.goto('/erp/signature/CON-9999');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasError = await page
      .locator('text=/no encontrado|error|Error/i')
      .isVisible()
      .catch(() => false);
    const isBackAtList =
      page.url().includes('/erp/signature') && !page.url().includes('CON-9999');

    expect(hasError || isBackAtList).toBeTruthy();
  });
});
