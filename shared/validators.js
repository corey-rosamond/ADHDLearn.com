// Shared validation functions for ADHDLearn.com platform

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets requirements
 */
export function isValidPassword(password) {
  if (!password) return false;
  return password.length >= 8;
}

/**
 * Validate child PIN
 * @param {string} pin - 4-digit PIN
 * @returns {boolean} True if valid PIN format
 */
export function isValidPIN(pin) {
  if (!pin) return false;
  return /^\d{4}$/.test(pin);
}

// Placeholder - will be expanded in subsequent phases
