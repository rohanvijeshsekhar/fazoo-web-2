import { useState, useEffect } from 'react';
import { 
  getStats, saveStat, deleteStat,
  getTestimonials, saveTestimonial, deleteTestimonial,
  getCategories, saveCategory, deleteCategory, 
  getProducts, saveProduct, deleteProduct, deleteProductGalleryImage,
  getDealers, saveDealer, deleteDealer,
  getJobs, saveJob, deleteJob,
  getJobApplications, updateApplicationStatus, deleteJobApplication,
  getContactEnquiries, markEnquiryContacted, deleteContactEnquiry,
  getDashboardStats, loginAdmin, logoutAdmin, isLoggedIn,
  COUNTRY_STATES_MAP, compressImageFile, getImageUrl 
} from '../lib/db';
import { 
  Plus, Edit, Trash2, Tag, ShoppingBag, 
  ArrowLeft, ArrowRight, Upload, FileText, Image as ImageIcon,
  CheckCircle, PlusCircle, MinusCircle, AlertCircle,
  Globe, MapPin, Activity, Briefcase, Users,
  MessageSquare, Clock, Lock, LogOut, ExternalLink,
  FileDown, Search, Filter, CheckSquare, Sparkles, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminPanel = () => {
  const [authorized, setAuthorized] = useState(isLoggedIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Nav tab state
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'stats', 'testimonials', 'categories', 'products', 'dealers', 'careers', 'applications', 'enquiries'
  
  // Model lists
  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  // Loading indicator states
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);

  // Modals / Form States
  const [isStatFormOpen, setIsStatFormOpen] = useState(false);
  const [statForm, setStatForm] = useState({ id: '', label: '', value: '', icon: 'ShieldCheck', display_order: 0, active: true });

  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ id: '', name: '', designation: '', company: '', content: '', image: '', display_order: 0, active: true });

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: '', name: '', slug: '', description: '', overview: '', image: '', display_order: 0, active: true });
  
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    id: '', name: '', slug: '', categorySlug: '', shortDescription: '', description: '',
    features: [''], specifications: [{ key: '', value: '' }], image: '', gallery: [], brochureUrl: '', seoTitle: '', seoDescription: '', display_order: 0, active: true
  });

  const [isDealerFormOpen, setIsDealerFormOpen] = useState(false);
  const [dealerForm, setDealerForm] = useState({
    id: '', name: '', country: 'India', state: '', city: '', address: '', contactPerson: '', phone: '', email: '', type: 'Dealer', mapsLink: '', active: true
  });

  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [jobForm, setJobForm] = useState({
    id: '', title: '', salary: '', status: 'Open', display_order: 0,
    description: { paragraphs: [''], responsibilities: [''], requirements: [''] }
  });

  const [selectedApplication, setSelectedApplication] = useState(null);

  // Search & Filter state for Applications & Enquiries
  const [appSearchQuery, setAppSearchQuery] = useState('');
  const [appJobFilter, setAppJobFilter] = useState('All');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  useEffect(() => {
    if (authorized) {
      refreshData();
    }
  }, [authorized, activeTab]);

  const refreshData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const dData = await getDashboardStats();
        setDashboardData(dData);
      } else if (activeTab === 'stats') {
        const data = await getStats();
        setStats(Array.isArray(data) ? data : []);
      } else if (activeTab === 'testimonials') {
        const data = await getTestimonials();
        setTestimonials(Array.isArray(data) ? data : []);
      } else if (activeTab === 'categories') {
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } else if (activeTab === 'products') {
        // We need both categories (for dropdown choices) and products
        const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods) ? prods : []);
      } else if (activeTab === 'dealers') {
        const data = await getDealers();
        setDealers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'careers') {
        const data = await getJobs();
        setJobs(Array.isArray(data) ? data : []);
      } else if (activeTab === 'applications') {
        const [apps, jbs] = await Promise.all([getJobApplications(), getJobs()]);
        setApplications(Array.isArray(apps) ? apps : []);
        setJobs(Array.isArray(jbs) ? jbs : []);
      } else if (activeTab === 'enquiries') {
        const data = await getContactEnquiries();
        setEnquiries(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
      const errMsg = e && typeof e.message === 'string' ? e.message : '';
      if (errMsg.includes('401') || errMsg.includes('credentials') || errMsg.includes('authenticated')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await loginAdmin(username, password);
      setAuthorized(true);
      setActiveTab('dashboard');
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setAuthorized(false);
    setUsername('');
    setPassword('');
  };

  // --- STATS HANDLERS ---
  const handleCreateStat = () => {
    setStatForm({ id: '', label: '', value: '', icon: 'ShieldCheck', display_order: stats.length + 1, active: true });
    setIsStatFormOpen(true);
  };

  const handleEditStat = (stat) => {
    setStatForm({ ...stat });
    setIsStatFormOpen(true);
  };

  const handleStatSubmit = async (e) => {
    e.preventDefault();
    if (!statForm.label || !statForm.value) return;
    setLoading(true);
    try {
      await saveStat(statForm);
      setIsStatFormOpen(false);
      refreshData();
    } catch (err) {
      alert("Error saving statistic.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStatClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this statistic?")) {
      setLoading(true);
      try {
        await deleteStat(id);
        refreshData();
      } catch (err) {
        alert("Failed to delete record.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- TESTIMONIALS HANDLERS ---
  const handleCreateTestimonial = () => {
    setTestimonialForm({ id: '', name: '', designation: '', company: '', content: '', image: '', display_order: testimonials.length + 1, active: true });
    setIsTestimonialFormOpen(true);
  };

  const handleEditTestimonial = (t) => {
    setTestimonialForm({ ...t, image: t.image ? getImageUrl(t.image) : '' });
    setIsTestimonialFormOpen(true);
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.content) return;
    setLoading(true);
    try {
      await saveTestimonial(testimonialForm);
      setIsTestimonialFormOpen(false);
      refreshData();
    } catch (err) {
      alert("Error saving testimonial.");
    } finally {
      setLoading(false);
    }
  };

  const handleTestimonialImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingFile(true);
    try {
      const base64 = await compressImageFile(file, 200, 200);
      setTestimonialForm(prev => ({ ...prev, image: base64 }));
    } catch (err) {
      alert("Error processing image file.");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleDeleteTestimonialClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      setLoading(true);
      try {
        await deleteTestimonial(id);
        refreshData();
      } catch (err) {
        alert("Failed to delete testimonial.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- CATEGORIES HANDLERS ---
  const handleCreateCategory = () => {
    setCategoryForm({ id: '', name: '', slug: '', description: '', overview: '', image: '', display_order: categories.length + 1, active: true });
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (cat) => {
    setCategoryForm({ ...cat, image: cat.image ? getImageUrl(cat.image) : '' });
    setIsCategoryFormOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.description) return;
    setLoading(true);
    try {
      await saveCategory(categoryForm);
      setIsCategoryFormOpen(false);
      refreshData();
    } catch (err) {
      alert("Error saving category.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingFile(true);
    try {
      const base64 = await compressImageFile(file, 800, 600);
      setCategoryForm(prev => ({ ...prev, image: base64 }));
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleDeleteCategoryClick = async (slug) => {
    if (window.confirm("Are you sure you want to delete this category? All sub-products inside this category will also be deleted from the database!")) {
      setLoading(true);
      try {
        await deleteCategory(slug);
        refreshData();
      } catch (err) {
        alert("Failed to delete category.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- PRODUCTS HANDLERS ---
  const handleCreateProduct = () => {
    const defaultCat = categories.length > 0 ? categories[0].slug : '';
    setProductForm({
      id: '', name: '', slug: '', categorySlug: defaultCat, shortDescription: '', description: '',
      features: [''], specifications: [{ key: '', value: '' }], image: '', gallery: [], brochureUrl: '', seoTitle: '', seoDescription: '', display_order: products.length + 1, active: true
    });
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (prod) => {
    setProductForm({
      ...prod,
      categorySlug: prod.category_slug || prod.categorySlug,
      features: prod.features && prod.features.length > 0 ? [...prod.features] : [''],
      specifications: prod.specifications && prod.specifications.length > 0 ? [...prod.specifications] : [{ key: '', value: '' }],
      image: prod.image ? getImageUrl(prod.image) : '',
      brochureUrl: prod.brochure ? getImageUrl(prod.brochure) : '',
      gallery: [] // Fresh new gallery uploads
    });
    setIsProductFormOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.categorySlug) return;
    setLoading(true);

    const cleanedFeatures = productForm.features.filter(Boolean);
    const cleanedSpecs = productForm.specifications.filter(s => s.key && s.value);

    try {
      await saveProduct({
        ...productForm,
        features: cleanedFeatures,
        specifications: cleanedSpecs
      });
      setIsProductFormOpen(false);
      refreshData();
    } catch (err) {
      alert("Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoadingFile(true);
    try {
      const base64 = await compressImageFile(file, 800, 600);
      setProductForm(prev => ({ ...prev, image: base64 }));
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleProductGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setLoadingFile(true);
    try {
      const promises = files.map(file => compressImageFile(file, 800, 600));
      const base64List = await Promise.all(promises);
      setProductForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...base64List] }));
    } catch (err) {
      alert("Error uploading gallery images");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleBrochureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF brochure");
      return;
    }
    setLoadingFile(true);
    try {
      const base64 = await compressImageFile(file);
      setProductForm(prev => ({ ...prev, brochureUrl: base64 }));
    } catch (err) {
      alert("Error uploading PDF brochure");
    } finally {
      setLoadingFile(false);
    }
  };

  const handleDeleteGalleryImg = async (imageId) => {
    if (window.confirm("Delete this gallery image permanently?")) {
      setLoading(true);
      try {
        await deleteProductGalleryImage(productForm.slug, imageId);
        // Remove from UI list immediately
        setProductForm(prev => ({
          ...prev,
          gallery_images: prev.gallery_images.filter(img => img.id !== imageId)
        }));
      } catch (err) {
        alert("Failed to delete gallery image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteProductClick = async (slug) => {
    if (window.confirm("Are you sure you want to delete this sub-product?")) {
      setLoading(true);
      try {
        await deleteProduct(slug);
        refreshData();
      } catch (err) {
        alert("Failed to delete product.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Dynamic Array Handlers (Features)
  const handleAddFeature = () => {
    setProductForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const handleRemoveFeature = (idx) => {
    setProductForm(prev => {
      const copy = [...prev.features];
      copy.splice(idx, 1);
      return { ...prev, features: copy.length === 0 ? [''] : copy };
    });
  };

  const handleFeatureChange = (val, idx) => {
    setProductForm(prev => {
      const copy = [...prev.features];
      copy[idx] = val;
      return { ...prev, features: copy };
    });
  };

  // Dynamic Array Handlers (Specifications)
  const handleAddSpec = () => {
    setProductForm(prev => ({ ...prev, specifications: [...prev.specifications, { key: '', value: '' }] }));
  };

  const handleRemoveSpec = (idx) => {
    setProductForm(prev => {
      const copy = [...prev.specifications];
      copy.splice(idx, 1);
      return { ...prev, specifications: copy.length === 0 ? [{ key: '', value: '' }] : copy };
    });
  };

  const handleSpecChange = (field, val, idx) => {
    setProductForm(prev => {
      const copy = [...prev.specifications];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, specifications: copy };
    });
  };

  // --- DEALER HANDLERS ---
  const handleCreateDealer = () => {
    setDealerForm({
      id: '', name: '', country: 'India', state: '', city: '', address: '', contactPerson: '', phone: '', email: '', type: 'Dealer', mapsLink: '', active: true
    });
    setIsDealerFormOpen(true);
  };

  const handleEditDealer = (dealer) => {
    setDealerForm({ ...dealer });
    setIsDealerFormOpen(true);
  };

  const handleDealerSubmit = async (e) => {
    e.preventDefault();
    if (!dealerForm.name || !dealerForm.country || !dealerForm.state || !dealerForm.city) return;
    setLoading(true);
    try {
      await saveDealer(dealerForm);
      setIsDealerFormOpen(false);
      refreshData();
    } catch (err) {
      alert("Error saving dealer listing.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDealerClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this dealer/distributor listing?")) {
      setLoading(true);
      try {
        await deleteDealer(id);
        refreshData();
      } catch (err) {
        alert("Failed to delete record.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- CAREERS HANDLERS ---
  const handleCreateJob = () => {
    setJobForm({
      id: '', title: '', salary: '', status: 'Open', display_order: jobs.length + 1,
      description: { paragraphs: [''], responsibilities: [''], requirements: [''] }
    });
    setIsJobFormOpen(true);
  };

  const handleEditJob = (job) => {
    setJobForm({
      ...job,
      description: {
        paragraphs: job.description?.paragraphs?.length > 0 ? [...job.description.paragraphs] : [''],
        responsibilities: job.description?.responsibilities?.length > 0 ? [...job.description.responsibilities] : [''],
        requirements: job.description?.requirements?.length > 0 ? [...job.description.requirements] : ['']
      }
    });
    setIsJobFormOpen(true);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.salary) return;
    setLoading(true);
    try {
      await saveJob(jobForm);
      setIsJobFormOpen(false);
      refreshData();
    } catch (err) {
      alert("Error saving career job post.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJobClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this career post? All related applications will also be deleted.")) {
      setLoading(true);
      try {
        await deleteJob(id);
        refreshData();
      } catch (err) {
        alert("Failed to delete record.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleJobArrayChange = (section, idx, value) => {
    setJobForm(prev => {
      const copy = { ...prev.description };
      copy[section][idx] = value;
      return { ...prev, description: copy };
    });
  };

  const handleAddJobArrayItem = (section) => {
    setJobForm(prev => {
      const copy = { ...prev.description };
      copy[section] = [...copy[section], ''];
      return { ...prev, description: copy };
    });
  };

  const handleRemoveJobArrayItem = (section, idx) => {
    setJobForm(prev => {
      const copy = { ...prev.description };
      copy[section].splice(idx, 1);
      if (copy[section].length === 0) copy[section] = [''];
      return { ...prev, description: copy };
    });
  };

  // --- JOB APPLICATIONS HANDLERS ---
  const handleUpdateAppStatus = async (id, statusVal) => {
    setLoading(true);
    try {
      await updateApplicationStatus(id, statusVal);
      if (selectedApplication) {
        setSelectedApplication(prev => ({ ...prev, status: statusVal }));
      }
      refreshData();
    } catch (err) {
      alert("Error updating application status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplicationClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this job application permanently?")) {
      setLoading(true);
      try {
        await deleteJobApplication(id);
        setSelectedApplication(null);
        refreshData();
      } catch (err) {
        alert("Failed to delete record.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter job applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(appSearchQuery.toLowerCase()) || 
                          app.email.toLowerCase().includes(appSearchQuery.toLowerCase()) || 
                          app.phone.includes(appSearchQuery);
    const matchesJob = appJobFilter === 'All' || String(app.job) === String(appJobFilter);
    const matchesStatus = appStatusFilter === 'All' || app.status === appStatusFilter;
    return matchesSearch && matchesJob && matchesStatus;
  });

  // --- ENQUIRIES HANDLERS ---
  const handleMarkContacted = async (id, contacted) => {
    setLoading(true);
    try {
      await markEnquiryContacted(id, contacted);
      refreshData();
    } catch (err) {
      alert("Failed to update contacted status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnquiryClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry record?")) {
      setLoading(true);
      try {
        await deleteContactEnquiry(id);
        refreshData();
      } catch (err) {
        alert("Failed to delete record.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- RENDER LOGIN VIEW ---
  if (!authorized) {
    return (
      <div className="w-full flex-grow flex items-center justify-center pt-8 pb-24 px-4 bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4] min-h-[80vh]">
        {/* Soft Background Globs */}
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-fazo-cyan/15 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-fazo-teal/15 blur-[100px] pointer-events-none z-0"></div>

        <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/50 p-8 shadow-[0_20px_50px_rgba(0,108,118,0.08)] relative z-10 text-left">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#004d54] to-fazo-teal rounded-2xl flex items-center justify-center text-white mx-auto shadow-md mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-jakarta font-extrabold text-2xl text-fazo-navy tracking-tight">FAZO System Login</h1>
            <p className="font-sans text-xs text-fazo-gray mt-1">Authenticate to access the administrator control panel.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block font-jakarta font-bold text-xs text-fazo-navy mb-2">USERNAME</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-4 py-3 rounded-xl border border-fazo-border bg-white focus:outline-none focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86] text-xs font-semibold text-fazo-navy"
                required
              />
            </div>

            <div>
              <label className="block font-jakarta font-bold text-xs text-fazo-navy mb-2">PASSWORD</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-fazo-border bg-white focus:outline-none focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86] text-xs font-semibold text-fazo-navy"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-500 text-xs font-semibold">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-[#004d54] to-fazo-teal text-white py-3.5 rounded-xl font-jakarta font-bold text-xs transition duration-300 hover:shadow-[0_10px_20px_rgba(0,111,122,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN ADMIN DASHBOARD LAYOUT ---
  return (
    <div className="w-full flex-grow pb-24 relative bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4]">
      {/* Background Soft Blobs */}
      <div className="absolute top-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-fazo-cyan/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-fazo-teal/10 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-[1350px] mx-auto px-6 lg:px-10 pt-10 relative z-10 text-left">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-fazo-border/70 pb-6 mb-8 gap-4">
          <div>
            <h1 className="font-jakarta font-extrabold text-3xl text-fazo-navy tracking-tight flex items-center gap-3">
              Administrative Control Panel
            </h1>
            <p className="font-sans text-xs sm:text-sm text-fazo-gray mt-1">
              Add, edit, or remove catalog product lines dynamically without modifying static code.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-xs font-bold text-[#0A7C86] hover:underline bg-[#E6F3F5] px-4 py-2.5 rounded-lg border border-[#0A7C86]/20">
              <ArrowLeft className="w-4.5 h-4.5" /> Exit to Homepage
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50/70 hover:bg-red-50 px-4 py-2.5 rounded-lg border border-red-100 transition"
            >
              <LogOut className="w-4.5 h-4.5" /> Logout
            </button>
          </div>
        </div>

        {/* Dynamic Nav tabs */}
        <div className="flex flex-wrap border-b border-fazo-border/60 mb-8 w-full gap-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'stats', label: 'Stats', icon: Star },
            { id: 'testimonials', label: 'Testimonials', icon: Users },
            { id: 'categories', label: 'Categories', icon: Tag },
            { id: 'products', label: 'Products', icon: ShoppingBag },
            { id: 'dealers', label: 'Dealers', icon: Globe },
            { id: 'careers', label: 'Careers', icon: Briefcase },
            { id: 'applications', label: 'Applications', icon: FileText },
            { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsStatFormOpen(false);
                  setIsTestimonialFormOpen(false);
                  setIsCategoryFormOpen(false);
                  setIsProductFormOpen(false);
                  setIsDealerFormOpen(false);
                  setIsJobFormOpen(false);
                  setSelectedApplication(null);
                }}
                className={`py-3 px-4.5 text-center font-jakarta font-bold text-xs border-b-2 flex items-center justify-center gap-2 transition ${
                  activeTab === tab.id 
                    ? 'border-[#0A7C86] text-[#0A7C86] bg-white/20 rounded-t-lg' 
                    : 'border-transparent text-fazo-gray hover:text-fazo-navy'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="w-full py-16 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0A7C86]"></div>
          </div>
        )}

        {/* --- 1. DASHBOARD VIEW --- */}
        {activeTab === 'dashboard' && !loading && dashboardData && (
          <div className="space-y-8 animate-fadeIn">
            {/* Counts Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-5">
              {[
                { label: 'Total Products', count: dashboardData.counts.products, color: 'text-blue-600 bg-blue-50 border-blue-100', icon: ShoppingBag },
                { label: 'Total Dealers', count: dashboardData.counts.dealers, color: 'text-teal-600 bg-teal-50 border-teal-100', icon: Globe },
                { label: 'Careers Open', count: dashboardData.counts.careers, color: 'text-purple-600 bg-purple-50 border-purple-100', icon: Briefcase },
                { label: 'Applications', count: dashboardData.counts.applications, color: 'text-orange-600 bg-orange-50 border-orange-100', icon: FileText },
                { label: 'Testimonials', count: dashboardData.counts.testimonials, color: 'text-pink-600 bg-pink-50 border-pink-100', icon: Star },
                { label: 'Enquiries', count: dashboardData.counts.enquiries, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: MessageSquare },
              ].map((w, idx) => {
                const Icon = w.icon;
                return (
                  <div key={idx} className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-5 flex flex-col items-start shadow-sm hover:shadow-md transition">
                    <div className={`p-3 rounded-xl border ${w.color} mb-3`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-sans text-[11px] font-bold text-fazo-gray uppercase tracking-wider">{w.label}</span>
                    <span className="font-jakarta font-extrabold text-2xl text-fazo-navy mt-1">{w.count}</span>
                  </div>
                );
              })}
            </div>

            {/* Dashboard Activity Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Side: Recent Applications */}
              <div className="lg:col-span-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-jakarta font-bold text-base text-fazo-navy mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-fazo-teal" /> Latest Job Applications
                  </h3>
                  <div className="space-y-3">
                    {(!dashboardData.recent_applications || dashboardData.recent_applications.length === 0) ? (
                      <p className="text-xs text-fazo-gray py-4">No job applications submitted yet.</p>
                    ) : (
                      (dashboardData.recent_applications || []).map(app => (
                        <div key={app.id} className="p-3 bg-white/40 border border-fazo-border/30 rounded-xl flex items-center justify-between hover:bg-white/60 transition">
                          <div>
                            <h4 className="font-jakarta font-bold text-xs text-fazo-navy">{app.full_name}</h4>
                            <span className="font-sans text-[10px] text-fazo-gray">Applied for: <span className="font-bold text-[#0A7C86]">{app.job_title}</span> • {app.applied_date}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            app.status === 'Hired' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-500 border border-red-100' :
                            app.status === 'Shortlisted' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('applications')}
                  className="mt-5 w-full py-2.5 bg-[#E6F3F5] border border-[#0A7C86]/20 text-[#0A7C86] rounded-xl font-jakarta font-bold text-xs hover:bg-[#0A7C86] hover:text-white transition duration-300 flex items-center justify-center gap-1.5"
                >
                  View All Applications <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right Side: Recent Enquiries */}
              <div className="lg:col-span-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-jakarta font-bold text-base text-fazo-navy mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-fazo-teal" /> Recent Contact Enquiries
                  </h3>
                  <div className="space-y-3">
                    {(!dashboardData.recent_enquiries || dashboardData.recent_enquiries.length === 0) ? (
                      <p className="text-xs text-fazo-gray py-4">No enquiries received yet.</p>
                    ) : (
                      (dashboardData.recent_enquiries || []).map(enq => (
                        <div key={enq.id} className="p-3 bg-white/40 border border-fazo-border/30 rounded-xl flex items-center justify-between hover:bg-white/60 transition">
                          <div className="max-w-[75%]">
                            <h4 className="font-jakarta font-bold text-xs text-fazo-navy">{enq.name} <span className="font-medium text-[10px] text-fazo-gray">({enq.email})</span></h4>
                            <p className="font-sans text-[11px] text-fazo-gray truncate mt-0.5">Subject: {enq.subject}</p>
                          </div>
                          {enq.contacted ? (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                              <CheckCircle className="w-3 h-3" /> Contacted
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3 animate-pulse" /> New
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('enquiries')}
                  className="mt-5 w-full py-2.5 bg-[#E6F3F5] border border-[#0A7C86]/20 text-[#0A7C86] rounded-xl font-jakarta font-bold text-xs hover:bg-[#0A7C86] hover:text-white transition duration-300 flex items-center justify-center gap-1.5"
                >
                  View All Enquiries <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. STATS TAB VIEW --- */}
        {activeTab === 'stats' && !loading && (
          <div className="animate-fadeIn">
            {isStatFormOpen ? (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 p-6 max-w-xl shadow-sm">
                <h3 className="font-jakarta font-bold text-base text-fazo-navy border-b border-fazo-border/60 pb-3 mb-5">
                  {statForm.id ? 'Edit Statistic' : 'Add New Statistic'}
                </h3>
                <form onSubmit={handleStatSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">LABEL</label>
                      <input 
                        type="text" 
                        value={statForm.label}
                        onChange={e => setStatForm(p => ({ ...p, label: e.target.value }))}
                        placeholder="e.g. Years of Experience"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">VALUE</label>
                      <input 
                        type="text" 
                        value={statForm.value}
                        onChange={e => setStatForm(p => ({ ...p, value: e.target.value }))}
                        placeholder="e.g. 10+"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">ICON TYPE</label>
                      <select 
                        value={statForm.icon}
                        onChange={e => setStatForm(p => ({ ...p, icon: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                      >
                        <option value="ShieldCheck">ShieldCheck (Security/Quality)</option>
                        <option value="Activity">Activity (Diagnostics/Clinics)</option>
                        <option value="Package">Package (Products)</option>
                        <option value="Globe">Globe (Presence/Countries)</option>
                        <option value="Users">Users (Partners/Customers)</option>
                        <option value="Award">Award (Experience/Honor)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">DISPLAY ORDER</label>
                      <input 
                        type="number" 
                        value={statForm.display_order}
                        onChange={e => setStatForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input 
                      type="checkbox" 
                      id="statActive"
                      checked={statForm.active}
                      onChange={e => setStatForm(p => ({ ...p, active: e.target.checked }))}
                      className="rounded text-[#0A7C86]"
                    />
                    <label htmlFor="statActive" className="font-jakarta font-bold text-[11px] text-fazo-navy cursor-pointer">Active / Display on Home Page</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="btn-3d-teal text-white px-5 py-2.5 rounded-lg text-xs font-bold">Save Statistic</button>
                    <button type="button" onClick={() => setIsStatFormOpen(false)} className="px-5 py-2.5 bg-fazo-border/40 border border-fazo-border/60 hover:bg-fazo-border/60 rounded-lg text-xs font-bold text-fazo-navy">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-6">
                  <button onClick={handleCreateStat} className="btn-3d-teal text-white px-5 py-3 rounded-lg font-jakarta font-bold text-xs flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5" /> Add New Statistic
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {stats.map(stat => (
                    <div key={stat.id} className="bg-white/60 backdrop-blur-md rounded-xl border border-white/50 p-5 flex flex-col justify-between shadow-sm relative">
                      {!stat.active && <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-50 text-red-500 border border-red-100 text-[8px] font-bold">INACTIVE</span>}
                      <div>
                        <span className="text-2xl font-extrabold text-[#0A7C86] font-jakarta">{stat.value}</span>
                        <h4 className="font-jakarta font-bold text-sm text-fazo-navy mt-1">{stat.label}</h4>
                        <span className="font-sans text-[10px] text-fazo-gray block mt-2">Icon: {stat.icon} • Order: {stat.display_order}</span>
                      </div>
                      <div className="flex gap-2.5 border-t border-fazo-border/40 pt-4 mt-5">
                        <button onClick={() => handleEditStat(stat)} className="flex-1 py-1.5 border border-fazo-border hover:bg-[#0A7C86]/5 hover:border-[#0A7C86] rounded-lg text-xs font-bold text-fazo-navy hover:text-[#0A7C86] flex items-center justify-center gap-1 transition">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDeleteStatClick(stat.id)} className="flex-1 py-1.5 border border-red-100 hover:bg-red-50 hover:border-red-400 rounded-lg text-xs font-bold text-red-500 flex items-center justify-center gap-1 transition">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 3. TESTIMONIALS TAB VIEW --- */}
        {activeTab === 'testimonials' && !loading && (
          <div className="animate-fadeIn">
            {isTestimonialFormOpen ? (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 p-6 max-w-2xl shadow-sm">
                <h3 className="font-jakarta font-bold text-base text-fazo-navy border-b border-fazo-border/60 pb-3 mb-5">
                  {testimonialForm.id ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">CUSTOMER NAME</label>
                      <input 
                        type="text" 
                        value={testimonialForm.name}
                        onChange={e => setTestimonialForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Dr. Ananya Nair"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">DESIGNATION</label>
                      <input 
                        type="text" 
                        value={testimonialForm.designation}
                        onChange={e => setTestimonialForm(p => ({ ...p, designation: e.target.value }))}
                        placeholder="Clinical Director"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">CLINIC / COMPANY NAME</label>
                      <input 
                        type="text" 
                        value={testimonialForm.company}
                        onChange={e => setTestimonialForm(p => ({ ...p, company: e.target.value }))}
                        placeholder="Pearl Dental Clinics"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">DISPLAY ORDER</label>
                      <input 
                        type="number" 
                        value={testimonialForm.display_order}
                        onChange={e => setTestimonialForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">TESTIMONIAL CONTENT</label>
                    <textarea 
                      value={testimonialForm.content}
                      onChange={e => setTestimonialForm(p => ({ ...p, content: e.target.value }))}
                      rows="4"
                      placeholder="Write customer review..."
                      className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">CUSTOMER IMAGE</label>
                    <div className="flex items-center gap-4">
                      {testimonialForm.image && (
                        <div className="w-12 h-12 rounded-full border border-fazo-border overflow-hidden">
                          <img src={testimonialForm.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="cursor-pointer border border-[#0A7C86] hover:bg-[#0A7C86]/5 text-[#0A7C86] font-jakarta font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                        <Upload className="w-4 h-4" /> {loadingFile ? 'Processing...' : 'Upload Image'}
                        <input type="file" accept="image/*" onChange={handleTestimonialImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input 
                      type="checkbox" 
                      id="testimonialActive"
                      checked={testimonialForm.active}
                      onChange={e => setTestimonialForm(p => ({ ...p, active: e.target.checked }))}
                      className="rounded text-[#0A7C86]"
                    />
                    <label htmlFor="testimonialActive" className="font-jakarta font-bold text-[11px] text-fazo-navy cursor-pointer">Active / Display on Website</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="btn-3d-teal text-white px-5 py-2.5 rounded-lg text-xs font-bold">Save Testimonial</button>
                    <button type="button" onClick={() => setIsTestimonialFormOpen(false)} className="px-5 py-2.5 bg-fazo-border/40 border border-fazo-border/60 hover:bg-fazo-border/60 rounded-lg text-xs font-bold text-fazo-navy">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-6">
                  <button onClick={handleCreateTestimonial} className="btn-3d-teal text-white px-5 py-3 rounded-lg font-jakarta font-bold text-xs flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5" /> Add New Testimonial
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-6 flex flex-col justify-between shadow-sm relative">
                      {!t.active && <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-50 text-red-500 border border-red-100 text-[8px] font-bold">INACTIVE</span>}
                      <div>
                        <p className="font-sans text-xs italic text-fazo-gray leading-relaxed">"{t.content}"</p>
                        <div className="flex items-center gap-3 mt-4">
                          <div className="w-10 h-10 rounded-full border border-white/80 overflow-hidden shrink-0">
                            <img src={getImageUrl(t.image) || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop"} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-jakarta font-bold text-xs text-fazo-navy">{t.name}</h4>
                            <span className="font-sans text-[10px] font-semibold text-fazo-teal">{t.designation}, {t.company}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2.5 border-t border-fazo-border/40 pt-4 mt-5">
                        <button onClick={() => handleEditTestimonial(t)} className="flex-1 py-1.5 border border-fazo-border hover:bg-[#0A7C86]/5 hover:border-[#0A7C86] rounded-lg text-xs font-bold text-fazo-navy hover:text-[#0A7C86] flex items-center justify-center gap-1 transition">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDeleteTestimonialClick(t.id)} className="flex-1 py-1.5 border border-red-100 hover:bg-red-50 hover:border-red-400 rounded-lg text-xs font-bold text-red-500 flex items-center justify-center gap-1 transition">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 4. CATEGORIES TAB VIEW --- */}
        {activeTab === 'categories' && !loading && (
          <div className="animate-fadeIn">
            {isCategoryFormOpen ? (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 p-6 max-w-2xl shadow-sm">
                <h3 className="font-jakarta font-bold text-base text-fazo-navy border-b border-fazo-border/60 pb-3 mb-5">
                  {categoryForm.id ? 'Edit Category' : 'Add New Category'}
                </h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">CATEGORY NAME</label>
                      <input 
                        type="text" 
                        value={categoryForm.name}
                        onChange={e => setCategoryForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Dental Handpieces"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">CUSTOM SLUG (OPTIONAL)</label>
                      <input 
                        type="text" 
                        value={categoryForm.slug}
                        onChange={e => setCategoryForm(p => ({ ...p, slug: e.target.value }))}
                        placeholder="dental-handpieces"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">DESCRIPTION</label>
                    <textarea 
                      value={categoryForm.description}
                      onChange={e => setCategoryForm(p => ({ ...p, description: e.target.value }))}
                      rows="3"
                      placeholder="Brief card description..."
                      className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">OVERVIEW (PAGE INTRO)</label>
                    <textarea 
                      value={categoryForm.overview}
                      onChange={e => setCategoryForm(p => ({ ...p, overview: e.target.value }))}
                      rows="4"
                      placeholder="Detailed introduction rendered at the top of category landing page..."
                      className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">PRODUCT HERO IMAGE</label>
                      <div className="flex items-center gap-4">
                        {categoryForm.image && (
                          <div className="w-12 h-10 rounded border border-fazo-border overflow-hidden">
                            <img src={categoryForm.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="cursor-pointer border border-[#0A7C86] hover:bg-[#0A7C86]/5 text-[#0A7C86] font-jakarta font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                          <Upload className="w-4 h-4" /> {loadingFile ? 'Processing...' : 'Upload Image'}
                          <input type="file" accept="image/*" onChange={handleCategoryImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">DISPLAY ORDER</label>
                      <input 
                        type="number" 
                        value={categoryForm.display_order}
                        onChange={e => setCategoryForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input 
                      type="checkbox" 
                      id="categoryActive"
                      checked={categoryForm.active}
                      onChange={e => setCategoryForm(p => ({ ...p, active: e.target.checked }))}
                      className="rounded text-[#0A7C86]"
                    />
                    <label htmlFor="categoryActive" className="font-jakarta font-bold text-[11px] text-fazo-navy cursor-pointer">Active / Show in Menu and Products Catalog</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="btn-3d-teal text-white px-5 py-2.5 rounded-lg text-xs font-bold">Save Category</button>
                    <button type="button" onClick={() => setIsCategoryFormOpen(false)} className="px-5 py-2.5 bg-fazo-border/40 border border-fazo-border/60 hover:bg-fazo-border/60 rounded-lg text-xs font-bold text-fazo-navy">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-6">
                  <button onClick={handleCreateCategory} className="btn-3d-teal text-white px-5 py-3 rounded-lg font-jakarta font-bold text-xs flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5" /> Add New Category
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-white/60 backdrop-blur-md rounded-xl border border-white/50 p-5 flex flex-col justify-between shadow-sm relative">
                      {!cat.active && <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-50 text-red-500 border border-red-100 text-[8px] font-bold">INACTIVE</span>}
                      <div>
                        <div className="h-32 rounded-lg bg-[#E1EDF0] overflow-hidden mb-4 relative">
                          <img src={getImageUrl(cat.image) || "/hero/accessories_4_3.webp"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-jakarta font-bold text-base text-fazo-navy mb-1">{cat.name}</h3>
                        <p className="font-sans text-[11px] text-[#0A7C86] font-semibold mb-2">Slug: /products/{cat.slug}</p>
                        <p className="font-sans text-[12px] text-fazo-gray line-clamp-2 leading-relaxed mb-4">{cat.description}</p>
                      </div>
                      <div className="flex gap-2.5 border-t border-fazo-border/40 pt-4 mt-auto">
                        <button onClick={() => handleEditCategory(cat)} className="flex-1 py-2 border border-fazo-border hover:bg-[#0A7C86]/5 hover:border-[#0A7C86] rounded-lg text-xs font-bold text-fazo-navy hover:text-[#0A7C86] flex items-center justify-center gap-1 transition">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDeleteCategoryClick(cat.slug)} className="flex-1 py-2 border border-red-100 hover:bg-red-50 hover:border-red-400 rounded-lg text-xs font-bold text-red-500 flex items-center justify-center gap-1 transition">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 5. PRODUCTS TAB VIEW --- */}
        {activeTab === 'products' && !loading && (
          <div className="animate-fadeIn">
            {isProductFormOpen ? (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 p-6 max-w-4xl shadow-sm">
                <h3 className="font-jakarta font-bold text-base text-fazo-navy border-b border-fazo-border/60 pb-3 mb-5">
                  {productForm.id ? 'Edit Sub Product' : 'Add New Sub Product'}
                </h3>
                <form onSubmit={handleProductSubmit} className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">PRODUCT NAME</label>
                      <input 
                        type="text" 
                        value={productForm.name}
                        onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="High Speed Handpiece"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">MAIN CATEGORY</label>
                      <select 
                        value={productForm.categorySlug}
                        onChange={e => setProductForm(p => ({ ...p, categorySlug: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">CUSTOM SLUG (OPTIONAL)</label>
                      <input 
                        type="text" 
                        value={productForm.slug}
                        onChange={e => setProductForm(p => ({ ...p, slug: e.target.value }))}
                        placeholder="high-speed-handpiece"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">SHORT DESCRIPTION</label>
                    <input 
                      type="text" 
                      value={productForm.shortDescription || productForm.short_description || ''}
                      onChange={e => setProductForm(p => ({ ...p, shortDescription: e.target.value }))}
                      placeholder="e.g. Precision engineered high-speed turbine with integrated LED light."
                      className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                    />
                  </div>

                  <div>
                    <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">PRODUCT DESCRIPTION</label>
                    <textarea 
                      value={productForm.description}
                      onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                      rows="4"
                      placeholder="Detailed rich description. Separate paragraphs by empty lines..."
                      className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                      required
                    ></textarea>
                  </div>

                  {/* Features List */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jakarta font-bold text-[10px] text-fazo-navy">PRODUCT FEATURES</label>
                      <button type="button" onClick={handleAddFeature} className="text-[10px] font-bold text-[#0A7C86] flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> Add Feature</button>
                    </div>
                    <div className="space-y-2">
                      {productForm.features.map((feat, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={feat}
                            onChange={e => handleFeatureChange(e.target.value, idx)}
                            placeholder="Bullet feature..."
                            className="flex-grow px-3 py-2 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                          />
                          <button type="button" onClick={() => handleRemoveFeature(idx)} className="p-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg"><MinusCircle className="w-4.5 h-4.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jakarta font-bold text-[10px] text-fazo-navy">TECHNICAL SPECIFICATIONS</label>
                      <button type="button" onClick={handleAddSpec} className="text-[10px] font-bold text-[#0A7C86] flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> Add Specification</button>
                    </div>
                    <div className="space-y-2">
                      {productForm.specifications.map((spec, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={spec.key}
                            onChange={e => handleSpecChange('key', e.target.value, idx)}
                            placeholder="Specification Key (e.g. Speed)"
                            className="w-1/3 px-3 py-2 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                          />
                          <input 
                            type="text"
                            value={spec.value}
                            onChange={e => handleSpecChange('value', e.target.value, idx)}
                            placeholder="Value (e.g. 350,000 RPM)"
                            className="flex-grow px-3 py-2 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                          />
                          <button type="button" onClick={() => handleRemoveSpec(idx)} className="p-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg"><MinusCircle className="w-4.5 h-4.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image, brochure, gallery files uploads */}
                  <div className="grid grid-cols-2 gap-6 p-4 bg-white/40 border border-fazo-border/30 rounded-2xl">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">HERO IMAGE</label>
                      <div className="flex items-center gap-3">
                        {productForm.image && (
                          <div className="w-10 h-10 rounded border border-fazo-border overflow-hidden">
                            <img src={productForm.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <label className="cursor-pointer border border-[#0A7C86] text-[#0A7C86] hover:bg-[#0A7C86]/5 font-jakarta font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                          <Upload className="w-4 h-4" /> Hero Photo
                          <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">BROCHURE (PDF)</label>
                      <div className="flex items-center gap-3">
                        {productForm.brochureUrl && <FileText className="w-8 h-8 text-red-500 shrink-0" />}
                        <label className="cursor-pointer border border-fazo-navy text-fazo-navy hover:bg-fazo-navy/5 font-jakarta font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                          <FileText className="w-4 h-4" /> PDF Brochure
                          <input type="file" accept="application/pdf" onChange={handleBrochureUpload} className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">PRODUCT GALLERY IMAGES (MULTIPLE)</label>
                      
                      {/* Render existing backend gallery list */}
                      {productForm.gallery_images?.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 mb-3 p-3 bg-white/50 rounded-xl border border-fazo-border/20">
                          {productForm.gallery_images.map(img => (
                            <div key={img.id} className="relative w-16 h-12 rounded border border-fazo-border/60 overflow-hidden group">
                              <img src={getImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => handleDeleteGalleryImg(img.id)}
                                className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {productForm.gallery?.length > 0 && <span className="text-xs font-semibold text-fazo-gray">{productForm.gallery.length} new photos selected</span>}
                        <label className="cursor-pointer border border-[#0A7C86] text-[#0A7C86] hover:bg-[#0A7C86]/5 font-jakarta font-bold text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition">
                          <Upload className="w-4 h-4" /> Add Gallery Photos
                          <input type="file" accept="image/*" multiple onChange={handleProductGalleryUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* SEO Details */}
                  <div className="p-4 bg-white/40 border border-fazo-border/30 rounded-2xl space-y-4">
                    <h4 className="font-jakarta font-bold text-xs text-fazo-navy">SEO Meta tags Override (Recommended for Rankings)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">SEO TITLE</label>
                        <input 
                          type="text" 
                          value={productForm.seoTitle || productForm.seo_title || ''}
                          onChange={e => setProductForm(p => ({ ...p, seoTitle: e.target.value }))}
                          placeholder="FAZO Premium LED Handpiece - Low Vibration"
                          className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">DISPLAY ORDER</label>
                        <input 
                          type="number" 
                          value={productForm.display_order}
                          onChange={e => setProductForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">SEO META DESCRIPTION</label>
                      <textarea 
                        value={productForm.seoDescription || productForm.seo_description || ''}
                        onChange={e => setProductForm(p => ({ ...p, seoDescription: e.target.value }))}
                        rows="2"
                        placeholder="Search engine snippet page description..."
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input 
                      type="checkbox" 
                      id="prodActive"
                      checked={productForm.active}
                      onChange={e => setProductForm(p => ({ ...p, active: e.target.checked }))}
                      className="rounded text-[#0A7C86]"
                    />
                    <label htmlFor="prodActive" className="font-jakarta font-bold text-[11px] text-fazo-navy cursor-pointer">Active / Visible on website</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="btn-3d-teal text-white px-5 py-2.5 rounded-lg text-xs font-bold">Save Product</button>
                    <button type="button" onClick={() => setIsProductFormOpen(false)} className="px-5 py-2.5 bg-fazo-border/40 border border-fazo-border/60 hover:bg-fazo-border/60 rounded-lg text-xs font-bold text-fazo-navy">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-6">
                  <button onClick={handleCreateProduct} className="btn-3d-teal text-white px-5 py-3 rounded-lg font-jakarta font-bold text-xs flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5" /> Add New Product
                  </button>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/40 border-b border-fazo-border/60">
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Product</th>
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Category Link</th>
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Features / Specs</th>
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Status</th>
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod) => (
                        <tr key={prod.id} className="border-b border-fazo-border/30 last:border-b-0 hover:bg-white/20 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-10 rounded bg-[#E1EDF0] overflow-hidden flex-shrink-0 border border-fazo-border/30">
                                <img src={getImageUrl(prod.image) || "/hero/accessories_4_3.webp"} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-jakarta font-bold text-sm text-fazo-navy leading-tight">{prod.name}</h4>
                                <span className="font-sans text-[11px] text-fazo-gray font-medium">/{prod.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded bg-[#E6F3F5] border border-[#0A7C86]/20 font-jakarta font-semibold text-xs text-[#0A7C86]">
                              {prod.category_slug || prod.categorySlug}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col text-[11px] text-fazo-gray">
                              <span>• {prod.features?.length || 0} Features</span>
                              <span>• {prod.specifications?.length || 0} Specifications</span>
                              <span>• {prod.gallery_images?.length || 0} Gallery photos</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {prod.active ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold">ACTIVE</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold">INACTIVE</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button onClick={() => handleEditProduct(prod)} className="p-2 border border-fazo-border hover:bg-[#0A7C86]/5 hover:border-[#0A7C86] rounded-lg text-fazo-navy hover:text-[#0A7C86] transition">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProductClick(prod.slug)} className="p-2 border border-red-100 hover:bg-red-50 hover:border-red-400 rounded-lg text-red-500 transition">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 6. DEALERS TAB VIEW --- */}
        {activeTab === 'dealers' && !loading && (
          <div className="animate-fadeIn">
            {isDealerFormOpen ? (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 p-6 max-w-2xl shadow-sm">
                <h3 className="font-jakarta font-bold text-base text-fazo-navy border-b border-fazo-border/60 pb-3 mb-5">
                  {dealerForm.id ? 'Edit Dealer Listing' : 'Add New Dealer Listing'}
                </h3>
                <form onSubmit={handleDealerSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">DEALER/DISTRIBUTOR NAME</label>
                      <input 
                        type="text" 
                        value={dealerForm.name}
                        onChange={e => setDealerForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Fortune Dental Solutions"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">PARTNER TYPE</label>
                      <select 
                        value={dealerForm.type}
                        onChange={e => setDealerForm(p => ({ ...p, type: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                      >
                        <option value="Dealer">Dealer</option>
                        <option value="Distributor">Distributor</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">COUNTRY</label>
                      <select 
                        value={dealerForm.country}
                        onChange={e => setDealerForm(p => ({ ...p, country: e.target.value, state: '', city: '' }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      >
                        {Object.keys(COUNTRY_STATES_MAP).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">STATE / REGION</label>
                      <select 
                        value={dealerForm.state}
                        onChange={e => setDealerForm(p => ({ ...p, state: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        required
                      >
                        <option value="">Select Region</option>
                        {(COUNTRY_STATES_MAP[dealerForm.country] || []).map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">CITY</label>
                      <input 
                        type="text" 
                        value={dealerForm.city}
                        onChange={e => setDealerForm(p => ({ ...p, city: e.target.value }))}
                        placeholder="Thiruvananthapuram"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">FULL STREET ADDRESS</label>
                    <textarea 
                      value={dealerForm.address}
                      onChange={e => setDealerForm(p => ({ ...p, address: e.target.value }))}
                      rows="2"
                      placeholder="Enter full physical address..."
                      className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">CONTACT PERSON</label>
                      <input 
                        type="text" 
                        value={dealerForm.contactPerson || dealerForm.contact_person || ''}
                        onChange={e => setDealerForm(p => ({ ...p, contactPerson: e.target.value }))}
                        placeholder="John Mathew"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">PHONE NUMBER</label>
                      <input 
                        type="text" 
                        value={dealerForm.phone}
                        onChange={e => setDealerForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 98450 12345"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        value={dealerForm.email}
                        onChange={e => setDealerForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="dealer@company.com"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">GOOGLE MAPS EMBED OR REDIRECT LINK</label>
                    <input 
                      type="url" 
                      value={dealerForm.mapsLink || dealerForm.maps_link || ''}
                      onChange={e => setDealerForm(p => ({ ...p, mapsLink: e.target.value }))}
                      placeholder="https://maps.google.com/?q=Location"
                      className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none focus:border-[#0A7C86]"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input 
                      type="checkbox" 
                      id="dealerActive"
                      checked={dealerForm.active}
                      onChange={e => setDealerForm(p => ({ ...p, active: e.target.checked }))}
                      className="rounded text-[#0A7C86]"
                    />
                    <label htmlFor="dealerActive" className="font-jakarta font-bold text-[11px] text-fazo-navy cursor-pointer">Active Partner / Visible on Dealer page</label>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="btn-3d-teal text-white px-5 py-2.5 rounded-lg text-xs font-bold">Save Dealer</button>
                    <button type="button" onClick={() => setIsDealerFormOpen(false)} className="px-5 py-2.5 bg-fazo-border/40 border border-fazo-border/60 hover:bg-fazo-border/60 rounded-lg text-xs font-bold text-fazo-navy">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-6">
                  <button onClick={handleCreateDealer} className="btn-3d-teal text-white px-5 py-3 rounded-lg font-jakarta font-bold text-xs flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5" /> Add New Dealer
                  </button>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/40 border-b border-fazo-border/60">
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Dealer/Distributor</th>
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Location</th>
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Contact details</th>
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Status</th>
                        <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dealers.map((dlr) => (
                        <tr key={dlr.id} className="border-b border-fazo-border/30 last:border-b-0 hover:bg-white/20 transition">
                          <td className="px-6 py-4">
                            <div>
                              <h4 className="font-jakarta font-bold text-sm text-fazo-navy leading-tight">{dlr.name}</h4>
                              <span className={`inline-block px-2.5 py-0.5 mt-1 rounded text-[10px] font-bold ${
                                dlr.type === 'Distributor' 
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                  : 'bg-[#E6F3F5] text-[#0A7C86] border border-[#0A7C86]/20'
                              }`}>
                                {dlr.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col text-xs font-semibold text-fazo-navy">
                              <span>{dlr.city}, {dlr.state}</span>
                              <span className="font-normal text-[10px] text-fazo-gray uppercase tracking-wider mt-0.5">{dlr.country}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col text-xs font-semibold text-fazo-navy">
                              <span>{dlr.contactPerson || dlr.contact_person}</span>
                              <span className="font-normal text-[11px] text-fazo-gray">{dlr.phone} • {dlr.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {dlr.active ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold">ACTIVE</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-red-50 border border-red-100 text-red-500 text-[10px] font-bold">INACTIVE</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex gap-2">
                              <button onClick={() => handleEditDealer(dlr)} className="p-2 border border-fazo-border hover:bg-[#0A7C86]/5 hover:border-[#0A7C86] rounded-lg text-fazo-navy hover:text-[#0A7C86] transition">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteDealerClick(dlr.id)} className="p-2 border border-red-100 hover:bg-red-50 hover:border-red-400 rounded-lg text-red-500 transition">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 7. CAREERS TAB VIEW --- */}
        {activeTab === 'careers' && !loading && (
          <div className="animate-fadeIn">
            {isJobFormOpen ? (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 p-6 max-w-3xl shadow-sm">
                <h3 className="font-jakarta font-bold text-base text-fazo-navy border-b border-fazo-border/60 pb-3 mb-5">
                  {jobForm.id ? 'Edit Job Posting' : 'Create New Job Posting'}
                </h3>
                <form onSubmit={handleJobSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">JOB TITLE</label>
                      <input 
                        type="text" 
                        value={jobForm.title}
                        onChange={e => setJobForm(p => ({ ...p, title: e.target.value }))}
                        placeholder="Sales Executive"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">SALARY PACKAGE</label>
                      <input 
                        type="text" 
                        value={jobForm.salary}
                        onChange={e => setJobForm(p => ({ ...p, salary: e.target.value }))}
                        placeholder="₹30,000 - ₹50,000 / Month"
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">JOB STATUS</label>
                      <select 
                        value={jobForm.status}
                        onChange={e => setJobForm(p => ({ ...p, status: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-jakarta font-bold text-[10px] text-fazo-navy mb-1.5">DISPLAY ORDER</label>
                      <input 
                        type="number" 
                        value={jobForm.display_order}
                        onChange={e => setJobForm(p => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Paragraphs description */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jakarta font-bold text-[10px] text-fazo-navy">DESCRIPTION PARAGRAPHS</label>
                      <button type="button" onClick={() => handleAddJobArrayItem('paragraphs')} className="text-[10px] font-bold text-[#0A7C86] flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> Add Paragraph</button>
                    </div>
                    <div className="space-y-2">
                      {jobForm.description.paragraphs.map((para, idx) => (
                        <div key={idx} className="flex gap-2">
                          <textarea 
                            value={para}
                            onChange={e => handleJobArrayChange('paragraphs', idx, e.target.value)}
                            placeholder="Write paragraph about the role..."
                            className="flex-grow px-3 py-2 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                            rows="2"
                          ></textarea>
                          <button type="button" onClick={() => handleRemoveJobArrayItem('paragraphs', idx)} className="p-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg shrink-0 self-center"><MinusCircle className="w-4.5 h-4.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Responsibilities list */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jakarta font-bold text-[10px] text-fazo-navy">KEY RESPONSIBILITIES</label>
                      <button type="button" onClick={() => handleAddJobArrayItem('responsibilities')} className="text-[10px] font-bold text-[#0A7C86] flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> Add Responsibility</button>
                    </div>
                    <div className="space-y-2">
                      {jobForm.description.responsibilities.map((resp, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={resp}
                            onChange={e => handleJobArrayChange('responsibilities', idx, e.target.value)}
                            placeholder="e.g. Conduct live clinical product demonstrations..."
                            className="flex-grow px-3 py-2 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                          />
                          <button type="button" onClick={() => handleRemoveJobArrayItem('responsibilities', idx)} className="p-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg"><MinusCircle className="w-4.5 h-4.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements list */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-jakarta font-bold text-[10px] text-fazo-navy">ELIGIBILITY REQUIREMENTS</label>
                      <button type="button" onClick={() => handleAddJobArrayItem('requirements')} className="text-[10px] font-bold text-[#0A7C86] flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> Add Requirement</button>
                    </div>
                    <div className="space-y-2">
                      {jobForm.description.requirements.map((req, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text"
                            value={req}
                            onChange={e => handleJobArrayChange('requirements', idx, e.target.value)}
                            placeholder="e.g. Bachelor's degree with 2+ years of medical sales experience..."
                            className="flex-grow px-3 py-2 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                          />
                          <button type="button" onClick={() => handleRemoveJobArrayItem('requirements', idx)} className="p-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg"><MinusCircle className="w-4.5 h-4.5" /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button type="submit" className="btn-3d-teal text-white px-5 py-2.5 rounded-lg text-xs font-bold">Save Job Post</button>
                    <button type="button" onClick={() => setIsJobFormOpen(false)} className="px-5 py-2.5 bg-fazo-border/40 border border-fazo-border/60 hover:bg-fazo-border/60 rounded-lg text-xs font-bold text-fazo-navy">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-6">
                  <button onClick={handleCreateJob} className="btn-3d-teal text-white px-5 py-3 rounded-lg font-jakarta font-bold text-xs flex items-center gap-1.5">
                    <Plus className="w-4.5 h-4.5" /> Post New Job
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {jobs.map(job => (
                    <div key={job.id} className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-6 flex flex-col justify-between shadow-sm relative">
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] font-bold ${
                        job.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'
                      }`}>{job.status.toUpperCase()}</span>
                      <div>
                        <h3 className="font-jakarta font-bold text-base text-fazo-navy mb-1">{job.title}</h3>
                        <span className="font-sans text-[11px] text-[#0A7C86] font-semibold">{job.salary}</span>
                        <p className="font-sans text-[12px] text-fazo-gray mt-3 line-clamp-3 leading-relaxed">
                          {job.description?.paragraphs?.[0] || 'No description paragraphs provided.'}
                        </p>
                      </div>
                      <div className="flex gap-2.5 border-t border-fazo-border/40 pt-4 mt-5">
                        <button onClick={() => handleEditJob(job)} className="flex-1 py-1.5 border border-fazo-border hover:bg-[#0A7C86]/5 hover:border-[#0A7C86] rounded-lg text-xs font-bold text-fazo-navy hover:text-[#0A7C86] flex items-center justify-center gap-1 transition">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDeleteJobClick(job.id)} className="flex-1 py-1.5 border border-red-100 hover:bg-red-50 hover:border-red-400 rounded-lg text-xs font-bold text-red-500 flex items-center justify-center gap-1 transition">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 8. APPLICATIONS TAB VIEW --- */}
        {activeTab === 'applications' && !loading && (
          <div className="animate-fadeIn space-y-6">
            
            {/* Filters panel */}
            <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-white/50 p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-fazo-gray" />
                <input 
                  type="text"
                  value={appSearchQuery}
                  onChange={e => setAppSearchQuery(e.target.value)}
                  placeholder="Search applicant name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <div className="flex items-center gap-1.5 w-1/2 md:w-auto">
                  <Filter className="w-4 h-4 text-fazo-gray" />
                  <select 
                    value={appJobFilter}
                    onChange={e => setAppJobFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                  >
                    <option value="All">All Jobs</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-1.5 w-1/2 md:w-auto">
                  <CheckSquare className="w-4 h-4 text-fazo-gray" />
                  <select 
                    value={appStatusFilter}
                    onChange={e => setAppStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List Table */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/40 border-b border-fazo-border/60">
                    <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Applicant</th>
                    <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Job Position</th>
                    <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Applied Date</th>
                    <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase">Status</th>
                    <th className="px-6 py-4 font-jakarta font-bold text-xs text-fazo-navy uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => (
                    <tr key={app.id} className="border-b border-fazo-border/30 last:border-b-0 hover:bg-white/20 transition cursor-pointer" onClick={() => setSelectedApplication(app)}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-jakarta font-bold text-sm text-fazo-navy">{app.full_name}</span>
                          <span className="font-sans text-[11px] text-fazo-gray">{app.email} • {app.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-jakarta font-semibold text-xs text-fazo-navy">{app.job_title || app.appliedJob}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-sans text-xs text-fazo-navy">{app.applied_date || app.appliedDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          app.status === 'Hired' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-500 border border-red-100' :
                          app.status === 'Shortlisted' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="inline-flex gap-2">
                          <a 
                            href={getImageUrl(app.resume)} 
                            target="_blank" 
                            rel="noreferrer"
                            download
                            className="p-2 border border-fazo-border hover:bg-[#0A7C86]/5 hover:border-[#0A7C86] rounded-lg text-fazo-navy hover:text-[#0A7C86] transition"
                          >
                            <FileDown className="w-4 h-4" />
                          </a>
                          <button 
                            onClick={() => handleDeleteApplicationClick(app.id)}
                            className="p-2 border border-red-100 hover:bg-red-50 hover:border-red-400 rounded-lg text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Application Detail Modal Overlay */}
            {selectedApplication && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-fazo-border/50 max-w-xl w-full p-6 shadow-2xl relative text-left">
                  <button onClick={() => setSelectedApplication(null)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-fazo-border/20 text-fazo-navy"><X className="w-5 h-5" /></button>
                  <h3 className="font-jakarta font-bold text-lg text-fazo-navy border-b border-fazo-border/40 pb-3 mb-4">Application Details</h3>
                  
                  <div className="space-y-4 font-sans text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block font-jakarta font-bold text-[10px] text-fazo-gray uppercase">Applicant Name</span>
                        <span className="text-sm font-bold text-fazo-navy mt-0.5 block">{selectedApplication.full_name}</span>
                      </div>
                      <div>
                        <span className="block font-jakarta font-bold text-[10px] text-fazo-gray uppercase">Applied Position</span>
                        <span className="text-sm font-bold text-fazo-navy mt-0.5 block">{selectedApplication.job_title || selectedApplication.appliedJob}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block font-jakarta font-bold text-[10px] text-fazo-gray uppercase">Email Address</span>
                        <span className="font-semibold text-fazo-navy mt-0.5 block">{selectedApplication.email}</span>
                      </div>
                      <div>
                        <span className="block font-jakarta font-bold text-[10px] text-fazo-gray uppercase">Phone Number</span>
                        <span className="font-semibold text-fazo-navy mt-0.5 block">{selectedApplication.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block font-jakarta font-bold text-[10px] text-fazo-gray uppercase">Location</span>
                        <span className="font-semibold text-fazo-navy mt-0.5 block">{selectedApplication.location}</span>
                      </div>
                      <div>
                        <span className="block font-jakarta font-bold text-[10px] text-fazo-gray uppercase">Submission Date</span>
                        <span className="font-semibold text-fazo-navy mt-0.5 block">{selectedApplication.applied_date || selectedApplication.appliedDate}</span>
                      </div>
                    </div>

                    {selectedApplication.cover_letter && (
                      <div>
                        <span className="block font-jakarta font-bold text-[10px] text-fazo-gray uppercase">Cover Letter / Message</span>
                        <p className="p-3 bg-fazo-border/10 rounded-xl mt-1 text-[11px] leading-relaxed max-h-32 overflow-y-auto">{selectedApplication.cover_letter}</p>
                      </div>
                    )}

                    {/* Resume download */}
                    <div className="flex items-center gap-3 p-3 bg-[#E6F3F5] border border-[#0A7C86]/20 rounded-2xl">
                      <FileText className="w-8 h-8 text-[#0A7C86]" />
                      <div className="flex-grow">
                        <span className="block font-jakarta font-bold text-[10px] text-[#0A7C86]">APPLICANT RESUME</span>
                        <span className="text-[11px] font-semibold text-fazo-navy">{selectedApplication.resume ? selectedApplication.resume.split('/').pop() : 'resume_file.pdf'}</span>
                      </div>
                      <a href={getImageUrl(selectedApplication.resume)} target="_blank" rel="noreferrer" className="btn-3d-teal text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1"><FileDown className="w-4 h-4" /> Download</a>
                    </div>

                    {/* Application Workflow Status Updater */}
                    <div className="pt-4 border-t border-fazo-border/40 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-jakarta font-bold text-xs text-fazo-navy">Update Status:</span>
                        <select 
                          value={selectedApplication.status}
                          onChange={e => handleUpdateAppStatus(selectedApplication.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-fazo-border bg-white text-xs font-semibold text-fazo-navy focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => handleDeleteApplicationClick(selectedApplication.id)}
                        className="px-4 py-2 border border-red-100 hover:bg-red-50 text-red-500 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Application
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 9. CONTACT ENQUIRIES TAB VIEW --- */}
        {activeTab === 'enquiries' && !loading && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enquiries.map(enq => (
                <div key={enq.id} className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-6 flex flex-col justify-between shadow-sm relative">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-jakarta font-bold text-base text-fazo-navy leading-snug">{enq.subject}</h4>
                        <span className="font-sans text-[11px] text-fazo-gray mt-1 block">From: <span className="font-bold text-fazo-navy">{enq.name}</span> ({enq.email})</span>
                      </div>
                      <span className="font-sans text-[10px] text-fazo-gray text-right">{new Date(enq.submitted_date || enq.submittedDate).toLocaleString()}</span>
                    </div>

                    <div className="p-4 bg-white/40 border border-fazo-border/30 rounded-xl mt-4 text-xs font-medium text-fazo-navy leading-relaxed">
                      {enq.message}
                    </div>

                    {enq.phone && <div className="mt-3 font-sans text-[11px] text-fazo-navy">Phone: <strong>{enq.phone}</strong> {enq.company && <span>• Company: <strong>{enq.company}</strong></span>}</div>}
                  </div>

                  <div className="flex gap-3 border-t border-fazo-border/40 pt-4 mt-5">
                    {enq.contacted ? (
                      <button 
                        onClick={() => handleMarkContacted(enq.id, false)}
                        className="flex-1 py-2 border border-emerald-100 bg-emerald-50 rounded-lg text-xs font-bold text-emerald-600 flex items-center justify-center gap-1.5 transition"
                      >
                        <CheckCircle className="w-4 h-4" /> Marked Contacted
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleMarkContacted(enq.id, true)}
                        className="flex-grow py-2 border border-fazo-border hover:bg-[#0A7C86]/5 hover:border-[#0A7C86] rounded-lg text-xs font-bold text-fazo-navy hover:text-[#0A7C86] flex items-center justify-center gap-1.5 transition"
                      >
                        <Clock className="w-4 h-4 shrink-0" /> Mark as Contacted
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteEnquiryClick(enq.id)}
                      className="py-2 px-3 border border-red-100 hover:bg-red-50 hover:border-red-400 rounded-lg text-red-500 flex items-center justify-center transition"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
