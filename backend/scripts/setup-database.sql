-- ADHDLearn.com Phase 3: Database Setup
-- Creates database, tables, and user

-- Create database
CREATE DATABASE IF NOT EXISTS adhdlearn;
USE adhdlearn;

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    game_name VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    accuracy_percentage DECIMAL(5,2),
    correct_attempts INT,
    total_attempts INT,
    duration_seconds INT,
    mode VARCHAR(20),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_game_score (game_name, score DESC),
    INDEX idx_played_at (played_at DESC)
);

-- Create database user (will prompt for password)
-- Note: Update 'your_password_here' with actual secure password
CREATE USER IF NOT EXISTS 'adhdlearn'@'localhost' IDENTIFIED BY 'your_password_here';
CREATE USER IF NOT EXISTS 'adhdlearn'@'%' IDENTIFIED BY 'your_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON adhdlearn.* TO 'adhdlearn'@'localhost';
GRANT ALL PRIVILEGES ON adhdlearn.* TO 'adhdlearn'@'%';
FLUSH PRIVILEGES;

-- Verify table creation
SHOW TABLES;
DESCRIBE game_sessions;
