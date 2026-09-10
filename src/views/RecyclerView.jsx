import React, { useState } from 'react';
import { 
  Plus, ShieldCheck, ShoppingBag, Truck, RefreshCw, Award, 
  CheckCircle2, Users, ArrowRight, AlertTriangle, QrCode, Search, Filter, Sparkles
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { matchCollectorsToRequirement } from '../utils/rulesEngine';

export default function RecyclerView({ 
  requirements = [], 
  collectors = [], 
  materialLots = [], 
  onOpenPostRequirementModal, 
  onSelectCollectorAndCreateLot,
  onViewLotDetails 
}) {
  const { t, tCategory, tStatus, tCondition } = useTranslation();
  const [activeTab, setActiveTab] = useState('requirements');
  const [selectedRequirement, setSelectedRequirement] = useState(requirements[0] || null);

  const recyclerProfile = {
    id: "REC-TN-01",
    companyName: "GreenCycle Material Recovery Ltd",
    cpcbRegistrationNo: "TN-EPR-2026-8821 (Demo Evidence)",
    isCpcbVerified: true,
    isPlatformVerified: true,
    location: "Plot 42, SIDCO Industrial Estate, Ambattur, Chennai",
    capacityMonthlyKg: 50000,
    currentIntakeKg: 28400,
    totalLotsProcessed: materialLots.length
  };

  const matchingCollectors = selectedRequirement 
    ? matchCollectorsToRequirement(collectors, selectedRequirement)
    : [];

  return (
    <div className="min-h-screen bg-[#F8F5EA] pb-16 text-[#203128]">
      
      {/* Recycler Header with Verified CPCB Status */}
      <div className="bg-[#244936] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F2C94C] text-[#244936] flex items-center justify-center font-black text-2xl shadow-md">
              GC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">{recyclerProfile.companyName}</h1>
                <span className="text-xs font-bold text-[#244936] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3F7655]" />
                  {t("cpcbVerified")}
                </span>
              </div>
              <p className="text-xs text-[#DDEBD8] mt-1">
                {t("cpcbRegTitle")}: <strong>{recyclerProfile.cpcbRegistrationNo}</strong> · {recyclerProfile.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPostRequirementModal}
              className="px-5 py-3 text-xs font-extrabold text-[#244936] bg-[#F2C94C] hover:bg-[#e0b83b] rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t("postRequirement")}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Tab Navigation */}
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
            <span>{t("myActiveRequirements")} ({requirements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matching')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'matching' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t("matchingCollectors")}</span>
          </button>

          <button
            onClick={() => setActiveTab('lots')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'lots' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{t("acceptedLots")} ({materialLots.length})</span>
          </button>
        </div>

        {/* Tab 1: My Requirements */}
        {activeTab === 'requirements' && (
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {requirements.map(req => (
                <div
                  key={req.id}
                  className={`bg-white rounded-[28px] border p-6 shadow-sm transition space-y-4 cursor-pointer ${
                    selectedRequirement?.id === req.id 
                      ? 'border-[#3F7655] ring-2 ring-[#3F7655]/30' 
                      : 'border-[#3F7655]/20 hover:border-[#3F7655]/50'
                  }`}
                  onClick={() => {
                    setSelectedRequirement(req);
                    setActiveTab('matching');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-1 rounded-full">
                      {tCategory(req.category)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {t("expiresInDays", { days: req.expiresInDays })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#244936]">{req.requiredQuantityKg} kg {t("targetQty")}</h3>
                    <p className="text-xs text-[#718078] mt-1">
                      {t("budgetRate")}: <strong>₹{req.targetPricePerKg}/kg</strong> · {t("refRangeRate", { min: req.referenceMin, max: req.referenceMax })}
                    </p>
                  </div>

                  <div className="bg-[#FAF8F2] p-3 rounded-2xl border border-[#3F7655]/15 text-xs text-[#718078] space-y-1">
                    <div><strong>{t("preferredCondition")}:</strong> {tCondition(req.preferredCondition)}</div>
                    <div><strong>{t("targetLocation")}:</strong> {req.location}</div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequirement(req);
                      setActiveTab('matching');
                    }}
                    className="w-full py-2.5 px-4 text-xs font-extrabold text-[#244936] bg-[#DDEBD8] hover:bg-[#c9e0c1] rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t("viewMatchingCollectors")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Matching Collectors & Decision Engine */}
        {activeTab === 'matching' && (
          <div className="mt-6 space-y-6">
            
            {/* Requirement Context Selector Header */}
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                  {t("ruleBasedEngine")}
                </span>
                <h3 className="text-base font-black text-[#244936] mt-1">
                  {t("comparingCollectorsFor", { category: tCategory(selectedRequirement?.category), qty: selectedRequirement?.requiredQuantityKg })}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">{t("selectRequirement")}:</span>
                <select
                  value={selectedRequirement?.id}
                  onChange={(e) => setSelectedRequirement(requirements.find(r => r.id === e.target.value))}
                  className="text-xs font-bold bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-2"
                >
                  {requirements.map(r => (
                    <option key={r.id} value={r.id}>{tCategory(r.category)} ({r.requiredQuantityKg}kg - {r.id})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Collectors Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matchingCollectors.map((col) => (
                <div
                  key={col.id}
                  className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#244936] bg-[#F2C94C] px-2.5 py-1 rounded-full">
                        {t("ruleMatch", { score: col.matchScore })}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {col.reliabilityScore} ★ ({col.lotsCompleted} {t("lotsLabel")})
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-[#203128]">{col.name}</h4>
                      <p className="text-xs text-[#718078]">{col.location}</p>
                    </div>

                    {/* Declared items preview */}
                    <div className="bg-[#FAF8F2] p-3 rounded-2xl border border-[#3F7655]/15 space-y-2">
                      <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                        <span>{t("availableWeight")}:</span>
                        <strong className="text-[#244936]">{col.availableWeightKg} kg</strong>
                      </div>
                      <div className="text-[11px] font-bold text-slate-600 flex justify-between">
                        <span>{t("askingPrice")}:</span>
                        <strong className="text-[#3F7655]">₹{col.askingPricePerKg} / kg</strong>
                      </div>
                    </div>

                    {/* Price Warning Alert if flagged */}
                    {col.hasPriceWarning && (
                      <div className="bg-amber-50 rounded-xl p-2.5 border border-amber-300 flex items-center gap-2 text-[11px] text-amber-800 font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{t("askingPrice")} +{col.priceWarningDetails.percentAbove}% ({t("refRangeRate", { min: selectedRequirement.referenceMin, max: selectedRequirement.referenceMax })})</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#3F7655]/10">
                    <button
                      onClick={() => onSelectCollectorAndCreateLot(selectedRequirement, col)}
                      className="w-full py-3 px-4 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t("selectCollector")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 3: Accepted Lots & Processing Pipeline */}
        {activeTab === 'lots' && (
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
                        {t("digitalMaterialLot")}
                      </span>
                      <h4 className="text-base font-black text-[#244936] mt-0.5">{lot.id}</h4>
                    </div>
                    <span className="text-xs font-bold bg-[#DDEBD8] text-[#244936] px-2.5 py-1 rounded-full">
                      {t("stepProgress", { step: lot.timelineStep, status: tStatus(lot.status) })}
                    </span>
                  </div>

                  <div className="bg-[#FAF8F2] p-3 rounded-2xl border border-[#3F7655]/15 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[#718078] font-bold block">{t("totalWeight")}</span>
                      <span className="font-black text-[#203128]">{lot.totalWeightKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718078] font-bold block">{t("estimatedLotValue")}</span>
                      <span className="font-black text-[#3F7655]">₹{lot.estimatedLotValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718078] font-bold block">{t("collectorLabel")}</span>
                      <span className="font-bold text-slate-700 truncate block">{lot.collectorName.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">{lot.location}</span>
                    <button
                      onClick={() => onViewLotDetails(lot)}
                      className="px-4 py-2 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{t("viewDetailsAndQR")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
