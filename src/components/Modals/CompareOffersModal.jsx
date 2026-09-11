import React, { useState } from 'react';
import { 
  X, CheckCircle2, XCircle, ShieldCheck, DollarSign, 
  Clock, MapPin, Calendar, ArrowRight, AlertTriangle, Scale, Award
} from 'lucide-react';
import { useTranslation, useLanguage } from '../../i18n';

export default function CompareOffersModal({ 
  isOpen, 
  onClose, 
  lot, 
  offers = [], 
  onAcceptOffer, 
  onRejectOffer 
}) {
  const { t } = useTranslation();
  const { tCategory, tStatus } = useLanguage();
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  if (!isOpen || !lot) return null;

  const lotOffers = offers.filter(o => o.lotId === lot.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F2] rounded-[32px] max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#3F7655]/30 space-y-6 my-auto text-[#203128] max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                {t('offerComparisonBadge', 'OFFER COMPARISON & SETTLEMENT')}
              </span>
              <h3 className="text-xl font-black text-[#244936] mt-0.5">
                {t("compareOffersTitle")}
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

        {/* Lot Overview Strip */}
        <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-500">{lot.id}</span>
            <h4 className="text-base font-black text-[#244936]">{tCategory(lot.category)} - {lot.material}</h4>
            <span className="text-xs text-slate-600">{lot.quantity} {lot.unit || 'kg'} · {lot.location}</span>
          </div>

          <div className="bg-[#FAF8F2] px-4 py-2 rounded-xl border border-[#3F7655]/15 text-center shrink-0">
            <span className="text-[10px] text-slate-500 font-bold block">{t("fairPriceRangeLabel")}</span>
            <span className="text-sm font-black text-[#3F7655]">₹{lot.lowerLimit}–₹{lot.upperLimit}/kg</span>
          </div>
        </div>

        {/* Offers List / Comparison Cards */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-[#203128] uppercase tracking-wider">
            {t("offersReceived")} ({lotOffers.length})
          </h4>

          {lotOffers.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-[#3F7655]/15 text-center text-slate-500 text-xs font-bold">
              {t('noRecyclerOffersYet', 'No recycler offers received yet for this lot. Recyclers in proximity have been notified.')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lotOffers.map((offer) => {
                const isAccepted = offer.status === 'ACCEPTED';
                const isRejected = offer.status === 'REJECTED';
                const isBelowFair = offer.fairPriceStatus === 'BELOW_FAIR_RANGE';

                return (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-2xl p-5 border transition space-y-4 flex flex-col justify-between ${
                      isAccepted
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : isRejected
                        ? 'border-slate-200 opacity-60'
                        : 'border-[#3F7655]/20 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Recycler Header & Verification */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-black text-sm text-[#203128]">{offer.recyclerName}</h5>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              {t("verifiedRecyclerBadge")}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">{offer.distanceKm} km {t('away', 'away')}</span>
                          </div>
                        </div>

                        {/* Fair Price Badge */}
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                          isBelowFair 
                            ? 'bg-rose-50 text-rose-700 border-rose-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {offer.fairPriceBadge || 'FAIR ✓'}
                        </span>
                      </div>

                      {/* Offer Rates & Totals */}
                      <div className="grid grid-cols-2 gap-2 bg-[#FAF8F2] p-3 rounded-xl border border-[#3F7655]/10 text-center">
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">{t("agreedPrice")}</span>
                          <span className="text-base font-black text-[#244936]">₹{offer.pricePerUnit}/kg</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 font-bold block">{t("totalValue")}</span>
                          <span className="text-base font-black text-[#3F7655]">₹{offer.totalPrice?.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Pickup Date & Notes */}
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#3F7655]" />
                          <span>{t('proposedPickup', 'Proposed Pickup')}: <strong>{offer.proposedPickupDate || 'Within 2 days'}</strong></span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                          "{offer.notes}"
                        </p>
                      </div>

                    </div>

                    {/* Offer Actions */}
                    <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {offer.id} · {offer.timestamp}
                      </span>

                      {isAccepted ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t("offerStatusACCEPTED")}
                        </span>
                      ) : isRejected ? (
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg">
                          {t("offerStatusREJECTED")}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onRejectOffer && onRejectOffer(offer.id)}
                            className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                          >
                            {t("rejectOffer")}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onAcceptOffer) onAcceptOffer(offer, lot);
                              onClose();
                            }}
                            className="px-4 py-1.5 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t("acceptOffer")}</span>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 flex justify-end border-t border-[#3F7655]/15">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            {t("close")}
          </button>
        </div>

      </div>
    </div>
  );
}
