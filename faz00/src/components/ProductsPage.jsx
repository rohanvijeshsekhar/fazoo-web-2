import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getImageUrl } from '../lib/db';
import { ArrowRight, Wrench, Camera, Zap, Layers, Cpu, Wind, Package } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductsPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(data => setCategories(Array.isArray(data) ? data : []));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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


  return (
    <div className="w-full flex-grow relative overflow-hidden bg-white mt-[-100px]">

      {/* Refined Products Hero Section (83vh height total) */}
      <div className="relative h-[83vh] w-full bg-white flex flex-col justify-start">

        {/* Background Image Container (75vh height - occupies approx 75% of hero section height) */}
        <div className="relative h-[75vh] w-full overflow-hidden flex flex-col justify-start border-b border-faazo-border/30 bg-white">

          {/* Static Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url('/hero/clinical_ecosystem_hero_light.png')`,
              backgroundPosition: 'center 18%', // shift face down to sit below navbar
            }}
          />

          {/* White-to-transparent subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10" />

          {/* Soft Green Glow Accent (Subtle, FAAZO green #0A7C86) */}
          <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#0A7C86]/5 blur-[120px] pointer-events-none z-10 animate-pulse" />

          {/* Content Container (Left Aligned, Vertically Centered with my-auto to avoid top clipping) */}
          <div className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 z-20 relative h-full flex flex-col justify-center pt-[100px] pb-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-[700px] my-auto"
            >
              {/* Main Heading */}
              <h1 className="font-jakarta font-extrabold text-[32px] sm:text-[42px] md:text-[52px] lg:text-[62px] leading-[1.1] text-faazo-navy tracking-tight mb-5">
                Explore Our <br />
                <span className="text-[#0A7C86]">
                  Clinical Ecosystem
                </span>
              </h1>

              {/* Description */}
              <p className="font-sans text-xs sm:text-sm md:text-[15px] text-faazo-gray max-w-[580px] leading-relaxed mb-0">
                Equipping dental clinics and laboratories with precision instruments, ergonomic treatment chairs, high-definition visualization tools, and intelligent software to ensure excellent patient outcomes.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Visible whitespace below the image before the next section begins (8vh height) */}
        <div className="h-[8vh] w-full bg-white border-b border-faazo-border/10"></div>
      </div>

      {/* Category Showcase Section */}
      <div id="categories-section" className="w-full max-w-[1300px] mx-auto px-6 lg:px-10 pb-24 relative z-10 scroll-mt-6 bg-white">

        {/* Section Header */}
        <div className="mb-24 text-center">
          <h2 className="font-jakarta font-bold text-[13px] tracking-[0.2em] text-[#0A7C86] uppercase mb-3">
            Featured Categories
          </h2>
          <p className="font-sans text-[15px] sm:text-base text-faazo-gray max-w-[800px] mx-auto leading-relaxed">
            Select a category to discover FAAZO's advanced portfolio of dental technologies, precision instruments, and clinical solutions designed to help dental professionals achieve superior efficiency, accuracy, and patient care while meeting the highest international quality standards.
          </p>
        </div>

        {/* Category Showcase Grid */}
        <div className="max-w-[1050px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              return (
                <Link
                  key={cat.id}
                  to={`/products/${cat.slug}`}
                  className="w-full max-w-[280px] sm:max-w-[320px] h-[460px] sm:h-[495px] mx-auto glass-category-card rounded-[24px] overflow-hidden flex flex-col group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="h-[270px] sm:h-[305px] w-full overflow-hidden relative flex-shrink-0">
                    <img
                      src={getImageUrl(cat.image) || "/hero/accessories_4_3.webp"}
                      alt={cat.name}
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
                      <h3 className="font-jakarta font-bold text-base sm:text-lg text-faazo-navy mb-1.5 leading-snug group-hover:text-[#0A7C86] transition-colors duration-300">
                        {cat.name}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed mb-3 line-clamp-2">
                        {cat.description}
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
        </div>

      </div>
    </div>
  );
};
