/**
 * Reference & Benchmark Scrap Price Dataset (ECO-Link Deterministic Pricing)
 * 10 Structured Categories with default Benchmark Prices and 25% Tolerance
 */
export const structuredEWasteCategories = [
  {
    id: "cat-pcb",
    name: "PCB / Electronic Components",
    category: "PCB / Electronic Components",
    benchmarkPrice: 650, // ₹650/kg
    tolerance: 0.25, // ±25%
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Gold (Au)", "Silver (Ag)", "Copper (Cu)", "Tin (Sn)"],
    defaultCondition: "Non-working / Scrap",
    icon: "🔌",
    description: "High-grade telecom boards, motherboard PCBs, server cards, memory modules."
  },
  {
    id: "cat-copper",
    name: "Copper",
    category: "Copper",
    benchmarkPrice: 720, // ₹720/kg
    tolerance: 0.20, // ±20%
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Refined Copper (>99% pure)"],
    defaultCondition: "Non-working / Scrap",
    icon: "🥉",
    description: "Stripped copper windings, transformer busbars, motor armatures, pure copper tubes."
  },
  {
    id: "cat-aluminum",
    name: "Aluminium",
    category: "Aluminium",
    benchmarkPrice: 210, // ₹210/kg
    tolerance: 0.20, // ±20%
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Secondary Aluminium Ingot"],
    defaultCondition: "Scrap",
    icon: "⚙️",
    description: "Extruded heat sinks, alloy casings, laptop chassis frames, capacitor cans."
  },
  {
    id: "cat-ferrous",
    name: "Ferrous Metals",
    category: "Ferrous Metals",
    benchmarkPrice: 42, // ₹42/kg
    tolerance: 0.25, // ±25%
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Heavy Melting Steel (HMS)", "Cast Iron"],
    defaultCondition: "Scrap",
    icon: "🧲",
    description: "Server rack frames, power supply steel enclosures, chassis brackets, transformer cores."
  },
  {
    id: "cat-plastics",
    name: "Plastics",
    category: "Plastics",
    benchmarkPrice: 35, // ₹35/kg
    tolerance: 0.25, // ±25%
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["ABS Regrind", "Polycarbonate (PC)", "HIPS Flakes"],
    defaultCondition: "Scrap",
    icon: "♻️",
    description: "Flame-retardant computer housings, printer ABS shells, keyboard frames."
  },
  {
    id: "cat-batteries",
    name: "Batteries",
    category: "Batteries",
    benchmarkPrice: 450, // ₹450/kg
    tolerance: 0.25, // ±25%
    unit: "₹/kg",
    hazardLevel: "High",
    recoveryMetals: ["Lithium (Li)", "Cobalt (Co)", "Nickel (Ni)", "Lead (Pb)"],
    defaultCondition: "Non-working / Scrap",
    icon: "🔋",
    description: "Lithium-Ion pouch & 18650 cells, laptop battery packs, sealed lead-acid (SLA) units."
  },
  {
    id: "cat-cables",
    name: "Cables / Wires",
    category: "Cables / Wires",
    benchmarkPrice: 240, // ₹240/kg
    tolerance: 0.20, // ±20%
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Copper Wire", "Aluminium Wire", "PVC Compound"],
    defaultCondition: "Mixed Condition",
    icon: "➰",
    description: "Power cords, insulated network Ethernet cabling, internal harness ribbons, telecom drops."
  },
  {
    id: "cat-computer",
    name: "Computer Equipment",
    category: "Computer Equipment",
    benchmarkPrice: 320, // ₹320/kg
    tolerance: 0.25, // ±25%
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Gold", "Copper", "Aluminium", "Steel"],
    defaultCondition: "Mixed Condition",
    icon: "💻",
    description: "Complete laptops, desktop towers, servers, enterprise switches, monitors."
  },
  {
    id: "cat-mobile",
    name: "Mobile / Small Electronics",
    category: "Mobile / Small Electronics",
    benchmarkPrice: 520, // ₹520/kg
    tolerance: 0.25, // ±25%
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Gold", "Silver", "Palladium", "Cobalt"],
    defaultCondition: "Non-working / Scrap",
    icon: "📱",
    description: "Smartphones, feature phones, tablets, smartwatches, POS terminals, IoT sensor nodes."
  },
  {
    id: "cat-other",
    name: "Other E-Waste",
    category: "Other E-Waste",
    benchmarkPrice: 160, // ₹160/kg
    tolerance: 0.25, // ±25%
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Mixed Non-Ferrous & Ferrous Scrap"],
    defaultCondition: "Mixed Condition",
    icon: "📦",
    description: "Small appliances, audio gear, adapters, adapters, remotes, mixed electronic accessories."
  }
];

// Reference dataset formatted for lookup compatibility
export const referenceScrapPrices = structuredEWasteCategories.map(cat => ({
  id: cat.id,
  material: cat.name,
  category: cat.category,
  referencePrice: cat.benchmarkPrice,
  benchmarkPrice: cat.benchmarkPrice,
  tolerance: cat.tolerance,
  referenceMin: Math.round(cat.benchmarkPrice * (1 - cat.tolerance)),
  referenceMax: Math.round(cat.benchmarkPrice * (1 + cat.tolerance)),
  unit: cat.unit,
  hazardLevel: cat.hazardLevel,
  recoveryMetals: cat.recoveryMetals,
  source: "CPCB / Secondary Metals Reference Index",
  lastUpdated: "10 Sep 2026",
  icon: cat.icon,
  description: cat.description
}));

export const ewasteCategoriesList = structuredEWasteCategories.map(c => c.name);

export const tamilNaduLocations = [
  "Chennai - Ambattur Industrial Estate",
  "Chennai - Guindy Industrial Estate",
  "Madurai - Kappalur SIDCO",
  "Coimbatore - Peelamedu Industrial Corridor",
  "Tiruchirappalli - Thuvakudi SIDCO",
  "Salem - Steel Plant Road",
  "Tirunelveli - Gangaikondan SIPCOT",
  "Hosur - SIPCOT Industrial Complex"
];

