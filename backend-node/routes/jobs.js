const express = require('express');
const { getDb } = require('../db/database');
const { isAdminOrReadOnly } = require('../middleware/auth');
const { convertBooleans, parseJsonFields } = require('../utils/helpers');

const router = express.Router();

function formatJob(row) {
  return parseJsonFields(convertBooleans(row, []), ['description']);
}

// GET /api/jobs/ - List all (filtered by status='Open' for non-admin)
router.get('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  let rows;
  if (req.user && req.user.is_staff) {
    rows = db.prepare('SELECT * FROM jobs ORDER BY display_order ASC, posted_date DESC').all();
  } else {
    rows = db.prepare("SELECT * FROM jobs WHERE status = 'Open' ORDER BY display_order ASC, posted_date DESC").all();
  }
  res.json(rows.map(formatJob));
});

// POST /api/jobs/ - Create
router.post('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const { title, salary, description, status, display_order } = req.body;
  const posted_date = new Date().toISOString().split('T')[0];
  const descJson = typeof description === 'string' ? description : JSON.stringify(description || {});

  const result = db.prepare(
    'INSERT INTO jobs (title, salary, posted_date, description, status, display_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(title, salary, posted_date, descJson, status || 'Open', display_order || 0);

  const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(formatJob(row));
});

// GET /api/jobs/:id/ - Retrieve
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatJob(row));
});

// PUT /api/jobs/:id/ - Update
router.put('/:id', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const { title, salary, description, status, display_order } = req.body;
  const descJson = description !== undefined
    ? (typeof description === 'string' ? description : JSON.stringify(description))
    : existing.description;

  db.prepare(
    'UPDATE jobs SET title = ?, salary = ?, description = ?, status = ?, display_order = ? WHERE id = ?'
  ).run(
    title ?? existing.title,
    salary ?? existing.salary,
    descJson,
    status ?? existing.status,
    display_order ?? existing.display_order,
    req.params.id
  );

  const row = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  res.json(formatJob(row));
});

// DELETE /api/jobs/:id/ - Destroy
router.delete('/:id', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
