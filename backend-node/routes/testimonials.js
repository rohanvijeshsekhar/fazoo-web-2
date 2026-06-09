const express = require('express');
const { getDb } = require('../db/database');
const { isAdminOrReadOnly } = require('../middleware/auth');
const { convertBooleans } = require('../utils/helpers');
const { uploadTestimonialImage, toRelativeMediaPath } = require('../middleware/upload');

const router = express.Router();

// GET /api/testimonials/ - List all (filtered by active for non-admin)
router.get('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  let rows;
  if (req.user && req.user.is_staff) {
    rows = db.prepare('SELECT * FROM testimonials ORDER BY display_order ASC, id ASC').all();
  } else {
    rows = db.prepare('SELECT * FROM testimonials WHERE active = 1 ORDER BY display_order ASC, id ASC').all();
  }
  res.json(rows.map(r => convertBooleans(r)));
});

// POST /api/testimonials/ - Create (with optional image upload)
router.post('/', isAdminOrReadOnly, uploadTestimonialImage.single('image'), (req, res) => {
  const db = getDb();
  const { name, designation, company, content, display_order, active } = req.body;
  const imagePath = req.file ? toRelativeMediaPath(req.file.path) : (req.body.image || null);

  const result = db.prepare(
    'INSERT INTO testimonials (name, designation, company, content, image, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(name, designation, company, content, imagePath, display_order || 0, active !== undefined ? (active === 'false' ? 0 : 1) : 1);

  const row = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(convertBooleans(row));
});

// GET /api/testimonials/:id/ - Retrieve
router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(convertBooleans(row));
});

// PUT /api/testimonials/:id/ - Update
router.put('/:id', isAdminOrReadOnly, uploadTestimonialImage.single('image'), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const { name, designation, company, content, display_order, active } = req.body;
  const imagePath = req.file ? toRelativeMediaPath(req.file.path) : (req.body.image || existing.image);

  db.prepare(
    'UPDATE testimonials SET name = ?, designation = ?, company = ?, content = ?, image = ?, display_order = ?, active = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    designation ?? existing.designation,
    company ?? existing.company,
    content ?? existing.content,
    imagePath,
    display_order ?? existing.display_order,
    active !== undefined ? (active === 'false' || active === false ? 0 : 1) : existing.active,
    req.params.id
  );

  const row = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  res.json(convertBooleans(row));
});

// DELETE /api/testimonials/:id/ - Destroy
router.delete('/:id', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
