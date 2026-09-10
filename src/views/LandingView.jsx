import React, { useState } from 'react';
import { 
  ArrowRight, Search, CheckCircle2, MapPin, Truck, Award, Sparkles, 
  BookOpen, Heart, Leaf, ShieldCheck, ChevronRight, ChevronLeft, Droplets, Users, RefreshCw, QrCode, ShoppingBag
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { 
  communityImpactStats, recyclingCategories, ecoJournalArticles, 
  communityTestimonials, searchableMaterials, initialRecyclerRequirements
} from '../mockData';

export default function LandingView({ setActiveView, onOpenSearchModal }) {
  const { t } = useTranslation();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % communityTestimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + communityTestimonials.length) % communityTestimonials.length);
  };

  const activeTestimonial = communityTestimonials[testimonialIndex];

  return (
    <div className="space-y-0 text-[#203128]">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#F8F5EA] py-16 sm:py-20 lg:py-24 border-b border-[#3F7655]/10">
        
        {/* Decorative organic background shapes */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#DDEBD8]/60 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-[#F2C94C]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Eyebrow label */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold tracking-wider uppercase border border-[#3F7655]/20">
                <Leaf className="w-4 h-4 text-[#3F7655]" />
                <span>{t("heroBadge")}</span>
              </div>

              {/* Large Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#203128] tracking-tight leading-[1.15]">
                {t("heroTitle1")} <br />
                <span className="text-[#3F7655]">{t("heroTitle2")}</span>
              </h1>

              {/* Supporting Paragraph */}
              <p className="text-lg sm:text-xl text-[#718078] max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium">
                {t("heroDesc")}
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => setActiveView('collector')}
                  className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-full shadow-lg shadow-[#3F7655]/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Truck className="w-5 h-5" />
                  <span>{t("ctaViewRequirements")}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveView('recycler')}
                  className="w-full sm:w-auto px-7 py-4 text-base font-bold text-[#203128] bg-white hover:bg-[#DDEBD8]/50 border border-[#3F7655]/20 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-[#3F7655]" />
                  <span>{t("ctaPostRequirement")}</span>
                </button>
              </div>

              {/* Hero Stats Pill */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-extrabold text-[#203128]">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#3F7655]/15 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#3F7655] text-white flex items-center justify-center text-[10px] font-black">♻</div>
                  <span>{communityImpactStats.recycledKg} e-waste recycled</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#3F7655]/15 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#F2C94C] text-[#244936] flex items-center justify-center text-[10px] font-black">CPCB</div>
                  <span>14 Verified Facilities</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Signature Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-xl space-y-5">
                
                <div className="flex items-center justify-between pb-3 border-b border-[#3F7655]/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black">
                      EL
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#3F7655] tracking-widest block">
                        SIGNATURE DEMAND FLOW
                      </span>
                      <h3 className="text-sm font-black text-[#244936]">Recycler ↔ Collector</h3>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Live Demo
                  </span>
                </div>

                {/* Workflow Preview Pill */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#3F7655]/15 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px]">1. Recycler Demand</span>
                      <strong className="text-slate-800">IT Equipment (50 kg)</strong>
                    </div>
                    <span className="font-black text-[#3F7655]">₹300/kg budget</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#3F7655]/15 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px]">2. Collector Declaration</span>
                      <strong className="text-slate-800">Laptop + Mobile + Printer (10 kg)</strong>
                    </div>
                    <span className="font-black text-[#244936]">₹3,100 est. value</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#DDEBD8]/60 border border-[#3F7655]/20 flex items-center justify-between">
                    <div>
                      <span className="text-slate-600 font-bold block text-[10px]">3. Digital Lot & Handover</span>
                      <strong className="text-[#244936]">LOT EL26-TN-00125</strong>
                    </div>
                    <span className="text-xs font-black text-[#3F7655] flex items-center gap-1">
                      <QrCode className="w-4 h-4" /> QR Verified
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('collector')}
                  className="w-full py-3 rounded-2xl bg-[#244936] hover:bg-[#14291E] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch Interactive Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE 8-STEP CIRCULAR WORKFLOW */}
      <section className="py-20 bg-white border-b border-[#3F7655]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1 rounded-full">
              DETERMINISTIC WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#203128] tracking-tight">
              {t("howItWorksTitle")}
            </h2>
            <p className="text-base text-[#718078]">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F7655] text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-extrabold text-base text-[#203128]">Recycler Demand</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                CPCB verified recyclers publish material requirements with desired category, quantity (kg), and budget rate.
              </p>
            </div>

            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F7655] text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-extrabold text-base text-[#203128]">Collector Response</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Informal collectors declare available itemized weights and input their asking price per kilogram.
              </p>
            </div>

            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F2C94C] text-[#244936] font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-extrabold text-base text-[#203128]">Rule-Based Check</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                ECO-Link validates asking price against reference scrap ranges, triggering a warning if significantly above market.
              </p>
            </div>

            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/15 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#244936] text-white font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="font-extrabold text-base text-[#203128]">QR Digital Lot</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Recycler confirms collector, generating a traceable Digital Material Lot with physical QR handover verification.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. MATERIAL CATEGORIES & SCRAP PRICING */}
      <section className="py-20 bg-[#F8F5EA] border-b border-[#3F7655]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1 rounded-full">
              RECYCLING REFERENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#203128]">
              Accepted E-Waste Categories
            </h2>
            <p className="text-base text-[#718078]">
              Standardized reference scrap prices based on local secondary material recovery benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recyclingCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-6 rounded-[28px] border border-[#3F7655]/15 hover:border-[#3F7655]/40 transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="text-3xl">{cat.icon}</div>
                  <h3 className="font-extrabold text-base text-[#203128]">{cat.name}</h3>
                  <span className="text-xs font-bold text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full inline-block">
                    Ref: {cat.referenceRate}
                  </span>
                  <p className="text-xs text-[#718078] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <button
                  onClick={() => setActiveView('guide')}
                  className="pt-3 border-t border-[#3F7655]/10 text-xs font-extrabold text-[#3F7655] hover:text-[#244936] flex items-center justify-between cursor-pointer"
                >
                  <span>View Sorting Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. INSTANT SEARCH CHECKER CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#244936] text-white p-8 sm:p-12 rounded-[32px] shadow-xl border border-[#3F7655]/30 text-center space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#F2C94C] bg-[#14291E] px-3.5 py-1 rounded-full">
                INSTANT SCRAP CHECKER
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Can I recycle this electronic device?
              </h2>
              <p className="text-xs sm:text-sm text-[#DDEBD8] max-w-lg mx-auto">
                Check scrap classification, estimated per-kilogram reference prices, and hazardous battery safety rules instantly.
              </p>
            </div>

            <button
              onClick={onOpenSearchModal}
              className="px-8 py-3.5 rounded-full bg-[#F2C94C] hover:bg-[#e2b83b] text-[#244936] font-black text-sm shadow-md transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search E-Waste Item Now</span>
            </button>

          </div>
        </div>
      </section>

      {/* 5. COMMUNITY TESTIMONIALS */}
      <section className="py-16 bg-[#F8F5EA] border-t border-[#3F7655]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1 rounded-full">
            WHAT OUR COMMUNITY SAYS
          </span>

          <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
            <p className="text-base sm:text-lg text-[#203128] font-medium leading-relaxed italic">
              "{activeTestimonial.quote}"
            </p>

            <div className="flex items-center justify-center gap-3">
              <img
                src={activeTestimonial.avatar}
                alt={activeTestimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#3F7655]"
              />
              <div className="text-left">
                <h4 className="text-sm font-extrabold text-[#203128]">{activeTestimonial.name}</h4>
                <p className="text-xs text-[#718078]">{activeTestimonial.role} · {activeTestimonial.location}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-[#3F7655]/20 text-[#203128] hover:bg-[#DDEBD8] transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-[#3F7655]/20 text-[#203128] hover:bg-[#DDEBD8] transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
