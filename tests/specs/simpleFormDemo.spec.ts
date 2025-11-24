// /tests/specs/simpleFormDemo.spec.ts
// https://www.lambdatest.com

import { test, expect } from "@playwright/test";
import { SimpleFormDemoPage } from "../../src/pages/simpleFormDemo.page";

// Override baseURL only for this test file
test.use({
  baseURL: "https://www.lambdatest.com",
});

test.describe("Simple Form Demo", () => {

  // Go to page before each test
  test.beforeEach(async ({ page }) => {
    const simpleForm = new SimpleFormDemoPage(page);
    await simpleForm.goto();
  });

  test("Single Input Field: valid text and empty value", async ({ page }) => {
    const simpleForm = new SimpleFormDemoPage(page);

    // Enter text and verify result
    await simpleForm.enterSingleValue("Sylvain Menouillard");
    await expect(simpleForm.singleResult).toHaveText("Sylvain Menouillard");

    // Enter empty value and verify empty result
    await simpleForm.enterSingleValue("");
    await expect(simpleForm.singleResult).toHaveText("");
  });

  test("Two Input Fields: numeric validation and sum (randomized)", async ({ page }) => {
    const simpleForm = new SimpleFormDemoPage(page);

    // Reject invalid input in field A
    await simpleForm.enterTwoValues("abc", "10");
    await expect(simpleForm.sumResult).toHaveText("Entered value is not a number");

    // Reject invalid input in field B
    await simpleForm.enterTwoValues("10", "xyz");
    await expect(simpleForm.sumResult).toHaveText("Entered value is not a number");

    // Reject both fields invalid
    await simpleForm.enterTwoValues("abc", "def");
    await expect(simpleForm.sumResult).toHaveText("Entered value is not a number");

    // Generate random valid values
    const a = Math.floor(Math.random() * 100) + 1;
    const b = Math.floor(Math.random() * 100) + 1;
    const expectedSum = (a + b).toString();

    // Enter valid values and verify correct sum
    await simpleForm.enterTwoValues(a.toString(), b.toString());
    await expect(simpleForm.sumResult).toHaveText(expectedSum);
  });
});
