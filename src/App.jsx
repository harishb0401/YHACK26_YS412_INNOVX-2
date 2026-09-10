import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Modals
import CanIRecycleModal from './components/Modals/CanIRecycleModal';
import DigitalLotModal from './components/Modals/DigitalLotModal';
import PriceWarningModal from './components/Modals/PriceWarningModal';
import RespondRequirementModal from './components/Modals/RespondRequirementModal';
import PostRequirementModal from './components/Modals/PostRequirementModal';
import DisposeEWasteModal from './components/Modals/DisposeEWasteModal';
import PhoneVerificationModal from './components/Modals/PhoneVerificationModal';
import AddWasteModal from './components/Modals/AddWasteModal';
import SubmitOfferModal from './components/Modals/SubmitOfferModal';
import CompareOffersModal from './components/Modals/CompareOffersModal';

// Views
import LandingView from './views/LandingView';
import CollectorView from './views/CollectorView';
import RecyclerView from './views/RecyclerView';
import GeneratorView from './views/GeneratorView';
import AdminView from './views/AdminView';
import RecyclingGuideView from './views/RecyclingGuideView';
import FindLocationView from './views/FindLocationView';
import RewardsView from './views/RewardsView';

// Context & Data
import { LanguageProvider } from './i18n';
import { 
  initialRecyclers,
  initialCollectors, 
  initialMaterialLots,
  initialOffers,
  initialHandovers,
  initialTransactions,
  initialRecyclerRequirements,
  adminAuditLogs,
  userDashboardData 
} from './mockData';
import { referenceScrapPrices } from './data/scrapPrices';
import { calculateFairPriceRange, evaluateOfferFairPrice, createTraceabilityEvent } from './utils/rulesEngine';

export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [currentRole, setCurrentRole] = useState('public');

  // 1. Collector Active State
  const [collectorProfile, setCollectorProfile] = useState({
    id: "COL-TN-101",
    name: "Ramesh Kumar (Apex Scrap Collection)",
    phone: "+91 98401 23456",
    phoneVerified: true,
    phone_verified: true,
    location: "Chennai - Guindy Industrial Estate",
    rating: 4.9,
    walletBalance: 14500
  });

  // 2. Central Shared Databases
  const [recyclers, setRecyclers] = useState(initialRecyclers);
  const [collectors, setCollectors] = useState(initialCollectors);
  const [materialLots, setMaterialLots] = useState(initialMaterialLots);
  const [offers, setOffers] = useState(initialOffers);
  const [handovers, setHandovers] = useState(initialHandovers);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [benchmarkPrices, setBenchmarkPrices] = useState(referenceScrapPrices);
  const [auditLogs, setAuditLogs] = useState(adminAuditLogs);
  const [requirements, setRequirements] = useState(initialRecyclerRequirements);
  const [userStats, setUserStats] = useState(userDashboardData);

  // 3. Modals State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(initialMaterialLots[0] || null);

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isAddWasteModalOpen, setIsAddWasteModalOpen] = useState(false);

  const [isSubmitOfferModalOpen, setIsSubmitOfferModalOpen] = useState(false);
  const [selectedLotForOffer, setSelectedLotForOffer] = useState(null);

  const [isCompareOffersModalOpen, setIsCompareOffersModalOpen] = useState(false);
  const [selectedLotForCompare, setSelectedLotForCompare] = useState(null);

  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [selectedReqForRespond, setSelectedReqForRespond] = useState(null);

  const [isPostReqModalOpen, setIsPostReqModalOpen] = useState(false);
  const [isDisposeModalOpen, setIsDisposeModalOpen] = useState(false);

  const [isPriceWarningOpen, setIsPriceWarningOpen] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const [pendingResponsePayload, setPendingResponsePayload] = useState(null);

  // Active Recycler Profile for Recycler View (Default: first verified recycler)
  const activeRecycler = recyclers[0] || {
    id: "REC-TN-01",
    companyName: "GreenCycle Material Recovery Ltd",
    verificationStatus: "VERIFIED"
  };

  // ----------------------------------------------------
  // WORKFLOW ACTION HANDLERS
  // ----------------------------------------------------

  // Step 1: Collector Phone Verification
  const handlePhoneVerified = (verifiedPhone) => {
    setCollectorProfile(prev => ({
      ...prev,
      phone: verifiedPhone,
      phoneVerified: true,
      phone_verified: true
    }));

    setCollectors(prev => prev.map(c => 
      c.id === collectorProfile.id 
        ? { ...c, phone: verifiedPhone, phone_verified: true, phoneVerified: true } 
        : c
    ));

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Today, Just now",
      action: "Phone Number Verified via OTP",
      entity: `Collector ${collectorProfile.name} (${verifiedPhone})`,
      status: "VERIFIED"
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setIsPhoneModalOpen(false);
  };

  // Step 2: Collector Adds E-Waste -> Classification -> Digital Lot Created -> Fair Price Calculated
  const handleAddWasteLot = (wasteData) => {
    if (!collectorProfile.phoneVerified && !collectorProfile.phone_verified) {
      alert("Please verify your phone number via OTP first.");
      setIsPhoneModalOpen(true);
      return;
    }

    const newLotId = `LOT-EL26-TN-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Find reference pricing
    const refData = benchmarkPrices.find(p => p.category === wasteData.category) || {
      referencePrice: wasteData.benchmarkPrice || 350,
      tolerancePercent: 25
    };
    const benchmark = refData.referencePrice || wasteData.benchmarkPrice || 350;
    const tolerancePercent = refData.tolerancePercent !== undefined ? refData.tolerancePercent : 25;
    const pricing = calculateFairPriceRange(benchmark, tolerancePercent);

    const qty = parseFloat(wasteData.quantity) || 1;
    const estVal = Math.round(qty * benchmark);

    const initialTimeline = [
      createTraceabilityEvent("Phone Verified", "Today, Just now", "Collector", "Completed", `Verified phone ${collectorProfile.phone}`),
      createTraceabilityEvent("Waste Added", "Today, Just now", "Collector", "Completed", `${qty} ${wasteData.unit} of ${wasteData.material} added`),
      createTraceabilityEvent("Waste Classified", "Today, Just now", "Collector", "Completed", `Category: ${wasteData.category}`),
      createTraceabilityEvent("Digital Lot Created", "Today, Just now", "System", "Completed", `Digital Lot registered with ID ${newLotId}`),
      createTraceabilityEvent("Fair Price Calculated", "Today, Just now", "Rules Engine", "Completed", `Benchmark: ₹${benchmark}/${wasteData.unit} | Fair Range: ₹${pricing.lowerLimit}–₹${pricing.upperLimit}/${wasteData.unit}`),
      createTraceabilityEvent("Recycler Matched", "Today, Just now", "Rules Engine", "Completed", "Broadcasting to verified recyclers across Tamil Nadu")
    ];

    const newLot = {
      id: newLotId,
      collectorId: collectorProfile.id,
      collectorName: collectorProfile.name,
      collectorPhone: collectorProfile.phone,
      category: wasteData.category,
      material: wasteData.material,
      quantity: qty,
      unit: wasteData.unit || 'kg',
      condition: wasteData.condition,
      location: wasteData.location || collectorProfile.location,
      collectionDate: wasteData.collectionDate || "Today",
      createdDate: "Today, Just now",
      imageUrl: wasteData.imageUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop",
      notes: wasteData.notes || "",
      benchmarkPrice: benchmark,
      tolerance: tolerancePercent / 100,
      tolerancePercent: tolerancePercent,
      lowerLimit: pricing.lowerLimit,
      upperLimit: pricing.upperLimit,
      estimatedLotValue: estVal,
      minEstimatedValue: Math.round(qty * pricing.lowerLimit),
      maxEstimatedValue: Math.round(qty * pricing.upperLimit),
      status: "AVAILABLE",
      qrPayload: `ECOLINK::${newLotId}::QTY=${qty}${wasteData.unit}::CAT=${wasteData.category}::VAL=${estVal}`,
      timeline: initialTimeline
    };

    setMaterialLots(prev => [newLot, ...prev]);

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Today, Just now",
      action: "Digital Lot Created",
      entity: `${newLotId} (${wasteData.category} - ${qty} ${wasteData.unit})`,
      status: "AVAILABLE"
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setIsAddWasteModalOpen(false);
    setSelectedLot(newLot);
    setIsLotModalOpen(true);
  };

  // Step 3: Recycler Submits Offer
  const handleSubmitOffer = (offerPayload) => {
    const lot = materialLots.find(l => l.id === offerPayload.lotId);
    if (!lot) return;

    const benchmark = lot.benchmarkPrice || 350;
    const tolerance = lot.tolerancePercent !== undefined ? lot.tolerancePercent : 25;
    const evaluation = evaluateOfferFairPrice(offerPayload.pricePerUnit, benchmark, tolerance);

    const newOfferId = `OFF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOffer = {
      id: newOfferId,
      lotId: lot.id,
      category: lot.category,
      recyclerId: activeRecycler.id,
      recyclerName: activeRecycler.companyName,
      recyclerVerified: activeRecycler.verificationStatus === 'VERIFIED',
      pricePerUnit: offerPayload.pricePerUnit,
      totalPrice: offerPayload.totalPrice,
      fairPriceStatus: evaluation.status,
      fairPriceBadge: evaluation.status === 'FAIR' ? 'FAIR ✓' : 'BELOW FAIR RANGE ⚠️',
      status: evaluation.status === 'FAIR' ? 'PENDING' : 'FLAGGED',
      timestamp: "Today, Just now",
      proposedPickupDate: offerPayload.proposedPickupDate || "Tomorrow, 10:00 AM",
      location: activeRecycler.location,
      distanceKm: 8.5,
      notes: offerPayload.notes || ""
    };

    setOffers(prev => [newOffer, ...prev]);

    // Update Lot status & timeline
    const offerEvent = createTraceabilityEvent(
      "Offer Received",
      "Today, Just now",
      "Recycler",
      evaluation.status === 'FAIR' ? "Completed" : "Flagged",
      `Offer: ₹${offerPayload.pricePerUnit}/${lot.unit || 'kg'} (Total: ₹${offerPayload.totalPrice?.toLocaleString()}) from ${activeRecycler.companyName} - [${evaluation.badge}]`
    );

    setMaterialLots(prev => prev.map(l => {
      if (l.id === lot.id) {
        return {
          ...l,
          status: "OFFER_RECEIVED",
          timeline: [...(l.timeline || []), offerEvent]
        };
      }
      return l;
    }));

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Today, Just now",
      action: "Recycler Offer Submitted",
      entity: `${newOfferId} on ${lot.id} (₹${offerPayload.pricePerUnit}/kg)`,
      status: evaluation.status === 'FAIR' ? "OFFER_RECEIVED" : "FLAGGED"
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setIsSubmitOfferModalOpen(false);
    alert(`Offer successfully submitted for ${lot.id}!`);
  };

  // Step 4: Collector Accepts Offer
  const handleAcceptOffer = (offerIdOrObj, lotIdOrObj) => {
    const offerId = typeof offerIdOrObj === 'object' ? offerIdOrObj.id : offerIdOrObj;
    const lotId = typeof lotIdOrObj === 'object' 
      ? lotIdOrObj.id 
      : (lotIdOrObj || (typeof offerIdOrObj === 'object' ? offerIdOrObj.lotId : null));

    const offer = offers.find(o => o.id === offerId);
    const lot = materialLots.find(l => l.id === lotId || (offer && l.id === offer.lotId));
    if (!offer || !lot) return;

    // 1. Update offer statuses
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) return { ...o, status: 'ACCEPTED' };
      if (o.lotId === lot.id && o.id !== offerId) return { ...o, status: 'REJECTED' };
      return o;
    }));

    // 2. Create Handover record
    const newHandoverId = `HND-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newHandover = {
      id: newHandoverId,
      lotId: lot.id,
      collectorId: collectorProfile.id,
      collectorName: collectorProfile.name,
      collectorPhone: collectorProfile.phone,
      recyclerId: offer.recyclerId,
      recyclerName: offer.recyclerName,
      quantity: lot.quantity || lot.totalWeightKg,
      unit: lot.unit || 'kg',
      agreedPrice: offer.pricePerUnit,
      totalValue: offer.totalPrice,
      pickupDate: offer.proposedPickupDate || "Tomorrow, 10:00 AM",
      location: lot.location,
      status: "PICKUP_SCHEDULED",
      qrCode: `ECOLINK-HANDOVER-${lot.id}`,
      notes: `Handover scheduled with ${offer.recyclerName}`
    };
    setHandovers(prev => [newHandover, ...prev]);

    // 3. Update Lot status & timeline
    const acceptEvent = createTraceabilityEvent("Offer Accepted", "Today, Just now", "Collector", "Completed", `Accepted offer of ₹${offer.pricePerUnit}/${lot.unit || 'kg'} from ${offer.recyclerName}`);
    const pickupEvent = createTraceabilityEvent("Pickup Scheduled", "Today, Just now", "Logistics", "Active", `Pickup scheduled for ${offer.proposedPickupDate || "Tomorrow"} at ${lot.location}`);

    setMaterialLots(prev => prev.map(l => {
      if (l.id === lot.id) {
        return {
          ...l,
          status: "OFFER_ACCEPTED",
          agreedPricePerUnit: offer.pricePerUnit,
          agreedTotalValue: offer.totalPrice,
          selectedRecyclerId: offer.recyclerId,
          selectedRecyclerName: offer.recyclerName,
          timeline: [...(l.timeline || []), acceptEvent, pickupEvent]
        };
      }
      return l;
    }));

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Today, Just now",
      action: "Offer Accepted & Pickup Scheduled",
      entity: `${offerId} on ${lot.id} (${offer.recyclerName})`,
      status: "PICKUP_SCHEDULED"
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setIsCompareOffersModalOpen(false);
    alert(`Offer accepted! Handover scheduled with ${offer.recyclerName}.`);
  };

  // Step 4b: Collector Rejects Offer
  const handleRejectOffer = (offerIdOrObj) => {
    const offerId = typeof offerIdOrObj === 'object' ? offerIdOrObj.id : offerIdOrObj;
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'REJECTED' } : o));
    alert("Offer rejected.");
  };

  // Step 5: Advance Handover Stages
  const handleAdvanceHandover = (handoverIdOrLotId) => {
    const id = typeof handoverIdOrLotId === 'object' ? handoverIdOrLotId.id : handoverIdOrLotId;
    const handover = handovers.find(h => h.id === id || h.lotId === id);
    if (!handover) return;

    let nextStatus = 'IN_TRANSIT';
    if (handover.status === 'PICKUP_SCHEDULED') nextStatus = 'IN_TRANSIT';
    else if (handover.status === 'IN_TRANSIT') nextStatus = 'READY_FOR_HANDOVER';
    else if (handover.status === 'READY_FOR_HANDOVER') nextStatus = 'HANDED_OVER';

    setHandovers(prev => prev.map(h => (h.id === handover.id) ? { ...h, status: nextStatus } : h));

    if (nextStatus === 'HANDED_OVER') {
      const handoverEvent = createTraceabilityEvent("Waste Handed Over", "Today, Just now", "Collector & Recycler", "Completed", `Physical QR scanned & verified at weighbridge (${handover.location})`);
      setMaterialLots(prev => prev.map(l => {
        if (l.id === handover.lotId) {
          return {
            ...l,
            status: "HANDED_OVER",
            timeline: [...(l.timeline || []), handoverEvent]
          };
        }
        return l;
      }));
    }

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Today, Just now",
      action: `Handover Status Advanced to ${nextStatus}`,
      entity: `${handover.id} (Lot: ${handover.lotId})`,
      status: nextStatus
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Step 6: Complete Payment & Transaction Recording
  const handleRecordPayment = (handover) => {
    const totalVal = Math.round((handover.quantity || 1) * (handover.agreedPrice || 1));
    const newTxId = `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx = {
      id: newTxId,
      lotId: handover.lotId,
      collectorId: handover.collectorId,
      collectorName: handover.collectorName,
      recyclerId: handover.recyclerId,
      recyclerName: handover.recyclerName,
      quantity: handover.quantity,
      unit: handover.unit || 'kg',
      acceptedPrice: handover.agreedPrice,
      totalValue: totalVal,
      date: "Today, Just now",
      paymentStatus: "PAID",
      transactionStatus: "COMPLETED",
      paymentMethod: `Platform Recorded Settlement (Direct NEFT Ref: TN-2026-${Math.floor(1000 + Math.random() * 9000)})`,
      receiptId: `REC-EPR-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setTransactions(prev => [newTx, ...prev]);

    // Update Handover & Lot status
    setHandovers(prev => prev.map(h => h.id === handover.id ? { ...h, status: 'COMPLETED' } : h));

    const paymentEvent = createTraceabilityEvent("Payment Recorded", "Today, Just now", "System", "Completed", `Transaction ${newTxId} recorded: ₹${totalVal.toLocaleString()} settled`);
    const completeEvent = createTraceabilityEvent("Transaction Completed", "Today, Just now", "Recycler", "Completed", `Recovery Certificate CERT-TN-2026-${Math.floor(1000 + Math.random() * 9000)} issued`);

    setMaterialLots(prev => prev.map(l => {
      if (l.id === handover.lotId) {
        return {
          ...l,
          status: "COMPLETED",
          timeline: [...(l.timeline || []), paymentEvent, completeEvent]
        };
      }
      return l;
    }));

    // Update collector wallet balance
    setCollectorProfile(prev => ({
      ...prev,
      walletBalance: (prev.walletBalance || 0) + totalVal
    }));

    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Today, Just now",
      action: "Payment Recorded & Transaction Completed",
      entity: `${newTxId} (₹${totalVal.toLocaleString()}) for Lot ${handover.lotId}`,
      status: "COMPLETED"
    };
    setAuditLogs(prev => [newLog, ...prev]);

    alert(`Payment recorded successfully! Transaction ID: ${newTxId}. Traceability completed.`);
  };

  // Step 7: Admin Actions
  const handleUpdateRecyclerStatus = (recyclerId, newStatus) => {
    setRecyclers(prev => prev.map(r => r.id === recyclerId ? { ...r, verificationStatus: newStatus } : r));
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: "Today, Just now",
      action: `Recycler Verification Changed to ${newStatus}`,
      entity: recyclerId,
      status: newStatus
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleToggleCollectorPhoneVerification = (collectorId) => {
    setCollectors(prev => prev.map(c => {
      if (c.id === collectorId) {
        const next = !c.phone_verified;
        return { ...c, phone_verified: next, phoneVerified: next };
      }
      return c;
    }));
  };

  const handleUpdateBenchmarkPrice = (priceId, newBenchPrice, newTolerance) => {
    setBenchmarkPrices(prev => prev.map(p => {
      if (p.id === priceId) {
        return {
          ...p,
          referencePrice: newBenchPrice,
          benchmarkPrice: newBenchPrice,
          tolerancePercent: newTolerance
        };
      }
      return p;
    }));
  };

  const handleResolveFlaggedOffer = (offerId, decision) => {
    setOffers(prev => prev.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          status: decision === 'APPROVE' ? 'PENDING' : 'REJECTED'
        };
      }
      return o;
    }));
  };

  // Compare Offers trigger
  const handleOpenCompareOffersModal = (lot) => {
    setSelectedLotForCompare(lot);
    setIsCompareOffersModalOpen(true);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F5EA] text-[#203128] antialiased font-sans">
        
        {/* Global Navigation Header */}
        <Navbar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          currentRole={currentRole}
          onChangeRole={(role) => setCurrentRole(role)}
        />

        {/* Dynamic View Body */}
        <div className="flex-1">
          {activeView === 'landing' && (
            <LandingView 
              setActiveView={setActiveView}
              onOpenSearchModal={() => setIsSearchModalOpen(true)}
            />
          )}

          {activeView === 'collector' && (
            <CollectorView 
              collectorProfile={collectorProfile}
              materialLots={materialLots}
              offers={offers}
              handovers={handovers}
              transactions={transactions}
              requirements={requirements}
              onOpenAddLotModal={() => setIsAddWasteModalOpen(true)}
              onOpenPhoneVerificationModal={() => setIsPhoneModalOpen(true)}
              onViewLotDetails={(lot) => {
                setSelectedLot(lot);
                setIsLotModalOpen(true);
              }}
              onOpenCompareOffers={handleOpenCompareOffersModal}
              onAcceptOffer={handleAcceptOffer}
              onRejectOffer={handleRejectOffer}
              onConfirmHandover={handleAdvanceHandover}
            />
          )}

          {activeView === 'recycler' && (
            <RecyclerView 
              recyclerProfile={activeRecycler}
              materialLots={materialLots}
              offers={offers}
              handovers={handovers}
              transactions={transactions}
              onOpenSubmitOffer={(lot) => {
                setSelectedLotForOffer(lot);
                setIsSubmitOfferModalOpen(true);
              }}
              onViewLotDetails={(lot) => {
                setSelectedLot(lot);
                setIsLotModalOpen(true);
              }}
              onAdvanceHandover={handleAdvanceHandover}
              onCompleteTransaction={handleRecordPayment}
              onOpenPostRequirementModal={() => setIsPostReqModalOpen(true)}
            />
          )}

          {activeView === 'generator' && (
            <GeneratorView 
              onOpenDisposeModal={() => setIsDisposeModalOpen(true)}
              onViewLotDetails={(lot) => {
                setSelectedLot(lot);
                setIsLotModalOpen(true);
              }}
              materialLots={materialLots}
            />
          )}

          {activeView === 'admin' && (
            <AdminView 
              collectors={collectors}
              recyclers={recyclers}
              materialLots={materialLots}
              offers={offers}
              transactions={transactions}
              benchmarkPrices={benchmarkPrices}
              auditLogs={auditLogs}
              onViewLotDetails={(lot) => {
                setSelectedLot(lot);
                setIsLotModalOpen(true);
              }}
              onUpdateRecyclerStatus={handleUpdateRecyclerStatus}
              onToggleCollectorPhoneVerification={handleToggleCollectorPhoneVerification}
              onUpdateBenchmarkPrice={handleUpdateBenchmarkPrice}
              onResolveFlaggedOffer={handleResolveFlaggedOffer}
            />
          )}

          {activeView === 'guide' && (
            <RecyclingGuideView 
              setActiveView={setActiveView}
              onOpenSearchModal={() => setIsSearchModalOpen(true)}
            />
          )}

          {activeView === 'locations' && (
            <FindLocationView 
              setActiveView={setActiveView}
            />
          )}

          {activeView === 'rewards' && (
            <RewardsView 
              setActiveView={setActiveView}
              currentPoints={userStats.earnedPoints}
            />
          )}
        </div>

        {/* Global Footer */}
        <Footer setActiveView={setActiveView} />

        {/* ---------------------------------------------------- */}
        {/* INTERACTIVE WORKFLOW MODALS */}
        {/* ---------------------------------------------------- */}

        {/* 1. Collector Phone Verification Modal */}
        <PhoneVerificationModal 
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
          currentPhone={collectorProfile.phone}
          onVerificationSuccess={handlePhoneVerified}
        />

        {/* 2. Add E-Waste & Structured Classification Modal */}
        <AddWasteModal 
          isOpen={isAddWasteModalOpen}
          onClose={() => setIsAddWasteModalOpen(false)}
          benchmarkPrices={benchmarkPrices}
          onLotCreated={handleAddWasteLot}
          collectorPhone={collectorProfile.phone}
          isPhoneVerified={collectorProfile.phoneVerified || collectorProfile.phone_verified}
          onRequirePhoneVerification={() => {
            setIsAddWasteModalOpen(false);
            setIsPhoneModalOpen(true);
          }}
        />

        {/* 3. Recycler Submit Offer Modal */}
        <SubmitOfferModal 
          isOpen={isSubmitOfferModalOpen}
          onClose={() => setIsSubmitOfferModalOpen(false)}
          lot={selectedLotForOffer}
          recycler={activeRecycler}
          onSubmitOffer={handleSubmitOffer}
        />

        {/* 4. Collector Compare Offers Modal */}
        <CompareOffersModal 
          isOpen={isCompareOffersModalOpen}
          onClose={() => setIsCompareOffersModalOpen(false)}
          lot={selectedLotForCompare}
          offers={offers.filter(o => o.lotId === selectedLotForCompare?.id)}
          onAcceptOffer={handleAcceptOffer}
          onRejectOffer={handleRejectOffer}
        />

        {/* 5. Digital Material Lot & Complete Traceability Timeline Modal */}
        <DigitalLotModal 
          isOpen={isLotModalOpen}
          onClose={() => setIsLotModalOpen(false)}
          lot={selectedLot}
          onUpdateLotStatus={(lotId, status, step) => {
            setMaterialLots(prev => prev.map(l => l.id === lotId ? { ...l, status } : l));
            if (selectedLot && selectedLot.id === lotId) {
              setSelectedLot(prev => ({ ...prev, status }));
            }
          }}
        />

        {/* Interactive Search Modal */}
        <CanIRecycleModal 
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          setActiveView={setActiveView}
        />

        {/* Recycler Post Requirement Modal */}
        <PostRequirementModal 
          isOpen={isPostReqModalOpen}
          onClose={() => setIsPostReqModalOpen(false)}
          onAddRequirement={(newReq) => {
            setRequirements(prev => [newReq, ...prev]);
            alert("Requirement successfully posted to ECO-Link marketplace!");
          }}
        />

        {/* Generator Dispose E-Waste Modal */}
        <DisposeEWasteModal 
          isOpen={isDisposeModalOpen}
          onClose={() => setIsDisposeModalOpen(false)}
          onDisposalCreated={(newDisp) => {
            setUserStats(prev => ({
              ...prev,
              totalRecycledKg: +(prev.totalRecycledKg + newDisp.weightKg).toFixed(1),
              co2SavedKg: +(prev.co2SavedKg + newDisp.co2SavedKg).toFixed(1),
              earnedPoints: prev.earnedPoints + newDisp.pointsAwarded
            }));
          }}
        />

      </div>
    </LanguageProvider>
  );
}
