import { expect, test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';

test.describe('OrangeHRM login', () => {
  test('shows the login form', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.expectLoginFormVisible();
  });

  test('logs in with the demo account', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(
      process.env.ORANGEHRM_USERNAME ?? 'Admin',
      process.env.ORANGEHRM_PASSWORD ?? 'admin123',
    );

    await expect(
      page.getByRole('heading', { name: 'Dashboard' }),
    ).toBeVisible();
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('invalid-user', 'invalid-password');

    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
