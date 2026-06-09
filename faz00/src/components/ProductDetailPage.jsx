import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryBySlug, getProductBySlug, getProductsByCategory, getImageUrl } from '../lib/db';
import { ChevronRight, Download, Send, AlertCircle, Sparkles, HelpCircle, Layers, CheckCircle2, FileText, ClipboardList, Zap } from 'lucide-react';

const getAssetPath = (path) => {
  return getImageUrl(path) || "/hero/accessories_4_3.webp";
};

const parseInlineFormatting = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-fazo-navy">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderRichText = (text) => {
  if (!text) return null;
  
  const blocks = text.split(/\n\n+/);
  
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;
    
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      const items = trimmed.split(/\n/).map(line => line.replace(/^[*•\-]\s*/, '').trim()).filter(Boolean);
      return (
        <ul key={idx} className="list-disc pl-6 mb-6 space-y-2.5 text-fazo-gray/95 font-sans text-sm sm:text-[15px] leading-relaxed">
          {items.map((item, i) => (
            <li key={i}>{parseInlineFormatting(item)}</li>
          ))}
        </ul>
      );
    }
    
    return (
      <p key={idx} className="mb-6 text-fazo-gray/95 font-sans text-sm sm:text-[15px] leading-[1.8] max-w-[850px] last:mb-0">
        {parseInlineFormatting(trimmed)}
      </p>
    );
  });
};

export const ProductDetailPage = () => {
  const { categorySlug, productSlug } = useParams();
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCategoryBySlug(categorySlug),
      getProductBySlug(categorySlug, productSlug),
      getProductsByCategory(categorySlug)
    ]).then(([cat, prod, categoryProducts]) => {
      if (cat && prod) {
        setCategory(cat);
        setProduct(prod);
        setActiveImage(prod.image || cat.image || '');
        
        // Update SEO title
        document.title = prod.seo_title || prod.seoTitle || `${prod.name} | FAZO Dental Technology`;
        
        // Update SEO meta description
        const seoDesc = prod.seo_description || prod.seoDescription || prod.short_description || prod.shortDescription || '';
        if (seoDesc) {
          let metaTag = document.querySelector('meta[name="description"]');
          if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('name', 'description');
            document.head.appendChild(metaTag);
          }
          metaTag.setAttribute('content', seoDesc);
        }
        
        const filtered = Array.isArray(categoryProducts)
          ? categoryProducts.filter(p => p.id !== prod.id && p.active !== false).slice(0, 3)
          : [];
        setRelatedProducts(filtered);
      } else {
        setCategory(null);
        setProduct(null);
        setRelatedProducts([]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setCategory(null);
      setProduct(null);
      setRelatedProducts([]);
      setLoading(false);
    });

    setInquirySubmitted(false);
    setInquiryForm({ name: '', email: '', phone: '', message: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug, productSlug]);

  if (loading) {
    return (
      <div className="w-full flex-grow py-32 flex items-center justify-center bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A7C86]"></div>
      </div>
    );
  }

  if (!product || !category) {
    return (
      <div className="w-full flex-grow py-32 flex flex-col items-center justify-center bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4] px-6 text-center">
        <AlertCircle className="w-16 h-16 text-[#0A7C86] mb-4" />
        <h2 className="font-jakarta font-extrabold text-2xl text-fazo-navy mb-2">Product Not Found</h2>
        <p className="font-sans text-sm text-fazo-gray max-w-sm mb-6 leading-relaxed">
          The product model you are looking for does not exist or has been removed from the catalog.
        </p>
        <Link to="/products" className="btn-3d-teal text-white px-6 py-3 rounded-lg font-jakarta font-bold text-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  // Handle Inquiry Form Submission
  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email) return;
    
    setInquirySubmitted(true);
    setTimeout(() => {
      setIsInquiryModalOpen(false);
      setInquirySubmitted(false);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
      alert("Thank you! Your inquiry has been sent to our sales team. We will contact you shortly.");
    }, 1500);
  };

  const galleryUrls = (product.gallery_images || []).map(imgObj => imgObj.image);
  const imagesList = [product.image, ...galleryUrls, ...(product.gallery || [])].filter(Boolean);

  // Parse features and specifications from the product data
  const features = Array.isArray(product.features) ? product.features.filter(f => f && f.trim()) : [];
  const specifications = Array.isArray(product.specifications) ? product.specifications.filter(s => s && s.key && s.key.trim()) : [];
  const brochureUrl = category.brochure ? getImageUrl(category.brochure) : '';
  const shortDesc = product.short_description || product.shortDescription || '';

  return (
    <div className="w-full flex-grow pb-24 relative bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4]">
      {/* Breadcrumbs */}
      <div className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 pt-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-fazo-gray text-left">
          <Link to="/products" className="hover:text-[#0A7C86] transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/products/${category.slug}`} className="hover:text-[#0A7C86] transition-colors">{category.name}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0A7C86]">{product.name}</span>
        </div>
      </div>

      {/* Main product area */}
      <div className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="w-full h-80 sm:h-[450px] bg-white/70 backdrop-blur-md rounded-2xl border border-white/50 shadow-inner overflow-hidden flex items-center justify-center p-4">
              <img 
                src={getAssetPath(activeImage)} 
                alt={product.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-16 rounded-lg bg-white border flex-shrink-0 overflow-hidden flex items-center justify-center p-1.5 transition-all ${
                      activeImage === img 
                        ? 'border-[#0A7C86] ring-2 ring-[#0A7C86]/20' 
                        : 'border-fazo-border hover:border-fazo-gray/50'
                    }`}
                  >
                    <img src={getAssetPath(img)} alt="" className="max-w-full max-h-full object-contain rounded" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Key Details */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <h1 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-fazo-navy tracking-tight mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            {shortDesc && (
              <p className="font-sans text-[15px] sm:text-base leading-relaxed text-fazo-gray mb-4">
                {shortDesc}
              </p>
            )}
            
            <p className="font-sans text-[15px] sm:text-base leading-relaxed text-fazo-gray mb-8 border-b border-fazo-border/60 pb-6 w-full">
              {product.description}
            </p>

            {/* Quick Features Preview (first 5) */}
            {features.length > 0 && (
              <div className="w-full mb-8">
                <h3 className="font-jakarta font-bold text-sm text-fazo-navy mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#0A7C86]" /> Key Features
                </h3>
                <ul className="space-y-2">
                  {features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-fazo-gray">
                      <CheckCircle2 className="w-4 h-4 text-[#0A7C86] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {features.length > 5 && (
                    <li className="text-xs text-[#0A7C86] font-semibold pl-6">
                      +{features.length - 5} more features below
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setIsInquiryModalOpen(true)}
                className="btn-3d-teal text-white px-8 py-4 rounded-lg font-jakarta font-bold text-sm flex items-center gap-2 group cursor-pointer shadow-lg hover:shadow-[#006f7a]/30"
              >
                Inquire About Product <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {brochureUrl && (
                <a 
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 glass-badge hover:bg-white/60 text-fazo-navy border border-white/50 px-8 py-4 rounded-lg font-jakarta font-bold text-sm hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  <Download className="w-4.5 h-4.5 text-[#0A7C86]" /> Download Brochure
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Product Overview Section */}
      <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-10 mt-20 pb-16">
        <div className="relative rounded-[2rem] overflow-hidden bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_20px_50px_rgba(0,108,118,0.03)] pt-12 pb-14 px-8 md:px-16 text-left">
          <div className="mb-8">
            <span className="text-[11px] font-jakarta font-extrabold tracking-[0.2em] text-[#0A7C86] uppercase mb-2 block">
              Product Overview
            </span>
            <h2 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-fazo-navy">
              About {product.name}
            </h2>
          </div>
          
          <div className="prose prose-slate max-w-none text-left">
            {renderRichText(product.description)}
          </div>
        </div>
      </div>

      {/* ========== FEATURES SECTION ========== */}
      {features.length > 0 && (
        <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-10 pb-16">
          <div className="relative rounded-[2rem] overflow-hidden bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_20px_50px_rgba(0,108,118,0.03)] pt-12 pb-14 px-8 md:px-16 text-left">
            <div className="mb-10">
              <span className="text-[11px] font-jakarta font-extrabold tracking-[0.2em] text-[#0A7C86] uppercase mb-2 block">
                What's Included
              </span>
              <h2 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-fazo-navy">
                Features & Capabilities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#004d54] to-[#0A7C86] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-sans text-sm sm:text-[15px] text-fazo-gray leading-relaxed group-hover:text-fazo-navy transition-colors">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== SPECIFICATIONS TABLE ========== */}
      {specifications.length > 0 && (
        <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-10 pb-16">
          <div className="relative rounded-[2rem] overflow-hidden bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_20px_50px_rgba(0,108,118,0.03)] pt-12 pb-14 px-8 md:px-16 text-left">
            <div className="mb-10">
              <span className="text-[11px] font-jakarta font-extrabold tracking-[0.2em] text-[#0A7C86] uppercase mb-2 block">
                Technical Details
              </span>
              <h2 className="font-jakarta font-extrabold text-2xl sm:text-3xl text-fazo-navy">
                Specifications
              </h2>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/60">
              <table className="w-full">
                <tbody>
                  {specifications.map((spec, i) => (
                    <tr 
                      key={i} 
                      className={`${i % 2 === 0 ? 'bg-white/30' : 'bg-[#E6F3F5]/40'} hover:bg-[#E6F3F5]/60 transition-colors`}
                    >
                      <td className="py-4 px-6 font-jakarta font-bold text-sm text-fazo-navy w-[40%] border-r border-white/50">
                        {spec.key}
                      </td>
                      <td className="py-4 px-6 font-sans text-sm text-fazo-gray">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========== BROCHURE DOWNLOAD BANNER ========== */}
      {brochureUrl && (
        <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-10 pb-16">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#004d54] to-[#0A7C86] px-8 md:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-left">
              <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-jakarta font-extrabold text-lg text-white mb-1">
                  Download Product Brochure
                </h3>
                <p className="font-sans text-sm text-white/70">
                  Get detailed specifications, images, and pricing information in a PDF document.
                </p>
              </div>
            </div>
            <a 
              href={brochureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-[#004d54] px-8 py-3.5 rounded-xl font-jakarta font-bold text-sm hover:bg-white/90 hover:-translate-y-0.5 transition-all shadow-lg flex-shrink-0"
            >
              <Download className="w-4.5 h-4.5" /> Download PDF
            </a>
          </div>
        </div>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 border-t border-fazo-border/60 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div className="text-left">
              <h3 className="font-jakarta font-extrabold text-xl sm:text-2xl text-fazo-navy">
                Related Equipment
              </h3>
              <p className="font-sans text-xs sm:text-sm text-fazo-gray mt-1">
                Other high-precision models in the {category.name} collection.
              </p>
            </div>
            <Link 
              to={`/products/${category.slug}`} 
              className="text-xs font-bold text-[#0A7C86] hover:underline flex items-center gap-1"
            >
              View All Category <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((prod) => (
              <div 
                key={prod.id}
                className="group flex flex-col h-full bg-white/70 backdrop-blur-md rounded-xl border border-white/50 shadow-sm hover:shadow-[0_15px_30px_rgba(0,111,122,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="h-40 w-full bg-[#E1EDF0] relative overflow-hidden flex-shrink-0">
                  <img 
                    src={getAssetPath(prod.image)} 
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow text-left justify-between bg-gradient-to-b from-white/10 to-white/35">
                  <div>
                    <h4 className="font-jakarta font-bold text-[14px] text-fazo-navy mb-1 group-hover:text-[#0A7C86] transition-colors leading-tight line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="font-sans text-[11px] text-fazo-gray leading-normal mb-3 line-clamp-2">
                      {prod.shortDescription}
                    </p>
                  </div>
                  <Link 
                    to={`/products/${category.slug}/${prod.slug}`}
                    className="btn-3d-teal text-white w-full py-2 rounded-lg font-jakarta font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Form Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-fazo-navy/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsInquiryModalOpen(false)}
          ></div>
          
          {/* Form Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/70 shadow-2xl p-6 md:p-8 max-w-md w-full relative z-10 animate-fade-in text-left">
            <h3 className="font-jakarta font-extrabold text-xl text-fazo-navy mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#0A7C86]" /> Product Inquiry
            </h3>
            <p className="font-sans text-xs text-fazo-gray mb-6 leading-relaxed">
              Fill out the form below to receive a custom price quotation, technical consultation, or dealership inquiry for the **{product.name}**.
            </p>

            <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-fazo-navy uppercase mb-1.5">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg border border-fazo-border/80 bg-white/60 focus:outline-none focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86] text-sm text-fazo-navy transition"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-fazo-navy uppercase mb-1.5">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-fazo-border/80 bg-white/60 focus:outline-none focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86] text-sm text-fazo-navy transition"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-fazo-navy uppercase mb-1.5">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-2.5 rounded-lg border border-fazo-border/80 bg-white/60 focus:outline-none focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86] text-sm text-fazo-navy transition"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-fazo-navy uppercase mb-1.5">Message / Requirements</label>
                <textarea 
                  rows="3"
                  placeholder={`I am interested in ordering the ${product.name}. Please provide pricing details for 2 units...`}
                  className="w-full px-4 py-2.5 rounded-lg border border-fazo-border/80 bg-white/60 focus:outline-none focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86] text-sm text-fazo-navy transition resize-none"
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="flex-1 py-3 border border-fazo-border rounded-lg text-xs font-bold text-fazo-navy hover:bg-fazo-light transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inquirySubmitted}
                  className="flex-1 btn-3d-teal text-white py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {inquirySubmitted ? 'Sending...' : 'Send Inquiry'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
