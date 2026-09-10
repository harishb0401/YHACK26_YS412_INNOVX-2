import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Building, FileText, Check, X } from 'lucide-react';
import { mockRecyclers } from '../../data/mockData';

export default function Verification({ recyclers = mockRecyclers }) {
  const [pendingRecyclers, setPendingRecyclers] = useState(
    (recyclers || mockRecyclers).filter(r => r.verificationStatus === 'PENDING_VERIFICATION' || r.verificationStatus === 'SUSPENDED')
  );

  const [flaggedOffers, setFlaggedOffers] = useState([
    {
      id: 'FLAG-901',
      lotId: 'EW-2026-001247',
      recyclerName: 'Apex E-Waste Solutions',
      material: 'Display Panels & Monitors',
      offeredPricePerKg: 110,
      benchmarkRate: 140,
      minFairPrice: 105,
      issue: 'Offer is near low threshold boundary (-21.4%). Requires approval.'
    }
  ]);

  const handleApproveRecycler = (id) => {
    setPendingRecyclers(pendingRecyclers.filter(r => r.id !== id));
    alert(`Facility ${id} approved & CPCB credentials verified!`);
  };

  const handleRejectRecycler = (id) => {
    setPendingRecyclers(pendingRecyclers.filter(r => r.id !== id));
    alert(`Facility ${id} rejected.`);
  };

  const handleResolveFlag = (id, action) => {
    setFlaggedOffers(flaggedOffers.filter(f => f.id !== id));
    alert(`Flagged offer ${id} ${action}!`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Verification & Compliance Queue</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          Review pending recycler CPCB licenses and investigate rule-engine flagged pricing offers.
        </p>
      </div>

      {/* Pending Facilities Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-[#3F7655]/10 pb-4">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#3F7655]" />
            <h2 className="text-lg font-black text-[#203128]">Pending Recycler Registrations</h2>
          </div>
          <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            {pendingRecyclers.length} Awaiting Review
          </span>
        </div>

        {pendingRecyclers.length > 0 ? (
          <div className="space-y-4">
            {pendingRecyclers.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#3F7655]/15 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <h3 className="text-base font-black text-[#203128]">{rec.companyName}</h3>
                  <p className="text-[#718078]">Location: {rec.location} • Contact: {rec.contactPerson} ({rec.phone})</p>
                  <p className="text-[#718078]">CPCB Reg: <span className="font-mono font-bold text-[#203128]">{rec.cpcbRegistrationNo}</span></p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRejectRecycler(rec.id)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveRecycler(rec.id)}
                    className="px-5 py-2 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve CPCB Facility</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#718078] text-center py-4">All facility applications have been cleared.</p>
        )}
      </div>

      {/* Flagged Pricing Offers Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-[#3F7655]/10 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-black text-[#203128]">Rule Engine Flagged Price Offers</h2>
          </div>
          <span className="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            {flaggedOffers.length} Flagged Cases
          </span>
        </div>

        {flaggedOffers.length > 0 ? (
          <div className="space-y-4">
            {flaggedOffers.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-900">{item.id}</span>
                    <strong className="text-sm font-black text-[#203128]">{item.recyclerName}</strong>
                  </div>
                  <p className="text-[#718078]">Lot: {item.lotId} ({item.material})</p>
                  <p className="text-amber-800 font-semibold">{item.issue}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveFlag(item.id, 'dismissed')}
                    className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel Bid
                  </button>
                  <button
                    onClick={() => handleResolveFlag(item.id, 'cleared')}
                    className="px-5 py-2 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                  >
                    Override & Allow Bid
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#718078] text-center py-4">No active price anomaly flags.</p>
        )}
      </div>
    </div>
  );
}
