// Phase 7: Final Loading Screen Test
// Verify loading screen disappears and game appears

const { test, expect } = require('@playwright/test');

test.describe('Phase 7: Loading Screen Final Test', () => {
  test('Loading screen should disappear and game should appear', async ({ page, context }) => {
    // Set up fake auth token
    await context.addInitScript(() => {
      localStorage.setItem('childToken', 'fake-token-for-testing');
      localStorage.setItem('childData', JSON.stringify({
        user_id: 1,
        first_name: 'Test Child',
        role: 'child'
      }));
    });

    // Navigate to Letter Pop game
    await page.goto('https://child-staging.adhdlearn.com/letter-pop');

    // Loading screen should appear
    const loadingScreen = page.locator('.loading-screen');
    await expect(loadingScreen).toBeVisible({ timeout: 5000 });
    console.log('✓ Loading screen appeared');

    // Wait for loading screen to disappear (max 30 seconds for asset loading)
    await expect(loadingScreen).toBeHidden({ timeout: 30000 });
    console.log('✓ Loading screen disappeared');

    // Game container should be visible
    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();
    console.log('✓ Game container visible');

    // Check that game canvas exists (Phaser creates a canvas element)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    console.log('✓ Phaser canvas rendered');

    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/phase-07-final.png', fullPage: true });
    console.log('✓ Screenshot saved');

    console.log('\n✅ Phase 7 test passed - Game loads successfully!');
  });
});
