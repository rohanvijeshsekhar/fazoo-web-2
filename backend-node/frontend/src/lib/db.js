// Dynamic REST API Client connecting React and Node.js Express backend

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper to convert base64 image/PDF to Blob for file upload
export const base64ToBlob = (base64) => {
  if (!base64 || !base64.startsWith('data:')) return null;
  try {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  } catch (e) {
    console.error("Error parsing base64 string to blob", e);
    return null;
  }
};

// Image utility helper to format URLs correctly
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  
  const mediaBase = import.meta.env.VITE_MEDIA_URL || '';
  const cleanMediaBase = mediaBase.endsWith('/') ? mediaBase.slice(0, -1) : mediaBase;
  
  if (url.startsWith('/media/')) return `${cleanMediaBase}${url}`;
  if (url.startsWith('media/')) return `${cleanMediaBase}/${url}`;
  return url.startsWith('/') ? url : `/${url}`;
};

// Generate auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('fazo_admin_token');
  return token ? { 'Authorization': `Token ${token}` } : {};
};

// Admin Login
export const loginAdmin = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.non_field_errors?.[0] || 'Invalid credentials');
  }
  const data = await res.json();
  localStorage.setItem('fazo_admin_token', data.token);
  localStorage.setItem('fazo_admin_user', JSON.stringify(data));
  return data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('fazo_admin_token');
  localStorage.removeItem('fazo_admin_user');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('fazo_admin_token');
};

// --- Statistics API ---
export const getStats = async () => {
  const res = await fetch(`${API_BASE}/statistics/`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const saveStat = async (stat) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  const url = stat.id ? `${API_BASE}/statistics/${stat.id}/` : `${API_BASE}/statistics/`;
  const method = stat.id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(stat)
  });
  return res.json();
};

export const deleteStat = async (id) => {
  await fetch(`${API_BASE}/statistics/${id}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
};

// --- Testimonials API ---
export const getTestimonials = async () => {
  const res = await fetch(`${API_BASE}/testimonials/`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const saveTestimonial = async (testimonial) => {
  const formData = new FormData();
  formData.append('name', testimonial.name);
  formData.append('designation', testimonial.designation);
  formData.append('company', testimonial.company);
  formData.append('content', testimonial.content);
  formData.append('display_order', testimonial.display_order || 0);
  formData.append('active', testimonial.active !== false);

  if (testimonial.image && testimonial.image.startsWith('data:')) {
    const blob = base64ToBlob(testimonial.image);
    if (blob) {
      formData.append('image', blob, 'testimonial_image.jpg');
    }
  }

  const url = testimonial.id ? `${API_BASE}/testimonials/${testimonial.id}/` : `${API_BASE}/testimonials/`;
  const method = testimonial.id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { ...getAuthHeaders() },
    body: formData
  });
  return res.json();
};

export const deleteTestimonial = async (id) => {
  await fetch(`${API_BASE}/testimonials/${id}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
};

// --- Categories API ---
export const getCategories = async () => {
  const res = await fetch(`${API_BASE}/categories/`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const getCategoryBySlug = async (slug) => {
  const res = await fetch(`${API_BASE}/categories/${slug}/`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) return null;
  return res.json();
};

export const saveCategory = async (category) => {
  const formData = new FormData();
  formData.append('name', category.name);
  formData.append('description', category.description);
  formData.append('overview', category.overview || '');
  formData.append('display_order', category.display_order || 0);
  formData.append('active', category.active !== false);

  if (category.image && category.image.startsWith('data:')) {
    const blob = base64ToBlob(category.image);
    if (blob) {
      formData.append('image', blob, 'category_image.jpg');
    }
  }

  // Brochure PDF upload
  if (category.brochureUrl && category.brochureUrl.startsWith('data:application/pdf')) {
    const blob = base64ToBlob(category.brochureUrl);
    if (blob) {
      formData.append('brochure', blob, 'brochure.pdf');
    }
  } else if (category.hasOwnProperty('brochureUrl') && !category.brochureUrl) {
    formData.append('brochure', '');
  }

  // Use ID for update URL if present, otherwise create
  const url = category.id ? `${API_BASE}/categories/${category.slug}/` : `${API_BASE}/categories/`;
  const method = category.id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { ...getAuthHeaders() },
    body: formData
  });
  return res.json();
};

export const deleteCategory = async (slug) => {
  await fetch(`${API_BASE}/categories/${slug}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
};

// --- Products API ---
export const getProducts = async () => {
  const res = await fetch(`${API_BASE}/products/`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const getProductsByCategory = async (categorySlug) => {
  const res = await fetch(`${API_BASE}/products/?category_slug=${categorySlug}`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const getProductBySlug = async (categorySlug, productSlug) => {
  const res = await fetch(`${API_BASE}/products/${productSlug}/`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) return null;
  return res.json();
};

export const saveProduct = async (product) => {
  const formData = new FormData();
  formData.append('name', product.name);
  formData.append('categorySlug', product.categorySlug || product.category_slug);
  formData.append('short_description', product.shortDescription || product.short_description || '');
  formData.append('description', product.description || '');
  formData.append('display_order', product.display_order || 0);
  formData.append('active', product.active !== false);
  formData.append('seo_title', product.seoTitle || product.seo_title || '');
  formData.append('seo_description', product.seoDescription || product.seo_description || '');

  // Serialize lists as JSON stringified values for the backend
  formData.append('features', JSON.stringify(product.features || []));
  formData.append('specifications', JSON.stringify(product.specifications || []));

  // Hero image upload
  if (product.image && product.image.startsWith('data:')) {
    const blob = base64ToBlob(product.image);
    if (blob) {
      formData.append('image', blob, 'product_hero.jpg');
    }
  }

  // Gallery uploads: Client can send new files
  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach((g) => {
      if (g && g.startsWith('data:')) {
        const blob = base64ToBlob(g);
        if (blob) {
          formData.append('gallery_files', blob, 'gallery_img.jpg');
        }
      }
    });
  }

  const url = product.id ? `${API_BASE}/products/${product.slug}/` : `${API_BASE}/products/`;
  const method = product.id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { ...getAuthHeaders() },
    body: formData
  });
  return res.json();
};

export const deleteProduct = async (slug) => {
  await fetch(`${API_BASE}/products/${slug}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
};

export const deleteProductGalleryImage = async (productSlug, imageId) => {
  const res = await fetch(`${API_BASE}/products/${productSlug}/delete_gallery_image/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ image_id: imageId })
  });
  return res.json();
};

// --- Dealers API ---
export const getDealers = async () => {
  const res = await fetch(`${API_BASE}/dealers/`, {
    headers: { ...getAuthHeaders() }
  });
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.map(d => ({
      ...d,
      mapsLink: d.maps_link || d.mapsLink || '',
      contactPerson: d.contact_person || d.contactPerson || ''
    }));
  }
  return [];
};

export const saveDealer = async (dealer) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  
  const payload = {
    ...dealer,
    maps_link: dealer.mapsLink || dealer.maps_link,
    contact_person: dealer.contactPerson || dealer.contact_person
  };

  const url = dealer.id ? `${API_BASE}/dealers/${dealer.id}/` : `${API_BASE}/dealers/`;
  const method = dealer.id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const deleteDealer = async (id) => {
  await fetch(`${API_BASE}/dealers/${id}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
};

// --- Careers/Jobs API ---
export const getJobs = async () => {
  const res = await fetch(`${API_BASE}/jobs/`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const getJobById = async (id) => {
  const res = await fetch(`${API_BASE}/jobs/${id}/`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const saveJob = async (job) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  };
  const url = job.id ? `${API_BASE}/jobs/${job.id}/` : `${API_BASE}/jobs/`;
  const method = job.id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(job)
  });
  return res.json();
};

export const deleteJob = async (id) => {
  await fetch(`${API_BASE}/jobs/${id}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
};

// --- Job Applications API ---
export const getJobApplications = async () => {
  const res = await fetch(`${API_BASE}/applications/`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const saveJobApplication = async (app) => {
  const formData = new FormData();
  formData.append('full_name', app.applicantName);
  formData.append('email', app.email);
  formData.append('phone', app.phone);
  formData.append('location', app.location);
  formData.append('cover_letter', app.coverLetter || '');
  formData.append('jobId', app.jobId);

  // Resume upload parsing
  if (app.resumeData && app.resumeData.startsWith('data:')) {
    const blob = base64ToBlob(app.resumeData);
    if (blob) {
      formData.append('resume', blob, app.resumeName || 'resume.pdf');
    }
  }

  const url = app.id ? `${API_BASE}/applications/${app.id}/` : `${API_BASE}/applications/`;
  const method = app.id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { ...getAuthHeaders() },
    body: formData
  });
  return res.json();
};

export const updateApplicationStatus = async (id, statusVal) => {
  const res = await fetch(`${API_BASE}/applications/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ status: statusVal })
  });
  return res.json();
};

export const deleteJobApplication = async (id) => {
  await fetch(`${API_BASE}/applications/${id}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
};

// --- Contact Form/Enquiries API ---
export const getContactEnquiries = async () => {
  const res = await fetch(`${API_BASE}/enquiries/`, {
    headers: { ...getAuthHeaders() }
  });
  return res.json();
};

export const saveContactEnquiry = async (enq) => {
  const res = await fetch(`${API_BASE}/enquiries/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enq)
  });
  return res.json();
};

export const markEnquiryContacted = async (id, contacted = true) => {
  const res = await fetch(`${API_BASE}/enquiries/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ contacted })
  });
  return res.json();
};

export const deleteContactEnquiry = async (id) => {
  await fetch(`${API_BASE}/enquiries/${id}/`, {
    method: 'DELETE',
    headers: { ...getAuthHeaders() }
  });
};

// --- Dashboard Stats API ---
export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/dashboard/`, {
    headers: { ...getAuthHeaders() }
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
};

// Re-export map mapping country to states
export const COUNTRY_STATES_MAP = {
  "India": ["Kerala", "Karnataka", "Maharashtra", "Tamil Nadu", "Delhi", "Telangana", "Andhra Pradesh", "Gujarat", "West Bengal"],
  "UAE": ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"],
  "Saudi Arabia": ["Riyadh", "Makkah", "Madinah", "Eastern Province", "Asir", "Tabuk"],
  "Oman": ["Muscat", "Dhofar", "Ad Dakhiliyah", "Al Batinah", "Ash Sharqiyah"],
  "Qatar": ["Doha", "Al Rayyan", "Al Wakrah", "Al Khor", "Ash Shamal"],
  "Kenya": ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  "Tanzania": ["Dar es Salaam", "Arusha", "Mwanza", "Zanzibar", "Dodoma"],
  "South Africa": ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State"],
  "Others": ["All Regions"]
};

// Canvas Image Compressor
export const compressImageFile = (file, maxWidth = 800, maxHeight = 600) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    
    // Check if it's a PDF brochure
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7)); // compress to jpeg, 70% quality
      };
      img.onerror = (err) => reject(err);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
