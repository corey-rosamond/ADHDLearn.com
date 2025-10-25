import { chromium } from 'playwright';

(async () => {
  console.log('🎮 Letter Pop Smoke Test\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 }})).newPage();

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  try {
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(3000);

    const title = await page.title();
    const canvasCount = await page.locator('canvas').count();
    const containerCount = await page.locator('#game-container').count();

    console.log('Page Title:', title === 'Letter Pop - ADHDLearn' ? '✅' : '❌', title);
    console.log('Canvas Found:', canvasCount === 1 ? '✅' : '❌', canvasCount);
    console.log('Container Found:', containerCount === 1 ? '✅' : '❌', containerCount);
    console.log('Console Errors:', errors.length === 0 ? '✅' : '❌', errors.length);

    await page.screenshot({ path: 'tests/screenshots/smoke-test.png' });
    console.log('\n📸 Screenshot: tests/screenshots/smoke-test.png');

    const passed = title === 'Letter Pop - ADHDLearn' && canvasCount === 1 && containerCount === 1 && errors.length === 0;
    console.log('\n' + (passed ? '✅ ALL TESTS PASSED' : '❌ TESTS FAILED'));
    process.exit(passed ? 0 : 1);
  } catch (error) {
    console.log('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
