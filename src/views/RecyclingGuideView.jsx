import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, MapPin, ArrowRight, BookOpen, ShieldAlert, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n';
import { recyclingCategories } from '../mockData';

export default function RecyclingGuideView({ setActiveView, onOpenSearchModal }) {
  const { t, tCategory } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(recyclingCategories[0].id);
  const [guideSearch, setGuideSearch] = useState('');

  const selectedCat = recyclingCategories.find(c => c.id === activeCategory) || recyclingCategories[0];

  const filteredCategories = recyclingCategories.filter(cat => {
    return cat.name.toLowerCase().includes(guideSearch.toLowerCase()) ||
           cat.description.toLowerCase().includes(guideSearch.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 text-[#203128]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> {t("guideDirectoryTitle")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#203128] tracking-tight">
            {t("guideMainHeading")}
          </h1>
          <p className="text-base text-[#718078]">
            {t("guideSubHeading")}
          </p>
        </div>

        {/* Search Bar & Category Chips */}
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/15 shadow-sm space-y-5">
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-[#3F7655] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={guideSearch}
              onChange={(e) => setGuideSearch(e.target.value)}
              placeholder={t("searchGuidePlaceholder")}
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs font-bold text-[#718078] mr-1">{t("categoriesLabel")}:</span>
            {recyclingCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id 
                    ? 'bg-[#3F7655] text-white shadow-md' 
                    : 'bg-[#F8F5EA] text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{tCategory(cat.name)}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Material Detail Panel */}
        {selectedCat && (
          <div className="bg-white rounded-[28px] border border-[#3F7655]/20 shadow-md p-6 sm:p-10 space-y-8">
            
            {/* Top Material Title & Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#3F7655]/10 pb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${selectedCat.color} flex items-center justify-center text-3xl shrink-0 shadow-inner`}>
                  {selectedCat.icon}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#203128]">{tCategory(selectedCat.name)}</h2>
                  <p className="text-sm text-[#718078] mt-1">{selectedCat.description}</p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1">
                <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#DDEBD8] text-[#244936] border border-[#3F7655]/20">
                  {selectedCat.status}
                </span>
                <span className="text-xs font-bold text-[#3F7655]">Ref: {selectedCat.referenceRate || "₹300/kg"}</span>
              </div>
            </div>

            {/* 2-Column: HOW TO PREPARE vs DON'T RECYCLE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* HOW TO PREPARE */}
              <div className="space-y-4 bg-[#F8F5EA] p-6 rounded-2xl border border-[#3F7655]/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#244936] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#3F7655]" />
                  {t("howToPrepareHeading")}
                </h3>

                <div className="space-y-3">
                  {selectedCat.prepSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#3F7655]/10">
                      <span className="w-6 h-6 rounded-full bg-[#3F7655] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                        0{sIdx + 1}
                      </span>
                      <p className="text-xs font-semibold text-[#203128] leading-relaxed pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* DON'T RECYCLE */}
              <div className="space-y-4 bg-rose-50/60 p-6 rounded-2xl border border-rose-200/80">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-900 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  {t("dontRecycleHeading")}
                </h3>

                <div className="space-y-3">
                  {selectedCat.dontRecycle.map((dont, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-rose-100">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                        ✕
                      </span>
                      <p className="text-xs font-semibold text-[#203128] leading-relaxed pt-0.5">
                        {dont}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#3F7655]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#718078]">
                {t("instantCheckerDesc")}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenSearchModal}
                  className="px-4 py-2.5 bg-white border border-[#3F7655]/20 text-[#203128] text-xs font-bold rounded-xl hover:bg-[#DDEBD8] transition cursor-pointer"
                >
                  {t("searchEWasteNow")}
                </button>

                <button
                  onClick={() => setActiveView('locations')}
                  className="px-5 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{t("navLocations")} →</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
