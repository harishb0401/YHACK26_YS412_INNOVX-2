import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, ArrowRight, Upload } from 'lucide-react';
import { categoriesList, verifiedRecyclersList, evaluateRecyclerMatch } from '../../mockData';
import { useTranslation, useLanguage } from '../../i18n';

export default function AddWasteModal({ isOpen, onClose, onAddEwaste }) {
  const { t } = useTranslation();
  const { tCategory } = useLanguage();

  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    wasteType: 'Enterprise Workstations & Monitors',
    category: 'IT & Telecommunications',
    quantity: 20,
    weight: 250,
    pickupLocation: 'Market Street Corporate Tower, San Francisco, CA',
    condition: 'Good - Operational Legacy Hardware',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop'
  });

  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  // Live Rule Matching evaluation pre-check
  const simulatedWaste = {
    category: formData.category,
    weight: Number(formData.weight),
    distanceKm: 15
  };

  const matchedRecyclers = verifiedRecyclersList.filter(rec => {
    const res = evaluateRecyclerMatch(simulatedWaste, rec);
    return res.isEligible;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `EW-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newRecord = {
      id: newId,
      wasteType: formData.wasteType,
      category: formData.category,
      quantity: Number(formData.quantity),
      weight: Number(formData.weight),
      pickupLocation: formData.pickupLocation,
      distanceKm: 15,
      images: [formData.imageUrl],
      condition: formData.condition,
      collector: {
        name: "Apex Logistics & Tech Solutions",
        id: "COL-8821",
        rating: 4.9,
        verified: true
      },
      recycler: matchedRecyclers.length > 0 ? {
        id: matchedRecyclers[0].id,
        name: matchedRecyclers[0].companyName,
        location: matchedRecyclers[0].location,
        verified: true
      } : null,
      status: matchedRecyclers.length > 0 ? "Matched" : "Pending",
      date: new Date().toISOString().split('T')[0],
      expectedCompletion: "2026-09-18",
      timeline: [
        { step: "Waste Registered", date: new Date().toLocaleString(), status: "completed", note: "Manifest submitted by Collector" },
        { step: "Recycler Assigned", date: matchedRecyclers.length > 0 ? new Date().toLocaleString() : "Pending", status: matchedRecyclers.length > 0 ? "active" : "pending", note: matchedRecyclers.length > 0 ? `Matched with ${matchedRecyclers[0].companyName}` : "Evaluating rule criteria" },
        { step: "Pickup Scheduled", date: "Pending", status: "pending", note: "-" },
        { step: "In Transit", date: "Pending", status: "pending", note: "-" },
        { step: "Recycler Received", date: "Pending", status: "pending", note: "-" },
        { step: "Processing", date: "Pending", status: "pending", note: "-" },
        { step: "Recycling Completed", date: "Pending", status: "pending", note: "-" }
      ]
    };

    onAddEwaste(newRecord);
    setGeneratedId(newId);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t("addNewManifest")}</h3>
              <p className="text-xs text-slate-400">{t("logWasteSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <h4 className="text-2xl font-black text-slate-900">{t("wasteRegisteredSuccess")}</h4>
              
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                {t("wasteManifestEvaluated")}
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto font-mono text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t("trackingId")}:</span>
                  <span className="font-bold text-emerald-600">{generatedId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{t("ruleMatchResult")}:</span>
                  <span className="font-semibold text-slate-900">
                    {matchedRecyclers.length > 0 ? `${matchedRecyclers[0].companyName} ${t("assigned")}` : t("pendingMatch")}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition text-sm cursor-pointer"
                >
                  {t("doneViewDashboard")}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Waste Type & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t("wasteItemDesc")}</label>
                  <input
                    type="text"
                    required
                    value={formData.wasteType}
                    onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none"
                    placeholder={t("wasteItemPlaceholder")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t("wasteCategory")}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none"
                  >
                    {categoriesList.map((cat, i) => (
                      <option key={i} value={cat}>{tCategory(cat)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Quantity & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t("quantityUnits")}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t("estimatedTotalWeight")}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Pickup Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t("pickupAddressLocation")}</label>
                <input
                  type="text"
                  required
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none"
                  placeholder={t("pickupAddressPlaceholder")}
                />
              </div>

              {/* Row 4: Condition */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t("conditionSpecialHandling")}</label>
                <input
                  type="text"
                  required
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:border-emerald-500 focus:outline-none"
                  placeholder={t("conditionPlaceholder")}
                />
              </div>

              {/* Live Rule Matching Indicator Inside Form */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-950">{t("liveRuleEval")}</h5>
                    <p className="text-[11px] text-emerald-700">
                      {matchedRecyclers.length > 0 
                        ? t("matchedRecyclersCount", { count: matchedRecyclers.length })
                        : t("noRecyclerMatches")}
                    </p>
                  </div>
                </div>
                {matchedRecyclers.length > 0 && (
                  <span className="text-[11px] font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-md shrink-0">
                    {t("autoMatchReady")}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
                >
                  <span>{t("submitWasteManifest")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}

