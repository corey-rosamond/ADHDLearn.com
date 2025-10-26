const express = require('express');
const router = express.Router();

let pool;

// Setter for dependency injection
function setPool(dbPool) {
  pool = dbPool;
}

// =============================================================================
// GET /api/families/:familyId/children
// Get all children in a family
// McCabe complexity: 2
// =============================================================================
router.get('/families/:familyId/children', async (req, res) => {
  try {
    const { familyId } = req.params;

    // Query children from the family
    const [children] = await pool.execute(
      `SELECT user_id, first_name, last_name, avatar_url, birth_date,
              total_points, current_streak, longest_streak, created_at
       FROM users
       WHERE family_id = ? AND role = 'child' AND is_active = TRUE
       ORDER BY created_at ASC`,
      [familyId]
    );

    res.json({
      success: true,
      children: children.map(child => ({
        userId: child.user_id,
        firstName: child.first_name,
        lastName: child.last_name,
        avatarUrl: child.avatar_url,
        birthDate: child.birth_date,
        totalPoints: child.total_points,
        currentStreak: child.current_streak,
        longestStreak: child.longest_streak,
        createdAt: child.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// =============================================================================
// GET /api/children/:childId/sessions
// Get all game sessions for a specific child
// McCabe complexity: 4
// =============================================================================
router.get('/children/:childId/sessions', async (req, res) => {
  try {
    const { childId } = req.params;
    const gameName = req.query.game;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;

    // Build query dynamically based on filters
    let query = `
      SELECT session_id, game_name, score, accuracy_percentage,
             correct_attempts, total_attempts, duration_seconds,
             mode, played_at
      FROM game_sessions
      WHERE user_id = ?
    `;
    const params = [childId];

    // Add game name filter if provided
    if (gameName) {
      query += ' AND game_name = ?';
      params.push(gameName);
    }

    query += ' ORDER BY played_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [sessions] = await pool.execute(query, params);

    // Get aggregate statistics
    let statsQuery = `
      SELECT
        COUNT(*) as totalSessions,
        SUM(duration_seconds) as totalTimeSeconds,
        AVG(score) as averageScore,
        AVG(accuracy_percentage) as averageAccuracy,
        MAX(score) as bestScore
      FROM game_sessions
      WHERE user_id = ?
    `;
    const statsParams = [childId];

    if (gameName) {
      statsQuery += ' AND game_name = ?';
      statsParams.push(gameName);
    }

    const [stats] = await pool.execute(statsQuery, statsParams);

    res.json({
      success: true,
      sessions: sessions.map(s => ({
        sessionId: s.session_id,
        gameName: s.game_name,
        score: s.score,
        accuracyPercentage: s.accuracy_percentage,
        correctAttempts: s.correct_attempts,
        totalAttempts: s.total_attempts,
        durationSeconds: s.duration_seconds,
        mode: s.mode,
        playedAt: s.played_at
      })),
      stats: {
        totalSessions: stats[0].totalSessions,
        totalTimeMinutes: Math.round((stats[0].totalTimeSeconds || 0) / 60),
        averageScore: Math.round(stats[0].averageScore || 0),
        averageAccuracy: Math.round(stats[0].averageAccuracy || 0),
        bestScore: stats[0].bestScore || 0
      },
      pagination: {
        limit,
        offset,
        hasMore: sessions.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching child sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// =============================================================================
// GET /api/children/:childId/analytics
// Get learning analytics for a specific child
// McCabe complexity: 3
// =============================================================================
router.get('/children/:childId/analytics', async (req, res) => {
  try {
    const { childId } = req.params;

    // Get child info
    const [children] = await pool.execute(
      `SELECT user_id, first_name, avatar_url FROM users WHERE user_id = ?`,
      [childId]
    );

    if (children.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    const child = children[0];

    // Get favorite activity (most played)
    const [favorites] = await pool.execute(
      `SELECT game_name, COUNT(*) as play_count
       FROM game_sessions
       WHERE user_id = ?
       GROUP BY game_name
       ORDER BY play_count DESC
       LIMIT 1`,
      [childId]
    );

    const favoriteActivity = favorites.length > 0 ? favorites[0].game_name : null;

    res.json({
      success: true,
      child: {
        userId: child.user_id,
        firstName: child.first_name,
        avatar: child.avatar_url
      },
      confusionPairs: [], // TODO: Implement in later phase when we track incorrect answers
      favoriteActivity,
      currentStreak: 0, // TODO: Calculate from session dates
      longestStreak: 0  // TODO: Calculate from session history
    });
  } catch (error) {
    console.error('Error fetching child analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = { router, setPool };
