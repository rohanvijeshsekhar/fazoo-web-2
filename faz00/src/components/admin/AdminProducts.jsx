import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { getCategories, getProducts, saveProduct, deleteProduct, deleteProductGalleryImage, compressImageFile, getImageUrl } from '../../lib/db';
import { AdminModal, ConfirmDialog } from './AdminModal';
import { useToast } from './AdminToast';

const emptyProduct = {
  id: '', name: '', slug: '', categorySlug: '', shortDescription: '', description: '',
  features: [''], specifications: [{ key: '', value: '' }], image: '', gallery: [],
  seoTitle: '', seoDescription: '', display_order: 0, active: true
};

export const AdminProducts = () => {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ ...emptyProduct });

  const refresh = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(Array.isArray(cats) ? cats : []);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, []);

  const openCreate = () => {
    setForm({
      ...emptyProduct,
      categorySlug: categories[0]?.slug || '',
      display_order: products.length + 1
    });
    setFormOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      categorySlug: p.category_slug || p.categorySlug || '',
      shortDescription: p.short_description || p.shortDescription || '',
      seoTitle: p.seo_title || p.seoTitle || '',
      seoDescription: p.seo_description || p.seoDescription || '',
      image: p.image ? getImageUrl(p.image) : '',
      features: Array.isArray(p.features) && p.features.length > 0 ? p.features : [''],
      specifications: Array.isArray(p.specifications) && p.specifications.length > 0 ? p.specifications : [{ key: '', value: '' }],
      gallery: Array.isArray(p.gallery_images) ? p.gallery_images.map(gi => ({ id: gi.id, url: getImageUrl(gi.image) })) : [],
    });
    setFormOpen(true);
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await compressImageFile(file, 800, 600);
      setForm(p => ({ ...p, image: base64 }));
    } catch { toast.error('Error processing image'); }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const bases = await Promise.all(files.map(f => compressImageFile(f, 800, 600)));
      setForm(p => ({
        ...p,
        gallery: [...(p.gallery || []), ...bases.map(b => ({ id: null, url: b, isNew: true }))]
      }));
    } catch { toast.error('Error processing gallery images'); }
  };

  const removeGalleryImage = async (idx) => {
    const img = form.gallery[idx];
    if (img.id && form.id) {
      // Existing gallery image — delete from server
      try {
        await deleteProductGalleryImage(form.slug, img.id);
        toast.success('Gallery image removed');
      } catch { toast.error('Failed to remove gallery image'); return; }
    }
    setForm(p => ({ ...p, gallery: p.gallery.filter((_, i) => i !== idx) }));
  };



  // Feature list helpers
  const addFeature = () => setForm(p => ({ ...p, features: [...p.features, ''] }));
  const removeFeature = (i) => setForm(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));
  const updateFeature = (i, val) => setForm(p => ({ ...p, features: p.features.map((f, idx) => idx === i ? val : f) }));

  // Spec list helpers
  const addSpec = () => setForm(p => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const removeSpec = (i) => setForm(p => ({ ...p, specifications: p.specifications.filter((_, idx) => idx !== i) }));
  const updateSpec = (i, field, val) => setForm(p => ({
    ...p,
    specifications: p.specifications.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categorySlug) return;
    setSaving(true);
    try {
      // Prepare gallery — only send new base64 images
      const newGalleryImages = (form.gallery || []).filter(g => g.isNew).map(g => g.url);
      
      await saveProduct({
        ...form,
        gallery: newGalleryImages,
        features: form.features.filter(f => f.trim()),
        specifications: form.specifications.filter(s => s.key.trim()),
      });
      toast.success(form.id ? 'Product updated!' : 'Product created!');
      setFormOpen(false);
      refresh();
    } catch { toast.error('Failed to save product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await deleteProduct(deleteTarget);
      toast.success('Product deleted');
      setDeleteTarget(null);
      refresh();
    } catch { toast.error('Failed to delete'); }
    finally { setSaving(false); }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = filterCat === 'All' || (p.category_slug || p.categorySlug) === filterCat;
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryName = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat ? cat.name : slug;
  };

  if (loading) return <div className="admin-spinner" />;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage your product catalog — images, features, and specifications</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreate} disabled={categories.length === 0}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {categories.length === 0 && (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-body" style={{ background: 'var(--admin-warning-bg)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--admin-warning)' }}>
            ⚠️ You need to create at least one category before adding products.
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="admin-filter-bar">
        <input
          className="admin-form-input"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <select className="admin-form-select" value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ minWidth: 160 }}>
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--admin-text-muted)', marginLeft: 'auto' }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <p className="admin-empty-title">No products found</p>
            <p className="admin-empty-text">{searchQuery || filterCat !== 'All' ? 'Try changing your filters.' : 'Add your first product to the catalog.'}</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.image ? (
                          <img src={getImageUrl(p.image)} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--admin-border)' }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>
                            <ImageIcon size={18} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--admin-text-muted)' }}>/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="admin-badge admin-badge-info">{getCategoryName(p.category_slug || p.categorySlug)}</span></td>
                    <td>
                      <span className={`admin-badge ${p.active ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{p.display_order}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => openEdit(p)}><Edit size={14} /></button>
                      <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDeleteTarget(p.slug)} style={{ color: 'var(--admin-danger)' }}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      <AdminModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.id ? 'Edit Product' : 'New Product'}
        size="lg"
        footer={
          <>
            <button className="admin-btn admin-btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button>
            <button className="admin-btn admin-btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving...' : form.id ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Product Name <span className="required">*</span></label>
              <input className="admin-form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Product name" required />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Category <span className="required">*</span></label>
              <select className="admin-form-select" value={form.categorySlug} onChange={e => setForm(p => ({ ...p, categorySlug: e.target.value }))} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Short Description</label>
            <input className="admin-form-input" value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} placeholder="Brief summary..." />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Full Description</label>
            <textarea className="admin-form-textarea" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Detailed product description..." rows={4} />
          </div>

          {/* Hero Image */}
          <div className="admin-form-group">
            <label className="admin-form-label">Hero Image</label>
            {form.image ? (
              <div className="admin-upload-preview">
                <img src={form.image} alt="Preview" />
                <button type="button" className="remove-btn" onClick={() => setForm(p => ({ ...p, image: '' }))}>×</button>
              </div>
            ) : (
              <label className="admin-upload-area" style={{ display: 'block' }}>
                <Upload />
                <p>Click to upload hero image</p>
                <p className="upload-hint">Recommended: 800×600</p>
                <input type="file" accept="image/*" onChange={handleHeroImageUpload} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Gallery */}
          <div className="admin-form-group">
            <label className="admin-form-label">Gallery Images</label>
            <div className="admin-gallery-grid">
              {(form.gallery || []).map((img, i) => (
                <div key={i} className="admin-gallery-item">
                  <img src={img.url || img} alt="" />
                  <button type="button" className="remove-btn" onClick={() => removeGalleryImage(i)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="admin-upload-area" style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
                <Plus size={20} />
                <span style={{ fontSize: 11, marginTop: 4 }}>Add</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Features */}
          <div className="admin-form-group">
            <label className="admin-form-label">Features</label>
            {form.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="admin-form-input" value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                {form.features.length > 1 && (
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => removeFeature(i)} style={{ color: 'var(--admin-danger)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addFeature}>
              <Plus size={14} /> Add Feature
            </button>
          </div>

          {/* Specifications */}
          <div className="admin-form-group">
            <label className="admin-form-label">Specifications</label>
            {form.specifications.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input className="admin-form-input" value={s.key} onChange={e => updateSpec(i, 'key', e.target.value)} placeholder="Specification name" style={{ flex: 1 }} />
                <input className="admin-form-input" value={s.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="Value" style={{ flex: 1 }} />
                {form.specifications.length > 1 && (
                  <button type="button" className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => removeSpec(i)} style={{ color: 'var(--admin-danger)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={addSpec}>
              <Plus size={14} /> Add Specification
            </button>
          </div>



          {/* SEO */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">SEO Title</label>
              <input className="admin-form-input" value={form.seoTitle} onChange={e => setForm(p => ({ ...p, seoTitle: e.target.value }))} placeholder="SEO page title" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">SEO Description</label>
              <input className="admin-form-input" value={form.seoDescription} onChange={e => setForm(p => ({ ...p, seoDescription: e.target.value }))} placeholder="SEO meta description" />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Display Order</label>
              <input type="number" className="admin-form-input" value={form.display_order} onChange={e => setForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              <label className="admin-form-checkbox">
                <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
                Active (visible on website)
              </label>
            </div>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="This product and all its gallery images will be permanently deleted."
        loading={saving}
      />
    </div>
  );
};
