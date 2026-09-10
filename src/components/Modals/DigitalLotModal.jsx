import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, Clock, ShieldCheck, Scale, FileText, ArrowRight, Award, MapPin } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function DigitalLotModal({ isOpen, onClose, lot, onUpdateLotStatus }) {
  const { t } = useTranslation();
  const [isHandoverSuccess, setIsHandoverSuccess] = useState(false);

  if (!isOpen || !lot) return null;

  const timelineSteps = [
    { key: "Collected", label: t("timelineCollected") },
    { key: "Classified", label: t("timelineClassified") },
    { key: "Valued", label: t("timelineValued") },
    { key: "Recycler Selected", label: t("timelineSelected") },
    { key: "Handover Pending", label: t("timelineHandoverPending") },
    { key: "Recycler Received", label: t("timelineReceived") },
    { key: "Recycling Completed", label: t("timelineCompleted") }
  ];

  const handleConfirmHandover = () => {
    if (onUpdateLotStatus) {
      onUpdateLotStatus(lot.id, "Recycler Received", 6);
    }
    setIsHandoverSuccess(true);
    setTimeout(() => {
      setIsHandoverSuccess(false);
    }, 4000);
  };

  const handleCompleteRecycling = () => {
    if (onUpdateLotStatus) {
      onUpdateLotStatus(lot.id, "Recycling Completed", 7);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F2] rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#3F7655]/30 space-y-6 my-auto text-[#203128]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black shadow-md">
              EL
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                DIGITAL MATERIAL LOT
              </span>
              <h3 className="text-xl font-black tracking-tight text-[#244936] mt-0.5">
                {lot.id}
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

        {/* Handover Success Alert */}
        {isHandoverSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h5 className="font-bold text-sm">{t("handoverVerified")}</h5>
              <p className="text-xs text-emerald-800">Physical QR code scanned and verified. Lot moved to Recycler Intake status.</p>
            </div>
          </div>
        )}

        {/* QR Code & Signature Box */}
        <div className="bg-white rounded-2xl p-5 border border-[#3F7655]/20 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="bg-[#F8F5EA] p-3 rounded-2xl border border-[#3F7655]/20 flex flex-col items-center shrink-0">
            {/* Simulated Clean SVG QR Code */}
            <svg viewBox="0 0 100 100" className="w-28 h-28 text-[#244936]">
              <rect width="100" height="100" fill="#FAF8F2" rx="8" />
              <rect x="10" y="10" width="28" height="28" fill="#244936" rx="4" />
              <rect x="15" y="15" width="18" height="18" fill="#FAF8F2" />
              <rect x="19" y="19" width="10" height="10" fill="#244936" />
              
              <rect x="62" y="10" width="28" height="28" fill="#244936" rx="4" />
              <rect x="67" y="15" width="18" height="18" fill="#FAF8F2" />
              <rect x="71" y="19" width="10" height="10" fill="#244936" />
              
              <rect x="10" y="62" width="28" height="28" fill="#244936" rx="4" />
              <rect x="15" y="67" width="18" height="18" fill="#FAF8F2" />
              <rect x="19" y="71" width="10" height="10" fill="#244936" />
              
              <circle cx="50" cy="50" r="8" fill="#3F7655" />
              <rect x="45" y="15" width="10" height="15" fill="#244936" />
              <rect x="45" y="70" width="10" height="15" fill="#244936" />
              <rect x="65" y="45" width="20" height="10" fill="#244936" />
              <rect x="15" y="45" width="20" height="10" fill="#244936" />
            </svg>
            <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Scan at Handover
            </span>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-[#3F7655] bg-[#DDEBD8] px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {lot.cpcbRegistrationNo}
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {lot.location}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#F8F5EA] p-2.5 rounded-xl border border-[#3F7655]/15">
                <span className="text-[11px] text-[#718078] font-bold block">Total Weight</span>
                <span className="text-lg font-black text-[#244936]">{lot.totalWeightKg} kg</span>
              </div>
              <div className="bg-[#F8F5EA] p-2.5 rounded-xl border border-[#3F7655]/15">
                <span className="text-[11px] text-[#718078] font-bold block">{t("estimatedLotValue")}</span>
                <span className="text-lg font-black text-[#3F7655]">₹{lot.estimatedLotValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 pt-1 space-y-0.5">
              <div><strong>Collector:</strong> {lot.collectorName} ({lot.collectorPhone})</div>
              <div><strong>Recycler:</strong> {lot.recyclerName}</div>
            </div>
          </div>
        </div>

        {/* Material Items Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Declared Materials & Reference Calculation
          </h4>
          <div className="bg-white rounded-2xl border border-[#3F7655]/15 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                <tr>
                  <th className="p-3">Material</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Ref Rate</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3F7655]/10">
                {lot.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-800">{item.name}</td>
                    <td className="p-3 text-right font-bold text-slate-700">{item.weightKg} kg</td>
                    <td className="p-3 text-right text-slate-600">₹{item.referencePrice}/kg</td>
                    <td className="p-3 text-right font-black text-[#3F7655]">₹{item.subtotal || (item.weightKg * item.referencePrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#FAF8F2] font-black border-t border-[#3F7655]/20 text-slate-900">
                <tr>
                  <td className="p-3">Total / Average Rate</td>
                  <td className="p-3 text-right">{lot.totalWeightKg} kg</td>
                  <td className="p-3 text-right">₹{lot.averageReferenceRate}/kg avg</td>
                  <td className="p-3 text-right text-base text-[#244936]">₹{lot.estimatedLotValue}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 7-Step Traceable Timeline */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Material Journey Timeline
          </h4>
          <div className="bg-white rounded-2xl p-4 border border-[#3F7655]/15">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 overflow-x-auto pb-2">
              {timelineSteps.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < lot.timelineStep || (stepNum === 7 && lot.timelineStep === 7);
                const isCurrent = stepNum === lot.timelineStep && lot.timelineStep !== 7;

                return (
                  <div key={idx} className="flex items-center gap-2 shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted 
                        ? 'bg-[#3F7655] text-white shadow-sm' 
                        : isCurrent 
                          ? 'bg-[#F2C94C] text-[#244936] ring-4 ring-[#F2C94C]/30 font-black animate-pulse' 
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}>
                      {isCompleted ? '✓' : stepNum}
                    </div>
                    <span className={`text-[11px] font-bold ${
                      isCompleted ? 'text-[#3F7655]' : isCurrent ? 'text-[#244936] font-black' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                    {idx < timelineSteps.length - 1 && (
                      <div className="hidden sm:block w-4 h-0.5 bg-[#3F7655]/20" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recovery Proof Evidence if completed */}
        {lot.timelineStep >= 6 && lot.proof && (
          <div className="bg-[#DDEBD8]/40 rounded-2xl p-4 border border-[#3F7655]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#244936]">
              <Award className="w-4 h-4 text-[#3F7655]" />
              <span>Certified Recovered Material Yield</span>
              <span className="ml-auto font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#3F7655]/20">{lot.proof.certificateId}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block">Gold Recovered</span>
                <span className="text-sm font-black text-amber-600">{lot.proof.recoveredGoldGrams || "0.85 g"}</span>
              </div>
              <div className="bg-white p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block">Copper Recovered</span>
                <span className="text-sm font-black text-rose-600">{lot.proof.recoveredCopperKg || "1.4 kg"}</span>
              </div>
              <div className="bg-white p-2 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block">Aluminum</span>
                <span className="text-sm font-black text-slate-700">{lot.proof.recoveredAluminumKg || "2.1 kg"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {lot.timelineStep === 5 && (
            <button
              onClick={handleConfirmHandover}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-[#3F7655] hover:bg-[#244936] text-white shadow-md transition flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{t("confirmHandover")} (Simulate QR Scan)</span>
            </button>
          )}

          {lot.timelineStep === 6 && (
            <button
              onClick={handleCompleteRecycling}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-[#244936] hover:bg-[#14291E] text-white shadow-md transition flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>{t("issueCertificate")}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 rounded-xl text-sm font-bold bg-white border border-[#3F7655]/20 text-slate-700 hover:bg-slate-100 transition"
          >
            {t("close")}
          </button>
        </div>

      </div>
    </div>
  );
}
