import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, FileText, Bell } from 'lucide-react';

export const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full flex-grow relative overflow-hidden pt-6 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4] text-left">
      <div className="max-w-[900px] mx-auto mt-28 mb-12 relative z-10">
        {/* Header Glass Card */}
        <div className="glass-card rounded-[32px] p-8 sm:p-12 border border-white/50 shadow-md bg-white/40 backdrop-blur-md mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86]">
              <ShieldCheck className="w-6.5 h-6.5 stroke-[1.5]" />
            </div>
            <div>
              <span className="font-jakarta font-bold text-[11px] tracking-[0.2em] text-[#0A7C86] uppercase block">LEGAL PROTOCOLS</span>
              <h1 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-faazo-navy tracking-tight mt-1">Privacy Policy</h1>
            </div>
          </div>
          <p className="font-sans text-[15px] sm:text-[16px] leading-[1.7] text-faazo-gray mb-0">
            Last Updated: June 11, 2026. At FAAZO (Faazodent Dental Solutions Pvt Ltd), we are committed to protecting the privacy of dental professionals, clinic administrators, and website visitors. This Privacy Policy describes how we collect, use, share, and protect your information.
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card rounded-[32px] p-8 sm:p-12 border border-white/50 shadow-md bg-white/40 backdrop-blur-md flex flex-col gap-10">
          
          {/* Section 1 */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86] shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">1. Information We Collect</h2>
              <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-faazo-gray mb-3">
                We collect information directly from you when you submit enquiry forms, apply for careers, register as a dealer, or interact with our clinical solutions team. This may include:
              </p>
              <ul className="list-disc pl-5 font-sans text-[14px] sm:text-[15px] text-faazo-gray flex flex-col gap-2">
                <li><strong>Contact Details:</strong> Your name, clinic name, email address, phone number, and physical clinical address.</li>
                <li><strong>Professional Credentials:</strong> Dental license numbers, clinical specialization details, and institutional affiliations.</li>
                <li><strong>Enquiry Data:</strong> Information about dental handpieces, chairs, compressors, or accessories you are interested in acquiring or servicing.</li>
                <li><strong>Technical Information:</strong> IP address, device type, and interaction metrics gathered through cookies to enhance your digital experience.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">2. How We Use Your Information</h2>
              <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-faazo-gray mb-3">
                We process your data to support your clinical equipment needs and maintain relations. Specifically, we use information to:
              </p>
              <ul className="list-disc pl-5 font-sans text-[14px] sm:text-[15px] text-faazo-gray flex flex-col gap-2">
                <li>Address equipment enquiries and coordinate product demonstrations (such as 3D scanners or clinical handpieces).</li>
                <li>Process applications for our dealership networks or career openings.</li>
                <li>Provide post-installation technical support, warranty validations, and preventative maintenance schedules.</li>
                <li>Deliver notifications on safety updates, engineering improvements, or dental exhibition invites.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">3. Data Sharing & Security</h2>
              <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-faazo-gray mb-0">
                We do not sell or lease your personal clinical database. We may share essential details with authorized regional service technicians or logistics partners solely to deploy or maintain your FAAZO equipment. We implement advanced physical, technical, and administrative measures to secure your credentials and prevent unauthorized clinical data breaches.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86] shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">4. Cookies & Preferences</h2>
              <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-faazo-gray mb-0">
                Our platform utilizes essential cookies to manage portal configurations and optimize page speed. You have the right to accept or decline analytics cookies through your browser configurations. Additionally, you may contact our clinical relations desk at any time to inspect, update, or request erasure of your registration profile.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
