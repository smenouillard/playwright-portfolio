// tests/specs/the-internet/checkboxes.spec.ts
// https://the-internet.herokuapp.com

import { test, expect } from '@playwright/test';
import { CheckboxesPage } from '../../../src/pages/the-internet/checkboxes.page';
import { appUrls } from '../../../src/config/appUrls';

// Set baseURL for The Internet
test.use({ baseURL: appUrls.theInternet });

test.describe('Checkboxes tests – state machine validation', () => {

  test('Validate all checkbox state transitions', async ({ page }) => {
    const c = new CheckboxesPage(page);
    await c.goto();

    // Define all transitions in a declarative state machine
    const scenarios = [
      { action: 'initial', cb1: false, cb2: true, run: async () => { } },
      { action: 'check cb1', cb1: true, cb2: true, run: async () => c.checkbox1.check() },
      { action: 'uncheck cb2', cb1: true, cb2: false, run: async () => c.checkbox2.uncheck() },
      { action: 'uncheck cb1', cb1: false, cb2: false, run: async () => c.checkbox1.uncheck() },
      { action: 'reset cb2', cb1: false, cb2: true, run: async () => c.checkbox2.check() },
    ];

    // Execute each transition and validate resulting state
    for (const s of scenarios) {
      await s.run();

      await expect(c.checkbox1, `After: ${s.action}`).toHaveJSProperty('checked', s.cb1);
      await expect(c.checkbox2, `After: ${s.action}`).toHaveJSProperty('checked', s.cb2);
    }
  });
});
