import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, TrendingUp, Users, Package, 
  FileText, Plus, Search, CheckCircle2, Eye, Activity, Database
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { referenceScrapPrices } from '../data/scrapPrices';
import { adminAuditLogs } from '../mockData';

export default function AdminView({ 
  requirements = [], 
  collectors = [], 
  materialLots = [],
  onViewLotDetails
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [priceData, setPriceData] = useState(referenceScrapPrices);

  const totalWeightRecycled = materialLots.reduce((sum, l) => sum + (l.totalWeightKg || 0), 0);
  const totalLotsCount = materialLots.length;
  const activePriceAlertsCount = collectors.filter(c => c.askingPricePerKg > 400).length;

  return (
    <div className="min-h-screen bg-[#F8F5EA] pb-16 text-[#203128]">
      
      {/* Top Banner */}
      <div className="bg-[#14291E] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black text-2xl shadow-inner">
              ADM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{t("adminPortal")}</h1>
                <span className="text-xs font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full">
                  System Master
                </span>
              </div>
              <p className="text-xs text-[#DDEBD8] mt-0.5">
                Rule Engine Configuration · CPCB Audits · Traceable Material Lots
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white/10 p-3 rounded-2xl">
            <div className="text-center px-2">
              <span className="text-[10px] text-[#DDEBD8] font-bold block">{t("totalLotsCreated")}</span>
              <span className="text-lg font-black text-[#F2C94C]">{totalLotsCount}</span>
            </div>
            <div className="text-center px-2 border-x border-white/10">
              <span className="text-[10px] text-[#DDEBD8] font-bold block">{t("priceAlerts")}</span>
              <span className="text-lg font-black text-rose-400">{activePriceAlertsCount}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-[#DDEBD8] font-bold block">Recyclers</span>
              <span className="text-lg font-black text-[#DDEBD8]">14 CPCB</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#3F7655]/15">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{t("systemOverview")}</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'prices' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{t("manageReferencePrices")}</span>
          </button>

          <button
            onClick={() => setActiveTab('audits')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'audits' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t("verificationAudits")}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'logs' ? 'bg-[#3F7655] text-white shadow-sm' : 'bg-white text-[#203128] border border-[#3F7655]/15'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t("auditLogs")}</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-[24px] border border-[#3F7655]/20 shadow-sm">
                <span className="text-xs text-[#718078] font-bold block">Total Recycled E-Waste</span>
                <span className="text-2xl font-black text-[#244936]">{totalWeightRecycled + 38650} kg</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">↑ +24% this month</span>
              </div>
              <div className="bg-white p-5 rounded-[24px] border border-[#3F7655]/20 shadow-sm">
                <span className="text-xs text-[#718078] font-bold block">Gold Recovered</span>
                <span className="text-2xl font-black text-amber-600">482.5 g</span>
                <span className="text-[11px] text-slate-500 font-bold block mt-1">Certified purity: 98.4%</span>
              </div>
              <div className="bg-white p-5 rounded-[24px] border border-[#3F7655]/20 shadow-sm">
                <span className="text-xs text-[#718078] font-bold block">Registered Collectors</span>
                <span className="text-2xl font-black text-[#203128]">86</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">100% ID Verified</span>
              </div>
              <div className="bg-white p-5 rounded-[24px] border border-[#3F7655]/20 shadow-sm">
                <span className="text-xs text-[#718078] font-bold block">CPCB Recyclers</span>
                <span className="text-2xl font-black text-[#3F7655]">14 Facilities</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">EPR Compliant</span>
              </div>
            </div>

            {/* Active Material Lots Overview Table */}
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#244936]">Active Digital Material Lots</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">Lot ID</th>
                      <th className="p-3">Collector</th>
                      <th className="p-3">Recycler</th>
                      <th className="p-3 text-right">Weight</th>
                      <th className="p-3 text-right">Estimated Value</th>
                      <th className="p-3">Stage</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {materialLots.map((lot, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-800">{lot.id}</td>
                        <td className="p-3 font-semibold">{lot.collectorName}</td>
                        <td className="p-3 text-slate-600">{lot.recyclerName}</td>
                        <td className="p-3 text-right font-bold">{lot.totalWeightKg} kg</td>
                        <td className="p-3 text-right font-black text-[#3F7655]">₹{lot.estimatedLotValue}</td>
                        <td className="p-3">
                          <span className="text-[11px] font-bold bg-[#DDEBD8] text-[#244936] px-2 py-0.5 rounded-full">
                            {lot.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => onViewLotDetails(lot)}
                            className="px-3 py-1 bg-[#244936] text-white rounded-lg font-bold text-[11px] hover:bg-[#14291E]"
                          >
                            Inspect
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

        {/* Tab 2: Reference Scrap Prices Dataset */}
        {activeTab === 'prices' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3F7655]/15">
                <div>
                  <h3 className="text-base font-black text-[#244936]">Scrap Pricing Rule Dataset</h3>
                  <p className="text-xs text-[#718078]">Configurable deterministic reference prices used for lot calculations and price warnings.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">Material Category</th>
                      <th className="p-3">Baseline Rate</th>
                      <th className="p-3">Acceptable Range</th>
                      <th className="p-3">Hazard Level</th>
                      <th className="p-3">Recoverable Metals</th>
                      <th className="p-3">Source & Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {priceData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{item.material}</span>
                        </td>
                        <td className="p-3 font-black text-[#3F7655]">₹{item.referencePrice} / kg</td>
                        <td className="p-3 font-semibold text-slate-700">₹{item.referenceMin} – ₹{item.referenceMax} / kg</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.hazardLevel === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.hazardLevel}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600">{item.recoveryMetals.join(', ')}</td>
                        <td className="p-3 text-slate-500">{item.source} ({item.lastUpdated})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: CPCB Verification Audits */}
        {activeTab === 'audits' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#244936]">CPCB/EPR Recycler Verification Layer</h3>
              <p className="text-xs text-[#718078]">
                Displaying platform-verified status layer for recycling facilities with documented CPCB/EPR registrations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#3F7655]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#203128]">GreenCycle Material Recovery Ltd</h4>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ✓ CPCB Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div><strong>Registration:</strong> TN-EPR-2026-8821 (Demo)</div>
                    <div><strong>Facility Location:</strong> Ambattur Industrial Estate, Chennai</div>
                    <div><strong>Audit Date:</strong> 15 Jan 2026 · Recovery Tech: Hydrometallurgy & Mechanical</div>
                  </div>
                </div>

                <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#3F7655]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-[#203128]">Madurai CleanMetals Eco-Processing</h4>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ✓ CPCB Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div><strong>Registration:</strong> TN-EPR-2026-4412 (Demo)</div>
                    <div><strong>Facility Location:</strong> Kappalur SIDCO, Madurai</div>
                    <div><strong>Audit Date:</strong> 02 Feb 2026 · Recovery Tech: Secondary Smelting & Battery Pyrolysis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Audit Logs */}
        {activeTab === 'logs' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#244936]">System Event & Rule Audit Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action Type</th>
                      <th className="p-3">Entity Involved</th>
                      <th className="p-3">Status / Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {adminAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-600">{log.timestamp}</td>
                        <td className="p-3 font-bold text-[#203128]">{log.action}</td>
                        <td className="p-3 text-slate-700">{log.entity}</td>
                        <td className="p-3">
                          <span className="text-[11px] font-bold bg-[#DDEBD8] text-[#244936] px-2 py-0.5 rounded-full">
                            {log.status}
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
