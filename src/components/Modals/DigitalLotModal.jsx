import React, { useState } from 'react';
import { 
  X, QrCode, CheckCircle2, Clock, ShieldCheck, Scale, FileText, 
  ArrowRight, Award, MapPin, DollarSign, Truck, AlertTriangle, Layers
} from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { useTranslation, useLanguage } from '../../i18n';

export default function DigitalLotModal({ 
  isOpen, 
  onClose, 
  lot, 
  onUpdateLotStatus 
}) {
  const { t } = useTranslation();
  const { tCategory, tCondition, tStatus } = useLanguage();
  const [activeViewMode, setActiveViewMode] = useState('overview'); // 'overview' | 'timeline'
  const [isHandoverSuccess, setIsHandoverSuccess] = useState(false);

  if (!isOpen || !lot) return null;

  const timelineList = lot.timeline || [
    { id: "1", event: "Phone Verified", timestamp: lot.createdDate, userRole: "Collector", status: "Completed", details: "Phone verified via OTP" },
    { id: "2", event: "Waste Added", timestamp: lot.createdDate, userRole: "Collector", status: "Completed", details: `${lot.quantity} ${lot.unit || 'kg'} declared` },
    { id: "3", event: "Waste Classified", timestamp: lot.createdDate, userRole: "Collector", status: "Completed", details: `Category: ${lot.category}` },
    { id: "4", event: "Digital Lot Created", timestamp: lot.createdDate, userRole: "System", status: "Completed", details: `Lot ID: ${lot.id}` },
    { id: "5", event: "Fair Price Calculated", timestamp: lot.createdDate, userRole: "Rules Engine", status: "Completed", details: `Benchmark: ₹${lot.benchmarkPrice}/kg | Fair: ₹${lot.lowerLimit}–₹${lot.upperLimit}/kg` }
  ];

  const handleConfirmHandover = () => {
    if (onUpdateLotStatus) {
      onUpdateLotStatus(lot.id, "HANDED_OVER");
    }
    setIsHandoverSuccess(true);
    setTimeout(() => {
      setIsHandoverSuccess(false);
    }, 4000);
  };

  const handleCompleteTransaction = () => {
    if (onUpdateLotStatus) {
      onUpdateLotStatus(lot.id, "COMPLETED");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F2] rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#3F7655]/30 space-y-5 my-auto text-[#203128] max-h-[92vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black shadow-md">
              EL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                  {t("digitalMaterialLotBadge")}
                </span>
                <StatusBadge status={lot.status} size="sm" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-[#244936] mt-0.5">
                {lot.id}
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

        {/* View Switcher: Overview vs Traceability Timeline */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-[#3F7655]/15 text-xs font-bold">
          <button
            onClick={() => setActiveViewMode('overview')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeViewMode === 'overview'
                ? 'bg-[#3F7655] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#244936]'
            }`}
          >
            {t("lotOverviewAndQR")}
          </button>

          <button
            onClick={() => setActiveViewMode('timeline')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeViewMode === 'timeline'
                ? 'bg-[#3F7655] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#244936]'
            }`}
          >
            {t("traceabilityTimeline")} ({timelineList.length} Events)
          </button>
        </div>

        {/* Handover Success Alert */}
        {isHandoverSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h5 className="font-bold text-sm">{t("physicalHandoverVerified")}</h5>
              <p className="text-xs text-emerald-800">{t("physicalQrScannedMsg")}</p>
            </div>
          </div>
        )}

        {activeViewMode === 'overview' ? (
          <div className="space-y-4">
            
            {/* QR Code & Signature Box */}
            <div className="bg-white rounded-2xl p-5 border border-[#3F7655]/20 shadow-sm flex flex-col sm:flex-row items-center gap-5">
              <div className="bg-[#FAF8F2] p-3 rounded-2xl border border-[#3F7655]/20 flex flex-col items-center shrink-0">
                {/* SVG QR Code */}
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
                  {t("scanAtHandover")}
                </span>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div>
                  <h4 className="text-base font-black text-[#203128]">{tCategory(lot.category)}</h4>
                  <p className="text-xs text-slate-600 font-semibold">{lot.material}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-[#3F7655]/15">
                    <span className="text-[10px] text-slate-500 font-bold block">{t("quantityLabel")}</span>
                    <span className="text-base font-black text-[#244936]">{lot.quantity} {lot.unit || 'kg'}</span>
                  </div>
                  <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-[#3F7655]/15">
                    <span className="text-[10px] text-slate-500 font-bold block">{t("estimatedLotValueLabel")}</span>
                    <span className="text-base font-black text-[#3F7655]">₹{lot.estimatedLotValue?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 pt-1 space-y-0.5">
                  <div><strong>{t("collector")}:</strong> {lot.collectorName} ({lot.collectorPhone || '+91 98401 23456'})</div>
                  <div><strong>{t("location")}:</strong> {lot.location}</div>
                  {lot.selectedRecyclerName && (
                    <div><strong>{t("assignedRecycler")}:</strong> {lot.selectedRecyclerName}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Fair Pricing & Benchmark Metric Cards */}
            <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#244936] flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-[#3F7655]" />
                  {t("fairPriceRangeDetails")}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-[#FAF8F2] px-2 py-0.5 rounded border">
                  Tolerance: ±{Math.round((lot.tolerance || 0.25) * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-[#FAF8F2] p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block">{t("benchmarkPriceLabel")}</span>
                  <span className="text-sm font-black text-[#203128]">₹{lot.benchmarkPrice}/kg</span>
                </div>

                <div className="bg-[#FAF8F2] p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block">{t("lowerLimitLabel")}</span>
                  <span className="text-sm font-black text-emerald-700">₹{lot.lowerLimit}/kg</span>
                </div>

                <div className="bg-[#FAF8F2] p-2 rounded-xl">
                  <span className="text-[10px] text-slate-500 font-bold block">{t("upperLimitLabel")}</span>
                  <span className="text-sm font-black text-[#3F7655]">₹{lot.upperLimit}/kg</span>
                </div>
              </div>
            </div>

            {/* Agreed Settlement if Accepted */}
            {lot.agreedPricePerUnit && (
              <div className="bg-[#DDEBD8]/50 p-4 rounded-2xl border border-[#3F7655]/20 flex items-center justify-between text-xs font-bold text-[#244936]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#3F7655]" />
                  <div>
                    <span>{t("agreedSettlementRate")}: <strong>₹{lot.agreedPricePerUnit}/kg</strong></span>
                    <span className="block text-[11px] text-[#718078] font-normal">{t("recycler")}: {lot.selectedRecyclerName}</span>
                  </div>
                </div>
                <span className="text-base font-black text-[#244936]">
                  {t("totalValue")}: ₹{lot.agreedTotalValue?.toLocaleString()}
                </span>
              </div>
            )}

            {/* Recovery Proof if completed */}
            {lot.proof && (
              <div className="bg-[#DDEBD8]/40 rounded-2xl p-4 border border-[#3F7655]/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#244936]">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#3F7655]" />
                    {t("certifiedYieldCertificate")}
                  </span>
                  <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-[#3F7655]/20">
                    {lot.proof.certificateId}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-white p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold block">{t("gold")}</span>
                    <span className="text-sm font-black text-amber-600">{lot.proof.recoveredGoldGrams || "0.85 g"}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold block">{t("copper")}</span>
                    <span className="text-sm font-black text-rose-600">{lot.proof.recoveredCopperKg || "1.4 kg"}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-bold block">{t("aluminum")}</span>
                    <span className="text-sm font-black text-slate-700">{lot.proof.recoveredAluminumKg || "2.1 kg"}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* 12-Step Traceability Timeline View */
          <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#3F7655]/20 shadow-sm animate-fadeIn">
            <h4 className="text-xs font-black text-[#203128] uppercase tracking-wider">
              {t("traceabilityTitle")}
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#3F7655]/20">
              {timelineList.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Step Dot */}
                  <div className="w-5 h-5 rounded-full bg-[#3F7655] text-white text-[10px] font-black flex items-center justify-center absolute -left-6 top-0 shadow-sm">
                    ✓
                  </div>

                  <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#3F7655]/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <h5 className="font-extrabold text-[#203128]">{t(item.event, item.event)}</h5>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">{item.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <span className="font-bold text-[#3F7655] bg-[#DDEBD8] px-2 py-0.2 rounded">
                        {t(item.userRole, item.userRole)}
                      </span>
                      <span>{typeof item.details === 'string' ? item.details : JSON.stringify(item.details)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#3F7655]/15">
          {lot.status === 'OFFER_ACCEPTED' || lot.status === 'PICKUP_SCHEDULED' ? (
            <button
              onClick={handleConfirmHandover}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-extrabold bg-[#3F7655] hover:bg-[#244936] text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>{t("confirmHandoverAction")}</span>
            </button>
          ) : lot.status === 'HANDED_OVER' ? (
            <button
              onClick={handleCompleteTransaction}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-extrabold bg-[#244936] hover:bg-[#14291E] text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("recordPaymentBtn")}</span>
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-bold bg-white border border-[#3F7655]/20 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            {t("close")}
          </button>
        </div>

      </div>
    </div>
  );
}
