import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Package, DollarSign, Scale, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import StatCard from '../../components/Cards/StatCard';
import { mockCollectors, mockRecyclers, mockWasteLots, mockTransactions } from '../../data/mockData';
import adminService from '../../services/adminService';

export default function AdminDashboard({
  collectors = mockCollectors,
  recyclers = mockRecyclers,
  materialLots = mockWasteLots,
  transactions = mockTransactions
}) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getDashboardStats();
      if (data) setStats(data);
    } catch (err) {
      console.warn('Could not load live admin statistics:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalCollectors = stats?.totalCollectors ?? (collectors || []).length;
  const totalRecyclers = stats?.totalRecyclers ?? (recyclers || []).length;
  const verifiedRecyclers = stats?.verifiedRecyclers ?? (recyclers || []).filter(r => r.cpcbStatus === 'VERIFIED' || r.verificationStatus === 'VERIFIED').length;
  const pendingVerifications = stats?.pendingVerifications ?? (recyclers || []).filter(r => r.cpcbStatus === 'PENDING' || r.verificationStatus === 'PENDING').length;
  const totalWasteKg = stats?.totalWasteKg ?? stats?.totalWasteWeightKg ?? (materialLots || []).reduce((sum, l) => sum + (parseFloat(l.quantity || l.totalWeightKg) || 0), 0);
  const totalTxValue = stats?.totalTxValue ?? stats?.transactionVolume ?? (transactions || []).reduce((sum, t) => sum + (parseFloat(t.amount || t.totalValue) || 0), 0);
  const abnormalOffers = stats?.abnormalOffers ?? 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#14291E] text-white p-6 sm:p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#F2C94C] bg-white/10 px-3 py-0.5 rounded-full">
              State Regulatory Console
            </span>
            <span className="text-xs font-black text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
              CPCB / TNPCB Master Authority
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Tamil Nadu E-Waste Command Center
          </h1>
          <p className="text-xs sm:text-sm text-[#DDEBD8] mt-1">
            System-wide oversight for informal collectors, authorized recyclers, price integrity, and CPCB EPR compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/verification')}
            className="px-6 py-3.5 bg-[#F2C94C] hover:bg-[#e0b83b] text-[#14291E] rounded-2xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review Verifications ({pendingVerifications})</span>
          </button>
        </div>
      </div>

      {/* Live Platform KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Collectors"
          value={totalCollectors}
          icon={Users}
          color="emerald"
          subtitle="Informal & MSME Aggregators"
        />
        <StatCard
          title="Authorized Recyclers"
          value={totalRecyclers}
          icon={ShieldCheck}
          color="blue"
          subtitle={`${verifiedRecyclers} CPCB Certified`}
        />
        <StatCard
          title="Total Waste Volume"
          value={`${totalWasteKg.toLocaleString()} kg`}
          icon={Scale}
          color="amber"
          subtitle="Declared manifests"
        />
        <StatCard
          title="Simulated Escrow Volume"
          value={`₹${totalTxValue.toLocaleString()}`}
          icon={DollarSign}
          color="purple"
          subtitle={`${abnormalOffers} flagged pricing audits`}
        />
      </div>

      {/* Management Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-bold mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">Collectors</h3>
            <p className="text-xs text-[#718078] mt-1">
              Audit registered collector profiles, verify OTP status, and monitor volume throughput.
            </p>
          </div>
          <Link
            to="/admin/collectors"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>Manage Collectors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">Recyclers</h3>
            <p className="text-xs text-[#718078] mt-1">
              Verify CPCB licenses, manage processing quotas, and inspect facility capacities.
            </p>
          </div>
          <Link
            to="/admin/recyclers"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>Manage Recyclers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">Waste Lots</h3>
            <p className="text-xs text-[#718078] mt-1">
              Inspect active material declarations, tolerance compliance, and QR traceability.
            </p>
          </div>
          <Link
            to="/admin/waste-lots"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>Audit Waste Lots</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">Verification Queue</h3>
            <p className="text-xs text-[#718078] mt-1">
              Review and approve pending recycler credentials and flagged price discrepancy cases.
            </p>
          </div>
          <Link
            to="/admin/verification"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>Open Queue ({pendingVerifications})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
