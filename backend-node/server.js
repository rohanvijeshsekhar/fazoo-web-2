require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeSchema } = require('./db/schema');
const { parseToken } = require('./middleware/auth');

// Initialize database schema on startup
initializeSchema();

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Global Middleware ───

// CORS — allow all origins in development
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded media files statically at /media/
app.use('/media', express.static(path.join(__dirname, 'media')));

// Parse auth token on every request
app.use(parseToken);

// ─── Trailing Slash Middleware ───
// Strips trailing slashes from requests so Express routes work consistently,
// while still accepting requests with trailing slashes.
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    const safePath = req.path.slice(0, -1);
    req.url = safePath + query;
  }
  next();
});

// ─── Routes ───
app.use('/api/auth', require('./routes/auth'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/gallery-images', require('./routes/galleryImages'));
app.use('/api/dealers', require('./routes/dealers'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'fazo-backend-node', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ───
app.use('/api/*', (req, res) => {
  res.status(404).json({ detail: 'Not found.' });
});

// ─── Error Handler ───
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ detail: 'Internal server error.' });
});

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`\n  FAZO Backend (Node.js) running at: http://localhost:${PORT}/`);
  console.log(`  API Base: http://localhost:${PORT}/api/`);
  console.log(`  Media:    http://localhost:${PORT}/media/\n`);
});
