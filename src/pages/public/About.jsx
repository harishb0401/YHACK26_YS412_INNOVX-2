import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Scale, QrCode, Building2, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 text-[#203128]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold uppercase tracking-wider border border-[#3F7655]/20">
            <Leaf className="w-3.5 h-3.5 text-[#3F7655]" /> ABOUT ECO-LINK
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#203128] tracking-tight">
            Digital E-Waste Infrastructure for Tamil Nadu
          </h1>
          <p className="text-base sm:text-lg text-[#718078] font-medium leading-relaxed">
            Eco-Link bridges informal collectors and CPCB-authorized recyclers through transparent pricing benchmark models, structured classification, matching engines, and end-to-end traceability.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-8 rounded-[28px] border border-[#3F7655]/20 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center font-black">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#203128]">Transparent Pricing</h3>
            <p className="text-xs text-[#718078] leading-relaxed">
              Eliminating exploitation in the informal scrap trade by establishing transparent benchmark pricing models based on real secondary metal market rates and acceptable tolerance ranges.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[28px] border border-[#3F7655]/20 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center font-black">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#203128]">CPCB Compliance & Verification</h3>
            <p className="text-xs text-[#718078] leading-relaxed">
              Every recycler on Eco-Link undergo strict verification of their CPCB license, processing capacity, and environmental safety protocols to ensure compliance with EPR directives.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[28px] border border-[#3F7655]/20 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center font-black">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#203128]">Traceability & Digital QR</h3>
            <p className="text-xs text-[#718078] leading-relaxed">
              Digital Material Lots are tracked from initial registration through recycler matching, logistics dispatch, physical weighbridge QR scan, to final certified material recovery.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[28px] border border-[#3F7655]/20 shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center font-black">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#203128]">Circular Economy Impact</h3>
            <p className="text-xs text-[#718078] leading-relaxed">
              Diverting toxic e-waste materials (lead, mercury, cadmium) from landfills while recovering critical secondary raw materials like gold, copper, aluminum, and rare earth metals.
            </p>
          </div>

        </div>

        {/* Platform Architecture Overview */}
        <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-lg space-y-6">
          <h2 className="text-2xl font-black text-[#203128]">Core Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-bold text-[#203128]">
            <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3F7655] shrink-0" />
              <span>Multi-Role Access (Collector, Recycler, Admin)</span>
            </div>
            <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3F7655] shrink-0" />
              <span>Rule-Based Price Warning Engine</span>
            </div>
            <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3F7655] shrink-0" />
              <span>OTP Phone Number Verification</span>
            </div>
            <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3F7655] shrink-0" />
              <span>Geographic Recycler Matching Engine</span>
            </div>
            <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3F7655] shrink-0" />
              <span>Environmental & Material Reports</span>
            </div>
            <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#3F7655] shrink-0" />
              <span>Bilingual Support (English & தமிழ்)</span>
            </div>
          </div>
        </div>

        {/* Action CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-full bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-sm shadow-md transition inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Register on Eco-Link</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
