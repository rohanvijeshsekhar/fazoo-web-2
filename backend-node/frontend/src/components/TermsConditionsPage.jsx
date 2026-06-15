import React, { useEffect } from 'react';
import { Scale, FileSpreadsheet, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';

export const TermsConditionsPage = () => {
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
              <Scale className="w-6.5 h-6.5 stroke-[1.5]" />
            </div>
            <div>
              <span className="font-jakarta font-bold text-[11px] tracking-[0.2em] text-[#0A7C86] uppercase block">TERMS OF SERVICE</span>
              <h1 className="font-jakarta font-extrabold text-3xl sm:text-4xl text-faazo-navy tracking-tight mt-1">Terms & Conditions</h1>
            </div>
          </div>
          <p className="font-sans text-[15px] sm:text-[16px] leading-[1.7] text-faazo-gray mb-0">
            Welcome to the FAAZO clinical technology portal. By accessing our platform or purchasing our dental chairs, turbines, compressors, and scanners, you agree to comply with and be bound by the following Terms & Conditions. Please review them carefully.
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card rounded-[32px] p-8 sm:p-12 border border-white/50 shadow-md bg-white/40 backdrop-blur-md flex flex-col gap-10">
          
          {/* Section 1 */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86] shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">1. Scope of Use</h2>
              <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-faazo-gray mb-0">
                This platform is intended strictly for dental clinics, hospitals, certified dental practitioners, and authorized regional dealer networks. All product details, technical spec sheets, and marketing brochures supplied on this portal are the intellectual property of Faazodent Dental Solutions Pvt Ltd. Unauthorized copying, reverse engineering, or modification of any FAAZO technologies is strictly prohibited.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86] shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">2. Warranty & Installation</h2>
              <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-faazo-gray mb-0">
                FAAZO guarantees that all supplied equipment is manufactured to rigorous quality control guidelines. Professional clinical installation must be executed by an authorized FAAZO engineering representative or certified dealer technician. Unauthorized third-party modifications, pneumatics alterations, or unapproved handpiece configurations may void equipment warranties.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">3. Liability Disclaimer</h2>
              <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-faazo-gray mb-0">
                While FAAZO provides world-class dental chairs, imaging units, and clinical accessories, clinical diagnostics and treatment decisions remain the sole responsibility of the certified dental practitioner. FAAZO shall not be held liable for any clinical complications, operational downtimes, or incidental damages arising from improper equipment maintenance, sterilisation protocols, or clinical operation.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0A7C86]/10 text-[#0A7C86] shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-jakarta font-bold text-[18px] text-faazo-navy mb-3">4. Jurisdiction & Governance</h2>
              <p className="font-sans text-[14px] sm:text-[15px] leading-[1.65] text-faazo-gray mb-0">
                These Terms & Conditions are governed by and construed in accordance with the laws of India. Any disputes or claims arising out of the acquisition, deployment, or usage of FAAZO products shall be subject to the exclusive jurisdiction of the courts located in Thiruvananthapuram, Kerala, India.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
