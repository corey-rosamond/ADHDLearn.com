-- Create test data for Phase 5
USE adhdlearn;

-- Insert test family
INSERT INTO families (family_name, subscription_tier)
VALUES ('Johnson Family', 'free');

SET @family_id = LAST_INSERT_ID();

-- Insert parent user
INSERT INTO users (family_id, role, email, password_hash, first_name, last_name)
VALUES (
  @family_id,
  'parent',
  'sarah@test.com',
  '$2b$10$abcdefghijklmnopqrstuv',  -- Placeholder hash
  'Sarah',
  'Johnson'
);

-- Insert child user (Aurora)
INSERT INTO users (family_id, role, first_name, last_name, birth_date, avatar_url, total_points, current_streak)
VALUES (
  @family_id,
  'child',
  'Aurora',
  'Johnson',
  '2018-03-15',  -- Age 7
  '🌈',
  450,
  5
);

SET @child_id = LAST_INSERT_ID();

-- Insert some game sessions for the child
INSERT INTO game_sessions (user_id, game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode, played_at)
VALUES
  (@child_id, 'Letter Pop', 180, 90.00, 18, 20, 60, 'uppercase', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (@child_id, 'Letter Pop', 160, 80.00, 16, 20, 60, 'uppercase', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (@child_id, 'Letter Pop', 140, 70.00, 14, 20, 60, 'uppercase', DATE_SUB(NOW(), INTERVAL 2 DAY)),
  (@child_id, 'Letter Pop', 120, 60.00, 12, 20, 60, 'uppercase', DATE_SUB(NOW(), INTERVAL 3 DAY)),
  (@child_id, 'Letter Pop', 150, 75.00, 15, 20, 60, 'uppercase', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Verify data
SELECT 'Test data created successfully!' AS status;
SELECT * FROM families WHERE family_id = @family_id;
SELECT user_id, role, first_name, last_name, email FROM users WHERE family_id = @family_id;
SELECT COUNT(*) as session_count FROM game_sessions WHERE user_id = @child_id;
