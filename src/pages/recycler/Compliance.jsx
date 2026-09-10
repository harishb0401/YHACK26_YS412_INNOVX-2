import React from 'react';
import { ShieldCheck, FileText, Download, Award, CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';
import { mockRecycler } from '../../data/mockData';

export default function Compliance({ recyclerProfile = mockRecycler }) {
  const complianceData = {
    cpcbRegistrationNo: recyclerProfile?.cpcbRegistrationNo || 'TN-EPR-2026-8821',
    validTill: '31 Dec 2027',
    status: 'ACTIVE_AUTHORIZED',
    annualTargetKg: 50000,
    achievedKg: 44100,
    recoveryRatioPercent: 94.6,
    toxicDiversionKg: 3820
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">CPCB & EPR Compliance Hub</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          Central Pollution Control Board authorized audit logs, Form-2 manifest reports, and material recovery certificates.
        </p>
      </div>

      {/* Compliance Overview Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3F7655]/10 pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#3F7655] bg-[#DDEBD8] px-3 py-1 rounded-full">
              CPCB EPR Status: Verified Active
            </span>
            <h2 className="text-2xl font-black text-[#203128] mt-2">Registration #{complianceData.cpcbRegistrationNo}</h2>
            <p className="text-xs text-[#718078]">Valid Until: {complianceData.validTill} • Annual EPR Quota: 50,000 kg</p>
          </div>

          <button
            onClick={() => alert("Downloading Official CPCB Certificate PDF...")}
            className="px-5 py-3 bg-[#3F7655] hover:bg-[#244936] text-white rounded-2xl font-black text-xs shadow transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Download CPCB Certificate</span>
          </button>
        </div>

        {/* 4 Compliance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase block">EPR Quota Target</span>
            <span className="text-base font-black text-[#203128]">50,000 kg</span>
          </div>
          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase block">Material Recycled</span>
            <span className="text-base font-black text-[#3F7655]">{complianceData.achievedKg.toLocaleString()} kg (88.2%)</span>
          </div>
          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase block">Recovery Efficiency</span>
            <span className="text-base font-black text-[#244936]">{complianceData.recoveryRatioPercent}%</span>
          </div>
          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase block">Hazardous Diversion</span>
            <span className="text-base font-black text-emerald-700">{complianceData.toxicDiversionKg.toLocaleString()} kg</span>
          </div>
        </div>

        {/* Form-2 Manifest Generator */}
        <div className="p-6 bg-[#FAF8F2] rounded-[24px] border border-[#3F7655]/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3F7655]" />
              <h3 className="text-sm font-black text-[#203128]">Form-2 E-Waste Manifest Auto-Reporting</h3>
            </div>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Automated
            </span>
          </div>
          <p className="text-xs text-[#718078] leading-relaxed">
            All weighbridge scan transactions on Eco-Link are digitally compiled into statutory Form-2 E-Waste Transportation and Processing manifests required for submission to the Tamil Nadu Pollution Control Board (TNPCB).
          </p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => alert("Form-2 Manifest quarterly compilation generated!")}
              className="px-4 py-2 bg-white border border-[#3F7655]/20 text-[#244936] rounded-xl font-bold text-xs hover:bg-[#DDEBD8] transition cursor-pointer"
            >
              Export Q1-2026 Form-2 Manifest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
