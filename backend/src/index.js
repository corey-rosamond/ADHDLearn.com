const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const authController = require('./controllers/authController');
const childrenRoutes = require('./routes/children');

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

// Initialize controllers/routes with database pool
authController.setPool(pool);
childrenRoutes.setPool(pool);

// =============================================================================
// AUTH ROUTES (Phase 4)
// =============================================================================

// POST /api/auth/register - Register new family + parent
app.post('/api/auth/register', authController.register);

// POST /api/auth/login/parent - Parent login
app.post('/api/auth/login/parent', authController.loginParent);

// POST /api/auth/login/child - Child PIN login (Phase 7)
app.post('/api/auth/login/child', authController.loginChild);

// =============================================================================
// CHILDREN/FAMILY ROUTES (Phase 5)
// =============================================================================
app.use('/api', childrenRoutes.router);

// =============================================================================
// GAME SESSION ROUTES (Phase 3)
// =============================================================================

// POST /api/sessions - Save game session
// McCabe complexity: 4
app.post('/api/sessions', async (req, res) => {
  try {
    const {
      userId,
      gameName,
      score,
      accuracyPercentage,
      correctAttempts,
      totalAttempts,
      durationSeconds,
      mode
    } = req.body;

    console.log('[API] POST /api/sessions - req.body:', JSON.stringify(req.body));
    console.log('[API] userId extracted:', userId, 'type:', typeof userId);

    // Validate input (complexity: 2)
    if (!gameName || score === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Insert session with userId (convert undefined to null for all fields)
    const [result] = await pool.execute(
      `INSERT INTO game_sessions
       (user_id, game_name, score, accuracy_percentage, correct_attempts, total_attempts, duration_seconds, mode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId ?? null,
        gameName,
        score ?? 0,
        accuracyPercentage ?? null,
        correctAttempts ?? null,
        totalAttempts ?? null,
        durationSeconds ?? null,
        mode ?? null
      ]
    );

    console.log('[API] Session inserted with user_id:', userId ?? null, 'sessionId:', result.insertId);

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

// POST /api/sessions/:sessionId/attempts - Save letter attempts for a session
// McCabe complexity: 3
app.post('/api/sessions/:sessionId/attempts', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { attempts } = req.body;

    // Validate input
    if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid attempts array'
      });
    }

    // Insert all attempts in a batch
    const values = attempts.map(a => [
      sessionId,
      a.letterShown,
      a.letterSelected,
      a.isCorrect,
      a.attemptOrder
    ]);

    const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const flatValues = values.flat();

    await pool.execute(
      `INSERT INTO letter_attempts (session_id, letter_shown, letter_selected, is_correct, attempt_order)
       VALUES ${placeholders}`,
      flatValues
    );

    res.status(201).json({
      success: true,
      attemptsRecorded: attempts.length
    });
  } catch (error) {
    console.error('Error saving letter attempts:', error);
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
