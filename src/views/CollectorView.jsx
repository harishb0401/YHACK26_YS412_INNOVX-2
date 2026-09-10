import React, { useState } from 'react';
import { 
  Package, LayoutDashboard, ShoppingBag, ShieldAlert, Award, 
  TrendingUp, User, Clock, QrCode, Search, Filter, Plus, ArrowRight, 
  CheckCircle2, ChevronRight, Phone, MapPin, Scale, DollarSign, Truck, AlertCircle, Wifi, WifiOff, RefreshCw
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { useTranslation, useLanguage } from '../i18n';
import { structuredEWasteCategories, referenceScrapPrices } from '../data/scrapPrices';

export default function CollectorView({ 
  collectorProfile,
  materialLots = [], 
  offers = [],
  handovers = [],
  transactions = [],
  requirements = [],
  onOpenAddLotModal,
  onOpenPhoneVerificationModal,
  onViewLotDetails,
  onOpenRespondModal,
  onAcceptOffer,
  onRejectOffer,
  onConfirmHandover,
  onOpenCompareOffers
}) {
  const { t } = useTranslation();
  const { tCategory, tStatus, tCondition } = useLanguage();

  const [activeTab, setActiveTab] = useState('my-lots');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);

  // Filter lots belonging to this collector
  const myLots = materialLots.filter(l => !collectorProfile || l.collectorId === collectorProfile.id || l.collectorName?.includes(collectorProfile.name?.split(' ')[0]));
  
  // Calculate 6 Core Metrics
  const totalWeightCollected = myLots.reduce((sum, l) => sum + (parseFloat(l.quantity || l.totalWeightKg) || 0), 0);
  const activeLotsCount = myLots.filter(l => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(l.status)).length;
  
  // Offers received on my lots
  const myLotIds = new Set(myLots.map(l => l.id));
  const myOffers = offers.filter(o => myLotIds.has(o.lotId));
  const pendingOffersCount = myOffers.filter(o => o.status === 'PENDING' || o.status === 'FLAGGED').length;

  // Handovers
  const myHandovers = handovers.filter(h => myLotIds.has(h.lotId) || h.collectorId === collectorProfile?.id);
  const pendingHandoversCount = myHandovers.filter(h => h.status !== 'HANDED_OVER').length;

  // Transactions
  const myTransactions = transactions.filter(t => myLotIds.has(t.lotId) || t.collectorId === collectorProfile?.id);
  const completedTxnCount = myTransactions.length;
  const totalEarnings = myTransactions.reduce((sum, tx) => sum + (tx.totalValue || 0), 0) + 
                        (myLots.filter(l => l.status === 'COMPLETED').reduce((s, l) => s + (l.agreedTotalValue || l.estimatedLotValue || 0), 0));

  // Filter My Lots by Search and Status
  const filteredLots = myLots.filter(lot => {
    const matchesSearch = (lot.id || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
                          (lot.category || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
                          (lot.material || '').toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EA] pb-24 lg:pb-12 text-[#203128]">
      
      {/* Top Banner with Collector Profile & Verification Badge */}
      <div className="bg-[#244936] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-black text-2xl shadow-inner">
              {collectorProfile?.name ? collectorProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'CK'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black">{collectorProfile?.name || "Ramesh Kumar"}</h1>
                
                {collectorProfile?.phone_verified ? (
                  <span className="text-xs font-black text-[#244936] bg-[#F2C94C] px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t("phoneVerifiedBadge")}
                  </span>
                ) : (
                  <button
                    onClick={onOpenPhoneVerificationModal}
                    className="text-xs font-black text-white bg-rose-600 hover:bg-rose-700 px-3 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition animate-pulse"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t("phoneUnverifiedBadge")} - {t("verifyNow")}
                  </button>
                )}
              </div>

              <p className="text-xs text-[#DDEBD8] mt-1 flex items-center gap-2">
                <span>{collectorProfile?.company || "Apex Scrap Collection"}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#F2C94C]" />
                  {collectorProfile?.phone || "+91 98401 23456"}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F2C94C]" />
                  {collectorProfile?.location || "Chennai - Guindy"}
                </span>
              </p>
            </div>
          </div>

          {/* Top Actions: Add E-Waste & Offline Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Offline Simulation Toggle */}
            <button
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              title="Toggle simulated offline network mode"
              className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
                isOfflineSimulated 
                  ? 'bg-rose-900/80 text-rose-200 border-rose-500' 
                  : 'bg-white/10 text-[#DDEBD8] border-white/10 hover:bg-white/20'
              }`}
            >
              {isOfflineSimulated ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t("statusOffline")}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t("statusOnline")}</span>
                </>
              )}
            </button>

            {/* Main Action: Add E-Waste */}
            <button
              onClick={onOpenAddLotModal}
              className="px-5 py-3 text-xs font-black text-[#244936] bg-[#F2C94C] hover:bg-[#e0b83b] rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>{t("addEWaste")}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Offline Mode Alert Notification Banner */}
      {isOfflineSimulated && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 py-2.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
          <WifiOff className="w-4 h-4 text-amber-700" />
          <span>{t("offlineModeNotice")}</span>
        </div>
      )}

      {/* Phone Unverified Warning Banner if not verified */}
      {collectorProfile && !collectorProfile.phone_verified && (
        <div className="bg-rose-50 border-b border-rose-200 text-rose-900 py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{t("phoneVerificationNotice")}</span>
            </div>
            <button
              onClick={onOpenPhoneVerificationModal}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shrink-0 cursor-pointer shadow-sm transition"
            >
              {t("verifyNow")}
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* 6 Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 shadow-sm text-center">
            <span className="text-[10px] text-[#718078] font-black uppercase tracking-wider block">{t("totalEWasteCollected")}</span>
            <span className="text-xl font-black text-[#203128] mt-1 block">{totalWeightCollected} kg</span>
            <span className="text-[10px] font-bold text-emerald-600">Verified Intake</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 shadow-sm text-center">
            <span className="text-[10px] text-[#718078] font-black uppercase tracking-wider block">{t("activeLots")}</span>
            <span className="text-xl font-black text-[#3F7655] mt-1 block">{activeLotsCount}</span>
            <span className="text-[10px] font-bold text-slate-500">In Marketplace</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 shadow-sm text-center">
            <span className="text-[10px] text-[#718078] font-black uppercase tracking-wider block">{t("offersReceived")}</span>
            <span className="text-xl font-black text-amber-600 mt-1 block">{pendingOffersCount}</span>
            <span className="text-[10px] font-bold text-amber-600">Action Needed</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 shadow-sm text-center">
            <span className="text-[10px] text-[#718078] font-black uppercase tracking-wider block">{t("pendingHandovers")}</span>
            <span className="text-xl font-black text-purple-600 mt-1 block">{pendingHandoversCount}</span>
            <span className="text-[10px] font-bold text-purple-600">Scheduled Pickups</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 shadow-sm text-center">
            <span className="text-[10px] text-[#718078] font-black uppercase tracking-wider block">{t("completedTransactions")}</span>
            <span className="text-xl font-black text-emerald-700 mt-1 block">{completedTxnCount}</span>
            <span className="text-[10px] font-bold text-emerald-600">100% Certified</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#3F7655]/20 shadow-sm text-center">
            <span className="text-[10px] text-[#718078] font-black uppercase tracking-wider block">{t("totalEarnings")}</span>
            <span className="text-xl font-black text-[#244936] mt-1 block">₹{totalEarnings.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-600">Direct Settlement</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#3F7655]/15">
          <button
            onClick={() => setActiveTab('my-lots')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'my-lots' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Digital Lots ({myLots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'offers' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{t("offersReceived")} ({myOffers.length})</span>
            {pendingOffersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#F2C94C] text-[#244936] font-black text-[10px] flex items-center justify-center">
                {pendingOffersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('handovers')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'handovers' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>{t("handoversTitle")} ({myHandovers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'transactions' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{t("transactionsTitle")} ({myTransactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scrap-rates')}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'scrap-rates' 
                ? 'bg-[#3F7655] text-white shadow-sm' 
                : 'bg-white text-[#203128] hover:bg-[#DDEBD8]/50 border border-[#3F7655]/15'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t("benchmarkPricingTitle") || "Benchmark Rates"}</span>
          </button>
        </div>

        {/* TAB 1: MY DIGITAL LOTS */}
        {activeTab === 'my-lots' && (
          <div className="space-y-4">
            
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#718078]" />
                <input
                  type="text"
                  placeholder="Search lot by ID, category, or material..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-bold bg-white border border-[#3F7655]/20 rounded-2xl focus:outline-none focus:border-[#3F7655]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold bg-white border border-[#3F7655]/20 rounded-2xl px-3 py-2.5 focus:outline-none"
                >
                  <option value="ALL">All Statuses ({myLots.length})</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="OFFER_RECEIVED">Offer Received</option>
                  <option value="OFFER_ACCEPTED">Offer Accepted</option>
                  <option value="PICKUP_SCHEDULED">Pickup Scheduled</option>
                  <option value="HANDED_OVER">Handed Over</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <button
                  onClick={onOpenAddLotModal}
                  className="px-4 py-2.5 text-xs font-black text-white bg-[#3F7655] hover:bg-[#244936] rounded-2xl shadow-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t("addEWaste")}</span>
                </button>
              </div>
            </div>

            {/* Lots Grid */}
            {filteredLots.length === 0 ? (
              <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-12 text-center space-y-3">
                <Package className="w-12 h-12 text-[#3F7655]/40 mx-auto" />
                <h4 className="text-base font-black text-[#203128]">No waste lots found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "Add E-Waste" above to create your first classified Digital Material Lot with automated fair pricing.
                </p>
                <button
                  onClick={onOpenAddLotModal}
                  className="px-5 py-2.5 text-xs font-black text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("addEWaste")}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLots.map((lot) => {
                  const lotOfferList = offers.filter(o => o.lotId === lot.id);
                  const hasOffers = lotOfferList.length > 0;

                  return (
                    <div
                      key={lot.id}
                      className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {lot.id}
                          </span>
                          <StatusBadge status={lot.status} size="sm" />
                        </div>

                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                            {tCategory(lot.category)}
                          </span>
                          <h3 className="text-base font-black text-[#203128] mt-1.5">{lot.material}</h3>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
                            <span>{lot.location}</span>
                          </p>
                        </div>

                        {/* Valuation & Fair Price Range Box */}
                        <div className="bg-[#FAF8F2] p-3 rounded-2xl border border-[#3F7655]/15 grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block">{t("quantityLabel")}</span>
                            <span className="font-black text-[#203128]">{lot.quantity} {lot.unit || 'kg'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block">{t("fairPriceRangeLabel")}</span>
                            <span className="font-black text-[#3F7655]">₹{lot.lowerLimit}–₹{lot.upperLimit}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block">{t("estimatedLotValueLabel")}</span>
                            <span className="font-black text-[#244936]">₹{lot.estimatedLotValue?.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Offers Badge if any */}
                        {hasOffers && (
                          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs font-bold text-amber-900">
                            <span>{lotOfferList.length} Recycler Offer(s) Received</span>
                            <button
                              onClick={() => {
                                if (onOpenCompareOffers) onOpenCompareOffers(lot);
                              }}
                              className="text-[11px] font-black text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
                            >
                              {t("compareOffersBtn")}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-400 font-mono">
                          {lot.createdDate?.split(',')[0] || 'Today'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {hasOffers && lot.status === 'OFFER_RECEIVED' && (
                            <button
                              onClick={() => {
                                if (onOpenCompareOffers) onOpenCompareOffers(lot);
                              }}
                              className="px-3 py-1.5 text-xs font-black text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-sm transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>{t("compareOffersBtn")}</span>
                            </button>
                          )}

                          <button
                            onClick={() => onViewLotDetails(lot)}
                            className="px-3 py-1.5 text-xs font-bold text-[#244936] bg-[#DDEBD8] hover:bg-[#c9e0c1] rounded-xl transition flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-[#3F7655]" />
                            <span>Details & QR</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: OFFERS RECEIVED */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#203128]">{t("offersReceived")}</h3>
                <p className="text-xs text-[#718078]">Compare incoming price offers from verified recyclers against fair price ranges.</p>
              </div>
            </div>

            {myOffers.length === 0 ? (
              <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-12 text-center text-slate-500 text-xs font-bold">
                No offers received yet. As verified recyclers match with your open lots, their bids will appear here.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myOffers.map((offer) => {
                  const associatedLot = materialLots.find(l => l.id === offer.lotId);
                  const isAccepted = offer.status === 'ACCEPTED';
                  const isRejected = offer.status === 'REJECTED';
                  const isBelowFair = offer.fairPriceStatus === 'BELOW_FAIR_RANGE';

                  return (
                    <div
                      key={offer.id}
                      className="bg-white rounded-2xl p-5 border border-[#3F7655]/20 shadow-sm space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-500">For Lot: {offer.lotId}</span>
                            <h4 className="font-black text-sm text-[#203128] mt-0.5">{offer.recyclerName}</h4>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              {t("verifiedRecyclerBadge")}
                            </span>
                          </div>

                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                            isBelowFair 
                              ? 'bg-rose-50 text-rose-700 border-rose-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {offer.fairPriceBadge || 'FAIR ✓'}
                          </span>
                        </div>

                        {/* Price Breakdown */}
                        <div className="grid grid-cols-2 gap-2 bg-[#FAF8F2] p-3 rounded-xl border border-[#3F7655]/10 text-center">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block">{t("offerPricePerUnit")}</span>
                            <span className="text-base font-black text-[#244936]">₹{offer.pricePerUnit}/kg</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block">{t("totalValue")}</span>
                            <span className="text-base font-black text-[#3F7655]">₹{offer.totalPrice?.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <div>Proposed Pickup: <strong>{offer.proposedPickupDate || 'Within 2 days'}</strong></div>
                          <p className="text-[11px] text-slate-500 italic">"{offer.notes}"</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">{offer.timestamp}</span>

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
                              onClick={() => onRejectOffer && onRejectOffer(offer.id)}
                              className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            >
                              {t("rejectOffer")}
                            </button>

                            <button
                              onClick={() => onAcceptOffer && onAcceptOffer(offer, associatedLot)}
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
        )}

        {/* TAB 3: HANDOVERS & PICKUPS */}
        {activeTab === 'handovers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#203128]">{t("handoversTitle")}</h3>
                <p className="text-xs text-[#718078]">Coordinate physical lot transfers and verify weighbridge handovers with QR scanning.</p>
              </div>
            </div>

            {myHandovers.length === 0 ? (
              <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-12 text-center text-slate-500 text-xs font-bold">
                No active handovers. When you accept a recycler offer, a scheduled handover manifest is generated automatically.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myHandovers.map((handover) => (
                  <div key={handover.id} className="bg-white rounded-2xl p-5 border border-[#3F7655]/20 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{handover.id} · Lot: {handover.lotId}</span>
                        <h4 className="font-black text-sm text-[#203128] mt-0.5">{handover.recyclerName}</h4>
                      </div>
                      <StatusBadge status={handover.status} size="sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-[#FAF8F2] p-3 rounded-xl border border-[#3F7655]/10 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">{t("quantityLabel")}</span>
                        <span className="font-black text-[#203128]">{handover.quantity} {handover.unit || 'kg'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold block">Settlement Value</span>
                        <span className="font-black text-[#3F7655]">₹{handover.totalValue?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>Pickup Schedule: <strong>{handover.pickupDate}</strong></div>
                      <div>Transfer Location: {handover.location}</div>
                      <p className="text-[11px] text-slate-500 italic">"{handover.notes}"</p>
                    </div>

                    <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400">QR: {handover.qrCode}</span>
                      
                      {handover.status !== 'HANDED_OVER' ? (
                        <button
                          onClick={() => onConfirmHandover && onConfirmHandover(handover.lotId)}
                          className="px-4 py-2 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{t("confirmHandoverAction")}</span>
                        </button>
                      ) : (
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t("handoverStatusHANDED_OVER")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TRANSACTIONS & EARNINGS */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#203128]">{t("transactionsTitle")}</h3>
                <p className="text-xs text-[#718078]">Immutable platform records of verified payments and settlements.</p>
              </div>
            </div>

            {myTransactions.length === 0 ? (
              <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-12 text-center text-slate-500 text-xs font-bold">
                No completed transactions recorded yet. Handover lots to receive verified settlements.
              </div>
            ) : (
              <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#DDEBD8]/50 text-[#244936] font-bold border-b border-[#3F7655]/15">
                    <tr>
                      <th className="p-3">{t("transactionId")}</th>
                      <th className="p-3">{t("lotId")}</th>
                      <th className="p-3">Recycler</th>
                      <th className="p-3 text-right">{t("quantityLabel")}</th>
                      <th className="p-3 text-right">{t("agreedPrice")}</th>
                      <th className="p-3 text-right">{t("totalValue")}</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">{t("date")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3F7655]/10">
                    {myTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{tx.id}</td>
                        <td className="p-3 font-mono text-slate-600">{tx.lotId}</td>
                        <td className="p-3 font-semibold">{tx.recyclerName}</td>
                        <td className="p-3 text-right font-bold">{tx.quantity} {tx.unit || 'kg'}</td>
                        <td className="p-3 text-right font-semibold text-slate-700">₹{tx.acceptedPrice}/kg</td>
                        <td className="p-3 text-right font-black text-[#3F7655]">₹{tx.totalValue?.toLocaleString()}</td>
                        <td className="p-3">
                          <span className="text-[11px] font-black bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                            ✓ {tx.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BENCHMARK SCRAP RATES */}
        {activeTab === 'scrap-rates' && (
          <div className="space-y-4">
            <div className="bg-white rounded-[28px] border border-[#3F7655]/20 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#3F7655]/15">
                <div>
                  <h3 className="text-base font-black text-[#244936]">{t("scrapPricingDatasetTitle") || "Structured E-Waste Benchmark Catalog"}</h3>
                  <p className="text-xs text-[#718078]">State secondary metal reference benchmarks with transparent ±20% to ±25% fair price tolerances.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {structuredEWasteCategories.map((cat) => {
                  const min = Math.round(cat.benchmarkPrice * (1 - cat.tolerance));
                  const max = Math.round(cat.benchmarkPrice * (1 + cat.tolerance));
                  return (
                    <div key={cat.id} className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#3F7655]/15 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs font-black text-[#3F7655] bg-white px-2.5 py-1 rounded-xl border border-[#3F7655]/20">
                          ₹{cat.benchmarkPrice} / kg
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-[#203128]">{tCategory(cat.name)}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{cat.description}</p>
                      <div className="pt-2 border-t border-[#3F7655]/10 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-500">Fair Range:</span>
                        <span className="text-[#3F7655] font-black">₹{min} – ₹{max}/kg</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Mobile-First Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#3F7655]/20 px-6 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('my-lots')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeTab === 'my-lots' ? 'text-[#3F7655]' : 'text-slate-500'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>My Lots</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeTab === 'offers' ? 'text-[#3F7655]' : 'text-slate-500'
          }`}
        >
          <DollarSign className="w-5 h-5" />
          <span>Offers</span>
        </button>

        <button
          onClick={() => setActiveTab('handovers')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeTab === 'handovers' ? 'text-[#3F7655]' : 'text-slate-500'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>Handovers</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            activeTab === 'transactions' ? 'text-[#3F7655]' : 'text-slate-500'
          }`}
        >
          <Award className="w-5 h-5" />
          <span>Settlements</span>
        </button>
      </div>

    </div>
  );
}
