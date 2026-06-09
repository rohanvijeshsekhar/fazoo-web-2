const express = require('express');
const { getDb } = require('../db/database');
const { publicPostOrAdmin } = require('../middleware/auth');
const { convertBooleans, nowISO } = require('../utils/helpers');

const router = express.Router();

// GET /api/enquiries/ - List all (admin only via middleware)
router.get('/', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM contact_enquiries ORDER BY submitted_date DESC').all();
  res.json(rows.map(r => convertBooleans(r, ['contacted'])));
});

// POST /api/enquiries/ - Create (public)
router.post('/', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const { name, email, phone, company, subject, message } = req.body;
  const submitted_date = nowISO();

  const result = db.prepare(
    'INSERT INTO contact_enquiries (name, email, phone, company, subject, message, submitted_date, contacted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, email, phone, company || '', subject, message, submitted_date, 0);

  const row = db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(convertBooleans(row, ['contacted']));
});

// GET /api/enquiries/:id/ - Retrieve
router.get('/:id', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(convertBooleans(row, ['contacted']));
});

// PUT /api/enquiries/:id/ - Full update
router.put('/:id', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const { name, email, phone, company, subject, message, contacted } = req.body;
  db.prepare(
    'UPDATE contact_enquiries SET name = ?, email = ?, phone = ?, company = ?, subject = ?, message = ?, contacted = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    email ?? existing.email,
    phone ?? existing.phone,
    company !== undefined ? company : existing.company,
    subject ?? existing.subject,
    message ?? existing.message,
    contacted !== undefined ? (contacted ? 1 : 0) : existing.contacted,
    req.params.id
  );

  const row = db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').get(req.params.id);
  res.json(convertBooleans(row, ['contacted']));
});

// PATCH /api/enquiries/:id/ - Partial update (typically contacted status)
router.patch('/:id', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const updates = {};
  for (const key of ['name', 'email', 'phone', 'company', 'subject', 'message', 'contacted']) {
    if (req.body[key] !== undefined) {
      updates[key] = key === 'contacted' ? (req.body[key] ? 1 : 0) : req.body[key];
    }
  }

  if (Object.keys(updates).length > 0) {
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    db.prepare(`UPDATE contact_enquiries SET ${setClauses} WHERE id = ?`).run(...values, req.params.id);
  }

  const row = db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').get(req.params.id);
  res.json(convertBooleans(row, ['contacted']));
});

// DELETE /api/enquiries/:id/ - Destroy
router.delete('/:id', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM contact_enquiries WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM contact_enquiries WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
