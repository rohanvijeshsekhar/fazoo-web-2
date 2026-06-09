const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MEDIA_ROOT = path.join(__dirname, '..', 'media');

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Create a multer storage engine for a given subdirectory.
 * Files are saved with a timestamp prefix to avoid name collisions.
 */
function createStorage(subDir) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = path.join(MEDIA_ROOT, subDir);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext)
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '');
      const uniqueName = `${Date.now()}_${name}${ext}`;
      cb(null, uniqueName);
    }
  });
}

// Pre-configured uploaders for each resource type
const uploadTestimonialImage = multer({ storage: createStorage('testimonials') });
const uploadCategoryFiles = multer({ storage: createStorage('categories') });
const uploadCategoryBrochure = multer({ storage: createStorage('categories/brochures') });
const uploadProductHero = multer({ storage: createStorage('products/hero') });
const uploadProductGallery = multer({ storage: createStorage('products/gallery') });
const uploadResume = multer({ storage: createStorage('resumes') });

/**
 * Dynamic multer for product routes that handle both hero image and gallery files.
 */
const uploadProductFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let subDir;
      if (file.fieldname === 'image') {
        subDir = 'products/hero';
      } else if (file.fieldname === 'gallery_files') {
        subDir = 'products/gallery';
      } else {
        subDir = 'uploads';
      }
      const dest = path.join(MEDIA_ROOT, subDir);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext)
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '');
      const uniqueName = `${Date.now()}_${name}${ext}`;
      cb(null, uniqueName);
    }
  })
});

/**
 * Dynamic multer for category routes that handle both image and brochure.
 */
const uploadCategoryMulti = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let subDir;
      if (file.fieldname === 'brochure') {
        subDir = 'categories/brochures';
      } else {
        subDir = 'categories';
      }
      const dest = path.join(MEDIA_ROOT, subDir);
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext)
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_-]/g, '');
      const uniqueName = `${Date.now()}_${name}${ext}`;
      cb(null, uniqueName);
    }
  })
});

/**
 * Convert an absolute file path to a relative media path for database storage.
 * e.g. "C:\...\media\testimonials\img.jpg" → "testimonials/img.jpg"
 */
function toRelativeMediaPath(absolutePath) {
  if (!absolutePath) return null;
  const rel = path.relative(MEDIA_ROOT, absolutePath).replace(/\\/g, '/');
  return rel;
}

module.exports = {
  uploadTestimonialImage,
  uploadCategoryFiles,
  uploadCategoryBrochure,
  uploadProductHero,
  uploadProductGallery,
  uploadProductFiles,
  uploadCategoryMulti,
  uploadResume,
  toRelativeMediaPath,
  MEDIA_ROOT
};
