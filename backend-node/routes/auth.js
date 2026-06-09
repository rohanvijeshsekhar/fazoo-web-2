const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getDb } = require('../db/database');

const router = express.Router();

/**
 * POST /api/auth/login/
 * Validates credentials and returns a token.
 * Validates credentials and returns an auth token.
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      non_field_errors: ['Unable to log in with provided credentials.']
    });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    return res.status(400).json({
      non_field_errors: ['Unable to log in with provided credentials.']
    });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(400).json({
      non_field_errors: ['Unable to log in with provided credentials.']
    });
  }

  // Get or create token
  let tokenRow = db.prepare('SELECT * FROM auth_tokens WHERE user_id = ?').get(user.id);
  if (!tokenRow) {
    const token = crypto.randomBytes(20).toString('hex'); // 40-char hex token
    const now = new Date().toISOString();
    db.prepare('INSERT INTO auth_tokens (token, user_id, created_at) VALUES (?, ?, ?)').run(token, user.id, now);
    tokenRow = { token };
  }

  return res.json({
    token: tokenRow.token,
    user_id: user.id,
    username: user.username,
    email: user.email,
    is_staff: user.is_staff === 1
  });
});

module.exports = router;
