import { structuredEWasteCategories, referenceScrapPrices } from './scrapPrices';
import { calculateFairPriceRange, createTraceabilityEvent } from '../utils/rulesEngine';
export * from '../mockData';

// Aliases and Convenience exports for clean page imports
import { 
  initialMaterialLots, 
  initialRecyclers, 
  initialCollectors, 
  initialTransactions, 
  initialOffers, 
  initialHandovers,
  adminAuditLogs,
  initialRecyclerRequirements,
  userDashboardData
} from '../mockData';

export const mockWasteLots = initialMaterialLots;
export const mockRecyclers = initialRecyclers;
export const mockCollectors = initialCollectors;
export const mockTransactions = initialTransactions;
export const mockOffers = initialOffers;
export const mockHandovers = initialHandovers;
export const mockAuditLogs = adminAuditLogs;
export const mockRequirements = initialRecyclerRequirements;
export const mockBenchmarkPrices = referenceScrapPrices;
export const mockUserStats = userDashboardData;

export const mockCollector = {
  id: "COL-TN-101",
  name: "Ramesh Kumar (Apex Scrap Collection)",
  phone: "+91 98401 23456",
  phoneVerified: true,
  phone_verified: true,
  email: "ramesh@apexscrap.com",
  location: "Guindy Industrial Estate, Chennai",
  rating: 4.9,
  walletBalance: 14500,
  totalWeightCollected: 3820,
  activeLotsCount: 8
};

export const mockRecycler = {
  id: "REC-TN-01",
  companyName: "GreenCycle Material Recovery Ltd",
  contactPerson: "Dr. K. Senthil Nathan",
  phone: "+91 94441 23456",
  email: "procurement@greencycle.in",
  location: "Ambattur Industrial Estate, Chennai",
  cpcbRegistrationNo: "TN-EPR-2026-8821 (Verified)",
  verificationStatus: "VERIFIED",
  capacityMonthlyKg: 50000,
  currentIntakeKg: 28400,
  rating: 4.95
};

export const mockAdmin = {
  id: "ADM-01",
  name: "Platform Administrator",
  email: "admin@ecolink.gov.in",
  role: "admin",
  department: "CPCB / TNPCB Digital Monitoring Cell",
  lastLogin: "Today, Just now"
};

export const mockCollectorNotifications = [
  { id: 1, title: "Offer Received: ₹670/kg", desc: "GreenCycle submitted an offer on LOT-00125", time: "5m ago", type: "offer", unread: true },
  { id: 2, title: "Phone Verified ✓", desc: "Your mobile number +91 98401 23456 has been verified via OTP", time: "1h ago", type: "system", unread: false },
  { id: 3, title: "Handover Scheduled", desc: "Pickup driver assigned for LOT-00124 (Madurai Drop Node)", time: "Yesterday", type: "handover", unread: false },
  { id: 4, title: "Settlement Paid: ₹11,500", desc: "Direct NEFT settlement recorded for LOT-00124", time: "2d ago", type: "payment", unread: false }
];

export const mockRecyclerNotifications = [
  { id: 1, title: "New Matching Lot", desc: "30 kg Copper wiring available in Guindy Industrial Estate", time: "12m ago", type: "match", unread: true },
  { id: 2, title: "Offer Accepted", desc: "Collector accepted your bid of ₹670/kg on LOT-00125", time: "2h ago", type: "offer", unread: true },
  { id: 3, title: "CPCB Audit Verified", desc: "EPR Compliance status: Active & Certified by TNPCB", time: "3d ago", type: "compliance", unread: false }
];

export const mockAdminNotifications = [
  { id: 1, title: "1 Flagged Offer for Review", desc: "Offer of ₹190/kg on LOT-00127 is 21% below benchmark", time: "15m ago", type: "flagged", unread: true },
  { id: 2, title: "New Recycler Verification Request", desc: "Salem Electro-Smelt applied for CPCB authorization audit", time: "1h ago", type: "audit", unread: true },
  { id: 3, title: "Benchmark Rates Updated", desc: "Lithium & PCB baseline rate updated for Tamil Nadu zone", time: "Yesterday", type: "pricing", unread: false }
];

export const mockNotifications = {
  collector: mockCollectorNotifications,
  recycler: mockRecyclerNotifications,
  admin: mockAdminNotifications
};
