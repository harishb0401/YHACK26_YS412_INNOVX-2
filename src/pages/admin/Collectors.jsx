import React, { useState } from 'react';
import { Search, Users, Phone, MapPin, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { mockCollectors } from '../../data/mockData';

export default function Collectors({ collectors = mockCollectors }) {
  const [collectorList, setCollectorList] = useState(collectors || mockCollectors);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = collectorList.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleVerification = (id) => {
    setCollectorList(collectorList.map(c => 
      c.id === id ? { ...c, phone_verified: !c.phone_verified } : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Collectors Directory</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          Review and audit all informal and enterprise scrap collectors registered on Eco-Link Tamil Nadu.
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
            placeholder="Search collector name, phone, or area..."
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Collectors Table */}
      <div className="bg-white rounded-[32px] border border-[#3F7655]/20 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F2] text-[#718078] uppercase text-[10px] font-black border-b border-[#3F7655]/10">
              <tr>
                <th className="p-4 pl-6">Collector ID & Name</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Hub Location</th>
                <th className="p-4">Volume Declared</th>
                <th className="p-4">Phone OTP Status</th>
                <th className="p-4 pr-6 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3F7655]/10 text-[#203128] font-semibold">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#F8F5EA]/50 transition">
                  <td className="p-4 pl-6">
                    <span className="font-mono text-[10px] text-[#718078] block">{c.id}</span>
                    <strong className="font-extrabold text-sm">{c.name}</strong>
                    <span className="text-[11px] text-[#718078] block">{c.company}</span>
                  </td>
                  <td className="p-4">{c.phone}</td>
                  <td className="p-4">{c.location}</td>
                  <td className="p-4">{c.totalVolumeKg || 450} kg</td>
                  <td className="p-4">
                    {c.phone_verified ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        OTP Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => toggleVerification(c.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                        c.phone_verified
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {c.phone_verified ? 'Revoke OTP' : 'Force Verify OTP'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
