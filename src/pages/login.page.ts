// src/pages/login.page.ts
// https://the-internet.herokuapp.com

import { Page, Locator } from '@playwright/test';

export class LoginPage {
  // Store page instance
  private readonly page: Page;

  // Store locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly flashMessage: Locator;
  private readonly secureAreaHeader: Locator;

  constructor(page: Page) {
    // Map page
    this.page = page;

    // Map fields
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');

    // Map button
    this.loginButton = page.locator('button[type="submit"]');

    // Map messages
    this.flashMessage = page.locator('#flash');
    this.secureAreaHeader = page.locator('h2:has-text("Secure Area")');
  }

  // Open login page
  async goto() {
    await this.page.goto('/login');
  }

  // Perform valid login
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL('/secure');
  }

  // Perform invalid login
  async submitInvalidLogin(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // Get normalized flash message
  async getFlashMessage(): Promise<string> {
    const raw = await this.flashMessage.textContent();
    return raw ? raw.replace('×', '').trim().replace(/\s+/g, ' ') : '';
  }

  // Check secure area visibility
  async isOnSecureArea(): Promise<boolean> {
    return this.secureAreaHeader.isVisible();
  }
}
