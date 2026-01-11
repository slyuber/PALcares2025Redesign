/**
 * Mobile Navigation Diagnostic Tests
 * Purpose: Reproduce and diagnose mobile button tap failures
 *
 * Run with: npx playwright test mobile-nav-diagnostic --project="Android Low-End" --headed
 */
import { test, expect } from '@playwright/test';

// Force mobile viewport for all tests
test.use({ viewport: { width: 360, height: 640 } });

test.describe('Mobile Nav Button Diagnostics', () => {

  test.beforeEach(async ({ page }) => {
    // Add diagnostic event listeners before navigation
    await page.addInitScript(() => {
      // Track all click/tap events
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        console.log('[TAP]', {
          tag: target.tagName,
          id: target.id,
          class: target.className,
          text: target.textContent?.slice(0, 30),
          prevented: e.defaultPrevented,
          x: e.clientX,
          y: e.clientY,
        });
      }, { capture: true });

      // Track pointer events
      document.addEventListener('pointerdown', (e) => {
        const target = e.target as HTMLElement;
        console.log('[POINTER]', {
          tag: target.tagName,
          pointerType: e.pointerType,
          isPrimary: e.isPrimary,
        });
      }, { capture: true });
    });

    await page.goto('/?skiploader=true');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Let Lenis initialize
  });

  test('diagnose hamburger menu tap', async ({ page }) => {
    // Find hamburger button
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await expect(menuButton).toBeVisible({ timeout: 5000 });

    // Get bounding box
    const box = await menuButton.boundingBox();
    console.log('Hamburger button box:', box);

    // Check what's at that position (hit test)
    if (box) {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      const elementAtPoint = await page.evaluate(({ x, y }) => {
        const el = document.elementFromPoint(x, y) as HTMLElement;
        return {
          tag: el?.tagName,
          id: el?.id,
          class: el?.className,
          pointerEvents: getComputedStyle(el).pointerEvents,
          zIndex: getComputedStyle(el).zIndex,
        };
      }, { x: centerX, y: centerY });

      console.log('Element at hamburger center:', elementAtPoint);
    }

    // Attempt click and measure
    const startTime = Date.now();
    await menuButton.click();
    const elapsed = Date.now() - startTime;

    console.log(`Click took ${elapsed}ms`);

    // Check if menu opened
    const menuVisible = await page.locator('[data-mobile-menu]').isVisible();
    console.log('Menu visible after click:', menuVisible);

    expect(menuVisible).toBe(true);
  });

  test('diagnose mobile menu nav button taps', async ({ page }) => {
    // Open menu first
    await page.locator('button[aria-label="Open menu"]').click();
    await page.waitForTimeout(500);
    await expect(page.locator('[data-mobile-menu]')).toBeVisible();

    // Get all nav buttons in mobile menu
    const navButtons = page.locator('[data-mobile-menu] button');
    const count = await navButtons.count();
    console.log(`Found ${count} nav buttons in mobile menu`);

    // Check each button's hit testing
    for (let i = 0; i < count; i++) {
      const btn = navButtons.nth(i);
      const box = await btn.boundingBox();
      const text = await btn.textContent();

      if (box) {
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        const hitTest = await page.evaluate(({ x, y }) => {
          const el = document.elementFromPoint(x, y) as HTMLElement;
          if (!el) return { tag: 'null', blocked: true };

          // Walk up to find if we're in the button
          let current: HTMLElement | null = el;
          let isInButton = false;
          while (current) {
            if (current.tagName === 'BUTTON') {
              isInButton = true;
              break;
            }
            current = current.parentElement;
          }

          return {
            tag: el.tagName,
            class: el.className?.slice(0, 50),
            pointerEvents: getComputedStyle(el).pointerEvents,
            isInButton,
          };
        }, { x: centerX, y: centerY });

        console.log(`Button ${i} "${text?.slice(0, 20)}":`, {
          box: `${box.width}x${box.height}`,
          hitTest,
        });
      }
    }
  });

  test('diagnose Hero scroll button tap', async ({ page }) => {
    const scrollButton = page.locator('button[aria-label="Scroll to learn more"]');

    // Wait for it to be visible
    await expect(scrollButton).toBeVisible({ timeout: 5000 });

    const box = await scrollButton.boundingBox();
    console.log('Scroll button box:', box);

    // Check if storytelling targets exist (mobile vs desktop)
    const targetInfo = await page.evaluate(() => {
      const desktop = document.getElementById('storytelling');
      const mobile = document.getElementById('storytelling-mobile');
      return {
        desktop: desktop ? { height: desktop.offsetHeight, top: desktop.getBoundingClientRect().top } : null,
        mobile: mobile ? { height: mobile.offsetHeight, top: mobile.getBoundingClientRect().top } : null,
        documentHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
      };
    });
    console.log('Storytelling targets:', targetInfo);

    if (box) {
      // Check what's at center
      const hitTest = await page.evaluate(({ x, y }) => {
        const el = document.elementFromPoint(x, y) as HTMLElement;
        const styles = el ? getComputedStyle(el) : null;
        return {
          tag: el?.tagName,
          id: el?.id,
          class: el?.className?.slice(0, 80),
          pointerEvents: styles?.pointerEvents,
          zIndex: styles?.zIndex,
          position: styles?.position,
        };
      }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });

      console.log('Element at scroll button center:', hitTest);
    }

    // Record scroll position
    const beforeScroll = await page.evaluate(() => window.scrollY);

    // Use force click since button has continuous bounce animation
    await scrollButton.click({ force: true });
    await page.waitForTimeout(2000);

    const afterScroll = await page.evaluate(() => window.scrollY);
    console.log(`Scroll: ${beforeScroll} → ${afterScroll}`);

    // If still 0, try direct scrollIntoView as sanity check
    if (afterScroll === 0) {
      console.log('Click did not scroll - testing scrollIntoView directly');
      const directScroll = await page.evaluate(() => {
        const target = document.getElementById('storytelling');
        if (target) {
          target.scrollIntoView({ behavior: 'auto' });
          return window.scrollY;
        }
        return -1;
      });
      console.log(`Direct scrollIntoView result: ${directScroll}`);
    }

    expect(afterScroll).toBeGreaterThan(beforeScroll);
  });

  test('check for blocking overlays in DOM', async ({ page }) => {
    // Find all fixed/absolute positioned elements that might block
    const overlays = await page.evaluate(() => {
      const results: Array<{
        tag: string;
        class: string;
        position: string;
        zIndex: string;
        pointerEvents: string;
        dimensions: string;
      }> = [];

      document.querySelectorAll('*').forEach((el) => {
        const styles = getComputedStyle(el);
        const pos = styles.position;

        if (pos === 'fixed' || pos === 'absolute') {
          const rect = el.getBoundingClientRect();
          // Only care about large elements that could block
          if (rect.width > 100 && rect.height > 100) {
            results.push({
              tag: el.tagName,
              class: el.className?.toString().slice(0, 50) || '',
              position: pos,
              zIndex: styles.zIndex,
              pointerEvents: styles.pointerEvents,
              dimensions: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
            });
          }
        }
      });

      return results;
    });

    console.log('Fixed/Absolute overlays:', overlays);

    // Check for any with pointer-events: auto that might block
    const blockers = overlays.filter(o =>
      o.pointerEvents === 'auto' &&
      parseInt(o.zIndex) > 10
    );

    if (blockers.length > 0) {
      console.warn('Potential blocking overlays:', blockers);
    }
  });

  test('check Lenis scroll container state', async ({ page }) => {
    const lenisState = await page.evaluate(() => {
      // @ts-expect-error - Lenis may be on window
      const lenis = (window as { lenis?: unknown }).lenis;
      if (!lenis) return { exists: false };

      return {
        exists: true,
        isScrolling: lenis.isScrolling,
        isStopped: lenis.isStopped,
        velocity: lenis.velocity,
        scroll: lenis.scroll,
        targetScroll: lenis.targetScroll,
        wrapperElement: lenis.wrapper?.tagName,
        contentElement: lenis.content?.tagName,
      };
    });

    console.log('Lenis state:', lenisState);

    // Check if scroll container has proper touch-action
    const touchAction = await page.evaluate(() => {
      const wrapper = document.querySelector('[data-lenis-wrapper]') || document.documentElement;
      return getComputedStyle(wrapper).touchAction;
    });

    console.log('Scroll container touch-action:', touchAction);
  });
});
