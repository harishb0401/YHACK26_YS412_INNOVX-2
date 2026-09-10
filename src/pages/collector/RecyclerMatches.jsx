import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, Filter, ArrowRight, DollarSign, Building, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { mockWasteLots } from '../../data/mockData';

export default function RecyclerMatches() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Generate match offers list from mock lots
  const matches = [
    {
      id: 'OFFER-2026-901',
      lotId: 'EW-2026-001245',
      category: 'Computer Equipment',
      material: 'Motherboards & PCB Assemblies',
      weightKg: 120,
      recyclerName: 'GreenCycle Material Recovery',
      recyclerLocation: 'Ambattur Industrial Estate, Chennai',
      offeredPricePerKg: 380,
      benchmarkRate: 350,
      totalOfferedValue: 45600,
      ruleEvaluation: 'FAIR',
      cpcbVerified: true,
      offerDate: 'Today, 10:30 AM',
      status: 'PENDING'
    },
    {
      id: 'OFFER-2026-902',
      lotId: 'EW-2026-001245',
      category: 'Computer Equipment',
      material: 'Motherboards & PCB Assemblies',
      weightKg: 120,
      recyclerName: 'EcoShred TN Recovery Hub',
      recyclerLocation: 'Guindy, Chennai',
      offeredPricePerKg: 360,
      benchmarkRate: 350,
      totalOfferedValue: 43200,
      ruleEvaluation: 'FAIR',
      cpcbVerified: true,
      offerDate: 'Today, 11:15 AM',
      status: 'PENDING'
    },
    {
      id: 'OFFER-2026-903',
      lotId: 'EW-2026-001246',
      category: 'Telecom & Networking',
      material: 'Optical Transceivers & Router Cards',
      weightKg: 45,
      recyclerName: 'Tamil Nadu Clean Earth Recyclers',
      recyclerLocation: 'Coimbatore',
      offeredPricePerKg: 580,
      benchmarkRate: 520,
      totalOfferedValue: 26100,
      ruleEvaluation: 'FAIR',
      cpcbVerified: true,
      offerDate: 'Yesterday',
      status: 'PENDING'
    },
    {
      id: 'OFFER-2026-904',
      lotId: 'EW-2026-001247',
      category: 'Display Panels & Monitors',
      material: 'LCD Monitors & CRT Panels',
      weightKg: 350,
      recyclerName: 'Apex E-Waste Solutions',
      recyclerLocation: 'Madurai',
      offeredPricePerKg: 110,
      benchmarkRate: 140,
      totalOfferedValue: 38500,
      ruleEvaluation: 'BELOW_BAND',
      cpcbVerified: true,
      offerDate: 'Yesterday',
      status: 'FLAGGED'
    }
  ];

  const filteredMatches = matches.filter(m => 
    m.recyclerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.lotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Recycler Matches & Offers</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          Review transparent price bids submitted by CPCB authorized recyclers across Tamil Nadu.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by recycler, lot ID, or material..."
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map((match) => (
          <div
            key={match.id}
            className="bg-white p-6 rounded-[32px] border border-[#3F7655]/20 shadow-md hover:border-[#3F7655]/50 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Recycler and Status */}
              <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#3F7655]" />
                    <h3 className="text-base font-black text-[#203128]">{match.recyclerName}</h3>
                  </div>
                  <p className="text-xs text-[#718078] mt-0.5">{match.recyclerLocation}</p>
                </div>

                {match.ruleEvaluation === 'FAIR' ? (
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Fair Rate
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Below Band
                  </span>
                )}
              </div>

              {/* Target Lot Details */}
              <div className="p-3 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#718078] font-bold">Waste Lot:</span>
                  <span className="font-extrabold text-[#203128]">{match.lotId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#718078] font-bold">Material:</span>
                  <span className="font-semibold text-[#203128]">{match.material} ({match.weightKg} kg)</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#3F7655]/15">
                  <span className="text-[10px] font-extrabold text-[#718078] uppercase block">Bid Rate</span>
                  <span className="text-base font-black text-[#203128]">₹{match.offeredPricePerKg} / kg</span>
                </div>
                <div className="p-3 bg-[#DDEBD8] rounded-xl border border-[#3F7655]/30">
                  <span className="text-[10px] font-extrabold text-[#244936] uppercase block">Total Payout</span>
                  <span className="text-base font-black text-[#244936]">₹{match.totalOfferedValue.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between">
              <span className="text-[11px] text-[#718078] font-medium">{match.offerDate}</span>
              <button
                onClick={() => navigate(`/collector/recycler-matches/${match.id}`)}
                className="px-4 py-2 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Review & Accept</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
