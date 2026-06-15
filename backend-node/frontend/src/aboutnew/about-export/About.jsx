import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Award, Users, Globe, ShieldCheck, Lightbulb, HeartHandshake, CheckCircle, TrendingUp, Heart } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedStatCard = ({ number, suffix, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startAnimation();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [number]);

  const startAnimation = () => {
    const end = parseInt(number, 10);
    if (isNaN(end)) {
      setCount(number);
      return;
    }

    let startTime = null;
    const duration = 2000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(number);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-[24px] p-[1.5px] w-full flex items-stretch"
      style={{
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0px) scale(1)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0, 131, 143, 0.08)'
          : '0 12px 40px rgba(0, 108, 118, 0.02)',
        background: isHovered
          ? `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 131, 143, 0.25) 0%, rgba(0, 131, 143, 0.05) 100%)`
          : 'rgba(225, 237, 240, 0.6)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="w-full rounded-[23px] p-8 flex flex-col items-center text-center relative overflow-hidden group z-10"
        style={{
          background: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: isHovered ? 'blur(20px)' : 'blur(12px)',
          WebkitBackdropFilter: isHovered ? 'blur(20px)' : 'blur(12px)',
          transition: 'background-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        {/* Glass diagonal glare texture */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-0" />

        {/* Cursor Spotlight reflection inside the card */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(250px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 131, 143, 0.04), transparent 75%)`
            }}
          />
        )}

        {/* Circular Glass Badge for Icon */}
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-faazo-light/50 border border-faazo-border/50 shadow-sm text-[#00838F] mb-6 transition-transform duration-300 group-hover:scale-110 backdrop-blur-sm z-10">
          <Icon className="w-6.5 h-6.5 stroke-[1.5]" />
        </div>
        {/* Number */}
        <div className="font-jakarta font-extrabold text-[2.75rem] sm:text-[3.25rem] text-faazo-navy leading-none mb-3 tracking-tight selection:bg-[#00838F]/10 transition-colors duration-300 group-hover:text-[#00838F] z-10">
          {count}{suffix}
        </div>
        {/* Label */}
        <div className="text-[11px] sm:text-[12px] font-bold text-faazo-gray tracking-[0.1em] uppercase leading-relaxed max-w-[200px] font-jakarta z-10">
          {label}
        </div>
      </div>
    </div>
  );
};

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const stats = [
    { number: "11", suffix: "+", label: "Years Experience", icon: Award },
    { number: "1500", suffix: "+", label: "Clients Served", icon: Users },
    { number: "500", suffix: "+", label: "Installations Completed", icon: ShieldCheck },
    { number: "Global", suffix: "", label: "Presence", icon: Globe }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-white pt-8 pb-24 md:pb-32 overflow-hidden"
    >
      {/* Abstract Dotted Patterns in Corners */}
      <div className="absolute top-12 left-12 w-24 h-24 opacity-[0.06] text-[#00838F] pointer-events-none hidden md:block z-0">
        <svg width="96" height="96" fill="currentColor">
          <pattern id="dots-tl" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" />
          </pattern>
          <rect width="96" height="96" fill="url(#dots-tl)" />
        </svg>
      </div>

      <div className="absolute top-12 right-12 w-24 h-24 opacity-[0.06] text-[#00838F] pointer-events-none hidden md:block z-0">
        <svg width="96" height="96" fill="currentColor">
          <pattern id="dots-tr" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" />
          </pattern>
          <rect width="96" height="96" fill="url(#dots-tr)" />
        </svg>
      </div>

      {/* Soft Curved Line Graphics at the Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 opacity-[0.03] text-[#00838F] pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 120 C 360 160, 720 40, 1080 130 C 1260 175, 1380 110, 1440 100 L 1440 160 L 0 160 Z" fill="currentColor" />
          <path d="M0 90 C 400 130, 800 60, 1200 110 L 1440 80 L 1440 160 L 0 160 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 text-center">
        {/* Section Header */}
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="font-jakarta font-bold text-[12px] tracking-[0.25em] text-[#00838F] uppercase mb-4 block">
            Trusted by Dental Professionals
          </span>
          <h2 className="font-jakarta font-extrabold text-[32px] md:text-[42px] text-faazo-navy tracking-tight max-w-[700px] mx-auto mb-16 md:mb-20">
            Numbers That Reflect Our Commitment
          </h2>
        </div>

        {/* Stats Grid of Cards with separators */}
        <div className={`flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8 w-full max-w-[1200px] mx-auto transition-all duration-1000 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <div className="hidden lg:block w-[1px] bg-faazo-border/60 self-stretch my-8" />
              )}
              <div className="flex-1 flex">
                <AnimatedStatCard
                  number={stat.number}
                  suffix={stat.suffix}
                  label={stat.label}
                  icon={stat.icon}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
const JourneySection = () => {
  const [activeMilestone, setActiveMilestone] = useState(0);
  const milestoneRefs = useRef([]);
  const containerRef = useRef(null);
  const progressFillRef = useRef(null);
  const [lineStyle, setLineStyle] = useState({ top: 0, bottom: 0 });

  const milestones = [
    {
      year: "2014",
      title: "Foundation",
      description: "Founded as Fortune Dental Equipments in Thiruvananthapuram, Kerala, beginning a journey focused on supplying reliable dental equipment and technology solutions.",
      image: "/hero/about/timeline/im1.png"
    },
    {
      year: "2016",
      title: "Expansion",
      description: "Expanded into complete dental clinic setup solutions and professional equipment deployment services.",
      image: "/hero/about/timeline/im2.png"
    },
    {
      year: "2020",
      title: "Growth",
      description: "Successfully supplied and installed more than 500 dental chairs across clinics and healthcare institutions.",
      image: "/hero/about/timeline/im3.png"
    },
    {
      year: "2024",
      title: "Recognition",
      description: "Supported over 1,500 dental clinics, hospitals, and educational institutions through trusted products and technical expertise.",
      image: "/hero/about/timeline/im4.png"
    },
    {
      year: "2025",
      title: "Manufacturing",
      description: "Established Faazodent Dental Solutions Pvt Ltd and launched FAAZO as a dedicated manufacturing brand.",
      image: "/hero/about/timeline/im5.png"
    },
    {
      year: "Present",
      title: "Global Reach",
      description: "Expanding into Africa, the Middle East, and emerging international markets while advancing dental technology innovation.",
      image: "/hero/about/timeline/im6.png"
    }
  ];

  useEffect(() => {
    const calculateLine = () => {
      if (milestoneRefs.current.length >= 2) {
        const firstBlock = milestoneRefs.current[0];
        const lastBlock = milestoneRefs.current[milestoneRefs.current.length - 1];

        if (firstBlock && lastBlock) {
          const firstRect = firstBlock.getBoundingClientRect();
          const lastRect = lastBlock.getBoundingClientRect();
          const parentRect = firstBlock.parentElement.getBoundingClientRect();

          const top = (firstRect.top - parentRect.top) + (firstRect.height / 2);
          const bottom = parentRect.bottom - (lastRect.top + lastRect.height / 2);

          setLineStyle({ top, bottom });
        }
      }
    };

    // Run after a short delay to ensure rendering is complete
    const timer = setTimeout(calculateLine, 100);

    window.addEventListener('resize', calculateLine);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLine);
    };
  }, []);

  useEffect(() => {
    if (milestoneRefs.current.length === 0 || !progressFillRef.current) return;

    // 1. Progress line height animation
    const progressAnimation = gsap.fromTo(
      progressFillRef.current,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: milestoneRefs.current[0],
          start: "center center",
          endTrigger: milestoneRefs.current[milestoneRefs.current.length - 1],
          end: "center center",
          scrub: 0.5,
        }
      }
    );

    // 2. Individual triggers for updating active milestone
    const triggers = milestoneRefs.current.map((ref, idx) => {
      return ScrollTrigger.create({
        trigger: ref,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) {
            setActiveMilestone(idx);
          }
        }
      });
    });

    return () => {
      if (progressAnimation.scrollTrigger) {
        progressAnimation.scrollTrigger.kill();
      }
      progressAnimation.kill();
      triggers.forEach(t => t.kill());
    };
  }, [lineStyle]);



  return (
    <section
      ref={containerRef}
      className="relative bg-white pt-24 md:pt-32 pb-16 md:pb-20 flex flex-col lg:flex-row items-stretch border-t border-faazo-border/50"
    >
      {/* Left side: Sticky visual area (45%) */}
      <div className="w-full lg:w-[45%] flex flex-col items-stretch lg:sticky lg:top-28 lg:h-[calc(100vh-180px)] z-20 mb-4 lg:mb-0 px-6 lg:pl-16 lg:pr-8">
        <div className="flex flex-col mb-8">
          <span className="font-jakarta font-bold text-[12px] tracking-[0.25em] text-[#00838F] uppercase mb-3 block">
            OUR JOURNEY
          </span>
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[36px] lg:text-[40px] text-faazo-navy leading-tight tracking-tight">
            A Decade Of Growth, <br className="hidden lg:block" />Innovation & Trust
          </h2>
        </div>

        {/* Sticky Image Container */}
        <div className="hidden lg:block relative flex-grow h-[350px] sm:h-[450px] lg:h-auto overflow-hidden group rounded-2xl">
          {milestones.map((milestone, idx) => {
            const isActive = activeMilestone === idx;
            return (
              <div
                key={idx}
                className={`absolute inset-0 overflow-hidden transition-all duration-[1200ms] ease-out ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
              >
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Scrolling Content (55%) */}
      <div className="w-full lg:w-[55%] relative z-10 pl-0 pr-0">
        {/* Premium Vertical Progress Timeline */}
        <div
          className="absolute left-auto right-[30px] lg:left-0 lg:right-auto w-[2px] z-20"
          style={{ top: `${lineStyle.top}px`, bottom: `${lineStyle.bottom}px` }}
        >
          {/* Base light gray line */}
          <div className="absolute inset-0 bg-faazo-border/60 rounded-full" />

          {/* Progress fill line (Teal) */}
          <div
            ref={progressFillRef}
            className="absolute top-0 left-0 w-full bg-[#00838F] rounded-full origin-top"
          />
        </div>

        {/* Milestone sections */}
        <div className="flex flex-col">
          {milestones.map((milestone, idx) => {
            const isActive = activeMilestone === idx;
            const isCompleted = idx < activeMilestone;
            return (
              <div
                key={idx}
                ref={(el) => (milestoneRefs.current[idx] = el)}
                className={`min-h-0 lg:min-h-[80vh] flex flex-col justify-start lg:justify-center py-8 lg:py-20 pl-6 lg:pl-24 pr-16 lg:pr-24 relative transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) ${isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-10 translate-y-12 scale-[0.96]'}`}
              >
                {/* Timeline Node (Marker + Year label) */}
                <div className="absolute left-auto right-[30px] lg:left-0 lg:right-auto top-1/2 translate-x-1/2 lg:-translate-x-1/2 -translate-y-1/2 z-30 flex items-center">
                  {/* Circular Marker */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-125' : 'scale-100'
                      }`}
                  >
                    <div
                      className={`rounded-full border-2 transition-all duration-500 ${isActive
                        ? 'w-5 h-5 border-[#00838F] bg-white shadow-[0_0_16px_rgba(0,131,143,0.6)] flex items-center justify-center'
                        : isCompleted
                          ? 'w-4 h-4 border-[#00838F] bg-[#00838F]'
                          : 'w-4 h-4 border-gray-300 bg-white'
                        }`}
                    >
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-[#00838F] animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Year Label next to the marker (desktop only) */}
                  <span
                    className={`absolute left-8 font-jakarta font-bold text-xs transition-colors duration-500 whitespace-nowrap hidden xl:block ${isActive ? 'text-[#00838F]' : 'text-faazo-navy/35'
                      }`}
                  >
                    {milestone.year}
                  </span>
                </div>

                <span className="font-jakarta font-bold text-[12px] tracking-[0.25em] text-[#00838F] uppercase mb-2 block">
                  MILESTONE 0{idx + 1}
                </span>

                {/* Year display */}
                <div
                  className={`font-jakarta font-extrabold text-[80px] sm:text-[96px] lg:text-[104px] xl:text-[110px] leading-none mb-4 select-none transition-colors duration-[800ms] ${isActive ? 'text-[#00838F]' : 'text-faazo-navy/10'}`}
                >
                  {milestone.year}
                </div>

                {/* Title */}
                <h4 className="font-jakarta font-extrabold text-[24px] sm:text-[30px] text-faazo-navy mb-4 tracking-tight">
                  {milestone.title}
                </h4>

                {/* Description */}
                <p className="font-sans text-[15px] sm:text-[16px] leading-[1.7] text-faazo-gray max-w-[540px] mb-8 lg:mb-0">
                  {milestone.description}
                </p>

                {/* Mobile-only Image (Shown below description on small screens) */}
                <div className="block lg:hidden w-full h-[280px] sm:h-[350px] overflow-hidden mt-6">
                  <img 
                    src={milestone.image} 
                    alt={milestone.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const MissionVisionSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in and slide up text elements
      gsap.from(".animate-card-content", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white pt-16 md:pt-20 pb-28 md:pb-36 border-t border-faazo-border/40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
          <span className="animate-card-content font-jakarta font-bold text-[12px] tracking-[0.3em] text-[#00838F] uppercase mb-4 block">
            OUR PURPOSE
          </span>
          <h2 className="animate-card-content font-jakarta font-extrabold text-[32px] sm:text-[42px] lg:text-[48px] text-faazo-navy leading-tight tracking-tight max-w-[900px]">
            Driven By Mission, Defined By <span className="text-[#00838F]">Vision</span>
          </h2>
          <div className="animate-card-content w-12 h-[3px] bg-[#00838F] mt-8 rounded-full opacity-60"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Card 01 - Mission */}
          <div 
            className="group relative backdrop-blur-[24px] rounded-[32px] p-8 sm:p-12 lg:p-16 pt-8 sm:pt-10 lg:pt-12 transition-all duration-[400ms] ease-out hover:scale-[1.02] flex flex-col justify-start min-h-[400px] overflow-hidden border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.55)', 
              borderColor: 'rgba(11, 138, 143, 0.12)',
              boxShadow: '0 20px 60px rgba(11, 138, 143, 0.08)' 
            }}
          >
            {/* Soft teal gradient highlight in top-left corner */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#0B8A8F]/[0.08] blur-[60px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-[#0B8A8F]/[0.15]" />
            
            {/* Very subtle teal tint inside the glass */}
            <div className="absolute inset-0 bg-[#0B8A8F]/[0.06] pointer-events-none" />
            
            {/* Light reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Subtle teal glow around card edges on hover */}
            <div className="absolute inset-0 border border-transparent group-hover:border-[#0B8A8F]/[0.25] rounded-[32px] transition-all duration-500 pointer-events-none shadow-[inset_0_0_20px_rgba(11,138,143,0)] group-hover:shadow-[inset_0_0_20px_rgba(11,138,143,0.05)]" />

            {/* Vertical accent line */}
            <div className="absolute left-0 top-12 bottom-12 w-[4px] bg-[#0B8A8F] opacity-80 rounded-r-full relative z-20" />
            
            <div className="relative z-10">
              <span className="animate-card-content font-jakarta font-bold text-[11px] sm:text-[12px] tracking-[0.3em] text-[#0B8A8F] uppercase mb-4 block">
                01 — OUR MISSION
              </span>
              
              <h3 className="animate-card-content font-jakarta font-extrabold text-[32px] sm:text-[38px] lg:text-[44px] text-faazo-navy leading-[1.1] mb-6 tracking-tight">
                Empowering <br />
                <span className="text-[#0B8A8F] drop-shadow-sm">Dental Excellence</span>
              </h3>
              
              <p className="animate-card-content font-sans text-[15px] sm:text-[16px] leading-[1.8] text-faazo-gray max-w-[520px] opacity-90">
                At FAAZO, our mission is to empower dental professionals with innovative technologies, precision-engineered equipment, and dependable support solutions. We are committed to enhancing clinical efficiency, improving patient outcomes, and helping practices grow through reliable products, technical expertise, and long-term partnerships built on trust.
              </p>
            </div>
          </div>

          {/* Card 02 - Vision */}
          <div 
            className="group relative backdrop-blur-[24px] rounded-[32px] p-8 sm:p-12 lg:p-16 pt-8 sm:pt-10 lg:pt-12 transition-all duration-[400ms] ease-out hover:scale-[1.02] flex flex-col justify-start min-h-[400px] overflow-hidden border"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.55)', 
              borderColor: 'rgba(11, 138, 143, 0.12)',
              boxShadow: '0 20px 60px rgba(11, 138, 143, 0.08)' 
            }}
          >
            {/* Soft teal gradient highlight in top-left corner */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#0B8A8F]/[0.08] blur-[60px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-[#0B8A8F]/[0.15]" />
            
            {/* Very subtle teal tint inside the glass */}
            <div className="absolute inset-0 bg-[#0B8A8F]/[0.06] pointer-events-none" />
            
            {/* Light reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            {/* Subtle teal glow around card edges on hover */}
            <div className="absolute inset-0 border border-transparent group-hover:border-[#0B8A8F]/[0.25] rounded-[32px] transition-all duration-500 pointer-events-none shadow-[inset_0_0_20px_rgba(11,138,143,0)] group-hover:shadow-[inset_0_0_20px_rgba(11,138,143,0.05)]" />

            {/* Vertical accent line */}
            <div className="absolute left-0 top-12 bottom-12 w-[4px] bg-[#0B8A8F] opacity-80 rounded-r-full relative z-20" />
            
            <div className="relative z-10">
              <span className="animate-card-content font-jakarta font-bold text-[11px] sm:text-[12px] tracking-[0.3em] text-[#0B8A8F] uppercase mb-4 block">
                02 — OUR VISION
              </span>
              
              <h3 className="animate-card-content font-jakarta font-extrabold text-[32px] sm:text-[38px] lg:text-[44px] text-faazo-navy leading-[1.1] mb-6 tracking-tight">
                Building The Future <br />
                <span className="text-[#0B8A8F] drop-shadow-sm">Of Dental Technology</span>
              </h3>
              
              <p className="animate-card-content font-sans text-[15px] sm:text-[16px] leading-[1.8] text-faazo-gray max-w-[520px] opacity-90">
                Our vision is to become a globally recognized dental technology brand that drives innovation, manufacturing excellence, and sustainable growth. By continuously advancing our products and expanding our global presence, we aim to shape the future of modern dentistry and make world-class dental solutions accessible to professionals everywhere.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const CoreValuesSection = () => {
  const values = [
    {
      title: "Quality Excellence",
      description: "Adhering to the highest industry standards, ensuring every dental technology and product we deliver is built to last and perform flawlessly.",
      icon: Award
    },
    {
      title: "Innovation",
      description: "Pioneering state-of-the-art solutions that incorporate the latest advancements in digital dentistry to simplify clinical workflows.",
      icon: Lightbulb
    },
    {
      title: "Customer Commitment",
      description: "Building long-term partnerships through exceptional post-installation support and technical expertise tailored to your clinical needs.",
      icon: HeartHandshake
    },
    {
      title: "Integrity",
      description: "Operating with absolute transparency, honesty, and ethical standards in all our business practices and professional relations.",
      icon: ShieldCheck
    },
    {
      title: "Reliability",
      description: "Being a partner you can count on, delivering consistent equipment performance, prompt service response times, and dependable solutions.",
      icon: CheckCircle
    },
    {
      title: "Continuous Improvement",
      description: "Constantly refining our processes, products, and skills to stay at the absolute forefront of the rapidly evolving dental industry.",
      icon: TrendingUp
    },
    {
      title: "Collaboration",
      description: "Fostering strong teamwork, active listening, and joint growth alongside dental practitioners and international partners.",
      icon: Users
    },
    {
      title: "Patient-Centric Focus",
      description: "Designing and engineering our products with patient safety, comfort, and positive clinical outcomes as our ultimate goal.",
      icon: Heart
    }
  ];

  return (
    <section className="bg-slate-50/40 py-24 md:py-32 border-t border-faazo-border/40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <span className="font-jakarta font-bold text-[12px] tracking-[0.3em] text-[#00838F] uppercase mb-4 block">
            WHAT WE STAND FOR
          </span>
          <h2 className="font-jakarta font-extrabold text-[32px] sm:text-[42px] text-faazo-navy leading-tight tracking-tight">
            Core Values
          </h2>
          <p className="font-sans text-[15px] sm:text-[16px] leading-[1.6] text-faazo-gray max-w-[600px] mt-4">
            The principles that guide every product, partnership, and innovation.
          </p>
          <div className="w-12 h-[3px] bg-[#00838F] mt-6 rounded-full opacity-60"></div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full items-stretch">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden backdrop-blur-md bg-white/60 border border-[#00838F]/15 hover:border-[#00838F]/60 rounded-[16px] p-8 flex flex-col items-start shadow-[0_4px_20px_rgba(0,108,118,0.01)] hover:shadow-[0_12px_30px_rgba(0,131,143,0.08)] transition-all duration-300 ease-out transform hover:-translate-y-[5px] group"
              >
                {/* Minor teal tint overlay inside the card */}
                <div className="absolute inset-0 bg-[#00838F]/[0.02] pointer-events-none group-hover:bg-[#00838F]/[0.05] transition-colors duration-300 z-0" />
                
                <div className="relative z-10 w-full flex flex-col items-start">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00838F]/10 text-[#00838F] mb-6 transition-colors duration-300 group-hover:bg-[#00838F] group-hover:text-white">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[14px] leading-[1.6] text-faazo-gray">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <>
      <section
        id="about"
        className="relative pt-0 bg-white min-h-[calc(100vh-80px)] flex flex-col justify-center items-center overflow-hidden flex-grow bg-cover bg-[75%_center] md:bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero/about/about_hero.png')"
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 md:py-24 w-full z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-faazo-teal"></span>
            <span className="font-jakarta font-bold text-[12px] tracking-[0.2em] text-faazo-teal uppercase">About Faazo</span>
          </div>

          {/* Title */}
          <h2 className="font-jakarta font-extrabold text-[38px] md:text-[52px] lg:text-[46px] xl:text-[56px] leading-[1.12] text-faazo-navy mb-6 tracking-tight max-w-[800px]">
            Engineering Trust <br />
            For <span className="text-faazo-teal">Modern Dentistry</span>
          </h2>

          {/* Short Underline Divider */}
          <div className="w-12 h-[3px] bg-faazo-teal mb-8"></div>

          {/* Description */}
          <p className="font-sans text-[15px] md:text-[16px] leading-[1.7] text-faazo-gray mb-12 max-w-[680px]">
            For more than 11 years, Faazodent Dental Solutions has empowered dental professionals through innovative technologies, precision-engineered equipment, and dependable service.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <a href="#" className="flex items-center justify-center gap-2 bg-faazo-teal hover:bg-[#005A64] text-white px-8 py-4 rounded-lg font-jakarta font-bold text-[15px] shadow-lg shadow-faazo-teal/15 transition-all duration-200 group w-full sm:w-auto">
              Our Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a href="#" className="flex items-center justify-center gap-2 bg-white hover:bg-faazo-light text-faazo-teal border border-faazo-teal hover:border-[#005A64] px-8 py-4 rounded-lg font-jakarta font-bold text-[15px] transition-all duration-200 w-full sm:w-auto group">
              Explore Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
        
        {/* Bottom Blend Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/40 to-transparent z-0 pointer-events-none" />
      </section>

      {/* Premium Statistics Section */}
      <StatsSection />

      {/* Premium Scroll-Driven Journey Section */}
      <JourneySection />

      {/* Premium Mission & Vision Section */}
      <MissionVisionSection />

      {/* Premium Core Values Section */}
      <CoreValuesSection />
    </>
  );
};

export default About;
