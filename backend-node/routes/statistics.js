const express = require('express');
const { getDb } = require('../db/database');
const { isAdminOrReadOnly } = require('../middleware/auth');
const { convertBooleans } = require('../utils/helpers');

const router = express.Router();

// GET /api/statistics/ - List all (filtered by active for non-admin)
router.get('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  let rows;
  if (req.user && req.user.is_staff) {
    rows = db.prepare('SELECT * FROM statistics ORDER BY display_order ASC, id ASC').all();
  } else {
    rows = db.prepare('SELECT * FROM statistics WHERE active = 1 ORDER BY display_order ASC, id ASC').all();
  }
  res.json(rows.map(r => convertBooleans(r)));
});

// POST /api/statistics/ - Create
router.post('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const { label, value, icon, display_order, active } = req.body;
  const result = db.prepare(
    'INSERT INTO statistics (label, value, icon, display_order, active) VALUES (?, ?, ?, ?, ?)'
  ).run(label, value, icon || 'ShieldCheck', display_order || 0, active !== false ? 1 : 0);

  const row = db.prepare('SELECT * FROM statistics WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(convertBooleans(row));
});

// GET /api/statistics/:id/ - Retrieve
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM statistics WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(convertBooleans(row));
});

// PUT /api/statistics/:id/ - Update
router.put('/:id', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM statistics WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const { label, value, icon, display_order, active } = req.body;
  db.prepare(
    'UPDATE statistics SET label = ?, value = ?, icon = ?, display_order = ?, active = ? WHERE id = ?'
  ).run(
    label ?? existing.label,
    value ?? existing.value,
    icon ?? existing.icon,
    display_order ?? existing.display_order,
    active !== undefined ? (active ? 1 : 0) : existing.active,
    req.params.id
  );

  const row = db.prepare('SELECT * FROM statistics WHERE id = ?').get(req.params.id);
  res.json(convertBooleans(row));
});

// DELETE /api/statistics/:id/ - Destroy
router.delete('/:id', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM statistics WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM statistics WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
