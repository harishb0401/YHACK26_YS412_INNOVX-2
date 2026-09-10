import { referenceScrapPrices } from './data/scrapPrices';
import { calculateReferenceValue, calculateAverageReferenceRate, checkPriceWarning } from './utils/rulesEngine';

/**
 * 1. Community & Platform Aggregate Stats
 */
export const communityImpactStats = {
  recycledKg: "38,650 kg",
  co2SavedKg: "24,800 kg",
  goldRecoveredGrams: "482.5 g",
  copperRecoveredKg: "3,820 kg",
  verifiedRecyclers: "14",
  activeCollectors: "86",
  monthlyGrowthPercent: "24%"
};

/**
 * 2. Active Recycler E-Waste Requirements (Recycler Demand)
 */
export const initialRecyclerRequirements = [
  {
    id: "REQ-2026-081",
    recyclerId: "REC-TN-01",
    recyclerName: "GreenCycle Material Recovery Ltd",
    cpcbRegistrationNo: "TN-EPR-2026-8821 (Demo)",
    isCpcbVerified: true,
    isPlatformVerified: true,
    category: "IT Equipment",
    requiredQuantityKg: 50,
    currentReceivedKg: 20,
    preferredCondition: "Mixed Condition",
    targetPricePerKg: 300,
    referenceMin: 280,
    referenceMax: 330,
    location: "Chennai - Ambattur Industrial Estate",
    postedDate: "08 Sep 2026",
    expiresInDays: 3,
    status: "Active",
    notes: "Requires desktop motherboards, enterprise laptops, and server racks for precious metal extraction."
  },
  {
    id: "REQ-2026-082",
    recyclerId: "REC-TN-02",
    recyclerName: "Madurai CleanMetals Eco-Processing",
    cpcbRegistrationNo: "TN-EPR-2026-4412 (Demo)",
    isCpcbVerified: true,
    isPlatformVerified: true,
    category: "Batteries",
    requiredQuantityKg: 100,
    currentReceivedKg: 45,
    preferredCondition: "Non-working / Scrap",
    targetPricePerKg: 460,
    referenceMin: 400,
    referenceMax: 500,
    location: "Madurai - Kappalur SIDCO",
    postedDate: "09 Sep 2026",
    expiresInDays: 5,
    status: "Active",
    notes: "High demand for Li-ion packs and power bank cells. Sealed packaging preferred."
  },
  {
    id: "REQ-2026-083",
    recyclerId: "REC-TN-03",
    recyclerName: "Kongu Eco-Refinery & Circular Solutions",
    cpcbRegistrationNo: "TN-EPR-2026-9055 (Demo)",
    isCpcbVerified: true,
    isPlatformVerified: true,
    category: "Components",
    requiredQuantityKg: 30,
    currentReceivedKg: 0,
    preferredCondition: "Non-working / Scrap",
    targetPricePerKg: 650,
    referenceMin: 600,
    referenceMax: 720,
    location: "Coimbatore - Peelamedu",
    postedDate: "10 Sep 2026",
    expiresInDays: 4,
    status: "Active",
    notes: "Specialized in telecom grade PCBs and server interface boards."
  }
];

/**
 * 3. Informal Collectors Database
 */
export const initialCollectors = [
  {
    id: "COL-TN-101",
    name: "Ramesh Kumar (Apex Scrap Collection)",
    location: "Chennai - Guindy",
    materials: ["IT Equipment", "Components", "Cables & Wiring"],
    availableWeightKg: 15,
    askingPricePerKg: 310, // normal range
    reliabilityScore: 4.9,
    lotsCompleted: 28,
    phone: "+91 98401 23456",
    declaredItems: [
      { id: "i-1", material: "Laptop / Notebook", weightKg: 8, referencePrice: 300 },
      { id: "i-2", material: "Mobile Phones & Tablets", weightKg: 3, referencePrice: 500 },
      { id: "i-3", material: "Printers & Scanners", weightKg: 4, referencePrice: 200 }
    ]
  },
  {
    id: "COL-TN-102",
    name: "Velu Pandian (Madurai Urban Collectors)",
    location: "Madurai - Goripalayam",
    materials: ["Batteries", "IT Equipment"],
    availableWeightKg: 25,
    askingPricePerKg: 420, // slightly high for IT, normal for battery
    reliabilityScore: 4.7,
    lotsCompleted: 14,
    phone: "+91 94432 87654",
    declaredItems: [
      { id: "i-4", material: "Lithium-Ion Battery Packs", weightKg: 20, referencePrice: 450 },
      { id: "i-5", material: "Copper Cable & Insulated Wires", weightKg: 5, referencePrice: 220 }
    ]
  },
  {
    id: "COL-TN-103",
    name: "Karthik Raja (Citywide Tech Recyclers)",
    location: "Chennai - Ambattur",
    materials: ["IT Equipment", "Components"],
    availableWeightKg: 20,
    askingPricePerKg: 440, // EXCEEDS normal range! Triggers Price Warning demo
    reliabilityScore: 4.8,
    lotsCompleted: 19,
    phone: "+91 97890 54321",
    declaredItems: [
      { id: "i-6", material: "High-Grade PCB Circuit Boards", weightKg: 12, referencePrice: 650 },
      { id: "i-7", material: "Laptop / Notebook", weightKg: 8, referencePrice: 300 }
    ]
  }
];

/**
 * 4. Digital Material Lots (The central signature traceability entity)
 */
export const initialMaterialLots = [
  {
    id: "LOT-EL26-TN-00125",
    requirementId: "REQ-2026-081",
    collectorId: "COL-TN-101",
    collectorName: "Ramesh Kumar (Apex Scrap Collection)",
    collectorPhone: "+91 98401 23456",
    recyclerId: "REC-TN-01",
    recyclerName: "GreenCycle Material Recovery Ltd",
    cpcbRegistrationNo: "TN-EPR-2026-8821 (Demo)",
    qrPayload: "ECOLINK::LOT-EL26-TN-00125::WEIGHT=10KG::EST_VAL=3100::RECYCLER=GreenCycle",
    items: [
      { id: "item-1", name: "Laptop", weightKg: 5, referencePrice: 300, subtotal: 1500 },
      { id: "item-2", name: "Mobile", weightKg: 2, referencePrice: 500, subtotal: 1000 },
      { id: "item-3", name: "Printer", weightKg: 3, referencePrice: 200, subtotal: 600 }
    ],
    totalWeightKg: 10,
    estimatedLotValue: 3100, // ₹3,100
    averageReferenceRate: 333, // ₹333/kg
    agreedAskingRatePerKg: 310, // ₹310/kg
    agreedTotalValue: 3100,
    priceWarningStatus: "Normal Range",
    location: "Chennai - Ambattur Industrial Estate",
    createdDate: "09 Sep 2026, 11:30 AM",
    timelineStep: 5, // 1: Collected, 2: Classified, 3: Valued, 4: Recycler Selected, 5: Handover Pending, 6: Recycler Received, 7: Recycling Completed
    status: "Handover Pending",
    processingStages: [
      { stage: "Collected", completed: true, timestamp: "09 Sep 2026, 09:15 AM" },
      { stage: "Classified", completed: true, timestamp: "09 Sep 2026, 10:00 AM" },
      { stage: "Valued", completed: true, timestamp: "09 Sep 2026, 10:45 AM" },
      { stage: "Recycler Selected", completed: true, timestamp: "09 Sep 2026, 11:30 AM" },
      { stage: "Handover Pending", completed: true, timestamp: "09 Sep 2026, 02:00 PM" },
      { stage: "Recycler Received", completed: false, timestamp: null },
      { stage: "Recycling Completed", completed: false, timestamp: null }
    ],
    proof: {
      recoveredGoldGrams: "0.85 g",
      recoveredCopperKg: "1.4 kg",
      recoveredAluminumKg: "2.1 kg",
      certificateId: "CERT-TN-2026-0091"
    }
  },
  {
    id: "LOT-EL26-TN-00124",
    requirementId: "REQ-2026-082",
    collectorId: "COL-TN-102",
    collectorName: "Velu Pandian (Madurai Urban Collectors)",
    collectorPhone: "+91 94432 87654",
    recyclerId: "REC-TN-02",
    recyclerName: "Madurai CleanMetals Eco-Processing",
    cpcbRegistrationNo: "TN-EPR-2026-4412 (Demo)",
    qrPayload: "ECOLINK::LOT-EL26-TN-00124::WEIGHT=25KG::EST_VAL=10100::RECYCLER=MaduraiCleanMetals",
    items: [
      { id: "item-4", name: "Lithium-Ion Battery Packs", weightKg: 20, referencePrice: 450, subtotal: 9000 },
      { id: "item-5", name: "Copper Cable & Insulated Wires", weightKg: 5, referencePrice: 220, subtotal: 1100 }
    ],
    totalWeightKg: 25,
    estimatedLotValue: 10100,
    averageReferenceRate: 335,
    agreedAskingRatePerKg: 420,
    agreedTotalValue: 10500,
    priceWarningStatus: "Normal Range",
    location: "Madurai - Kappalur SIDCO",
    createdDate: "07 Sep 2026, 04:15 PM",
    timelineStep: 7, // Recycling Completed
    status: "Recycling Completed",
    processingStages: [
      { stage: "Collected", completed: true, timestamp: "07 Sep 2026, 02:00 PM" },
      { stage: "Classified", completed: true, timestamp: "07 Sep 2026, 03:00 PM" },
      { stage: "Valued", completed: true, timestamp: "07 Sep 2026, 03:45 PM" },
      { stage: "Recycler Selected", completed: true, timestamp: "07 Sep 2026, 04:15 PM" },
      { stage: "Handover Pending", completed: true, timestamp: "08 Sep 2026, 10:00 AM" },
      { stage: "Recycler Received", completed: true, timestamp: "08 Sep 2026, 01:30 PM" },
      { stage: "Recycling Completed", completed: true, timestamp: "09 Sep 2026, 05:00 PM" }
    ],
    proof: {
      recoveredGoldGrams: "0.0 g",
      recoveredCopperKg: "4.8 kg",
      recoveredAluminumKg: "3.2 kg",
      recoveredLithiumKg: "1.9 kg",
      certificateId: "CERT-TN-2026-0088"
    }
  }
];

/**
 * 5. Generator User Disposals & Receipts
 */
export const generatorDisposalsList = [
  {
    id: "DISP-2026-301",
    date: "10 Sep 2026",
    deviceType: "Old Dell Laptop & Power Adapter",
    weightKg: 3.2,
    pointsAwarded: 180,
    collectorAssigned: "Ramesh Kumar (Apex Scrap Collection)",
    lotId: "LOT-EL26-TN-00125",
    status: "In Material Lot",
    co2SavedKg: 4.8
  },
  {
    id: "DISP-2026-288",
    date: "02 Sep 2026",
    deviceType: "2 Broken Android Phones & Charger",
    weightKg: 0.8,
    pointsAwarded: 90,
    collectorAssigned: "Velu Pandian",
    lotId: "LOT-EL26-TN-00124",
    status: "Recycled & Certified ✓",
    co2SavedKg: 1.2
  }
];

/**
 * 6. Admin Platform Audit Logs & Health
 */
export const adminAuditLogs = [
  { id: "log-1", timestamp: "10 Sep 2026, 19:42", action: "CPCB Audit Verified", entity: "REC-TN-01 (GreenCycle)", status: "Success" },
  { id: "log-2", timestamp: "10 Sep 2026, 17:15", action: "Price Warning Triggered", entity: "COL-TN-103 (Karthik Raja)", status: "Flagged (+33% above ref)" },
  { id: "log-3", timestamp: "10 Sep 2026, 14:00", action: "Digital Lot Created", entity: "LOT-EL26-TN-00125 (10 kg)", status: "Active" },
  { id: "log-4", timestamp: "09 Sep 2026, 17:00", action: "Certificate Issued", entity: "LOT-EL26-TN-00124 (Madurai CleanMetals)", status: "Completed" }
];

/**
 * 7. Public Educational Guides & Locations
 */
export const recyclingCategories = [
  {
    id: "it-telecom",
    name: "IT & Telecommunications",
    icon: "💻",
    color: "bg-indigo-100/70 text-indigo-900 border-indigo-200",
    description: "Laptops, desktop servers, routers, motherboards, CRT/LED monitors.",
    status: "Formal Recovery Only ⚡",
    referenceRate: "₹300/kg",
    prepSteps: [
      "Wipe sensitive personal data / factory reset",
      "Keep internal components and motherboards intact",
      "Pack power adapters and charging leads together"
    ],
    dontRecycle: [
      "Items with swollen or punctured battery packs",
      "Burnt or acid-leaked internal assemblies"
    ]
  },
  {
    id: "consumer-elec",
    name: "Consumer Electronics",
    icon: "📱",
    color: "bg-emerald-100/70 text-emerald-900 border-emerald-200",
    description: "Smartphones, tablets, audio systems, smartwatches, cameras.",
    status: "High Precious Metal Yield ✨",
    referenceRate: "₹500/kg",
    prepSteps: [
      "Remove SIM and external SD storage cards",
      "Do not manually smash or burn casing",
      "Separate detachable covers from main chassis"
    ],
    dontRecycle: [
      "Water-submerged corroded battery compartments in domestic bins"
    ]
  },
  {
    id: "batteries",
    name: "Batteries & Energy Storage",
    icon: "🔋",
    color: "bg-yellow-100/70 text-yellow-900 border-yellow-200",
    description: "Lithium-Ion cells, laptop battery packs, UPS lead-acid units.",
    status: "Hazardous / CPCB Regulated ⚠️",
    referenceRate: "₹450/kg",
    prepSteps: [
      "Insulate electrode terminals with non-conductive tape",
      "Store in a dry, ventilated, shock-resistant crate",
      "Keep away from heat or open sparks"
    ],
    dontRecycle: [
      "Punctured smoking cells - seek emergency disposal"
    ]
  },
  {
    id: "components",
    name: "Circuit Boards & Components",
    icon: "🔌",
    color: "bg-amber-100/70 text-amber-900 border-amber-200",
    description: "High-grade telecom PCBs, gold-plated connectors, IC chips, RAM modules.",
    status: "Refinery Grade 🥇",
    referenceRate: "₹650/kg",
    prepSteps: [
      "Avoid abrasive chemical washing",
      "Keep boards flat to prevent trace cracking"
    ],
    dontRecycle: [
      "Paints or oil-soaked scrap assemblies"
    ]
  }
];

export const searchableMaterials = [
  {
    keywords: ["laptop", "notebook", "computer", "pc", "macbook"],
    item: "Laptop / Notebook Computer",
    isRecyclable: true,
    category: "IT Equipment",
    icon: "💻",
    referencePrice: "₹300/kg",
    prep: "1. Backup data & reset.\n2. Do not puncture battery.\n3. Hand over to verified ECO-Link collector.",
    badge: "CPCB Recyclable ✓"
  },
  {
    keywords: ["phone", "mobile", "smartphone", "iphone", "android"],
    item: "Mobile Phones & Tablets",
    isRecyclable: true,
    category: "Consumer Electronics",
    icon: "📱",
    referencePrice: "₹500/kg",
    prep: "1. Remove SIM/SD card.\n2. Keep screen and body together.\n3. Log for doorstep collection.",
    badge: "High Metal Yield ✨"
  },
  {
    keywords: ["battery", "lithium", "power bank", "li-ion"],
    item: "Lithium-Ion Battery Pack",
    isRecyclable: true,
    specialDisposal: true,
    category: "Batteries",
    icon: "🔋",
    referencePrice: "₹450/kg",
    prep: "1. Tape copper terminals.\n2. Store in dry non-conductive box.\n3. Handover to verified e-waste collector.",
    badge: "Hazardous Drop-off ⚠️"
  },
  {
    keywords: ["printer", "scanner", "copier"],
    item: "Office Printer / Scanner",
    isRecyclable: true,
    category: "IT Equipment",
    icon: "🖨️",
    referencePrice: "₹200/kg",
    prep: "1. Remove ink cartridges/toners.\n2. Bundle power cord securely.",
    badge: "CPCB Recyclable ✓"
  }
];

export const recyclingLocations = [
  {
    id: "loc-1",
    name: "GreenCycle Material Recovery Hub",
    address: "Plot 42, SIDCO Industrial Estate, Ambattur, Chennai",
    distance: "1.2 km away",
    acceptedMaterials: ["IT Equipment", "Components", "Cables & Wiring"],
    cpcbRegistrationNo: "TN-EPR-2026-8821 (Demo)",
    hours: "Mon - Sat: 8:30 AM - 6:30 PM",
    rating: 4.95,
    phone: "+91 44 2688 1234",
    lat: 13.0827,
    lng: 80.2707
  },
  {
    id: "loc-2",
    name: "Madurai CleanMetals Eco-Processing Facility",
    address: "Kappalur Industrial Area, Sector 3, Madurai",
    distance: "2.8 km away",
    acceptedMaterials: ["Batteries", "Consumer Electronics", "Components"],
    cpcbRegistrationNo: "TN-EPR-2026-4412 (Demo)",
    hours: "Mon - Sat: 9:00 AM - 6:00 PM",
    rating: 4.88,
    phone: "+91 452 245 6789",
    lat: 9.9252,
    lng: 78.1198
  },
  {
    id: "loc-3",
    name: "Kongu Circular Resource Node",
    address: "Peelamedu Tech Corridor, Coimbatore",
    distance: "3.5 km away",
    acceptedMaterials: ["IT Equipment", "Large Appliances", "Cables"],
    cpcbRegistrationNo: "TN-EPR-2026-9055 (Demo)",
    hours: "Mon - Fri: 8:00 AM - 5:30 PM",
    rating: 4.92,
    phone: "+91 422 257 8901",
    lat: 11.0168,
    lng: 76.9558
  }
];

export const userDashboardData = {
  userName: "Sundar Rajan",
  totalRecycledKg: 42,
  co2SavedKg: 18.6,
  earnedPoints: 850,
  targetPoints: 1000,
  tier: "Eco Contributor",
  tierProgressPercent: 85,
  recentActivity: [
    { id: "act-1", category: "Laptop & Peripherals", weightKg: 8.5, points: 240, date: "Today, 11:30 AM", icon: "💻" },
    { id: "act-2", category: "Mobile Phones", weightKg: 1.2, points: 120, date: "Yesterday, 4:10 PM", icon: "📱" },
    { id: "act-3", category: "Lithium Battery", weightKg: 3.0, points: 180, date: "05 Sep 2026", icon: "🔋" }
  ]
};

export const ecoJournalArticles = [
  {
    id: "art-1",
    title: "How formal e-waste recovery extracts 98% pure Gold and Copper",
    category: "Material Recovery",
    readTime: "4 min read",
    icon: "🥇",
    summary: "Discover the hydrometallurgical and mechanical separation techniques used by verified recyclers in Tamil Nadu."
  },
  {
    id: "art-2",
    title: "Understanding CPCB and EPR compliance for e-waste collectors",
    category: "Regulatory Standards",
    readTime: "5 min read",
    icon: "📜",
    summary: "Why traceability and digital material lot certificates are mandatory under national Extended Producer Responsibility guidelines."
  },
  {
    id: "art-3",
    title: "Fair reference scrap pricing: Empowering informal collectors",
    category: "Circularity & Economy",
    readTime: "3 min read",
    icon: "⚖️",
    summary: "How transparent rule-based reference ranges eliminate middleman exploitation and ensure fair per-kilogram settlements."
  }
];

export const communityTestimonials = [
  {
    quote: "As an informal collector, ECO-Link gives me direct access to registered recyclers with transparent reference pricing. My daily earnings grew by 35% without middleman cuts!",
    name: "Ramesh Kumar",
    location: "Chennai, Tamil Nadu",
    role: "Verified Collector",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop"
  },
  {
    quote: "Creating digital lots with QR verification gives our facility 100% auditable evidence for CPCB and EPR reporting. The rule-based price check saves hours of negotiation.",
    name: "Dr. K. Senthil Nathan",
    location: "GreenCycle Material Recovery, Ambattur",
    role: "Verified Recycler Manager",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop"
  },
  {
    quote: "Disposing of our company's outdated laptops was effortless. We received a digital material lot tracking link and green receipt the same afternoon.",
    name: "Ananya Krishnan",
    location: "Tidel Park, Coimbatore",
    role: "IT Asset Manager",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop"
  }
];

export const rewardsList = [
  {
    id: "rew-1",
    title: "Reusable Stainless Water Bottle",
    pointsRequired: 1500,
    icon: "🥤",
    description: "Insulated 750ml double-wall stainless steel bottle with ECO-Link logo.",
    category: "Eco Merchandise",
    isRedeemable: false
  },
  {
    id: "rew-2",
    title: "Organic Cotton Canvas Tote Bag",
    pointsRequired: 800,
    icon: "🛍️",
    description: "100% unbleached organic cotton heavy-duty grocery tote bag.",
    category: "Eco Merchandise",
    isRedeemable: true
  },
  {
    id: "rew-3",
    title: "Plant 1 Native Forest Tree",
    pointsRequired: 500,
    icon: "🌳",
    description: "We plant a verified native sapling in your name with GPS tracking certificate.",
    category: "Direct Restoration",
    isRedeemable: true
  },
  {
    id: "rew-4",
    title: "Ceramic Bamboo Travel Coffee Mug",
    pointsRequired: 2000,
    icon: "☕",
    description: "Sleek ceramic travel tumbler with spill-proof bamboo lid.",
    category: "Eco Merchandise",
    isRedeemable: false
  }
];

