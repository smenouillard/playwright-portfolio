// src/pages/the-internet/addRemoveElements.page.ts
// https://the-internet.herokuapp.com/

import { Page, Locator } from '@playwright/test';

export class AddRemoveElementsPage {
  readonly page: Page;

  // Add button
  readonly addButton: Locator;

  // Delete buttons container
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    // Button that adds new delete buttons
    this.addButton = page.locator('button:has-text("Add Element")');

    // All delete buttons inside #elements
    this.deleteButtons = page.locator('#elements button.added-manually');
  }

  // Navigate to Add/Remove Elements page
  async goto() {
    await this.page.goto('add_remove_elements/');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
