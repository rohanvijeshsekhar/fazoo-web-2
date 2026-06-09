const express = require('express');
const { getDb } = require('../db/database');
const { isAdminOrReadOnly } = require('../middleware/auth');
const { convertBooleans, slugify } = require('../utils/helpers');
const { uploadCategoryMulti, toRelativeMediaPath } = require('../middleware/upload');

const router = express.Router();

// GET /api/categories/ - List all (filtered by active for non-admin)
router.get('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  let rows;
  if (req.user && req.user.is_staff) {
    rows = db.prepare('SELECT * FROM categories ORDER BY display_order ASC, id ASC').all();
  } else {
    rows = db.prepare('SELECT * FROM categories WHERE active = 1 ORDER BY display_order ASC, id ASC').all();
  }
  res.json(rows.map(r => convertBooleans(r)));
});

// POST /api/categories/ - Create (with optional image + brochure upload)
router.post('/', isAdminOrReadOnly, uploadCategoryMulti.fields([
  { name: 'image', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]), (req, res) => {
  const db = getDb();
  const { name, description, overview, display_order, active } = req.body;
  const slug = req.body.slug || slugify(name);

  let imagePath = null;
  let brochurePath = null;
  if (req.files && req.files.image) {
    imagePath = toRelativeMediaPath(req.files.image[0].path);
  } else if (req.body.image) {
    imagePath = req.body.image;
  }
  if (req.files && req.files.brochure) {
    brochurePath = toRelativeMediaPath(req.files.brochure[0].path);
  } else if (req.body.brochure) {
    brochurePath = req.body.brochure;
  }

  const result = db.prepare(
    'INSERT INTO categories (name, slug, description, overview, image, brochure, display_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(name, slug, description, overview || '', imagePath, brochurePath, display_order || 0, active !== undefined ? (active === 'false' ? 0 : 1) : 1);

  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(convertBooleans(row));
});

// GET /api/categories/:slug/ - Retrieve by slug
router.get('/:slug', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(convertBooleans(row));
});

// PUT /api/categories/:slug/ - Update by slug
router.put('/:slug', isAdminOrReadOnly, uploadCategoryMulti.fields([
  { name: 'image', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const { name, description, overview, display_order, active } = req.body;
  const newSlug = req.body.slug || (name ? slugify(name) : existing.slug);

  let imagePath = existing.image;
  let brochurePath = existing.brochure;
  if (req.files && req.files.image) {
    imagePath = toRelativeMediaPath(req.files.image[0].path);
  } else if (req.body.image !== undefined) {
    imagePath = req.body.image || existing.image;
  }
  if (req.files && req.files.brochure) {
    brochurePath = toRelativeMediaPath(req.files.brochure[0].path);
  } else if (req.body.brochure !== undefined) {
    brochurePath = req.body.brochure || existing.brochure;
  }

  db.prepare(
    'UPDATE categories SET name = ?, slug = ?, description = ?, overview = ?, image = ?, brochure = ?, display_order = ?, active = ? WHERE id = ?'
  ).run(
    name ?? existing.name,
    newSlug,
    description ?? existing.description,
    overview !== undefined ? overview : existing.overview,
    imagePath,
    brochurePath,
    display_order ?? existing.display_order,
    active !== undefined ? (active === 'false' || active === false ? 0 : 1) : existing.active,
    existing.id
  );

  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(existing.id);
  res.json(convertBooleans(row));
});

// PATCH /api/categories/:slug/ - Partial update by slug
router.patch('/:slug', isAdminOrReadOnly, uploadCategoryMulti.fields([
  { name: 'image', maxCount: 1 },
  { name: 'brochure', maxCount: 1 }
]), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const updates = { ...existing };

  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.slug !== undefined) updates.slug = req.body.slug;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.overview !== undefined) updates.overview = req.body.overview;
  if (req.body.display_order !== undefined) updates.display_order = req.body.display_order;
  if (req.body.active !== undefined) updates.active = req.body.active === 'false' || req.body.active === false ? 0 : 1;

  if (req.files && req.files.image) {
    updates.image = toRelativeMediaPath(req.files.image[0].path);
  } else if (req.body.image !== undefined) {
    updates.image = req.body.image;
  }
  if (req.files && req.files.brochure) {
    updates.brochure = toRelativeMediaPath(req.files.brochure[0].path);
  } else if (req.body.brochure !== undefined) {
    updates.brochure = req.body.brochure;
  }

  db.prepare(
    'UPDATE categories SET name = ?, slug = ?, description = ?, overview = ?, image = ?, brochure = ?, display_order = ?, active = ? WHERE id = ?'
  ).run(updates.name, updates.slug, updates.description, updates.overview, updates.image, updates.brochure, updates.display_order, updates.active, existing.id);

  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(existing.id);
  res.json(convertBooleans(row));
});

// DELETE /api/categories/:slug/ - Destroy by slug
router.delete('/:slug', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM categories WHERE id = ?').run(existing.id);
  res.status(204).send();
});

module.exports = router;
