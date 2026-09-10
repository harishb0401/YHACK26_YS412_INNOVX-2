import React, { useState } from 'react';
import { 
  Search, Truck, ShieldCheck, CheckCircle2, Clock, MapPin, Weight, 
  Award, Building2, Factory, Calendar, FileText, ArrowRight, Check 
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useTranslation, useLanguage } from '../i18n';

export default function TrackingView({ ewasteList, initialTrackingId = "EW-2026-001245" }) {
  const { t } = useTranslation();
  const { tCategory, tStatus } = useLanguage();

  const [searchInput, setSearchInput] = useState(initialTrackingId);
  const [activeItem, setActiveItem] = useState(() => {
    return ewasteList.find(item => item.id.toUpperCase() === initialTrackingId.toUpperCase()) || ewasteList[0];
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const found = ewasteList.find(item => item.id.toUpperCase() === searchInput.trim().toUpperCase());
    if (found) {
      setActiveItem(found);
    } else {
      alert(`Tracking ID "${searchInput}" not found. Try one of the sample tracking IDs: EW-2026-001245 or EW-2026-001246.`);
    }
  };

  const sampleIds = ["EW-2026-001245", "EW-2026-001246", "EW-2026-001247", "EW-2026-001248"];

  const stepsList = [
    "Waste Registered",
    "Recycler Assigned",
    "Pickup Scheduled",
    "In Transit",
    "Recycler Received",
    "Processing",
    "Recycling Completed"
  ];

  // Helper to determine step status
  const getStepStatus = (stepName) => {
    if (!activeItem) return "pending";
    const foundStep = activeItem.timeline.find(t => t.step === stepName);
    return foundStep ? foundStep.status : "pending";
  };

  const getStepNote = (stepName) => {
    if (!activeItem) return "";
    const foundStep = activeItem.timeline.find(t => t.step === stepName);
    return foundStep ? foundStep.note : "";
  };

  const getStepDate = (stepName) => {
    if (!activeItem) return "";
    const foundStep = activeItem.timeline.find(t => t.step === stepName);
    return foundStep ? foundStep.date : "";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Tracking Header & Search Box */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase border border-emerald-200">
            <Truck className="w-4 h-4 text-emerald-600" /> {t("liveTrackingPortal")}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("trackManifestJourney")}
          </h1>

          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {t("trackManifestSubtitle")}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("enterTrackingIdPlaceholder")}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-12 pr-4 py-3.5 text-base font-mono font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>{t("trackNow")}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Click Sample IDs */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2">
            <span className="font-semibold text-slate-600">{t("sampleTrackingCodes")}:</span>
            {sampleIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setSearchInput(id);
                  const found = ewasteList.find(item => item.id === id);
                  if (found) setActiveItem(found);
                }}
                className={`px-3 py-1 rounded-lg border font-mono font-bold transition ${
                  activeItem?.id === id 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Results Manifest Overview */}
        {activeItem && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Manifest Specs & Parties */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Manifest Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">{t("manifestId")}</span>
                    <h3 className="text-xl font-black font-mono text-emerald-700">{activeItem.id}</h3>
                  </div>
                  <StatusBadge status={activeItem.status} />
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t("wasteItemDesc")}</span>
                    <p className="text-base font-bold text-slate-900">{activeItem.wasteType}</p>
                    <span className="inline-block text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded mt-1">
                      {tCategory(activeItem.category)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block font-medium">{t("weight")}</span>
                      <span className="text-sm font-bold text-slate-900">{activeItem.weight} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">{t("quantityUnits")}</span>
                      <span className="text-sm font-bold text-slate-900">{activeItem.quantity} units</span>
                    </div>
                  </div>

                  <div className="pt-2 text-xs border-t border-slate-100">
                    <span className="text-slate-400 block font-medium">{t("pickupAddressLocation")}</span>
                    <p className="text-xs font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {activeItem.pickupLocation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Parties Details */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  {t("verifiedStakeholders")}
                </h4>

                {/* Collector Info */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">{t("verifiedCollector")}</span>
                    <h5 className="text-xs font-bold text-slate-900">{activeItem.collector?.name || "Apex Logistics"}</h5>
                    <p className="text-[11px] text-slate-500 font-mono">ID: {activeItem.collector?.id || "COL-8821"}</p>
                  </div>
                </div>

                {/* Recycler Info */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-teal-50/70 border border-teal-100">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-700">{t("assignedRecycler")}</span>
                    <h5 className="text-xs font-bold text-slate-900">
                      {activeItem.recycler?.name || "GreenMat Eco-Processing Center"}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-mono">{t("facilityId")}: {activeItem.recycler?.id || "REC-401"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                  <div>
                    <span className="text-slate-400 block">{t("pickupDate")}</span>
                    <span className="font-semibold text-slate-800">{activeItem.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t("expectedProcessing")}</span>
                    <span className="font-semibold text-slate-800">{activeItem.expectedCompletion}</span>
                  </div>
                </div>
              </div>

              {/* Proof Certificate Card (if available) */}
              {activeItem.proof && (
                <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-3xl shadow-xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Award className="w-4 h-4" /> {t("officialRecyclingProof")}
                  </div>
                  <h4 className="text-base font-bold text-white">Certificate #{activeItem.proof.certificateId}</h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-emerald-100 pt-2 border-t border-emerald-800">
                    <div>
                      <span className="text-slate-400 block">{t("goldRecovered")}</span>
                      <span className="font-bold text-white">{activeItem.proof.recoveredGoldGrams}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{t("copperRecovered")}</span>
                      <span className="font-bold text-white">{activeItem.proof.recoveredCopperKg}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Required Vertical Timeline */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{t("endToEndTimeline")}</h3>
                  <p className="text-xs text-slate-500">{t("verifiedMilestones")}</p>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  {t("immutableLog")}
                </span>
              </div>

              {/* Vertical Timeline List */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {stepsList.map((stepName, index) => {
                  const status = getStepStatus(stepName);
                  const note = getStepNote(stepName);
                  const date = getStepDate(stepName);

                  const isCompleted = status === "completed";
                  const isActive = status === "active";

                  return (
                    <div key={index} className="relative flex items-start gap-4 group">
                      
                      {/* Timeline Dot */}
                      <div className={`absolute -left-6 top-1 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCompleted 
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' 
                          : isActive 
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse' 
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                      </div>

                      {/* Content Box */}
                      <div className="flex-1 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 group-hover:border-emerald-200 transition">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold ${isCompleted ? 'text-slate-900' : isActive ? 'text-blue-700 font-extrabold' : 'text-slate-400'}`}>
                            {tStatus(stepName)} {isCompleted && '✓'}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400">
                            {date}
                          </span>
                        </div>

                        {note && (
                          <p className="text-xs text-slate-600 mt-1 font-medium">
                            {note}
                          </p>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

