const { getDb } = require('./database');

function initializeSchema() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT DEFAULT '',
      is_staff INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS auth_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS statistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'ShieldCheck',
      display_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      company TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT DEFAULT NULL,
      display_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      overview TEXT DEFAULT '',
      image TEXT DEFAULT NULL,
      brochure TEXT DEFAULT NULL,
      display_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      short_description TEXT DEFAULT '',
      description TEXT NOT NULL,
      features TEXT DEFAULT '[]',
      specifications TEXT DEFAULT '[]',
      image TEXT DEFAULT NULL,
      display_order INTEGER DEFAULT 0,
      active INTEGER DEFAULT 1,
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      UNIQUE(category_id, slug)
    );

    CREATE TABLE IF NOT EXISTS product_gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS dealers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      state TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      type TEXT DEFAULT 'Dealer',
      maps_link TEXT DEFAULT NULL,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      salary TEXT NOT NULL,
      posted_date TEXT NOT NULL,
      description TEXT DEFAULT '{}',
      status TEXT DEFAULT 'Open',
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      resume TEXT DEFAULT NULL,
      cover_letter TEXT DEFAULT '',
      status TEXT DEFAULT 'New',
      applied_date TEXT NOT NULL,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS contact_enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_date TEXT NOT NULL,
      contacted INTEGER DEFAULT 0
    );
  `);

  console.log('Database schema initialized successfully.');
}

module.exports = { initializeSchema };
