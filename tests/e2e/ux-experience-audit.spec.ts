/**
 * UX Experience Audit
 *
 * Captures the site "as experienced" — sequential scroll positions,
 * transition sequences, layout measurements, and performance metrics.
 * Designed for AI agent analysis via Claude's vision capabilities.
 *
 * Usage:
 *   npx playwright test ux-experience-audit --project="Desktop Chrome"
 *   npx playwright test ux-experience-audit --project="Mobile Safari"
 *
 * Output: tests/e2e/screenshots/ux-audit/
 *   - Sequential scroll journey screenshots
 *   - Logo handoff sequence captures
 *   - Storytelling transition captures (desktop only)
 *   - Interactive state captures
 *   - manifest.json (measurements + performance + metadata)
 */
import { test, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = path.join(__dirname, 'screenshots', 'ux-audit');

// Section selectors (matches screenshot-audit.spec.ts)
const SECTIONS = [
  { name: 'hero', selector: 'section[aria-label*="Hero"]' },
  { name: 'need', selector: 'section[aria-label*="need we noticed"]' },
  { name: 'storytelling', selector: '#storytelling' },
  { name: 'deeper', selector: 'section[aria-label*="deeper context"]' },
  { name: 'values', selector: 'section[aria-label*="values"]' },
  { name: 'testimonials', selector: 'section[aria-label*="testimonials"]' },
  { name: 'contact', selector: 'section[aria-label*="Contact"]' },
  { name: 'footer', selector: 'footer[class*="pt-16"]' },
];

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function getViewportLabel(width: number): string {
  if (width >= 1280) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

/** Scroll using JS (bypasses Lenis) and wait for CSS + Framer Motion settle */
async function scrollAndSettle(page: Page, y: number, settleMs = 500) {
  await page.evaluate((scrollY) => {
    window.scrollTo({ top: scrollY, behavior: 'instant' });
  }, y);
  await page.evaluate(() =>
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  );
  await page.waitForTimeout(settleMs);
}

/** Read existing manifest or return empty object */
function readManifest(): Record<string, unknown> {
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  }
  return {};
}

/** Write data to manifest (merges with existing) */
function writeManifest(data: Record<string, unknown>) {
  const existing = readManifest();
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify({ ...existing, ...data }, null, 2)
  );
}

test.describe('UX Experience Audit', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(180_000);

  test('scroll journey + measurements', async ({ page }) => {
    ensureDir(OUTPUT_DIR);
    const viewport = page.viewportSize()!;
    const label = getViewportLabel(viewport.width);

    // Set up performance observers BEFORE navigation
    await page.addInitScript(() => {
      const w = window as Window & { __uxMetrics?: { lcp: number; cls: number; longTasks: number } };
      w.__uxMetrics = { lcp: 0, cls: 0, longTasks: 0 };

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last && w.__uxMetrics) w.__uxMetrics.lcp = last.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as PerformanceEntry & { hadRecentInput: boolean }).hadRecentInput && w.__uxMetrics) {
            w.__uxMetrics.cls += (entry as PerformanceEntry & { value: number }).value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

      new PerformanceObserver((list) => {
        if (w.__uxMetrics) w.__uxMetrics.longTasks += list.getEntries().length;
      }).observe({ type: 'longtask', buffered: true });
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4500); // Wait for loader + initial animations

    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const vh = viewport.height;
    const maxScroll = pageHeight - vh;

    // === SCROLL JOURNEY (21 captures: index 0-20) ===
    const stepCount = 20;
    const stepSize = Math.floor(maxScroll / stepCount);
    const scrollCaptures: Array<{
      index: number;
      scrollY: number;
      filename: string;
      visibleSections: string[];
    }> = [];

    for (let i = 0; i <= stepCount; i++) {
      const scrollY = Math.min(i * stepSize, maxScroll);
      await scrollAndSettle(page, scrollY, 300);

      const visibleSections = await page.evaluate((sections) => {
        const visible: string[] = [];
        for (const s of sections) {
          const el = document.querySelector(s.selector);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              visible.push(s.name);
            }
          }
        }
        return visible;
      }, SECTIONS);

      const filename = `${label}--journey-${String(i).padStart(2, '0')}.png`;
      await page.screenshot({ path: path.join(OUTPUT_DIR, filename) });
      scrollCaptures.push({ index: i, scrollY, filename, visibleSections });
    }

    // === SECTION MEASUREMENTS ===
    await scrollAndSettle(page, 0, 200);
    const sectionData = await page.evaluate((sections) => {
      return sections.map(s => {
        const el = document.querySelector(s.selector);
        if (!el) return { name: s.name, found: false, top: 0, height: 0, paddingTop: '', paddingBottom: '' };
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        return {
          name: s.name,
          found: true,
          top: Math.round(rect.top + window.scrollY),
          height: Math.round(rect.height),
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
        };
      });
    }, SECTIONS);

    // Calculate gaps between consecutive sections
    const sectionMeasurements = sectionData.map((s, i) => {
      const next = sectionData[i + 1];
      const gapToNext = next?.found ? Math.round(next.top - (s.top + s.height)) : null;
      return { ...s, gapToNext };
    });

    // === HEADING HIERARCHY ===
    const headings = await page.evaluate(() => {
      const els = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(els).map(el => {
        const style = window.getComputedStyle(el);
        const section = el.closest('section, footer');
        const sectionLabel = section?.getAttribute('aria-label') || section?.id || 'unknown';
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent?.trim() || '').substring(0, 80),
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          color: style.color,
          section: sectionLabel,
        };
      });
    });

    // === PERFORMANCE METRICS ===
    const performance = await page.evaluate(() => {
      const paintEntries = window.performance.getEntriesByType('paint');
      const fcp = paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime ?? null;
      const w = window as Window & { __uxMetrics?: { lcp: number; cls: number; longTasks: number } };
      const metrics = w.__uxMetrics || { lcp: 0, cls: 0, longTasks: 0 };
      const nav = window.performance.timing;
      return {
        fcp: fcp ? Math.round(fcp) : null,
        lcp: metrics.lcp ? Math.round(metrics.lcp) : null,
        cls: Math.round(metrics.cls * 1000) / 1000,
        longTasks: metrics.longTasks,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.navigationStart,
        loadComplete: nav.loadEventEnd - nav.navigationStart,
      };
    });

    // === WRITE MANIFEST ===
    writeManifest({
      meta: {
        timestamp: new Date().toISOString(),
        viewport,
        viewportLabel: label,
        pageHeight,
        maxScroll,
      },
      scrollJourney: scrollCaptures,
      sectionMeasurements,
      headings,
      performance,
    });

    console.log(`  Scroll journey: ${scrollCaptures.length} captures`);
    console.log(`  Sections measured: ${sectionMeasurements.filter(s => s.found).length}`);
    console.log(`  Headings found: ${headings.length}`);
  });

  test('logo handoff sequence', async ({ page }) => {
    ensureDir(OUTPUT_DIR);
    const viewport = page.viewportSize()!;
    const label = getViewportLabel(viewport.width);

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4500);

    // Capture at 8 scroll positions spanning the handoff zone (0-400px)
    const positions = [0, 50, 100, 150, 200, 250, 300, 400];
    const captures: Array<{
      scrollY: number;
      filename: string;
      heroLogoOpacity: string | null;
      headerLogoOpacity: string | null;
    }> = [];

    for (const scrollY of positions) {
      await scrollAndSettle(page, scrollY, 400);

      // Measure logo opacity states
      const logoState = await page.evaluate(() => {
        // Hero logo — find the motion.div wrapping the logo in the hero section
        const heroSection = document.querySelector('section[aria-label*="Hero"]');
        const heroImg = heroSection?.querySelector('img');
        let heroOpacity: string | null = null;
        if (heroImg) {
          // Walk up to find the animated container with opacity
          let el: HTMLElement | null = heroImg as HTMLElement;
          while (el && el !== document.body) {
            const op = window.getComputedStyle(el).opacity;
            if (op !== '1') {
              heroOpacity = op;
              break;
            }
            el = el.parentElement;
          }
          if (heroOpacity === null) heroOpacity = '1';
        }

        // Header logo
        const header = document.querySelector('header');
        const headerImg = header?.querySelector('img');
        let headerOpacity: string | null = null;
        if (headerImg) {
          let el: HTMLElement | null = headerImg as HTMLElement;
          while (el && el !== document.body) {
            const op = window.getComputedStyle(el).opacity;
            if (op !== '1') {
              headerOpacity = op;
              break;
            }
            el = el.parentElement;
          }
          if (headerOpacity === null) headerOpacity = '1';
        }

        return { heroOpacity, headerOpacity };
      });

      // Capture the header zone (top 300px) — enough to see both logos
      const clipHeight = Math.min(300, viewport.height);
      const filename = `${label}--handoff-${String(scrollY).padStart(3, '0')}px.png`;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        clip: { x: 0, y: 0, width: viewport.width, height: clipHeight },
      });

      captures.push({
        scrollY,
        filename,
        heroLogoOpacity: logoState.heroOpacity,
        headerLogoOpacity: logoState.headerOpacity,
      });

      console.log(`  Handoff ${scrollY}px: hero=${logoState.heroOpacity} header=${logoState.headerOpacity}`);
    }

    writeManifest({ logoHandoff: captures });
  });

  test('storytelling transitions (desktop only)', async ({ page }) => {
    const viewport = page.viewportSize()!;
    if (viewport.width < 1280) {
      test.skip();
      return;
    }

    ensureDir(OUTPUT_DIR);
    const label = getViewportLabel(viewport.width);

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4500);

    const containerInfo = await page.evaluate(() => {
      const el = document.querySelector('#storytelling');
      if (!el) return null;
      return {
        top: Math.round(el.getBoundingClientRect().top + window.scrollY),
        height: Math.round(el.getBoundingClientRect().height),
      };
    });

    if (!containerInfo) {
      console.log('  SKIP: #storytelling not found');
      return;
    }

    const scrollableRange = containerInfo.height - viewport.height;

    // 10 captures at fine intervals — includes mid-transition states
    // Panels switch at: 0.0, 0.2, 0.4, 0.6, 0.8 (math: Math.min(4, Math.floor(progress * 5)))
    // So 0.15, 0.35, etc. are MID-TRANSITION — the most revealing captures
    const progressSteps = [
      { progress: 0.05, label: 'panel-0-early' },
      { progress: 0.15, label: 'panel-0-late' },
      { progress: 0.22, label: 'panel-1-early' },
      { progress: 0.35, label: 'panel-1-to-2' },
      { progress: 0.45, label: 'panel-2-mid' },
      { progress: 0.55, label: 'panel-2-to-3' },
      { progress: 0.65, label: 'panel-3-mid' },
      { progress: 0.75, label: 'panel-3-to-4' },
      { progress: 0.85, label: 'panel-4-mid' },
      { progress: 0.95, label: 'panel-4-late' },
    ];

    const panelNames = ['overview', 'teams', 'research', 'labs', 'summary'];
    const captures: Array<{
      progress: number;
      scrollY: number;
      filename: string;
      activePanel: number;
      expectedPanel: string;
      progressLabel: string;
    }> = [];

    for (const step of progressSteps) {
      const scrollY = containerInfo.top + (scrollableRange * step.progress);
      await scrollAndSettle(page, scrollY, 900);

      // Detect active panel
      const activePanel = await page.evaluate(() => {
        const active = document.querySelector('[data-storytelling-active-panel="true"]');
        if (!active) return -1;
        const all = document.querySelectorAll('[data-storytelling-active-panel]');
        return Array.from(all).indexOf(active);
      });

      const expectedIndex = Math.min(4, Math.floor(step.progress * 5));
      const filename = `${label}--story-${String(Math.round(step.progress * 100)).padStart(2, '0')}pct.png`;
      await page.screenshot({ path: path.join(OUTPUT_DIR, filename) });

      captures.push({
        progress: step.progress,
        scrollY: Math.round(scrollY),
        filename,
        activePanel,
        expectedPanel: panelNames[expectedIndex],
        progressLabel: step.label,
      });

      console.log(`  Story ${step.label}: panel=${activePanel}, expected=${panelNames[expectedIndex]}`);
    }

    writeManifest({
      storytellingTransitions: captures,
      storytellingContainer: containerInfo,
    });
  });

  test('interactive states', async ({ page }) => {
    ensureDir(OUTPUT_DIR);
    const viewport = page.viewportSize()!;
    const label = getViewportLabel(viewport.width);
    const isDesktop = viewport.width >= 1280;

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4500);

    const interactiveCaptures: string[] = [];

    // === CTA BUTTON HOVER (desktop only) ===
    if (isDesktop) {
      // Scroll to hero area where CTA button is visible
      await scrollAndSettle(page, 0, 300);
      const ctaButton = page.locator('section[aria-label*="Hero"] a, section[aria-label*="Hero"] button').first();
      if (await ctaButton.isVisible().catch(() => false)) {
        await ctaButton.screenshot({ path: path.join(OUTPUT_DIR, `${label}--cta-default.png`) });
        await ctaButton.hover();
        await page.waitForTimeout(300);
        await ctaButton.screenshot({ path: path.join(OUTPUT_DIR, `${label}--cta-hover.png`) });
        interactiveCaptures.push('cta-default', 'cta-hover');
        console.log('  CAPTURED: CTA hover states');
      }
    }

    // === MOBILE MENU ===
    if (!isDesktop) {
      await scrollAndSettle(page, 0, 300);
      const menuBtn = page.locator('button[aria-label="Open menu"]');
      if (await menuBtn.isVisible().catch(() => false)) {
        await menuBtn.click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(OUTPUT_DIR, `${label}--menu-open.png`) });
        interactiveCaptures.push('menu-open');
        console.log('  CAPTURED: mobile menu open');

        const closeBtn = page.locator('button[aria-label="Close menu"]');
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click();
          await page.waitForTimeout(400);
        }
      }
    }

    // === FORM FOCUS STATE ===
    const contactTop = await page.evaluate(() => {
      const el = document.querySelector('section[aria-label*="Contact"]');
      return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
    });

    if (contactTop !== null) {
      await scrollAndSettle(page, contactTop, 800);
      const firstInput = page.locator(
        'section[aria-label*="Contact"] input, section[aria-label*="Contact"] textarea'
      ).first();
      if (await firstInput.isVisible().catch(() => false)) {
        await firstInput.focus();
        await page.waitForTimeout(200);
        await page.screenshot({ path: path.join(OUTPUT_DIR, `${label}--form-focus.png`) });
        interactiveCaptures.push('form-focus');
        console.log('  CAPTURED: form focus state');
      }
    }

    // === FOOTER BOTTOM-OF-PAGE ===
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    await scrollAndSettle(page, docHeight, 600);
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${label}--bottom-of-page.png`) });
    interactiveCaptures.push('bottom-of-page');
    console.log('  CAPTURED: bottom of page');

    writeManifest({ interactiveCaptures });
  });
});
