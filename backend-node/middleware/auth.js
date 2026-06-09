const { getDb } = require('../db/database');

/**
 * Middleware: Parse token from Authorization header and attach user to request.
 * Does NOT reject unauthenticated requests — downstream middleware decides.
 */
function parseToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Token ')) {
    const token = authHeader.slice(6);
    const db = getDb();
    const row = db.prepare(`
      SELECT u.id AS user_id, u.username, u.email, u.is_staff
      FROM auth_tokens t
      JOIN users u ON t.user_id = u.id
      WHERE t.token = ?
    `).get(token);

    if (row) {
      req.user = {
        id: row.user_id,
        username: row.username,
        email: row.email,
        is_staff: row.is_staff === 1
      };
    }
  }
  next();
}

/**
 * Middleware: Require any authenticated user.
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ detail: 'Authentication credentials were not provided.' });
  }
  next();
}

/**
 * Middleware: Require admin (is_staff) user.
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ detail: 'Authentication credentials were not provided.' });
  }
  if (!req.user.is_staff) {
    return res.status(403).json({ detail: 'You do not have permission to perform this action.' });
  }
  next();
}

/**
 * Middleware: Allow read (GET/HEAD/OPTIONS) for anyone, require admin for write.
 */
function isAdminOrReadOnly(req, res, next) {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }
  return requireAdmin(req, res, next);
}

/**
 * Middleware: Allow POST for anyone (public submissions), require admin for everything else.
 */
function publicPostOrAdmin(req, res, next) {
  if (req.method === 'POST') {
    return next();
  }
  return requireAdmin(req, res, next);
}

module.exports = { parseToken, requireAuth, requireAdmin, isAdminOrReadOnly, publicPostOrAdmin };
