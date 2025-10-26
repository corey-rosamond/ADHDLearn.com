-- ADHDLearn.com Phase 5: Letter Attempts Tracking
-- Track individual letter attempts for confusion pair analysis

USE adhdlearn;

-- Create letter_attempts table
CREATE TABLE IF NOT EXISTS letter_attempts (
    attempt_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    letter_shown CHAR(1) NOT NULL,
    letter_selected CHAR(1) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_order INT NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id) ON DELETE CASCADE,
    INDEX idx_session (session_id),
    INDEX idx_incorrect (session_id, is_correct),
    INDEX idx_confusion (letter_shown, letter_selected)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for Aurora's existing sessions
-- Session 1: High accuracy (90%) - 18 correct, 2 incorrect
INSERT INTO letter_attempts (session_id, letter_shown, letter_selected, is_correct, attempt_order)
SELECT
    gs.session_id,
    SUBSTRING('ABCDEFGHIJKLMNOPQR', n, 1) as letter_shown,
    SUBSTRING('ABCDEFGHIJKLMNOPQR', n, 1) as letter_selected,
    1 as is_correct,
    n as attempt_order
FROM game_sessions gs
CROSS JOIN (
    SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
    SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION
    SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION
    SELECT 16 UNION SELECT 17 UNION SELECT 18
) numbers
WHERE gs.user_id = 2 AND gs.score = 180
LIMIT 18;

-- Add 2 incorrect attempts (B confused with D)
INSERT INTO letter_attempts (session_id, letter_shown, letter_selected, is_correct, attempt_order)
SELECT session_id, 'B', 'D', 0, 19 FROM game_sessions WHERE user_id = 2 AND score = 180;

INSERT INTO letter_attempts (session_id, letter_shown, letter_selected, is_correct, attempt_order)
SELECT session_id, 'B', 'D', 0, 20 FROM game_sessions WHERE user_id = 2 AND score = 180;

-- Session 2: 80% accuracy - 16 correct, 4 incorrect
INSERT INTO letter_attempts (session_id, letter_shown, letter_selected, is_correct, attempt_order)
SELECT
    gs.session_id,
    SUBSTRING('ABCDEFGHIJKLMNOP', n, 1),
    SUBSTRING('ABCDEFGHIJKLMNOP', n, 1),
    1,
    n
FROM game_sessions gs
CROSS JOIN (
    SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
    SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION
    SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16
) numbers
WHERE gs.user_id = 2 AND gs.score = 160
LIMIT 16;

-- Add incorrect attempts (B→D, P→Q)
INSERT INTO letter_attempts (session_id, letter_shown, letter_selected, is_correct, attempt_order) VALUES
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 160), 'B', 'D', 0, 17),
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 160), 'P', 'Q', 0, 18),
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 160), 'D', 'B', 0, 19),
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 160), 'M', 'N', 0, 20);

-- Session 3: 70% accuracy - 14 correct, 6 incorrect
INSERT INTO letter_attempts (session_id, letter_shown, letter_selected, is_correct, attempt_order)
SELECT
    gs.session_id,
    SUBSTRING('ABCDEFGHIJKLMN', n, 1),
    SUBSTRING('ABCDEFGHIJKLMN', n, 1),
    1,
    n
FROM game_sessions gs
CROSS JOIN (
    SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
    SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION
    SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
) numbers
WHERE gs.user_id = 2 AND gs.score = 140
LIMIT 14;

-- More B/D confusions
INSERT INTO letter_attempts (session_id, letter_shown, letter_selected, is_correct, attempt_order) VALUES
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 140), 'B', 'D', 0, 15),
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 140), 'B', 'D', 0, 16),
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 140), 'B', 'D', 0, 17),
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 140), 'D', 'B', 0, 18),
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 140), 'P', 'Q', 0, 19),
((SELECT session_id FROM game_sessions WHERE user_id = 2 AND score = 140), 'M', 'N', 0, 20);

-- ROLLBACK:
-- DROP TABLE IF EXISTS letter_attempts;

-- Verify
SELECT 'Letter attempts table created!' AS status;
SELECT session_id, COUNT(*) as attempts, SUM(is_correct) as correct
FROM letter_attempts
GROUP BY session_id;

SELECT letter_shown, letter_selected, COUNT(*) as confusion_count
FROM letter_attempts
WHERE is_correct = 0
GROUP BY letter_shown, letter_selected
ORDER BY confusion_count DESC;
