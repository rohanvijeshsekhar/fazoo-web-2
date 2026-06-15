import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getJobs, saveJobApplication } from '../lib/db';
import { 
  Briefcase, Calendar, MapPin, DollarSign, 
  Search, FileText, Send, X, CheckCircle, 
  AlertCircle, Upload, ChevronRight, Clock, Building
} from 'lucide-react';

export const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Application Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    resume: null,
    resumeName: '',
    coverLetter: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getJobs().then(data => setJobs(Array.isArray(data) ? data : []));
  }, []);

  // Filter jobs dynamically
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDept = true;
    if (selectedDept !== 'All') {
      // Crude categorization based on job titles
      if (selectedDept === 'Sales') {
        matchesDept = job.title.toLowerCase().includes('sales');
      } else if (selectedDept === 'Engineering') {
        matchesDept = job.title.toLowerCase().includes('engineer') || job.title.toLowerCase().includes('service');
      } else if (selectedDept === 'Marketing') {
        matchesDept = job.title.toLowerCase().includes('marketing');
      }
    }

    return matchesSearch && matchesDept && job.status === 'Open';
  });

  const handleOpenJob = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    // Reset form states
    setForm({
      name: '',
      email: '',
      phone: '',
      location: '',
      resume: null,
      resumeName: '',
      coverLetter: ''
    });
    setSubmitSuccess(false);
    setFormError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        setFormError('Invalid file type. Please upload a PDF, DOC, or DOCX document.');
        return;
      }
      
      // Validate file size (max 5MB for base64 storage efficiency)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('File size too large. Max allowed size is 5MB.');
        return;
      }

      setFormError('');
      setForm(prev => ({
        ...prev,
        resume: file,
        resumeName: file.name
      }));
    }
  };

  // Convert File to Base64 String for local storage saving
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.location) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      // Convert resume file to base64 or use mock placeholder
      let resumeBase64 = "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCAyNAo+PgpzdHJlYW0KQlQgL0YxIDEyIFRmIDUwIDcwMCBUZCAoRGVtb25zdHJhdGlvbiBSZXN1bWUpIFRqIEVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbCAKMDAwMDAwMDExNSAwMDAwMCBsIAowMDAwMDAwMjIyIDAwMDAwIGwgCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMjg1CiUlRU9G";
      let resumeName = "mock_resume_placeholder.pdf";

      if (form.resume) {
        resumeBase64 = await fileToBase64(form.resume);
        resumeName = form.resumeName;
      }
      
      const newApplication = {
        applicantName: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        resumeName: resumeName,
        resumeData: resumeBase64,
        coverLetter: form.coverLetter,
        jobId: selectedJob.id,
        appliedJob: selectedJob.title
      };

      // Save to database
      await saveJobApplication(newApplication);

      setSubmitSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setFormError('Failed to process the application. Please try again.');
      setIsSubmitting(false);
    }
  };

  const departments = ['All', 'Sales', 'Engineering', 'Marketing'];

  return (
    <div className="w-full flex-grow relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4] text-left">
      {/* Background Floating Blobs */}
      <div className="absolute top-[8%] right-[-8%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-faazo-cyan/20 blur-[100px] sm:blur-[130px] animate-float-slow pointer-events-none z-0"></div>
      <div className="absolute top-[45%] left-[-8%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-faazo-teal/15 blur-[110px] sm:blur-[140px] animate-float-medium pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] right-[20%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[#82E0E8]/15 blur-[90px] sm:blur-[120px] pointer-events-none z-0 animate-float-fast"></div>

      <div className="max-w-[1100px] mx-auto relative z-10 flex flex-col gap-10 pt-10">
        
        {/* HERO SECTION BENTO CARD */}
        <div className="w-full rounded-[28px] p-8 sm:p-12 border border-[#E2EAEB]/80 relative overflow-hidden flex flex-col justify-between min-h-[300px] bg-[#FAFBFD]/95 shadow-[0_15px_45px_rgba(11,37,48,0.03)]">
          {/* Dot Grid Background */}
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          {/* Decorative soft glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#2EA5B0]/8 via-[#0A7C86]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-tr from-[#2EA5B0]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl">
            <span className="font-sans font-extrabold text-[10px] tracking-[0.25em] text-[#0A7C86] bg-[#0A7C86]/5 border border-[#0A7C86]/10 px-4 py-1.5 rounded-full uppercase mb-5 inline-block shadow-sm">
              CAREERS AT FAAZO
            </span>
            <h1 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] text-faazo-navy mb-5 tracking-tight">
              Build the Future of <br className="hidden sm:inline" />
              <span className="text-[#0A7C86]">Dental Technology</span>
            </h1>
            <p className="font-sans text-xs sm:text-sm md:text-[15px] text-faazo-gray leading-relaxed max-w-xl">
              Join a growing team dedicated to innovation, excellence, and transforming dental healthcare through advanced medical technology solutions. Explore our open positions below.
            </p>
          </div>
        </div>

        {/* SEARCH AND FILTERS CONTROLS */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-faazo-border/40 pb-5">
          {/* Search bar */}
          <div className="relative max-w-sm w-full">
            <input 
              type="text"
              placeholder="Search positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-white/60 bg-[#FAFBFD]/90 focus:outline-none focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86] text-xs font-semibold text-faazo-navy shadow-inner transition-all duration-300 focus:bg-white"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faazo-navy/40 pointer-events-none" />
          </div>

          {/* Department Pills */}
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-[#0A7C86] border-transparent text-white shadow-sm'
                    : 'bg-[#FAFBFD]/90 border-white/60 text-faazo-navy hover:bg-white hover:border-[#0A7C86]/30'
                }`}
              >
                {dept} {dept !== 'All' ? 'Roles' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* OPEN POSITIONS GRID */}
        <div className="w-full">
          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl p-6 flex flex-col justify-between border border-[#E2EAEB]/80 shadow-sm relative group overflow-hidden bg-[#FAFBFD] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#0A7C86]/35 min-h-[300px]"
                >
                  {/* Dot Grid Background */}
                  <div className="absolute inset-0 opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  {/* Premium glass hover overlay */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#0A7C86]/20 rounded-2xl transition-all duration-500 pointer-events-none" />
                  
                  {/* Content Wrapper */}
                  <div className="relative z-10 flex flex-col justify-between h-full w-full">
                    <div>
                      {/* Job Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#E6F3F5] text-[#0A7C86] border border-[#0A7C86]/10">
                          {job.title.includes('Engineer') ? 'Engineering' : job.title.includes('Sales') ? 'Sales' : 'Marketing'}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-faazo-gray font-bold">
                          <Clock className="w-3 h-3 text-[#0A7C86]" /> Full-Time
                        </div>
                      </div>

                      {/* Job Title */}
                      <h3 className="font-jakarta font-extrabold text-lg text-faazo-navy mb-2 tracking-tight group-hover:text-[#0A7C86] transition-colors leading-snug">
                        {job.title}
                      </h3>

                      {/* Metadata row */}
                      <div className="flex flex-col gap-2 mb-4 mt-3">
                        <div className="flex items-center gap-2 text-xs text-faazo-gray font-semibold">
                          <DollarSign className="w-3.5 h-3.5 text-[#0A7C86]" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-faazo-gray font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#0A7C86]" />
                          <span>Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Description Preview */}
                      <p className="font-sans text-xs text-faazo-gray leading-relaxed mb-6 line-clamp-3">
                        {job.shortDescription}
                      </p>
                    </div>

                    {/* Apply Button CTA */}
                    <button
                      onClick={() => handleOpenJob(job)}
                      className="w-full py-3 bg-white/50 hover:bg-white border border-[#E2EAEB] hover:border-[#0A7C86]/35 text-xs font-extrabold text-faazo-navy hover:text-[#0A7C86] rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm cursor-pointer"
                    >
                      View Details & Apply <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="max-w-md mx-auto glass-card rounded-[24px] p-10 border border-white/50 text-center flex flex-col items-center gap-4 bg-white/45 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#E6F3F5] border border-[#0A7C86]/10 flex items-center justify-center text-[#0A7C86] mb-2">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="font-jakarta font-extrabold text-lg text-faazo-navy">No Open Positions</h3>
              <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed">
                No current openings available. Please check back later or submit your details to be considered for future opportunities.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* JOB DETAILS & APPLICATION MODAL */}
      <AnimatePresence>
        {selectedJob && isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-faazo-navy/40 backdrop-blur-md"
              onClick={() => setIsApplyModalOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-[0_30px_70px_rgba(11,37,48,0.25)] z-10 max-h-[90vh] overflow-y-auto scrollbar-thin text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-faazo-light text-faazo-navy/60 hover:text-faazo-navy transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {!submitSuccess ? (
                <div>
                  {/* Job Detail Header */}
                  <div className="mb-6 border-b border-faazo-border/50 pb-5">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-[#E6F3F5] text-[#0A7C86] border border-[#0A7C86]/10 mb-3 inline-block">
                      Position Specifications
                    </span>
                    <h2 className="font-jakarta font-extrabold text-2xl text-faazo-navy tracking-tight leading-tight">
                      {selectedJob.title}
                    </h2>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs text-faazo-gray font-bold">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-[#0A7C86]" />
                        <span>FAAZO HQ (Kerala, India)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-[#0A7C86]" />
                        <span>{selectedJob.salary}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#0A7C86]" />
                        <span>Posted {new Date(selectedJob.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rich Text Job Description */}
                  <div className="font-sans text-xs sm:text-sm text-faazo-gray space-y-4 mb-8">
                    {/* Paragraphs */}
                    {selectedJob.description.paragraphs.map((p, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                    
                    {/* Responsibilities */}
                    <div className="pt-2">
                      <h4 className="font-jakarta font-extrabold text-sm text-faazo-navy uppercase tracking-wide mb-2.5">Key Responsibilities</h4>
                      <ul className="list-disc list-outside pl-4 space-y-1.5">
                        {selectedJob.description.responsibilities.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirements */}
                    <div className="pt-2">
                      <h4 className="font-jakarta font-extrabold text-sm text-faazo-navy uppercase tracking-wide mb-2.5">Candidate Requirements</h4>
                      <ul className="list-disc list-outside pl-4 space-y-1.5">
                        {selectedJob.description.requirements.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Application Form */}
                  <div className="border-t border-faazo-border/50 pt-6">
                    <h3 className="font-jakarta font-extrabold text-base text-faazo-navy mb-4 tracking-tight">
                      Apply for this Position
                    </h3>
                    
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="user-name" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Full Name *</label>
                          <input
                            id="user-name"
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="user-email" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Email Address *</label>
                          <input
                            id="user-email"
                            type="email"
                            required
                            placeholder="e.g. rahul.sharma@example.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="user-phone" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Phone Number *</label>
                          <input
                            id="user-phone"
                            type="tel"
                            required
                            placeholder="Include Area/Country Code"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="user-loc" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Current Location *</label>
                          <input
                            id="user-loc"
                            type="text"
                            required
                            placeholder="e.g. Bengaluru, Karnataka"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* File Upload Component */}
                      <div>
                        <span className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Resume / CV * (PDF, DOC, DOCX)</span>
                        <div className="relative border-2 border-dashed border-[#E2EAEB] hover:border-[#0A7C86]/50 rounded-2xl p-6 text-center transition-all bg-[#FAFBFD]/50">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-7 h-7 text-[#0A7C86]/70" />
                            <span className="text-xs font-semibold text-faazo-navy">
                              {form.resumeName ? form.resumeName : 'Click to upload or drag & drop file (Optional)'}
                            </span>
                            <span className="text-[10px] text-faazo-gray">PDF, DOC, or DOCX (Max size: 5MB)</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="user-cover" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Cover Letter / Message</label>
                        <textarea
                          id="user-cover"
                          rows="4"
                          placeholder="Briefly state your qualifications and alignment with the FAAZO mission..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition resize-none"
                          value={form.coverLetter}
                          onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                        ></textarea>
                      </div>

                      {formError && (
                        <div className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 rounded-lg p-2.5 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                        </div>
                      )}

                      <div className="flex gap-3 border-t border-faazo-border/30 pt-4 mt-2">
                        <button
                          type="button"
                          onClick={() => setIsApplyModalOpen(false)}
                          className="flex-1 py-3 border border-faazo-border rounded-xl text-xs font-bold text-faazo-navy hover:bg-faazo-light transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-[#0A7C86] hover:bg-[#086770] text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Application'}
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                /* SUCCESS SCREEN */
                <div className="text-center py-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-jakarta font-extrabold text-xl text-faazo-navy">Application Submitted!</h3>
                  <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed max-w-md">
                    Thank you, <span className="font-bold text-faazo-navy">{form.name}</span>. Your application for <span className="font-bold text-[#0A7C86]">{selectedJob.title}</span> has been logged. Our recruitment desk will reach out soon.
                  </p>
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="mt-4 px-6 py-2.5 bg-faazo-navy hover:bg-[#1A3E4E] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
