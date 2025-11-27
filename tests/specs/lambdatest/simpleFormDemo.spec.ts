// tests/specs/lambdatest/simpleFormDemo.spec.ts
// https://www.lambdatest.com/selenium-playground/simple-form-demo

import { test, expect } from '../../fixtures/base';
import { appUrls } from '../../../src/config/appUrls';

test.use({ baseURL: appUrls.lambdaTest });

test('Single Input Field', async ({ simpleFormDemoPage }) => {
  // Open page
  await simpleFormDemoPage.goto();

  // Enter value
  await simpleFormDemoPage.enterSingleValue('Hello Playwright');

  // Check result
  await expect(simpleFormDemoPage.singleMessage).toHaveText('Hello Playwright');
});

test('Two Input Fields', async ({ simpleFormDemoPage }) => {
  // Open page
  await simpleFormDemoPage.goto();

  // Enter values
  await simpleFormDemoPage.enterTwoValues('5', '7');

  // Check sum
  await expect(simpleFormDemoPage.sumResult).toHaveText('12');
});
