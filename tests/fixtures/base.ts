// tests/fixtures/base.ts
// https://the-internet.herokuapp.com

import { test as base } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';

// Define fixture types
type Fixtures = {
  loginPage: LoginPage;
};

// Extend base test
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    // Init login POM
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

// Export expect helper
export const expect = test.expect;
