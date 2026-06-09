const express = require('express');
const { getDb } = require('../db/database');
const { publicPostOrAdmin } = require('../middleware/auth');
const { convertBooleans, parseJsonFields, todayISO } = require('../utils/helpers');
const { uploadResume, toRelativeMediaPath } = require('../middleware/upload');

const router = express.Router();

/**
 * Format an application row for API response.
 * Joins with jobs table to get job_title as a computed field.
 */
function formatApplication(row) {
  if (!row) return null;
  const db = getDb();
  let result = convertBooleans(row, []);

  // Attach job_title from related job record
  if (row.job_id) {
    const job = db.prepare('SELECT title FROM jobs WHERE id = ?').get(row.job_id);
    result.job_title = job ? job.title : null;
  } else {
    result.job_title = null;
  }

  // Return 'job' as the FK id for frontend compatibility
  result.job = row.job_id;

  return result;
}

// GET /api/applications/ - List all (admin only via middleware)
router.get('/', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM job_applications ORDER BY applied_date DESC, id DESC').all();
  res.json(rows.map(formatApplication));
});

// POST /api/applications/ - Create (public submission with resume upload)
router.post('/', publicPostOrAdmin, uploadResume.single('resume'), (req, res) => {
  const db = getDb();
  const { full_name, email, phone, location, cover_letter } = req.body;
  const applied_date = todayISO();

  // Resume file handling
  let resumePath = null;
  if (req.file) {
    resumePath = toRelativeMediaPath(req.file.path);
  } else if (req.body.resume && typeof req.body.resume === 'string' && !req.body.resume.startsWith('data:')) {
    resumePath = req.body.resume;
  }

  // Resolve job ID from request body
  let jobId = req.body.jobId || req.body.job;
  if (jobId) {
    // Handle 'job_1' style IDs from frontend
    if (typeof jobId === 'string' && jobId.startsWith('job_')) {
      jobId = parseInt(jobId.replace('job_', ''), 10);
    } else {
      jobId = parseInt(jobId, 10);
    }
    // Verify job exists
    const job = db.prepare('SELECT id FROM jobs WHERE id = ?').get(jobId);
    if (!job) {
      // Fallback to first available job
      const firstJob = db.prepare('SELECT id FROM jobs ORDER BY id ASC LIMIT 1').get();
      jobId = firstJob ? firstJob.id : null;
    }
  } else {
    // Fallback to first available job
    const firstJob = db.prepare('SELECT id FROM jobs ORDER BY id ASC LIMIT 1').get();
    jobId = firstJob ? firstJob.id : null;
  }

  if (!jobId) {
    return res.status(400).json({ detail: 'No jobs available.' });
  }

  const result = db.prepare(
    'INSERT INTO job_applications (job_id, full_name, email, phone, location, resume, cover_letter, status, applied_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(jobId, full_name, email, phone, location, resumePath, cover_letter || '', 'New', applied_date);

  const row = db.prepare('SELECT * FROM job_applications WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(formatApplication(row));
});

// GET /api/applications/:id/ - Retrieve
router.get('/:id', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM job_applications WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ detail: 'Not found.' });
  res.json(formatApplication(row));
});

// PUT /api/applications/:id/ - Full update
router.put('/:id', publicPostOrAdmin, uploadResume.single('resume'), (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM job_applications WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const { full_name, email, phone, location, cover_letter, status } = req.body;
  let resumePath = existing.resume;
  if (req.file) {
    resumePath = toRelativeMediaPath(req.file.path);
  }

  let jobId = existing.job_id;
  if (req.body.job) jobId = parseInt(req.body.job, 10);

  db.prepare(
    'UPDATE job_applications SET job_id = ?, full_name = ?, email = ?, phone = ?, location = ?, resume = ?, cover_letter = ?, status = ? WHERE id = ?'
  ).run(
    jobId,
    full_name ?? existing.full_name,
    email ?? existing.email,
    phone ?? existing.phone,
    location ?? existing.location,
    resumePath,
    cover_letter !== undefined ? cover_letter : existing.cover_letter,
    status ?? existing.status,
    req.params.id
  );

  const row = db.prepare('SELECT * FROM job_applications WHERE id = ?').get(req.params.id);
  res.json(formatApplication(row));
});

// PATCH /api/applications/:id/ - Partial update (typically status change)
router.patch('/:id', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM job_applications WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });

  const allowedFields = ['full_name', 'email', 'phone', 'location', 'cover_letter', 'status', 'job_id'];
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length > 0) {
    const setClauses = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    db.prepare(`UPDATE job_applications SET ${setClauses} WHERE id = ?`).run(...values, req.params.id);
  }

  const row = db.prepare('SELECT * FROM job_applications WHERE id = ?').get(req.params.id);
  res.json(formatApplication(row));
});

// DELETE /api/applications/:id/ - Destroy
router.delete('/:id', publicPostOrAdmin, (req, res) => {
  const db = getDb();
  const existing = db.prepare('SELECT * FROM job_applications WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ detail: 'Not found.' });
  db.prepare('DELETE FROM job_applications WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;
