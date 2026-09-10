import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, DollarSign, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import TransactionCard from '../../components/Cards/TransactionCard';
import { mockTransactions } from '../../data/mockData';

export default function Transactions({ transactions = mockTransactions }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const txList = transactions || mockTransactions;

  const filteredTx = txList.filter(tx => 
    (tx.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tx.lotId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tx.recyclerName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSettled = txList.reduce((sum, tx) => sum + (tx.totalValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Transactions & Invoices</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Direct UPI settlements, escrow payouts, and certified weighbridge tax invoices.
          </p>
        </div>

        <div className="p-4 bg-[#DDEBD8] rounded-2xl border border-[#3F7655]/20 flex items-center gap-3">
          <DollarSign className="w-6 h-6 text-[#244936]" />
          <div>
            <span className="text-[10px] font-extrabold text-[#244936] uppercase block">Total Payouts Received</span>
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
            placeholder="Search invoice ID, lot ID, recycler..."
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTx.map((tx) => (
          <TransactionCard
            key={tx.id}
            transaction={tx}
            onViewDetails={() => navigate(`/collector/transactions/${tx.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
