import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getDealers, COUNTRY_STATES_MAP } from '../lib/db';
import { 
  MapPin, Phone, Mail, Search, Building, 
  Users, ChevronDown, Check, X, Sparkles, 
  ArrowRight, ShieldCheck, HelpCircle, Send, Globe,
  Activity, Star, Clock, Trophy
} from 'lucide-react';

export const DealerNetworkPage = () => {
  const [allDealers, setAllDealers] = useState([]);
  const [country, setCountry] = useState('India');
  const [stateRegion, setStateRegion] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Application Form State
  const [applyForm, setApplyForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    country: 'India',
    message: '',
    type: 'Dealer'
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = ["India", "UAE", "Saudi Arabia", "Oman", "Qatar", "Kenya", "Tanzania", "South Africa", "Others"];

  // Load dealers from DB
  useEffect(() => {
    getDealers().then(data => setAllDealers(Array.isArray(data) ? data : []));
  }, []);

  // Sync and Filter in Real-time whenever options change
  useEffect(() => {
    const filtered = allDealers.filter(dealer => {
      const matchesCountry = dealer.country.toLowerCase() === country.toLowerCase();
      const matchesState = !stateRegion || stateRegion === 'All Regions' || dealer.state.toLowerCase() === stateRegion.toLowerCase();
      
      const query = cityQuery.trim().toLowerCase();
      const matchesText = !query || 
        dealer.city.toLowerCase().includes(query) || 
        dealer.name.toLowerCase().includes(query) || 
        dealer.state.toLowerCase().includes(query);

      return matchesCountry && matchesState && matchesText;
    });

    setFilteredDealers(filtered);
  }, [country, stateRegion, cityQuery, allDealers]);

  // Reset state region list when country updates
  const handleCountryChange = (c) => {
    setCountry(c);
    setStateRegion('');
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.email || !applyForm.phone || !applyForm.companyName) {
      setFormError('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const existingApps = JSON.parse(localStorage.getItem('faazo_dealer_applications')) || [];
      const newApp = {
        id: 'app_' + Date.now(),
        ...applyForm,
        date: new Date().toISOString()
      };
      existingApps.push(newApp);
      localStorage.setItem('faazo_dealer_applications', JSON.stringify(existingApps));
      
      setFormSubmitted(true);
      setFormError('');
      setIsSubmitting(false);
    }, 800);
  };

  const resetApplyForm = () => {
    setApplyForm({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      country: 'India',
      message: '',
      type: 'Dealer'
    });
    setFormSubmitted(false);
    setFormError('');
  };

  const availableStates = COUNTRY_STATES_MAP[country] || [];

  return (
    <div className="w-full flex-grow relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-[#E6F3F5] via-[#F4F9FA] to-[#EAF2F4] text-left">
      {/* Dynamic Background Floating Blobs */}
      <div className="absolute top-[8%] right-[-8%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-faazo-cyan/20 blur-[100px] sm:blur-[130px] animate-float-slow pointer-events-none z-0"></div>
      <div className="absolute top-[45%] left-[-8%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-faazo-teal/15 blur-[110px] sm:blur-[140px] animate-float-medium pointer-events-none z-0"></div>
      <div className="absolute bottom-[5%] right-[20%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[#82E0E8]/15 blur-[90px] sm:blur-[120px] pointer-events-none z-0 animate-float-fast"></div>

      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col gap-8 pt-10">
        
        {/* BENTO GRID ROW 1: Hero Card (col-8) + Statistics Tile (col-4) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          
          {/* HERO BENTO CARD */}
          <div className="md:col-span-7 lg:col-span-8 rounded-[28px] p-8 sm:p-10 border border-[#E2EAEB]/80 relative overflow-hidden flex flex-col justify-between min-h-[260px] bg-[#FAFBFD]/95 shadow-[0_15px_45px_rgba(11,37,48,0.03)]">
            {/* Dot Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            {/* Soft decorative design elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#2EA5B0]/5 via-[#0A7C86]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-[#2EA5B0]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <span className="font-sans font-extrabold text-[10px] tracking-[0.25em] text-[#0A7C86] bg-[#0A7C86]/5 border border-[#0A7C86]/10 px-3.5 py-1 rounded-full uppercase mb-4 inline-block shadow-sm">
                AUTHORIZED DEALER NETWORK
              </span>
              <h1 className="font-jakarta font-extrabold text-3xl sm:text-4xl lg:text-[40px] leading-[1.15] text-faazo-navy mb-4 tracking-tight">
                Find a FAAZO Dealer <br /> Near You
              </h1>
            </div>

            <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed max-w-[540px] mt-2">
              Locate authorized FAAZO dealers and distribution partners across India and international markets for product inquiries, support, and business opportunities.
            </p>
          </div>

          {/* TILE 4: STATISTICS BENTO CARD */}
          <div className="md:col-span-5 lg:col-span-4 rounded-[28px] p-6 sm:p-8 border border-[#E2EAEB]/80 relative overflow-hidden flex flex-col justify-between bg-[#FAFBFD]/95 min-h-[260px] shadow-[0_15px_45px_rgba(11,37,48,0.03)]">
            {/* Dot Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            {/* Soft decorative design elements */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-gradient-to-bl from-[#2EA5B0]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-gradient-to-tr from-[#0A7C86]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
            
            <div className="mb-2">
              <span className="text-[10px] font-bold text-faazo-gray uppercase tracking-wider block">FAAZO IMPACT</span>
              <h3 className="font-jakarta font-extrabold text-sm text-faazo-navy mt-0.5">Reliable Presence</h3>
            </div>

            <div className="flex flex-col gap-6 my-auto pt-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0A7C86]/10 flex items-center justify-center text-[#0A7C86] border border-[#0A7C86]/10 shadow-inner">
                  <Activity className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-faazo-navy leading-none">500+</div>
                  <div className="text-[10px] text-faazo-gray font-bold uppercase mt-0.5 tracking-wider">Installations</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/50 shadow-inner">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-faazo-navy leading-none">1500+</div>
                  <div className="text-[10px] text-faazo-gray font-bold uppercase mt-0.5 tracking-wider">Customers</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E6F3F5] flex items-center justify-center text-[#0A7C86] border border-[#0A7C86]/10 shadow-inner">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-faazo-navy leading-none">11+</div>
                  <div className="text-[10px] text-faazo-gray font-bold uppercase mt-0.5 tracking-wider">Years Experience</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BENTO GRID ROW 2: Interactive Filter Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          
          {/* TILE 1: COUNTRY SELECTION GRID */}
          <div className="md:col-span-6 lg:col-span-5 rounded-[28px] p-6 border border-[#E2EAEB]/80 bg-[#FAFBFD]/95 flex flex-col gap-4 relative overflow-hidden shadow-[0_15px_45px_rgba(11,37,48,0.03)]">
            {/* Dot Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            {/* Soft decorative design elements */}
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-gradient-to-bl from-[#2EA5B0]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-[10px] font-bold text-faazo-navy uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#0A7C86]" /> Select Country
              </span>
              <p className="text-[10px] text-faazo-gray pl-1 mt-0.5">Click a country to load regions</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {countries.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCountryChange(c)}
                  className={`py-2.5 px-1.5 rounded-xl text-[11px] font-bold transition-all duration-300 border flex flex-col items-center justify-center text-center leading-tight shadow-sm hover:scale-[1.02] cursor-pointer ${
                    country === c
                      ? 'bg-[#0A7C86] border-transparent text-white shadow-[0_4px_12px_rgba(10,124,134,0.25)] font-extrabold'
                      : 'bg-white/40 border-white/50 text-faazo-navy hover:bg-white/70 hover:border-[#0A7C86]/30'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* TILE 2: DYNAMIC STATE SELECTION PILLS */}
          <div className="md:col-span-6 lg:col-span-4 rounded-[28px] p-6 border border-[#E2EAEB]/80 bg-[#FAFBFD]/95 flex flex-col gap-4 min-h-[196px] relative overflow-hidden shadow-[0_15px_45px_rgba(11,37,48,0.03)]">
            {/* Dot Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            {/* Soft decorative design elements */}
            <div className="absolute -top-10 -left-10 w-36 h-36 bg-gradient-to-tr from-[#0A7C86]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-[10px] font-bold text-faazo-navy uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0A7C86]" /> Select Region / State
              </span>
              <p className="text-[10px] text-faazo-gray pl-1 mt-0.5">Filter by localized state</p>
            </div>

            <div className="flex-grow flex flex-col justify-center">
              {country === 'Others' ? (
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Enter region name..."
                    className="w-full px-4 py-3 rounded-xl border border-white bg-white/50 focus:outline-none focus:border-[#0A7C86] text-xs font-semibold text-faazo-navy shadow-inner transition-all"
                    value={stateRegion}
                    onChange={(e) => setStateRegion(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => setStateRegion('')}
                    className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                      stateRegion === ''
                        ? 'bg-[#0A7C86]/10 border-[#0A7C86] text-[#0A7C86] font-extrabold shadow-sm'
                        : 'bg-white/30 border-white/50 text-faazo-navy hover:bg-white/60'
                    }`}
                  >
                    All Regions
                  </button>
                  {availableStates.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStateRegion(st)}
                      className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                        stateRegion === st
                          ? 'bg-[#0A7C86]/10 border-[#0A7C86] text-[#0A7C86] font-extrabold shadow-sm'
                          : 'bg-white/30 border-white/50 text-faazo-navy hover:bg-white/60'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TILE 3: LIVE CITY SEARCH INPUT */}
          <div className="md:col-span-12 lg:col-span-3 rounded-[28px] p-6 border border-[#E2EAEB]/80 bg-[#FAFBFD]/95 flex flex-col justify-between min-h-[196px] relative overflow-hidden shadow-[0_15px_45px_rgba(11,37,48,0.03)]">
            {/* Dot Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
            {/* Soft decorative design elements */}
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-gradient-to-bl from-[#2EA5B0]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-[10px] font-bold text-faazo-navy uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#0A7C86]" /> City & Partner Search
              </span>
              <p className="text-[10px] text-faazo-gray pl-1 mt-0.5">Filter cards dynamically</p>
            </div>

            <div className="my-4 relative w-full">
              <input
                type="text"
                placeholder="Type city or dealer name..."
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-3.5 rounded-xl border border-white/60 bg-white/50 focus:outline-none focus:border-[#0A7C86] focus:ring-1 focus:ring-[#0A7C86] text-xs font-semibold text-faazo-navy shadow-inner transition-all duration-300 focus:bg-white focus:shadow-[0_0_15px_rgba(10,124,134,0.15)]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faazo-navy/40 pointer-events-none" />
            </div>

            <div className="text-[10px] text-faazo-gray/70 pl-1">
              Results update instantly as you type.
            </div>
          </div>

        </div>

        {/* RESULTS CONTAINER */}
        <div className="mt-8">
          {/* Header Info */}
          <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between border-b border-faazo-border/40 pb-4 gap-4">
            <div>
              <h2 className="font-jakarta font-extrabold text-lg text-faazo-navy tracking-tight flex items-center gap-2">
                <Building className="w-5 h-5 text-[#0A7C86]" /> Authorized Network Partners
              </h2>
              <p className="font-sans text-xs text-faazo-gray mt-1">
                Showing {filteredDealers.length} partners found in <span className="font-bold text-[#0A7C86]">{country}</span> {stateRegion && ` › ${stateRegion}`}
              </p>
            </div>
            
            <div className="self-start sm:self-auto glass-badge px-3 py-1 rounded-full text-xs font-bold text-faazo-navy flex items-center gap-1.5 shadow-sm border border-white">
              <span className="w-2 h-2 rounded-full bg-[#0A7C86] pulse-glow"></span>
              {country} Global Hub
            </div>
          </div>

          {/* Cards Grid */}
          <div className="w-full">
            {filteredDealers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDealers.map((dealer) => (
                  <div
                    key={dealer.id}
                    className="rounded-2xl p-6 flex flex-col justify-between border border-[#E2EAEB]/80 shadow-sm relative group overflow-hidden bg-[#FAFBFD] transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#0A7C86]/35"
                  >
                    {/* Dot Grid Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10, 124, 134, 0.08) 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                    {/* Premium glass lighting effect overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent blur-2xl pointer-events-none rounded-full" />
                    
                    {/* Soft green glow cap on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-[#0A7C86]/20 rounded-2xl transition-all duration-500 pointer-events-none" />
                    
                    {/* Content wrapper with z-10 to layer on top of absolute overlays */}
                    <div className="relative z-10 flex flex-col justify-between h-full w-full">
                      <div>
                        {/* Tag & Icon Row */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-inner ${
                            dealer.type === 'Distributor' 
                              ? 'bg-blue-50/70 border-blue-100 text-blue-600'
                              : 'bg-[#E6F3F5]/70 border-[#0A7C86]/20 text-[#0A7C86]'
                          }`}>
                            {dealer.type}
                          </span>
                          <Building className={`w-4 h-4 ${
                            dealer.type === 'Distributor' ? 'text-blue-500' : 'text-[#0A7C86]'
                          }`} />
                        </div>

                        {/* Dealer Name */}
                        <h3 className="font-jakarta font-extrabold text-lg text-faazo-navy mb-2 tracking-tight group-hover:text-[#0A7C86] transition-colors leading-snug">
                          {dealer.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-start gap-1.5 text-xs text-faazo-gray font-semibold mb-5">
                          <MapPin className="w-3.5 h-3.5 text-faazo-gray/70 shrink-0 mt-0.5" />
                          <span>{dealer.city}, {dealer.state}, {dealer.country}</span>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-faazo-border/30 my-4" />

                        {/* Contact Info */}
                        <div className="flex flex-col gap-2.5">
                          <div className="text-left">
                            <span className="text-[10px] text-faazo-gray font-bold uppercase tracking-wider block">Contact Person</span>
                            <span className="font-sans text-xs font-bold text-faazo-navy flex items-center gap-1.5 mt-0.5">
                              <Users className="w-3.5 h-3.5 text-[#0A7C86]/70" /> {dealer.contactPerson}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1.5 mt-1">
                            <a 
                              href={`tel:${dealer.phone}`} 
                              className="font-sans text-xs text-faazo-gray hover:text-[#0A7C86] transition-colors flex items-center gap-2 font-medium"
                            >
                              <Phone className="w-3.5 h-3.5 text-faazo-gray/70" /> {dealer.phone}
                            </a>
                            <a 
                              href={`mailto:${dealer.email}`} 
                              className="font-sans text-xs text-faazo-gray hover:text-[#0A7C86] transition-colors flex items-center gap-2 font-medium break-all"
                            >
                              <Mail className="w-3.5 h-3.5 text-faazo-gray/70" /> {dealer.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Map Button */}
                      {dealer.mapsLink && (
                        <div className="mt-6 pt-4 border-t border-faazo-border/20">
                          <a
                            href={dealer.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center py-2.5 bg-white/50 hover:bg-white border border-faazo-border/50 hover:border-[#0A7C86]/35 text-xs font-extrabold text-faazo-navy hover:text-[#0A7C86] rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm"
                          >
                            <MapPin className="w-3.5 h-3.5 shrink-0" /> View Location
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div
                className="max-w-md mx-auto glass-card rounded-[24px] p-10 border border-white/50 text-center flex flex-col items-center gap-4 bg-white/45 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-2">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="font-jakarta font-extrabold text-lg text-faazo-navy">No Dealers Found</h3>
                <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed">
                  We currently do not have registered dealers in <span className="font-bold text-faazo-navy">{stateRegion || country}</span>. Please try another location or contact our team for assistance.
                </p>
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="mt-2 text-xs font-bold text-[#0A7C86] hover:underline flex items-center gap-1"
                >
                  Apply for dealership in this area <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PARTNERSHIP CTA SECTION */}
        <div className="w-full max-w-4xl mx-auto mt-6">
          <div className="glass-card rounded-[24px] p-8 sm:p-10 border border-white/50 shadow-md relative overflow-hidden bg-gradient-to-r from-[#EAF2F4]/80 via-[#F4F9FA]/80 to-[#E6F3F5]/80 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-faazo-teal/10 to-transparent blur-3xl pointer-events-none" />
            
            <div className="flex flex-col items-start text-left max-w-xl">
              <span className="font-sans font-bold text-[10px] tracking-wider text-[#0A7C86] uppercase mb-2 block">
                Become a FAAZO Dealer
              </span>
              <h3 className="font-jakarta font-extrabold text-xl sm:text-2xl text-faazo-navy tracking-tight mb-2">
                Interested in partnering with FAAZO?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed">
                Expand your product line with premium, European-grade dental technology. Join our authorized dealer network to supply cutting-edge equipment in your region.
              </p>
            </div>

            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="btn-3d-teal bg-[#0A7C86] hover:bg-[#086770] text-white font-jakarta font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md transition-all duration-300 shrink-0 self-start md:self-auto hover:-translate-y-0.5 flex items-center gap-1.5 group"
            >
              Apply for Dealership <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
            </button>
          </div>
        </div>

      </div>

      {/* BECOME A DEALER APPLICATION MODAL */}
      <AnimatePresence>
        {isApplyModalOpen && (
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
              className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-[0_30px_70px_rgba(11,37,48,0.25)] z-10 overflow-hidden"
            >

              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-faazo-light text-faazo-navy/60 hover:text-faazo-navy transition"
              >
                <X className="w-4 h-4" />
              </button>

              {!formSubmitted ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-5.5 h-5.5 text-[#0A7C86]" />
                    <h2 className="font-jakarta font-extrabold text-xl text-faazo-navy tracking-tight">
                      Dealership Application
                    </h2>
                  </div>
                  
                  <p className="font-sans text-xs text-faazo-gray leading-relaxed mb-6">
                    Submit your application details below. Our corporate relations desk will review your business proposal and get in touch within 3 business days.
                  </p>

                  <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="app-name" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Full Name *</label>
                        <input
                          id="app-name"
                          type="text"
                          required
                          placeholder="Contact Person"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition"
                          value={applyForm.name}
                          onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="app-company" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Company Name *</label>
                        <input
                          id="app-company"
                          type="text"
                          required
                          placeholder="Legal Business Name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition"
                          value={applyForm.companyName}
                          onChange={(e) => setApplyForm({ ...applyForm, companyName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="app-email" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Email Address *</label>
                        <input
                          id="app-email"
                          type="email"
                          required
                          placeholder="e.g. corporate@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition"
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="app-phone" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Phone Number *</label>
                        <input
                          id="app-phone"
                          type="tel"
                          required
                          placeholder="Include Country Code"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition"
                          value={applyForm.phone}
                          onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="app-country" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Country *</label>
                        <select
                          id="app-country"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition cursor-pointer font-semibold"
                          value={applyForm.country}
                          onChange={(e) => setApplyForm({ ...applyForm, country: e.target.value })}
                        >
                          <option value="India">India</option>
                          <option value="UAE">UAE</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="Oman">Oman</option>
                          <option value="Qatar">Qatar</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Tanzania">Tanzania</option>
                          <option value="South Africa">South Africa</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="app-type" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Partnership Type *</label>
                        <select
                          id="app-type"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition cursor-pointer font-semibold"
                          value={applyForm.type}
                          onChange={(e) => setApplyForm({ ...applyForm, type: e.target.value })}
                        >
                          <option value="Dealer">Authorized Dealer</option>
                          <option value="Distributor">Regional Distributor</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="app-msg" className="block text-[10px] font-bold text-faazo-navy uppercase mb-1.5">Business Proposal / Message</label>
                      <textarea
                        id="app-msg"
                        rows="3"
                        placeholder="Briefly tell us about your current dental business and territory coverage..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-faazo-border bg-white focus:outline-none focus:border-[#0A7C86] text-xs text-faazo-navy transition resize-none"
                        value={applyForm.message}
                        onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                      ></textarea>
                    </div>

                    {formError && (
                      <span className="text-[11px] font-bold text-red-500 bg-red-50 border border-red-100 rounded-lg p-2 flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> {formError}
                      </span>
                    )}

                    <div className="flex gap-3 border-t border-faazo-border/30 pt-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsApplyModalOpen(false)}
                        className="flex-1 py-3 border border-faazo-border rounded-xl text-xs font-bold text-faazo-navy hover:bg-faazo-light transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-[#0A7C86] hover:bg-[#086770] text-white py-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5"
                      >
                        {isSubmitting ? 'Submitting...' : 'Send Application'}
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center py-6 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-2">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-jakarta font-extrabold text-xl text-faazo-navy">Application Received!</h3>
                  <p className="font-sans text-xs sm:text-sm text-faazo-gray leading-relaxed max-w-sm">
                    Thank you, <span className="font-bold text-faazo-navy">{applyForm.name}</span>. Your application for <span className="font-bold text-[#0A7C86]">{applyForm.companyName}</span> has been logged. Our partnership desk will reach out soon.
                  </p>
                  <button
                    onClick={() => { resetApplyForm(); setIsApplyModalOpen(false); }}
                    className="mt-4 px-6 py-2.5 bg-faazo-navy hover:bg-[#1A3E4E] text-white rounded-xl text-xs font-bold transition"
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
