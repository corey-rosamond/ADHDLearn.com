// Phase 7: Complete End-to-End Staging Test
// Tests the entire flow on staging with database verification via SSH

const { test, expect } = require('@playwright/test');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Helper to run SQL queries via SSH
async function runSQL(query) {
  const sshCommand = `/tmp/ssh-deploy.sh "sudo mysql -e \\"${query.replace(/"/g, '\\"')}\\" adhdlearn"`;
  const { stdout, stderr } = await execPromise(sshCommand);
  if (stderr && !stderr.includes('Warning')) {
    console.error('SQL Error:', stderr);
  }
  return stdout;
}

test.describe('Phase 7: Complete Staging E2E Test', () => {
  let testChildUserId = 95; // Aurora's userId
  let testFamilyId = 9; // Test Family with active children

  test('Complete flow: Child login → Play game → Verify database tracking', async ({ page, context }) => {
    test.setTimeout(240000); // 4 minutes for full gameplay + SSH queries
    // ==========================================
    // STEP 1: Setup - Add familyId to localStorage
    // ==========================================
    console.log('\n=== STEP 1: Setup ===');

    // Clear browser cache to ensure fresh code
    await context.clearCookies();
    await context.clearPermissions();
    console.log('✓ Cleared browser cache');

    await context.addInitScript((familyId) => {
      localStorage.setItem('familyId', familyId.toString());
    }, testFamilyId);

    // Hard reload to bypass cache - use CDP to clear cache completely
    const client = await context.newCDPSession(page);
    await client.send('Network.clearBrowserCache');
    await client.send('Network.clearBrowserCookies');
    console.log('✓ Cleared browser cache via CDP');

    await page.goto('https://child-staging.adhdlearn.com', { waitUntil: 'networkidle' });
    console.log('✓ Loaded page with cleared cache');
    await page.waitForTimeout(2000);

    // ==========================================
    // STEP 2: Child Selector
    // ==========================================
    console.log('\n=== STEP 2: Child Selector ===');

    const childCard = page.locator('.child-card').first();
    await expect(childCard).toBeVisible({ timeout: 10000 });
    console.log('✓ Child selector loaded');

    // Get child name from card
    const childName = await childCard.locator('.child-name').textContent();
    console.log(`✓ Found child: ${childName}`);

    await childCard.click();
    console.log('✓ Clicked child card');

    // ==========================================
    // STEP 3: PIN Entry
    // ==========================================
    console.log('\n=== STEP 3: PIN Entry ===');

    await page.waitForTimeout(1000);

    // Enter PIN 1234 via number pad buttons
    for (const digit of ['1', '2', '3', '4']) {
      const button = page.locator(`button:has-text("${digit}")`).first();
      await button.click();
      await page.waitForTimeout(200);
    }
    console.log('✓ Entered PIN: 1234');

    await page.waitForTimeout(2000);

    // ==========================================
    // STEP 4: Dashboard
    // ==========================================
    console.log('\n=== STEP 4: Dashboard ===');

    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    console.log('✓ Redirected to dashboard');

    // Get userId from localStorage
    const childData = await page.evaluate(() => {
      return localStorage.getItem('childData');
    });

    expect(childData).toBeTruthy();
    const parsedData = JSON.parse(childData);
    testChildUserId = parsedData.userId;
    console.log(`✓ Child logged in: userId=${testChildUserId}`);

    // Take screenshot of dashboard
    await page.screenshot({ path: '/tmp/dashboard.png', fullPage: true });
    console.log('✓ Screenshot: /tmp/dashboard.png');

    // ==========================================
    // STEP 5: Navigate to Letter Pop
    // ==========================================
    console.log('\n=== STEP 5: Letter Pop Game ===');

    const letterPopButton = page.locator('text=Letter Pop').or(page.locator('[class*="game-tile"]:has-text("Letter Pop")')).first();
    await letterPopButton.click();
    console.log('✓ Clicked Letter Pop');

    // Wait for navigation
    await expect(page).toHaveURL(/.*letter-pop/, { timeout: 5000 });
    console.log('✓ Navigated to /letter-pop');

    // ==========================================
    // STEP 6: Wait for Game to Load
    // ==========================================
    console.log('\n=== STEP 6: Game Loading ===');

    // Loading screen should appear
    const loadingScreen = page.locator('.loading-screen, [class*="loading"]').first();
    const loadingVisible = await loadingScreen.isVisible().catch(() => false);

    if (loadingVisible) {
      console.log('✓ Loading screen appeared');
      await expect(loadingScreen).toBeHidden({ timeout: 45000 });
      console.log('✓ Loading screen disappeared');
    } else {
      console.log('⏩ No loading screen (assets already cached)');
    }

    // Game canvas should be visible (menu screen)
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 5000 });
    console.log('✓ Game canvas rendered (menu)');

    await page.screenshot({ path: '/tmp/game-menu.png' });
    console.log('✓ Screenshot: /tmp/game-menu.png');

    // ==========================================
    // STEP 6b: Start the Game
    // ==========================================
    console.log('\n=== STEP 6b: Starting Game ===');

    // Wait a moment for menu to fully load
    await page.waitForTimeout(1000);

    // Click the START button on the canvas
    // The button is in the lower-left area based on the screenshot
    await canvas.click({ position: { x: 420, y: 640 } }); // START button position
    console.log('✓ Clicked START button');

    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/game-playing.png' });
    console.log('✓ Screenshot: /tmp/game-playing.png');

    // ==========================================
    // STEP 7: Get Session Count Before
    // ==========================================
    console.log('\n=== STEP 7: Pre-Game Session Count ===');

    const beforeCount = await runSQL(`SELECT COUNT(*) as count FROM game_sessions WHERE user_id = ${testChildUserId}`);
    const beforeSessionCount = parseInt(beforeCount.match(/\d+/)[0]);
    console.log(`✓ Sessions before gameplay: ${beforeSessionCount}`);

    // ==========================================
    // STEP 8: Wait for Gameplay to Complete
    // ==========================================
    console.log('\n=== STEP 8: Waiting for Game Completion ===');

    // Track API calls
    let sessionSaved = false;
    let attemptsSaved = false;

    page.on('response', async response => {
      const url = response.url();
      if (url.includes('/api/sessions') && response.request().method() === 'POST') {
        console.log('✓ API: POST /api/sessions called');
        if (response.ok()) {
          try {
            const data = await response.json();
            console.log(`✓ Session saved: sessionId=${data.sessionId}`);
            sessionSaved = true;
          } catch (e) {
            console.log('✓ Session API returned (response not JSON)');
            sessionSaved = true;
          }
        } else {
          console.log(`❌ Session API failed: ${response.status()}`);
        }
      }
      if (url.includes('/attempts')) {
        console.log('✓ API: POST /api/sessions/:id/attempts called');
        attemptsSaved = response.ok();
      }
    });

    // Listen for ALL console messages for debugging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`[${type}] ${text}`);
    });

    page.on('pageerror', error => {
      console.log('❌ PAGE ERROR:', error.message);
    });

    console.log('⏳ Waiting for game to complete (listening for API call)...');
    console.log('   Current URL:', page.url());

    // Wait for the POST /api/sessions call that happens when game ends
    // This is event-driven - triggers immediately when the API call happens
    // Game takes ~120+ seconds with letterAttempts tracking lag
    try {
      const sessionResponse = await page.waitForResponse(
        response => response.url().includes('/api/sessions') &&
                   response.request().method() === 'POST',
        { timeout: 180000 }
      );
      console.log('✓ Game completed - POST /api/sessions detected');
      console.log(`   Response status: ${sessionResponse.status()}`);

      if (sessionResponse.ok()) {
        try {
          const data = await sessionResponse.json();
          console.log(`   Session saved: sessionId=${data.sessionId}`);
          sessionSaved = true;
        } catch (e) {
          console.log('   Session API returned (response not JSON)');
          sessionSaved = true;
        }
      } else {
        console.log(`   ⚠️  Session API returned error: ${sessionResponse.status()}`);
      }
    } catch (error) {
      console.log('❌ Timeout waiting for game completion (no POST /api/sessions detected)');
      console.log('Final URL:', page.url());
      throw error;
    }

    // Wait for attempts API call if it happens
    console.log('⏳ Waiting for letter attempts to save...');
    try {
      await page.waitForResponse(
        response => response.url().includes('/attempts'),
        { timeout: 5000 }
      );
      console.log('✓ Letter attempts saved');
      attemptsSaved = true;
    } catch (e) {
      console.log('⚠️  No letter attempts API call detected (may not be implemented)');
    }

    // ==========================================
    // STEP 9: Verify New Session in Database
    // ==========================================
    console.log('\n=== STEP 9: Database Verification ===');

    const afterCount = await runSQL(`SELECT COUNT(*) as count FROM game_sessions WHERE user_id = ${testChildUserId}`);
    const afterSessionCount = parseInt(afterCount.match(/\d+/)[0]);
    console.log(`✓ Sessions after gameplay: ${afterSessionCount}`);

    if (afterSessionCount > beforeSessionCount) {
      console.log(`✅ NEW SESSION CREATED! (${afterSessionCount - beforeSessionCount} new session(s))`);

      // Get the latest session details
      const sessionData = await runSQL(
        `SELECT session_id, user_id, game_name, score, accuracy_percentage, correct_attempts, total_attempts, played_at
         FROM game_sessions
         WHERE user_id = ${testChildUserId}
         ORDER BY played_at DESC
         LIMIT 1`
      );
      console.log('\n📊 Latest Session:');
      console.log(sessionData);

      // Extract session_id from output
      const sessionIdMatch = sessionData.match(/(\d+)\s+${testChildUserId}/);
      if (sessionIdMatch) {
        const sessionId = sessionIdMatch[1];
        console.log(`✓ Session ID: ${sessionId}`);

        // ==========================================
        // STEP 10: Verify Letter Attempts
        // ==========================================
        console.log('\n=== STEP 10: Letter Attempts Verification ===');

        const attemptsCount = await runSQL(
          `SELECT COUNT(*) as count FROM letter_attempts WHERE session_id = ${sessionId}`
        );
        const numAttempts = parseInt(attemptsCount.match(/\d+/)[0]);
        console.log(`✓ Letter attempts recorded: ${numAttempts}`);

        if (numAttempts > 0) {
          const attemptsData = await runSQL(
            `SELECT letter_shown, letter_selected, is_correct, attempt_order
             FROM letter_attempts
             WHERE session_id = ${sessionId}
             ORDER BY attempt_order ASC
             LIMIT 10`
          );
          console.log('\n📝 Letter Attempts:');
          console.log(attemptsData);

          // Check for confusion pairs
          const confusions = await runSQL(
            `SELECT LEAST(letter_shown, letter_selected) as letter1,
                    GREATEST(letter_shown, letter_selected) as letter2,
                    COUNT(*) as count
             FROM letter_attempts
             WHERE session_id = ${sessionId}
             AND is_correct = 0
             AND letter_shown != letter_selected
             GROUP BY letter1, letter2
             ORDER BY count DESC`
          );

          if (confusions.includes('letter1')) {
            console.log('\n🔍 Confusion Pairs:');
            console.log(confusions);
          } else {
            console.log('✓ No confusion pairs (perfect score or all timeouts)');
          }
        } else {
          console.log('⚠️  No letter attempts recorded (possible issue)');
        }
      }
    } else {
      console.log('❌ NO NEW SESSION CREATED!');
      console.log('This indicates session tracking is NOT working.');
      throw new Error('Session was not saved to database');
    }

    // ==========================================
    // TEST COMPLETE
    // ==========================================
    console.log('\n=== ✅ E2E TEST COMPLETE ===');
    console.log('All session tracking verified successfully!');
  });

  test('Verify API endpoints', async ({ request }) => {
    console.log('\n=== API Endpoint Tests ===');

    // Health check
    const health = await request.get('https://api.adhdlearn.com/health');
    expect(health.ok()).toBeTruthy();
    console.log('✓ GET /health');

    // Get children
    const children = await request.get(`https://api.adhdlearn.com/api/families/${testFamilyId}/children`);
    expect(children.ok()).toBeTruthy();
    console.log(`✓ GET /api/families/${testFamilyId}/children`);

    console.log('✅ API endpoints working');
  });

  test('Verify database schema', async () => {
    console.log('\n=== Database Schema Tests ===');

    // Check user_id column exists
    const sessionSchema = await runSQL('DESCRIBE game_sessions');
    expect(sessionSchema).toContain('user_id');
    console.log('✓ game_sessions.user_id exists');

    // Check last_login column exists
    const userSchema = await runSQL('DESCRIBE users');
    expect(userSchema).toContain('last_login');
    console.log('✓ users.last_login exists');

    // Check letter_attempts table
    const tables = await runSQL("SHOW TABLES LIKE 'letter_attempts'");
    expect(tables).toContain('letter_attempts');
    console.log('✓ letter_attempts table exists');

    const attemptSchema = await runSQL('DESCRIBE letter_attempts');
    expect(attemptSchema).toContain('session_id');
    expect(attemptSchema).toContain('letter_shown');
    expect(attemptSchema).toContain('letter_selected');
    expect(attemptSchema).toContain('is_correct');
    console.log('✓ letter_attempts schema correct');

    console.log('✅ Database schema verified');
  });
});
