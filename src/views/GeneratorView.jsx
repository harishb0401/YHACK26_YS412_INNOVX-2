import React, { useState } from 'react';
import { 
  Sparkles, Leaf, Plus, Search, ShieldCheck, QrCode, FileText, 
  Award, ArrowRight, CheckCircle2, Truck, Clock 
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { generatorDisposalsList } from '../mockData';

export default function GeneratorView({ 
  onOpenDisposeModal, 
  onViewLotDetails,
  materialLots = [] 
}) {
  const { t, tStatus } = useTranslation();
  const [lotSearchQuery, setLotSearchQuery] = useState('');
  const [searchedLot, setSearchedLot] = useState(materialLots[0] || null);
  const [disposals, setDisposals] = useState(generatorDisposalsList);

  const handleSearchLot = (e) => {
    e.preventDefault();
    const found = materialLots.find(l => l.id.toLowerCase().includes(lotSearchQuery.trim().toLowerCase()));
    if (found) {
      setSearchedLot(found);
    } else {
      alert(`No Lot found matching "${lotSearchQuery}". Try LOT-EL26-TN-00125`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EA] pb-16 text-[#203128]">
      
      {/* Top Banner */}
      <div className="bg-[#244936] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-black text-2xl shadow-inner">
              SR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black">Sundar Rajan</h1>
                <span className="text-xs font-bold text-[#244936] bg-[#F2C94C] px-2.5 py-0.5 rounded-full">
                  {t("roleGenerator")}
                </span>
              </div>
              <p className="text-xs text-[#DDEBD8] mt-0.5">
                Anna Nagar, Chennai · Tier: Eco Contributor (850 pts)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDisposeModal}
              className="px-6 py-3 text-xs font-black text-white bg-[#3F7655] hover:bg-[#2e5940] rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t("disposeEWaste")}</span>
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center text-xl">
              🌟
            </div>
            <div>
              <span className="text-xs text-[#718078] font-bold block">{t("ecoPointsEarned")}</span>
              <span className="text-2xl font-black text-[#244936]">850 pts</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center text-xl">
              🌱
            </div>
            <div>
              <span className="text-xs text-[#718078] font-bold block">{t("co2OffsetKg")}</span>
              <span className="text-2xl font-black text-[#3F7655]">18.6 kg CO₂</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center text-xl">
              💻
            </div>
            <div>
              <span className="text-xs text-[#718078] font-bold block">{t("recycledKgTotal")}</span>
              <span className="text-2xl font-black text-[#203128]">42.0 kg</span>
            </div>
          </div>
        </div>

        {/* Traceable Journey Search & Live Lot View */}
        <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                {t("transparentTraceability")}
              </span>
              <h3 className="text-xl font-black text-[#244936] mt-1">{t("trackLot")}</h3>
            </div>

            {/* Search Lot Bar */}
            <form onSubmit={handleSearchLot} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t("enterLotIdPlaceholder")}
                value={lotSearchQuery}
                onChange={(e) => setLotSearchQuery(e.target.value)}
                className="text-xs font-bold bg-[#FAF8F2] border border-[#3F7655]/20 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#3F7655]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl transition cursor-pointer"
              >
                {t("searchBtn")}
              </button>
            </form>
          </div>

          {/* Render Active Searched Lot */}
          {searchedLot && (
            <div className="bg-[#FAF8F2] rounded-2xl p-5 border border-[#3F7655]/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3F7655] text-white flex items-center justify-center font-black">
                    EL
                  </div>
                  <div>
                    <h4 className="font-black text-base text-[#244936]">{searchedLot.id}</h4>
                    <span className="text-xs text-[#718078]">{searchedLot.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => onViewLotDetails(searchedLot)}
                  className="px-4 py-2 text-xs font-bold text-[#244936] bg-[#DDEBD8] hover:bg-[#c9e0c1] rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-[#3F7655]" />
                  <span>{t("viewDigitalLotQR")}</span>
                </button>
              </div>

              {/* Step indicator */}
              <div className="bg-white p-4 rounded-xl border border-[#3F7655]/15 flex items-center justify-between text-xs overflow-x-auto gap-2">
                <span className="font-bold text-[#3F7655]">✓ 1. {t("timelineCollected")}</span>
                <span className="text-[#3F7655]/30">→</span>
                <span className="font-bold text-[#3F7655]">✓ 2. {t("timelineClassified")}</span>
                <span className="text-[#3F7655]/30">→</span>
                <span className="font-bold text-[#3F7655]">✓ 3. {t("timelineValued")}</span>
                <span className="text-[#3F7655]/30">→</span>
                <span className="font-bold text-[#3F7655]">✓ 4. {t("timelineSelected")}</span>
                <span className="text-[#3F7655]/30">→</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">● 5. {t("timelineHandoverPending")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Collection History Table */}
        <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-black text-[#244936]">{t("collectionHistory")} & {t("digitalReceipt")}</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                <tr>
                  <th className="p-3">{t("disposalId")}</th>
                  <th className="p-3">{t("deviceItem")}</th>
                  <th className="p-3 text-right">{t("totalWeight")}</th>
                  <th className="p-3 text-right">{t("pointsCol")}</th>
                  <th className="p-3">{t("assignedCollector")}</th>
                  <th className="p-3">{t("status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3F7655]/10">
                {disposals.map((disp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-700">{disp.id}</td>
                    <td className="p-3 font-bold text-slate-900">{disp.deviceType}</td>
                    <td className="p-3 text-right font-semibold">{disp.weightKg} kg</td>
                    <td className="p-3 text-right font-black text-[#3F7655]">+{disp.pointsAwarded} pts</td>
                    <td className="p-3 text-slate-600">{disp.collectorAssigned}</td>
                    <td className="p-3">
                      <span className="text-[11px] font-bold bg-[#DDEBD8] text-[#244936] px-2 py-0.5 rounded-full">
                        {tStatus(disp.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
