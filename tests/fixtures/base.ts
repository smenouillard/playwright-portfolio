// tests/fixtures/base.ts
// https://the-internet.herokuapp.com

import { test as base } from '@playwright/test';
import { LoginPage } from '../../src/pages/the-internet/login.page';
import { SimpleFormDemoPage } from '../../src/pages/lambdatest/simpleFormDemo.page';

// Define fixture types
type Fixtures = {
  loginPage: LoginPage;
  simpleFormDemoPage: SimpleFormDemoPage;
};

// Extend base test
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  simpleFormDemoPage: async ({ page }, use) => {
    const simpleFormDemoPage = new SimpleFormDemoPage(page);
    await use(simpleFormDemoPage);
  },
});

// Export expect helper
export const expect = test.expect;
