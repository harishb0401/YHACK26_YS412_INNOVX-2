import React, { useState } from 'react';
import { 
  UserPlus, ShieldCheck, PackagePlus, Cpu, Calculator, Users, 
  Truck, FileCheck2, ArrowRight, CheckCircle2, AlertCircle, Sparkles, ChevronRight
} from 'lucide-react';

export default function HowItWorksView({ setActiveView, onOpenSignUp }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Collector Registration",
      subtitle: "Account Creation",
      icon: <UserPlus className="w-6 h-6 text-[#3F7655]" />,
      summary: "Collector creates an account and provides required registration details.",
      details: [
        "Select Collector account type",
        "Provide Full Name, Email, Address, and Secure Password",
        "Submit profile for phone & identity verification"
      ],
      badge: "Step 01"
    },
    {
      step: 2,
      title: "Verification",
      subtitle: "OTP & Contact Auth",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      summary: "Collector's phone number and required information are verified.",
      details: [
        "OTP sent via SMS to mobile number",
        "Instant code verification",
        "Verified badge applied to collector profile"
      ],
      badge: "Step 02"
    },
    {
      step: 3,
      title: "Register E-Waste",
      subtitle: "Lot Specification",
      icon: <PackagePlus className="w-6 h-6 text-[#3F7655]" />,
      summary: "Collector inputs e-waste parameters to define material batch.",
      details: [
        "Waste category & Item type selection",
        "Quantity (units) & Total weight (kg)",
        "Condition (Working, Partial, Non-Functional, Scrap)",
        "Photos and physical notes upload"
      ],
      badge: "Step 03"
    },
    {
      step: 4,
      title: "Waste Classification",
      subtitle: "Automated Categorization",
      icon: <Cpu className="w-6 h-6 text-purple-600" />,
      summary: "System categorizes the e-waste into appropriate material/type.",
      details: [
        "Identifies material grade (e.g. IT Equipment, Printed Circuit Board, Lithium Battery)",
        "Assigns standardized CPCB e-waste code",
        "Generates unique digital Lot ID (e.g. EL-2026-00125)"
      ],
      badge: "Step 04"
    },
    {
      step: 5,
      title: "Price Calculation",
      subtitle: "Fair Price Validation Engine",
      icon: <Calculator className="w-6 h-6 text-amber-600" />,
      summary: "Evaluates benchmark rates and checks asking price within fair range.",
      details: [
        "Displays real-time Benchmark Price (e.g. ₹40/kg)",
        "Shows Acceptable Price Range (e.g. ₹30/kg ─── ₹50/kg)",
        "Collector inputs proposed price (e.g. ₹42/kg)",
        "Rule validation: 'Price Accepted ✓' or 'Outside Recommended Range ⚠️'"
      ],
      badge: "Step 05"
    },
    {
      step: 6,
      title: "Recycler Matching",
      subtitle: "Automated Matching Engine",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      summary: "System identifies suitable authorized recyclers.",
      details: [
        "Matches waste category & minimum quantity threshold",
        "Evaluates recycler's active procurement requirements",
        "Checks geographic location & serviceability radius",
        "Verifies CPCB authorization status & licenses"
      ],
      badge: "Step 06"
    },
    {
      step: 7,
      title: "Handover",
      subtitle: "Collection & Physical Scan",
      icon: <Truck className="w-6 h-6 text-[#244936]" />,
      summary: "Recycler accepts the lot and collection/handover is arranged.",
      details: [
        "Recycler reviews lot details & confirms offer",
        "Pickup schedule & logistics dispatch arranged",
        "On-site QR code scan verifies physical handover"
      ],
      badge: "Step 07"
    },
    {
      step: 8,
      title: "Traceability",
      subtitle: "End-to-End Audit Trail",
      icon: <FileCheck2 className="w-6 h-6 text-emerald-700" />,
      summary: "Transaction status updated throughout the process.",
      details: [
        "Immutable timeline records every state change",
        "Platform digital receipt & settlement recorded",
        "CPCB EPR compliance certificate generated"
      ],
      badge: "Step 08"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 text-[#203128]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold uppercase tracking-wider border border-[#3F7655]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#3F7655]" /> STEP-BY-STEP PROCESS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#203128] tracking-tight">
            How E-Waste Recycling Works
          </h1>
          <p className="text-base sm:text-lg text-[#718078] font-medium leading-relaxed">
            A transparent, rule-driven digital workflow connecting collectors and authorized recyclers from registration to verified handover.
          </p>
        </div>

        {/* Visual Step Bar Summary */}
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-md">
          <h3 className="text-xs font-extrabold text-[#718078] uppercase tracking-wider text-center mb-6">
            Complete Workflow Sequence
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center">
            {steps.map((s) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-3 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-between border ${
                  activeStep === s.step
                    ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-md scale-105'
                    : 'bg-[#F8F5EA] text-[#203128] border-[#3F7655]/15 hover:bg-[#DDEBD8]'
                }`}
              >
                <span className="text-[10px] font-black opacity-80">{s.badge}</span>
                <div className="my-2">{s.icon}</div>
                <span className="text-[11px] font-extrabold leading-tight">{s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed 8-Step Grid */}
        <div className="space-y-6">
          {steps.map((s) => {
            const isSelected = activeStep === s.step;
            return (
              <div
                key={s.step}
                id={`step-${s.step}`}
                onClick={() => setActiveStep(s.step)}
                className={`bg-white rounded-[28px] border transition-all duration-200 p-6 sm:p-8 cursor-pointer ${
                  isSelected 
                    ? 'border-[#3F7655] shadow-xl ring-2 ring-[#3F7655]/20' 
                    : 'border-[#3F7655]/15 shadow-sm hover:border-[#3F7655]/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-black text-lg shrink-0 shadow-inner">
                      0{s.step}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-[#3F7655] tracking-widest bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                          {s.subtitle}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-[#203128]">{s.title}</h2>
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
          <h2 className="text-2xl sm:text-3xl font-black">Ready to Start Recycling E-Waste?</h2>
          <p className="text-sm text-[#DDEBD8] max-w-xl mx-auto font-medium">
            Join Tamil Nadu's authorized e-waste network today. Register as a Collector or an Authorized Recycler.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveView('signup')}
              className="px-8 py-3.5 rounded-full bg-[#F2C94C] hover:bg-[#e0b83b] text-[#244936] font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('guide')}
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition cursor-pointer"
            >
              Explore Recycling Guide
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
