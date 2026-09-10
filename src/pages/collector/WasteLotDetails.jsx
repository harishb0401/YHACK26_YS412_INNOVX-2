import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, QrCode, MapPin, Scale, Clock, ShieldCheck, CheckCircle2, AlertCircle, FileText, Send, DollarSign } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { calculateFairPriceRange } from '../../utils/rulesEngine';
import { mockWasteLots } from '../../data/mockData';

export default function WasteLotDetails({ materialLots = mockWasteLots }) {
  const { lotId } = useParams();
  const navigate = useNavigate();

  const allLots = materialLots || mockWasteLots;
  const lot = allLots.find(l => l.id === lotId) || allLots[0];

  if (!lot) {
    return (
      <div className="bg-white p-12 rounded-[32px] border border-[#3F7655]/20 text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-black text-[#203128]">Waste Lot Not Found</h2>
        <p className="text-xs text-[#718078]">The requested e-waste lot identifier could not be located.</p>
        <Link to="/collector/waste-lots" className="text-xs font-bold text-[#3F7655] underline">
          Return to All Lots
        </Link>
      </div>
    );
  }

  const benchmark = lot.benchmarkPrice || 350;
  const tolerance = lot.tolerancePercent !== undefined ? lot.tolerancePercent : 25;
  const fairPricing = calculateFairPriceRange(benchmark, tolerance);

  // 12-Step Lifecycle definitions
  const lifecycleSteps = [
    { step: 1, title: 'Collector Registration', completed: true },
    { step: 2, title: 'Phone OTP Verified', completed: true },
    { step: 3, title: 'E-Waste Lot Declaration', completed: true },
    { step: 4, title: 'Benchmark Rule Verification', completed: true },
    { step: 5, title: 'Recycler Discovery & Bid Matching', completed: ['MATCHED', 'ACCEPTED', 'DISPATCHED', 'COMPLETED'].includes(lot.status) },
    { step: 6, title: 'Price Offer Review & Acceptance', completed: ['ACCEPTED', 'DISPATCHED', 'COMPLETED'].includes(lot.status) },
    { step: 7, title: 'CPCB Compliance Lock', completed: ['ACCEPTED', 'DISPATCHED', 'COMPLETED'].includes(lot.status) },
    { step: 8, title: 'Escrow Payment Authorization', completed: ['ACCEPTED', 'DISPATCHED', 'COMPLETED'].includes(lot.status) },
    { step: 9, title: 'Logistics Handover & Dispatch', completed: ['DISPATCHED', 'COMPLETED'].includes(lot.status) },
    { step: 10, title: 'Facility Weighbridge QR Scan', completed: ['DISPATCHED', 'COMPLETED'].includes(lot.status) },
    { step: 11, title: 'Escrow Settlement to Collector', completed: lot.status === 'COMPLETED' },
    { step: 12, title: 'CPCB EPR Certificate Issuance', completed: lot.status === 'COMPLETED' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/collector/waste-lots')}
          className="px-4 py-2 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 rounded-xl hover:bg-[#DDEBD8]/50 transition flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#3F7655]" />
          <span>Back to All Lots</span>
        </button>

        <StatusBadge status={lot.status} />
      </div>

      {/* Main Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3F7655]/10 pb-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3 py-1 rounded-full">
              {lot.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#203128] mt-2">{lot.id}</h1>
            <p className="text-xs text-[#718078]">{lot.material} • Registered: {lot.createdDate || 'Today'}</p>
          </div>

          {/* QR Box */}
          <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#3F7655]/15 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl border border-[#3F7655]/20 flex items-center justify-center text-[#244936] shadow-sm">
              <QrCode className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase text-[#718078] block">Digital QR Hash</span>
              <span className="text-xs font-black text-[#203128] font-mono">{lot.qrPayload || `EPR-QR-${lot.id}`}</span>
            </div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#3F7655]" /> Total Weight
            </span>
            <span className="text-base font-black text-[#203128]">{lot.quantity || lot.totalWeightKg} {lot.unit || 'kg'}</span>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#3F7655]" /> Benchmark Rate
            </span>
            <span className="text-base font-black text-[#203128]">₹{benchmark} / {lot.unit || 'kg'}</span>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#3F7655]" /> Estimated Value
            </span>
            <span className="text-base font-black text-[#244936]">₹{(lot.estimatedLotValue || Math.round((lot.quantity || lot.totalWeightKg || 0) * benchmark)).toLocaleString()}</span>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#3F7655]" /> Hub Location
            </span>
            <span className="text-xs font-bold text-[#203128] truncate block">{lot.location || 'Chennai Hub'}</span>
          </div>
        </div>

        {/* Pricing Bound Analysis */}
        <div className="p-6 bg-[#FAF8F2] rounded-[24px] border border-[#3F7655]/20 space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#3F7655] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>TN Fair Scrap Rate Range (CPCB Model)</span>
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span>Official Price Band: <strong>₹{fairPricing.minPrice} – ₹{fairPricing.maxPrice} / kg</strong> (Tolerance: ±{tolerance}%)</span>
            <span className="text-emerald-800 font-bold bg-emerald-100 px-3 py-0.5 rounded-full self-start sm:self-auto">
              ✓ Compliant Listing
            </span>
          </div>
        </div>

        {/* 12-Step Lifecycle Progress Tracker */}
        <div className="space-y-4 pt-4 border-t border-[#3F7655]/10">
          <h3 className="text-sm font-black text-[#203128] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3F7655]" />
            <span>End-to-End Lifecycle Traceability (12 Steps)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {lifecycleSteps.map((s) => (
              <div
                key={s.step}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs transition ${
                  s.completed
                    ? 'bg-[#DDEBD8]/50 border-[#3F7655]/30 text-[#244936]'
                    : 'bg-[#F8F5EA] border-[#3F7655]/10 text-[#718078] opacity-60'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${
                  s.completed ? 'bg-[#3F7655] text-white' : 'bg-slate-300 text-slate-600'
                }`}>
                  {s.completed ? '✓' : s.step}
                </div>
                <span className="font-bold">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
