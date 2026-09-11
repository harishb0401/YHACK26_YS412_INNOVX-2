import React, { useState } from 'react';
import { X, DollarSign, ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, Calendar, Calculator, MapPin, Scale } from 'lucide-react';
import { evaluateOfferFairPrice } from '../../utils/rulesEngine';
import { useTranslation, useLanguage } from '../../i18n';

export default function SubmitOfferModal({ 
  isOpen, 
  onClose, 
  lot, 
  currentRecycler,
  onSubmitOffer 
}) {
  const { t } = useTranslation();
  const { tCategory, tCondition } = useLanguage();

  const [pricePerUnit, setPricePerUnit] = useState(() => lot ? lot.benchmarkPrice : 650);
  const [proposedPickupDate, setProposedPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState("Direct intake at licensed facility with certified weight bridge.");

  if (!isOpen || !lot) return null;

  const numericPrice = parseFloat(pricePerUnit) || 0;
  const quantity = parseFloat(lot.quantity) || 1;
  const totalOfferedPrice = Math.round(numericPrice * quantity);

  // Evaluate against fair price limits
  const evaluation = evaluateOfferFairPrice(numericPrice, lot.benchmarkPrice, lot.tolerance || 0.25);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOffer = {
      id: `OFF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      lotId: lot.id,
      recyclerId: currentRecycler?.id || "REC-TN-01",
      recyclerName: currentRecycler?.companyName || "GreenCycle Material Recovery Ltd",
      recyclerVerified: true,
      pricePerUnit: numericPrice,
      totalPrice: totalOfferedPrice,
      fairPriceStatus: evaluation.status,
      fairPriceBadge: evaluation.label,
      status: evaluation.isFlagged ? "FLAGGED" : "PENDING",
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
                 new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      proposedPickupDate,
      location: currentRecycler?.location || "Chennai - Ambattur Industrial Estate",
      distanceKm: 8.5,
      notes
    };

    if (onSubmitOffer) {
      onSubmitOffer(newOffer);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F2] rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#3F7655]/30 space-y-6 my-auto text-[#203128]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                {t("recyclerBiddingWorkflow")}
              </span>
              <h3 className="text-xl font-black text-[#244936] mt-0.5">
                {t("submitOffer")}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lot Details Summary Card */}
        <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-slate-500">{lot.id}</span>
              <h4 className="text-sm font-black text-[#203128]">{tCategory(lot.category)} - {lot.material}</h4>
            </div>
            <span className="text-xs font-black text-[#244936] bg-[#DDEBD8] px-2.5 py-1 rounded-full">
              {lot.quantity} {lot.unit || 'kg'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#FAF8F2] p-2.5 rounded-xl border border-[#3F7655]/10 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">{t("conditionLabel")}</span>
              <span className="font-extrabold text-slate-800">{tCondition(lot.condition)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">{t("benchmarkPriceLabel")}</span>
              <span className="font-black text-[#203128]">₹{lot.benchmarkPrice}/kg</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-bold">{t("fairPriceRangeLabel")}</span>
              <span className="font-black text-[#3F7655]">₹{lot.lowerLimit}–₹{lot.upperLimit}/kg</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Price per unit & calculated total */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1">
                {t("offerPricePerUnit")}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  className="w-full pl-7 pr-3 py-2.5 text-xs font-black bg-white border border-[#3F7655]/20 rounded-xl focus:outline-none focus:border-[#3F7655]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1">
                {t("totalOfferedPrice")} ({lot.quantity} {lot.unit})
              </label>
              <div className="px-3.5 py-2.5 bg-[#FAF8F2] border border-[#3F7655]/20 rounded-xl text-sm font-black text-[#244936] flex items-center justify-between">
                <span>₹{totalOfferedPrice.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-slate-500">({lot.quantity} × ₹{numericPrice})</span>
              </div>
            </div>
          </div>

          {/* Live Fair Price Comparison Result */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold ${evaluation.badgeClass}`}>
            <div className="flex items-center gap-2">
              {evaluation.isFlagged ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{evaluation.message}</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white border border-current text-[11px] font-black shrink-0">
              {evaluation.label}
            </span>
          </div>

          {/* Proposed Pickup Date & Notes */}
          <div>
            <label className="block text-xs font-extrabold text-[#203128] mb-1">
              {t("proposedPickupDate")}
            </label>
            <input
              type="date"
              value={proposedPickupDate}
              onChange={(e) => setProposedPickupDate(e.target.value)}
              className="w-full text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#3F7655]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#203128] mb-1">
              {t("offerNotes")}
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("offerNotesPlaceholder")}
              className="w-full text-xs font-medium bg-white border border-[#3F7655]/20 rounded-xl p-3 focus:outline-none focus:border-[#3F7655]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#3F7655]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>{t("submitOffer")}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
