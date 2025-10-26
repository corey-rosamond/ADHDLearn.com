const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const authController = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'https://child.adhdlearn.com',
    'https://child-staging.adhdlearn.com',
    'https://parent.adhdlearn.com',
    'https://parent-staging.adhdlearn.com',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:5174',
    'http://localhost:4174'
  ],
  credentials: true
}));
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'adhdlearn',
  password: process.env.DB_PASSWORD || 'AuroraLearns2025!',
  database: 'adhdlearn',
  waitForConnections: true,
  connectionLimit: 10
});

// Initialize auth controller with database pool
authController.setPool(pool);

// =============================================================================
// AUTH ROUTES (Phase 4)
// =============================================================================

// POST /api/auth/register - Register new family + parent
app.post('/api/auth/register', authController.register);

// POST /api/auth/login/parent - Parent login
app.post('/api/auth/login/parent', authController.loginParent);

// =============================================================================
// GAME SESSION ROUTES (Phase 3)
// =============================================================================

// POST /api/sessions - Save game session
// McCabe complexity: 4
app.post('/api/sessions', async (req, res) => {
  try {
    const {
      gameName,
      score,
      accuracyPercentage,
      correctAttempts,
      totalAttempts,
      durationSeconds,
      mode
    } = req.body;

    // Validate input (complexity: 2)
    if (!gameName || score === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Insert session
    const [result] = await pool.execute(
      `INSERT INTO game_sessions
       (game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [gameName, score, accuracyPercentage, correctAttempts, totalAttempts, durationSeconds, mode]
    );

    const sessionId = result.insertId;

    // Check if it's a high score
    const [scores] = await pool.execute(
      `SELECT COUNT(*) as \`rank\` FROM game_sessions
       WHERE game_name = ? AND score > ?`,
      [gameName, score]
    );

    const rank = scores[0].rank + 1;
    const isHighScore = rank <= 10;

    res.status(201).json({
      success: true,
      sessionId,
      isHighScore,
      rank
    });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/sessions/high-scores - Get high scores
// McCabe complexity: 3
app.get('/api/sessions/high-scores', async (req, res) => {
  try {
    const gameName = req.query.game || 'Letter Pop';
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);

    const [scores] = await pool.execute(
      `SELECT session_id, score, accuracy_percentage, played_at
       FROM game_sessions
       WHERE game_name = ?
       ORDER BY score DESC, played_at DESC
       LIMIT ${limit}`,
      [gameName]
    );

    res.json({
      success: true,
      scores: scores.map(row => ({
        sessionId: row.session_id,
        score: row.score,
        accuracyPercentage: row.accuracy_percentage,
        playedAt: row.played_at
      }))
    });
  } catch (error) {
    console.error('Error fetching high scores:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Health check
// McCabe complexity: 1
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`ADHDLearn API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
