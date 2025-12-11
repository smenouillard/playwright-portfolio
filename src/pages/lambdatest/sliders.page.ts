// src/pages/lambdatest/sliders.page.ts
// https://www.lambdatest.com/selenium-playground/

import { Page } from '@playwright/test';

export class SlidersPage {
  constructor(private page: Page) { }

  async goto() {
    // go to sliders demo
    await this.page.goto('drag-drop-range-sliders-demo');
  }

  sliderDefault25() {
    // return slider input
    return this.page.locator('#slider3 input[type="range"]');
  }

  outputDefault25() {
    // return output value element
    return this.page.locator('#rangeSuccess');
  }

  async setSliderTo(value: number) {
    const slider = this.sliderDefault25();

    // wait for slider
    await slider.waitFor({ state: 'visible' });

    // scroll into view
    await slider.scrollIntoViewIfNeeded();

    // get element handle
    const handle = await slider.elementHandle();
    if (!handle) return;

    // cast handle to HTMLElement inside evaluate
    await this.page.evaluate(
      ({ el, value }) => {
        const s = el as unknown as HTMLInputElement;
        s.value = String(value);
        s.dispatchEvent(new Event('input', { bubbles: true }));
        s.dispatchEvent(new Event('change', { bubbles: true }));

        const output = s.nextElementSibling as HTMLOutputElement | null;
        if (output) output.textContent = s.value;
      },
      // pass both params through one object
      { el: handle, value }
    );
  }
}
