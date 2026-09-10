import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { LanguageProvider } from './i18n';
import {
  mockCollectors,
  mockRecyclers,
  mockWasteLots,
  mockTransactions,
  mockOffers,
  mockCollector,
  mockRecycler,
  mockAdmin
} from './data/mockData';

export default function App() {
  const navigate = useNavigate();

  // Active User / Auth State
  const [currentUser, setCurrentUser] = useState(null);

  // Platform Data
  const [materialLots, setMaterialLots] = useState(mockWasteLots);
  const [offers, setOffers] = useState(mockOffers);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [collectors, setCollectors] = useState(mockCollectors);
  const [recyclers, setRecyclers] = useState(mockRecyclers);

  // Auth Handlers
  const handleLoginSuccess = (userPayload) => {
    setCurrentUser(userPayload);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  // Collector Workflow: Create E-Waste Request
  const handleLotCreated = (newLotData) => {
    const newLotId = `REQ-2026-${String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6)}`;
    const declaredQuotedPrice = newLotData.quotedPrice !== undefined ? newLotData.quotedPrice : (newLotData.benchmarkPrice || 350);
    const newLot = {
      id: newLotId,
      category: newLotData.category,
      material: newLotData.material,
      quantity: newLotData.quantity,
      totalWeightKg: newLotData.quantity,
      unit: newLotData.unit || 'kg',
      condition: newLotData.condition || 'Non-working / Scrap',
      location: newLotData.location || (currentUser?.location || 'Chennai Hub'),
      collectionDate: newLotData.collectionDate || new Date().toISOString().split('T')[0],
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      benchmarkPrice: newLotData.benchmarkPrice || 350,
      quotedPrice: declaredQuotedPrice,
      estimatedLotValue: newLotData.estimatedLotValue !== undefined ? newLotData.estimatedLotValue : Math.round(newLotData.quantity * declaredQuotedPrice),
      isPreCleared: newLotData.isPreCleared !== undefined ? newLotData.isPreCleared : true,
      clearanceBadge: newLotData.clearanceBadge || "PRE-CLEARED ✅",
      clearanceStatus: newLotData.clearanceStatus || "PRE_CLEARED",
      allowedPriceRange: newLotData.allowedPriceRange,
      status: 'AWAITING_OFFERS',
      qrPayload: `EPR-QR-${newLotId}`,
      collectorId: currentUser?.id || "COL-TN-101",
      collectorName: currentUser?.name || "Ramesh Kumar (Apex Scrap)",
      notes: newLotData.notes || "Declared via collector portal",
      timeline: [
        {
          id: `ev-1`,
          event: "Request Created",
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          userRole: "Collector",
          status: "Completed",
          details: `${newLotData.quantity} ${newLotData.unit || 'kg'} ${newLotData.material} declared`
        },
        {
          id: `ev-2`,
          event: "Price Bounds & Quote Validated",
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          userRole: "Rules Engine",
          status: "Completed",
          details: `Benchmark: ₹${newLotData.benchmarkPrice || 350}/${newLotData.unit || 'kg'} | Quoted: ₹${declaredQuotedPrice}/${newLotData.unit || 'kg'} (${newLotData.clearanceBadge || 'PRE-CLEARED ✅'})`
        },
        {
          id: `ev-3`,
          event: "Recyclers Notified",
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          userRole: "System",
          status: "Completed",
          details: "Broadcasted to authorized recyclers in your zone"
        }
      ]
    };

    setMaterialLots([newLot, ...materialLots]);
  };

  // Recycler Workflow: Submit Price Offer on Collector Request
  const handleSubmitOffer = (newOfferData) => {
    const offerId = `OFF-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const newOffer = {
      id: offerId,
      lotId: newOfferData.lotId,
      recyclerId: newOfferData.recyclerId || "REC-TN-01",
      recyclerName: newOfferData.recyclerName || "GreenCycle Material Recovery Ltd",
      recyclerVerified: true,
      pricePerUnit: newOfferData.pricePerUnit,
      totalPrice: newOfferData.totalPrice,
      fairPriceStatus: newOfferData.fairPriceStatus || "FAIR",
      fairPriceBadge: "FAIR ✓",
      status: "PENDING",
      timestamp: newOfferData.timestamp || "Just now",
      proposedPickupDate: newOfferData.proposedPickupDate || "Within 48h",
      notes: newOfferData.notes || "Direct factory pickup arranged with certified weighing scales."
    };

    // Add offer to state
    setOffers([newOffer, ...offers]);

    // Update the lot's status to OFFERS_RECEIVED if awaiting
    setMaterialLots(materialLots.map(lot => {
      if (lot.id === newOfferData.lotId && ['AWAITING_OFFERS', 'SUBMITTED', 'AVAILABLE', 'REGISTERED'].includes(lot.status)) {
        return {
          ...lot,
          status: 'OFFERS_RECEIVED',
          timeline: [
            ...(lot.timeline || []),
            {
              id: `ev-${Date.now()}`,
              event: "Offer Received",
              timestamp: "Just now",
              userRole: "Recycler",
              status: "Completed",
              details: `Offer submitted: ₹${newOfferData.pricePerUnit}/kg (Total: ₹${(newOfferData.totalPrice || 0).toLocaleString()}) by ${newOfferData.recyclerName}`
            }
          ]
        };
      }
      return lot;
    }));
  };

  // Collector Workflow: Accept One Recycler Offer
  const handleAcceptOffer = (acceptPayload) => {
    const { requestId, offerId, recyclerId, recyclerName, agreedPricePerUnit, agreedTotalValue, proposedPickupDate } = acceptPayload;

    // 1. Update Offer status
    setOffers(offers.map(o => {
      if (o.id === offerId) {
        return { ...o, status: 'ACCEPTED' };
      }
      if (o.lotId === requestId && o.id !== offerId) {
        return { ...o, status: 'REJECTED' };
      }
      return o;
    }));

    // 2. Update Request / Lot status to OFFER_ACCEPTED
    setMaterialLots(materialLots.map(lot => {
      if (lot.id === requestId) {
        return {
          ...lot,
          status: 'OFFER_ACCEPTED',
          selectedRecyclerId: recyclerId,
          selectedRecyclerName: recyclerName,
          agreedPricePerUnit: agreedPricePerUnit,
          agreedTotalValue: agreedTotalValue,
          timeline: [
            ...(lot.timeline || []),
            {
              id: `ev-${Date.now()}`,
              event: "Offer Accepted",
              timestamp: "Just now",
              userRole: "Collector",
              status: "Completed",
              details: `Collector accepted offer from ${recyclerName} (₹${agreedPricePerUnit}/kg, Total: ₹${(agreedTotalValue || 0).toLocaleString()})`
            },
            {
              id: `ev-${Date.now() + 1}`,
              event: "Pickup Scheduled",
              timestamp: "Just now",
              userRole: "Logistics",
              status: "Active",
              details: `Scheduled for pickup on ${proposedPickupDate || "upcoming business day"}`
            }
          ]
        };
      }
      return lot;
    }));


    // 3. Create or update a Transaction record with ESCROW_LOCKED status
    const newTxn = {
      id: `TXN-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
      lotId: requestId,
      collectorId: currentUser?.id || "COL-TN-101",
      collectorName: currentUser?.name || "Ramesh Kumar",
      recyclerId: recyclerId,
      recyclerName: recyclerName,
      totalWeightKg: materialLots.find(l => l.id === requestId)?.quantity || 25,
      ratePerKg: agreedPricePerUnit,
      totalValue: agreedTotalValue,
      status: "ESCROW_LOCKED",
      paymentMethod: "Eco-Link Smart Escrow (UPI/NEFT)",
      date: new Date().toISOString().split('T')[0],
      qrHash: `TXN-VERIFIED-${requestId}`
    };

    setTransactions([newTxn, ...transactions]);
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F8F5EA] text-[#203128] font-sans antialiased selection:bg-[#3F7655]/20 selection:text-[#203128]">
        <AppRoutes
          currentUser={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          materialLots={materialLots}
          offers={offers}
          onLotCreated={handleLotCreated}
          onSubmitOffer={handleSubmitOffer}
          onAcceptOffer={handleAcceptOffer}
          transactions={transactions}
          collectors={collectors}
          recyclers={recyclers}
        />
      </div>
    </LanguageProvider>
  );
}
