import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Starting browser test...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture all console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const emoji = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '📝';
    console.log(`${emoji} [${type.toUpperCase()}] ${text}`);
  });

  // Capture page errors
  page.on('pageerror', err => {
    console.log('❌ PAGE ERROR:', err.message);
    console.log('Stack:', err.stack);
  });

  try {
    console.log('📄 Loading http://localhost:3000...\n');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    // Wait for potential game initialization
    await page.waitForTimeout(2000);

    // Take screenshot
    await page.screenshot({ path: '/tmp/game-test.png', fullPage: true });
    console.log('\n📸 Screenshot saved to /tmp/game-test.png');

    // Check for canvas element
    const canvasCount = await page.$$eval('canvas', canvases => canvases.length);
    console.log(`\n🎨 Canvas elements found: ${canvasCount}`);

    // Check page title
    const title = await page.title();
    console.log(`📄 Page title: ${title}`);

    // Get any text content
    const bodyText = await page.textContent('body');
    console.log(`📝 Body text (first 100 chars): ${bodyText.substring(0, 100)}`);

  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
  }

  await browser.close();
  console.log('\n✅ Test complete!');
})();
