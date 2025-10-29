-- ADHDLearn.com Phase 7: Child Login with PIN
-- Database migration to add last_login tracking

USE adhdlearn;

-- Add last_login column to users table for tracking child login activity
ALTER TABLE users
ADD COLUMN last_login TIMESTAMP NULL AFTER updated_at;

-- Add index for efficient last login queries
CREATE INDEX idx_last_login ON users(last_login DESC);

-- ROLLBACK:
-- ALTER TABLE users DROP COLUMN last_login;
-- DROP INDEX idx_last_login ON users;

-- Verify changes
DESCRIBE users;
SHOW INDEX FROM users WHERE Key_name = 'idx_last_login';

SELECT 'Phase 7 migration complete!' AS status;
