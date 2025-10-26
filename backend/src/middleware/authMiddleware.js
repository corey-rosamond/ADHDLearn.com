const jwt = require('jsonwebtoken');

// Middleware: Verify JWT token
// McCabe complexity: 3
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production';
    const decoded = jwt.verify(token, secret);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      familyId: decoded.familyId,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

module.exports = {
  authenticateToken
};
