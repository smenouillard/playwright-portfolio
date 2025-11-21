// tests/specs/login.spec.ts
// https://the-internet.herokuapp.com

import { test, expect } from '../fixtures/base';
import { env } from '../../src/utils/env';

// Define invalid scenarios
const invalidLoginScenarios = [
  { name: 'invalid username', username: 'wrongUser', password: env.password, expectedMessage: 'Your username is invalid' },
  { name: 'invalid password', username: env.username, password: 'wrongPassword', expectedMessage: 'Your password is invalid' },
  { name: 'empty username', username: '', password: env.password, expectedMessage: 'Your username is invalid' },
  { name: 'empty password', username: env.username, password: '', expectedMessage: 'Your password is invalid' },
  { name: 'both fields empty', username: '', password: '', expectedMessage: 'Your username is invalid' },
];

test.describe('Login tests', () => {
  test('valid login redirects to secure area', async ({ loginPage }) => {
    // Open page
    await loginPage.goto();

    // Login
    await loginPage.login(env.username, env.password);

    // Check secure area
    expect(await loginPage.isOnSecureArea()).toBe(true);
  });

  invalidLoginScenarios.forEach(({ name, username, password, expectedMessage }) => {
    test(`invalid login – ${name}`, async ({ loginPage }) => {
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
