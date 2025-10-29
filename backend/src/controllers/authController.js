const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// Database connection pool (imported from main index.js via exports)
let pool;

function setPool(dbPool) {
  pool = dbPool;
}

// Helper: Validate registration input
// McCabe complexity: 2
function validateRegistrationInput(data) {
  const { firstName, email, password, familyName } = data;

  if (!firstName || !email || !password || !familyName) {
    return { valid: false, error: 'Missing required fields' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  return { valid: true };
}

// Helper: Validate login input
// McCabe complexity: 1
function validateLoginInput(data) {
  const { email, password } = data;

  if (!email || !password) {
    return { valid: false, error: 'Missing required fields' };
  }

  return { valid: true };
}

// Helper: Generate JWT token
// McCabe complexity: 1
function generateToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

// POST /api/auth/register - Register new family + parent
// McCabe complexity: 5
async function register(req, res) {
  try {
    const { firstName, lastName, email, password, familyName } = req.body;

    // Validate input
    const validation = validateRegistrationInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Check if email exists
    const [existing] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create family
    const [familyResult] = await pool.execute(
      'INSERT INTO families (family_name) VALUES (?)',
      [familyName]
    );

    const familyId = familyResult.insertId;

    // Create parent user
    const [userResult] = await pool.execute(
      `INSERT INTO users (family_id, role, email, password_hash, first_name, last_name)
       VALUES (?, 'parent', ?, ?, ?, ?)`,
      [familyId, email, passwordHash, firstName, lastName || null]
    );

    const userId = userResult.insertId;

    // Generate JWT token
    const token = generateToken({
      userId,
      familyId,
      role: 'parent'
    });

    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.execute(
      `INSERT INTO auth_sessions (user_id, token, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, token, expiresAt, req.ip, req.get('user-agent') || null]
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        userId,
        familyId,
        role: 'parent',
        firstName,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// POST /api/auth/login/parent - Parent login
// McCabe complexity: 4
async function loginParent(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLoginInput(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Find user
    const [users] = await pool.execute(
      `SELECT user_id, family_id, password_hash, first_name, email
       FROM users
       WHERE email = ? AND role = 'parent'`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = users[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.user_id,
      familyId: user.family_id,
      role: 'parent'
    });

    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.execute(
      `INSERT INTO auth_sessions (user_id, token, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
      [user.user_id, token, expiresAt, req.ip, req.get('user-agent') || null]
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        userId: user.user_id,
        familyId: user.family_id,
        role: 'parent',
        firstName: user.first_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// POST /api/auth/login/child - Child PIN login
// McCabe complexity: 4
async function loginChild(req, res) {
  try {
    const { userId, pinCode } = req.body;

    // Validate input
    if (!userId || !pinCode) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Find child
    const [children] = await pool.execute(
      `SELECT user_id, family_id, pin_code, first_name, avatar_url
       FROM users
       WHERE user_id = ? AND role = 'child' AND is_active = TRUE`,
      [userId]
    );

    if (children.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const child = children[0];

    // Verify PIN
    const pinMatch = await bcrypt.compare(pinCode, child.pin_code);

    if (!pinMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate JWT token with 2-hour expiry (child session)
    const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    const token = jwt.sign({
      userId: child.user_id,
      familyId: child.family_id,
      role: 'child'
    }, secret, { expiresIn: '2h' });

    // Save session
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    await pool.execute(
      `INSERT INTO auth_sessions (user_id, token, expires_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?)`,
      [child.user_id, token, expiresAt, req.ip, req.get('user-agent') || null]
    );

    // Update last_login
    await pool.execute(
      'UPDATE users SET last_login = NOW() WHERE user_id = ?',
      [child.user_id]
    );

    res.status(200).json({
      success: true,
      token,
      child: {
        userId: child.user_id,
        familyId: child.family_id,
        firstName: child.first_name,
        avatar: child.avatar_url
      }
    });
  } catch (error) {
    console.error('Child login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

module.exports = {
  setPool,
  register,
  loginParent,
  loginChild
};
