// Shared type definitions and interfaces for ADHDLearn.com platform
// (JSDoc comments for JavaScript projects)

/**
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 * @property {number} family_id - Family ID
 */

/**
 * @typedef {Object} Child
 * @property {number} id - Child ID
 * @property {string} name - Child name
 * @property {string} birth_date - Birth date (YYYY-MM-DD)
 * @property {string} avatar - Avatar URL
 * @property {number} family_id - Family ID
 */

/**
 * @typedef {Object} GameSession
 * @property {number} id - Session ID
 * @property {number} child_id - Child ID
 * @property {number} game_id - Game ID
 * @property {number} score - Game score
 * @property {number} duration - Duration in seconds
 * @property {string} created_at - Timestamp
 */

// Placeholder - will be expanded in subsequent phases
export {};
