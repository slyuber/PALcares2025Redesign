import { test, expect } from '@playwright/test';

test.describe('Mobile Menu UX Improvements', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/?skiploader=true');
    await page.waitForTimeout(500);
  });

  test('Escape key closes mobile menu', async ({ page }) => {
    // Open menu
    const menuButton = page.locator('button[aria-label="Open menu"]');
    await menuButton.click();
    await expect(page.locator('[data-mobile-menu]')).toBeVisible({ timeout: 1000 });

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Menu should be closed
    await expect(page.locator('[data-mobile-menu]')).not.toBeVisible();
  });

  test('double-tap hamburger does not cause flicker (debounce)', async ({ page }) => {
    // The hamburger button on mobile (has aria-label="Open menu" and is visible on mobile)
    const hamburgerButton = page.locator('button[aria-label="Open menu"]');
    await expect(hamburgerButton).toBeVisible({ timeout: 2000 });

    // Get initial menu state
    const menuWasVisible = await page.locator('[data-mobile-menu]').isVisible().catch(() => false);
    expect(menuWasVisible).toBe(false);

    // Click twice rapidly (simulate double-tap within 300ms debounce window)
    await hamburgerButton.click();
    await page.waitForTimeout(50); // Very short delay between taps
    // After first click, the button's label changes to "Close menu"
    const closeButton = page.locator('button[aria-label="Close menu"]').first();
    await closeButton.click({ force: true }); // Second click should be debounced

    await page.waitForTimeout(400);

    // Menu should still be open (second click was ignored due to debounce)
    await expect(page.locator('[data-mobile-menu]')).toBeVisible();
  });

  test('tapping menu content area does not close menu', async ({ page }) => {
    // Open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[data-mobile-menu]')).toBeVisible({ timeout: 1000 });

    // Tap on the menu content area (not a nav item or close button)
    const menuPanel = page.locator('[data-mobile-menu]');
    const box = await menuPanel.boundingBox();
    if (box) {
      // Tap in empty area (bottom left corner, avoid nav items)
      await page.mouse.click(box.x + 20, box.y + box.height - 50);
    }

    await page.waitForTimeout(300);

    // Menu should still be open
    await expect(page.locator('[data-mobile-menu]')).toBeVisible();
  });

  test('close button receives focus when menu opens', async ({ page }) => {
    // Open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await page.waitForTimeout(200);

    // Close button inside mobile menu should be focused
    const closeButton = page.locator('[data-mobile-menu] button[aria-label="Close menu"]');
    await expect(closeButton).toBeFocused({ timeout: 500 });
  });

  test('hamburger button receives focus when menu closes', async ({ page }) => {
    // Open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[data-mobile-menu]')).toBeVisible({ timeout: 1000 });

    // Close menu via close button inside mobile menu
    await page.locator('[data-mobile-menu] button[aria-label="Close menu"]').click();
    await page.waitForTimeout(300);

    // Hamburger button should be focused (aria-label is now "Open menu" again)
    const hamburger = page.locator('button[aria-label="Open menu"]');
    await expect(hamburger).toBeFocused({ timeout: 500 });
  });

  test('nav item tap has visual feedback delay before closing', async ({ page }) => {
    // Open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[data-mobile-menu]')).toBeVisible({ timeout: 1000 });

    // Click nav item
    const navItem = page.locator('[data-mobile-menu] button:has-text("Our Approach")');
    await navItem.click();

    // Menu should still be visible briefly (120ms delay)
    await expect(page.locator('[data-mobile-menu]')).toBeVisible({ timeout: 50 });

    // After delay, menu should close
    await page.waitForTimeout(300);
    await expect(page.locator('[data-mobile-menu]')).not.toBeVisible({ timeout: 500 });
  });

  test('close button works correctly', async ({ page }) => {
    // Open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[data-mobile-menu]')).toBeVisible({ timeout: 1000 });

    // Click close button inside mobile menu
    await page.locator('[data-mobile-menu] button[aria-label="Close menu"]').click();
    await page.waitForTimeout(300);

    // Menu should be closed
    await expect(page.locator('[data-mobile-menu]')).not.toBeVisible();
  });

  test('submenu expands without closing menu', async ({ page }) => {
    // Open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[data-mobile-menu]')).toBeVisible({ timeout: 1000 });

    // Click "How We Work" (has submenu)
    const howWeWork = page.locator('[data-mobile-menu] button:has-text("How We Work")');
    await howWeWork.click();
    await page.waitForTimeout(300);

    // Menu should still be open (not closed by submenu toggle)
    await expect(page.locator('[data-mobile-menu]')).toBeVisible();

    // Submenu items should be visible
    await expect(page.locator('[data-mobile-menu] button:has-text("Teams")')).toBeVisible();
  });

  test('menu logo link closes menu and navigates', async ({ page }) => {
    // Open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('[data-mobile-menu]')).toBeVisible({ timeout: 1000 });

    // Click logo in menu
    await page.locator('[data-mobile-menu] a:has(img[alt="PALcares logo"])').click();
    await page.waitForTimeout(300);

    // Menu should be closed
    await expect(page.locator('[data-mobile-menu]')).not.toBeVisible();
  });
});

test.describe('Mobile Menu Accessibility', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('menu has proper ARIA attributes', async ({ page }) => {
    await page.goto('/?skiploader=true');
    await page.waitForTimeout(500);

    // Hamburger should have aria-expanded="false" and aria-label="Open menu"
    const hamburgerClosed = page.locator('button[aria-label="Open menu"]');
    await expect(hamburgerClosed).toHaveAttribute('aria-expanded', 'false');

    // Open menu
    await hamburgerClosed.click();
    await page.waitForTimeout(100);

    // Hamburger has aria-expanded="true" now (use attribute selector to be specific)
    const hamburgerOpen = page.locator('button[aria-expanded="true"]');
    await expect(hamburgerOpen).toBeVisible();
    await expect(hamburgerOpen).toHaveAttribute('aria-label', 'Close menu');
  });

  test('keyboard navigation works within menu', async ({ page }) => {
    await page.goto('/?skiploader=true');
    await page.waitForTimeout(500);

    // Open menu
    await page.locator('button[aria-label="Open menu"]').click();
    await page.waitForTimeout(200);

    // Tab through menu items
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Some element within menu should be focused
    const focusedInMenu = await page.evaluate(() => {
      const focused = document.activeElement;
      const menu = document.querySelector('[data-mobile-menu]');
      return menu?.contains(focused);
    });

    expect(focusedInMenu).toBe(true);
  });
});
