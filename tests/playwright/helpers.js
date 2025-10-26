// Test Helpers for Phase 6+ Testing
// McCabe complexity: all functions ≤ 3

/**
 * Login as test parent user
 * McCabe: 2
 */
async function loginAsParent(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'sarah@adhdlearn.com');
  await page.fill('input[type="password"]', 'testpass123');
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}

/**
 * Fill PIN input (4 digits)
 * McCabe: 1
 */
async function fillPin(page, selector, pin) {
  const digits = pin.split('');
  const inputs = await page.locator(`${selector} input[type="text"]`).all();

  for (let i = 0; i < digits.length && i < inputs.length; i++) {
    await inputs[i].fill(digits[i]);
  }
}

/**
 * Wait for modal to be visible
 * McCabe: 1
 */
async function waitForModal(page, titleText) {
  await page.waitForSelector(`h2:has-text("${titleText}")`, { timeout: 5000 });
}

/**
 * Close modal by clicking overlay or X button
 * McCabe: 1
 */
async function closeModal(page) {
  await page.click('button:has-text("×")');
  await page.waitForTimeout(500); // Wait for modal to close
}

/**
 * Select avatar by emoji
 * McCabe: 1
 */
async function selectAvatar(page, emoji) {
  await page.click(`button:has-text("${emoji}")`);
}

/**
 * Wait for success message
 * McCabe: 1
 */
async function waitForSuccess(page, message) {
  await page.waitForSelector(`:has-text("${message}")`, { timeout: 5000 });
}

/**
 * Clean up test children (delete all test children)
 * McCabe: 2
 */
async function cleanupTestChildren(page) {
  await page.goto('/dashboard');
  await page.waitForTimeout(1000);

  // Delete all visible children
  const deleteButtons = await page.locator('button:has-text("Delete")').all();

  for (const button of deleteButtons) {
    try {
      await button.click();
      await page.waitForSelector('h2:has-text("Delete")', { timeout: 2000 });
      await page.click('button:has-text("Yes, Delete")');
      await page.waitForTimeout(1000);
    } catch (e) {
      // Continue if delete fails
    }
  }
}

module.exports = {
  loginAsParent,
  fillPin,
  waitForModal,
  closeModal,
  selectAvatar,
  waitForSuccess,
  cleanupTestChildren
};
