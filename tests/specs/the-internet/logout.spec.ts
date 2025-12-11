// tests/specs/the-internet/logout.spec.ts
// https://the-internet.herokuapp.com

import { test, expect } from '@playwright/test';
import { secrets } from '../../../src/config/secrets';
import { appUrls } from '../../../src/config/appUrls';
import { LoginPage } from '../../../src/pages/the-internet/login.page';

// Set baseURL for The Internet
test.use({ baseURL: appUrls.theInternet });

test.describe('Logout tests', () => {

  test('Logout and verify redirect', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Open login page
    await loginPage.goto();

    // Login
    await loginPage.login(secrets.internet.username, secrets.internet.password);

    // (NOTE : in a real app this would be done via API session setup, here UI login is required as we don't have API access)

    // Logout
    await page.locator('a[href="/logout"]').click();

    // Check redirect back to login
    await expect(page).toHaveURL(/.*login/);

    // Verify flash message
    await expect(page.locator('#flash')).toContainText('logged out');
  });

});
