// tests/specs/the-internet/login.spec.ts
// https://the-internet.herokuapp.com

import { test, expect } from '@playwright/test';
import { secrets } from '../../../src/config/secrets';
import { appUrls } from '../../../src/config/appUrls';
import { LoginPage } from '../../../src/pages/the-internet/login.page';

test.use({ baseURL: appUrls.theInternet });

// Define invalid scenarios
const invalidLoginScenarios = [
  { name: 'invalid username', username: 'wrongUser', password: secrets.internet.password, expectedMessage: 'Your username is invalid' },
  { name: 'invalid password', username: secrets.internet.username, password: 'wrongPassword', expectedMessage: 'Your password is invalid' },
  { name: 'empty username', username: '', password: secrets.internet.password, expectedMessage: 'Your username is invalid' },
  { name: 'empty password', username: secrets.internet.username, password: '', expectedMessage: 'Your password is invalid' },
  { name: 'both fields empty', username: '', password: '', expectedMessage: 'Your username is invalid' },
];

test.describe('Login tests', () => {
  test('valid login redirects to secure area', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Open page
    await loginPage.goto();

    // Login
    await loginPage.login(secrets.internet.username, secrets.internet.password);

    // Check secure area
    expect(await loginPage.isOnSecureArea()).toBe(true);
  });

  invalidLoginScenarios.forEach(({ name, username, password, expectedMessage }) => {
    test(`invalid login - ${name}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Open page
      await loginPage.goto();

      // Submit invalid
      await loginPage.submitInvalidLogin(username, password);

      // Check flash message
      const msg = await loginPage.getFlashMessage();
      expect(msg).toContain(expectedMessage);
    });
  });
});
