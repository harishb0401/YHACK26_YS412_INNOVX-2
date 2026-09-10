/**
 * Reference Scrap Price Dataset (Demo / Local Reference Data)
 * Note: Clearly identified as deterministic local reference rates, not live API.
 */
export const referenceScrapPrices = [
  {
    id: "mat-laptop",
    material: "Laptop / Notebook",
    category: "IT Equipment",
    referencePrice: 300, // ₹300/kg
    referenceMin: 280,
    referenceMax: 330,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Copper", "Gold", "Aluminum", "Cobalt"],
    source: "Demo Scrap Price Dataset",
    lastUpdated: "10 Sep 2026",
    icon: "💻"
  },
  {
    id: "mat-mobile",
    material: "Mobile Phones & Tablets",
    category: "Consumer Electronics",
    referencePrice: 500, // ₹500/kg
    referenceMin: 450,
    referenceMax: 560,
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Gold", "Silver", "Palladium", "Copper"],
    source: "Demo Scrap Price Dataset",
    lastUpdated: "10 Sep 2026",
    icon: "📱"
  },
  {
    id: "mat-printer",
    material: "Printers & Scanners",
    category: "IT Equipment",
    referencePrice: 200, // ₹200/kg
    referenceMin: 180,
    referenceMax: 220,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Steel", "Copper", "Plastics"],
    source: "Demo Scrap Price Dataset",
    lastUpdated: "10 Sep 2026",
    icon: "🖨️"
  },
  {
    id: "mat-pcb",
    material: "High-Grade PCB Circuit Boards",
    category: "Components",
    referencePrice: 650, // ₹650/kg
    referenceMin: 600,
    referenceMax: 720,
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Gold", "Copper", "Tin"],
    source: "Demo Scrap Price Dataset",
    lastUpdated: "10 Sep 2026",
    icon: "🔌"
  },
  {
    id: "mat-battery",
    material: "Lithium-Ion Battery Packs",
    category: "Batteries",
    referencePrice: 450, // ₹450/kg
    referenceMin: 400,
    referenceMax: 500,
    unit: "₹/kg",
    hazardLevel: "High",
    recoveryMetals: ["Lithium", "Cobalt", "Nickel"],
    source: "Demo Scrap Price Dataset",
    lastUpdated: "10 Sep 2026",
    icon: "🔋"
  },
  {
    id: "mat-wires",
    material: "Copper Cable & Insulated Wires",
    category: "Cables & Wiring",
    referencePrice: 220, // ₹220/kg
    referenceMin: 200,
    referenceMax: 250,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Copper", "PVC Polymer"],
    source: "Demo Scrap Price Dataset",
    lastUpdated: "10 Sep 2026",
    icon: "➰"
  },
  {
    id: "mat-appliance",
    material: "Large Appliances / Microwave / Refrigerator",
    category: "Large Appliances",
    referencePrice: 150, // ₹150/kg
    referenceMin: 130,
    referenceMax: 170,
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Steel", "Aluminum", "Copper Compressor"],
    source: "Demo Scrap Price Dataset",
    lastUpdated: "10 Sep 2026",
    icon: "🧊"
  }
];

export const ewasteCategoriesList = [
  "IT Equipment",
  "Consumer Electronics",
  "Components",
  "Batteries",
  "Cables & Wiring",
  "Large Appliances"
];

export const tamilNaduLocations = [
  "Chennai - Ambattur Industrial Estate",
  "Chennai - Guindy",
  "Madurai - Kappalur SIDCO",
  "Coimbatore - Peelamedu",
  "Tiruchirappalli - Thuvakudi",
  "Salem - Steel Plant Road"
];
