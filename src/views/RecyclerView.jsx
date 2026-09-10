import React, { useState } from 'react';
import { 
  ShieldCheck, ShoppingBag, Truck, RefreshCw, Award, 
  CheckCircle2, Users, ArrowRight, AlertTriangle, QrCode, Search, Filter, Sparkles,
  DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Eye, ChevronRight, Package,
  FileText, ShieldAlert, Send
} from 'lucide-react';
import { useTranslation } from '../i18n';
import StatusBadge from '../components/StatusBadge';
import { calculateFairPriceRange, matchLotsToRecycler } from '../utils/rulesEngine';

export default function RecyclerView({ 
  recyclerProfile = {
    id: "REC-TN-01",
    companyName: "GreenCycle Material Recovery Ltd",
    cpcbRegistrationNo: "TN-EPR-2026-8821 (Verified CPCB)",
    verificationStatus: "VERIFIED", // PENDING_VERIFICATION, VERIFIED, REJECTED, SUSPENDED
    isCpcbVerified: true,
    location: "Plot 42, SIDCO Industrial Estate, Ambattur, Chennai",
    capacityMonthlyKg: 50000,
    acceptedMaterials: ["PCB / Electronic Components", "Copper", "Aluminium", "Batteries", "Plastics", "Computer Equipment"],
    rating: 4.9,
    lotsProcessed: 38
  },
  materialLots = [],
  offers = [],
  handovers = [],
  transactions = [],
  onOpenSubmitOffer,
  onViewLotDetails,
  onAdvanceHandover,
  onCompleteTransaction,
  onOpenPostRequirementModal
}) {
  const { t, tCategory, tStatus, tCondition } = useTranslation();
  const [activeTab, setActiveTab] = useState('matching_lots'); // matching_lots, my_offers, handovers, transactions

  // Filters State
  const [selectedMaterial, setSelectedMaterial] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState('default');

  const isVerified = recyclerProfile.verificationStatus === 'VERIFIED';

  // Compute Recycler-specific Lots and Metrics
  const myOffers = offers.filter(o => o.recyclerId === recyclerProfile.id);
  const myAcceptedLots = materialLots.filter(l => l.recyclerId === recyclerProfile.id && ['OFFER_ACCEPTED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'READY_FOR_HANDOVER', 'HANDED_OVER', 'PAYMENT_COMPLETED', 'COMPLETED'].includes(l.status));
  const myHandovers = handovers.filter(h => h.recyclerId === recyclerProfile.id);
  const myTransactions = transactions.filter(t => t.recyclerId === recyclerProfile.id);
  
  const totalPurchaseValue = myTransactions
    .filter(t => t.paymentStatus === 'COMPLETED' || t.paymentStatus === 'PAID')
    .reduce((sum, t) => sum + (t.totalValue || t.amount || 0), 0);

  // Filter Matching Lots
  const matchingLots = matchLotsToRecycler(materialLots, recyclerProfile);

  const filteredLots = matchingLots.filter(lot => {
    if (selectedMaterial !== 'ALL' && lot.category !== selectedMaterial && lot.material !== selectedMaterial) return false;
    if (selectedLocation !== 'ALL' && !lot.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
    if (selectedStatus !== 'ALL' && lot.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = lot.id.toLowerCase().includes(q);
      const matchCat = (lot.category || '').toLowerCase().includes(q);
      const matchMat = (lot.material || '').toLowerCase().includes(q);
      const matchLoc = (lot.location || '').toLowerCase().includes(q);
      if (!matchId && !matchCat && !matchMat && !matchLoc) return false;
    }
    return true;
  }).sort((a, b) => {
    if (priceSort === 'price_asc') return (a.benchmarkPrice || 0) - (b.benchmarkPrice || 0);
    if (priceSort === 'price_desc') return (b.benchmarkPrice || 0) - (a.benchmarkPrice || 0);
    if (priceSort === 'qty_desc') return (b.quantity || b.totalWeightKg || 0) - (a.quantity || a.totalWeightKg || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EA] pb-16 text-[#203128]">
      
      {/* Recycler Header with Verified CPCB Status */}
      <div className="bg-[#244936] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F2C94C] text-[#244936] flex items-center justify-center font-black text-2xl shadow-md">
              GC
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black">{recyclerProfile.companyName}</h1>
                
                {/* Verification Status Badge */}
                {isVerified ? (
                  <span className="text-xs font-extrabold text-[#244936] bg-[#DDEBD8] px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-[#3F7655]" />
                    {t("verifiedRecycler")} ✓
                  </span>
                ) : (
                  <span className="text-xs font-extrabold text-amber-900 bg-amber-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldAlert className="w-4 h-4 text-amber-700" />
                    {recyclerProfile.verificationStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#DDEBD8] mt-1.5 flex items-center gap-2 flex-wrap">
                <span>{t("cpcbRegTitle")}: <strong>{recyclerProfile.cpcbRegistrationNo}</strong></span>
                <span>•</span>
                <span>{recyclerProfile.location}</span>
                <span>•</span>
                <span>Capacity: <strong>{(recyclerProfile.capacityMonthlyKg || 50000).toLocaleString()} kg/mo</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenPostRequirementModal && (
              <button
                onClick={onOpenPostRequirementModal}
                className="px-4 py-2.5 text-xs font-extrabold text-[#244936] bg-[#F2C94C] hover:bg-[#e0b83b] rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t("postRequirement")}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Verification Gating Notice if not verified */}
      {!isVerified && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-amber-900 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black">{t("verificationNoticeTitle")}</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {t("verificationNoticeDesc")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6 Core Recycler Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="bg-white rounded-2xl border border-[#3F7655]/20 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718078]">{t("matchingLots")}</span>
              <Package className="w-4 h-4 text-[#3F7655]" />
            </div>
            <div className="text-2xl font-black text-[#244936] mt-2">
              {matchingLots.length}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{t("readyForBidding")}</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#3F7655]/20 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718078]">{t("activeOffers")}</span>
              <Send className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-blue-700 mt-2">
              {myOffers.filter(o => o.status === 'PENDING' || o.status === 'FLAGGED').length}
            </div>
            <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{t("pendingResponse")}</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#3F7655]/20 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718078]">{t("acceptedLots")}</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {myAcceptedLots.length}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{t("offersAccepted")}</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#3F7655]/20 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718078]">{t("upcomingPickups")}</span>
              <Truck className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-700 mt-2">
              {myHandovers.filter(h => h.status === 'PICKUP_SCHEDULED' || h.status === 'IN_TRANSIT').length}
            </div>
            <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">{t("inLogisticsPipeline")}</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#3F7655]/20 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718078]">{t("completedTransactions")}</span>
              <CheckCircle2 className="w-4 h-4 text-[#3F7655]" />
            </div>
            <div className="text-2xl font-black text-[#203128] mt-2">
              {myTransactions.filter(t => t.paymentStatus === 'COMPLETED' || t.paymentStatus === 'PAID').length}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{t("traceabilityVerified")}</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#3F7655]/20 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#718078]">{t("totalPurchaseValue")}</span>
              <DollarSign className="w-4 h-4 text-[#F2C94C]" />
            </div>
            <div className="text-2xl font-black text-[#3F7655] mt-2">
              ₹{totalPurchaseValue.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#718078] font-bold block mt-0.5">{t("recycledSettled")}</span>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#3F7655]/15">
          <button
            onClick={() => setActiveTab('matching_lots')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'matching_lots' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t("matchingLots")} ({matchingLots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('my_offers')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'my_offers' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{t("myActiveOffers")} ({myOffers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('handovers')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'handovers' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{t("pickupsInTransit")} ({myHandovers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'transactions' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t("completedTransactions")} ({myTransactions.length})</span>
          </button>
        </div>

        {/* TAB 1: MATCHING LOTS (With Filters, Fair Price Calculation, and Offer Submissions) */}
        {activeTab === 'matching_lots' && (
          <div className="mt-6 space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl border border-[#3F7655]/20 p-4 shadow-sm space-y-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#718078]" />
                  <input
                    type="text"
                    placeholder={t("filterSearchLots")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3F7655]"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {/* Category Filter */}
                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="text-xs font-bold bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="ALL">{t("allCategories")}</option>
                    <option value="PCB / Electronic Components">{tCategory("PCB / Electronic Components")}</option>
                    <option value="Copper">{tCategory("Copper")}</option>
                    <option value="Aluminium">{tCategory("Aluminium")}</option>
                    <option value="Ferrous Metals">{tCategory("Ferrous Metals")}</option>
                    <option value="Plastics">{tCategory("Plastics")}</option>
                    <option value="Batteries">{tCategory("Batteries")}</option>
                    <option value="Cables / Wires">{tCategory("Cables / Wires")}</option>
                    <option value="Computer Equipment">{tCategory("Computer Equipment")}</option>
                    <option value="Mobile / Small Electronics">{tCategory("Mobile / Small Electronics")}</option>
                  </select>

                  {/* Location Filter */}
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="text-xs font-bold bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="ALL">{t("allLocations")}</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Salem">Salem</option>
                    <option value="Trichy">Trichy</option>
                  </select>

                  {/* Sort Filter */}
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                    className="text-xs font-bold bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="default">{t("sortByDefault")}</option>
                    <option value="qty_desc">{t("sortHighestQty")}</option>
                    <option value="price_asc">{t("sortPriceLowHigh")}</option>
                    <option value="price_desc">{t("sortPriceHighLow")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Matching Lots Grid */}
            {filteredLots.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-[#3F7655]/30 p-12 text-center space-y-3">
                <Package className="w-12 h-12 text-[#718078] mx-auto opacity-50" />
                <h4 className="text-base font-black text-[#244936]">{t("noMatchingLotsFound")}</h4>
                <p className="text-xs text-[#718078] max-w-md mx-auto">
                  {t("noMatchingLotsSub")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLots.map((lot) => {
                  const qty = lot.quantity || lot.totalWeightKg || 1;
                  const unit = lot.unit || 'kg';
                  const benchmark = lot.benchmarkPrice || 350;
                  const tolerance = lot.tolerancePercent !== undefined ? lot.tolerancePercent : 25;
                  const pricing = calculateFairPriceRange(benchmark, tolerance);
                  
                  // Check if this recycler already submitted an offer on this lot
                  const existingOffer = myOffers.find(o => o.lotId === lot.id);

                  return (
                    <div
                      key={lot.id}
                      className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-1 rounded-full">
                            {tCategory(lot.category || lot.material)}
                          </span>
                          <StatusBadge status={lot.status} />
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#203128]">{qty} {unit}</h3>
                            <span className="text-xs font-mono font-bold text-slate-500">{lot.id}</span>
                          </div>
                          <p className="text-xs text-[#718078] mt-0.5">
                            {lot.material} • {tCondition(lot.condition)} • {lot.location}
                          </p>
                        </div>

                        {/* Fair Price Range Box */}
                        <div className="bg-[#FAF8F2] p-3.5 rounded-2xl border border-[#3F7655]/15 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#718078] font-bold">{t("benchmarkPrice")}:</span>
                            <span className="font-black text-[#244936]">₹{benchmark}/{unit}</span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#718078] font-bold">{t("fairPriceRange")}:</span>
                            <span className="font-extrabold text-[#3F7655] bg-[#DDEBD8] px-2 py-0.5 rounded-md text-[11px]">
                              ₹{pricing.lowerLimit} – ₹{pricing.upperLimit}/{unit} (±{tolerance}%)
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#3F7655]/10">
                            <span className="text-[#718078] font-bold">{t("estLotTotal")}:</span>
                            <span className="font-black text-[#203128]">
                              ₹{(qty * pricing.lowerLimit).toLocaleString()} – ₹{(qty * pricing.upperLimit).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Collector Proximity & Reliability */}
                        <div className="text-[11px] text-[#718078] flex items-center justify-between">
                          <span>{t("collectorLabel")}: <strong>{lot.collectorName || "Eco-Collector Node"}</strong></span>
                          <span>{lot.creationDate || "Today"}</span>
                        </div>

                        {/* Existing Offer Banner if any */}
                        {existingOffer && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                            <span className="font-bold text-blue-900">
                              {t("yourOffer")}: <strong>₹{existingOffer.pricePerUnit}/{unit}</strong> (₹{existingOffer.totalPrice?.toLocaleString()})
                            </span>
                            <StatusBadge status={existingOffer.status} />
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-[#3F7655]/10 flex items-center gap-2">
                        <button
                          onClick={() => onViewLotDetails(lot)}
                          className="flex-1 py-2.5 px-3 text-xs font-extrabold text-[#244936] bg-[#DDEBD8] hover:bg-[#c9e0c1] rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t("viewDetailsBtn")}</span>
                        </button>

                        <button
                          disabled={!isVerified || (existingOffer && existingOffer.status === 'ACCEPTED')}
                          onClick={() => onOpenSubmitOffer && onOpenSubmitOffer(lot)}
                          className={`flex-1 py-2.5 px-3 text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            !isVerified 
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : existingOffer 
                                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                                : 'bg-[#3F7655] hover:bg-[#244936] text-white'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{existingOffer ? t("updateOfferBtn") : t("submitOfferBtn")}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ACTIVE OFFERS */}
        {activeTab === 'my_offers' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("mySubmittedOffersTitle")}</h3>
                  <p className="text-xs text-[#718078]">{t("mySubmittedOffersSub")}</p>
                </div>
              </div>

              {myOffers.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  {t("noActiveOffers")}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                      <tr>
                        <th className="p-3">{t("offerId")}</th>
                        <th className="p-3">{t("lotId")}</th>
                        <th className="p-3">{t("materialCategory")}</th>
                        <th className="p-3 text-right">{t("unitRate")}</th>
                        <th className="p-3 text-right">{t("totalOffered")}</th>
                        <th className="p-3 text-center">{t("fairPriceStatus")}</th>
                        <th className="p-3 text-center">{t("status")}</th>
                        <th className="p-3">{t("timestamp")}</th>
                        <th className="p-3 text-center">{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3F7655]/10">
                      {myOffers.map(offer => {
                        const targetLot = materialLots.find(l => l.id === offer.lotId);
                        return (
                          <tr key={offer.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-slate-800">{offer.id}</td>
                            <td className="p-3 font-mono font-bold text-[#3F7655]">{offer.lotId}</td>
                            <td className="p-3 font-semibold">{tCategory(offer.category || targetLot?.category || targetLot?.material || 'E-Waste')}</td>
                            <td className="p-3 text-right font-black text-[#244936]">₹{offer.pricePerUnit || offer.price}/kg</td>
                            <td className="p-3 text-right font-black text-[#3F7655]">₹{(offer.totalPrice || offer.pricePerUnit * 20).toLocaleString()}</td>
                            <td className="p-3 text-center">
                              {offer.fairPriceStatus === 'FAIR' ? (
                                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  {t("fairStatus")} ✓
                                </span>
                              ) : (
                                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                  {t("belowFairRange")} ⚠️
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <StatusBadge status={offer.status} />
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">{offer.timestamp || offer.date}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => targetLot && onViewLotDetails(targetLot)}
                                className="px-3 py-1 bg-[#244936] text-white rounded-lg font-bold text-[11px] hover:bg-[#14291E] cursor-pointer"
                              >
                                {t("inspectBtn")}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PICKUPS & HANDOVERS */}
        {activeTab === 'handovers' && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myHandovers.length === 0 ? (
                <div className="col-span-2 bg-white rounded-3xl p-10 text-center text-xs text-slate-500 border border-[#3F7655]/20">
                  {t("noHandoversScheduled")}
                </div>
              ) : (
                myHandovers.map(h => (
                  <div
                    key={h.id}
                    className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                          {t("handoverScheduleTitle")}
                        </span>
                        <h4 className="text-base font-black text-[#244936] mt-0.5">{h.id}</h4>
                      </div>
                      <StatusBadge status={h.status} />
                    </div>

                    <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#3F7655]/15 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#718078] font-bold">{t("lotId")}:</span>
                        <strong className="font-mono text-[#244936]">{h.lotId}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#718078] font-bold">{t("collectorLabel")}:</span>
                        <strong className="text-slate-800">{h.collectorName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#718078] font-bold">{t("totalQuantity")}:</span>
                        <strong className="text-[#203128]">{h.quantityKg} kg</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#718078] font-bold">{t("agreedPrice")}:</span>
                        <strong className="text-[#3F7655]">₹{h.agreedPricePerKg}/kg (₹{h.totalAmount?.toLocaleString()})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#718078] font-bold">{t("pickupLocation")}:</span>
                        <strong className="text-slate-700">{h.pickupLocation}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3">
                      {h.status !== 'HANDED_OVER' && onAdvanceHandover && (
                        <button
                          onClick={() => onAdvanceHandover(h.id)}
                          className="flex-1 py-2.5 px-4 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{t("advanceHandoverStage")}</span>
                        </button>
                      )}

                      {h.status === 'HANDED_OVER' && onCompleteTransaction && (
                        <button
                          onClick={() => onCompleteTransaction(h)}
                          className="flex-1 py-2.5 px-4 text-xs font-extrabold text-[#244936] bg-[#F2C94C] hover:bg-[#e0b83b] rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{t("completePaymentRecord")}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TRANSACTIONS & RECEIPTS */}
        {activeTab === 'transactions' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("settledTransactionsTitle")}</h3>
                  <p className="text-xs text-[#718078]">{t("settledTransactionsSub")}</p>
                </div>
              </div>

              {myTransactions.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  {t("noCompletedTransactionsYet")}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                      <tr>
                        <th className="p-3">{t("txId")}</th>
                        <th className="p-3">{t("lotId")}</th>
                        <th className="p-3">{t("collectorLabel")}</th>
                        <th className="p-3 text-right">{t("quantityCol")}</th>
                        <th className="p-3 text-right">{t("rateCol")}</th>
                        <th className="p-3 text-right">{t("totalValueCol")}</th>
                        <th className="p-3 text-center">{t("paymentStatus")}</th>
                        <th className="p-3">{t("dateCol")}</th>
                        <th className="p-3 text-center">{t("traceability")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3F7655]/10">
                      {myTransactions.map(tx => {
                        const targetLot = materialLots.find(l => l.id === tx.lotId);
                        return (
                          <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-slate-800">{tx.id}</td>
                            <td className="p-3 font-mono font-bold text-[#3F7655]">{tx.lotId}</td>
                            <td className="p-3 font-semibold">{tx.collectorName}</td>
                            <td className="p-3 text-right font-bold">{tx.quantityKg || tx.quantity} kg</td>
                            <td className="p-3 text-right font-black text-[#244936]">₹{tx.acceptedPricePerKg || tx.agreedPricePerKg}/kg</td>
                            <td className="p-3 text-right font-black text-[#3F7655]">₹{(tx.totalValue || tx.amount || 0).toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                                {t("paidCompleted")} ✓
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 font-mono text-[11px]">{tx.date || tx.timestamp}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => targetLot && onViewLotDetails(targetLot)}
                                className="px-3 py-1 bg-[#244936] text-white rounded-lg font-bold text-[11px] hover:bg-[#14291E] cursor-pointer"
                              >
                                {t("viewTimelineBtn")}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
