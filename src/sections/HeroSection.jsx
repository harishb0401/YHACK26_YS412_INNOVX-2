import React from 'react';
import { ArrowRight, Search, ShieldCheck, Truck, Factory, RefreshCw, Sparkles, CheckCircle2, Building2 } from 'lucide-react';

export default function HeroSection({ setActiveView, onOpenAddWasteModal, onQuickTrack }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 py-16 lg:py-24">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold tracking-wide border border-emerald-200/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Rule-Based E-Waste Network</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Turning E-Waste Into a <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">Circular Future</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              ECO-Link connects verified collectors and recyclers through a transparent digital platform that helps electronic waste reach responsible recycling facilities.
            </p>

            {/* CTA Buttons & Fast Track Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenAddWasteModal}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('tracking')}
                className="w-full sm:w-auto px-7 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-5 h-5 text-emerald-600" />
                <span>Track E-Waste</span>
              </button>
            </div>

            {/* Quick Tracking ID Try Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-600">Sample Tracking Code:</span>
              <button
                onClick={() => onQuickTrack("EW-2026-001245")}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 font-mono font-bold transition flex items-center gap-1"
              >
                <span>EW-2026-001245</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Micro badges below hero */}
            <div className="pt-4 border-t border-slate-200/70 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center">
              <div>
                <p className="text-xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Digital Audit Trail</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">5-Point</p>
                <p className="text-xs text-slate-500 font-medium">Rule Match Logic</p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">Zero</p>
                <p className="text-xs text-slate-500 font-medium">Landfill Diverted</p>
              </div>
            </div>

          </div>

          {/* Right Sustainability Flow Graphic & Floating Stats */}
          <div className="lg:col-span-5 relative">
            
            {/* Central Graphic Container */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  E-Waste Journey Workflow
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Tracking
                </span>
              </div>

              {/* Connected Flow Diagram */}
              <div className="py-6 space-y-4">
                
                {/* Step 1: Collector */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">Collector</h4>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">1. Logged</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">Verifies e-waste type, quantity & weight</p>
                  </div>
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center text-emerald-500 py-0.5">
                  <div className="w-0.5 h-4 bg-emerald-300 relative">
                    <div className="absolute -bottom-1 -left-[3px] w-2 h-2 border-r-2 border-b-2 border-emerald-500 rotate-45" />
                  </div>
                </div>

                {/* Step 2: Transportation */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">Transportation</h4>
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">2. Matched & In Transit</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">Rule-based dispatch & GPS Tracking ID</p>
                  </div>
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center text-emerald-500 py-0.5">
                  <div className="w-0.5 h-4 bg-emerald-300 relative">
                    <div className="absolute -bottom-1 -left-[3px] w-2 h-2 border-r-2 border-b-2 border-emerald-500 rotate-45" />
                  </div>
                </div>

                {/* Step 3: Recycler */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                    <Factory className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">Recycler</h4>
                      <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-100/60 px-2 py-0.5 rounded">3. Intake & Processing</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">Dismantling, sorting & extraction</p>
                  </div>
                </div>

                {/* Connector Arrow */}
                <div className="flex justify-center text-emerald-500 py-0.5">
                  <div className="w-0.5 h-4 bg-emerald-300 relative">
                    <div className="absolute -bottom-1 -left-[3px] w-2 h-2 border-r-2 border-b-2 border-emerald-500 rotate-45" />
                  </div>
                </div>

                {/* Step 4: Recycled Materials */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/30">
                    <RefreshCw className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-emerald-950">Recycled Materials</h4>
                      <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full">4. Verified Certificate</span>
                    </div>
                    <p className="text-xs text-emerald-700 font-medium truncate">Gold, Copper, Aluminum recovered</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Floating Statistic Pill 1: Top Left */}
            <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">1,240 kg</p>
                <p className="text-[11px] text-slate-500 font-medium">E-Waste Recycled</p>
              </div>
            </div>

            {/* Floating Statistic Pill 2: Bottom Right */}
            <div className="absolute -bottom-5 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-delayed">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">32 Verified</p>
                <p className="text-[11px] text-slate-500 font-medium">Recyclers Online</p>
              </div>
            </div>

            {/* Floating Statistic Pill 3: Top Right */}
            <div className="absolute top-1/2 -right-6 hidden xl:flex bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="pr-2">
                <p className="text-xs font-bold text-slate-900">96%</p>
                <p className="text-[10px] text-slate-500 font-medium">Success Rate</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
