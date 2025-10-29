// Phase 7: Child Login Flow and Letter Pop Game Loading
// E2E Tests for child authentication, dashboard, and game loading

const { test, expect } = require('@playwright/test');

test.describe('Phase 7: Child Login and Game Loading', () => {
  let consoleLogs = [];
  let consoleErrors = [];

  test.beforeEach(async ({ page }) => {
    // Capture console logs
    consoleLogs = [];
    consoleErrors = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      console.log('BROWSER:', text);
    });

    page.on('pageerror', err => {
      consoleErrors.push(err.message);
      console.error('PAGE ERROR:', err.message);
    });
  });

  test('Child login flow with PIN', async ({ page }) => {
    // Navigate to child staging
    await page.goto('https://child-staging.adhdlearn.com');

    // Should show child selector
    await expect(page.locator('h1')).toContainText('ADHD LEARN');
    await expect(page.locator('h2')).toContainText('Who is playing today?');

    // Select a child (click first child card)
    await page.locator('.child-card').first().click();

    // Should redirect to PIN entry
    await expect(page).toHaveURL(/.*pin-entry/);
    await expect(page.locator('h2')).toContainText('Enter Your PIN');

    // Enter PIN (assuming test child has PIN 1234)
    await page.locator('.pin-digit').first().fill('1');
    await page.locator('.pin-digit').nth(1).fill('2');
    await page.locator('.pin-digit').nth(2).fill('3');
    await page.locator('.pin-digit').nth(3).fill('4');

    // Click submit
    await page.locator('button:has-text("Enter")').click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Welcome back');
  });

  test('Dashboard navigation and settings', async ({ page }) => {
    // Login first
    await page.goto('https://child-staging.adhdlearn.com');
    await page.locator('.child-card').first().click();
    await page.locator('.pin-digit').first().fill('1');
    await page.locator('.pin-digit').nth(1).fill('2');
    await page.locator('.pin-digit').nth(2).fill('3');
    await page.locator('.pin-digit').nth(3).fill('4');
    await page.locator('button:has-text("Enter")').click();
    await page.waitForURL(/.*dashboard/);

    // Check settings button exists
    const settingsButton = page.locator('button:has-text("Settings")');
    await expect(settingsButton).toBeVisible();

    // Click settings
    await settingsButton.click();

    // Should navigate to settings page
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.locator('h1')).toContainText('Settings');

    // Check for volume sliders
    await expect(page.locator('text=Master Volume')).toBeVisible();
    await expect(page.locator('text=Music Volume')).toBeVisible();
    await expect(page.locator('text=Sound Effects')).toBeVisible();

    // Back button should work
    await page.locator('button:has-text("Back to Dashboard")').click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('Letter Pop game loading - DEBUG CALLBACK CHAIN', async ({ page }) => {
    // Login first
    await page.goto('https://child-staging.adhdlearn.com');
    await page.locator('.child-card').first().click();
    await page.locator('.pin-digit').first().fill('1');
    await page.locator('.pin-digit').nth(1).fill('2');
    await page.locator('.pin-digit').nth(2).fill('3');
    await page.locator('.pin-digit').nth(3).fill('4');
    await page.locator('button:has-text("Enter")').click();
    await page.waitForURL(/.*dashboard/);

    // Clear previous console logs
    consoleLogs = [];
    consoleErrors = [];

    // Click Letter Pop game
    const letterPopTile = page.locator('.game-tile', { hasText: 'Letter Pop' });
    await expect(letterPopTile).toBeVisible();
    await letterPopTile.click();

    // Should navigate to /letter-pop
    await expect(page).toHaveURL(/.*letter-pop/, { timeout: 5000 });

    // Wait for loading screen to appear
    const loadingScreen = page.locator('.loading-screen');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });

    // Wait a bit for logs to accumulate
    await page.waitForTimeout(2000);

    // Analyze console logs for callback chain
    console.log('\n========== CALLBACK CHAIN ANALYSIS ==========');

    const hasLetterPopGameStart = consoleLogs.some(log => log.includes('[LetterPopGame] useEffect running'));
    const hasCallbackCreation = consoleLogs.some(log => log.includes('[LetterPopGame] Creating callbacks'));
    const hasPhaserInit = consoleLogs.some(log => log.includes('[Letter Pop] Initializing game'));
    const hasCallbackStored = consoleLogs.some(log => log.includes('[Letter Pop] Callbacks stored'));
    const hasBootScene = consoleLogs.some(log => log.includes('[BootScene] create() called'));
    const hasBootCallbacks = consoleLogs.some(log => log.includes('[BootScene] window.gameCallbacks exists'));
    const hasMenuScene = consoleLogs.some(log => log.includes('[LetterPopMenuScene] Checking for onReady'));
    const hasCallbackExists = consoleLogs.some(log => log.includes('[LetterPopMenuScene] window.gameCallbacks exists'));
    const hasOnReadyCheck = consoleLogs.some(log => log.includes('[LetterPopMenuScene] Has onReady: true'));
    const hasCallbackScheduled = consoleLogs.some(log => log.includes('[LetterPopMenuScene] Calling onReady in 200ms'));
    const hasCallbackExecuted = consoleLogs.some(log => log.includes('[LetterPopMenuScene] Executing onReady callback NOW'));
    const hasCallbackFired = consoleLogs.some(log => log.includes('[LetterPopGame] onReady callback FIRED'));

    console.log('✓ LetterPopGame useEffect starts:', hasLetterPopGameStart);
    console.log('✓ Callbacks created:', hasCallbackCreation);
    console.log('✓ Phaser game initializing:', hasPhaserInit);
    console.log('✓ Callbacks stored in window:', hasCallbackStored);
    console.log('✓ BootScene created:', hasBootScene);
    console.log('✓ BootScene sees callbacks:', hasBootCallbacks);
    console.log('✓ LetterPopMenuScene checking:', hasMenuScene);
    console.log('✓ MenuScene sees gameCallbacks:', hasCallbackExists);
    console.log('✓ MenuScene sees onReady:', hasOnReadyCheck);
    console.log('✓ Callback scheduled (200ms):', hasCallbackScheduled);
    console.log('✓ Callback executed:', hasCallbackExecuted);
    console.log('✓ Callback received in React:', hasCallbackFired);

    console.log('\n========== FAILURE POINT ==========');
    if (!hasLetterPopGameStart) {
      console.log('❌ FAILURE: React component did not start');
    } else if (!hasCallbackCreation) {
      console.log('❌ FAILURE: Callbacks not created in React');
    } else if (!hasPhaserInit) {
      console.log('❌ FAILURE: Phaser game did not initialize');
    } else if (!hasCallbackStored) {
      console.log('❌ FAILURE: Callbacks not stored in window.gameCallbacks');
    } else if (!hasBootScene) {
      console.log('❌ FAILURE: BootScene did not create');
    } else if (!hasBootCallbacks) {
      console.log('❌ FAILURE: BootScene cannot see window.gameCallbacks');
    } else if (!hasMenuScene) {
      console.log('❌ FAILURE: LetterPopMenuScene did not start checking');
    } else if (!hasCallbackExists) {
      console.log('❌ FAILURE: LetterPopMenuScene cannot see window.gameCallbacks');
    } else if (!hasOnReadyCheck) {
      console.log('❌ FAILURE: onReady callback missing from window.gameCallbacks');
    } else if (!hasCallbackScheduled) {
      console.log('❌ FAILURE: Callback not scheduled with delayedCall');
    } else if (!hasCallbackExecuted) {
      console.log('❌ FAILURE: Callback scheduled but never executed (timing issue?)');
    } else if (!hasCallbackFired) {
      console.log('❌ FAILURE: Callback executed but React did not receive it');
    } else {
      console.log('✅ SUCCESS: Full callback chain works!');
    }

    // Print all relevant logs
    console.log('\n========== ALL RELEVANT LOGS ==========');
    consoleLogs.forEach(log => {
      if (log.includes('[LetterPopGame]') ||
          log.includes('[Letter Pop]') ||
          log.includes('[BootScene]') ||
          log.includes('[LetterPopMenuScene]')) {
        console.log(log);
      }
    });

    // Print any errors
    if (consoleErrors.length > 0) {
      console.log('\n========== CONSOLE ERRORS ==========');
      consoleErrors.forEach(err => console.error(err));
    }

    // Wait longer to see if loading screen eventually disappears
    await page.waitForTimeout(5000);

    // Check if loading screen disappeared
    const loadingGone = await loadingScreen.isHidden().catch(() => false);
    console.log('\n========== LOADING SCREEN STATE ==========');
    console.log('Loading screen disappeared:', loadingGone);

    // Check if game is visible
    const gameContainer = page.locator('#game-container');
    const gameVisible = await gameContainer.isVisible().catch(() => false);
    console.log('Game container visible:', gameVisible);

    // This test is for debugging - we expect it might fail
    // The console output will tell us where the problem is
  });

  test('Letter Pop game back button navigation', async ({ page }) => {
    // Login first
    await page.goto('https://child-staging.adhdlearn.com');
    await page.locator('.child-card').first().click();
    await page.locator('.pin-digit').first().fill('1');
    await page.locator('.pin-digit').nth(1).fill('2');
    await page.locator('.pin-digit').nth(2).fill('3');
    await page.locator('.pin-digit').nth(3).fill('4');
    await page.locator('button:has-text("Enter")').click();
    await page.waitForURL(/.*dashboard/);

    // Click Letter Pop game
    await page.locator('.game-tile', { hasText: 'Letter Pop' }).click();
    await expect(page).toHaveURL(/.*letter-pop/);

    // Wait for game to load (with longer timeout since we know there's an issue)
    await page.waitForTimeout(10000);

    // Try to find and click the back button in the game
    // Note: This might not work if the game doesn't load properly
    // But we're testing if the navigation flow works when it does load
    const backButton = page.locator('canvas').first();

    // Click in the area where the back button should be (top-left corner)
    await backButton.click({ position: { x: 100, y: 50 } });

    // Should navigate back to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 5000 });
  });
});
