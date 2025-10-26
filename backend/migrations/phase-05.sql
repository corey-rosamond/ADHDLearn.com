-- ADHDLearn.com Phase 5: Link Game Sessions to Users
-- Database migration to connect sessions to children

USE adhdlearn;

-- Add user_id column to game_sessions table
-- NULL initially to allow existing rows, then we can set defaults or clean them up
ALTER TABLE game_sessions
ADD COLUMN user_id INT NULL AFTER session_id,
ADD FOREIGN KEY fk_sessions_user (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Add index for efficient queries by user and game
CREATE INDEX idx_user_game_played ON game_sessions(user_id, game_name, played_at DESC);

-- ROLLBACK:
-- ALTER TABLE game_sessions DROP FOREIGN KEY fk_sessions_user;
-- ALTER TABLE game_sessions DROP COLUMN user_id;
-- DROP INDEX idx_user_game_played ON game_sessions;

-- Verify changes
DESCRIBE game_sessions;
SHOW INDEX FROM game_sessions;

SELECT 'Phase 5 migration complete!' AS status;
