const express = require('express');
const fs = require('fs');
const path = require('path');
const { getDb } = require('../db/database');
const { isAdminOrReadOnly, requireAdmin } = require('../middleware/auth');
const { convertBooleans, parseJsonFields, slugify } = require('../utils/helpers');
const { uploadProductFiles, toRelativeMediaPath, MEDIA_ROOT } = require('../middleware/upload');

const router = express.Router();

/**
 * Format a product row for API response.
 * Parses JSON fields, converts booleans, attaches gallery images and category info.
 */
function formatProduct(row) {
  if (!row) return null;
  const db = getDb();

  // Parse JSON fields
  let result = parseJsonFields(convertBooleans(row), ['features', 'specifications']);

  // Attach gallery images
  const gallery = db.prepare('SELECT id, image FROM product_gallery_images WHERE product_id = ?').all(row.id);
  result.gallery_images = gallery;

  // Attach category slug and name
  if (row.category_id) {
    const cat = db.prepare('SELECT slug, name FROM categories WHERE id = ?').get(row.category_id);
    if (cat) {
      result.category_slug = cat.slug;
      result.category_name = cat.name;
    }
  }

  // Return 'category' as the FK id value for frontend compatibility
  result.category = row.category_id;

  return result;
}

// GET /api/products/ - List all (filtered by active for non-admin, supports ?category_slug=X)
router.get('/', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const categorySlug = req.query.category_slug;
  let rows;

  if (categorySlug) {
    const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(categorySlug);
    if (!cat) return res.json([]);

    if (req.user && req.user.is_staff) {
      rows = db.prepare('SELECT * FROM products WHERE category_id = ? ORDER BY display_order ASC, id ASC').all(cat.id);
    } else {
      rows = db.prepare('SELECT * FROM products WHERE category_id = ? AND active = 1 ORDER BY display_order ASC, id ASC').all(cat.id);
    }
  } else {
    if (req.user && req.user.is_staff) {
      rows = db.prepare('SELECT * FROM products ORDER BY display_order ASC, id ASC').all();
    } else {
      rows = db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY display_order ASC, id ASC').all();
    }
  }

  res.json(rows.map(formatProduct));
});

// POST /api/products/ - Create (with hero image + gallery files)
router.post('/', isAdminOrReadOnly, uploadProductFiles.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery_files', maxCount: 20 }
]), (req, res) => {
  const db = getDb();
  const { name, description, short_description, features, specifications,
          display_order, active, seo_title, seo_description } = req.body;
  const categorySlug = req.body.categorySlug || req.body.category_slug;
  const slug = req.body.slug || slugify(name);

  // Resolve category
  let categoryId = req.body.category;
  if (categorySlug) {
    const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(categorySlug);
    if (cat) categoryId = cat.id;
  }
  if (!categoryId) {
    return res.status(400).json({ detail: 'Category is required.' });
  }

  // Handle image
  let imagePath = null;
  if (req.files && req.files.image) {
    imagePath = toRelativeMediaPath(req.files.image[0].path);
  } else if (req.body.image) {
    imagePath = req.body.image;
  }

  // Handle JSON fields
  const featuresJson = typeof features === 'string' ? features : JSON.stringify(features || []);
  const specsJson = typeof specifications === 'string' ? specifications : JSON.stringify(specifications || []);

  const result = db.prepare(
    `INSERT INTO products (category_id, name, slug, short_description, description, features, specifications, image, display_order, active, seo_title, seo_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    categoryId, name, slug, short_description || '', description,
    featuresJson, specsJson, imagePath,
    display_order || 0, active !== undefined ? (active === 'false' ? 0 : 1) : 1,
    seo_title || '', seo_description || ''
  );

  const productId = result.lastInsertRowid;

  // Handle gallery files
  if (req.files && req.files.gallery_files) {
    for (const f of req.files.gallery_files) {
      const galleryPath = toRelativeMediaPath(f.path);
      db.prepare('INSERT INTO product_gallery_images (product_id, image) VALUES (?, ?)').run(productId, galleryPath);
    }
  }

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  res.status(201).json(formatProduct(row));
});

// GET /api/products/:slug/ - Retrieve by slug
router.get('/:slug', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatProduct(row));
});

// PUT /api/products/:slug/ - Update by slug
router.put('/:slug', isAdminOrReadOnly, uploadProductFiles.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery_files', maxCount: 20 }
]), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const { name, description, short_description, features, specifications,
          display_order, active, seo_title, seo_description } = req.body;
  const categorySlug = req.body.categorySlug || req.body.category_slug;

  // Resolve category
  let categoryId = existing.category_id;
  if (categorySlug) {
    const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(categorySlug);
    if (cat) categoryId = cat.id;
  } else if (req.body.category) {
    categoryId = req.body.category;
  }

  // Handle image
  let imagePath = existing.image;
  if (req.files && req.files.image) {
    imagePath = toRelativeMediaPath(req.files.image[0].path);
  } else if (req.body.image !== undefined) {
    imagePath = req.body.image || existing.image;
  }

  // Handle JSON fields
  const featuresJson = features !== undefined
    ? (typeof features === 'string' ? features : JSON.stringify(features))
    : existing.features;
  const specsJson = specifications !== undefined
    ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications))
    : existing.specifications;

  const newSlug = req.body.slug || (name ? slugify(name) : existing.slug);

  db.prepare(
    `UPDATE products SET category_id = ?, name = ?, slug = ?, short_description = ?, description = ?,
     features = ?, specifications = ?, image = ?, display_order = ?, active = ?, seo_title = ?, seo_description = ?
     WHERE id = ?`
  ).run(
    categoryId,
    name ?? existing.name,
    newSlug,
    short_description !== undefined ? short_description : existing.short_description,
    description ?? existing.description,
    featuresJson, specsJson, imagePath,
    display_order ?? existing.display_order,
    active !== undefined ? (active === 'false' || active === false ? 0 : 1) : existing.active,
    seo_title !== undefined ? seo_title : existing.seo_title,
    seo_description !== undefined ? seo_description : existing.seo_description,
    existing.id
  );

  // Handle new gallery files
  if (req.files && req.files.gallery_files) {
    for (const f of req.files.gallery_files) {
      const galleryPath = toRelativeMediaPath(f.path);
      db.prepare('INSERT INTO product_gallery_images (product_id, image) VALUES (?, ?)').run(existing.id, galleryPath);
    }
  }

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(existing.id);
  res.json(formatProduct(row));
});

// POST /api/products/:slug/delete_gallery_image/ - Delete a gallery image
router.post('/:slug/delete_gallery_image', requireAdmin, (req, res) => {
  const db = getDb();
  const product = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
  if (!product) return res.status(404).json({ detail: 'Not found.' });

  const imageId = req.body.image_id;
  const galleryImg = db.prepare('SELECT * FROM product_gallery_images WHERE id = ? AND product_id = ?').get(imageId, product.id);
  if (!galleryImg) return res.status(404).json({ error: 'Image not found' });

  // Delete the physical file
  if (galleryImg.image) {
    const filePath = path.join(MEDIA_ROOT, galleryImg.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  db.prepare('DELETE FROM product_gallery_images WHERE id = ?').run(imageId);
  res.json({ status: 'Image deleted successfully' });
});

// DELETE /api/products/:slug/ - Destroy by slug
router.delete('/:slug', isAdminOrReadOnly, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM products WHERE id = ?').run(existing.id);
  res.status(204).send();
});

module.exports = router;
