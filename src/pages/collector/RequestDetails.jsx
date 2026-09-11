import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, QrCode, MapPin, Scale, Clock, ShieldCheck, 
  CheckCircle2, AlertTriangle, FileText, Send, DollarSign, 
  Calendar, Check, X, Building, Truck, Sparkles, Image as ImageIcon, Loader2
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { calculateFairPriceRange, evaluateOfferFairPrice } from '../../utils/rulesEngine';
import { mockWasteLots, mockOffers } from '../../data/mockData';
import { useTranslation } from '../../i18n';
import wasteService from '../../services/wasteService';

export default function RequestDetails({ 
  materialLots = mockWasteLots, 
  offers = mockOffers,
  onAcceptOffer 
}) {
  const { requestId, lotId } = useParams();
  const currentId = requestId || lotId;
  const navigate = useNavigate();
  const { t, tCategory, tStatus } = useTranslation();

  const [localLot, setLocalLot] = useState(null);
  const [localOffers, setLocalOffers] = useState([]);
  const [isLoadingLot, setIsLoadingLot] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  // Match from props if available
  const allLots = materialLots || [];
  const propLot = allLots.find(l => l.id === currentId || l.lotId === currentId || l.lot_id === currentId);

  useEffect(() => {
    let isMounted = true;
    if (propLot) {
      setLocalLot(propLot);
      const propOffers = (offers || []).filter(o => o.lotId === propLot.id || o.lotId === propLot.lotId || o.lotId === currentId);
      if (propOffers.length > 0) {
        setLocalOffers(propOffers);
      } else {
        // Fetch fresh offers from backend
        wasteService.getLotOffers(currentId).then(fetched => {
          if (isMounted && fetched) setLocalOffers(fetched);
        }).catch(() => {});
      }
    } else if (currentId) {
      setIsLoadingLot(true);
      Promise.all([
        wasteService.getLotById(currentId).catch(() => null),
        wasteService.getLotOffers(currentId).catch(() => [])
      ]).then(([fetchedLot, fetchedOffers]) => {
        if (isMounted) {
          if (fetchedLot) setLocalLot(fetchedLot);
          if (fetchedOffers) setLocalOffers(fetchedOffers);
          setIsLoadingLot(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [currentId, propLot, offers]);

  const request = localLot || propLot;
  const requestOffers = localOffers.length > 0 ? localOffers : (offers || []).filter(o => o.lotId === request?.id || o.lotId === request?.lotId);

  const [selectedOfferForReview, setSelectedOfferForReview] = useState(null);
  const [acceptedOfferId, setAcceptedOfferId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  useEffect(() => {
    if (request?.status === 'OFFER_ACCEPTED' || request?.status === 'COMPLETED') {
      const accepted = requestOffers.find(o => o.status === 'ACCEPTED');
      if (accepted) setAcceptedOfferId(accepted.id || accepted.offerId);
    }
  }, [request, requestOffers]);

  if (isLoadingLot) {
    return (
      <div className="bg-white p-12 rounded-[32px] border border-[#3F7655]/20 text-center space-y-3 max-w-xl mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-[#3F7655] mx-auto" />
        <p className="text-xs font-bold text-[#718078]">Loading request manifest from database...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="bg-white p-12 rounded-[32px] border border-[#3F7655]/20 text-center space-y-4 shadow-sm max-w-xl mx-auto">
        <h2 className="text-xl font-black text-[#203128]">{t('requestNotFoundTitle')}</h2>
        <p className="text-xs text-[#718078]">{t('requestNotFoundDesc')}</p>
        <Link to="/collector/requests" className="text-xs font-bold text-[#3F7655] underline">
          {t('returnToRequests')}
        </Link>
      </div>
    );
  }

  const benchmark = request.benchmarkPrice || request.benchmark_price || 350;
  const tolerance = request.tolerancePercent !== undefined ? request.tolerancePercent : (request.tolerance ? request.tolerance * 100 : 25);
  const fairPricing = calculateFairPriceRange(benchmark, tolerance);
  const qty = request.quantity || request.totalWeightKg || 1;
  const unit = request.unit || 'kg';
  const estimatedTotal = request.estimatedLotValue || request.estimated_value || Math.round(qty * benchmark);

  const isAcceptedState = ['OFFER_ACCEPTED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'HANDED_OVER', 'COMPLETED', 'PAYMENT_COMPLETED'].includes(request.status) || !!acceptedOfferId;

  // Lifecycle Timeline
  const timelineEvents = request.timeline && request.timeline.length > 0 ? request.timeline : [
    { id: "e-1", event: "Request Created", timestamp: request.createdDate || "09 Sep 2026, 10:30 AM", userRole: "Collector", status: "Completed", details: `${qty} ${unit} ${request.material || request.material_type} declared` },
    { id: "e-2", event: "Price Band Calculated", timestamp: request.createdDate || "09 Sep 2026, 10:30 AM", userRole: "Rules Engine", status: "Completed", details: `Benchmark: ₹${benchmark}/${unit} | Fair Band: ₹${fairPricing.minPrice}–₹${fairPricing.maxPrice}` },
    { id: "e-3", event: "Recyclers Notified", timestamp: request.createdDate || "09 Sep 2026, 10:35 AM", userRole: "System", status: "Completed", details: "Broadcasted to verified recyclers in zone" },
    ...(requestOffers.length > 0 ? [
      { id: "e-4", event: "Recycler Offers Received", timestamp: requestOffers[0]?.timestamp || "Today", userRole: "Recyclers", status: "Completed", details: `${requestOffers.length} offers submitted` }
    ] : []),
    ...(isAcceptedState ? [
      { id: "e-5", event: "Offer Accepted", timestamp: "Recently", userRole: "Collector", status: "Completed", details: `Accepted offer from ${request.selectedRecyclerName || 'Verified Recycler'}` }
    ] : [])
  ];

  const handleAcceptClick = async (offer) => {
    setIsAccepting(true);
    try {
      if (onAcceptOffer) {
        await onAcceptOffer({
          requestId: request.id || request.lotId,
          offerId: offer.id || offer.offerId,
          recyclerId: offer.recyclerId,
          recyclerName: offer.recyclerName,
          agreedPricePerUnit: offer.pricePerUnit || offer.ratePerKg,
          agreedTotalValue: offer.totalPrice || offer.totalAmount || ((offer.pricePerUnit || offer.ratePerKg) * qty),
          proposedPickupDate: offer.proposedPickupDate || offer.pickupDate
        });
      }

      setAcceptedOfferId(offer.id || offer.offerId);
      setSelectedOfferForReview(null);
      setActionMessage({
        type: 'success',
        text: `Offer from ${offer.recyclerName} accepted! Status updated to "Offer Accepted" and Simulated Escrow Vault is locked.`
      });
    } catch (err) {
      alert(err.message || 'Failed to accept offer on server.');
    } finally {
      setIsAccepting(false);
    }
  };


  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/collector/requests')}
          className="px-4 py-2 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 rounded-xl hover:bg-[#DDEBD8]/50 transition flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#3F7655]" />
          <span>{t('backToRequests', 'Back to My Requests')}</span>
        </button>

        <StatusBadge status={isAcceptedState && request.status !== 'COMPLETED' ? 'OFFER_ACCEPTED' : request.status} />
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionMessage.text}</span>
          </div>
          <Link
            to="/collector/transactions"
            className="px-3.5 py-1.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl text-xs font-black shadow transition"
          >
            {t('viewTransactions', 'View Transactions →')}
          </Link>
        </div>
      )}

      {/* Main Request Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        
        {/* Header Information */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3F7655]/10 pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3 py-1 rounded-full">
              {tCategory(request.category)}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#203128] mt-2">{request.material}</h1>
            <p className="text-xs text-[#718078] flex items-center gap-2 mt-1 font-semibold">
              <span className="font-mono text-[#203128] font-black">{t('requestIdCol', 'Request ID')}: {request.id}</span>
              <span>•</span>
              <span>{t('submissionDate', 'Submitted')}: {request.collectionDate || request.createdDate || 'Today'}</span>
            </p>
          </div>

          {/* QR & Hash Box */}
          <div className="bg-[#FAF8F2] p-3.5 rounded-2xl border border-[#3F7655]/15 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl border border-[#3F7655]/20 flex items-center justify-center text-[#244936] shadow-sm shrink-0">
              <QrCode className="w-7 h-7" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase text-[#718078] block">{t('cpcbQrSignature', 'CPCB QR Signature')}</span>
              <span className="text-xs font-black text-[#203128] font-mono truncate block max-w-[200px]">
                {request.qrPayload || `EPR-QR-${request.id}`}
              </span>
            </div>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#3F7655]" /> {t('declaredWeight', 'Declared Weight')}
            </span>
            <span className="text-base font-black text-[#203128]">{qty} {unit}</span>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#3F7655]" /> {t('benchmarkPriceLabel', 'Benchmark Rate')}
            </span>
            <span className="text-base font-black text-[#203128]">₹{benchmark} / {unit}</span>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#3F7655]" /> {t('estimatedLotValueLabel', 'Estimated Value')}
            </span>
            <span className="text-base font-black text-[#244936]">₹{estimatedTotal.toLocaleString()}</span>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-1">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#3F7655]" /> {t('locationLabel', 'Location')}
            </span>
            <span className="text-xs font-bold text-[#203128] truncate block">{request.location || 'Chennai Hub'}</span>
          </div>
        </div>

        {/* Price Transparency & Fair Range Banner */}
        <div className="p-5 bg-[#FAF8F2] rounded-[24px] border border-[#3F7655]/20 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#3F7655] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('transparentPricingTitle', 'Transparent Pricing Model (Tamil Nadu Reference Rates)')}</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {t('toleranceLabel', 'Tolerance')}: ±{tolerance}%
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
            <div>
              <span className="text-[#718078]">{t('acceptableScrapBandLabel', 'Acceptable Scrap Price Band:')} </span>
              <strong className="text-[#203128] font-black">₹{fairPricing.minPrice} – ₹{fairPricing.maxPrice} / {unit}</strong>
            </div>
            <div className="text-[11px] text-[#718078]">
              {t('preClearedZeroPenaltyText', 'Offers within this band are pre-cleared by the system with zero penalty.')}
            </div>
          </div>
        </div>

        {/* Uploaded Evidence / Images Section */}
        {request.imageUrl && (
          <div className="p-5 bg-white rounded-[24px] border border-[#3F7655]/15 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#203128] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#3F7655]" />
              <span>{t('uploadedEvidenceTitle', 'Uploaded Waste Verification Evidence')}</span>
            </h4>
            <div className="flex items-center gap-4">
              <img 
                src={request.imageUrl} 
                alt="E-waste lot evidence" 
                className="w-32 h-24 object-cover rounded-2xl border border-[#3F7655]/20 shadow-sm"
              />
              <div className="text-xs text-[#718078] space-y-1">
                <p className="font-bold text-[#203128]">{request.notes || "High-grade electronic components segregated and stored in dry bin."}</p>
                <p>{t('conditionLabel', 'Condition')}: <strong className="text-[#203128]">{request.condition || "Non-working / Scrap"}</strong></p>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {t('photoVerifiedManifest', '✓ Photo Verified Manifest')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* OFFERS RECEIVED SECTION */}
        <div className="space-y-4 pt-4 border-t border-[#3F7655]/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#203128] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#3F7655]" />
                <span>{t('receivedRecyclerOffersTitle', 'Received Recycler Offers ({count})', { count: requestOffers.length })}</span>
              </h2>
              <p className="text-xs text-[#718078]">
                {t('bidsSubmittedDesc', 'Bids submitted by CPCB-authorized recyclers in response to this e-waste request.')}
              </p>
            </div>
          </div>

          {/* Condition: Show offers if received, otherwise show awaiting state */}
          {requestOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requestOffers.map((offer) => {
                const isThisAccepted = acceptedOfferId === offer.id || offer.status === 'ACCEPTED';
                const offeredRate = offer.pricePerUnit;
                const totalPayout = offer.totalPrice || (offeredRate * qty);

                // Price evaluation badge
                const isWithinBand = offeredRate >= fairPricing.minPrice && offeredRate <= fairPricing.maxPrice;
                const isAboveBand = offeredRate > fairPricing.maxPrice;
                const isBelowBand = offeredRate < fairPricing.minPrice;

                return (
                  <div
                    key={offer.id}
                    className={`p-6 rounded-[28px] border transition flex flex-col justify-between space-y-4 ${
                      isThisAccepted
                        ? 'bg-teal-50/70 border-teal-400 shadow-md ring-2 ring-teal-500/20'
                        : 'bg-white border-[#3F7655]/20 shadow-sm hover:shadow-md hover:border-[#3F7655]/40'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Recycler Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Building className="w-4 h-4 text-[#3F7655]" />
                            <h3 className="text-sm font-black text-[#203128]">{offer.recyclerName}</h3>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            {t('cpcbAuthorizedRecyclerBadge', 'CPCB Authorized Recycler')}
                          </span>
                        </div>

                        {/* Benchmark Status Tag */}
                        {isWithinBand && (
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {t('fairRateBadge', 'Fair Rate ✓')}
                          </span>
                        )}
                        {isAboveBand && (
                          <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            {t('aboveBenchmarkBadge', 'Above Benchmark 🔥')}
                          </span>
                        )}
                        {isBelowBand && (
                          <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {t('belowBandBadge', 'Below Band ⚠️')}
                          </span>
                        )}
                      </div>

                      {/* Pricing Comparison */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 bg-[#F8F5EA] rounded-xl">
                          <span className="text-[10px] font-extrabold text-[#718078] uppercase block">{t('offeredRate', 'Offered Rate')}</span>
                          <span className="text-base font-black text-[#203128]">₹{offeredRate} / {unit}</span>
                          <span className="text-[10px] text-[#718078] block">{t('benchmarkRateLabel', 'Benchmark')}: ₹{benchmark}</span>
                        </div>

                        <div className="p-3 bg-[#DDEBD8] rounded-xl border border-[#3F7655]/30">
                          <span className="text-[10px] font-extrabold text-[#244936] uppercase block">{t('totalPayoutCommitment', 'Total Payout')}</span>
                          <span className="text-base font-black text-[#244936]">₹{totalPayout.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Logistics & Pickup Info */}
                      <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#3F7655]/10 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-[#203128] font-bold">
                          <Truck className="w-3.5 h-3.5 text-[#3F7655]" />
                          <span>{t('pickupLabel', 'Pickup')}: {offer.proposedPickupDate || "Scheduled within 48h"}</span>
                        </div>
                        <p className="text-[11px] text-[#718078]">
                          {offer.notes || "Direct vehicle pickup with digital weighbridge verification."}
                        </p>
                      </div>

                      <div className="text-[11px] text-[#718078] font-medium flex items-center justify-between">
                        <span>{t('submittedDate', 'Submitted')}: {offer.timestamp || "Today"}</span>
                        {offer.distanceKm && <span>{t('distanceLabel', 'Distance')}: ~{offer.distanceKm} km</span>}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#3F7655]/10">
                      {isThisAccepted ? (
                        <div className="p-2.5 bg-teal-100 text-teal-900 rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4 text-teal-700" />
                          <span>{t('offerAcceptedEscrowLocked', 'Offer Accepted · Escrow Locked')}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOfferForReview(offer)}
                            className="flex-1 py-2.5 bg-white hover:bg-[#F8F5EA] text-[#203128] border border-[#3F7655]/20 rounded-xl font-bold text-xs transition cursor-pointer"
                          >
                            {t('reviewOfferBtn', 'Review Offer')}
                          </button>

                          <button
                            disabled={isAcceptedState}
                            onClick={() => handleAcceptClick(offer)}
                            className={`flex-1 py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow cursor-pointer ${
                              isAcceptedState
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-[#3F7655] hover:bg-[#244936] text-white'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t('acceptOffer', 'Accept Offer')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Awaiting Recycler Offers Banner */
            <div className="p-8 bg-[#FAF8F2] rounded-[28px] border border-[#3F7655]/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-black text-[#203128]">{t('awaitingRecyclerOffers', 'Awaiting Recycler Offers')}</h3>
              <p className="text-xs text-[#718078] max-w-md mx-auto">
                {t('requestBroadcastedDesc', 'Your request has been broadcasted to registered CPCB recyclers in your industrial corridor. Offers will appear here in real-time as recyclers submit bids.')}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#3F7655]/15 rounded-full text-[11px] font-bold text-[#3F7655]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('fairScrapPriceProtectionText', 'Fair Scrap Price Protection Enabled (₹{min} – ₹{max} / {unit})', { min: fairPricing.minPrice, max: fairPricing.maxPrice, unit })}</span>
              </div>
            </div>
          )}
        </div>

        {/* Request Timeline */}
        <div className="space-y-4 pt-6 border-t border-[#3F7655]/10">
          <h3 className="text-sm font-black text-[#203128] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#3F7655]" />
            <span>{t('requestLifecycleTitle', 'Request Lifecycle & Traceability Audit')}</span>
          </h3>

          <div className="space-y-3">
            {timelineEvents.map((ev, idx) => (
              <div
                key={ev.id || idx}
                className="p-3.5 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#3F7655] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ✓
                  </div>
                  <div>
                    <span className="font-black text-[#203128]">{t(ev.event, ev.event)}</span>
                    <span className="text-[#718078] text-[11px] block">{ev.details}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-[#3F7655] bg-white px-2 py-0.5 rounded-full border border-[#3F7655]/20">
                    {t(ev.userRole, ev.userRole)}
                  </span>
                  <span className="text-[10px] text-[#718078] block mt-0.5">{ev.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Review Offer Modal */}
      {selectedOfferForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-[#3F7655]/20 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                  {t('recyclerOfferReviewModalHeader', 'Recycler Offer Review')}
                </span>
                <h3 className="text-xl font-black text-[#203128] mt-1">{selectedOfferForReview.recyclerName}</h3>
              </div>
              <button
                onClick={() => setSelectedOfferForReview(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8F5EA] rounded-xl">
                  <span className="text-[10px] font-bold text-[#718078] uppercase block">{t('offeredRate', 'Offered Rate')}</span>
                  <span className="text-lg font-black text-[#203128]">₹{selectedOfferForReview.pricePerUnit} / {unit}</span>
                </div>
                <div className="p-3 bg-[#DDEBD8] rounded-xl border border-[#3F7655]/30">
                  <span className="text-[10px] font-bold text-[#244936] uppercase block">{t('totalPayoutCommitment', 'Total Payout')}</span>
                  <span className="text-lg font-black text-[#244936]">
                    ₹{(selectedOfferForReview.totalPrice || selectedOfferForReview.pricePerUnit * qty).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#3F7655]/15 space-y-2">
                <h4 className="font-extrabold text-[#203128]">{t('pricingEvalTransparency', 'Pricing Evaluation & Transparency')}</h4>
                <p className="text-[#718078]">
                  {t('stateRefBenchmark')}: <strong>₹{benchmark}/{unit}</strong><br />
                  {t('permittedBand')}: <strong>₹{fairPricing.minPrice} – ₹{fairPricing.maxPrice} / {unit}</strong>
                </p>
                <div className="text-emerald-800 bg-emerald-100 p-2 rounded-xl text-[11px] font-bold">
                  {t('meetsCpcbFairRateNotice', '✓ This offer meets all CPCB Fair Rate criteria with guaranteed Escrow lock.')}
                </div>
              </div>

              <div className="p-3 bg-[#F8F5EA] rounded-xl space-y-1">
                <p><strong>{t('proposedPickupDateLabel', 'Proposed Pickup Date')}:</strong> {selectedOfferForReview.proposedPickupDate || "Within 48 hours"}</p>
                <p><strong>{t('logisticsNotesLabel', 'Logistics Notes')}:</strong> {selectedOfferForReview.notes || "Direct vehicle pickup with calibrated weigh scales."}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#3F7655]/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedOfferForReview(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                {t('close', 'Close')}
              </button>
              <button
                onClick={() => handleAcceptClick(selectedOfferForReview)}
                className="px-6 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold rounded-xl shadow cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{t('acceptOffer', 'Accept Offer')} (₹{(selectedOfferForReview.totalPrice || selectedOfferForReview.pricePerUnit * qty).toLocaleString()})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
