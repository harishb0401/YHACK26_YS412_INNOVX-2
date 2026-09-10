import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Truck, RefreshCw, Award, TrendingUp, 
  User, CheckCircle2, MapPin, Scale, ShieldCheck, Eye, ArrowRight, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { evaluateRecyclerMatch } from '../mockData';
import { useTranslation, useLanguage } from '../i18n';

export default function RecyclerDashboard({ 
  ewasteList, 
  onAcceptWaste, 
  onUpdateStatus, 
  onTrackItem, 
  setActiveView 
}) {
  const { t } = useTranslation();
  const { tCategory, tStatus } = useLanguage();

  const [activeTab, setActiveTab] = useState('Available Waste');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Recycler Info
  const recyclerProfile = {
    id: "REC-401",
    companyName: "GreenMat Eco-Processing Center",
    supportedCategories: ["IT & Telecommunications", "Consumer Electronics", "Large Home Appliances"],
    processingCapacity: "50,000 kg / month",
    currentCapacityUsed: "32,400 kg",
    verificationStatus: "Verified Recycler ✓",
    isVerified: true
  };

  // Sidebar Items
  const sidebarItems = [
    { name: t("navDashboard"), icon: LayoutDashboard },
    { name: t("availableDemands"), icon: ShoppingBag },
    { name: t("acceptedLots"), icon: ShieldCheck },
    { name: t("statusInTransit"), icon: Truck },
    { name: t("statusProcessing"), icon: RefreshCw },
    { name: t("statusRecycled"), icon: CheckCircle2 },
    { name: t("officialRecyclingProof"), icon: Award },
    { name: t("navRewards"), icon: TrendingUp },
    { name: t("recyclerPortal"), icon: User },
  ];

  // Recycler Metric Numbers
  const availableCount = ewasteList.filter(w => w.status === 'Pending' || w.status === 'Matched').length;
  const incomingCount = ewasteList.filter(w => w.status === 'In Transit' || w.status === 'Pickup Scheduled').length;
  const processingCount = ewasteList.filter(w => w.status === 'Received' || w.status === 'Processing').length;
  const completedCount = ewasteList.filter(w => w.status === 'Recycled').length;

  // Filter Available E-Waste Cards
  const availableWasteList = ewasteList.filter(w => {
    return (w.status === 'Pending' || w.status === 'Matched');
  });

  // Filter Accepted / Processing Waste for Recycler Status Manager
  const activeProcessingList = ewasteList.filter(w => {
    return w.status !== 'Pending';
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          
          {/* Facility Info */}
          <div className="pb-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500 text-white font-bold flex items-center justify-center">
              GM
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">GreenMat Eco</h4>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {t("verifiedRecyclerBadge")}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarItems.map((item, idx) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? 'bg-emerald-600 text-white font-semibold shadow' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          {t("facilityId")}: <span className="text-slate-300 font-mono">REC-401</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("recyclerPortal")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("cpcbVerifLayerSub")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {t("cpcbVerified")}
            </span>
          </div>
        </div>

        {/* 4 Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">{t("availableDemands")}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{availableCount}</span>
              <span className="text-xs text-slate-400 font-mono">Marketplace</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t("acceptedCategoriesSubtitle")}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block">{t("statusInTransit")}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-purple-600">{incomingCount}</span>
              <span className="text-xs text-purple-600/70 font-mono">In Transit</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t("transportationStep")}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">{t("statusProcessing")}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-blue-600">{processingCount}</span>
              <span className="text-xs text-blue-600/70 font-mono">Active</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t("dismantlingSortingExtraction")}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">{t("statusRecycled")}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-600">{completedCount}</span>
              <span className="text-xs text-emerald-600/70 font-mono">Certificates</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{t("statusRecycledCertified")}</p>
          </div>

        </div>

        {/* Section 1: Available E-Waste Marketplace Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                {t("availableDemands")}
              </h2>
              <p className="text-xs text-slate-500">
                {t("scrapRatesSubtitle")}
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableWasteList.map((waste) => {
              const ruleResult = evaluateRecyclerMatch(waste, recyclerProfile);

              return (
                <div 
                  key={waste.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Info */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {waste.id}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {t("date")}: {waste.date}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-tight mb-2">
                      {waste.wasteType}
                    </h3>

                    {/* Badge Category */}
                    <span className="inline-block text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg mb-4">
                      {t("category")}: {tCategory(waste.category)}
                    </span>

                    {/* Metadata Grid */}
                    <div className="space-y-2 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t("totalWeight")}:</span>
                        <span className="font-bold text-slate-900">{waste.weight} kg ({waste.quantity} units)</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">{t("pickupAddressLocation")}:</span>
                        <span className="font-medium text-slate-800 text-right truncate max-w-[180px]">{waste.pickupLocation}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Distance:</span>
                        <span className="font-bold text-emerald-700">{waste.distanceKm || 12} km away</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">{t("conditionSpecialHandling")}:</span>
                        <span className="font-medium text-slate-800">{waste.condition}</span>
                      </div>
                    </div>

                    {/* Rule Match Verdict Pills */}
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{t("ruleMatchLogic")}:</span>
                      <div className="flex flex-wrap gap-1">
                        {ruleResult.checks.map((c, i) => (
                          <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded ${c.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {c.passed ? '✓ ' + c.name : '✕ ' + c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions: View Details & Accept Waste */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onTrackItem(waste.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t("viewDetails")}</span>
                    </button>

                    <button
                      onClick={() => onAcceptWaste(waste.id, recyclerProfile)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("createLot")}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Active Facility Processing Status Manager */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
              {t("acceptedLots")}
            </h2>
            <p className="text-xs text-slate-500">
              {t("updateProcessingStage")}
            </p>
          </div>

          <div className="space-y-4">
            {activeProcessingList.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-emerald-700">{item.id}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.wasteType}</h4>
                  <p className="text-xs text-slate-500">
                    {t("collectorLabel")}: {item.collector?.name} • {t("weight")}: {item.weight} kg • {t("locationCity")}: {item.pickupLocation}
                  </p>
                </div>

                {/* Status Advancement Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold mr-1">{t("stage")}:</span>

                  {item.status !== 'In Transit' && item.status !== 'Received' && item.status !== 'Processing' && item.status !== 'Recycled' && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'In Transit')}
                      className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 transition cursor-pointer"
                    >
                      {t("statusInTransit")}
                    </button>
                  )}

                  {item.status !== 'Received' && item.status !== 'Processing' && item.status !== 'Recycled' && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'Received')}
                      className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition cursor-pointer"
                    >
                      {t("statusReceived")}
                    </button>
                  )}

                  {item.status !== 'Processing' && item.status !== 'Recycled' && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'Processing')}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition cursor-pointer"
                    >
                      {t("statusProcessing")}
                    </button>
                  )}

                  {item.status !== 'Recycled' && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'Recycled')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("issueCertificate")}</span>
                    </button>
                  )}

                  {item.status === 'Recycled' && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> {t("statusRecycledCertified")}
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

