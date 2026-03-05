import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:4000';

test.describe('UX Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Skip loader for all tests
    await page.goto(`${BASE}/?skiploader=true`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
  });

  test('1. Hero section — CTA buttons visible', async ({ page }) => {
    // Screenshot the hero CTA area
    const hero = page.locator('section#top');
    await hero.screenshot({ path: 'tests/e2e/screenshots/verify-cta-buttons.png' });

    // Check the secondary button has a background
    const secondaryBtn = page.locator('a[href="#contact"]').first();
    const bgColor = await secondaryBtn.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    console.log('Secondary CTA background-color:', bgColor);
    // Should NOT be fully transparent
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('2. Single h1 on page', async ({ page }) => {
    const h1Count = await page.locator('h1').count();
    console.log('h1 count:', h1Count);
    expect(h1Count).toBe(1);

    const h1Text = await page.locator('h1').textContent();
    console.log('h1 text:', h1Text);
  });

  test('3. Logo handoff — smooth crossfade', async ({ page }) => {
    const screenshots: string[] = [];

    // Capture logo states at key scroll positions
    for (const scrollY of [0, 50, 100, 150, 200, 250, 300]) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(100);

      // Get hero logo opacity (desktop only)
      const heroLogo = page.locator('.hero .hidden.lg\\:flex img[alt="PALcares"]').first();
      const headerLogo = page.locator('header img[alt="PALcares logo"]').first();

      const heroOpacity = await heroLogo.evaluate((el) => {
        // Walk up to find the motion.div with opacity
        let node: HTMLElement | null = el.parentElement;
        while (node && !node.style.opacity && node.tagName !== 'SECTION') {
          node = node.parentElement;
        }
        return node?.style.opacity || window.getComputedStyle(el.parentElement!).opacity;
      }).catch(() => 'N/A');

      const headerOpacity = await headerLogo.evaluate((el) => {
        let node: HTMLElement | null = el.parentElement;
        while (node && !node.style.opacity && node.tagName !== 'HEADER') {
          node = node.parentElement;
        }
        return node?.style.opacity || window.getComputedStyle(el.parentElement!).opacity;
      }).catch(() => 'N/A');

      console.log(`scroll=${scrollY}px: heroLogo=${heroOpacity}, headerLogo=${headerOpacity}`);

      if (scrollY === 0 || scrollY === 150 || scrollY === 300) {
        const path = `tests/e2e/screenshots/verify-logo-${scrollY}px.png`;
        await page.screenshot({ path, clip: { x: 0, y: 0, width: 1920, height: 120 } });
        screenshots.push(path);
      }
    }
  });

  test('4. Storytelling heading is h2, not h1', async ({ page }) => {
    // Scroll to storytelling section
    await page.evaluate(() => {
      const el = document.getElementById('storytelling');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(500);

    // Check that "ecosystem" heading is h2
    const ecosystemH2 = page.locator('h2:has-text("ecosystem")');
    const count = await ecosystemH2.count();
    console.log('h2 with "ecosystem":', count);
    expect(count).toBeGreaterThanOrEqual(1);

    // Verify no h1 contains "ecosystem"
    const ecosystemH1 = page.locator('h1:has-text("ecosystem")');
    const h1Count = await ecosystemH1.count();
    console.log('h1 with "ecosystem":', h1Count);
    expect(h1Count).toBe(0);

    await page.screenshot({ path: 'tests/e2e/screenshots/verify-storytelling-heading.png' });
  });

  test('5. Font loading — swap strategy', async ({ page }) => {
    // Check that the page renders text quickly (font-display: swap)
    // Look for the Raleway font-face rules
    const fontDisplay = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSFontFaceRule) {
              const family = rule.style.getPropertyValue('font-family');
              if (family.includes('Raleway') || family.includes('__Raleway')) {
                return rule.style.getPropertyValue('font-display');
              }
            }
          }
        } catch { /* cross-origin sheets */ }
      }
      return 'not found';
    });
    console.log('Raleway font-display:', fontDisplay);
    expect(fontDisplay).toBe('swap');
  });
});
