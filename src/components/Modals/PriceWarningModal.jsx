import React from 'react';
import { AlertTriangle, Edit3, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function PriceWarningModal({ 
  isOpen, 
  onClose, 
  warningData, 
  onEditPrice, 
  onContinueAnyway 
}) {
  const { t } = useTranslation();

  if (!isOpen || !warningData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-400 space-y-6 animate-scaleUp">
        
        {/* Header Alert Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 border border-amber-300">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
              {t("priceWarningTitle")}
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              Asking Price Exceeds Reference Range
            </h3>
          </div>
        </div>

        {/* Warning Details Box */}
        <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 space-y-3">
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            {t("priceWarningDesc")}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-xs text-slate-500 block font-semibold">{t("yourAskingPrice")}</span>
              <span className="text-xl font-black text-amber-700">₹{warningData.askingPrice}/kg</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-amber-200">
              <span className="text-xs text-slate-500 block font-semibold">{t("referenceRange")}</span>
              <span className="text-xl font-black text-slate-800">₹{warningData.referenceMin}–₹{warningData.referenceMax}/kg</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold pt-1">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Calculated via Rule-Based Scrap Pricing Engine (+{warningData.percentAbove}% above reference max)</span>
          </div>
        </div>

        {/* Information note */}
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>Rule-based Policy:</strong> You may proceed with this price. The verified recycler will see the asking price marked with a price alert badge for negotiation.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onEditPrice}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-[#DDEBD8] hover:bg-[#c9e0c1] text-[#244936] transition flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>{t("editPrice")}</span>
          </button>
          
          <button
            type="button"
            onClick={onContinueAnyway}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-[#3F7655] hover:bg-[#244936] text-white shadow-md transition flex items-center justify-center gap-2"
          >
            <span>{t("continueAnyway")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
