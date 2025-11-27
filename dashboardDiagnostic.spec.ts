// tests/specs/diagnostic/scenario-mixed.spec.ts
// (used for testing dashboard)

import { test, expect } from '@playwright/test';

// PASS scenario
test('diagnostic: pass', async () => {
  expect(1).toBe(1);
});

// FAIL scenario
test('diagnostic: fail', async () => {
  expect(1).toBe(2);
});

// SKIP scenario
test.skip('diagnostic: skip', () => {
  // intentionally skipped
});
