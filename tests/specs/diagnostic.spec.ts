// tests/specs/diagnostic/scenario-mixed.spec.ts
// https://example.com

import { test, expect } from '@playwright/test';

// PASS scenario
test('diagnostic: pass', async () => {
  expect(1).toBe(1);
});

// FAIL scenario (real fail)
test('diagnostic: fail', async () => {
  expect(1).toBe(2);
});

// SKIP scenario
test.skip('diagnostic: skip', () => {
  // intentionally skipped
});
