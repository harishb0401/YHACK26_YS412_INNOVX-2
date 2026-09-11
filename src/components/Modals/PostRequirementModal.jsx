import React, { useState } from 'react';
import { X, Plus, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTranslation, useLanguage } from '../../i18n';
import { ewasteCategoriesList, tamilNaduLocations } from '../../data/scrapPrices';

export default function PostRequirementModal({ 
  isOpen, 
  onClose, 
  onAddRequirement 
}) {
  const { t } = useTranslation();
  const { tCategory } = useLanguage();

  const [category, setCategory] = useState(ewasteCategoriesList[0]);
  const [requiredQuantityKg, setRequiredQuantityKg] = useState(50);
  const [preferredCondition, setPreferredCondition] = useState('Mixed Condition');
  const [targetPricePerKg, setTargetPricePerKg] = useState(300);
  const [location, setLocation] = useState(tamilNaduLocations[0]);
  const [expiresInDays, setExpiresInDays] = useState(4);
  const [notes, setNotes] = useState('Requires complete computer motherboards & telecom components for material extraction.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      recyclerId: "REC-TN-01",
      recyclerName: "GreenCycle Material Recovery Ltd",
      cpcbRegistrationNo: "TN-EPR-2026-8821 (Demo)",
      isCpcbVerified: true,
      isPlatformVerified: true,
      category,
      requiredQuantityKg: parseFloat(requiredQuantityKg),
      currentReceivedKg: 0,
      preferredCondition,
      targetPricePerKg: parseFloat(targetPricePerKg),
      referenceMin: Math.round(targetPricePerKg * 0.9),
      referenceMax: Math.round(targetPricePerKg * 1.1),
      location,
      postedDate: "Today",
      expiresInDays: parseInt(expiresInDays),
      status: "Active",
      notes
    };

    onAddRequirement(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F2] rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#3F7655]/30 space-y-6 my-auto text-[#203128]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black">
              +
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                {t("intakeDemand")}
              </span>
              <h3 className="text-xl font-black text-[#244936] mt-0.5">
                {t("postRequirement")}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CPCB Verified Notice */}
        <div className="bg-[#DDEBD8]/50 rounded-2xl p-3.5 border border-[#3F7655]/20 flex items-center gap-2.5 text-xs text-[#244936]">
          <ShieldCheck className="w-5 h-5 text-[#3F7655] shrink-0" />
          <span>{t("postingAs", { name: "GreenCycle Material Recovery Ltd", reg: "TN-EPR-2026-8821" })}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1">
                {t("materialCategory")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3F7655]"
              >
                {ewasteCategoriesList.map((cat, i) => (
                  <option key={i} value={cat}>{tCategory(cat)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1">
                {t("requiredQuantity")}
              </label>
              <input
                type="number"
                min="5"
                step="5"
                required
                value={requiredQuantityKg}
                onChange={(e) => setRequiredQuantityKg(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3F7655]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1">
                {t("preferredCondition")}
              </label>
              <select
                value={preferredCondition}
                onChange={(e) => setPreferredCondition(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3F7655]"
              >
                <option value="Working / Repairable">{t("conditionWorking")}</option>
                <option value="Non-working / Scrap">{t("conditionNonWorking")}</option>
                <option value="Mixed Condition">{t("conditionMixed")}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1">
                {t("targetPricePerKg")}
              </label>
              <input
                type="number"
                min="50"
                step="10"
                required
                value={targetPricePerKg}
                onChange={(e) => setTargetPricePerKg(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3F7655]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1">
                {t("targetLocation")}
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3F7655]"
              >
                {tamilNaduLocations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1">
                {t("expiryDays")}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3F7655]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#203128] mb-1">
              {t("processingNotes")}
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-white border border-[#3F7655]/20 rounded-xl p-2.5 focus:outline-none focus:border-[#3F7655]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 text-xs font-extrabold bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>{t("postRequirement")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
