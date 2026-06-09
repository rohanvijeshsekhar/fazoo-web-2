const express = require('express');
const { getDb } = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { convertBooleans, parseJsonFields } = require('../utils/helpers');

const router = express.Router();

/**
 * GET /api/dashboard/
 * Returns aggregated stats and recent items.
 * Returns aggregated counts, recent applications, enquiries, and products.
 */
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const db = getDb();

  const totalCategories = db.prepare('SELECT COUNT(*) AS c FROM categories').get().c;
  const totalProducts = db.prepare('SELECT COUNT(*) AS c FROM products').get().c;
  const totalDealers = db.prepare('SELECT COUNT(*) AS c FROM dealers').get().c;
  const totalJobs = db.prepare('SELECT COUNT(*) AS c FROM jobs').get().c;
  const totalApplications = db.prepare('SELECT COUNT(*) AS c FROM job_applications').get().c;
  const totalTestimonials = db.prepare('SELECT COUNT(*) AS c FROM testimonials').get().c;
  const totalEnquiries = db.prepare('SELECT COUNT(*) AS c FROM contact_enquiries').get().c;

  // Recent applications (last 5)
  const recentApps = db.prepare(
    'SELECT * FROM job_applications ORDER BY applied_date DESC, id DESC LIMIT 5'
  ).all();

  // Format applications with job_title
  const formattedApps = recentApps.map(app => {
    const result = { ...app, job: app.job_id };
    const job = db.prepare('SELECT title FROM jobs WHERE id = ?').get(app.job_id);
    result.job_title = job ? job.title : null;
    return result;
  });

  // Recent enquiries (last 5)
  const recentEnquiries = db.prepare(
    'SELECT * FROM contact_enquiries ORDER BY submitted_date DESC LIMIT 5'
  ).all().map(r => convertBooleans(r, ['contacted']));

  // Recent products (last 5)
  const recentProducts = db.prepare(
    'SELECT * FROM products ORDER BY id DESC LIMIT 5'
  ).all().map(row => {
    let result = parseJsonFields(convertBooleans(row), ['features', 'specifications']);
    // Attach gallery images
    const gallery = db.prepare('SELECT id, image FROM product_gallery_images WHERE product_id = ?').all(row.id);
    result.gallery_images = gallery;
    // Attach category info
    if (row.category_id) {
      const cat = db.prepare('SELECT slug, name FROM categories WHERE id = ?').get(row.category_id);
      if (cat) {
        result.category_slug = cat.slug;
        result.category_name = cat.name;
      }
    }
    result.category = row.category_id;
    return result;
  });

  res.json({
    total_categories: totalCategories,
    total_products: totalProducts,
    total_dealers: totalDealers,
    total_jobs: totalJobs,
    total_applications: totalApplications,
    total_enquiries: totalEnquiries,
    counts: {
      categories: totalCategories,
      products: totalProducts,
      dealers: totalDealers,
      careers: totalJobs,         // Note: frontend expects 'careers' key, not 'jobs'
      applications: totalApplications,
      testimonials: totalTestimonials,
      enquiries: totalEnquiries
    },
    recent_applications: formattedApps,
    recent_enquiries: recentEnquiries,
    recent_products: recentProducts
  });
});

module.exports = router;
