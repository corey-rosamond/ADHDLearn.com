// Phase 7: DEBUG - Letter Pop Game Callback Chain Analysis
// Simplified test to debug the onReady callback issue

const { test, expect } = require('@playwright/test');

test.describe('Phase 7: Letter Pop Callback Debug', () => {
  let consoleLogs = [];
  let consoleErrors = [];

  test('Letter Pop game loading - CALLBACK CHAIN ANALYSIS', async ({ page, context }) => {
    // Capture console logs
    consoleLogs = [];
    consoleErrors = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleLogs.push(text);
      if (text.includes('[LetterPopGame]') ||
          text.includes('[Letter Pop]') ||
          text.includes('[BootScene]') ||
          text.includes('[LetterPopMenuScene]')) {
        console.log('BROWSER:', text);
      }
    });

    page.on('pageerror', err => {
      consoleErrors.push(err.message);
      console.error('PAGE ERROR:', err.message);
    });

    // Set up a fake auth token to bypass login
    await context.addInitScript(() => {
      localStorage.setItem('childToken', 'fake-token-for-testing');
      localStorage.setItem('childData', JSON.stringify({
        user_id: 1,
        first_name: 'Test Child',
        role: 'child'
      }));
    });

    // Navigate directly to the Letter Pop game page
    await page.goto('https://child-staging.adhdlearn.com/letter-pop');

    // Wait for loading screen to appear
    const loadingScreen = page.locator('.loading-screen');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });
    console.log('✓ Loading screen appeared');

    // Wait longer for assets to load (assets are loading but it takes time)
    await page.waitForTimeout(15000);

    // Analyze console logs for callback chain
    console.log('\n========== CALLBACK CHAIN ANALYSIS ==========');

    const hasLetterPopGameStart = consoleLogs.some(log => log.includes('[LetterPopGame] useEffect running'));
    const hasCallbackCreation = consoleLogs.some(log => log.includes('[LetterPopGame] Creating callbacks'));
    const hasPhaserInit = consoleLogs.some(log => log.includes('[Letter Pop] Initializing game'));
    const hasCallbacksReceived = consoleLogs.some(log => log.includes('[Letter Pop] Callbacks received'));
    const hasCallbackStored = consoleLogs.some(log => log.includes('[Letter Pop] Callbacks stored'));
    const hasPhaserReady = consoleLogs.some(log => log.includes('[Letter Pop] Phaser game.events.ready fired'));
    const hasBootScene = consoleLogs.some(log => log.includes('[BootScene] create() called'));
    const hasBootCallbacks = consoleLogs.some(log => log.includes('[BootScene] window.gameCallbacks exists: true'));
    const hasMenuScene = consoleLogs.some(log => log.includes('[LetterPopMenuScene] Checking for onReady'));
    const hasCallbackExists = consoleLogs.some(log => log.includes('[LetterPopMenuScene] window.gameCallbacks exists'));
    const hasOnReadyCheck = consoleLogs.some(log => log.includes('[LetterPopMenuScene] Has onReady: true'));
    const hasCallbackScheduled = consoleLogs.some(log => log.includes('[LetterPopMenuScene] Calling onReady in 200ms'));
    const hasCallbackExecuted = consoleLogs.some(log => log.includes('[LetterPopMenuScene] Executing onReady callback NOW'));
    const hasCallbackFired = consoleLogs.some(log => log.includes('[LetterPopGame] onReady callback FIRED'));

    console.log('\n✓ Step 1: LetterPopGame useEffect starts:', hasLetterPopGameStart);
    console.log('✓ Step 2: Callbacks created:', hasCallbackCreation);
    console.log('✓ Step 3: Phaser game initializing:', hasPhaserInit);
    console.log('✓ Step 4: Callbacks received:', hasCallbacksReceived);
    console.log('✓ Step 5: Callbacks stored in window:', hasCallbackStored);
    console.log('✓ Step 6: Phaser game ready event:', hasPhaserReady);
    console.log('✓ Step 7: BootScene created:', hasBootScene);
    console.log('✓ Step 8: BootScene sees callbacks:', hasBootCallbacks);
    console.log('✓ Step 9: LetterPopMenuScene checking:', hasMenuScene);
    console.log('✓ Step 10: MenuScene sees gameCallbacks:', hasCallbackExists);
    console.log('✓ Step 11: MenuScene sees onReady:', hasOnReadyCheck);
    console.log('✓ Step 12: Callback scheduled (200ms):', hasCallbackScheduled);
    console.log('✓ Step 13: Callback executed:', hasCallbackExecuted);
    console.log('✓ Step 14: Callback received in React:', hasCallbackFired);

    console.log('\n========== FAILURE POINT ==========');
    if (!hasLetterPopGameStart) {
      console.log('❌ FAILURE: React component did not start');
    } else if (!hasCallbackCreation) {
      console.log('❌ FAILURE: Callbacks not created in React');
    } else if (!hasPhaserInit) {
      console.log('❌ FAILURE: Phaser game did not initialize');
    } else if (!hasCallbacksReceived) {
      console.log('❌ FAILURE: Phaser did not receive callbacks parameter');
    } else if (!hasCallbackStored) {
      console.log('❌ FAILURE: Callbacks not stored in window.gameCallbacks');
    } else if (!hasPhaserReady) {
      console.log('⚠️  WARNING: Phaser game.events.ready did not fire (not critical)');
    }

    if (!hasBootScene) {
      console.log('❌ FAILURE: BootScene did not create');
    } else if (!hasBootCallbacks) {
      console.log('❌ CRITICAL: BootScene cannot see window.gameCallbacks');
      console.log('   This means callbacks were stored AFTER BootScene already ran');
      console.log('   OR window.gameCallbacks was cleared/overwritten');
    } else if (!hasMenuScene) {
      console.log('❌ FAILURE: LetterPopMenuScene did not start');
    } else if (!hasCallbackExists) {
      console.log('❌ CRITICAL: LetterPopMenuScene cannot see window.gameCallbacks');
      console.log('   Callbacks existed in BootScene but missing in MenuScene');
    } else if (!hasOnReadyCheck) {
      console.log('❌ CRITICAL: onReady callback missing from window.gameCallbacks');
      console.log('   window.gameCallbacks exists but onReady property is undefined');
    } else if (!hasCallbackScheduled) {
      console.log('❌ FAILURE: Callback not scheduled with delayedCall');
    } else if (!hasCallbackExecuted) {
      console.log('❌ CRITICAL: Callback scheduled but never executed');
      console.log('   Phaser time.delayedCall may have failed or scene was destroyed');
    } else if (!hasCallbackFired) {
      console.log('❌ CRITICAL: Callback executed but React did not receive it');
      console.log('   The function was called but setIsLoading(false) did not run');
    } else {
      console.log('✅ SUCCESS: Full callback chain works!');
    }

    // Print all relevant logs in order
    console.log('\n========== FULL LOG SEQUENCE ==========');
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

    // Check loading screen state
    const loadingGone = await loadingScreen.isHidden().catch(() => false);
    console.log('\n========== FINAL STATE ==========');
    console.log('Loading screen disappeared:', loadingGone);

    // Check if game is visible
    const gameContainer = page.locator('#game-container');
    const gameVisible = await gameContainer.isVisible().catch(() => false);
    console.log('Game container visible:', gameVisible);

    // Take a screenshot of final state
    await page.screenshot({ path: 'test-results/callback-debug-final-state.png' });
    console.log('\nScreenshot saved to: test-results/callback-debug-final-state.png');

    // If loading screen is still visible after 5 seconds, that's the bug
    if (!loadingGone) {
      console.log('\n⚠️  BUG CONFIRMED: Loading screen stuck after 5 seconds');
    }

    // This test is for debugging - we're just gathering info
    // Don't fail the test, just report findings
  });
});
