import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Package, DollarSign, Scale, ShieldCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import StatCard from '../../components/Cards/StatCard';
import WasteLotCard from '../../components/Cards/WasteLotCard';
import { mockWasteLots, mockTransactions, mockCollector } from '../../data/mockData';
import { useTranslation } from '../../i18n';

export default function CollectorDashboard({ materialLots = mockWasteLots, transactions = mockTransactions, collectorProfile = mockCollector }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const myLots = materialLots || mockWasteLots;
  const activeLots = myLots.filter(l => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(l.status));
  const totalWeight = myLots.reduce((acc, l) => acc + (parseFloat(l.quantity || l.totalWeightKg) || 0), 0);
  const totalEarnings = (transactions || []).reduce((acc, tx) => acc + (tx.totalValue || 0), 0) + 
                        myLots.filter(l => l.status === 'COMPLETED').reduce((s, l) => s + (l.agreedTotalValue || l.estimatedLotValue || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#244936] text-white p-6 sm:p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#F2C94C] bg-white/10 px-3 py-0.5 rounded-full">
              Collector Portal
            </span>
            {collectorProfile?.phone_verified && (
              <span className="text-xs font-black text-[#244936] bg-[#F2C94C] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Welcome back, {collectorProfile?.name || "Ramesh Kumar"}!
          </h1>
          <p className="text-xs sm:text-sm text-[#DDEBD8] mt-1">
            Manage your digital e-waste lots, review transparent recycler bids, and monitor payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/collector/register-waste')}
            className="px-6 py-3.5 bg-[#F2C94C] hover:bg-[#e0b83b] text-[#244936] rounded-2xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register E-Waste Lot</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Declared Lots"
          value={activeLots.length}
          subtitle="Waiting for Recycler Match"
          icon={Package}
          color="emerald"
        />
        <StatCard
          title="Total Weight Collected"
          value={`${totalWeight.toLocaleString()} kg`}
          subtitle="Cumulative verified volume"
          icon={Scale}
          color="emerald"
        />
        <StatCard
          title="Settled Payouts"
          value={`₹${totalEarnings.toLocaleString()}`}
          subtitle="Direct UPI & Escrow payouts"
          icon={DollarSign}
          color="amber"
        />
        <StatCard
          title="Compliance Score"
          value="98.4%"
          subtitle="CPCB EPR Traceability"
          icon={ShieldCheck}
          color="blue"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-bold mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">Register E-Waste</h3>
            <p className="text-xs text-[#718078] mt-1">
              Create a new authenticated digital waste lot with automated pricing bounds.
            </p>
          </div>
          <Link
            to="/collector/register-waste"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>Register Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">Recycler Matches</h3>
            <p className="text-xs text-[#718078] mt-1">
              Review incoming bids from verified recyclers with fair-rate rule tags.
            </p>
          </div>
          <Link
            to="/collector/recycler-matches"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>View Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">Transactions</h3>
            <p className="text-xs text-[#718078] mt-1">
              Review invoices, escrow releases, and download digital weight receipts.
            </p>
          </div>
          <Link
            to="/collector/transactions"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>View Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Declared Lots Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#203128]">Recent Declared Lots</h2>
            <p className="text-xs text-[#718078]">Latest material lots in verification & matching pipeline.</p>
          </div>
          <Link
            to="/collector/waste-lots"
            className="text-xs font-black text-[#3F7655] hover:underline flex items-center gap-1"
          >
            <span>View All ({myLots.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myLots.slice(0, 3).map((lot) => (
            <WasteLotCard
              key={lot.id}
              lot={lot}
              onViewDetails={() => navigate(`/collector/waste-lots/${lot.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
