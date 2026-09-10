import React, { useState } from 'react';
import { 
  UserPlus, PlusCircle, Sparkles, Truck, PackageCheck, RefreshCw, 
  Award, TrendingUp, Check, ChevronRight, ShieldCheck, ArrowRight 
} from 'lucide-react';

export default function HowItWorksSection({ onOpenAddWasteModal, setActiveView }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: 1,
      title: "Collector Registers",
      desc: "The collector creates an account and submits required business & license details for verification.",
      icon: UserPlus,
      color: "emerald",
      badge: "Step 1: Onboarding",
      details: ["License ID Verification", "Facility Geocoding", "Verified Collector Badge"]
    },
    {
      num: 2,
      title: "Collector Adds E-Waste",
      desc: "Collector records waste parameters: Waste type, Category, Quantity, Weight, Pickup location, Images, & Condition.",
      icon: PlusCircle,
      color: "teal",
      badge: "Step 2: Manifest Logging",
      details: ["Category selection", "Weight & unit counts", "Condition reporting"]
    },
    {
      num: 3,
      title: "Rule-Based Recycler Assignment",
      desc: "Eligible verified recyclers are matched deterministically based on category, capability, capacity, distance limit & verification status.",
      icon: Sparkles,
      color: "cyan",
      badge: "Step 3: Matching Engine",
      isHighlight: true,
      details: ["Category Match ✓", "Capacity Limit ✓", "Distance Radius < 50km ✓"]
    },
    {
      num: 4,
      title: "Waste Pickup & Tracking ID",
      desc: "Collector schedules transportation and system generates a unique permanent Tracking ID (e.g. EW-2026-001245).",
      icon: Truck,
      color: "purple",
      badge: "Step 4: Logistics",
      details: ["Unique Manifest Tracking ID", "Scheduled Freight Pickups", "GPS Dispatch Tracking"]
    },
    {
      num: 5,
      title: "Recycler Receives Waste",
      desc: "Recycler dock intake team confirms: Waste received, Actual measured weight, Category & intake condition.",
      icon: PackageCheck,
      color: "blue",
      badge: "Step 5: Dock Receipt",
      details: ["Weighbridge Verification", "Physical Intake Audit", "Status Badge -> Received"]
    },
    {
      num: 6,
      title: "Recycling Processing Workflow",
      desc: "Recycler updates multi-stage processing status: Received -> Sorting -> Dismantling -> Material Recovery -> Recycled.",
      icon: RefreshCw,
      color: "indigo",
      badge: "Step 6: Processing",
      details: ["Hazardous Component Isolation", "PCB & Gold Refining", "Plastic Granulation"]
    },
    {
      num: 7,
      title: "Recycling Proof & Certificate",
      desc: "Recycler uploads processing evidence, digital recycling certificate, and exact recovered material quantities.",
      icon: Award,
      color: "emerald",
      badge: "Step 7: Audit Proof",
      details: ["Digital Certificate Generation", "Photos & Weight Slips", "Verifiable Audit Logs"]
    },
    {
      num: 8,
      title: "Impact Recorded & Quantified",
      desc: "Platform automatically calculates e-waste diverted from landfill, metals recovered, and net CO₂ emissions offset.",
      icon: TrendingUp,
      color: "teal",
      badge: "Step 8: Impact Ledger",
      details: ["Landfill Mass Diverted", "Emissions Reduction Ledger", "ESG Compliance Reports"]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Transparent 8-Step Journey
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How EcoLink Connects E-Waste Lifecycle
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            From initial collection logging to verified material recovery and certificate issuance, our deterministic workflow guarantees accountability at every phase.
          </p>
        </div>

        {/* 8-Step Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            const isCurrent = activeStep === idx;
            
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl bg-white border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between ${
                  step.isHighlight 
                    ? 'border-emerald-400 ring-2 ring-emerald-500/20 shadow-md' 
                    : isCurrent 
                      ? 'border-emerald-500 shadow-lg' 
                      : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                {/* Step Number & Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center border border-emerald-200">
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {step.desc}
                  </p>
                </div>

                {/* Sub-details list */}
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  {step.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {step.isHighlight && (
                  <div className="absolute -top-2.5 -right-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
                    Rule-Based Matching
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Action Bar below How It Works */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Ready to submit electronic waste for responsible recycling?</h4>
              <p className="text-xs text-slate-500">Log a new e-waste manifest in under 2 minutes with instant rule evaluation.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAddWasteModal}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <span>Add E-Waste Manifest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
