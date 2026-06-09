const express = require('express');
const { getDb } = require('../db/database');
const { isAdminOrReadOnly } = require('../middleware/auth');
const { convertBooleans } = require('../utils/helpers');

const router = express.Router();

// GET /api/dealers/ - List all (filtered by active for non-admin)
router.get('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  let rows;
  if (req.user && req.user.is_staff) {
    rows = db.prepare('SELECT * FROM dealers ORDER BY name ASC').all();
  } else {
    rows = db.prepare('SELECT * FROM dealers WHERE active = 1 ORDER BY name ASC').all();
  }
  res.json(rows.map(r => convertBooleans(r)));
});

// POST /api/dealers/ - Create
router.post('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const { name, country, state, city, address, contact_person, phone, email, type, maps_link, active } = req.body;
  const result = db.prepare(
    'INSERT INTO dealers (name, country, state, city, address, contact_person, phone, email, type, maps_link, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, country, state, city, address, contact_person, phone, email, type || 'Dealer', maps_link || null, active !== false ? 1 : 0);

  const row = db.prepare('SELECT * FROM dealers WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(convertBooleans(row));
});

// GET /api/dealers/:id/ - Retrieve
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM dealers WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(convertBooleans(row));
});

// PUT /api/dealers/:id/ - Update
router.put('/:id', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM dealers WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const { name, country, state, city, address, contact_person, phone, email, type, maps_link, active } = req.body;
  db.prepare(
    'UPDATE dealers SET name = ?, country = ?, state = ?, city = ?, address = ?, contact_person = ?, phone = ?, email = ?, type = ?, maps_link = ?, active = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    country ?? existing.country,
    state ?? existing.state,
    city ?? existing.city,
    address ?? existing.address,
    contact_person ?? existing.contact_person,
    phone ?? existing.phone,
    email ?? existing.email,
    type ?? existing.type,
    maps_link !== undefined ? maps_link : existing.maps_link,
    active !== undefined ? (active ? 1 : 0) : existing.active,
    req.params.id
  );

  const row = db.prepare('SELECT * FROM dealers WHERE id = ?').get(req.params.id);
  res.json(convertBooleans(row));
});

// DELETE /api/dealers/:id/ - Destroy
router.delete('/:id', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM dealers WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM dealers WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
