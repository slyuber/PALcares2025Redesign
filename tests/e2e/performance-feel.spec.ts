/**
 * Performance & Feel Test
 *
 * Measures what users actually feel — scroll jank, animation smoothness,
 * paint overhead, layout shifts, and interaction responsiveness.
 * Outputs a scored report to the console and a JSON file.
 *
 * Usage:
 *   npx playwright test performance-feel --project="Desktop Chrome"
 *   npx playwright test performance-feel --project="Mobile Safari"
 *   npx playwright test performance-feel --project="Android Low-End"
 *
 * Output: tests/e2e/performance-feel-report.json
 */
import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const REPORT_PATH = path.join(__dirname, 'performance-feel-report.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Bypass Lenis — instant scroll + double-rAF settle */
async function scrollTo(page: Page, y: number, settleMs = 400) {
  await page.evaluate((scrollY) => {
    window.scrollTo({ top: scrollY, behavior: 'instant' });
  }, y);
  await page.evaluate(() =>
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  );
  await page.waitForTimeout(settleMs);
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

test.describe('Performance & Feel', () => {
  test.setTimeout(120_000);

  test('full scroll journey — frame budget & jank', async ({ page }) => {
    await page.goto('/?skiploader=true', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500); // let hydration + Lenis init settle

    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const totalScrollable = docHeight - viewportHeight;

    // --- 1. SCROLL SMOOTHNESS ---
    // Scroll the full page in steps, measuring frame times via rAF
    const scrollSteps = 40;
    const stepSize = Math.floor(totalScrollable / scrollSteps);

    const frameTimes: number[] = await page.evaluate(
      async ({ steps, step }) => {
        const times: number[] = [];
        let lastFrame = performance.now();

        for (let i = 1; i <= steps; i++) {
          window.scrollTo({ top: i * step, behavior: 'instant' });
          await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
              const now = performance.now();
              times.push(now - lastFrame);
              lastFrame = now;
              resolve();
            });
          });
        }
        return times;
      },
      { steps: scrollSteps, step: stepSize }
    );

    // Compute stats
    const sorted = [...frameTimes].sort((a, b) => a - b);
    const avg = frameTimes.reduce((s, t) => s + t, 0) / frameTimes.length;
    const p50 = sorted[Math.floor(sorted.length * 0.5)];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];
    const jankFrames = frameTimes.filter(t => t > 33.33).length; // >2x budget
    const severeJank = frameTimes.filter(t => t > 50).length; // >3x budget

    // --- 2. LAYOUT SHIFT (CLS) ---
    await scrollTo(page, 0);
    await page.waitForTimeout(500);

    const cls = await page.evaluate(async () => {
      let clsValue = 0;
      const obs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
            clsValue += (entry as PerformanceEntry & { value: number }).value;
          }
        }
      });
      obs.observe({ type: 'layout-shift', buffered: true });

      // Scroll full page slowly to trigger any shifts
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const steps = 20;
      for (let i = 0; i <= steps; i++) {
        window.scrollTo({ top: (total / steps) * i, behavior: 'instant' });
        await new Promise(r => requestAnimationFrame(r));
        await new Promise(r => setTimeout(r, 100));
      }

      obs.disconnect();
      return clsValue;
    });

    // --- 3. HERO LOGO HANDOFF ---
    await scrollTo(page, 0, 300);
    const handoffData = await page.evaluate(async () => {
      const results: Array<{ scrollY: number; heroOpacity: string; headerOpacity: string }> = [];
      const scrollPositions = [0, 50, 100, 150, 200, 250, 300, 350];

      for (const y of scrollPositions) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        // Extra frame for Framer Motion MotionValues to propagate
        await new Promise(r => requestAnimationFrame(r));

        // Desktop hero logo: inside #top section, the div that contains the large centered logo
        // It's the hidden lg:flex div — query by section + img alt text, then get parent div
        const heroImg = document.querySelector('#top img[alt="PALcares"][width="280"]') as HTMLElement | null;
        const heroLogo = heroImg?.closest('div') as HTMLElement | null;
        const headerLogo = document.querySelector('header img[alt="PALcares logo"]') as HTMLElement | null;

        results.push({
          scrollY: y,
          heroOpacity: heroLogo ? getComputedStyle(heroLogo).opacity : 'N/A',
          headerOpacity: headerLogo ? getComputedStyle(headerLogo.closest('div') || headerLogo).opacity : 'N/A',
        });
      }
      return results;
    });

    // Check that hero logo fades out and header logo fades in
    const heroStartOpacity = parseFloat(handoffData[0]?.heroOpacity || '0');
    const heroEndOpacity = parseFloat(handoffData[handoffData.length - 1]?.heroOpacity || '1');
    const logoHandoffWorks = heroStartOpacity > 0.5 && heroEndOpacity < 0.3;

    // --- 4. PAINT COMPLEXITY ---
    // Check for expensive CSS properties on animated elements
    const paintIssues = await page.evaluate(() => {
      const issues: string[] = [];
      const all = document.querySelectorAll('*');
      let blurCount = 0;
      let blendCount = 0;
      let backdropCount = 0;

      all.forEach((el) => {
        const s = getComputedStyle(el);
        if (s.filter && s.filter !== 'none' && s.filter.includes('blur')) blurCount++;
        if (s.mixBlendMode && s.mixBlendMode !== 'normal') blendCount++;
        if (s.backdropFilter && s.backdropFilter !== 'none') backdropCount++;
      });

      if (blurCount > 3) issues.push(`${blurCount} elements with blur filter (target: ≤3)`);
      if (blendCount > 0) issues.push(`${blendCount} elements with mix-blend-mode (target: 0)`);
      // backdrop-blur on small elements (like cards) is fine — only flag if > 5
      if (backdropCount > 5) issues.push(`${backdropCount} backdrop-filter elements (target: ≤5)`);

      return { blurCount, blendCount, backdropCount, issues };
    });

    // --- 5. INTERACTION RESPONSIVENESS ---
    // Hover the CTA button — measure time to visual response
    await scrollTo(page, 0, 300);

    let interactionLatency = -1;
    // Try multiple selectors for the primary CTA
    const ctaSelectors = ['a[href="#storytelling"]', '#top a[href*="storytelling"]', '.hero a'];
    let ctaSelector = '';
    for (const sel of ctaSelectors) {
      const el = await page.$(sel);
      if (el) { ctaSelector = sel; break; }
    }

    if (ctaSelector) {
      interactionLatency = await page.evaluate(async (sel) => {
        const el = document.querySelector(sel) as HTMLElement;
        if (!el) return -1;

        const start = performance.now();
        el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

        // Wait for next paint
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        return performance.now() - start;
      }, ctaSelector);
    }

    // --- 6. ANIMATION OFF-SCREEN CHECK ---
    // Scroll to bottom, check if any infinite animations are still running in top sections
    await scrollTo(page, totalScrollable, 500);
    const offscreenAnimations = await page.evaluate(() => {
      const animating: string[] = [];
      // Check elements far above viewport for running animations
      const els = document.querySelectorAll('[style*="animation"], .animate-sway-slow, .animate-sway-slow-reverse, .animate-sway-medium');
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        // If element is well above viewport and still animating
        if (rect.bottom < -500 && style.animationPlayState === 'running') {
          const cls = typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName;
          animating.push(`${el.tagName}.${cls} (${Math.round(rect.top)}px above viewport)`);
        }
      });
      return animating;
    });

    // --- 7. REDUCED MOTION COMPLIANCE ---
    // Enable reduced motion and check that animations are suppressed
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?skiploader=true', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const reducedMotionCheck = await page.evaluate(() => {
      const motionEls = document.querySelectorAll('[style*="animation"]');
      let runningCount = 0;
      motionEls.forEach((el) => {
        const s = getComputedStyle(el);
        if (s.animationDuration !== '0s' && s.animationPlayState === 'running') {
          runningCount++;
        }
      });

      // Check for Framer Motion elements that should be static
      const framerEls = document.querySelectorAll('[style*="transform"]');
      return {
        cssAnimationsRunning: runningCount,
        framerMotionElements: framerEls.length,
      };
    });

    // --- SCORING ---
    const scores: Record<string, { score: number; max: number; detail: string }> = {};

    // Scroll smoothness (30 pts)
    const jankPercent = (jankFrames / frameTimes.length) * 100;
    const scrollScore = jankPercent === 0 ? 30
      : jankPercent < 5 ? 25
      : jankPercent < 10 ? 20
      : jankPercent < 20 ? 15
      : jankPercent < 40 ? 10 : 5;
    scores['Scroll Smoothness'] = {
      score: scrollScore, max: 30,
      detail: `avg=${avg.toFixed(1)}ms p50=${p50.toFixed(1)}ms p95=${p95.toFixed(1)}ms p99=${p99.toFixed(1)}ms | jank(>33ms)=${jankFrames}/${frameTimes.length} severe(>50ms)=${severeJank}`,
    };

    // CLS (15 pts)
    const clsScore = cls < 0.01 ? 15 : cls < 0.05 ? 12 : cls < 0.1 ? 8 : cls < 0.25 ? 4 : 0;
    scores['Layout Stability (CLS)'] = {
      score: clsScore, max: 15,
      detail: `CLS=${cls.toFixed(4)} (good: <0.1, needs work: >0.25)`,
    };

    // Logo handoff (15 pts)
    const handoffScore = logoHandoffWorks ? 15 : 0;
    scores['Logo Handoff'] = {
      score: handoffScore, max: 15,
      detail: logoHandoffWorks
        ? `Hero: ${heroStartOpacity.toFixed(2)}→${heroEndOpacity.toFixed(2)} — smooth crossfade`
        : `Hero: ${heroStartOpacity.toFixed(2)}→${heroEndOpacity.toFixed(2)} — logo doesn't fade out!`,
    };

    // Paint complexity (15 pts)
    const paintScore = paintIssues.issues.length === 0 ? 15
      : paintIssues.issues.length === 1 ? 10
      : paintIssues.issues.length === 2 ? 5 : 0;
    scores['Paint Efficiency'] = {
      score: paintScore, max: 15,
      detail: paintIssues.issues.length === 0
        ? `blur=${paintIssues.blurCount} blend=${paintIssues.blendCount} backdrop=${paintIssues.backdropCount} — clean`
        : paintIssues.issues.join('; '),
    };

    // Interaction responsiveness (10 pts)
    const interactionScore = interactionLatency < 0 ? 5 // couldn't test
      : interactionLatency < 16 ? 10
      : interactionLatency < 33 ? 8
      : interactionLatency < 50 ? 6
      : interactionLatency < 100 ? 4 : 2;
    scores['Interaction Response'] = {
      score: interactionScore, max: 10,
      detail: interactionLatency < 0
        ? 'CTA not found for timing'
        : `hover response: ${interactionLatency.toFixed(1)}ms (target: <16ms)`,
    };

    // Off-screen animation waste (10 pts)
    const offscreenScore = offscreenAnimations.length === 0 ? 10
      : offscreenAnimations.length <= 2 ? 7
      : offscreenAnimations.length <= 5 ? 4 : 0;
    scores['Animation Efficiency'] = {
      score: offscreenScore, max: 10,
      detail: offscreenAnimations.length === 0
        ? 'No offscreen animations wasting cycles'
        : `${offscreenAnimations.length} animations running offscreen: ${offscreenAnimations.slice(0, 3).join(', ')}`,
    };

    // Reduced motion (5 pts)
    const rmScore = reducedMotionCheck.cssAnimationsRunning === 0 ? 5 : 0;
    scores['Reduced Motion'] = {
      score: rmScore, max: 5,
      detail: `CSS animations running with prefers-reduced-motion: ${reducedMotionCheck.cssAnimationsRunning}`,
    };

    // --- TOTAL ---
    const total = Object.values(scores).reduce((s, v) => s + v.score, 0);
    const maxTotal = Object.values(scores).reduce((s, v) => s + v.max, 0);

    // --- REPORT ---
    const viewportSize = page.viewportSize();
    const viewport = viewportSize ? `${viewportSize.width}x${viewportSize.height}` : 'unknown';

    const report = {
      timestamp: new Date().toISOString(),
      viewport,
      score: total,
      maxScore: maxTotal,
      percentage: Math.round((total / maxTotal) * 100),
      grade: total >= 90 ? 'A' : total >= 75 ? 'B' : total >= 60 ? 'C' : total >= 45 ? 'D' : 'F',
      categories: scores,
      raw: {
        frameTimes: { avg, p50, p95, p99, jankFrames, severeJank, total: frameTimes.length },
        cls,
        logoHandoff: handoffData,
        paintComplexity: paintIssues,
        interactionLatency,
        offscreenAnimations,
        reducedMotion: reducedMotionCheck,
      },
    };

    // Write report
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

    // Print scorecard to console
    console.log('\n' + '='.repeat(64));
    console.log('  PERFORMANCE & FEEL SCORECARD');
    console.log('='.repeat(64));
    console.log(`  Viewport: ${viewport}`);
    console.log(`  Score: ${total}/${maxTotal} (${report.percentage}%) — Grade: ${report.grade}`);
    console.log('-'.repeat(64));
    for (const [name, data] of Object.entries(scores)) {
      const bar = '█'.repeat(Math.round((data.score / data.max) * 20)).padEnd(20, '░');
      console.log(`  ${bar} ${data.score}/${data.max}  ${name}`);
      console.log(`  ${''.padEnd(20)} ${data.detail}`);
    }
    console.log('='.repeat(64));
    console.log(`  Report saved to: tests/e2e/performance-feel-report.json`);
    console.log('='.repeat(64) + '\n');

    // Soft assertion — don't fail the test, just report
    // Use a generous threshold so it's informational, not blocking
    expect(total).toBeGreaterThanOrEqual(30);
  });
});
