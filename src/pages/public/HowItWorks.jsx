import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, ShieldCheck, PackagePlus, Cpu, Calculator, Users, 
  Truck, FileCheck2, ArrowRight, CheckCircle2, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';

import { useTranslation } from '../../i18n';

export default function HowItWorks() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: t('hwStep1Title', 'Collector Registration'),
      subtitle: t('hwStep1Subtitle', 'Account Creation'),
      icon: <UserPlus className="w-6 h-6 text-[#3F7655]" />,
      summary: t('hwStep1Summary', 'Collector creates an account and provides required registration details.'),
      details: [
        t('hwStep1Detail1', 'Select Collector account type'),
        t('hwStep1Detail2', 'Provide Full Name, Email, Address, and Secure Password'),
        t('hwStep1Detail3', 'Submit profile for phone & identity verification')
      ],
      badge: "Step 01"
    },
    {
      step: 2,
      title: t('hwStep2Title', 'Verification'),
      subtitle: t('hwStep2Subtitle', 'OTP & Contact Auth'),
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      summary: t('hwStep2Summary', "Collector's phone number and required information are verified."),
      details: [
        t('hwStep2Detail1', 'OTP sent via SMS to mobile number'),
        t('hwStep2Detail2', 'Instant code verification'),
        t('hwStep2Detail3', 'Verified badge applied to collector profile')
      ],
      badge: "Step 02"
    },
    {
      step: 3,
      title: t('hwStep3Title', 'Register E-Waste'),
      subtitle: t('hwStep3Subtitle', 'Lot Specification'),
      icon: <PackagePlus className="w-6 h-6 text-[#3F7655]" />,
      summary: t('hwStep3Summary', 'Collector inputs e-waste parameters to define material batch.'),
      details: [
        t('hwStep3Detail1', 'Waste category & Item type selection'),
        t('hwStep3Detail2', 'Quantity (units) & Total weight (kg)'),
        t('hwStep3Detail3', 'Condition (Working, Partial, Non-Functional, Scrap)'),
        t('hwStep3Detail4', 'Photos and physical notes upload')
      ],
      badge: "Step 03"
    },
    {
      step: 4,
      title: t('hwStep4Title', 'Waste Classification'),
      subtitle: t('hwStep4Subtitle', 'Automated Categorization'),
      icon: <Cpu className="w-6 h-6 text-purple-600" />,
      summary: t('hwStep4Summary', 'System categorizes the e-waste into appropriate material/type.'),
      details: [
        t('hwStep4Detail1', 'Identifies material grade (e.g. IT Equipment, Printed Circuit Board, Lithium Battery)'),
        t('hwStep4Detail2', 'Assigns standardized CPCB e-waste code'),
        t('hwStep4Detail3', 'Generates unique digital Lot ID (e.g. EL-2026-00125)')
      ],
      badge: "Step 04"
    },
    {
      step: 5,
      title: t('hwStep5Title', 'Pricing Calculation'),
      subtitle: t('hwStep5Subtitle', 'Fair Price Validation'),
      icon: <Calculator className="w-6 h-6 text-amber-600" />,
      summary: t('hwStep5Summary', 'Calculates fair price range using market benchmark rates and acceptable tolerances.'),
      details: [
        t('hwStep5Detail1', 'Fetches government reference price per kg/unit'),
        t('hwStep5Detail2', 'Applies pre-defined tolerance range (e.g. ±15% to ±25%)'),
        t('hwStep5Detail3', 'Flags predatory below-market bids instantly to protect collectors')
      ],
      badge: "Step 05"
    },
    {
      step: 6,
      title: t('hwStep6Title', 'Recycler Matching'),
      subtitle: t('hwStep6Subtitle', 'Smart Procurement Match'),
      icon: <Users className="w-6 h-6 text-blue-600" />,
      summary: t('hwStep6Summary', 'System matches waste lots to authorized recyclers with matching requirements.'),
      details: [
        t('hwStep6Detail1', 'Filters verified recyclers authorized for this exact waste category'),
        t('hwStep6Detail2', 'Calculates distance & transport feasibility'),
        t('hwStep6Detail3', 'Recyclers submit transparent, binding purchase bids')
      ],
      badge: "Step 06"
    },
    {
      step: 7,
      title: t('hwStep7Title', 'Handover & Logistics'),
      subtitle: t('hwStep7Subtitle', 'Secure Physical Exchange'),
      icon: <Truck className="w-6 h-6 text-[#244936]" />,
      summary: t('hwStep7Summary', 'Scheduled pickup and secure physical collection between collector and recycler.'),
      details: [
        t('hwStep7Detail1', 'Pickup date and time coordination'),
        t('hwStep7Detail2', 'Weighbridge verification and material inspection'),
        t('hwStep7Detail3', 'Direct digital settlement into collector wallet')
      ],
      badge: "Step 07"
    },
    {
      step: 8,
      title: t('hwStep8Title', 'Settlement & Certificate'),
      subtitle: t('hwStep8Subtitle', 'EPR Compliance Record'),
      icon: <FileCheck2 className="w-6 h-6 text-emerald-700" />,
      summary: t('hwStep8Summary', 'Completed handover settlement with verifiable government recovery certificate.'),
      details: [
        t('hwStep8Detail1', 'Certified material recovery documentation'),
        t('hwStep8Detail2', 'Government CPCB compliant recovery certificate issued'),
        t('hwStep8Detail3', 'Full transparent transaction history recorded')
      ],
      badge: "Step 08"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 text-[#203128]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold uppercase tracking-wider border border-[#3F7655]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#3F7655]" />
            <span>{t('endToEndWorkflowBadge', 'End-to-End Workflow')}</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#203128] tracking-tight">
            {t('howEcoLinkWorksTitle', 'How Eco-Link Works')}
          </h1>
          <p className="text-base sm:text-lg text-[#718078] font-medium leading-relaxed">
            {t('howItWorksSubtitle', 'From informal collection to certified industrial recycling — follow the complete 8-step journey built on transparent pricing and certified compliance.')}
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#3F7655]/20 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] gap-2">
            {steps.map((s) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`flex-1 py-3 px-2 rounded-2xl text-xs font-extrabold transition flex flex-col items-center gap-1.5 cursor-pointer ${
                  activeStep === s.step
                    ? 'bg-[#3F7655] text-white shadow-md'
                    : 'bg-[#F8F5EA] text-[#203128] hover:bg-[#DDEBD8]/50'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-80">{s.badge}</span>
                <span className="truncate max-w-[100px] text-center">{s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Step Spotlight Card */}
        {(() => {
          const stepData = steps.find(s => s.step === activeStep) || steps[0];
          return (
            <div className="bg-white p-8 sm:p-10 rounded-[32px] border-2 border-[#3F7655]/30 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3F7655]/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#DDEBD8] flex items-center justify-center">
                    {stepData.icon}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-[#3F7655]">
                      {stepData.badge} • {stepData.subtitle}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#203128]">{stepData.title}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeStep === 1}
                    onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 text-xs font-bold rounded-xl border border-[#3F7655]/20 text-[#203128] disabled:opacity-40 hover:bg-[#DDEBD8] transition cursor-pointer"
                  >
                    ← {t('previous', 'Previous')}
                  </button>
                  <button
                    disabled={activeStep === steps.length}
                    onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[#3F7655] text-white disabled:opacity-40 hover:bg-[#244936] transition cursor-pointer"
                  >
                    {t('next', 'Next')} →
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-base font-semibold text-[#718078] leading-relaxed">
                  {stepData.summary}
                </p>

                <div className="p-6 bg-[#FAF8F2] rounded-2xl border border-[#3F7655]/15 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-[#3F7655] tracking-wider">
                    {t('keyActionsValidationRules', 'Key Actions & Validation Rules:')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {stepData.details.map((d, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#3F7655]/10 flex items-start gap-2 text-xs font-bold text-[#203128]">
                        <CheckCircle2 className="w-4 h-4 text-[#3F7655] shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Complete 8-Step Timeline List */}
        <div className="space-y-4">
          <div className="text-center pb-2">
            <h3 className="text-2xl font-black text-[#203128]">{t('all8MilestonesTitle', 'All 8 Workflow Milestones')}</h3>
          </div>

          {steps.map((s) => {
            const isSelected = s.step === activeStep;
            return (
              <div 
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-6 bg-white rounded-3xl border transition cursor-pointer ${
                  isSelected 
                    ? 'border-[#3F7655] shadow-lg ring-2 ring-[#3F7655]/20' 
                    : 'border-[#3F7655]/15 hover:border-[#3F7655]/40 hover:bg-[#FAF8F2]'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Step Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F5EA] flex items-center justify-center font-bold text-sm shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#3F7655]">{s.badge}:</span>
                        <h4 className="text-base font-extrabold text-[#203128]">{s.title}</h4>
                      </div>
                      <p className="text-sm font-semibold text-[#718078]">{s.summary}</p>
                    </div>
                  </div>

                  {/* Right Details List */}
                  <div className="md:w-1/2 bg-[#F8F5EA] p-4 rounded-2xl border border-[#3F7655]/10 space-y-2">
                    {s.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2 text-xs font-bold text-[#203128]">
                        <CheckCircle2 className="w-4 h-4 text-[#3F7655] shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-[#244936] text-white p-8 sm:p-10 rounded-[32px] shadow-xl text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">{t('readyToStartRecycling', 'Ready to Start Recycling E-Waste?')}</h2>
          <p className="text-sm text-[#DDEBD8] max-w-xl mx-auto font-medium">
            {t('joinNetworkBannerSub', "Join Tamil Nadu's authorized e-waste network today. Register as a Collector or an Authorized Recycler.")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3.5 rounded-full bg-[#F2C94C] hover:bg-[#e0b83b] text-[#244936] font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>{t('getStartedNow', 'Get Started Now')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/recycle-guide')}
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition cursor-pointer"
            >
              {t('ctaExploreGuide', 'Explore Recycling Guide')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
