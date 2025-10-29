const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

let pool;

// Setter for dependency injection
function setPool(dbPool) {
  pool = dbPool;
}

// Helper: Validate PIN input
// McCabe complexity: 3
function validatePin(pinCode) {
  if (!pinCode || pinCode.length !== 4) {
    return { valid: false, error: 'PIN must be exactly 4 digits' };
  }

  if (!/^\d{4}$/.test(pinCode)) {
    return { valid: false, error: 'PIN must be numeric' };
  }

  if (pinCode === '0000' || pinCode === '1111') {
    return { valid: false, error: 'PIN is too simple. Choose a different PIN for security.' };
  }

  return { valid: true };
}

// Helper: Validate child input
// McCabe complexity: 2
function validateChildInput(data) {
  const { firstName, birthDate, pinCode } = data;

  if (!firstName || !birthDate || !pinCode) {
    return { valid: false, error: 'Missing required fields' };
  }

  const pinValidation = validatePin(pinCode);
  if (!pinValidation.valid) {
    return pinValidation;
  }

  return { valid: true };
}

// =============================================================================
// GET /api/families/:familyId/children
// Get all children in a family
// McCabe complexity: 2
// =============================================================================
router.get('/families/:familyId/children', async (req, res) => {
  try {
    const { familyId } = req.params;

    // Get family name
    const [families] = await pool.execute(
      'SELECT family_name FROM families WHERE family_id = ?',
      [familyId]
    );

    const familyName = families.length > 0 ? families[0].family_name : null;

    // Query children from the family with last active date
    const [children] = await pool.execute(
      `SELECT u.user_id, u.first_name, u.last_name, u.avatar_url, u.birth_date,
              u.total_points, u.current_streak, u.longest_streak, u.created_at,
              MAX(gs.played_at) as last_active
       FROM users u
       LEFT JOIN game_sessions gs ON u.user_id = gs.user_id
       WHERE u.family_id = ? AND u.role = 'child' AND u.is_active = TRUE
       GROUP BY u.user_id
       ORDER BY u.created_at ASC`,
      [familyId]
    );

    res.json({
      success: true,
      familyName,
      children: children.map(child => ({
        userId: child.user_id,
        firstName: child.first_name,
        lastName: child.last_name,
        avatarUrl: child.avatar_url,
        birthDate: child.birth_date,
        totalPoints: child.total_points,
        currentStreak: child.current_streak,
        longestStreak: child.longest_streak,
        createdAt: child.created_at,
        lastActive: child.last_active
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
// POST /api/families/:familyId/children
// Add a new child to the family
// McCabe complexity: 5
// =============================================================================
router.post('/families/:familyId/children', async (req, res) => {
  try {
    const { familyId } = req.params;
    const { firstName, lastName, birthDate, avatar, pinCode } = req.body;

    // Validate input
    const validation = validateChildInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Check for duplicate PIN within family
    const [existing] = await pool.execute(
      `SELECT user_id, pin_code FROM users
       WHERE family_id = ? AND pin_code IS NOT NULL AND role = 'child' AND is_active = TRUE`,
      [familyId]
    );

    // Check if any existing child has the same PIN
    for (const child of existing) {
      const match = await bcrypt.compare(pinCode, child.pin_code || '');
      if (match) {
        return res.status(409).json({
          success: false,
          error: 'This PIN is already used by another child. Choose a different PIN.'
        });
      }
    }

    // Hash PIN
    const pinHash = await bcrypt.hash(pinCode, 10);

    // Insert child
    const [result] = await pool.execute(
      `INSERT INTO users (family_id, role, first_name, last_name, birth_date, avatar_url, pin_code)
       VALUES (?, 'child', ?, ?, ?, ?, ?)`,
      [familyId, firstName, lastName || null, birthDate, avatar || null, pinHash]
    );

    const userId = result.insertId;

    // Calculate age
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    res.status(201).json({
      success: true,
      child: {
        userId,
        familyId: parseInt(familyId),
        firstName,
        lastName,
        birthDate,
        avatar,
        age
      }
    });
  } catch (error) {
    console.error('Error adding child:', error);
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

    // Get child info first
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

    // MySQL doesn't support placeholders for LIMIT/OFFSET
    query += ` ORDER BY played_at DESC LIMIT ${limit} OFFSET ${offset}`;

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
      child: {
        userId: child.user_id,
        firstName: child.first_name,
        avatar: child.avatar_url
      },
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

// Helper function to calculate streaks
// McCabe complexity: 5
function calculateStreaks(sessionDates) {
  if (sessionDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get unique dates (YYYY-MM-DD format)
  const uniqueDates = [...new Set(sessionDates.map(d =>
    new Date(d).toISOString().split('T')[0]
  ))].sort().reverse();

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Calculate current streak (must include today or yesterday)
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const dayDiff = (prevDate - currDate) / 86400000;

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  longestStreak = tempStreak;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const dayDiff = (prevDate - currDate) / 86400000;

    if (dayDiff === 1) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, longestStreak };
}

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

    // Get all session dates for streak calculation
    const [sessionDates] = await pool.execute(
      `SELECT played_at FROM game_sessions WHERE user_id = ? ORDER BY played_at DESC`,
      [childId]
    );

    const streaks = calculateStreaks(sessionDates.map(s => s.played_at));

    // Get confusion pairs (letters child mixes up)
    const [confusions] = await pool.execute(
      `SELECT
        LEAST(letter_shown, letter_selected) as letter1,
        GREATEST(letter_shown, letter_selected) as letter2,
        COUNT(*) as count
       FROM letter_attempts
       WHERE session_id IN (
         SELECT session_id FROM game_sessions WHERE user_id = ?
       )
       AND is_correct = 0
       AND letter_shown != letter_selected
       GROUP BY letter1, letter2
       ORDER BY count DESC
       LIMIT 10`,
      [childId]
    );

    // Calculate total mistakes for percentage
    const [totalMistakes] = await pool.execute(
      `SELECT COUNT(*) as total
       FROM letter_attempts
       WHERE session_id IN (
         SELECT session_id FROM game_sessions WHERE user_id = ?
       )
       AND is_correct = 0`,
      [childId]
    );

    const total = totalMistakes[0]?.total || 1;

    const confusionPairs = confusions.map(c => ({
      letter1: c.letter1,
      letter2: c.letter2,
      count: c.count,
      percentage: Math.round((c.count / total) * 100)
    }));

    res.json({
      success: true,
      child: {
        userId: child.user_id,
        firstName: child.first_name,
        avatar: child.avatar_url
      },
      confusionPairs,
      favoriteActivity,
      currentStreak: streaks.currentStreak,
      longestStreak: streaks.longestStreak
    });
  } catch (error) {
    console.error('Error fetching child analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// =============================================================================
// PUT /api/children/:childId
// Update child information
// McCabe complexity: 5
// =============================================================================
router.put('/children/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const { firstName, lastName, birthDate, avatar, pinCode } = req.body;

    // Get current child data
    const [children] = await pool.execute(
      'SELECT family_id, pin_code FROM users WHERE user_id = ? AND role = \'child\'',
      [childId]
    );

    if (children.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    const child = children[0];

    // If PIN is being changed, validate and check for duplicates
    let pinHash = child.pin_code;
    if (pinCode) {
      const pinValidation = validatePin(pinCode);
      if (!pinValidation.valid) {
        return res.status(400).json({
          success: false,
          error: pinValidation.error
        });
      }

      // Check for duplicate PIN within family (excluding current child)
      const [existing] = await pool.execute(
        `SELECT user_id, pin_code FROM users
         WHERE family_id = ? AND user_id != ? AND pin_code IS NOT NULL AND role = 'child' AND is_active = TRUE`,
        [child.family_id, childId]
      );

      for (const existingChild of existing) {
        const match = await bcrypt.compare(pinCode, existingChild.pin_code || '');
        if (match) {
          return res.status(409).json({
            success: false,
            error: 'This PIN is already used by another child. Choose a different PIN.'
          });
        }
      }

      pinHash = await bcrypt.hash(pinCode, 10);
    }

    // Update child record
    await pool.execute(
      `UPDATE users
       SET first_name = ?, last_name = ?, birth_date = ?, avatar_url = ?, pin_code = ?
       WHERE user_id = ?`,
      [firstName, lastName || null, birthDate, avatar || null, pinHash, childId]
    );

    res.json({
      success: true,
      message: 'Child updated successfully'
    });
  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// =============================================================================
// DELETE /api/children/:childId
// Soft delete a child (set is_active = FALSE)
// McCabe complexity: 2
// =============================================================================
router.delete('/children/:childId', async (req, res) => {
  try {
    const { childId } = req.params;

    // Check if child exists
    const [children] = await pool.execute(
      'SELECT user_id FROM users WHERE user_id = ? AND role = \'child\'',
      [childId]
    );

    if (children.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Child not found'
      });
    }

    // Soft delete (keep all data)
    await pool.execute(
      'UPDATE users SET is_active = FALSE WHERE user_id = ?',
      [childId]
    );

    res.json({
      success: true,
      message: 'Child removed from family'
    });
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = { router, setPool };
