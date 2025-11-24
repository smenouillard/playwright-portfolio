// /src/pages/simpleFormDemo.page.ts
// https://www.lambdatest.com/selenium-playground/simple-form-demo

import { Page, Locator } from "@playwright/test";

export class SimpleFormDemoPage {
  // --- Store page instance ---
  private readonly page: Page;

  // --- Single Input Field locators ---
  private readonly singleInput: Locator;
  private readonly singleButton: Locator;
  readonly singleMessage: Locator;

  // --- Two Input Fields locators ---
  private readonly twoFieldA: Locator;
  private readonly twoFieldB: Locator;
  private readonly twoButton: Locator;
  readonly sumResult: Locator;

  constructor(page: Page) {
    // --- Assign page ---
    this.page = page;

    // --- Map single input field ---
    this.singleInput = page.locator('input[id="user-message"]');
    this.singleButton = page.getByRole("button", { name: "Get Checked Value" });
    this.singleMessage = page.locator("#message");

    // --- Map two input fields ---
    this.twoFieldA = page.locator("#sum1");
    this.twoFieldB = page.locator("#sum2");
    this.twoButton = page.getByRole("button", { name: "Get Sum" });
    this.sumResult = page.locator("#addmessage");
  }

  // --- Open page with stable navigation (NO networkidle) ---
  async goto() {
    await this.page.goto(
      "https://www.lambdatest.com/selenium-playground/simple-form-demo"
    );
    await this.page.waitForLoadState("domcontentloaded");
  }

  // --- Fill single field and submit ---
  async enterSingleValue(value: string) {
    await this.singleInput.fill(value);
    await this.singleButton.click();
  }

  // --- Fill two fields and submit ---
  async enterTwoValues(a: string, b: string) {
    await this.twoFieldA.fill(a);
    await this.twoFieldB.fill(b);
    await this.twoButton.click();
  }
}
