import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { saveContactEnquiry } from '../lib/db';
import { 
  MapPin, Phone, Mail, Globe, Send, 
  CheckCircle2, AlertCircle, Clock, ShieldCheck, 
  HelpCircle, MessageSquare
} from 'lucide-react';

export const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validate single field
  const validateField = (name, value) => {
    let error = '';
    if (name === 'name') {
      if (!value.trim()) {
        error = 'Full name is required.';
      } else if (value.trim().length < 3) {
        error = 'Name must be at least 3 characters.';
      }
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        error = 'Email address is required.';
      } else if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address.';
      }
    } else if (name === 'phone') {
      const cleanPhone = value.replace(/[^0-9+]/g, '');
      if (!value.trim()) {
        error = 'Phone number is required.';
      } else if (cleanPhone.length < 10) {
        error = 'Phone number must be at least 10 digits.';
      }
    } else if (name === 'message') {
      if (!value.trim()) {
        error = 'Message is required.';
      } else if (value.trim().length < 10) {
        error = 'Message must be at least 10 characters.';
      }
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all as touched
    const allTouched = { name: true, email: true, phone: true, message: true };
    setTouched(allTouched);

    // Validate all fields
    const formErrors = {
      name: validateField('name', form.name),
      email: validateField('email', form.email),
      phone: validateField('phone', form.phone),
      message: validateField('message', form.message)
    };

    setErrors(formErrors);

    // Check if any errors exist
    const hasErrors = Object.values(formErrors).some(err => err !== '');
    if (hasErrors) return;

    setIsSubmitting(true);

    saveContactEnquiry(form)
      .then(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset Form
        setForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: ''
        });
        setTouched({
          name: false,
          email: false,
          phone: false,
          message: false
        });
        setErrors({});
      })
      .catch(err => {
        console.error(err);
        setIsSubmitting(false);
        alert("Failed to submit contact enquiry. Please try again.");
      });
  };

  // Determine input classes based on touched and error states
  const getInputClass = (name) => {
    const baseClass = "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none transition-all duration-300 text-xs font-semibold text-faazo-navy";
    if (!touched[name]) {
      return `${baseClass} border-faazo-border focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86]`;
    }
    if (errors[name]) {
      return `${baseClass} border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500`;
    }
    return `${baseClass} border-emerald-200 bg-emerald-50/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`;
  };

  return (
    <div className="w-full flex-grow relative overflow-hidden pt-6 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4] text-left">
      {/* Background Floating Blobs */}
      <div className="absolute top-[5%] right-[-10%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-faazo-cyan/20 blur-[100px] sm:blur-[130px] animate-float-slow pointer-events-none z-0"></div>
      <div className="absolute top-[40%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-faazo-teal/15 blur-[110px] sm:blur-[140px] animate-float-medium pointer-events-none z-0"></div>
      
      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col gap-12 pt-2">
        
        {/* MAIN CONTACT CONTAINER (BENTO TWO-COLUMN) */}
        <div className="w-full rounded-[32px] border border-[#E2EAEB]/80 overflow-hidden bg-[#FAFBFD]/95 shadow-[0_20px_50px_rgba(11,37,48,0.04)] grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT SIDE (45% on desktop - spans 5 columns) */}
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E2EAEB]/60 min-h-[500px] lg:min-h-[680px]">
            {/* Dot Grid Background */}
            <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            
            {/* Editorial Dental Clinic Image */}
            <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[280px] rounded-[24px] overflow-hidden shadow-sm shrink-0 mb-8 border border-white/50">
              <img 
                src="/hero/contact_clinic_hero.png" 
                alt="Modern bright dental clinic environment" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-faazo-navy/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Typography Content */}
            <div className="relative z-10 flex-grow flex flex-col justify-between">
              <div>
                <span className="font-sans font-extrabold text-[9px] tracking-[0.25em] text-[#0A7C86] bg-[#0A7C86]/5 border border-[#0A7C86]/10 px-3 py-1 rounded-full uppercase mb-4 inline-block shadow-sm">
                  GET IN TOUCH
                </span>
                <h1 className="font-jakarta font-extrabold text-2xl sm:text-3xl leading-[1.2] text-faazo-navy mb-4 tracking-tight">
                  Let's Build Better Dental Experiences Together
                </h1>
                <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed mb-6">
                  Whether you're exploring our products, planning a new clinic, looking for dealership opportunities, or seeking technical support, our team is here to help.
                </p>
              </div>

              {/* Quick Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E2EAEB]/60 pt-6 mt-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0A7C86]/5 border border-[#0A7C86]/10 flex items-center justify-center text-[#0A7C86]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-sans text-[11px] font-bold text-faazo-navy leading-tight">Thiruvananthapuram,<br /><span className="text-faazo-gray font-medium">Kerala, India</span></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0A7C86]/5 border border-[#0A7C86]/10 flex items-center justify-center text-[#0A7C86]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-sans text-[11px] font-bold text-faazo-navy leading-tight">Call Direct<br /><span className="text-faazo-gray font-medium">+91 88489 22846</span></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0A7C86]/5 border border-[#0A7C86]/10 flex items-center justify-center text-[#0A7C86]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-sans text-[11px] font-bold text-faazo-navy leading-tight">Email Inbox<br /><a href="mailto:info@faazo.in" className="text-[#0A7C86] font-semibold hover:underline">info@faazo.in</a></span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0A7C86]/5 border border-[#0A7C86]/10 flex items-center justify-center text-[#0A7C86]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="font-sans text-[11px] font-bold text-faazo-navy leading-tight">Global Enquiries<br /><span className="text-faazo-gray font-medium">Exports Available</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (55% on desktop - spans 7 columns) */}
          <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-center min-h-[500px]">
            <AnimatePresence mode="wait">
              {!submitSuccess ? (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-jakarta font-extrabold text-xl sm:text-2xl text-faazo-navy mb-1.5 tracking-tight">
                    Send Us a Message
                  </h2>
                  <p className="font-sans text-xs text-faazo-gray mb-8">
                    Fill out the form below and our clinical relations team will respond within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Full Name *</label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          required
                          placeholder="e.g. Rahul Sharma"
                          className={getInputClass('name')}
                          value={form.name}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                        />
                        {touched.name && errors.name && (
                          <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1 pl-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                          </span>
                        )}
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Email Address *</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          required
                          placeholder="e.g. rahul@example.com"
                          className={getInputClass('email')}
                          value={form.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                        />
                        {touched.email && errors.email && (
                          <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1 pl-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Phone & Company Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Phone Number *</label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          required
                          placeholder="e.g. +91 98450 12345"
                          className={getInputClass('phone')}
                          value={form.phone}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                        />
                        {touched.phone && errors.phone && (
                          <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1 pl-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                          </span>
                        )}
                      </div>
                      <div>
                        <label htmlFor="company" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Company / Clinic Name</label>
                        <input
                          id="company"
                          type="text"
                          name="company"
                          placeholder="e.g. Care Dental Clinic"
                          className={getInputClass('company')}
                          value={form.company}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Subject</label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        placeholder="How can we help you?"
                        className={getInputClass('subject')}
                        value={form.subject}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="4"
                        placeholder="Write your query in detail..."
                        className={getInputClass('message')}
                        value={form.message}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                      ></textarea>
                      {touched.message && errors.message && (
                        <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1 pl-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.message}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 w-full py-4 bg-[#006F7A] hover:bg-[#005e68] text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-[0_8px_30px_rgba(0,111,122,0.15)] hover:shadow-[0_12px_35px_rgba(0,111,122,0.25)] flex items-center justify-center gap-2 cursor-pointer border border-white/10"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Sending Message...</span>
                        </div>
                      ) : (
                        <>
                          Send Message <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* SUCCESS PANEL */
                <motion.div
                  key="success-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 px-6 flex flex-col items-center gap-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-jakarta font-extrabold text-xl text-faazo-navy">Message Received!</h3>
                  <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed max-w-md mx-auto">
                    Thank you for reaching out. Your message has been successfully logged. Our clinical relations desk will review your details and contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 px-6 py-3 bg-[#0A7C86] hover:bg-[#086770] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer border border-white/10"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* BOTTOM OPTIONAL WIDGET SECTION */}
        <div className="w-full text-center">
          <span className="font-sans font-bold text-[10px] tracking-wider text-faazo-gray uppercase mb-3 block">
            NEED IMMEDIATE ASSISTANCE?
          </span>
          <h3 className="font-jakarta font-extrabold text-lg text-faazo-navy mb-8">
            Connect With Our Specialized Desks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Call support */}
            <div className="glass-card rounded-[24px] p-6 border border-white/60 bg-[#FAFBFD]/60 hover:bg-[#FAFBFD] transition-all duration-300 shadow-sm flex flex-col items-center justify-between text-center min-h-[170px]">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 shadow-inner mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-jakarta font-bold text-sm text-faazo-navy mb-1.5">Direct Support Hotline</h4>
              <p className="font-sans text-[11px] text-faazo-gray leading-relaxed mb-4">
                Call our technical engineering helpdesk for urgent installations support.
              </p>
              <a href="tel:+918848922846" className="text-xs font-extrabold text-[#0A7C86] hover:underline">+91 88489 22846</a>
            </div>

            {/* Email Support */}
            <div className="glass-card rounded-[24px] p-6 border border-white/60 bg-[#FAFBFD]/60 hover:bg-[#FAFBFD] transition-all duration-300 shadow-sm flex flex-col items-center justify-between text-center min-h-[170px]">
              <div className="w-10 h-10 rounded-xl bg-[#E6F3F5] flex items-center justify-center text-[#0A7C86] border border-[#0A7C86]/10 shadow-inner mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="font-jakarta font-bold text-sm text-faazo-navy mb-1.5">Clinical Relations Inbox</h4>
              <p className="font-sans text-[11px] text-faazo-gray leading-relaxed mb-4">
                For sales proposals, clinic plans, or custom equipment procurement requests.
              </p>
              <a href="mailto:info@faazo.in" className="text-xs font-extrabold text-[#0A7C86] hover:underline">info@faazo.in</a>
            </div>

            {/* Dealer Support */}
            <div className="glass-card rounded-[24px] p-6 border border-white/60 bg-[#FAFBFD]/60 hover:bg-[#FAFBFD] transition-all duration-300 shadow-sm flex flex-col items-center justify-between text-center min-h-[170px]">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-inner mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-jakarta font-bold text-sm text-faazo-navy mb-1.5">Dealer & Exports Desk</h4>
              <p className="font-sans text-[11px] text-faazo-gray leading-relaxed mb-4">
                Enquire about regional distributorships or global export capabilities.
              </p>
              <a href="mailto:info@faazo.in" className="text-xs font-extrabold text-[#0A7C86] hover:underline">info@faazo.in</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
