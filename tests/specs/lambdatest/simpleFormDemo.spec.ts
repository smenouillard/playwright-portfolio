// tests/specs/lambdatest/simpleFormDemo.spec.ts
// https://www.lambdatest.com/selenium-playground/simple-form-demo

import { test, expect } from '../../fixtures/base';
import { appUrls } from '../../../src/config/appUrls';

test.use({ baseURL: appUrls.lambdaTest });

// generate random valid values
const randomA = Math.floor(Math.random() * 50) + 1;
const randomB = Math.floor(Math.random() * 50) + 1;
const randomSum = String(randomA + randomB);

// data-driven scenarios
const sumScenarios = [
  { name: "valid random numbers", a: String(randomA), b: String(randomB), expected: randomSum },
  { name: 'invalid first value', a: 'abc', b: '5', expected: 'Entered value is not a number' },
  { name: 'invalid second value', a: '5', b: 'xyz', expected: 'Entered value is not a number' },
  { name: 'both invalid', a: 'aaa', b: 'bbb', expected: 'Entered value is not a number' },
  { name: 'empty first value', a: '', b: '5', expected: 'Entered value is not a number' },
  { name: 'empty second value', a: '5', b: '', expected: 'Entered value is not a number' },
  { name: 'both empty', a: '', b: '', expected: 'Entered value is not a number' }
];

test.describe('Simple Form Demo', () => {

  test('Single Input Field', async ({ simpleFormDemoPage }) => {

    // open page
    await simpleFormDemoPage.goto();

    // enter value
    await simpleFormDemoPage.enterSingleValue('Hello Playwright');

    // check result
    await expect(simpleFormDemoPage.singleMessage).toHaveText('Hello Playwright');
  });

  sumScenarios.forEach(({ name, a, b, expected }) => {
    test(`Two Input Fields - ${name}`, async ({ simpleFormDemoPage }) => {

      // open page
      await simpleFormDemoPage.goto();

      // enter values
      await simpleFormDemoPage.enterTwoValues(a, b);

      // check result
      await expect(simpleFormDemoPage.sumResult).toHaveText(expected);
    });
  });

});
