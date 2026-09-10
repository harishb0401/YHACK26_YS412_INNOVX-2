import React from 'react';
import { Leaf, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function Footer({ setActiveView }) {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#244936] text-white pt-16 pb-12 border-t border-[#3F7655]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('landing')}>
              <div className="w-10 h-10 rounded-2xl bg-[#F2C94C] flex items-center justify-center text-[#244936] font-black text-xl shadow-md">
                ♻
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                ECO-<span className="text-[#F2C94C]">Link</span>
              </span>
            </div>
            
            <p className="text-[#DDEBD8] text-sm max-w-sm leading-relaxed">
              {t("platformSubtitle")}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#F2C94C] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#F2C94C]" />
              <span>{t("cpcbVerified")} · EPR Traceability Layer</span>
            </div>
          </div>

          {/* Column 2: Portals */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-extrabold tracking-wider uppercase text-xs">Portals</h4>
            <ul className="space-y-2 text-[#DDEBD8]">
              <li>
                <button onClick={() => setActiveView('collector')} className="hover:text-[#F2C94C] transition cursor-pointer">
                  {t("navCollector")}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('recycler')} className="hover:text-[#F2C94C] transition cursor-pointer">
                  {t("navRecycler")}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('generator')} className="hover:text-[#F2C94C] transition cursor-pointer">
                  {t("navGenerator")}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('admin')} className="hover:text-[#F2C94C] transition cursor-pointer">
                  {t("navAdmin")}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-extrabold tracking-wider uppercase text-xs">Resources</h4>
            <ul className="space-y-2 text-[#DDEBD8]">
              <li>
                <button onClick={() => setActiveView('guide')} className="hover:text-[#F2C94C] transition cursor-pointer">
                  {t("navGuide")}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('locations')} className="hover:text-[#F2C94C] transition cursor-pointer">
                  {t("navLocations")}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('landing')} className="hover:text-[#F2C94C] transition cursor-pointer">
                  {t("navHowItWorks")}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Standards & Compliance */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-extrabold tracking-wider uppercase text-xs">Compliance</h4>
            <ul className="space-y-2 text-[#DDEBD8] text-xs">
              <li>CPCB / EPR Guideline Aligned</li>
              <li>Deterministic Rule Engine</li>
              <li>Digital Material Lots (QR)</li>
              <li>Tamil Nadu SIDCO Nodes</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DDEBD8]/70">
          <p>© {new Date().getFullYear()} ECO-Link Platform. All rights reserved.</p>
          <div className="text-[11px] text-[#DDEBD8]/60 max-w-md text-center sm:text-right">
            {t("verificationDisclaimer")}
          </div>
        </div>

      </div>
    </footer>
  );
}
