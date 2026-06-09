import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { ProductsPage } from './components/ProductsPage';
import { CategoryPage } from './components/CategoryPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { DealerNetworkPage } from './components/DealerNetworkPage';
import { CareersPage } from './components/CareersPage';
import { ContactPage } from './components/ContactPage';
import { AboutPage } from './components/AboutPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminStats } from './components/admin/AdminStats';
import { AdminTestimonials } from './components/admin/AdminTestimonials';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminDealers } from './components/admin/AdminDealers';
import { AdminCareers } from './components/admin/AdminCareers';
import { AdminApplications } from './components/admin/AdminApplications';
import { AdminEnquiries } from './components/admin/AdminEnquiries';
import { getCategories, getStats, getTestimonials, getImageUrl } from './lib/db';
import { CtaCard } from "@/components/ui/cta-card";
import { Globe as CobeGlobe } from "./components/ui/cobe-globe";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
import {
  ShieldCheck,
  Activity,
  Home as HomeIcon,
  Briefcase,
  Package,
  Globe,
  ChevronDown,
  Search,
  ArrowRight,
  Menu,
  X,
  Play,
  Headphones,
  Cpu,
  Award,
  Camera,
  Sparkles,
  Layers,
  Scissors,
  HeartPulse,
  Zap,
  Wind,
  Wrench,
  Building,
  CalendarCheck,
  Landmark,
  Users,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Logo = () => (
  <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center group">
    <img src="/hero/fazologo.png" alt="FAZO" className="h-8 w-auto object-contain" />
  </Link>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'products', 'explore', or null
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (sectionId) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/contact')) return 'Contact';
    if (path.startsWith('/about')) return 'About';
    if (path.startsWith('/admin')) return 'Admin';
    return 'Home';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <header className={`sticky top-4 mx-auto max-w-[1300px] w-[calc(100%-2rem)] z-50 rounded-2xl glass-navbar-3d transition-all duration-300 ${isScrolled ? 'bg-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,111,122,0.12)] border-white/50' : ''
        }`}>
      <div className="px-6 lg:px-10 h-18 py-3.5 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link
            to="/"
            onClick={() => handleNavClick(null)}
            className={`relative font-jakarta font-semibold text-[15px] transition-colors duration-200 ${activeTab === 'Home'
              ? 'text-[#0A7C86] nav-link-active'
              : 'text-fazo-navy hover:text-[#0A7C86]'
              }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`relative font-jakarta font-semibold text-[15px] transition-colors duration-200 ${activeTab === 'About'
                ? 'text-[#0A7C86] nav-link-active'
                : 'text-fazo-navy hover:text-[#0A7C86]'
              }`}
          >
            About
          </Link>

          {/* Products Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown('products')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              to="/products"
              onClick={() => setActiveDropdown(null)}
              className={`flex items-center gap-1 font-jakarta font-semibold text-[15px] transition-colors duration-200 ${activeTab === 'Products' || activeDropdown === 'products'
                ? 'text-[#0A7C86]'
                : 'text-fazo-navy hover:text-[#0A7C86]'
                }`}
            >
              Products <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
            </Link>

            <AnimatePresence>
              {activeDropdown === 'products' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-[calc(100%+8px)] left-0 w-80 p-2 bg-white/95 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_15px_30px_rgba(11,37,48,0.1)] z-50 flex flex-col gap-0.5 pointer-events-auto"
                >
                  {categories.map((cat, idx) => (
                    <Link
                      key={idx}
                      to={`/products/${cat.slug}`}
                      onClick={() => setActiveDropdown(null)}
                      className="px-3 py-2.5 rounded-lg text-[14px] font-semibold text-fazo-navy hover:text-[#0A7C86] hover:bg-[#0A7C86]/5 transition-all duration-200 text-left"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Explore Dropdown */}
          <div
            className="relative py-2"
            onMouseEnter={() => setActiveDropdown('explore')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 font-jakarta font-semibold text-[15px] transition-colors duration-200 ${activeDropdown === 'explore'
                ? 'text-[#0A7C86]'
                : 'text-fazo-navy hover:text-[#0A7C86]'
                }`}
            >
              Explore <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'explore' ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {activeDropdown === 'explore' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-[calc(100%+8px)] left-0 w-52 p-2 bg-white/95 backdrop-blur-xl rounded-xl border border-white/50 shadow-[0_15px_30px_rgba(11,37,48,0.1)] z-50 flex flex-col gap-0.5 pointer-events-auto"
                >
                  <Link
                    to="/dealer-network"
                    onClick={() => setActiveDropdown(null)}
                    className="px-3 py-2 rounded-lg text-[14px] font-semibold text-fazo-navy hover:text-[#0A7C86] hover:bg-[#0A7C86]/5 transition-all duration-200 text-left w-full block"
                  >
                    Dealer Network
                  </Link>
                  <Link
                    to="/careers"
                    onClick={() => setActiveDropdown(null)}
                    className="px-3 py-2 rounded-lg text-[14px] font-semibold text-fazo-navy hover:text-[#0A7C86] hover:bg-[#0A7C86]/5 transition-all duration-200 text-left w-full block"
                  >
                    Careers
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/contact"
            className={`relative font-jakarta font-semibold text-[15px] transition-colors duration-200 ${activeTab === 'Contact'
              ? 'text-[#0A7C86] nav-link-active'
              : 'text-fazo-navy hover:text-[#0A7C86]'
              }`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-full text-fazo-navy hover:bg-white/40 hover:text-[#0A7C86] border border-transparent hover:border-white/35 transition-all duration-200">
            <Search className="w-5 h-5" />
          </button>
          <a
            href="tel:+918848922846"
            className="hidden sm:flex items-center gap-2 btn-3d-teal text-white px-5 py-2.5 rounded-lg font-jakarta font-bold text-sm group"
          >
            Get in Touch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            className="md:hidden p-2 rounded-lg text-fazo-navy hover:bg-white/40 border border-transparent hover:border-white/30 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile Menu - Full Screen Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed top-0 right-0 w-[85%] max-w-[340px] h-full bg-white z-50 shadow-[-10px_0_40px_rgba(0,0,0,0.1)] flex flex-col overflow-y-auto"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <img src="/hero/fazologo.png" alt="FAZO" className="h-7 w-auto object-contain" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-5 flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => handleNavClick(null)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-jakarta font-semibold text-[15px] transition-all duration-200 ${
                    activeTab === 'Home'
                      ? 'bg-[#0A7C86]/8 text-[#0A7C86] border-l-[3px] border-[#0A7C86]'
                      : 'text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent'
                  }`}
                >
                  <HomeIcon className="w-[18px] h-[18px]" />
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-jakarta font-semibold text-[15px] transition-all duration-200 ${
                    activeTab === 'About'
                      ? 'bg-[#0A7C86]/8 text-[#0A7C86] border-l-[3px] border-[#0A7C86]'
                      : 'text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent'
                  }`}
                >
                  <Users className="w-[18px] h-[18px]" />
                  About
                </Link>

                {/* Products Accordion */}
                <div>
                  <button
                    onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-jakarta font-semibold text-[15px] transition-all duration-200 ${
                      activeTab === 'Products'
                        ? 'bg-[#0A7C86]/8 text-[#0A7C86] border-l-[3px] border-[#0A7C86]'
                        : 'text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent'
                    }`}
                  >
                    <Package className="w-[18px] h-[18px]" />
                    <span className="flex-1 text-left">Products</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isMobileProductsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="ml-10 mr-2 mt-1 mb-2 flex flex-col gap-0.5 border-l-2 border-gray-100 pl-4">
                          <Link
                            to="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2.5 text-[13px] font-bold text-[#0A7C86] hover:text-[#065f68] transition-colors"
                          >
                            All Products
                          </Link>
                          {categories.map((cat, idx) => (
                            <Link
                              key={idx}
                              to={`/products/${cat.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="py-2.5 text-[13px] font-medium text-gray-500 hover:text-[#0A7C86] transition-colors"
                            >
                              {cat.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Explore Accordion */}
                <div>
                  <button
                    onClick={() => setIsMobileExploreOpen(!isMobileExploreOpen)}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-jakarta font-semibold text-[15px] text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent transition-all duration-200"
                  >
                    <Layers className="w-[18px] h-[18px]" />
                    <span className="flex-1 text-left">Explore</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileExploreOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isMobileExploreOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="ml-10 mr-2 mt-1 mb-2 flex flex-col gap-0.5 border-l-2 border-gray-100 pl-4">
                          <Link
                            to="/dealer-network"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2.5 text-[13px] font-medium text-gray-500 hover:text-[#0A7C86] transition-colors flex items-center gap-2"
                          >
                            <MapPin className="w-3.5 h-3.5" /> Dealer Network
                          </Link>
                          <Link
                            to="/careers"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="py-2.5 text-[13px] font-medium text-gray-500 hover:text-[#0A7C86] transition-colors flex items-center gap-2"
                          >
                            <Briefcase className="w-3.5 h-3.5" /> Careers
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-jakarta font-semibold text-[15px] transition-all duration-200 ${
                    activeTab === 'Contact'
                      ? 'bg-[#0A7C86]/8 text-[#0A7C86] border-l-[3px] border-[#0A7C86]'
                      : 'text-gray-700 hover:bg-gray-50 border-l-[3px] border-transparent'
                  }`}
                >
                  <Mail className="w-[18px] h-[18px]" />
                  Contact
                </Link>
              </nav>

              {/* Bottom CTA */}
              <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50">
                <a
                  href="tel:+918848922846"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex justify-center items-center gap-2 bg-gradient-to-r from-[#0A7C86] to-[#0d8f9a] text-white py-3.5 rounded-xl font-jakarta font-bold text-sm shadow-lg shadow-[#0A7C86]/20 hover:shadow-[#0A7C86]/30 transition-all w-full"
                >
                  Get in Touch <ArrowRight className="w-4 h-4" />
                </a>
                <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-gray-400 font-medium">
                  <a href="tel:+918848922846" className="flex items-center gap-1 hover:text-[#0A7C86] transition-colors">
                    <Phone className="w-3 h-3" /> Call Us
                  </a>
                  <span>•</span>
                  <a href="mailto:info@fazo.in" className="flex items-center gap-1 hover:text-[#0A7C86] transition-colors">
                    <Mail className="w-3 h-3" /> Email
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const AnimatedStat = ({ value, label, icon: IconComponent }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  const targetNumber = parseInt(value.replace(/[^0-9]/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        let start = 0;
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const currentCount = Math.floor(easeProgress * targetNumber);
          setCount(currentCount);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(targetNumber);
          }
        };

        requestAnimationFrame(animate);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.disconnect();
      }
    };
  }, [targetNumber]);

  return (
    <div ref={elementRef} className="glass-card glass-interactive rounded-xl sm:rounded-2xl p-2 sm:p-5 flex flex-col items-center text-center group border border-white/50 hover:bg-white/50 hover:-translate-y-1 transition-all duration-300 shadow-sm">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/50 flex items-center justify-center text-fazo-teal mb-2 sm:mb-3 shadow-inner border border-white/50 transition-transform duration-300 group-hover:scale-110">
        <IconComponent className="w-4 h-4 sm:w-5 h-5" />
      </div>
      <span className="font-jakarta font-extrabold text-sm sm:text-2xl text-fazo-navy tracking-tight group-hover:text-fazo-teal transition-colors duration-300">
        {count}{suffix}
      </span>
      <span className="text-[9px] sm:text-xs text-fazo-gray font-semibold mt-1 leading-tight">{label}</span>
    </div>
  );
};

const iconMap = {
  ShieldCheck,
  Activity,
  Package,
  Globe,
  Users,
  Award
};

const Hero = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getStats().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setStats(data);
      } else {
        setStats([
          { label: "Years of Excellence", value: "10+", icon: "ShieldCheck" },
          { label: "Dental Clinics", value: "1000+", icon: "Activity" },
          { label: "Products", value: "5000+", icon: "Package" },
          { label: "Countries Served", value: "25+", icon: "Globe" }
        ]);
      }
    });
  }, []);

  return (
    <main className="relative overflow-x-hidden">
      <div className="w-full pt-8 lg:pt-0 pb-32 lg:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">

          {/* Left Column (Content) */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col items-start z-10 pl-6 lg:pl-[calc(max(3rem,calc((100vw-1400px)/2+3rem)))] pr-8 pt-12 lg:pt-0 lg:-mt-14 w-full">
            <div className="mb-4 text-left w-full pl-[2.5px]">
              <span className="font-sans font-bold text-[13px] tracking-[0.15em] text-fazo-teal">Precision • Innovation • Excellence</span>
            </div>

            <h1 className="font-jakarta font-extrabold text-[40px] sm:text-[44px] md:text-[56px] lg:text-[46px] xl:text-[54px] leading-[1.12] text-fazo-navy mb-6 tracking-tight">
              Advanced Dental Technology for <span className="text-fazo-teal">Better Outcomes</span>
            </h1>

            <p className="font-sans text-[15px] md:text-[16px] leading-[1.65] text-fazo-gray mb-8 max-w-[500px]">
              Empowering dental professionals with innovative solutions and reliable technologies for modern clinical excellence.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <Link to="/contact" className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#004d54] to-fazo-teal text-white px-7 py-4 rounded-lg font-jakarta font-bold text-[15px] shadow-[0_10px_30px_rgba(0,111,122,0.18)] hover:shadow-[0_15px_35px_rgba(0,111,122,0.28)] hover:-translate-y-0.5 border border-white/10 transition-all duration-300 group w-full sm:w-auto">
                Explore Solutions <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </Link>


            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center sm:flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-fazo-border/60 w-full">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-fazo-teal" />
                <span className="font-jakarta font-semibold text-[13px] text-fazo-navy leading-tight">Trusted<br /><span className="text-fazo-gray font-medium">Quality</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Headphones className="w-5 h-5 text-fazo-teal" />
                <span className="font-jakarta font-semibold text-[13px] text-fazo-navy leading-tight">Expert<br /><span className="text-fazo-gray font-medium">Support</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-fazo-teal" />
                <span className="font-jakarta font-semibold text-[13px] text-fazo-navy leading-tight">Innovative<br /><span className="text-fazo-gray font-medium">Technology</span></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-fazo-teal" />
                <span className="font-jakarta font-semibold text-[13px] text-fazo-navy leading-tight">Global<br /><span className="text-fazo-gray font-medium">Presence</span></span>
              </div>
            </div>
          </div>

          {/* Right Column (Expanded Image - Touches Right Edge) */}
          <div className="order-1 lg:order-2 lg:col-span-7 relative h-[320px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[720px] w-full overflow-hidden group hero-image-mask">
            <img src="/hero/hero_faazo.png"
              alt="Dental Professionals"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none hero-doctor-img" />
          </div>

        </div>
      </div>

      {/* Stats */}
      <div className="relative lg:absolute lg:bottom-12 lg:left-1/2 lg:-translate-x-1/2 w-full max-w-[960px] px-4 lg:px-8 z-20 -mt-16 lg:mt-0">
        <div className="bg-white/10 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_24px_60px_rgba(0,108,118,0.08)] border border-white/30 p-2.5 sm:p-6">
          <div className="grid grid-cols-4 gap-2 md:gap-6">
            {stats.map((stat, idx) => {
              const IconComp = iconMap[stat.icon] || ShieldCheck;
              return (
                <AnimatedStat key={idx} label={stat.label} value={stat.value} icon={IconComp} />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

const ProductShowcase = () => {
  const [cats, setCats] = useState([]);
  useEffect(() => {
    getCategories().then(data => setCats(Array.isArray(data) ? data : []));
  }, []);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'dental-handpieces': return Wrench;
      case 'intraoral-cameras': return Camera;
      case 'led-light-cure-units': return Zap;
      case 'dental-chairs': return Layers;
      case '3d-oral-scanners': return Cpu;
      case 'dental-air-compressors': return Wind;
      case 'advanced-equipment-accessories': return Package;
      default: return Package;
    }
  };

  const doubleCategories = [...cats, ...cats];

  return (
    <section className="py-24 bg-gradient-to-b from-[#F4F9FA] to-white relative overflow-hidden">
      {/* Background Soft Blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-fazo-cyan/10 blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-fazo-teal/10 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 mb-16 text-center relative z-10">
        <span className="font-sans font-bold text-[13px] tracking-[0.18em] text-[#0A7C86] uppercase mb-3 block">
          Featured Product Categories
        </span>
        <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-[40px] leading-tight text-fazo-navy mb-4 tracking-tight">
          Solutions for Every Dental Practice
        </h2>
        <p className="font-sans text-[15px] sm:text-base text-fazo-gray max-w-[680px] mx-auto leading-relaxed">
          Explore FAZO's comprehensive portfolio of advanced dental technologies designed to support modern clinical excellence.
        </p>
      </div>

      {/* Infinite Product Categories Carousel */}
      <div className="relative w-full overflow-hidden py-4 z-10">
        {/* Left & Right gradient overlays for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#F4F9FA] via-[#F4F9FA]/80 to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-20" />

        {doubleCategories.length > 0 && (
          <div className="animate-ticker flex gap-6 py-4">
            {doubleCategories.map((item, index) => {
              const Icon = getCategoryIcon(item.slug);
              return (
                <Link
                  key={index}
                  to={`/products/${item.slug}`}
                  className="w-[280px] sm:w-[320px] h-[460px] sm:h-[495px] flex-shrink-0 glass-category-card rounded-[24px] overflow-hidden flex flex-col group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="h-[270px] sm:h-[305px] w-full overflow-hidden relative flex-shrink-0">
                    <img
                      src={getImageUrl(item.image) || "/hero/accessories_4_3.webp"}
                      alt={item.name}
                      loading="eager"
                      decoding="sync"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E6F3F5]/85 via-transparent to-transparent pointer-events-none z-10"></div>

                    {/* Floating Category Icon */}
                    <div className="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-white/85 backdrop-blur-md flex items-center justify-center text-[#0A7C86] shadow-md border border-white/40 z-20">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="pt-4 px-5 pb-5 flex flex-col flex-grow justify-between bg-gradient-to-b from-[#E6F3F5]/70 via-white/80 to-[#EAF2F4]/70 border-t border-white/30 text-left">
                    <div>
                      <h3 className="font-jakarta font-bold text-base sm:text-lg text-fazo-navy mb-1.5 leading-snug group-hover:text-[#0A7C86] transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-fazo-gray leading-relaxed mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Circular Arrow CTA */}
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-jakarta font-bold text-xs text-[#0A7C86] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                        View Details
                      </span>
                      <div className="w-9 h-9 rounded-full bg-white/85 border border-white/50 flex items-center justify-center text-[#0A7C86] shadow-sm group-hover:bg-[#0A7C86] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                        <ArrowRight className="w-4.5 h-4.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

const testimonials = [
  {
    text: "FAAZO's high-speed dental handpieces have outstanding durability and zero vibration. Our dentists report much higher comfort during long surgeries.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop",
    name: "Dr. Ananya Nair",
    role: "Clinical Director, Pearl Dental Clinics",
  },
  {
    text: "As a wholesale distributor, logistics and consistency are key. FAAZO's prompt supply chain and robust packaging make them our top partner.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
    name: "Vikram Malhotra",
    role: "Managing Director, Apex MedSupplies",
  },
  {
    text: "We upgraded 24 clinical rooms with FAAZO's LED curing lights and chairs. Their engineering team managed the complete install with zero practice downtime.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=150&auto=format&fit=crop",
    name: "Dr. Rachel Thomas",
    role: "Chief of Dentistry, Lifeline Group Hospitals",
  },
  {
    text: "Their intraoral cameras have transformed our patient consultation. Showing high-definition real-time teeth scans builds immediate clinical trust.",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=150&auto=format&fit=crop",
    name: "Dr. Amit Sharma",
    role: "Founder, Sharma Dental & Implant Center",
  },
  {
    text: "The ergonomics of FAAZO's treatment chairs are unmatched. My patients fall asleep during long root canals, and my back pain is completely gone.",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=150&auto=format&fit=crop",
    name: "Dr. Sarah Al-Mansoori",
    role: "Pediatric Orthodontist, Smile UAE",
  },
  {
    text: "As dental equipment retailers, we need products that rarely need servicing. FAAZO equipment is incredibly reliable, and their tech support is outstanding.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    name: "Benjamin K. Chirchir",
    role: "CEO, East Africa Dental Supplies Ltd.",
  },
  {
    text: "Their quiet air compressors are a game-changer. We no longer have that constant loud background noise, making our clinic peaceful and relaxing.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    name: "Dr. Priya Sen",
    role: "Prosthodontist, Radiance Smile Studio",
  },
  {
    text: "The transition to FAAZO's 3D oral scanners was effortless. It cut our impression taking time down from 10 minutes to just under 90 seconds.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    name: "Dr. Thomas Mathews",
    role: "Head of Orthodontics, St. Mary's Dental College",
  },
  {
    text: "FAAZO offers premium European-grade quality dental tech at highly reasonable prices. Their post-sale warranty and spare parts availability are excellent.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop",
    name: "Rohan Kapoor",
    role: "Procurement Head, DentAlliance Group",
  }
];

const Testimonials = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getTestimonials().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setList(data);
      }
    });
  }, []);

  const displayList = list.length > 0 ? list.map(item => ({
    text: item.content,
    image: getImageUrl(item.image) || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop',
    name: item.name,
    role: `${item.designation}, ${item.company}`
  })) : testimonials;

  const firstColumn = displayList.slice(0, Math.ceil(displayList.length / 3));
  const secondColumn = displayList.slice(Math.ceil(displayList.length / 3), Math.ceil(displayList.length / 3) * 2);
  const thirdColumn = displayList.slice(Math.ceil(displayList.length / 3) * 2);

  return (
    <section className="bg-transparent py-20 relative overflow-hidden">
      {/* Background Soft Glow Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-fazo-cyan/10 blur-[110px] pointer-events-none z-0 animate-pulse"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-fazo-teal/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Center Highlight Light Effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] rounded-full bg-gradient-to-tr from-[#2EA5B0]/20 via-[#0A7C86]/15 to-transparent blur-[125px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }}></div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[580px] mx-auto text-center mb-16"
        >
          <h2 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-[40px] leading-tight text-fazo-navy tracking-tight mt-0">
            What Our Partners Say
          </h2>
          <p className="font-sans text-[15px] sm:text-base text-fazo-gray mt-4 max-w-[480px]">
            See what leading clinicians, distributors, and healthcare facilities have to say about FAAZO's modern dental tech ecosystem.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] -webkit-[mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[720px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section className="bg-transparent py-20 relative overflow-hidden">
      {/* Background Soft Glow Blobs */}
      <div className="absolute top-[40%] left-[20%] w-[350px] h-[350px] rounded-full bg-fazo-cyan/5 blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[350px] h-[350px] rounded-full bg-fazo-teal/5 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-[1100px] mx-auto px-6 sm:px-8 relative z-10">
        <CtaCard
          title="GET IN TOUCH"
          subtitle={
            <>
              Partner with <span className="text-fazo-teal">FAAZO</span> Today
            </>
          }
          description="Have questions about our modern dental technologies, customized clinical integrations, or looking to partner with FAAZO? Speak with our expert support and clinical relations teams to elevate your practice."
          buttonText="Contact Our Team"
          imageSrc="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop"
          imageAlt="Modern friendly FAAZO dental clinical support staff"
          onButtonClick={() => console.log("Opening contact options...")}
        />
      </div>
    </section>
  );
};

const BrandExperience = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioning = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      const rect = container.getBoundingClientRect();
      const isAligned = rect.top >= -12 && rect.top <= 12;
      const delta = e.deltaY;

      if (!isAligned) {
        // If at the last slide and we are below the alignment threshold (scrolled past it), scroll freely
        if (activeIndex === 3 && rect.top < -12) return;
        // If at the first slide and we are above the alignment threshold (scrolled before it), scroll freely
        if (activeIndex === 0 && rect.top > 12) return;

        // If the section is partially visible, snap it into view on scroll
        if (rect.top > -window.innerHeight * 0.4 && rect.top < window.innerHeight * 0.4) {
          container.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      if (isTransitioning.current) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (delta > 0) {
        // Scroll Down
        if (activeIndex < 3) {
          if (e.cancelable) e.preventDefault();
          isTransitioning.current = true;
          setActiveIndex(prev => prev + 1);
          setTimeout(() => {
            isTransitioning.current = false;
          }, 650); // Lock for smooth transition
        }
      } else if (delta < 0) {
        // Scroll Up
        if (activeIndex > 0) {
          if (e.cancelable) e.preventDefault();
          isTransitioning.current = true;
          setActiveIndex(prev => prev - 1);
          setTimeout(() => {
            isTransitioning.current = false;
          }, 650); // Lock for smooth transition
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [activeIndex]);

  // Touch Swipe Support for Mobile Devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const rect = container.getBoundingClientRect();
      const isAligned = rect.top >= -15 && rect.top <= 15;

      if (!isAligned) return;

      const touchEndY = e.touches[0].clientY;
      const diffY = touchStartY - touchEndY;

      if (Math.abs(diffY) < 40) return; // ignore micro-drifts

      if (isTransitioning.current) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      if (diffY > 0) {
        // Swipe Up -> scroll down
        if (activeIndex < 3) {
          if (e.cancelable) e.preventDefault();
          isTransitioning.current = true;
          setActiveIndex(prev => prev + 1);
          setTimeout(() => {
            isTransitioning.current = false;
          }, 750);
        }
      } else {
        // Swipe Down -> scroll up
        if (activeIndex > 0) {
          if (e.cancelable) e.preventDefault();
          isTransitioning.current = true;
          setActiveIndex(prev => prev - 1);
          setTimeout(() => {
            isTransitioning.current = false;
          }, 750);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeIndex]);

  // Snap to top when the section takes up significant viewport area
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isTransitioning.current) {
          const rect = entry.target.getBoundingClientRect();
          if (rect.top > 0 && rect.top < window.innerHeight * 0.3) {
            entry.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleIndicatorClick = (idx) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setActiveIndex(idx);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 650);
  };

  const pillars = [
    {
      name: "Innovation",
      description: "We continuously embrace modern technology to support the evolving needs of dental professionals."
    },
    {
      name: "Precision",
      description: "Every solution is selected with a focus on accuracy, consistency, and clinical confidence."
    },
    {
      name: "Trust",
      description: "Built on long-term relationships, reliability, and commitment to professional excellence."
    },
    {
      name: "Excellence",
      description: "Delivering quality-driven solutions that help practices perform at their best."
    }
  ];

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden select-none scroll-mt-0">
      {/* Sticky Inner Frame Layout */}
      <div className={`h-full w-full flex flex-col justify-between pt-24 sm:pt-32 pb-12 px-6 sm:px-12 lg:px-24 transition-colors duration-1000 ease-in-out
        ${activeIndex === 0 ? 'bg-gradient-to-b from-[#F4F9FA] via-[#F4F9FA] to-[#EAF2F4]' : ''}
        ${activeIndex === 1 ? 'bg-gradient-to-b from-[#EAF2F4] via-[#F4F9FA] to-[#F1F6F7]' : ''}
        ${activeIndex === 2 ? 'bg-gradient-to-b from-[#F1F6F7] via-[#FAFDFD] to-[#E6F3F5]' : ''}
        ${activeIndex === 3 ? 'bg-gradient-to-b from-[#E6F3F5] via-white to-[#F4F9FA]' : ''}
      `}>
        {/* Shifting Ambient Background Glow Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Glow 1 - Innovation (Cyan, Top-Right) */}
          <div
            className={`absolute top-[10%] right-[10%] w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] rounded-full bg-fazo-cyan/25 filter blur-[90px] sm:blur-[130px] transition-opacity duration-1000 ease-in-out
              ${activeIndex === 0 ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Glow 2 - Precision (Teal, Bottom-Left) */}
          <div
            className={`absolute bottom-[10%] left-[10%] w-[300px] sm:w-[550px] h-[300px] sm:h-[550px] rounded-full bg-fazo-teal/20 filter blur-[100px] sm:blur-[150px] transition-opacity duration-1000 ease-in-out
              ${activeIndex === 1 ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Glow 3 - Trust (Soft Cyan, Center-Left) */}
          <div
            className={`absolute top-[25%] left-[20%] w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] rounded-full bg-[#82E0E8]/20 filter blur-[90px] sm:blur-[130px] transition-opacity duration-1000 ease-in-out
              ${activeIndex === 2 ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Glow 4 - Excellence (Teal/Navy, Bottom-Right) */}
          <div
            className={`absolute bottom-[15%] right-[15%] w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] rounded-full bg-fazo-teal/15 filter blur-[110px] sm:blur-[160px] transition-opacity duration-1000 ease-in-out
              ${activeIndex === 3 ? 'opacity-100' : 'opacity-0'}
            `}
          />

          {/* Thin, elegant background lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M-100,200 C300,100 800,600 1300,300 C1800,0 2000,500 2300,400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-fazo-teal transition-all duration-1000 ease-in-out"
              style={{
                strokeDasharray: '1000',
                strokeDashoffset: activeIndex * 250
              }}
            />
            <path
              d="M-50,600 C400,400 600,100 1200,500 C1800,900 1900,200 2200,300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-fazo-cyan transition-all duration-1000 ease-in-out"
              style={{
                strokeDasharray: '1000',
                strokeDashoffset: (3 - activeIndex) * 200
              }}
            />
          </svg>
        </div>

        {/* Section Header */}
        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between border-b border-fazo-border/60 pb-6">
          <div>
            <span className="font-sans font-bold text-[12px] sm:text-[13px] tracking-[0.25em] text-fazo-teal uppercase mb-2 block">
              WHY FAZO
            </span>
            <h2 className="font-jakarta font-extrabold text-2xl sm:text-4xl text-fazo-navy tracking-tight">
              Advancing the Future of Dentistry
            </h2>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {pillars.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleIndicatorClick(idx)}
                className="flex items-center group cursor-pointer focus:outline-none"
              >
                <span
                  className={`font-jakarta font-bold text-[11px] sm:text-[13px] transition-all duration-500 mr-1.5 sm:mr-2
                    ${idx === activeIndex ? 'text-fazo-teal scale-105' : 'text-fazo-gray/50 group-hover:text-fazo-navy'}
                  `}
                >
                  0{idx + 1}
                </span>
                <div className="h-[3px] sm:h-1 w-6 sm:w-8 bg-fazo-border/80 rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-fazo-teal transition-all duration-500"
                    style={{
                      width: idx === activeIndex ? '100%' : (idx < activeIndex ? '100%' : '0%')
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pillars Content Container with smooth fade and scale transitions */}
        <div className="relative z-10 flex-grow flex items-center justify-center min-h-[300px]">
          {pillars.map((pillar, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-out px-4
                  ${isActive
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-6 pointer-events-none'
                  }
                `}
              >
                {/* Massive Typography Word */}
                <h3
                  className="font-jakarta font-extrabold text-[54px] sm:text-[90px] md:text-[120px] lg:text-[150px] leading-none tracking-tighter text-transparent bg-clip-text select-none py-2 transition-transform duration-700"
                  style={{
                    backgroundImage: 'linear-gradient(180deg, #0B2530 0%, #1A3E4E 100%)'
                  }}
                >
                  {pillar.name}
                </h3>

                {/* Description */}
                <p className="mt-6 sm:mt-8 font-sans text-base sm:text-lg md:text-[21px] text-fazo-gray max-w-[680px] leading-relaxed font-medium transition-all duration-700 delay-75">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Section Footer */}
        <div className="relative z-10 w-full flex justify-between items-center text-[9px] sm:text-[11px] font-sans font-bold tracking-wider text-fazo-gray/50 border-t border-fazo-border/30 pt-6">
          <span>LUXURY DENTAL ECOSYSTEM</span>
          <span className="flex items-center gap-1.5 text-fazo-teal">
            SCROLL TO EXPLORE <span className="text-[12px] animate-bounce">↓</span>
          </span>
          <span>EST. 2026</span>
        </div>
      </div>
    </section>
  );
};

const DentalChairIcon = ({ className = "w-5 h-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 20h12" />
    <path d="M12 20v-5" />
    <path d="M6 9l2 4h7l3 3" />
    <path d="M6 9V7" />
    <circle cx="6" cy="5" r="1.5" />
    <path d="M9 11h5" />
  </svg>
);

const fazoMarkers = [
  { id: "india-hq", location: [8.5241, 76.9366], label: "India HQ (Kerala)" },
  { id: "dubai", location: [25.2048, 55.2708], label: "Middle East" },
  { id: "nairobi", location: [-1.2921, 36.8219], label: "Africa" },
  { id: "london", location: [51.5074, -0.1278], label: "Europe" }
];

const fazoArcs = [
  {
    id: "india-dubai",
    from: [8.5241, 76.9366],
    to: [25.2048, 55.2708],
    label: "India → Middle East"
  },
  {
    id: "india-nairobi",
    from: [8.5241, 76.9366],
    to: [-1.2921, 36.8219],
    label: "India → Africa"
  },
  {
    id: "india-london",
    from: [8.5241, 76.9366],
    to: [51.5074, -0.1278],
    label: "India → Europe"
  }
];

const marqueeItems = [
  "India",
  "Africa",
  "Middle East",
  "Global Exports",
  "Dental Technology",
  "International Presence",
  "Made in India",
  "Trusted Worldwide",
  "Clinical Excellence",
  "Global Expansion",
  "Dental Innovation",
  "Healthcare Technology"
];

const GlobalPresence = () => {
  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC] relative overflow-hidden border-t border-fazo-border/50">
      {/* Background glow effects */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#0A7C86]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-fazo-teal/5 blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 relative z-10">

        {/* TOP SECTION: Content Left & Globe Right (Overflowing right) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE CONTENT (60% width, dominant element) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8 z-10">
            <div className="pl-6 border-l-2 border-[#0A7C86]/20 relative flex flex-col items-start">
              {/* Vertical accent line top glow cap */}
              <div className="absolute top-0 left-[-2px] w-[2px] h-10 bg-gradient-to-b from-[#0A7C86] to-transparent rounded-full" />

              <span className="font-sans font-extrabold text-[11px] tracking-[0.2em] text-[#0A7C86] bg-[#0A7C86]/5 px-3.5 py-1.5 rounded-full uppercase mb-4 block">
                GLOBAL PRESENCE
              </span>

              <h2 className="font-jakarta font-extrabold text-3xl sm:text-[40px] leading-[1.15] text-fazo-navy mb-4 tracking-tight">
                Trusted Across Borders. <br className="hidden sm:inline" />
                Built for <span className="text-[#0A7C86]">Growth</span>.
              </h2>

              <p className="font-sans text-[15px] sm:text-[16px] leading-[1.7] text-fazo-gray text-justify">
                Starting from Kerala in 2014, FAZO has evolved into a trusted dental technology company serving dental clinics, hospitals, and educational institutions across India. Through years of industry expertise, reliable solutions, and customer-focused service, the company has built strong relationships with more than 1,500 healthcare and academic organizations. Today, FAZO continues its growth beyond national borders, expanding its presence through exports to Africa, the Middle East, and emerging global markets while showcasing Indian-made dental technology on the international stage.
              </p>
            </div>
          </div>

          {/* Spacer columns on desktop */}
          <div className="hidden lg:block lg:col-span-5" />

          {/* RIGHT SIDE GLOBE (40% width, secondary supporting visual, overflow right) */}
          <div className="relative lg:absolute lg:right-[-4%] lg:top-[50%] lg:-translate-y-1/2 w-full lg:w-[44%] max-w-[480px] aspect-square flex items-center justify-center overflow-visible z-0 pointer-events-auto">
            <CobeGlobe
              markers={fazoMarkers}
              arcs={fazoArcs}
              markerColor={[0.039, 0.486, 0.525]} // FAZO green [#0A7C86]
              baseColor={[0.9, 0.94, 0.95]}
              arcColor={[0.039, 0.486, 0.525]}
              glowColor={[0.95, 0.98, 0.98]}
              dark={0}
              mapBrightness={11}
              markerSize={0.03}
              markerElevation={0.015}
              className="w-full h-full"
            />
          </div>

        </div>

        {/* Logo Cloud Section */}
        <div className="mt-20 pt-10 border-t border-fazo-border/40 relative z-10">
          <div className="text-center mb-6">
            <h3 className="font-jakarta font-semibold text-fazo-navy text-base sm:text-lg tracking-tight">
              <span className="text-fazo-gray font-medium">Trusted by experts. </span>
              <span className="font-semibold">Used by the leaders.</span>
            </h3>
          </div>
          <LogoCloud items={marqueeItems} />
        </div>

      </div>
    </section>
  );
};

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="bg-black text-white pt-24 pb-12 relative overflow-hidden border-t border-white/5"
    >
      {/* World Map Watermark Background */}
      <div
        className="absolute inset-0 opacity-[0.03] select-none pointer-events-none z-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/hero/premium_world_map.png")'
        }}
      />

      {/* Radial soft green/teal glow behind logo area */}
      <div className="absolute top-0 left-[10%] w-[350px] h-[350px] rounded-full bg-[#0A7C86]/10 filter blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 relative z-10">

        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16">

          {/* Column 1: Brand Info (4/12 width) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-6">
            <div className="relative">
              {/* Soft logo glow cap */}
              <div className="absolute -inset-2 bg-gradient-to-r from-fazo-teal/20 to-fazo-cyan/20 blur-md opacity-70 rounded-full" />
              <img src="/hero/fazologo.png" alt="FAZO" className="relative h-8 w-auto object-contain brightness-0 invert" />
            </div>

            <p className="font-sans text-[14px] text-[#8E9CAE] leading-relaxed max-w-[320px]">
              Delivering innovative dental technologies, clinical solutions, and world-class support to dental professionals across India and international markets.
            </p>

            {/* Social Icons with premium Glassmorphism styling */}
            <div className="flex items-center gap-3.5 mt-2">
              {[
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Youtube, href: "#", label: "YouTube" }
              ].map((social, idx) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-fazo-teal/40 hover:text-[#0A7C86] flex items-center justify-center text-white/70 transition-all duration-300 backdrop-blur-md shadow-sm"
                  >
                    <IconComponent className="w-[18px] h-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links (2/12 width) */}
          <div className="lg:col-span-2 flex flex-col items-start gap-5">
            <h4 className="font-jakarta font-bold text-[14px] tracking-[0.1em] text-white uppercase">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3.5 w-full">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Products", href: "/products" },
                { name: "Dealer Network", href: "/dealer-network" },
                { name: "Careers", href: "/careers" },
                { name: "Global Presence", href: "/#global-presence", isSection: true, sectionId: 'global-presence' },
                { name: "Testimonials", href: "/#testimonials", isSection: true, sectionId: 'testimonials' },
                { name: "Contact", href: "/contact" }
              ].map((link, idx) => (
                <li key={idx}>
                  {link.isSection ? (
                    <button
                      onClick={() => {
                        if (window.location.pathname !== '/') {
                          window.location.href = link.href;
                        } else {
                          const el = document.getElementById(link.sectionId);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="font-sans text-[14px] text-[#8E9CAE] hover:text-[#0A7C86] transition-colors duration-300 relative py-0.5 group inline-block text-left"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#0A7C86] transition-all duration-300 group-hover:w-full" />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="font-sans text-[14px] text-[#8E9CAE] hover:text-[#0A7C86] transition-colors duration-300 relative py-0.5 group inline-block"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#0A7C86] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products (3/12 width) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-5">
            <h4 className="font-jakarta font-bold text-[14px] tracking-[0.1em] text-white uppercase">
              Products
            </h4>
            <ul className="flex flex-col gap-3.5 w-full">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/products/${cat.slug}`}
                    className="font-sans text-[14px] text-[#8E9CAE] hover:text-[#0A7C86] transition-colors duration-300 relative py-0.5 group inline-block text-left"
                  >
                    {cat.name}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#0A7C86] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information (3/12 width) */}
          <div className="lg:col-span-3 flex flex-col items-start gap-5">
            <h4 className="font-jakarta font-bold text-[14px] tracking-[0.1em] text-white uppercase">
              Contact Information
            </h4>
            <ul className="flex flex-col gap-4.5 w-full font-sans text-[14px] text-[#8E9CAE]">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#0A7C86] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Thiruvananthapuram, Kerala, India</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#0A7C86] shrink-0 mt-0.5" />
                <a href="tel:+918848922846" className="leading-relaxed hover:text-white transition-colors cursor-pointer">+91 88489 22846</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0A7C86] shrink-0 mt-0.5" />
                <a href="mailto:info@fazo.in" className="leading-relaxed hover:text-white transition-colors cursor-pointer">info@fazo.in</a>
              </li>
              <li className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-[#0A7C86] shrink-0 mt-0.5" />
                <a href="mailto:exports@faazodent.com" className="leading-relaxed hover:text-white transition-colors cursor-pointer">exports@faazodent.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Divider & Copyright */}
        <div className="pt-8 mt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[13px] text-[#5A6E7F] text-center sm:text-left">
            © 2026 Fazodent Dental Solutions Pvt Ltd. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-sans text-[13px] text-[#5A6E7F] hover:text-[#0A7C86] transition-colors py-0.5 relative group">
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#0A7C86] transition-all duration-300 group-hover:w-full" />
            </a>
            <a href="#" className="font-sans text-[13px] text-[#5A6E7F] hover:text-[#0A7C86] transition-colors py-0.5 relative group">
              Terms & Conditions
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#0A7C86] transition-all duration-300 group-hover:w-full" />
            </a>
            <Link to="/admin" className="font-sans text-[13px] text-[#5A6E7F] hover:text-[#0A7C86] transition-colors py-0.5 relative group">
              Admin Portal
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#0A7C86] transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>

      </div>
    </motion.footer>
  );
};

const Home = () => {
  return (
    <>
      <div id="home">
        <Hero />
      </div>
      <ProductShowcase />
      <div id="about">
        <BrandExperience />
      </div>
      <div id="global-presence">
        <GlobalPresence />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </>
  );
};

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    // Admin routes manage their own titles via AdminLayout
    if (path.startsWith('/admin')) return;
    if (path === '/') {
      document.title = "FAZO - Advanced Dental Technology";
    } else if (path === '/about') {
      document.title = "About Us | FAZO Dental Technology";
    } else if (path === '/products') {
      document.title = "Products | FAZO Dental Technology";
    } else if (path === '/dealer-network') {
      document.title = "Dealer Network | FAZO Dental Technology";
    } else if (path === '/careers') {
      document.title = "Careers | FAZO Dental Technology";
    } else if (path === '/contact') {
      document.title = "Contact Us | FAZO Dental Technology";
    }
  }, [location.pathname]);

  return null;
};

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4] font-sans text-fazo-navy antialiased">
      <div className="absolute top-[10%] right-[-5%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-fazo-cyan/20 blur-[100px] sm:blur-[130px] animate-float-slow pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-[-5%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-fazo-teal/15 blur-[110px] sm:blur-[140px] animate-float-medium pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[35%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[#82E0E8]/15 blur-[80px] sm:blur-[110px] pointer-events-none z-0 animate-float-fast"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:categorySlug" element={<CategoryPage />} />
          <Route path="/products/:categorySlug/:productSlug" element={<ProductDetailPage />} />
          <Route path="/dealer-network" element={<DealerNetworkPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>

        <Footer />

        <a
          href="https://wa.me/918848922846"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-transparent text-[#25D366] p-3 rounded-full hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const AppRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="dealers" element={<AdminDealers />} />
          <Route path="careers" element={<AdminCareers />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
        </Route>
      </Routes>
    );
  }

  return <PublicLayout />;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <TitleUpdater />
      <AppRoutes />
    </Router>
  );
};

export default App;
