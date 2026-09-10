import React, { useState } from 'react';
import { X, Search, CheckCircle2, AlertTriangle, ArrowRight, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { searchableMaterials } from '../../mockData';
import { useTranslation, useLanguage } from '../../i18n';

export default function CanIRecycleModal({ isOpen, onClose, setActiveView }) {
  const { t } = useTranslation();
  const { tCategory } = useLanguage();

  if (!isOpen) return null;

  const [query, setQuery] = useState('pizza box');
  const [result, setResult] = useState(searchableMaterials[0]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchTerm = query.trim().toLowerCase();
    const found = searchableMaterials.find(m => 
      m.keywords.some(k => k.includes(searchTerm) || searchTerm.includes(k)) ||
      m.item.toLowerCase().includes(searchTerm)
    );

    if (found) {
      setResult(found);
    } else {
      // Fallback generic result
      setResult({
        item: query,
        isRecyclable: true,
        category: "General Household Recyclable",
        icon: "📦",
        prep: "Ensure item is clean, dry, and free of food or chemical residue before placing in bin.",
        badge: "Check Local Guidelines 📄"
      });
    }
  };

  const popularChips = ["pizza box", "plastic bottle", "bubble wrap", "aluminum can", "battery", "glass bottle"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#203128]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#F8F5EA] rounded-[28px] max-w-xl w-full shadow-2xl border border-[#3F7655]/20 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#3F7655] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F2C94C] text-[#244936] flex items-center justify-center font-bold text-xl">
              ♻
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t("searchModalTitle")}</h3>
              <p className="text-xs text-[#DDEBD8]">{t("searchModalSub")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#DDEBD8] hover:text-white hover:bg-[#244936] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Container */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="text-center space-y-1">
              <h4 className="text-base font-bold text-[#203128]">{t("tellUsWhatYouAreThrowing")}</h4>
              <p className="text-xs text-[#718078]">{t("searchAnyItemAdvice")}</p>
            </div>

            <div className="relative">
              <Search className="w-5 h-5 text-[#3F7655] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchModalInputPlaceholder")}
                className="w-full bg-white border border-[#3F7655]/25 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-[#203128] focus:border-[#3F7655] focus:outline-none shadow-sm"
              />
            </div>

            {/* Quick popular chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#718078]">{t("popular")}:</span>
              {popularChips.map((chip, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setQuery(chip);
                    const found = searchableMaterials.find(m => m.keywords.includes(chip));
                    if (found) setResult(found);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white border border-[#3F7655]/15 text-[#244936] hover:bg-[#DDEBD8] transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#3F7655] hover:bg-[#244936] text-white font-bold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t("checkItemStatus")}</span>
            </button>
          </form>

          {/* Result Card Display */}
          {result && (
            <div className="p-6 rounded-2xl bg-white border border-[#3F7655]/20 shadow-sm space-y-4">
              
              {/* Verdict Header */}
              <div className="flex items-center justify-between border-b border-[#3F7655]/10 pb-3">
                <div className="flex items-center gap-2">
                  {result.isRecyclable ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#DDEBD8] text-[#244936]">
                      <CheckCircle2 className="w-4 h-4 text-[#3F7655]" /> {t("yesRecyclable")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> {t("specialDisposalRequired")}
                    </span>
                  )}
                </div>
                <span className="text-xl">{result.icon || '📦'}</span>
              </div>

              {/* Item Title & Category */}
              <div>
                <h4 className="text-lg font-extrabold text-[#203128]">{result.item}</h4>
                <span className="inline-block text-xs font-semibold text-[#3F7655] bg-[#DDEBD8]/50 px-2.5 py-0.5 rounded-md mt-1">
                  ♻ {tCategory(result.badge || result.category)}
                </span>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-xl bg-[#F8F5EA] text-xs text-[#203128] space-y-1 font-medium border border-[#3F7655]/10 whitespace-pre-line">
                <span className="font-bold text-[#244936] block">{t("howToPrepare")}</span>
                {result.prep}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setActiveView('locations');
                    onClose();
                  }}
                  className="px-4 py-2 bg-[#3F7655] hover:bg-[#244936] text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t("findNearbyLocation")}</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

