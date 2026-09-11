import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Search, CheckCircle2, MapPin, Truck, Award, Sparkles, 
  BookOpen, Heart, Leaf, ShieldCheck, ChevronRight, ChevronLeft, Droplets, Users, RefreshCw, DollarSign, Cpu, FileCheck2, Building2
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { 
  communityImpactStats, recyclingCategories, ecoJournalArticles, 
  communityTestimonials, searchableMaterials, initialRecyclers
} from '../../data/mockData';

export default function Home({ onOpenSearchModal }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
        
        {/* Background gradient graphics */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#DDEBD8]/60 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-5 left-5 w-80 h-80 bg-[#F2C94C]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold tracking-wider uppercase border border-[#3F7655]/20">
                <Leaf className="w-4 h-4 text-[#3F7655]" />
                <span>{t('authorizedEcosystemBadge', 'Authorized E-Waste Ecosystem')}</span>
              </div>

              {/* Exact Section 1 Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#203128] tracking-tight leading-[1.15]">
                {t('heroTitleLine1', 'Connect. Recycle.')} <br />
                <span className="text-[#3F7655]">{t('heroTitleLine2', 'Earn. Sustain.')}</span>
              </h1>

              {/* Exact Section 1 Description */}
              <p className="text-lg sm:text-xl text-[#718078] max-w-2xl leading-relaxed mx-auto lg:mx-0 font-medium">
                {t('heroDescText', 'A digital platform connecting e-waste collectors with authorized recyclers through transparent pricing, waste classification, and recycler matching.')}
              </p>

              {/* Exact Section 1 Buttons: Get Started & How It Works */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 text-base font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-full shadow-lg shadow-[#3F7655]/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{t('getStarted', 'Get Started')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate('/how-it-works')}
                  className="w-full sm:w-auto px-7 py-4 text-base font-bold text-[#203128] bg-white hover:bg-[#DDEBD8]/50 border border-[#3F7655]/20 rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-5 h-5 text-[#3F7655]" />
                  <span>{t('navHowItWorks', 'How It Works')}</span>
                </button>
              </div>

              {/* Hero Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-extrabold text-[#203128]">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#3F7655]/15 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#3F7655] text-white flex items-center justify-center text-[10px] font-black">♻</div>
                  <span>{communityImpactStats.recycledKg} {t('ewasteProcessedBadge', 'e-waste processed')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#3F7655]/15 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-[#F2C94C] text-[#244936] flex items-center justify-center text-[10px] font-black">CPCB</div>
                  <span>14 {t('verifiedRecyclersBadge', 'Verified Recyclers')}</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#3F7655]/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black">
                      EL
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#3F7655] tracking-widest block">
                        {t('marketplaceFlowHeader', 'E-WASTE MARKETPLACE FLOW')}
                      </span>
                      <h3 className="text-sm font-black text-[#244936]">Collector ↔ Recycler</h3>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {t('liveEngineTag', 'Live Engine')}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#3F7655]/15 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px]">1. {t('wasteRegistrationStep', 'Waste Registration')}</span>
                      <strong className="text-slate-800">5 x Laptops (12 kg)</strong>
                    </div>
                    <span className="font-black text-[#3F7655]">₹40/kg {t('benchmark', 'Benchmark')}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#FAF8F2] border border-[#3F7655]/15 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 font-bold block text-[10px]">2. {t('fairPriceValidationStep', 'Fair Price Validation')}</span>
                      <strong className="text-slate-800">{t('offeredRate', 'Offered')}: ₹42/kg</strong>
                    </div>
                    <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{t('priceAcceptedBadge', 'Price Accepted ✓')}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#DDEBD8]/60 border border-[#3F7655]/20 flex items-center justify-between">
                    <div>
                      <span className="text-slate-600 font-bold block text-[10px]">3. {t('digitalLotHandoverStep', 'Digital Lot & Handover')}</span>
                      <strong className="text-[#244936]">EL-2026-00125</strong>
                    </div>
                    <span className="text-xs font-black text-[#3F7655] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> {t('matched', 'Matched')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/collector/dashboard')}
                  className="w-full py-3 rounded-2xl bg-[#244936] hover:bg-[#14291E] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('openCollectorPortalBtn', 'Open Collector Portal')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. KEY FEATURES */}
      <section className="py-20 bg-white border-b border-[#3F7655]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1 rounded-full">
              {t('keyFeaturesBadge', 'KEY FEATURES')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#203128] tracking-tight">
              {t('designedForTransparencyTitle', 'Designed for Complete Transparency')}
            </h2>
            <p className="text-base text-[#718078]">
              {t('standardizingTransactionsSub', 'Standardizing e-waste transactions with fair pricing, verified participants, and certified recycling.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Transparent Pricing */}
            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-4 hover:border-[#3F7655]/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#203128]">{t('transparentPricing', 'Transparent Pricing')}</h3>
              <ul className="space-y-2 text-xs font-bold text-[#718078]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('viewBenchmarkPricesFeat', 'View benchmark prices for all material categories')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('calcFairPriceRangeFeat', 'Calculate fair price range & validate collector offer')}</span>
                </li>
              </ul>
            </div>

            {/* Card 2: E-Waste Classification */}
            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-4 hover:border-[#3F7655]/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#203128]">{t('eWasteClassificationTitle', 'E-Waste Classification')}</h3>
              <ul className="space-y-2 text-xs font-bold text-[#718078]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('identifyCategoryAutoFeat', 'Identify waste category automatically')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('createDigitalLotsFeat', 'Create digital waste lots with unique Lot IDs')}</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Recycler Matching */}
            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-4 hover:border-[#3F7655]/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#203128]">{t('recyclerMatchingTitle', 'Recycler Matching')}</h3>
              <ul className="space-y-2 text-xs font-bold text-[#718078]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('findRecyclersNearbyFeat', 'Find suitable authorized recyclers nearby')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('matchBasedOnCapacityFeat', 'Match based on waste type, capacity & budget')}</span>
                </li>
              </ul>
            </div>

            {/* Card 4: Certified Recycling */}
            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-4 hover:border-[#3F7655]/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-[#203128]">{t('certifiedRecyclingTitle', 'Certified Recycling')}</h3>
              <ul className="space-y-2 text-xs font-bold text-[#718078]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('trackHandoverFeat', 'Formal handover from collection to authorized recycler')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('transparentLogsFeat', 'Real-time status updates & transparent settlement logs')}</span>
                </li>
              </ul>
            </div>

            {/* Card 5: Verified Participants */}
            <div className="bg-[#FAF8F2] p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-4 sm:col-span-2 lg:col-span-2 hover:border-[#3F7655]/50 transition">
              <div className="w-12 h-12 rounded-2xl bg-[#244936] text-white flex items-center justify-center font-black">
                <ShieldCheck className="w-6 h-6 text-[#F2C94C]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#203128]">{t('verifiedParticipantsTitle', 'Verified Participants')}</h3>
              <ul className="space-y-2 text-xs font-bold text-[#718078]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('otpVerifiedPhoneCollectorsFeat', 'OTP-verified phone numbers for collectors')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{t('cpcbTnpcbAuthCheckFeat', 'CPCB & TNPCB authorized certification check for recyclers')}</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS STEP BAR */}
      <section className="py-16 bg-[#F8F5EA] border-b border-[#3F7655]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1 rounded-full">
            {t('howItWorksBadge', 'HOW IT WORKS')}
          </span>
          <h2 className="text-3xl font-extrabold text-[#203128]">
            {t('workflowFlowTitle', 'Register → Classify → Price → Match → Handover → Settle')}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: t('step1Register', '1. Register'), desc: t('collectorRecyclerAuth', 'Collector / Recycler Auth') },
              { step: t('step2Classify', '2. Classify'), desc: t('identifyWasteCategory', 'Identify Waste Category') },
              { step: t('step3Price', '3. Price'), desc: t('benchmarkValidation', 'Benchmark Validation') },
              { step: t('step4Match', '4. Match'), desc: t('findSuitableRecycler', 'Find Suitable Recycler') },
              { step: t('step5Handover', '5. Handover'), desc: t('handoverCollection', 'Collection & Handover') },
              { step: t('step6Settle', '6. Settlement'), desc: t('eprComplianceRecord', 'EPR Compliance Record') },
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-[#3F7655]/15 shadow-sm space-y-1">
                <span className="text-xs font-black text-[#3F7655] block">{s.step}</span>
                <span className="text-[11px] font-semibold text-[#718078]">{s.desc}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/how-it-works')}
            className="px-6 py-2.5 rounded-full bg-white border border-[#3F7655]/20 text-[#203128] font-bold text-xs hover:bg-[#DDEBD8] transition cursor-pointer inline-flex items-center gap-2"
          >
            <span>{t('viewComplete8StepProcess', 'View Complete 8-Step Visual Process')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4. BOTTOM SECTIONS */}
      <section className="py-20 bg-white border-b border-[#3F7655]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Environmental Impact Metrics */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3 py-1 rounded-full">
                {t('envImpactBadge', 'ENVIRONMENTAL IMPACT')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#203128]">
                {t('drivingResourceRecoveryTitle', 'Driving Measurable Resource Recovery')}
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-6 bg-[#FAF8F2] rounded-3xl border border-[#3F7655]/15">
                <span className="text-3xl font-black text-[#3F7655] block">{communityImpactStats.recycledKg}</span>
                <span className="text-xs font-bold text-[#718078] mt-1 block">{t('totalEWasteProcessed', 'Total E-Waste Processed')}</span>
              </div>
              <div className="p-6 bg-[#FAF8F2] rounded-3xl border border-[#3F7655]/15">
                <span className="text-3xl font-black text-[#244936] block">{communityImpactStats.co2SavedKg}</span>
                <span className="text-xs font-bold text-[#718078] mt-1 block">{t('co2EmissionsPrevented', 'CO₂ Emissions Prevented')}</span>
              </div>
              <div className="p-6 bg-[#FAF8F2] rounded-3xl border border-[#3F7655]/15">
                <span className="text-3xl font-black text-amber-600 block">{communityImpactStats.goldRecoveredGrams}</span>
                <span className="text-xs font-bold text-[#718078] mt-1 block">{t('preciousMetalsRecovered', 'Precious Metals Recovered')}</span>
              </div>
              <div className="p-6 bg-[#FAF8F2] rounded-3xl border border-[#3F7655]/15">
                <span className="text-3xl font-black text-[#3F7655] block">{communityImpactStats.copperRecoveredKg}</span>
                <span className="text-xs font-bold text-[#718078] mt-1 block">{t('secondaryCopperRecycled', 'Secondary Copper Recycled')}</span>
              </div>
            </div>
          </div>

          {/* Number of Waste Lots Processed */}
          <div className="p-8 rounded-[32px] bg-[#DDEBD8]/50 border border-[#3F7655]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase text-[#3F7655] tracking-wider">{t('platformStatsLabel', 'PLATFORM STATISTICS')}</span>
              <h3 className="text-2xl font-black text-[#203128]">{t('digitalWasteLotsProcessedTitle', '5,820 Digital Waste Lots Processed')}</h3>
              <p className="text-xs text-[#718078] font-semibold">{t('digitalWasteLotsProcessedSub', 'Over 4,932 successful handovers completed across Tamil Nadu industrial corridors.')}</p>
            </div>
            <button
              onClick={() => navigate('/collector/register-waste')}
              className="px-6 py-3 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-2xl shadow transition shrink-0 cursor-pointer"
            >
              {t('registerNewWasteLotBtn', 'Register New Waste Lot')} →
            </button>
          </div>

          {/* Recycling Partners */}
          <div className="space-y-6 text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#718078]">
              {t('authorizedRecyclingPartnersLabel', 'AUTHORIZED RECYCLING PARTNERS')}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {initialRecyclers.map((r) => (
                <div key={r.id} className="px-4 py-2.5 bg-[#FAF8F2] border border-[#3F7655]/15 rounded-2xl text-xs font-extrabold text-[#203128] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#3F7655]" />
                  <span>{r.companyName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA: Start Recycling */}
          <div className="bg-[#244936] text-white p-10 sm:p-12 rounded-[36px] shadow-2xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black">{t('startRecyclingEWasteTodayTitle', 'Start Recycling E-Waste Today')}</h2>
            <p className="text-sm text-[#DDEBD8] max-w-xl mx-auto font-medium">
              {t('startRecyclingEWasteTodaySub', 'Join collectors and authorized recyclers building a clean, transparent, and circular e-waste economy.')}
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 rounded-full bg-[#F2C94C] hover:bg-[#e0b83b] text-[#244936] font-black text-sm shadow-xl transition inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{t('startRecycling', 'Start Recycling')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
