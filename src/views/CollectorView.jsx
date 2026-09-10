import React, { useState } from 'react';
import { 
  Package, LayoutDashboard, ShoppingBag, ShieldAlert, Award, 
  TrendingUp, User, Clock, QrCode, Search, Filter, Plus, ArrowRight, CheckCircle2, ChevronRight, Phone, MapPin
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { referenceScrapPrices } from '../data/scrapPrices';

export default function CollectorView({ 
  requirements = [], 
  materialLots = [], 
  onOpenRespondModal, 
  onViewLotDetails,
  onOpenDisposeModal
}) {
  const { t, tCategory, tStatus } = useTranslation();
  const [activeTab, setActiveTab] = useState('requirements');
  const [searchFilter, setSearchFilter] = useState('');

  const collectorProfile = {
    id: "COL-TN-101",
    name: "Ramesh Kumar",
    company: "Apex Scrap Collection",
    location: "Chennai - Guindy",
    reliabilityScore: 4.9,
    activeLots: materialLots.filter(l => l.status !== 'Recycling Completed').length,
    completedLots: materialLots.filter(l => l.status === 'Recycling Completed').length,
    totalEarnings: materialLots.reduce((sum, l) => sum + (l.agreedTotalValue || l.estimatedLotValue || 0), 0)
  };

  const filteredRequirements = requirements.filter(req => 
    req.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
    req.recyclerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    req.location.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F5EA] pb-24 lg:pb-12 text-[#203128]">
      
      {/* Top Banner with Collector Profile */}
      <div className="bg-[#244936] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-black text-2xl shadow-inner">
              RK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{collectorProfile.name}</h1>
                <span className="text-xs font-bold text-[#244936] bg-[#F2C94C] px-2.5 py-0.5 rounded-full">
                  {t("verifiedCollectorBadge")}
                </span>
              </div>
              <p className="text-xs text-[#DDEBD8] mt-0.5">
                {collectorProfile.company} · {collectorProfile.location} · {t("lotId")}: {collectorProfile.id}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <div className="text-center px-3">
              <span className="text-[11px] text-[#DDEBD8] font-bold block">{t("reliabilityScore")}</span>
              <span className="text-lg font-black text-[#F2C94C]">{collectorProfile.reliabilityScore} ★</span>
            </div>
            <div className="text-center px-3 border-x border-white/10">
              <span className="text-[11px] text-[#DDEBD8] font-bold block">{t("activeLotsCount")}</span>
              <span className="text-lg font-black text-white">{collectorProfile.activeLots}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[11px] text-[#DDEBD8] font-bold block">{t("totalEarnings")}</span>
              <span className="text-lg font-black text-[#DDEBD8]">₹{collectorProfile.totalEarnings.toLocaleString()}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Tab Navigation (Desktop) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#3F7655]/15">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'requirements' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t("availableDemands")} ({requirements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my-lots')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'my-lots' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t("myDeclaredLots")} ({materialLots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scrap-rates')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'scrap-rates' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t("referenceScrapRatesTitle")}</span>
          </button>
        </div>

        {/* Tab 1: Available Recycler Demands */}
        {activeTab === 'requirements' && (
          <div className="mt-6 space-y-5">
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#718078]" />
                <input
                  type="text"
                  placeholder={t("searchDemandsPlaceholder")}
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-bold bg-white border border-[#3F7655]/20 rounded-2xl focus:outline-none focus:border-[#3F7655]"
                />
              </div>

              <span className="text-xs font-bold text-[#718078]">
                {t("showingActiveDemands", { count: filteredRequirements.length })}
              </span>
            </div>

            {/* Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRequirements.map(req => (
                <div
                  key={req.id}
                  className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-1 rounded-full">
                        {tCategory(req.category)}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {t("expiresInDays", { days: req.expiresInDays })}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-[#203128]">{req.recyclerName}</h3>
                      <p className="text-xs text-[#718078] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
                        <span>{req.location}</span>
                      </p>
                    </div>

                    <div className="bg-[#FAF8F2] p-3 rounded-2xl border border-[#3F7655]/15 grid grid-cols-2 gap-2 text-center">
                      <div>
                        <span className="text-[10px] text-[#718078] font-bold block">{t("targetQty")}</span>
                        <span className="text-sm font-black text-[#244936]">{req.requiredQuantityKg} kg</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#718078] font-bold block">{t("budgetRate")}</span>
                        <span className="text-sm font-black text-[#3F7655]">₹{req.targetPricePerKg}/kg</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#718078] line-clamp-2">
                      {req.notes}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-slate-500">
                      {t("refRangeRate", { min: req.referenceMin, max: req.referenceMax })}
                    </span>
                    <button
                      onClick={() => onOpenRespondModal(req)}
                      className="px-4 py-2 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-sm transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t("respondToDemand")}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 2: My Declared Lots */}
        {activeTab === 'my-lots' && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {materialLots.map(lot => (
                <div
                  key={lot.id}
                  className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                        {t("lotId")}
                      </span>
                      <h3 className="text-base font-black text-[#244936] mt-0.5">{lot.id}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      lot.status === 'Recycling Completed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tStatus(lot.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#FAF8F2] p-3 rounded-2xl border border-[#3F7655]/15 text-center">
                    <div>
                      <span className="text-[10px] text-[#718078] font-bold block">{t("totalWeight")}</span>
                      <span className="text-sm font-black text-[#203128]">{lot.totalWeightKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718078] font-bold block">{t("estimatedLotValue")}</span>
                      <span className="text-sm font-black text-[#3F7655]">₹{lot.estimatedLotValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718078] font-bold block">{t("recyclerLabel")}</span>
                      <span className="text-xs font-bold text-slate-700 truncate block">{lot.recyclerName.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">{lot.createdDate}</span>
                    <button
                      onClick={() => onViewLotDetails(lot)}
                      className="px-4 py-2 text-xs font-bold text-[#244936] bg-[#DDEBD8] hover:bg-[#c9e0c1] rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-[#3F7655]" />
                      <span>{t("viewDetailsAndQR")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Reference Scrap Price Catalog */}
        {activeTab === 'scrap-rates' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#3F7655]/15">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("scrapPricingDatasetTitle")}</h3>
                  <p className="text-xs text-[#718078]">
                    {t("scrapRatesSubtitle")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {referenceScrapPrices.map(item => (
                  <div key={item.id} className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#3F7655]/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs font-black text-[#3F7655] bg-white px-2.5 py-1 rounded-xl border border-[#3F7655]/20">
                        ₹{item.referencePrice} / kg
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#203128]">{tCategory(item.category)} - {item.material}</h4>
                    <span className="text-[11px] font-bold text-slate-500 block">
                      {tCategory(item.category)} · {t("refRangeRate", { min: item.referenceMin, max: item.referenceMax })}
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.recoveryMetals.map((metal, mIdx) => (
                        <span key={mIdx} className="text-[10px] font-bold bg-[#DDEBD8] text-[#244936] px-2 py-0.5 rounded">
                          {metal}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Mobile-First Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#3F7655]/20 px-6 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeTab === 'requirements' ? 'text-[#3F7655]' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{t("availableDemands")}</span>
        </button>

        <button
          onClick={() => setActiveTab('my-lots')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeTab === 'my-lots' ? 'text-[#3F7655]' : 'text-slate-500'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>{t("myDeclaredLots")}</span>
        </button>

        <button
          onClick={() => setActiveTab('scrap-rates')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeTab === 'scrap-rates' ? 'text-[#3F7655]' : 'text-slate-500'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span>{t("referenceRate")}</span>
        </button>
      </div>

    </div>
  );
}
