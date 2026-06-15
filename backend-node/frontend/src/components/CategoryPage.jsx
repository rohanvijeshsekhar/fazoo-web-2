import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategoryBySlug, getProductsByCategory, getImageUrl } from '../lib/db';
import { ArrowRight, ShieldCheck, ChevronRight, AlertCircle, HelpCircle, Send, Download } from 'lucide-react';

const getAssetPath = (path) => {
  return getImageUrl(path) || "/hero/accessories_4_3.webp";
};

export const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const handleDownloadClick = (e) => {
    if (!category || !category.brochure) {
      e.preventDefault();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCategoryBySlug(categorySlug),
      getProductsByCategory(categorySlug)
    ]).then(([cat, prods]) => {
      if (cat) {
        setCategory(cat);
        const activeProds = Array.isArray(prods)
          ? prods.filter(p => p.active !== false).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          : [];
        setProducts(activeProds);
        document.title = `${cat.name} | FAAZO Dental Technology`;
      } else {
        setCategory(null);
        setProducts([]);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setCategory(null);
      setProducts([]);
      setLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="w-full flex-grow py-32 flex items-center justify-center bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A7C86]"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="w-full flex-grow py-32 flex flex-col items-center justify-center bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4] px-6 text-center">
        <AlertCircle className="w-16 h-16 text-[#0A7C86] mb-4" />
        <h2 className="font-jakarta font-extrabold text-2xl text-faazo-navy mb-2">Category Not Found</h2>
        <p className="font-sans text-sm text-faazo-gray max-w-sm mb-6 leading-relaxed">
          The product category you are looking for does not exist or has been removed from the catalog.
        </p>
        <Link to="/products" className="btn-3d-teal text-white px-6 py-3 rounded-lg font-jakarta font-bold text-sm">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow pb-24 relative bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4]">
      {/* Breadcrumbs */}
      <div className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 pt-6">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-faazo-gray text-left">
          <Link to="/products" className="hover:text-[#0A7C86] transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#0A7C86]">{category.name}</span>
        </div>
      </div>

      {/* Section 1: Redesigned Hero Banner (Split Layout) */}
      <div className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 pt-6 pb-12">
        <div 
          className="relative rounded-[2.5rem] overflow-hidden bg-[#F2F5F6] border border-[#E1EDF0]/90 shadow-[0_20px_50px_rgba(0,108,118,0.02)] p-8 md:p-14 lg:p-16"
          style={{
            backgroundImage: `
              radial-gradient(circle at 0% 0%, rgba(10, 124, 134, 0.06) 0%, transparent 60%),
              radial-gradient(circle at 100% 100%, rgba(46, 165, 176, 0.05) 0%, transparent 60%),
              linear-gradient(rgba(10, 124, 134, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(10, 124, 134, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 28px 28px, 28px 28px',
            backgroundRepeat: 'no-repeat, no-repeat, repeat, repeat',
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-8 relative z-10">
            
            {/* Left Side Content (55%) */}
            <div className="w-full lg:w-[48%] text-left flex flex-col items-start justify-center">
              <span className="text-[11px] font-jakarta font-extrabold tracking-[0.25em] text-[#0A7C86] uppercase mb-4 px-3 py-1 rounded-full bg-[#0A7C86]/5 border border-[#0A7C86]/10 shadow-sm inline-block">
                Category Showcase
              </span>
              <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] text-faazo-navy tracking-tight mb-6">
                {category.name}
              </h1>
              <p className="font-sans text-sm sm:text-base md:text-[17px] leading-relaxed text-faazo-gray max-w-[480px] mb-8">
                {category.description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const el = document.getElementById('models-grid-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto btn-3d-teal text-white px-7 py-3.5 rounded-xl font-jakarta font-bold text-xs flex items-center justify-center gap-2 group transition-all duration-300"
                >
                  Explore Models
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <a
                  href={category.brochure ? getImageUrl(category.brochure) : '#'}
                  target={category.brochure ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  download={!!category.brochure}
                  onClick={handleDownloadClick}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-jakarta font-bold text-[#0A7C86] hover:text-[#006f7a] transition-all py-3.5 px-6 rounded-xl hover:bg-[#0A7C86]/5 border border-transparent hover:border-[#0A7C86]/10"
                >
                  <Download className="w-4 h-4 text-[#0A7C86]" />
                  Download Brochure
                </a>
              </div>
            </div>

            {/* Right Side: Free-standing Product Showcase (48%) */}
            <div className="w-full lg:w-[48%] flex items-center justify-center relative py-6 lg:py-0">
              {/* Soft FAAZO green radial glow behind the product */}
              <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full bg-[#0A7C86]/10 blur-[85px] pointer-events-none z-0"></div>
              
              {/* Aspect Ratio Container for Larger Image */}
              <div className="relative w-full max-w-[500px] aspect-[4/3] flex items-center justify-center z-10">
                <img 
                  src={getAssetPath(category.image)} 
                  alt={category.name}
                  className="w-full h-full object-cover rounded-2xl border border-gray-200/40 shadow-[0_12px_32px_rgba(0,0,0,0.035)]"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Section 2: About This Category */}
      {category.overview && (
        <div className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 pb-16">
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-8 text-left">
            <h2 className="font-jakarta font-bold text-lg text-faazo-navy mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0A7C86]" /> About {category.name}
            </h2>
            <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-faazo-gray max-w-[900px]">
              {category.overview}
            </p>
          </div>
        </div>
      )}

      {/* Section 3: Products Under This Category */}
      <div id="models-grid-section" className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 scroll-mt-24">
        <div className="border-b border-faazo-border/70 pb-4 mb-8 text-left">
          <h3 className="font-jakarta font-extrabold text-xl sm:text-2xl text-faazo-navy">
            Available Models
          </h3>
          <p className="font-sans text-xs sm:text-sm text-faazo-gray mt-1">
            Browse high-performance {category.name.toLowerCase()} catalogued below.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 p-12 text-center">
            <AlertCircle className="w-10 h-10 text-faazo-gray/60 mx-auto mb-3" />
            <h4 className="font-jakarta font-bold text-base text-faazo-navy mb-1">No Models Registered</h4>
            <p className="font-sans text-xs text-faazo-gray max-w-xs mx-auto mb-4">
              Products for this category are currently being listed in the catalog. Please check back later.
            </p>
            <Link to="/products" className="text-xs font-bold text-[#0A7C86] hover:underline">
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((prod) => (
              <div 
                key={prod.id}
                className="group flex flex-col h-full bg-white/70 backdrop-blur-md rounded-xl border border-white/50 shadow-sm hover:shadow-[0_15px_30px_rgba(0,111,122,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Product Image Area with Fixed Height */}
                <div className="h-44 w-full bg-[#E1EDF0] relative overflow-hidden flex-shrink-0">
                  <img 
                    src={getAssetPath(prod.image)} 
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                </div>

                {/* Card Details: Flex grow to guarantee identical heights */}
                <div className="p-5 flex flex-col flex-grow text-left justify-between bg-gradient-to-b from-white/10 to-white/35">
                  <div className="flex-grow">
                    <h4 className="font-jakarta font-bold text-[15px] text-faazo-navy mb-1.5 group-hover:text-[#0A7C86] transition-colors leading-tight line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="font-sans text-[12px] text-faazo-gray leading-normal mb-4 line-clamp-2">
                      {prod.shortDescription}
                    </p>
                  </div>

                  <Link 
                    to={`/products/${category.slug}/${prod.slug}`}
                    className="btn-3d-teal text-white w-full py-2.5 rounded-lg font-jakarta font-bold text-xs flex items-center justify-center gap-1.5 mt-auto"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-5 py-3.5 bg-[#004d54]/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-[#0A7C86]/20 flex items-center gap-2.5 font-jakarta text-xs font-bold animate-bounce">
          <AlertCircle className="w-4 h-4 text-[#82E0E8]" />
          <span>No brochure available</span>
        </div>
      )}

    </div>
  );
};
