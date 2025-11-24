// /src/pages/simpleFormDemo.page.ts
// https://www.lambdatest.com

import { Page, Locator } from "@playwright/test";

export class SimpleFormDemoPage {
  // Set page elements
  readonly page: Page;
  readonly singleInput: Locator;
  readonly singleButton: Locator;
  readonly singleResult: Locator;

  readonly inputA: Locator;
  readonly inputB: Locator;
  readonly getTotalButton: Locator;
  readonly sumResult: Locator;

  constructor(page: Page) {
    this.page = page;

    // Select single input field (unique input, avoids duplicate IDs)
    this.singleInput = page.getByRole("textbox", { name: "Please enter your Message" });

    // Select single input button
    this.singleButton = page.locator("#showInput");

    // Select displayed message for single input
    this.singleResult = page.locator("#message");

    // Select first number input
    this.inputA = page.locator("#sum1");

    // Select second number input
    this.inputB = page.locator("#sum2");

    // Select sum calculation button
    this.getTotalButton = page.getByRole("button", { name: "Get Sum" });

    // Select sum result
    this.sumResult = page.locator("#addmessage");
  }

  // Go to Simple Form Demo page
  async goto() {
    await this.page.goto("/selenium-playground/simple-form-demo");
  }

  // Fill single input and submit
  async enterSingleValue(value: string) {
    await this.singleInput.fill(value);
    await this.singleButton.click();
  }

  // Fill numeric fields and calculate sum
  async enterTwoValues(a: string, b: string) {
    await this.inputA.fill(a);
    await this.inputB.fill(b);
    await this.getTotalButton.click();
  }
}
