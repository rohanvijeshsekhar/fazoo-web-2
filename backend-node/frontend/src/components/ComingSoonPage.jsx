import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Instagram, Facebook, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { saveContactEnquiry } from '../lib/db';

export const ComingSoonPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Calculate target date dynamically (e.g., 45 days from today) to keep the countdown active
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set target date to 45 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);
    targetDate.setHours(0, 0, 0, 0);

    const timer = setInterval(() => {
      const difference = +targetDate - +new Date();
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track mouse coordinates for reactive background orb
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      await saveContactEnquiry({
        name: 'Pre-launch Subscriber',
        email: email,
        subject: 'Coming Soon Newsletter Subscription',
        message: 'Subscribed to launch updates via the Coming Soon landing page.'
      });
      setStatus('success');
      setMessage('Thank you for subscribing! We will notify you at launch.');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030d11] text-white flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* Interactive Glowing Orb */}
      <div 
        className="absolute pointer-events-none rounded-full blur-[140px] opacity-40 transition-transform duration-300 ease-out z-0 hidden md:block"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(10,124,134,0.4) 0%, rgba(2,152,166,0.1) 70%, transparent 100%)',
          left: `${mousePos.x - 250}px`,
          top: `${mousePos.y - 250}px`,
        }}
      />

      {/* Static background glow for mobile */}
      <div className="absolute md:hidden top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#0A7C86]/20 blur-[90px] pointer-events-none z-0" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-8 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/hero/faazologo.png" alt="FAAZO" className="h-8 w-auto brightness-0 invert" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0A7C86] uppercase bg-[#0A7C86]/10 px-3.5 py-1.5 rounded-full border border-[#0A7C86]/20">
          <ShieldCheck className="w-3.5 h-3.5" /> Launching 2026
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12 flex-grow flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
        
        {/* Launch Tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="text-[#0A7C86] text-xs font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full bg-[#0A7C86]/5 border border-[#0A7C86]/10">
            Precision • Innovation • Excellence
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-jakarta font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] mb-6 bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent"
        >
          The Next Generation of <br />
          <span className="text-[#0A7C86] bg-gradient-to-r from-[#0A7C86] to-[#0ea1ae] bg-clip-text">Dental Technology</span>
        </motion.h1>

        {/* Brand Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-12 font-medium"
        >
          We are crafting a premium clinical ecosystem of advanced dental solutions, precision instruments, and intelligent technologies to empower dental practices globally.
        </motion.p>

        {/* Live Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg w-full mb-14"
        >
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Mins', value: timeLeft.minutes },
            { label: 'Secs', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/[0.05] p-3 sm:p-5 flex flex-col items-center">
              <span className="text-2xl sm:text-4xl font-extrabold font-jakarta tracking-tight text-[#0A7C86]">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mt-1.5">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Email Capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-md"
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-white/[0.02] border border-white/[0.07] p-2 rounded-2xl backdrop-blur-md">
            <div className="flex-grow flex items-center px-3 gap-2">
              <Mail className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="email"
                required
                placeholder="Enter your professional email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 text-white"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="bg-gradient-to-r from-[#004d54] to-[#0A7C86] text-white px-6 py-3.5 rounded-xl font-jakarta font-bold text-xs hover:shadow-[0_0_20px_rgba(10,124,134,0.3)] transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              {status === 'loading' ? (
                <div className="animate-spin rounded-full h-4.5 w-4.5 border-t-2 border-b-2 border-white"></div>
              ) : status === 'success' ? (
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
              ) : (
                <>Notify Me <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs mt-3.5 font-bold ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {message}
            </motion.p>
          )}
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.04]">
        <p className="text-[11px] sm:text-xs text-gray-600 font-semibold">
          © 2026 Faazodent Dental Solutions Pvt Ltd. All Rights Reserved.
        </p>
        
        {/* Social Icons */}
        <div className="flex items-center gap-5">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#0A7C86] transition-colors">
            <Linkedin className="w-4.5 h-4.5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#0A7C86] transition-colors">
            <Instagram className="w-4.5 h-4.5" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#0A7C86] transition-colors">
            <Facebook className="w-4.5 h-4.5" />
          </a>
        </div>
      </footer>

    </div>
  );
};
