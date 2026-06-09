const express = require('express');
const { getDb } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const { uploadProductGallery, toRelativeMediaPath } = require('../middleware/upload');

const router = express.Router();

// GET /api/gallery-images/ - List all (admin only)
router.get('/', requireAdmin, (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT id, product_id, image FROM product_gallery_images').all();
  res.json(rows);
});

// POST /api/gallery-images/ - Create (admin only)
router.post('/', requireAdmin, uploadProductGallery.single('image'), (req, res) => {
  const db = getDb();
  const { product_id } = req.body;
  const imagePath = req.file ? toRelativeMediaPath(req.file.path) : req.body.image;

  const result = db.prepare(
    'INSERT INTO product_gallery_images (product_id, image) VALUES (?, ?)'
  ).run(product_id, imagePath);

  const row = db.prepare('SELECT id, product_id, image FROM product_gallery_images WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(row);
});

// GET /api/gallery-images/:id/ - Retrieve (admin only)
router.get('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT id, product_id, image FROM product_gallery_images WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(row);
});

// DELETE /api/gallery-images/:id/ - Destroy (admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM product_gallery_images WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM product_gallery_images WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
