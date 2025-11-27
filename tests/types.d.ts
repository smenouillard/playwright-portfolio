// tests/types.d.ts

import { LoginPage } from '../src/pages/the-internet/login.page';
import { SimpleFormDemoPage } from '../src/pages/lambdatest/simpleFormDemo.page';

declare global {
  namespace PlaywrightTest {
    interface TestFixtures {
      loginPage: LoginPage;
      simpleFormDemoPage: SimpleFormDemoPage;
    }
  }
}

export { };
