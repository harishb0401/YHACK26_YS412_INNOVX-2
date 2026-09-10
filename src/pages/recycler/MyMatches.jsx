import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, Clock, Truck, QrCode, ArrowRight } from 'lucide-react';
import { mockWasteLots } from '../../data/mockData';

export default function MyMatches({ materialLots = mockWasteLots }) {
  const [searchQuery, setSearchQuery] = useState('');

  const matches = [
    {
      id: 'REC-MATCH-101',
      lotId: 'EW-2026-001245',
      collectorName: 'Ramesh Kumar (Apex Scrap)',
      collectorLocation: 'Guindy, Chennai',
      material: 'Motherboards & PCB Assemblies',
      weightKg: 120,
      agreedRate: 380,
      totalValue: 45600,
      status: 'DISPATCHED',
      escrowStatus: 'ESCROW_LOCKED',
      estimatedArrival: 'Today, 4:00 PM'
    },
    {
      id: 'REC-MATCH-102',
      lotId: 'EW-2026-001246',
      collectorName: 'Kavitha Enterprises',
      collectorLocation: 'Madurai',
      material: 'Telecom Cards & Optical Modules',
      weightKg: 45,
      agreedRate: 580,
      totalValue: 26100,
      status: 'ACCEPTED',
      escrowStatus: 'ESCROW_LOCKED',
      estimatedArrival: 'Tomorrow'
    },
    {
      id: 'REC-MATCH-103',
      lotId: 'EW-2026-001247',
      collectorName: 'Murugan Metals',
      collectorLocation: 'Coimbatore',
      material: 'Display Panels & Monitors',
      weightKg: 350,
      agreedRate: 140,
      totalValue: 49000,
      status: 'COMPLETED',
      escrowStatus: 'SETTLED',
      estimatedArrival: 'Delivered & Processed'
    }
  ];

  const filtered = matches.filter(m =>
    m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.lotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.collectorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">My Matches & Active Lots</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          Track accepted waste manifests, verify vehicle dispatches, and trigger weighbridge QR validation.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search match ID, lot ID, or collector..."
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((match) => (
          <div
            key={match.id}
            className="bg-white p-6 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-4"
          >
            <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                  {match.id}
                </span>
                <h3 className="text-base font-black text-[#203128] mt-1.5">{match.lotId}</h3>
              </div>

              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                match.status === 'COMPLETED' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {match.status}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <p><strong>Collector:</strong> {match.collectorName} ({match.collectorLocation})</p>
              <p><strong>Material:</strong> {match.material} • {match.weightKg} kg</p>
              <p><strong>Total Escrow Value:</strong> <span className="font-bold text-[#3F7655]">₹{match.totalValue.toLocaleString()}</span></p>
              <p><strong>Status:</strong> {match.estimatedArrival}</p>
            </div>

            <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between">
              <span className="text-[11px] text-[#718078] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3F7655]" />
                Escrow Protected
              </span>

              <button
                onClick={() => alert(`Weighbridge QR Scanner for ${match.lotId} activated.`)}
                className="px-4 py-2 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Weighbridge QR Scan</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
