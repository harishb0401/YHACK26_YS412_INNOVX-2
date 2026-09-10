import React, { useState } from 'react';
import { Search, Package, Filter, ShieldCheck, QrCode } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { mockWasteLots } from '../../data/mockData';

export default function AdminWasteLots({ materialLots = mockWasteLots }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const lots = materialLots || mockWasteLots;

  const filtered = lots.filter(lot => {
    const matchesSearch = (lot.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lot.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lot.material || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lot.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Regulated Waste Lots</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          Live state-wide registry of all declared material lots, benchmark values, and QR traceability statuses.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lot ID, material, location..."
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['ALL', 'REGISTERED', 'MATCHED', 'DISPATCHED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#3F7655] text-white shadow-sm'
                  : 'bg-[#F8F5EA] text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]'
              }`}
            >
              {st === 'ALL' ? 'All Lots' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-[#3F7655]/20 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F2] text-[#718078] uppercase text-[10px] font-black border-b border-[#3F7655]/10">
              <tr>
                <th className="p-4 pl-6">Lot Identifier</th>
                <th className="p-4">Category & Material</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Benchmark Rate</th>
                <th className="p-4">Location Hub</th>
                <th className="p-4">Lifecycle Status</th>
                <th className="p-4 pr-6 text-right">QR Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3F7655]/10 text-[#203128] font-semibold">
              {filtered.map((lot) => (
                <tr key={lot.id} className="hover:bg-[#F8F5EA]/50 transition">
                  <td className="p-4 pl-6">
                    <strong className="font-mono text-xs text-[#244936] block">{lot.id}</strong>
                    <span className="text-[10px] text-[#718078]">{lot.createdDate || 'Recent'}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold block">{lot.category}</span>
                    <span className="text-[11px] text-[#718078]">{lot.material}</span>
                  </td>
                  <td className="p-4 font-black">{lot.quantity || lot.totalWeightKg} {lot.unit || 'kg'}</td>
                  <td className="p-4">₹{lot.benchmarkPrice || 350} / kg</td>
                  <td className="p-4">{lot.location}</td>
                  <td className="p-4">
                    <StatusBadge status={lot.status} />
                  </td>
                  <td className="p-4 pr-6 text-right font-mono text-[10px] text-[#718078]">
                    {lot.qrPayload || `EPR-QR-${lot.id}`}
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
