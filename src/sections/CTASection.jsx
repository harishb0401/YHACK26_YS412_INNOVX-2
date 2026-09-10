import React from 'react';
import { ArrowRight, Building2, Factory, ShieldCheck, Leaf } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function CTASection({ setActiveView, onOpenAddWasteModal }) {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/60 text-emerald-300 text-xs font-extrabold tracking-wider uppercase mb-6 border border-emerald-700/50">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span>{t("joinCircularPlatform")}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          {t("buildCleanerFuture")}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed">
          {t("buildCleanerFutureDesc")}
        </p>

        {/* Dual Onboarding Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
          <button
            onClick={() => {
              setActiveView('collector');
              if (onOpenAddWasteModal) onOpenAddWasteModal();
            }}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group cursor-pointer"
          >
            <Building2 className="w-5 h-5 text-slate-900" />
            <span>{t("joinAsCollector")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveView('recycler')}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl shadow-md transition-all flex items-center justify-center gap-3 group cursor-pointer"
          >
            <Factory className="w-5 h-5 text-emerald-400" />
            <span>{t("joinAsRecycler")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t("r2v3Compliant")}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t("transparentAuditTrail")}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t("verifiedFacilitiesOnly")}
          </span>
        </div>

      </div>
    </section>
  );
}

