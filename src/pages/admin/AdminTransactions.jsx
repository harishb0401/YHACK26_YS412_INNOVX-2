import React, { useState } from 'react';
import { Search, DollarSign, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { mockTransactions } from '../../data/mockData';

export default function AdminTransactions({ transactions = mockTransactions }) {
  const [searchQuery, setSearchQuery] = useState('');

  const txList = transactions || mockTransactions;

  const filtered = txList.filter(tx =>
    (tx.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tx.lotId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tx.collectorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tx.recyclerName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSettled = txList.reduce((sum, tx) => sum + (tx.totalValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Platform Transactions Ledger</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            State-wide escrow settlements, direct UPI disbursements, and GST compliance logs.
          </p>
        </div>

        <div className="p-4 bg-[#DDEBD8] rounded-2xl border border-[#3F7655]/20 flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-[#244936]" />
          <div>
            <span className="text-[10px] font-extrabold text-[#244936] uppercase block">Cumulative Platform Payouts</span>
            <span className="text-xl font-black text-[#244936]">₹{totalSettled.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice ID, lot ID, party..."
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-[#3F7655]/20 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF8F2] text-[#718078] uppercase text-[10px] font-black border-b border-[#3F7655]/10">
              <tr>
                <th className="p-4 pl-6">Invoice #</th>
                <th className="p-4">Lot Reference</th>
                <th className="p-4">Collector (Beneficiary)</th>
                <th className="p-4">Recycler (Payer)</th>
                <th className="p-4">Weight & Rate</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4 pr-6 text-right">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3F7655]/10 text-[#203128] font-semibold">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F8F5EA]/50 transition">
                  <td className="p-4 pl-6">
                    <strong className="font-mono text-xs text-[#244936] block">{tx.id}</strong>
                    <span className="text-[10px] text-[#718078]">{tx.date || tx.paymentDate || '2026-03-01'}</span>
                  </td>
                  <td className="p-4 font-mono text-[11px]">{tx.lotId}</td>
                  <td className="p-4 font-bold">{tx.collectorName}</td>
                  <td className="p-4">{tx.recyclerName}</td>
                  <td className="p-4">{tx.weightKg || 120} kg @ ₹{tx.ratePerKg || 380}/kg</td>
                  <td className="p-4 font-black text-[#3F7655] text-sm">₹{(tx.totalValue || 45600).toLocaleString()}</td>
                  <td className="p-4 pr-6 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {tx.status || 'SETTLED'}
                    </span>
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
