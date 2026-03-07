/**
 * Visual Screenshot Audit
 * Captures every section of the PALcares site for visual review.
 *
 * Handles: loader skip, Lenis init, scroll-lock storytelling (500vh),
 *          and section-by-section capture at multiple viewports.
 *
 * Usage:
 *   # Full audit (all sections, all viewports):
 *   npx playwright test screenshot-audit --project="Desktop Chrome"
 *   npx playwright test screenshot-audit --project="Mobile Safari"
 *
 *   # Single section (faster for verify-after-fix):
 *   SECTION=hero npx playwright test screenshot-audit -g "capture all sections" --project="Desktop Chrome"
 *   SECTION=contact npx playwright test screenshot-audit -g "capture all sections" --project="Desktop Chrome"
 *   SECTION=storytelling npx playwright test screenshot-audit -g "capture storytelling" --project="Desktop Chrome"
 *
 * Screenshots land in: tests/e2e/screenshots/
 */
import { test, expect, Page } from '@playwright/test';
import path from 'path';

// Generous timeout — we're taking lots of screenshots with animation waits
test.setTimeout(120_000);

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

// Optional env var to capture only one section (faster for verify-after-fix)
const TARGET_SECTION = process.env.SECTION?.toLowerCase();

// Sections in DOM order (matches CLAUDE.md section flow)
const SECTIONS = [
  { name: '01-hero',                 key: 'hero',          selector: 'section[aria-label*="Hero"]' },
  { name: '02-need-we-noticed',      key: 'need',          selector: 'section[aria-label*="need we noticed"]' },
  { name: '03-storytelling-desktop',  key: 'storytelling',  selector: '#storytelling',              desktopOnly: true },
  { name: '03-storytelling-mobile',   key: 'storytelling',  selector: '#storytelling-mobile',       mobileOnly: true },
  { name: '04-deeper-context',       key: 'deeper',        selector: 'section[aria-label*="deeper context"]' },
  { name: '05-values',               key: 'values',        selector: 'section[aria-label*="values"]' },
  { name: '06-testimonials',         key: 'testimonials',  selector: 'section[aria-label*="testimonials"]' },
  { name: '07-contact',              key: 'contact',       selector: 'section[aria-label*="Contact"]' },
  { name: '08-footer',               key: 'footer',        selector: 'footer[class*="pt-16"]' },
];

// Storytelling panels: activeIndex = Math.min(4, Math.floor(scrollYProgress * 5))
// offset: ["start start", "end end"] → range = containerHeight - viewportHeight
const STORYTELLING_PANELS = [
  { name: 'overview',  progress: 0.10 },
  { name: 'teams',     progress: 0.30 },
  { name: 'research',  progress: 0.50 },
  { name: 'labs',      progress: 0.70 },
  { name: 'summary',   progress: 0.90 },
];

function shouldCapture(key: string): boolean {
  if (!TARGET_SECTION) return true;
  return key.includes(TARGET_SECTION);
}

/** Wait for site to be ready for screenshots */
async function waitForSiteReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('section', { timeout: 15000 });
  await page.waitForTimeout(2000);
}

function getViewportLabel(width: number): string {
  if (width >= 1280) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

/** Scroll using JS (bypasses Lenis) and wait for CSS transitions + Framer Motion */
async function scrollAndSettle(page: Page, y: number, settleMs = 800) {
  // Scroll in one step
  await page.evaluate((scrollY) => {
    window.scrollTo({ top: scrollY, behavior: 'instant' });
  }, y);
  // Force a rAF to flush Framer Motion MotionValue updates
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  // Wait for CSS transitions (duration-400 = 400ms) + buffer
  await page.waitForTimeout(settleMs);
}

/** Get document-relative top of an element */
async function getDocumentTop(page: Page, selector: string): Promise<number | null> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return el.getBoundingClientRect().top + window.scrollY;
  }, selector);
}

test.describe('Screenshot Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForSiteReady(page);
  });

  test('capture all sections', async ({ page }) => {
    const viewport = page.viewportSize();
    const label = getViewportLabel(viewport?.width ?? 1920);
    const isDesktop = (viewport?.width ?? 1920) >= 1280;

    // Above the fold
    if (!TARGET_SECTION) {
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${label}--00-above-fold.png`),
      });
      const header = page.locator('header').first();
      if (await header.isVisible()) {
        await header.screenshot({
          path: path.join(SCREENSHOT_DIR, `${label}--00-header.png`),
        });
      }
    }

    // Each section
    for (const section of SECTIONS) {
      if (section.desktopOnly && !isDesktop) continue;
      if (section.mobileOnly && isDesktop) continue;
      if (!shouldCapture(section.key)) continue;

      // Skip the storytelling element screenshot (it's 500vh, use panel captures instead)
      if (section.key === 'storytelling' && isDesktop) {
        console.log(`  NOTE: ${section.name} — use "capture storytelling" test for panel-by-panel shots`);
        continue;
      }

      const top = await getDocumentTop(page, section.selector);
      if (top === null) {
        console.log(`  SKIP: ${section.name} — not in DOM`);
        continue;
      }

      await scrollAndSettle(page, top);

      const el = page.locator(section.selector).first();
      const isVisible = await el.isVisible().catch(() => false);
      if (!isVisible) {
        console.log(`  SKIP: ${section.name} — not visible at ${label}`);
        continue;
      }

      // Footer needs special handling — there are TWO <footer> elements in the DOM
      // (one inside storytelling-mobile, one is the page footer with pt-16)
      if (section.key === 'footer') {
        const footerTop = await getDocumentTop(page, section.selector);
        if (footerTop !== null && footerTop > 0) {
          await scrollAndSettle(page, footerTop, 1000);
          const footer = page.locator(section.selector).first();
          if (await footer.isVisible().catch(() => false)) {
            await footer.screenshot({
              path: path.join(SCREENSHOT_DIR, `${label}--${section.name}.png`),
            });
            console.log(`  CAPTURED: ${section.name}`);
          } else {
            console.log(`  SKIP: ${section.name} — not visible after scrolling to it`);
          }
        } else {
          console.log(`  SKIP: ${section.name} — not found (top=${footerTop})`);
        }
        continue;
      } else {
        await el.screenshot({
          path: path.join(SCREENSHOT_DIR, `${label}--${section.name}.png`),
        });
      }

      console.log(`  CAPTURED: ${section.name}`);
    }
  });

  test('capture storytelling scroll-lock panels (desktop only)', async ({ page }) => {
    const viewport = page.viewportSize();
    const isDesktop = (viewport?.width ?? 1920) >= 1280;

    if (!isDesktop || !shouldCapture('storytelling')) {
      test.skip();
      return;
    }

    const label = getViewportLabel(viewport?.width ?? 1920);
    const storytelling = page.locator('#storytelling');
    await expect(storytelling).toBeVisible({ timeout: 5000 });

    // Get container's document-relative position
    const containerInfo = await page.evaluate(() => {
      const el = document.querySelector('#storytelling');
      if (!el) return null;
      return {
        top: el.getBoundingClientRect().top + window.scrollY,
        height: el.getBoundingClientRect().height,
      };
    });

    if (!containerInfo) return;

    const viewportHeight = viewport?.height ?? 1080;
    const scrollableRange = containerInfo.height - viewportHeight;

    for (let i = 0; i < 5; i++) {
      const panel = STORYTELLING_PANELS[i];
      const scrollTarget = containerInfo.top + (scrollableRange * panel.progress);

      // Use longer settle for storytelling — clip-path wipes + content crossfades
      await scrollAndSettle(page, scrollTarget, 1200);

      // Confirm which panel is active via data attribute
      const activePanel = await page.evaluate(() => {
        const panels = document.querySelectorAll('[data-storytelling-active-panel="true"]');
        return panels.length;
      });

      // Also check the aria-live status
      const status = await page.evaluate(() => {
        const el = document.querySelector('[data-storytelling-sticky] [aria-live]');
        return el?.textContent ?? 'no status found';
      });

      console.log(`  Panel ${i} (${panel.name}): ${activePanel} active, status="${status}"`);

      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${label}--03-storytelling-panel-${i}-${panel.name}.png`),
      });

      console.log(`  CAPTURED: storytelling panel ${i} (${panel.name})`);
    }
  });

  test('capture loader sequence', async ({ context }) => {
    if (TARGET_SECTION && TARGET_SECTION !== 'loader') {
      test.skip();
      return;
    }

    const loaderPage = await context.newPage();

    await loaderPage.addInitScript(() => {
      sessionStorage.removeItem('loaderSeen');
      Object.defineProperty(navigator, 'userAgent', {
        get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      });
    });

    const viewport = loaderPage.viewportSize();
    const label = getViewportLabel(viewport?.width ?? 1920);

    await loaderPage.goto('/', { waitUntil: 'commit' });

    // Loader timing (accelerating heartbeat):
    // words: 0/800/1500/2100ms, merge: 2900ms, exit: 3600ms, gone: ~4800ms
    const frames = [
      { delay: 200,  name: 'loader-1-first-word' },
      { delay: 800,  name: 'loader-2-cycling' },
      { delay: 900,  name: 'loader-3-final-word' },
      { delay: 900,  name: 'loader-4-merged' },
      { delay: 1000, name: 'loader-5-exit' },
    ];

    for (const frame of frames) {
      await loaderPage.waitForTimeout(frame.delay);
      await loaderPage.screenshot({
        path: path.join(SCREENSHOT_DIR, `${label}--${frame.name}.png`),
      });
      console.log(`  CAPTURED: ${frame.name}`);
    }

    await loaderPage.close();
  });

  test('capture interactive states', async ({ page }) => {
    if (TARGET_SECTION && !['header', 'menu', 'contact', 'footer'].includes(TARGET_SECTION)) {
      test.skip();
      return;
    }

    const viewport = page.viewportSize();
    const label = getViewportLabel(viewport?.width ?? 1920);
    const isDesktop = (viewport?.width ?? 1920) >= 1280;

    // Header after scroll (logo handoff at ~150px)
    await scrollAndSettle(page, 300, 500);
    const header = page.locator('header').first();
    if (await header.isVisible()) {
      await header.screenshot({
        path: path.join(SCREENSHOT_DIR, `${label}--header-scrolled.png`),
      });
      console.log('  CAPTURED: header-scrolled');
    }

    // Mobile menu
    if (!isDesktop) {
      const menuBtn = page.locator('button[aria-label="Open menu"]');
      if (await menuBtn.isVisible()) {
        await menuBtn.click();
        await page.waitForTimeout(600);
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${label}--mobile-menu-open.png`),
        });
        console.log('  CAPTURED: mobile-menu-open');

        const closeBtn = page.locator('button[aria-label="Close menu"]');
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }

    // Contact form (scroll to it)
    const contactTop = await getDocumentTop(page, 'section[aria-label*="Contact"]');
    if (contactTop !== null) {
      await scrollAndSettle(page, contactTop, 1000);
      const contact = page.locator('section[aria-label*="Contact"]').first();
      if (await contact.isVisible().catch(() => false)) {
        await contact.screenshot({
          path: path.join(SCREENSHOT_DIR, `${label}--contact-form.png`),
        });
        console.log('  CAPTURED: contact-form');
      }
    }

    // Bottom of page (footer in context) — get real document height
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await scrollAndSettle(page, docHeight, 1000);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${label}--bottom-of-page.png`),
    });
    console.log('  CAPTURED: bottom-of-page');
  });
});
