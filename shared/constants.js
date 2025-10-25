// Shared constants across ADHDLearn.com platform

// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.adhdlearn.com';
export const API_STAGING_URL = 'https://api-staging.adhdlearn.com';

// Category IDs
export const CATEGORIES = {
  READING: 1,
  MATH: 2,
  SCIENCE: 3,
  LIFE_SKILLS: 4
};

// Category Colors
export const CATEGORY_COLORS = {
  READING: '#3B82F6',    // Blue
  MATH: '#10B981',       // Green
  SCIENCE: '#8B5CF6',    // Purple
  LIFE_SKILLS: '#F59E0B' // Orange
};

// ADHD-Friendly Design Constants
export const DESIGN_CONSTANTS = {
  MIN_TOUCH_TARGET: 44,        // pixels (minimum touch target size)
  MAX_RESPONSE_TIME: 50,       // milliseconds (maximum acceptable response time)
  MIN_CONTRAST_RATIO: 7.0,     // WCAG AAA contrast ratio
  MAX_TEXT_LENGTH: 60          // characters (maximum text per line for readability)
};

// Placeholder - will be expanded in subsequent phases
