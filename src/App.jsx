import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CanIRecycleModal from './components/Modals/CanIRecycleModal';
import DigitalLotModal from './components/Modals/DigitalLotModal';
import PriceWarningModal from './components/Modals/PriceWarningModal';
import RespondRequirementModal from './components/Modals/RespondRequirementModal';
import PostRequirementModal from './components/Modals/PostRequirementModal';
import DisposeEWasteModal from './components/Modals/DisposeEWasteModal';

import LandingView from './views/LandingView';
import CollectorView from './views/CollectorView';
import RecyclerView from './views/RecyclerView';
import GeneratorView from './views/GeneratorView';
import AdminView from './views/AdminView';
import RecyclingGuideView from './views/RecyclingGuideView';
import FindLocationView from './views/FindLocationView';
import RewardsView from './views/RewardsView';

import { LanguageProvider } from './i18n';
import { 
  initialRecyclerRequirements, 
  initialCollectors, 
  initialMaterialLots,
  userDashboardData 
} from './mockData';

export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [currentRole, setCurrentRole] = useState('public');

  // Shared Central State
  const [requirements, setRequirements] = useState(initialRecyclerRequirements);
  const [collectors, setCollectors] = useState(initialCollectors);
  const [materialLots, setMaterialLots] = useState(initialMaterialLots);
  const [userStats, setUserStats] = useState(userDashboardData);

  // Modals state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState(initialMaterialLots[0] || null);

  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [selectedReqForRespond, setSelectedReqForRespond] = useState(null);

  const [isPostReqModalOpen, setIsPostReqModalOpen] = useState(false);
  const [isDisposeModalOpen, setIsDisposeModalOpen] = useState(false);

  const [isPriceWarningOpen, setIsPriceWarningOpen] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const [pendingResponsePayload, setPendingResponsePayload] = useState(null);

  // 1. Recycler Selects Collector -> Creates Digital Material Lot
  const handleSelectCollectorAndCreateLot = (requirement, collector) => {
    const newLotId = `LOT-EL26-TN-${Math.floor(10000 + Math.random() * 90000)}`;
    const declaredItems = collector.declaredItems || [
      { id: "i-1", name: requirement.category, weightKg: collector.availableWeightKg || 10, referencePrice: requirement.targetPricePerKg, subtotal: (collector.availableWeightKg || 10) * requirement.targetPricePerKg }
    ];

    const totalWeight = declaredItems.reduce((s, i) => s + (i.weightKg || 0), 0);
    const estVal = declaredItems.reduce((s, i) => s + (i.subtotal || (i.weightKg * (i.referencePrice || 300))), 0);

    const newLot = {
      id: newLotId,
      requirementId: requirement.id,
      collectorId: collector.id,
      collectorName: collector.name,
      collectorPhone: collector.phone || "+91 98401 23456",
      recyclerId: requirement.recyclerId,
      recyclerName: requirement.recyclerName,
      cpcbRegistrationNo: requirement.cpcbRegistrationNo || "TN-EPR-2026-8821 (Demo)",
      qrPayload: `ECOLINK::${newLotId}::WEIGHT=${totalWeight}KG::VAL=${estVal}::RECYCLER=${requirement.recyclerName}`,
      items: declaredItems.map(d => ({
        name: d.material || d.name || requirement.category,
        weightKg: d.weightKg,
        referencePrice: d.referencePrice || 300,
        subtotal: d.subtotal || (d.weightKg * (d.referencePrice || 300))
      })),
      totalWeightKg: totalWeight,
      estimatedLotValue: estVal,
      averageReferenceRate: Math.round(estVal / (totalWeight || 1)),
      agreedAskingRatePerKg: collector.askingPricePerKg,
      agreedTotalValue: Math.round(totalWeight * collector.askingPricePerKg),
      priceWarningStatus: collector.hasPriceWarning ? "Flagged (+Above Ref)" : "Normal Range",
      location: requirement.location,
      createdDate: "Today, Just now",
      timelineStep: 5, // Handover Pending
      status: "Handover Pending",
      processingStages: [
        { stage: "Collected", completed: true, timestamp: "Today" },
        { stage: "Classified", completed: true, timestamp: "Today" },
        { stage: "Valued", completed: true, timestamp: "Today" },
        { stage: "Recycler Selected", completed: true, timestamp: "Today" },
        { stage: "Handover Pending", completed: true, timestamp: "Today" },
        { stage: "Recycler Received", completed: false, timestamp: null },
        { stage: "Recycling Completed", completed: false, timestamp: null }
      ]
    };

    setMaterialLots(prev => [newLot, ...prev]);
    setSelectedLot(newLot);
    setIsLotModalOpen(true);
  };

  // 2. Collector Responds to Recycler Requirement
  const handleCollectorResponse = (responsePayload) => {
    setIsRespondModalOpen(false);
    if (responsePayload.priceWarning?.isWarning) {
      setWarningData(responsePayload.priceWarning);
      setPendingResponsePayload(responsePayload);
      setIsPriceWarningOpen(true);
    } else {
      finalizeCollectorResponse(responsePayload);
    }
  };

  const finalizeCollectorResponse = (payload) => {
    const newCollectorEntry = {
      id: `COL-TN-${Math.floor(100 + Math.random() * 900)}`,
      name: payload.collectorName,
      location: "Chennai / Local Node",
      materials: [payload.items[0]?.material || "Mixed E-Waste"],
      availableWeightKg: payload.totalWeightKg,
      askingPricePerKg: payload.askingPricePerKg,
      reliabilityScore: 4.9,
      lotsCompleted: 12,
      phone: "+91 98401 99887",
      declaredItems: payload.items,
      hasPriceWarning: payload.priceWarning?.isWarning || false,
      priceWarningDetails: payload.priceWarning
    };

    setCollectors(prev => [newCollectorEntry, ...prev]);
    alert(`Response successfully submitted to ${payload.requirementId}! The recycler can now view your declared items and create a Digital Material Lot.`);
  };

  // 3. Update Material Lot Status (e.g. Handover confirmed -> Received -> Recycling Completed)
  const handleUpdateLotStatus = (lotId, nextStatus, nextStep) => {
    setMaterialLots(prev => prev.map(l => {
      if (l.id === lotId) {
        return {
          ...l,
          status: nextStatus,
          timelineStep: nextStep,
          proof: nextStep === 7 ? {
            recoveredGoldGrams: "0.92 g",
            recoveredCopperKg: "2.1 kg",
            recoveredAluminumKg: "3.4 kg",
            certificateId: `CERT-TN-2026-${Math.floor(1000 + Math.random() * 9000)}`
          } : l.proof
        };
      }
      return l;
    }));

    if (selectedLot && selectedLot.id === lotId) {
      setSelectedLot(prev => ({
        ...prev,
        status: nextStatus,
        timelineStep: nextStep,
        proof: nextStep === 7 ? {
          recoveredGoldGrams: "0.92 g",
          recoveredCopperKg: "2.1 kg",
          recoveredAluminumKg: "3.4 kg",
          certificateId: `CERT-TN-2026-${Math.floor(1000 + Math.random() * 9000)}`
        } : prev.proof
      }));
    }
  };

  // 4. Add new Recycler Requirement
  const handleAddRequirement = (newReq) => {
    setRequirements(prev => [newReq, ...prev]);
    alert("Requirement successfully posted to ECO-Link marketplace! Collectors in proximity will be notified.");
  };

  // 5. Add new Generator Disposal
  const handleDisposalCreated = (newDisp) => {
    setUserStats(prev => ({
      ...prev,
      totalRecycledKg: +(prev.totalRecycledKg + newDisp.weightKg).toFixed(1),
      co2SavedKg: +(prev.co2SavedKg + newDisp.co2SavedKg).toFixed(1),
      earnedPoints: prev.earnedPoints + newDisp.pointsAwarded
    }));
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
              requirements={requirements}
              materialLots={materialLots}
              onOpenRespondModal={(req) => {
                setSelectedReqForRespond(req);
                setIsRespondModalOpen(true);
              }}
              onViewLotDetails={(lot) => {
                setSelectedLot(lot);
                setIsLotModalOpen(true);
              }}
              onOpenDisposeModal={() => setIsDisposeModalOpen(true)}
            />
          )}

          {activeView === 'recycler' && (
            <RecyclerView 
              requirements={requirements}
              collectors={collectors}
              materialLots={materialLots}
              onOpenPostRequirementModal={() => setIsPostReqModalOpen(true)}
              onSelectCollectorAndCreateLot={handleSelectCollectorAndCreateLot}
              onViewLotDetails={(lot) => {
                setSelectedLot(lot);
                setIsLotModalOpen(true);
              }}
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
              requirements={requirements}
              collectors={collectors}
              materialLots={materialLots}
              onViewLotDetails={(lot) => {
                setSelectedLot(lot);
                setIsLotModalOpen(true);
              }}
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

        {/* Interactive Search Modal */}
        <CanIRecycleModal 
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          setActiveView={setActiveView}
        />

        {/* Digital Material Lot Signature Modal */}
        <DigitalLotModal 
          isOpen={isLotModalOpen}
          onClose={() => setIsLotModalOpen(false)}
          lot={selectedLot}
          onUpdateLotStatus={handleUpdateLotStatus}
        />

        {/* Collector Respond to Requirement Modal */}
        <RespondRequirementModal 
          isOpen={isRespondModalOpen}
          onClose={() => setIsRespondModalOpen(false)}
          requirement={selectedReqForRespond}
          onSubmitResponse={handleCollectorResponse}
        />

        {/* Recycler Post Requirement Modal */}
        <PostRequirementModal 
          isOpen={isPostReqModalOpen}
          onClose={() => setIsPostReqModalOpen(false)}
          onAddRequirement={handleAddRequirement}
        />

        {/* Generator Dispose E-Waste Modal */}
        <DisposeEWasteModal 
          isOpen={isDisposeModalOpen}
          onClose={() => setIsDisposeModalOpen(false)}
          onDisposalCreated={handleDisposalCreated}
        />

        {/* Price Warning Modal */}
        <PriceWarningModal 
          isOpen={isPriceWarningOpen}
          onClose={() => setIsPriceWarningOpen(false)}
          warningData={warningData}
          onEditPrice={() => {
            setIsPriceWarningOpen(false);
            setIsRespondModalOpen(true);
          }}
          onContinueAnyway={() => {
            setIsPriceWarningOpen(false);
            if (pendingResponsePayload) {
              finalizeCollectorResponse(pendingResponsePayload);
            }
          }}
        />

      </div>
    </LanguageProvider>
  );
}
