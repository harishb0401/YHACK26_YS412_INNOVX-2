import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Building, ShieldCheck, CheckCircle2, AlertTriangle, Scale, DollarSign, Calendar, MapPin, Check, X } from 'lucide-react';

export default function RecyclerMatchDetails() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);

  // Mock match details
  const match = {
    id: matchId || 'OFFER-2026-901',
    lotId: 'EW-2026-001245',
    category: 'Computer Equipment',
    material: 'Motherboards & PCB Assemblies',
    weightKg: 120,
    recyclerName: 'GreenCycle Material Recovery Ltd',
    recyclerLocation: 'Ambattur Industrial Estate, Chennai',
    cpcbRegistrationNo: 'TN-EPR-2026-8821',
    offeredPricePerKg: 380,
    benchmarkRate: 350,
    totalOfferedValue: 45600,
    ruleEvaluation: 'FAIR',
    logisticsType: 'Recycler Managed Pickup (Free)',
    paymentTerms: '100% Escrow Advance via Eco-Link UPI',
    estimatedPickupDate: 'Tomorrow, between 10:00 AM – 2:00 PM'
  };

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      navigate('/collector/transactions');
    }, 1500);
  };

  const handleReject = () => {
    setRejected(true);
    setTimeout(() => {
      navigate('/collector/recycler-matches');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/collector/recycler-matches')}
          className="px-4 py-2 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 rounded-xl hover:bg-[#DDEBD8]/50 transition flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#3F7655]" />
          <span>Back to Matches</span>
        </button>

        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Verified CPCB Facility
        </span>
      </div>

      {/* Main Offer Details */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-lg space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#3F7655]/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3 py-1 rounded-full">
              Recycler Bid Details
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#203128] mt-2">{match.recyclerName}</h1>
            <p className="text-xs text-[#718078] flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
              <span>{match.recyclerLocation} • Reg No: {match.cpcbRegistrationNo}</span>
            </p>
          </div>

          <div className="p-4 bg-[#DDEBD8] rounded-2xl border border-[#3F7655]/30 text-right">
            <span className="text-[10px] font-extrabold text-[#244936] uppercase block">Total Offer Payout</span>
            <span className="text-2xl font-black text-[#244936]">₹{match.totalOfferedValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Comparison Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-bold text-[#718078] uppercase">Target Lot</span>
            <span className="text-base font-black text-[#203128] block">{match.lotId}</span>
            <span className="text-[#718078]">{match.material} ({match.weightKg} kg)</span>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-bold text-[#718078] uppercase">Offered Rate vs Benchmark</span>
            <span className="text-base font-black text-[#3F7655] block">₹{match.offeredPricePerKg} / kg</span>
            <span className="text-[#718078]">Benchmark: ₹{match.benchmarkRate} / kg (+8.5%)</span>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-bold text-[#718078] uppercase">Logistics & Handling</span>
            <span className="text-xs font-black text-[#203128] block">{match.logisticsType}</span>
            <span className="text-[#718078]">Pickup: {match.estimatedPickupDate}</span>
          </div>
        </div>

        {/* Escrow Guarantee Box */}
        <div className="p-6 bg-[#FAF8F2] rounded-[24px] border border-[#3F7655]/20 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#3F7655] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Eco-Link Escrow Protection</span>
          </h3>
          <p className="text-xs text-[#718078] leading-relaxed">
            Upon accepting this match, the recycler's funds of <strong>₹{match.totalOfferedValue.toLocaleString()}</strong> are immediately locked into the secure Eco-Link Escrow Vault. Funds will be released to your UPI account instantly after physical weighbridge verification.
          </p>
        </div>

        {/* Acceptance States */}
        {accepted && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Offer Accepted! Escrow locked. Redirecting to transactions...</span>
          </div>
        )}

        {rejected && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Offer Declined. Returning to recycler matches...</span>
          </div>
        )}

        {/* Buttons */}
        {!accepted && !rejected && (
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#3F7655]/10">
            <button
              onClick={handleReject}
              className="w-full sm:w-auto px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-2xl transition border border-rose-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Decline Bid</span>
            </button>

            <button
              onClick={handleAccept}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Accept Offer & Lock Escrow (₹{match.totalOfferedValue.toLocaleString()})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
