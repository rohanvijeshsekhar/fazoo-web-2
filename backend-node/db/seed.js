/**
 * Database seed script — ported from Django's seed_db.py
 * Run: node db/seed.js
 */
require('dotenv').config();
const { getDb } = require('./database');
const { initializeSchema } = require('./schema');
const bcrypt = require('bcryptjs');

function seed() {
  // Initialize schema first
  initializeSchema();
  const db = getDb();

  console.log('Starting database seeding...');

  // ─── 1. Create Superuser ───
  const existingAdmin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!existingAdmin) {
    const hash = bcrypt.hashSync('adminadmin', 10);
    db.prepare('INSERT INTO users (username, password_hash, email, is_staff) VALUES (?, ?, ?, ?)').run(
      'admin', hash, 'admin@faazodent.com', 1
    );
    console.log("✓ Superuser 'admin' created with password 'adminadmin'.");
  } else {
    console.log("Superuser 'admin' already exists.");
  }

  // ─── 2. Seed Statistics ───
  db.prepare('DELETE FROM statistics').run();
  const statsData = [
    { label: 'Years of Excellence', value: '10+', icon: 'ShieldCheck', display_order: 1 },
    { label: 'Dental Clinics', value: '1000+', icon: 'Activity', display_order: 2 },
    { label: 'Products', value: '5000+', icon: 'Package', display_order: 3 },
    { label: 'Countries Served', value: '25+', icon: 'Globe', display_order: 4 },
  ];
  const insertStat = db.prepare('INSERT INTO statistics (label, value, icon, display_order) VALUES (?, ?, ?, ?)');
  for (const s of statsData) {
    insertStat.run(s.label, s.value, s.icon, s.display_order);
  }
  console.log(`✓ Seeded ${statsData.length} statistics.`);

  // ─── 3. Seed Testimonials ───
  db.prepare('DELETE FROM testimonials').run();
  const testimonialsData = [
    {
      name: 'Dr. Ananya Nair', designation: 'Clinical Director', company: 'Pearl Dental Clinics',
      content: "FAAZO's high-speed dental handpieces have outstanding durability and zero vibration. Our dentists report much higher comfort during long surgeries.",
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop', display_order: 1
    },
    {
      name: 'Vikram Malhotra', designation: 'Managing Director', company: 'Apex MedSupplies',
      content: "As a wholesale distributor, logistics and consistency are key. FAAZO's prompt supply chain and robust packaging make them our top partner.",
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', display_order: 2
    },
    {
      name: 'Dr. Rachel Thomas', designation: 'Chief of Dentistry', company: 'Lifeline Group Hospitals',
      content: "We upgraded 24 clinical rooms with FAAZO's LED curing lights and chairs. Their engineering team managed the complete install with zero practice downtime.",
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop', display_order: 3
    },
    {
      name: 'Dr. Amit Sharma', designation: 'Founder', company: 'Sharma Dental & Implant Center',
      content: 'Their intraoral cameras have transformed our patient consultation. Showing high-definition real-time teeth scans builds immediate clinical trust.',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=150&auto=format&fit=crop', display_order: 4
    },
    {
      name: 'Dr. Sarah Al-Mansoori', designation: 'Pediatric Orthodontist', company: 'Smile UAE',
      content: "The ergonomics of FAAZO's treatment chairs are unmatched. My patients fall asleep during long root canals, and my back pain is completely gone.",
      image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop', display_order: 5
    },
    {
      name: 'Benjamin K. Chirchir', designation: 'CEO', company: 'East Africa Dental Supplies Ltd.',
      content: "As dental equipment retailers, we need products that rarely need servicing. FAAZO equipment is incredibly reliable, and their tech support is outstanding.",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', display_order: 6
    },
    {
      name: 'Dr. Priya Sen', designation: 'Prosthodontist', company: 'Radiance Smile Studio',
      content: 'Their quiet air compressors are a game-changer. We no longer have that constant loud background noise, making our clinic peaceful and relaxing.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop', display_order: 7
    },
    {
      name: 'Dr. Thomas Mathews', designation: 'Head of Orthodontics', company: "St. Mary's Dental College",
      content: 'The transition to FAAZO\'s 3D oral scanners was effortless. It cut our impression taking time down from 10 minutes to just under 90 seconds.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', display_order: 8
    },
    {
      name: 'Rohan Kapoor', designation: 'Procurement Head', company: 'DentAlliance Group',
      content: "FAAZO offers premium European-grade quality dental tech at highly reasonable prices. Their post-sale warranty and spare parts availability are excellent.",
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop', display_order: 9
    }
  ];
  const insertTestimonial = db.prepare(
    'INSERT INTO testimonials (name, designation, company, content, image, display_order) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const t of testimonialsData) {
    insertTestimonial.run(t.name, t.designation, t.company, t.content, t.image, t.display_order);
  }
  console.log(`✓ Seeded ${testimonialsData.length} testimonials.`);

  // ─── 4. Seed Categories ───
  db.prepare('DELETE FROM categories').run();
  const categoriesData = [
    {
      name: 'Dental Handpieces', slug: 'dental-handpieces',
      description: 'High-quality precision handpieces engineered for smooth and efficient clinical performance.',
      overview: 'Our precision handpieces deliver exceptional torque and durability. Designed to feel natural in the hand, they provide the fine control and visibility required for advanced restorative procedures.',
      image: 'hero/handpiece_4_3.webp', display_order: 1
    },
    {
      name: 'Intraoral Cameras', slug: 'intraoral-cameras',
      description: 'Advanced imaging solutions for accurate diagnostics and enhanced patient communication.',
      overview: 'Bridge the communication gap with patients. Our HD intraoral cameras offer crisp, real-time tooth scans that build immediate clinical trust and simplify visual treatment planning.',
      image: 'hero/camera_4_3.webp', display_order: 2
    },
    {
      name: 'LED Light Cure Units', slug: 'led-light-cure-units',
      description: 'High-performance curing technology delivering reliable and consistent results.',
      overview: 'Ensure stable, uniform polymerization for every restoration. Our LED units deliver optimal spectrum output with fast curing times and consistent battery longevity.',
      image: 'hero/curing_light_4_3.webp', display_order: 3
    },
    {
      name: 'Dental Chairs', slug: 'dental-chairs',
      description: 'Ergonomically designed treatment units for superior patient comfort and clinical efficiency.',
      overview: 'Redefine patient treatment. Engineered with pressure-relief cushions and fully programmable physician configurations to support long-hour posture comfort.',
      image: 'hero/chair_4_3.webp', display_order: 4
    },
    {
      name: '3D Oral Scanners', slug: '3d-oral-scanners',
      description: 'Digital scanning systems enabling fast, accurate, and impression-free workflows.',
      overview: 'Eliminate traditional mess. Capturing true-color 3D impressions under 90 seconds, these scanners sync seamlessly with digital dental laboratories for instant prosthesis design.',
      image: 'hero/scanner_4_3.webp', display_order: 5
    },
    {
      name: 'Dental Air Compressors', slug: 'dental-air-compressors',
      description: 'Quiet, reliable, and efficient compressed air systems for modern dental practices.',
      overview: 'Deliver 100% oil-free, dry compressed air. Equipped with soundproof chambers to keep your clinic quiet, relaxing, and sterile.',
      image: 'hero/compressor_4_3.webp', display_order: 6
    },
    {
      name: 'Advanced Dental Equipment & Accessories', slug: 'advanced-equipment-accessories',
      description: 'Comprehensive dental solutions supporting advanced clinical procedures and daily operations.',
      overview: "Maximize clinical productivity. Access specialized surgical aids, apex locators, scaler handpieces, and essential modern tools built to European quality standards.",
      image: 'hero/accessories_4_3.webp', display_order: 7
    }
  ];
  const insertCategory = db.prepare(
    'INSERT INTO categories (name, slug, description, overview, image, display_order) VALUES (?, ?, ?, ?, ?, ?)'
  );
  for (const c of categoriesData) {
    insertCategory.run(c.name, c.slug, c.description, c.overview, c.image, c.display_order);
  }
  console.log(`✓ Seeded ${categoriesData.length} categories.`);

  // ─── 5. Seed Products ───
  db.prepare('DELETE FROM product_gallery_images').run();
  db.prepare('DELETE FROM products').run();
  const productsData = [
    {
      name: 'High Speed Handpiece', slug: 'high-speed-handpiece', category_slug: 'dental-handpieces',
      short_description: 'Precision engineered high-speed turbine with integrated LED light.',
      description: "FAAZO high-speed turbine handpieces represent the pinnacle of precise engineering. With zero-vibration rotation and 22W turbine torque, this handpiece ensures efficient cutting with maximum comfort for both the dentist and the patient.",
      features: ['Quattro water spray system for optimal cooling', 'Ceramic bearings for extended longevity', 'Integrated LED light for shadows-free view', 'Anti-retraction clean-head system'],
      specifications: [{ key: 'Speed', value: '350,000 - 420,000 RPM' }, { key: 'Chuck Type', value: 'Push Button' }, { key: 'Connection', value: 'Standard 4-hole / coupling' }, { key: 'Noise Level', value: '≤ 60 dB' }],
      image: 'hero/handpiece_4_3.webp', display_order: 1,
      seo_title: 'FAAZO High Speed LED Handpiece - Premium Dental Turbine',
      seo_description: 'Shop high speed handpieces by FAAZO. Low noise, ceramic bearings, micro-LED optics, and premium water sprays for restorative dentistry.'
    },
    {
      name: 'Low Speed Handpiece', slug: 'low-speed-handpiece', category_slug: 'dental-handpieces',
      short_description: 'Durable low-speed handpiece for prophylaxis and polishing.',
      description: 'Durable and quiet low speed handpiece attachment kit. Ideal for final cavity preparation, micro-finishing, and orthodontic polishing procedures.',
      features: ['Ergonomic non-slip grip handles', '1:1 direct transmission speed ratio', 'Internal/External water spray option', 'Forward and reverse rotation controls'],
      specifications: [{ key: 'Max Speed', value: '22,000 RPM' }, { key: 'Bearings', value: 'Stainless Steel' }, { key: 'Type', value: 'Straight & Contra-Angle kit' }, { key: 'Pressure', value: '0.3 MPa' }],
      image: 'hero/handpiece_4_3.webp', display_order: 2,
      seo_title: 'FAAZO Low Speed Restorative Handpiece',
      seo_description: 'FAAZO low-speed dental handpiece kit. Prophylaxis, contra-angles, straight attachments for laboratory and clinical finishing.'
    },
    {
      name: 'HD Wireless Camera', slug: 'hd-wireless-camera', category_slug: 'intraoral-cameras',
      short_description: 'High-definition intraoral camera with wireless transmission.',
      description: 'A plug-and-play visual communication tool featuring a 1080p CMOS sensor and wireless transmission to any PC, tablet, or monitor.',
      features: ['True 1080p HD image capture', 'Wireless transmitter works up to 10 meters', '8 high-power adjustable LED lights', 'Compatible with major dental imaging software'],
      specifications: [{ key: 'Sensor', value: '1/4 CMOS 2.0 Megapixel' }, { key: 'Battery Life', value: '3 hours continuous use' }, { key: 'Focus Range', value: '3mm - 40mm auto-focus' }, { key: 'OS Support', value: 'Windows, macOS, Android' }],
      image: 'hero/camera_4_3.webp', display_order: 1,
      seo_title: 'FAAZO HD Wireless Intraoral Dental Camera',
      seo_description: 'Capture crystal-clear dental diagnostics with FAAZO HD Wireless Intraoral Camera. 1080p CMOS sensor with auto-focus lens.'
    },
    {
      name: 'USB Wired Camera', slug: 'usb-wired-camera', category_slug: 'intraoral-cameras',
      short_description: 'Simple plug-and-play USB camera for instant imaging.',
      description: 'Wired USB camera with dual capture buttons (left/right handed) providing immediate, high-resolution diagnostic imaging.',
      features: ['Direct USB 2.0 connection, no power cords', 'Anti-fog optical lens glass', 'Dual capture buttons for easy grip ergonomics', 'Lightweight medical-grade plastic shell'],
      specifications: [{ key: 'Cable Length', value: '2.5 meters' }, { key: 'Resolution', value: '1280 x 720' }, { key: 'Light Source', value: '6 LED white bulbs' }, { key: 'Weight', value: '45 grams' }],
      image: 'hero/camera_4_3.webp', display_order: 2,
      seo_title: 'FAAZO USB Wired Diagnostic Intraoral Camera',
      seo_description: 'FAAZO USB dental camera. Budget-friendly, plug-and-play setup for patient communication and tooth photography.'
    },
    {
      name: 'Cordless Curing Light', slug: 'cordless-curing-light', category_slug: 'led-light-cure-units',
      short_description: 'High-performance cordless curing unit with dual wavelength.',
      description: 'Curing light with wide-spectrum LEDs, ensuring complete curing of all dental materials and composites within 5 seconds.',
      features: ['High power output up to 2000 mW/cm²', 'Dual wavelength to cure all brand composites', 'Multiple preset modes: Normal, High Power, Pulse', 'Ergonomic pen-grip style casing'],
      specifications: [{ key: 'Wavelength Range', value: '385 - 515 nm' }, { key: 'Battery Type', value: 'Li-Ion rechargeable' }, { key: 'Light Guide', value: '8mm black optical fiber guide' }, { key: 'Charging Station', value: 'Wireless induction charging pad' }],
      image: 'hero/curing_light_4_3.webp', display_order: 1,
      seo_title: 'FAAZO Cordless LED Curing Light - Wide Spectrum',
      seo_description: 'Polymerize composite materials in 5 seconds with FAAZO dual-wavelength curing lights. High intensity output up to 2000mW.'
    },
    {
      name: 'Comfort Clinic Chair', slug: 'comfort-clinic-chair', category_slug: 'dental-chairs',
      short_description: 'Ergonomic treatment unit with luxury cushioning.',
      description: "Premium dental chair unit that integrates patient comfort with operational workflow. Features whisper-quiet electro-pneumatic motors and intuitive double-jointed headrests.",
      features: ['Luxury memory foam leather seat cushioning', '9 programmable chair memory positions', 'Integrated doctor and assistant console hubs', 'Shadowless LED operation lamp with sensor controls'],
      specifications: [{ key: 'Load Capacity', value: '185 kg' }, { key: 'Elevation Range', value: '380mm - 780mm' }, { key: 'Cuspidor', value: '90° rotating ceramic spittoon' }, { key: 'Operation Lamp', value: '8,000 - 30,000 Lux adjustable' }],
      image: 'hero/chair_4_3.webp', display_order: 1,
      seo_title: 'FAAZO Comfort Clinic Ergonomic Dental Chair',
      seo_description: 'Upgrade your clinic with FAAZO Comfort Chairs. Quiet operation, premium styling, adjustable memory foam, LED lighting systems.'
    },
    {
      name: 'FAAZO Scan 3D', slug: 'faazo-scan-3d', category_slug: '3d-oral-scanners',
      short_description: 'Intelligent intraoral scanner with color texture mapping.',
      description: 'Next-gen intraoral scanner providing absolute precision digital impressions. Powered by AI scanning software that filters tongue and cheek structures in real-time.',
      features: ['Powder-free scanning workflow', 'High accuracy scanning under 15 microns', 'True color 3D digital impressions', 'Cloud platform integration for dental labs'],
      specifications: [{ key: 'Scan Speed', value: 'Full arch under 90 seconds' }, { key: 'Format Output', value: 'STL, PLY, OBJ' }, { key: 'Handpiece Weight', value: '245 grams' }, { key: 'Tip Autoclave', value: 'Up to 100 cycles at 134°C' }],
      image: 'hero/scanner_4_3.webp', display_order: 1,
      seo_title: 'FAAZO Scan 3D Intraoral Dental Scanner',
      seo_description: 'Modern powder-free 3D intraoral scanner. Highly accurate digital dental impression scanner with instant lab exports.'
    },
    {
      name: 'Silent Compressor 50L', slug: 'silent-compressor-50l', category_slug: 'dental-air-compressors',
      short_description: 'Ultra-quiet dry air compressor for single chair setups.',
      description: 'Provide dry, oil-free medical compressed air. Specially structured to guarantee absolute sterile air for air turbine handpieces and 3-way syringes.',
      features: ['100% oil-free motor for non-toxic clinical air', 'Internal rust-preventative epoxy coated tank', 'Double cooling fans for long run durations', 'Sound-absorbing metal cabinets'],
      specifications: [{ key: 'Tank Volume', value: '50 Liters' }, { key: 'Noise Level', value: '52 dB (Ultra Silent)' }, { key: 'Output Flow', value: '115 L/min at 5 Bar' }, { key: 'Max Pressure', value: '8 Bar' }],
      image: 'hero/compressor_4_3.webp', display_order: 1,
      seo_title: 'FAAZO Oil-Free Silent Dental Compressor 50L',
      seo_description: 'FAAZO 50L silent medical air compressor. Oil-free, dry air supply for single chair dental clinic setups.'
    },
    {
      name: 'Ultrasonic Scaler', slug: 'ultrasonic-scaler', category_slug: 'advanced-equipment-accessories',
      short_description: 'Advanced scaler with auto-frequency adjustment.',
      description: 'Intelligent scaler that adapts vibration frequencies to remove stubborn dental calculus effortlessly while respecting soft tissue boundaries.',
      features: ['Auto-feedback system stabilizes power outputs', 'Detachable autoclavable handpiece with LED', 'Compatible with scaling, perio, and endo tips', 'Self-contained water supply system bottle'],
      specifications: [{ key: 'Frequency', value: '28 kHz ± 3 kHz' }, { key: 'Power Output', value: '3W to 20W' }, { key: 'Water Pressure', value: '0.01 MPa - 0.5 MPa' }, { key: 'Tips Supplied', value: '6 assorted titanium tips' }],
      image: 'hero/accessories_4_3.webp', display_order: 1,
      seo_title: 'FAAZO Smart LED Ultrasonic Scaler',
      seo_description: 'High frequency ultrasonic scaling system by FAAZO. Adjustable water flows, auto-feedback control, perio/endo tips.'
    }
  ];

  const insertProduct = db.prepare(
    `INSERT INTO products (category_id, name, slug, short_description, description, features, specifications, image, display_order, active, seo_title, seo_description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
  );
  const insertGalleryImg = db.prepare(
    'INSERT INTO product_gallery_images (product_id, image) VALUES (?, ?)'
  );

  for (const p of productsData) {
    const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(p.category_slug);
    if (!cat) {
      console.error(`Category '${p.category_slug}' not found for product '${p.name}'. Skipping.`);
      continue;
    }
    const result = insertProduct.run(
      cat.id, p.name, p.slug, p.short_description, p.description,
      JSON.stringify(p.features), JSON.stringify(p.specifications),
      p.image, p.display_order, p.seo_title, p.seo_description
    );
    // Create default gallery image referencing the main image
    insertGalleryImg.run(result.lastInsertRowid, p.image);
  }
  console.log(`✓ Seeded ${productsData.length} products.`);

  // ─── 6. Seed Dealers ───
  db.prepare('DELETE FROM dealers').run();
  const dealersData = [
    { name: 'Fortune Dental Solutions', country: 'India', state: 'Kerala', city: 'Thiruvananthapuram', address: 'TC 25/1230, Main Road, Thiruvananthapuram, Kerala, 695001', contact_person: 'John Mathew', phone: '+91 98450 12345', email: 'dealer@company.com', type: 'Dealer', maps_link: 'https://maps.google.com/?q=Thiruvananthapuram' },
    { name: 'Deccan Dental Supplies', country: 'India', state: 'Karnataka', city: 'Bengaluru', address: '45, 2nd Cross, MG Road, Bengaluru, Karnataka, 560001', contact_person: 'Rajesh Kumar', phone: '+91 80234 56789', email: 'info@deccandental.in', type: 'Distributor', maps_link: 'https://maps.google.com/?q=Bengaluru' },
    { name: 'Maharashtra Dental Depot', country: 'India', state: 'Maharashtra', city: 'Mumbai', address: '102, Plaza Center, Dadar, Mumbai, Maharashtra, 400014', contact_person: 'Sanjay Mehta', phone: '+91 22987 65432', email: 'sales@mumdental.com', type: 'Dealer', maps_link: 'https://maps.google.com/?q=Mumbai' },
    { name: 'Apex MedTech Gulf', country: 'UAE', state: 'Dubai', city: 'Dubai Marina', address: 'Office 402, Marina Towers, Dubai, UAE', contact_person: 'Tariq Al-Fayed', phone: '+971 4 555 1234', email: 'contact@apexmedtech.ae', type: 'Distributor', maps_link: 'https://maps.google.com/?q=Dubai' },
    { name: 'Riyadh Dental Equipment Corp', country: 'Saudi Arabia', state: 'Riyadh', city: 'Riyadh', address: 'King Fahd Road, Riyadh, Saudi Arabia', contact_person: 'Faisal Bin Khalid', phone: '+966 11 405 6789', email: 'riyadh@dentalcorp.com.sa', type: 'Dealer', maps_link: 'https://maps.google.com/?q=Riyadh' },
    { name: 'Muscat Dental & Medical Supplies', country: 'Oman', state: 'Muscat', city: 'Ruwi', address: 'Muttrah High Street, Ruwi, Muscat, Oman', contact_person: 'Salim Al-Harthy', phone: '+968 2470 1234', email: 'info@muscatdental.om', type: 'Dealer', maps_link: 'https://maps.google.com/?q=Muscat' },
    { name: 'Doha Medilink Systems', country: 'Qatar', state: 'Doha', city: 'West Bay', address: 'Tornado Tower, Floor 11, West Bay, Doha, Qatar', contact_person: 'Khalifa Al-Thani', phone: '+974 4433 5566', email: 'sales@medilink.qa', type: 'Distributor', maps_link: 'https://maps.google.com/?q=Doha' },
    { name: 'East Africa Dental & Ortho Ltd', country: 'Kenya', state: 'Nairobi', city: 'Westlands, Nairobi', address: 'Ring Road, Westlands, Nairobi, Kenya', contact_person: 'James Kamau', phone: '+254 20 221 4567', email: 'sales@eadental.co.ke', type: 'Dealer', maps_link: 'https://maps.google.com/?q=Nairobi' },
    { name: 'Kilimanjaro Medical Instruments', country: 'Tanzania', state: 'Dar es Salaam', city: 'Kariakoo', address: 'Msimbazi Street, Kariakoo, Dar es Salaam, Tanzania', contact_person: 'Amani Mwangi', phone: '+255 22 211 9876', email: 'info@kilimanjaro-med.co.tz', type: 'Distributor', maps_link: 'https://maps.google.com/?q=Dar+es+Salaam' },
    { name: 'Cape Dental Suppliers', country: 'South Africa', state: 'Western Cape', city: 'Cape Town', address: '12 Somerset Road, Green Point, Cape Town, 8005', contact_person: 'Pieter de Wet', phone: '+27 21 461 3344', email: 'pieter@capedental.co.za', type: 'Dealer', maps_link: 'https://maps.google.com/?q=Cape+Town' }
  ];
  const insertDealer = db.prepare(
    'INSERT INTO dealers (name, country, state, city, address, contact_person, phone, email, type, maps_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  for (const d of dealersData) {
    insertDealer.run(d.name, d.country, d.state, d.city, d.address, d.contact_person, d.phone, d.email, d.type, d.maps_link);
  }
  console.log(`✓ Seeded ${dealersData.length} dealers.`);

  // ─── 7. Seed Jobs ───
  db.prepare('DELETE FROM job_applications').run();
  db.prepare('DELETE FROM jobs').run();
  const jobsData = [
    {
      id: 1, title: 'Sales Executive', salary: '₹30,000 - ₹50,000 / Month',
      description: {
        paragraphs: [
          'Join FAAZO as a Sales Executive and drive the growth of our advanced dental technology equipment. In this role, you will build and maintain solid relationships with dental professionals, clinics, and regional institutions.',
          'You will be responsible for showcasing our premium products, organizing clinical demonstrations, and meeting regional sales targets while delivering an exceptional service experience.'
        ],
        responsibilities: [
          'Establish and nurture relationships with dental clinics, hospitals, and distributor networks.',
          'Conduct live clinical demonstrations of FAAZO dental handpieces, chairs, and imaging units.',
          'Prepare sales contracts, negotiate partnerships, and achieve monthly business expansion targets.',
          'Collect customer feedback and report market trends to the product engineering team.'
        ],
        requirements: [
          "Bachelor's degree in Business, Marketing, Bio-medical Engineering, or related fields.",
          '2+ years of proven sales experience in dental, medical devices, or healthcare technology industries.',
          'Excellent interpersonal, communication, and negotiation skills.',
          'Willingness to travel extensively across the designated regional territory.'
        ]
      },
      status: 'Open', display_order: 1
    },
    {
      id: 2, title: 'Service Engineer', salary: '₹25,000 - ₹40,000 / Month',
      description: {
        paragraphs: [
          'FAAZO is looking for a dedicated Service Engineer to provide technical support, product installation, and preventative maintenance for our medical and dental chair units.',
          "You will work closely with clinical staff to ensure maximum equipment uptime, troubleshoot hardware/software interfaces, and maintain FAAZO's strict quality standards."
        ],
        responsibilities: [
          'Perform on-site installation, commissioning, and validation of FAAZO dental chairs and compressors.',
          'Diagnose, troubleshoot, and repair equipment malfunctions under tight schedules.',
          'Conduct preventative maintenance visits and provide technical training to clinic assistants and dental engineers.',
          'Maintain accurate service logs, parts inventory, and support ticket documentations.'
        ],
        requirements: [
          "Diploma or Bachelor's degree in Electrical, Mechanical, Electronic, or Biomedical Engineering.",
          '1-3 years of hands-on experience servicing medical dental equipment or precision machinery.',
          'Proficiency in diagnosing electrical circuits, pneumatic systems, and mechanical drives.',
          'Customer-first mindset with strong problem-solving capabilities under pressure.'
        ]
      },
      status: 'Open', display_order: 2
    },
    {
      id: 3, title: 'Marketing Executive', salary: '₹28,000 - ₹45,000 / Month',
      description: {
        paragraphs: [
          "We are looking for a creative Marketing Executive to drive brand awareness and digital presence for FAAZO's modern healthcare products.",
          'You will manage social media channels, coordinate clinical webinars, create graphic/video collateral, and organize exhibitions to engage dental professionals globally.'
        ],
        responsibilities: [
          'Develop and execute B2B marketing campaigns spanning email, search, and social media.',
          'Create premium digital copy, brochures, product reels, and banners aligning with the FAAZO brand style.',
          'Coordinate and host digital webinars, product launch events, and dental exhibition booths.',
          'Track campaign metrics and analyze ROI to optimize lead generation workflows.'
        ],
        requirements: [
          'Degree in Marketing, Communications, Business Administration, or related disciplines.',
          '2+ years of B2B digital marketing or brand management experience (healthcare or medical devices preferred).',
          'Proficiency with design tools (Adobe Creative Suite, Figma, Canva) and video editing software.',
          'Strong copywriter with a deep understanding of B2B lead generation and web analytics.'
        ]
      },
      status: 'Open', display_order: 3
    }
  ];
  const insertJob = db.prepare(
    'INSERT INTO jobs (id, title, salary, posted_date, description, status, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const today = new Date().toISOString().split('T')[0];
  for (const j of jobsData) {
    insertJob.run(j.id, j.title, j.salary, today, JSON.stringify(j.description), j.status, j.display_order);
  }
  console.log(`✓ Seeded ${jobsData.length} careers.`);

  console.log('✓ Database seeding completed successfully!');
}

// Run if called directly
seed();
