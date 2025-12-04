// src/pages/lambdatest/simpleFormDemo.page.ts
// https://www.lambdatest.com/selenium-playground/simple-form-demo

import { Page, Locator } from "@playwright/test";

export class SimpleFormDemoPage {
  private readonly page: Page;

  // Single Input Field locators
  private readonly singleInput: Locator;
  private readonly singleButton: Locator;
  readonly singleMessage: Locator;

  // Two Input Fields locators
  private readonly twoFieldA: Locator;
  private readonly twoFieldB: Locator;
  private readonly twoButton: Locator;
  readonly sumResult: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- Single Input Field ---
    this.singleInput = page.getByPlaceholder("Please enter your Message");
    this.singleButton = page.getByRole("button", { name: "Get Checked Value" });
    this.singleMessage = page.locator("#message");

    // --- Two Input Fields ---
    this.twoFieldA = page.getByPlaceholder("Please enter first value");
    this.twoFieldB = page.getByPlaceholder("Please enter second value");
    this.twoButton = page.getByRole("button", { name: "Get Sum" });
    this.sumResult = page.locator("#addmessage");
  }

  async goto() {
    await this.page.goto("simple-form-demo"); // correct (pas de slash)
    await this.page.waitForLoadState("domcontentloaded");
  }

  async enterSingleValue(value: string) {
    await this.singleInput.fill(value);
    await this.singleButton.click();
  }

  async enterTwoValues(a: string, b: string) {
    await this.twoFieldA.fill(a);
    await this.twoFieldB.fill(b);
    await this.twoButton.click();
  }
}
