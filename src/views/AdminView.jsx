import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, TrendingUp, Users, Package, 
  FileText, Plus, Search, CheckCircle2, Eye, Activity, Database,
  DollarSign, ShieldAlert, Check, X, Sliders, ArrowUpRight, Scale,
  Clock, RefreshCw, Filter, Phone, PhoneCall
} from 'lucide-react';
import { useTranslation } from '../i18n';
import StatusBadge from '../components/StatusBadge';
import { calculateFairPriceRange } from '../utils/rulesEngine';

export default function AdminView({ 
  collectors = [], 
  recyclers = [],
  materialLots = [],
  offers = [],
  transactions = [],
  benchmarkPrices = [],
  auditLogs = [],
  onViewLotDetails,
  onUpdateRecyclerStatus,
  onToggleCollectorPhoneVerification,
  onUpdateBenchmarkPrice,
  onResolveFlaggedOffer
}) {
  const { t, tCategory, tStatus, tCondition } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview'); // overview, collectors, recyclers, lots, pricing, transactions, flagged, logs

  // Filter States
  const [lotStatusFilter, setLotStatusFilter] = useState('ALL');
  const [recyclerStatusFilter, setRecyclerStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing Benchmark Pricing State
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editBenchPrice, setEditBenchPrice] = useState(0);
  const [editTolerance, setEditTolerance] = useState(25);

  // Platform Metrics Calculation
  const totalCollectors = collectors.length;
  const verifiedCollectors = collectors.filter(c => c.phoneVerified || c.phone_verified).length;
  
  const totalRecyclers = recyclers.length;
  const verifiedRecyclers = recyclers.filter(r => r.verificationStatus === 'VERIFIED' || r.isPlatformVerified).length;
  
  const totalWasteKg = materialLots.reduce((sum, l) => sum + (l.quantity || l.totalWeightKg || 0), 0);
  const activeLotsCount = materialLots.filter(l => ['AVAILABLE', 'MATCHED', 'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'PICKUP_SCHEDULED'].includes(l.status)).length;
  
  const completedTxns = transactions.filter(t => t.paymentStatus === 'COMPLETED' || t.paymentStatus === 'PAID');
  const totalTransactionValue = completedTxns.reduce((sum, t) => sum + (t.totalValue || t.amount || 0), 0);
  
  const flaggedOffersList = offers.filter(o => o.status === 'FLAGGED' || o.fairPriceStatus === 'BELOW_FAIR_RANGE');

  return (
    <div className="min-h-screen bg-[#F8F5EA] pb-16 text-[#203128]">
      
      {/* Top Banner */}
      <div className="bg-[#14291E] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black text-2xl shadow-inner">
              ADM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{t("adminPortal")}</h1>
                <span className="text-xs font-bold text-white bg-emerald-600 px-3 py-0.5 rounded-full">
                  {t("systemMaster")}
                </span>
              </div>
              <p className="text-xs text-[#DDEBD8] mt-1">
                {t("adminSubtitle")}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar in Header */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 p-3 rounded-2xl">
            <div className="text-center px-2">
              <span className="text-[10px] text-[#DDEBD8] font-bold block">{t("activeLots")}</span>
              <span className="text-lg font-black text-[#F2C94C]">{activeLotsCount}</span>
            </div>
            <div className="text-center px-2 border-x border-white/10">
              <span className="text-[10px] text-[#DDEBD8] font-bold block">{t("flaggedOffers")}</span>
              <span className="text-lg font-black text-rose-400">{flaggedOffersList.length}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-[#DDEBD8] font-bold block">{t("verifiedRecyclers")}</span>
              <span className="text-lg font-black text-emerald-400">{verifiedRecyclers}/{totalRecyclers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#3F7655]/15">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'overview' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t("adminTabOverview")}</span>
          </button>

          <button
            onClick={() => setActiveTab('collectors')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'collectors' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t("adminTabCollectors")} ({collectors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recyclers')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'recyclers' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t("adminTabRecyclers")} ({recyclers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lots')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'lots' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t("adminTabLots")} ({materialLots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'pricing' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{t("adminTabPricing")}</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'transactions' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{t("adminTabTransactions")} ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'flagged' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>{t("adminTabFlagged")} ({flaggedOffersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'logs' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t("adminTabAuditLogs")}</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS & RECENT ACTIVITY */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            
            {/* 8 Core Admin Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-[24px] border border-[#3F7655]/20 shadow-sm">
                <span className="text-xs text-[#718078] font-bold block">{t("totalCollectors")}</span>
                <span className="text-2xl font-black text-[#244936]">{totalCollectors}</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  {verifiedCollectors} {t("phoneVerified")}
                </span>
              </div>

              <div className="bg-white p-5 rounded-[24px] border border-[#3F7655]/20 shadow-sm">
                <span className="text-xs text-[#718078] font-bold block">{t("totalRecyclers")}</span>
                <span className="text-2xl font-black text-[#203128]">{totalRecyclers}</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  {verifiedRecyclers} {t("verifiedRecyclers")}
                </span>
              </div>

              <div className="bg-white p-5 rounded-[24px] border border-[#3F7655]/20 shadow-sm">
                <span className="text-xs text-[#718078] font-bold block">{t("totalWasteRecycled")}</span>
                <span className="text-2xl font-black text-[#3F7655]">{totalWasteKg.toLocaleString()} kg</span>
                <span className="text-[11px] text-slate-500 font-bold block mt-1">
                  {activeLotsCount} {t("activeInLots")}
                </span>
              </div>

              <div className="bg-white p-5 rounded-[24px] border border-[#3F7655]/20 shadow-sm">
                <span className="text-xs text-[#718078] font-bold block">{t("totalTxnValue")}</span>
                <span className="text-2xl font-black text-[#244936]">₹{totalTransactionValue.toLocaleString()}</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  {completedTxns.length} {t("settledCompleted")}
                </span>
              </div>

            </div>

            {/* Active Material Lots Overview Table */}
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#244936]">{t("recentActiveLots")}</h3>
                <button
                  onClick={() => setActiveTab('lots')}
                  className="text-xs font-bold text-[#3F7655] hover:underline"
                >
                  {t("viewAllLots")} →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">{t("lotId")}</th>
                      <th className="p-3">{t("category")}</th>
                      <th className="p-3">{t("collectorLabel")}</th>
                      <th className="p-3 text-right">{t("totalWeight")}</th>
                      <th className="p-3 text-right">{t("benchmarkPrice")}</th>
                      <th className="p-3 text-center">{t("status")}</th>
                      <th className="p-3 text-center">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {materialLots.slice(0, 5).map((lot) => (
                      <tr key={lot.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-800">{lot.id}</td>
                        <td className="p-3 font-semibold">{tCategory(lot.category || lot.material)}</td>
                        <td className="p-3 text-slate-700">{lot.collectorName}</td>
                        <td className="p-3 text-right font-bold">{lot.quantity || lot.totalWeightKg} kg</td>
                        <td className="p-3 text-right font-black text-[#3F7655]">₹{lot.benchmarkPrice || 350}/kg</td>
                        <td className="p-3 text-center">
                          <StatusBadge status={lot.status} />
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onViewLotDetails(lot)}
                            className="px-3 py-1 bg-[#244936] text-white rounded-lg font-bold text-[11px] hover:bg-[#14291E] cursor-pointer"
                          >
                            {t("inspectBtn")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COLLECTORS MANAGEMENT */}
        {activeTab === 'collectors' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("collectorAccountsTitle")}</h3>
                  <p className="text-xs text-[#718078]">{t("collectorAccountsSub")}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">{t("collectorId")}</th>
                      <th className="p-3">{t("name")}</th>
                      <th className="p-3">{t("phone")}</th>
                      <th className="p-3">{t("location")}</th>
                      <th className="p-3 text-center">{t("phoneVerification")}</th>
                      <th className="p-3 text-right">{t("lotsCompleted")}</th>
                      <th className="p-3 text-center">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {collectors.map(col => {
                      const isPhoneVerified = col.phoneVerified || col.phone_verified;
                      return (
                        <tr key={col.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-800">{col.id}</td>
                          <td className="p-3 font-bold text-[#203128]">{col.name}</td>
                          <td className="p-3 font-mono text-slate-600">{col.phone}</td>
                          <td className="p-3 text-slate-700">{col.location}</td>
                          <td className="p-3 text-center">
                            {isPhoneVerified ? (
                              <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-600" />
                                {t("phoneVerifiedBadge")} ✓
                              </span>
                            ) : (
                              <span className="text-[11px] font-extrabold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <X className="w-3 h-3 text-rose-600" />
                                {t("unverifiedPhone")}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right font-bold text-[#244936]">{col.lotsCompleted || 0}</td>
                          <td className="p-3 text-center">
                            {onToggleCollectorPhoneVerification && (
                              <button
                                onClick={() => onToggleCollectorPhoneVerification(col.id)}
                                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                                  isPhoneVerified 
                                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' 
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                }`}
                              >
                                {isPhoneVerified ? t("revokeVerification") : t("verifyPhoneBtn")}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RECYCLERS VERIFICATION MANAGEMENT */}
        {activeTab === 'recyclers' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("recyclerAuditTitle")}</h3>
                  <p className="text-xs text-[#718078]">{t("recyclerAuditSub")}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{t("filterStatus")}:</span>
                  <select
                    value={recyclerStatusFilter}
                    onChange={(e) => setRecyclerStatusFilter(e.target.value)}
                    className="text-xs font-bold bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    <option value="ALL">{t("allStatuses")}</option>
                    <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">{t("recyclerId")}</th>
                      <th className="p-3">{t("companyName")}</th>
                      <th className="p-3">{t("cpcbRegTitle")}</th>
                      <th className="p-3">{t("location")}</th>
                      <th className="p-3 text-right">{t("monthlyCap")}</th>
                      <th className="p-3 text-center">{t("verificationStatus")}</th>
                      <th className="p-3 text-center">{t("manageStatus")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {recyclers
                      .filter(r => recyclerStatusFilter === 'ALL' || r.verificationStatus === recyclerStatusFilter)
                      .map(rec => (
                        <tr key={rec.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-800">{rec.id}</td>
                          <td className="p-3 font-bold text-[#203128]">{rec.companyName}</td>
                          <td className="p-3 font-mono text-xs text-slate-600">{rec.cpcbRegistrationNo}</td>
                          <td className="p-3 text-slate-700">{rec.location}</td>
                          <td className="p-3 text-right font-bold">{(rec.capacityMonthlyKg || 50000).toLocaleString()} kg</td>
                          <td className="p-3 text-center">
                            <StatusBadge status={rec.verificationStatus || 'VERIFIED'} />
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {rec.verificationStatus !== 'VERIFIED' && onUpdateRecyclerStatus && (
                                <button
                                  onClick={() => onUpdateRecyclerStatus(rec.id, 'VERIFIED')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                                  title="Approve and Verify Recycler"
                                >
                                  {t("approveBtn")} ✓
                                </button>
                              )}

                              {rec.verificationStatus !== 'REJECTED' && onUpdateRecyclerStatus && (
                                <button
                                  onClick={() => onUpdateRecyclerStatus(rec.id, 'REJECTED')}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                                  title="Reject Recycler"
                                >
                                  {t("rejectBtn")} ✗
                                </button>
                              )}

                              {rec.verificationStatus !== 'SUSPENDED' && onUpdateRecyclerStatus && (
                                <button
                                  onClick={() => onUpdateRecyclerStatus(rec.id, 'SUSPENDED')}
                                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                                  title="Suspend Recycler Account"
                                >
                                  {t("suspendBtn")}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DIGITAL LOTS & TRACEABILITY */}
        {activeTab === 'lots' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("allDigitalLotsTitle")}</h3>
                  <p className="text-xs text-[#718078]">{t("allDigitalLotsSub")}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{t("filterStatus")}:</span>
                  <select
                    value={lotStatusFilter}
                    onChange={(e) => setLotStatusFilter(e.target.value)}
                    className="text-xs font-bold bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    <option value="ALL">{t("allStatuses")}</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="MATCHED">MATCHED</option>
                    <option value="OFFER_RECEIVED">OFFER_RECEIVED</option>
                    <option value="OFFER_ACCEPTED">OFFER_ACCEPTED</option>
                    <option value="PICKUP_SCHEDULED">PICKUP_SCHEDULED</option>
                    <option value="HANDED_OVER">HANDED_OVER</option>
                    <option value="PAYMENT_COMPLETED">PAYMENT_COMPLETED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">{t("lotId")}</th>
                      <th className="p-3">{t("materialCategory")}</th>
                      <th className="p-3">{t("collectorLabel")}</th>
                      <th className="p-3">{t("location")}</th>
                      <th className="p-3 text-right">{t("quantityCol")}</th>
                      <th className="p-3 text-right">{t("benchmarkCol")}</th>
                      <th className="p-3 text-center">{t("status")}</th>
                      <th className="p-3 text-center">{t("traceability")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {materialLots
                      .filter(l => lotStatusFilter === 'ALL' || l.status === lotStatusFilter)
                      .map(lot => (
                        <tr key={lot.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-800">{lot.id}</td>
                          <td className="p-3 font-bold text-[#203128]">{tCategory(lot.category || lot.material)}</td>
                          <td className="p-3 text-slate-700">{lot.collectorName}</td>
                          <td className="p-3 text-slate-600">{lot.location}</td>
                          <td className="p-3 text-right font-bold">{lot.quantity || lot.totalWeightKg} {lot.unit || 'kg'}</td>
                          <td className="p-3 text-right font-black text-[#3F7655]">₹{lot.benchmarkPrice || 350}/{lot.unit || 'kg'}</td>
                          <td className="p-3 text-center">
                            <StatusBadge status={lot.status} />
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => onViewLotDetails(lot)}
                              className="px-3 py-1 bg-[#244936] text-white rounded-lg font-bold text-[11px] hover:bg-[#14291E] cursor-pointer"
                            >
                              {t("inspectBtn")}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BENCHMARK PRICING & TOLERANCE CONFIGURATION */}
        {activeTab === 'pricing' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("pricingDatasetAdminTitle")}</h3>
                  <p className="text-xs text-[#718078]">{t("pricingDatasetAdminSub")}</p>
                </div>
              </div>

              {/* Editing Price Row Form if active */}
              {editingPriceId && (
                <div className="bg-[#FAF8F2] p-4 rounded-2xl border-2 border-[#3F7655] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-[#244936]">{t("editBenchmarkPricing")}</h4>
                    <button onClick={() => setEditingPriceId(null)} className="text-slate-500 hover:text-slate-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">{t("benchmarkPricePerKg")}</label>
                      <input
                        type="number"
                        value={editBenchPrice}
                        onChange={(e) => setEditBenchPrice(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold p-2 bg-white border border-[#3F7655]/20 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">{t("tolerancePercent")}</label>
                      <input
                        type="number"
                        value={editTolerance}
                        onChange={(e) => setEditTolerance(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-bold p-2 bg-white border border-[#3F7655]/20 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">{t("calculatedFairRange")}</label>
                      <div className="p-2 bg-[#DDEBD8] rounded-xl text-xs font-black text-[#244936]">
                        ₹{Math.round(editBenchPrice * (1 - editTolerance / 100))} – ₹{Math.round(editBenchPrice * (1 + editTolerance / 100))} / kg
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingPriceId(null)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-xl cursor-pointer"
                    >
                      {t("cancelBtn")}
                    </button>
                    <button
                      onClick={() => {
                        if (onUpdateBenchmarkPrice) {
                          onUpdateBenchmarkPrice(editingPriceId, editBenchPrice, editTolerance);
                        }
                        setEditingPriceId(null);
                      }}
                      className="px-4 py-1.5 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl cursor-pointer shadow-sm"
                    >
                      {t("saveRatesBtn")}
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">{t("materialCategory")}</th>
                      <th className="p-3 text-right">{t("benchmarkPrice")}</th>
                      <th className="p-3 text-center">{t("toleranceCol")}</th>
                      <th className="p-3 text-center">{t("fairPriceRange")}</th>
                      <th className="p-3">{t("hazardLevel")}</th>
                      <th className="p-3">{t("recoverableMetals")}</th>
                      <th className="p-3 text-center">{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {benchmarkPrices.map((item) => {
                      const tol = item.tolerancePercent !== undefined ? item.tolerancePercent : 25;
                      const fair = calculateFairPriceRange(item.referencePrice || item.benchmarkPrice, tol);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                            <span>{item.icon}</span>
                            <span>{tCategory(item.category)} - {item.material}</span>
                          </td>
                          <td className="p-3 text-right font-black text-[#3F7655]">₹{item.referencePrice || item.benchmarkPrice} / {item.unit || 'kg'}</td>
                          <td className="p-3 text-center font-bold text-slate-700">±{tol}%</td>
                          <td className="p-3 text-center">
                            <span className="font-extrabold text-[#244936] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full text-[11px]">
                              ₹{fair.lowerLimit} – ₹{fair.upperLimit} / {item.unit || 'kg'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.hazardLevel === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {item.hazardLevel}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600">{item.recoveryMetals?.join(', ')}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setEditingPriceId(item.id);
                                setEditBenchPrice(item.referencePrice || item.benchmarkPrice);
                                setEditTolerance(tol);
                              }}
                              className="px-3 py-1 bg-[#3F7655] text-white rounded-lg font-bold text-[11px] hover:bg-[#244936] cursor-pointer"
                            >
                              {t("editBtn")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TRANSACTIONS & SETTLEMENTS */}
        {activeTab === 'transactions' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("allTransactionsTitle")}</h3>
                  <p className="text-xs text-[#718078]">{t("allTransactionsSub")}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">{t("txId")}</th>
                      <th className="p-3">{t("lotId")}</th>
                      <th className="p-3">{t("collectorLabel")}</th>
                      <th className="p-3">{t("recyclerLabel")}</th>
                      <th className="p-3 text-right">{t("quantityCol")}</th>
                      <th className="p-3 text-right">{t("rateCol")}</th>
                      <th className="p-3 text-right">{t("totalValueCol")}</th>
                      <th className="p-3 text-center">{t("paymentStatus")}</th>
                      <th className="p-3">{t("dateCol")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-800">{tx.id}</td>
                        <td className="p-3 font-mono font-bold text-[#3F7655]">{tx.lotId}</td>
                        <td className="p-3 font-semibold">{tx.collectorName}</td>
                        <td className="p-3 text-slate-700">{tx.recyclerName}</td>
                        <td className="p-3 text-right font-bold">{tx.quantityKg || tx.quantity} kg</td>
                        <td className="p-3 text-right font-black text-[#244936]">₹{tx.acceptedPricePerKg || tx.agreedPricePerKg}/kg</td>
                        <td className="p-3 text-right font-black text-[#3F7655]">₹{(tx.totalValue || tx.amount || 0).toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            tx.paymentStatus === 'COMPLETED' || tx.paymentStatus === 'PAID' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : tx.paymentStatus === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                          }`}>
                            {tx.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{tx.date || tx.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: FLAGGED OFFERS & DISPUTE REVIEW */}
        {activeTab === 'flagged' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-rose-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>{t("flaggedOffersReviewTitle")}</span>
                  </h3>
                  <p className="text-xs text-[#718078]">{t("flaggedOffersReviewSub")}</p>
                </div>
              </div>

              {flaggedOffersList.length === 0 ? (
                <div className="text-center py-10 text-emerald-800 text-xs bg-emerald-50 rounded-2xl">
                  ✓ {t("noFlaggedOffers")}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-rose-50 text-rose-900 font-bold border-b border-rose-200">
                      <tr>
                        <th className="p-3">{t("offerId")}</th>
                        <th className="p-3">{t("lotId")}</th>
                        <th className="p-3">{t("recyclerLabel")}</th>
                        <th className="p-3 text-right">{t("unitRate")}</th>
                        <th className="p-3 text-right">{t("totalOffered")}</th>
                        <th className="p-3 text-center">{t("flagReason")}</th>
                        <th className="p-3 text-center">{t("adminDecision")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100">
                      {flaggedOffersList.map(offer => (
                        <tr key={offer.id} className="hover:bg-rose-50/50">
                          <td className="p-3 font-mono font-bold text-slate-800">{offer.id}</td>
                          <td className="p-3 font-mono font-bold text-[#3F7655]">{offer.lotId}</td>
                          <td className="p-3 font-semibold">{offer.recyclerName}</td>
                          <td className="p-3 text-right font-black text-rose-700">₹{offer.pricePerUnit || offer.price}/kg</td>
                          <td className="p-3 text-right font-bold text-slate-800">₹{(offer.totalPrice || offer.pricePerUnit * 20).toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className="text-[10px] font-extrabold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                              {offer.fairPriceStatus === 'BELOW_FAIR_RANGE' ? t("belowFairRange") : t("flaggedForReview")} ⚠️
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {onResolveFlaggedOffer && (
                                <>
                                  <button
                                    onClick={() => onResolveFlaggedOffer(offer.id, 'APPROVE')}
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                                  >
                                    {t("allowOfferBtn")}
                                  </button>
                                  <button
                                    onClick={() => onResolveFlaggedOffer(offer.id, 'DISMISS')}
                                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                                  >
                                    {t("rejectOfferBtn")}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#244936]">{t("systemEventLogTitle")}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">{t("timestampCol")}</th>
                      <th className="p-3">{t("actionTypeCol")}</th>
                      <th className="p-3">{t("entityInvolvedCol")}</th>
                      <th className="p-3">{t("statusOutcomeCol")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-600">{log.timestamp}</td>
                        <td className="p-3 font-bold text-[#203128]">{log.action}</td>
                        <td className="p-3 text-slate-700">{log.entity}</td>
                        <td className="p-3">
                          <span className="text-[11px] font-bold bg-[#DDEBD8] text-[#244936] px-2 py-0.5 rounded-full">
                            {tStatus(log.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
