/**
 * Server-Side Pricing Engine & Classification Logic
 * Implements deterministic fair-pricing algorithms based on CPCB/TNPCB standards.
 */

export const structuredEWasteCategories = [
  {
    id: "cat-pcb",
    name: "PCB / Electronic Components",
    category: "PCB / Electronic Components",
    benchmarkPrice: 650,
    tolerance: 0.25,
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Gold (Au)", "Silver (Ag)", "Copper (Cu)", "Tin (Sn)"],
    defaultCondition: "Non-working / Scrap",
    description: "High-grade telecom boards, motherboard PCBs, server cards, memory modules."
  },
  {
    id: "cat-copper",
    name: "Copper",
    category: "Copper",
    benchmarkPrice: 720,
    tolerance: 0.20,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Refined Copper (>99% pure)"],
    defaultCondition: "Non-working / Scrap",
    description: "Stripped copper windings, transformer busbars, motor armatures, pure copper tubes."
  },
  {
    id: "cat-aluminum",
    name: "Aluminium",
    category: "Aluminium",
    benchmarkPrice: 210,
    tolerance: 0.20,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Secondary Aluminium Ingot"],
    defaultCondition: "Scrap",
    description: "Extruded heat sinks, alloy casings, laptop chassis frames, capacitor cans."
  },
  {
    id: "cat-ferrous",
    name: "Ferrous Metals",
    category: "Ferrous Metals",
    benchmarkPrice: 42,
    tolerance: 0.25,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Heavy Melting Steel (HMS)", "Cast Iron"],
    defaultCondition: "Scrap",
    description: "Server rack frames, power supply steel enclosures, chassis brackets, transformer cores."
  },
  {
    id: "cat-plastics",
    name: "Plastics",
    category: "Plastics",
    benchmarkPrice: 35,
    tolerance: 0.25,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["ABS Regrind", "Polycarbonate (PC)", "HIPS Flakes"],
    defaultCondition: "Scrap",
    description: "Flame-retardant computer housings, printer ABS shells, keyboard frames."
  },
  {
    id: "cat-batteries",
    name: "Batteries",
    category: "Batteries",
    benchmarkPrice: 450,
    tolerance: 0.25,
    unit: "₹/kg",
    hazardLevel: "High",
    recoveryMetals: ["Lithium (Li)", "Cobalt (Co)", "Nickel (Ni)", "Lead (Pb)"],
    defaultCondition: "Non-working / Scrap",
    description: "Lithium-Ion pouch & 18650 cells, laptop battery packs, sealed lead-acid (SLA) units."
  },
  {
    id: "cat-cables",
    name: "Cables / Wires",
    category: "Cables / Wires",
    benchmarkPrice: 240,
    tolerance: 0.20,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Copper Wire", "Aluminium Wire", "PVC Compound"],
    defaultCondition: "Mixed Condition",
    description: "Power cords, insulated network Ethernet cabling, internal harness ribbons, telecom drops."
  },
  {
    id: "cat-computer",
    name: "Computer Equipment",
    category: "Computer Equipment",
    benchmarkPrice: 320,
    tolerance: 0.25,
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Gold", "Copper", "Aluminium", "Steel"],
    defaultCondition: "Mixed Condition",
    description: "Complete laptops, desktop towers, servers, enterprise switches, monitors."
  },
  {
    id: "cat-mobile",
    name: "Mobile / Small Electronics",
    category: "Mobile / Small Electronics",
    benchmarkPrice: 520,
    tolerance: 0.25,
    unit: "₹/kg",
    hazardLevel: "Medium",
    recoveryMetals: ["Gold", "Silver", "Palladium", "Cobalt"],
    defaultCondition: "Non-working / Scrap",
    description: "Smartphones, feature phones, tablets, smartwatches, POS terminals, IoT sensor nodes."
  },
  {
    id: "cat-other",
    name: "Other E-Waste",
    category: "Other E-Waste",
    benchmarkPrice: 160,
    tolerance: 0.25,
    unit: "₹/kg",
    hazardLevel: "Low",
    recoveryMetals: ["Mixed Non-Ferrous & Ferrous Scrap"],
    defaultCondition: "Mixed Condition",
    description: "Small appliances, audio gear, adapters, remotes, mixed electronic accessories."
  }
];

/**
 * 1. calculateFairPriceRange:
 * Lower Limit = Benchmark Price * (1 - Tolerance)
 * Upper Limit = Benchmark Price * (1 + Tolerance)
 * Estimated Value = Quantity * Benchmark Price
 */
export function calculateFairPriceRange(benchmarkPrice, tolerance = 0.25, quantity = 1) {
  const benchmark = parseFloat(benchmarkPrice) || 0;
  const rawTol = tolerance !== undefined ? parseFloat(tolerance) : 0.25;
  const tol = rawTol > 1 ? rawTol / 100 : rawTol;
  const qty = parseFloat(quantity) || 0;

  const lowerLimit = Math.round(benchmark * (1 - tol));
  const upperLimit = Math.round(benchmark * (1 + tol));
  const minEstimatedValue = Math.round(qty * lowerLimit);
  const maxEstimatedValue = Math.round(qty * upperLimit);
  const estimatedLotValue = Math.round(qty * benchmark);

  return {
    benchmarkPrice: benchmark,
    tolerance: tol,
    tolerancePercent: Math.round(tol * 100),
    lowerLimit,
    upperLimit,
    minPrice: lowerLimit,
    maxPrice: upperLimit,
    rangeLabel: `₹${lowerLimit}–₹${upperLimit}/kg`,
    estimatedLotValue,
    minEstimatedValue,
    maxEstimatedValue
  };
}

/**
 * 2. evaluateOfferFairPrice:
 * Evaluates offer against fair price limits.
 * Returns: { status: 'FAIR' | 'BELOW_FAIR_RANGE' | 'ABOVE_FAIR_RANGE', isFlagged, diffPercent, lowerLimit, upperLimit, benchmarkPrice }
 */
export function evaluateOfferFairPrice(offeredPricePerUnit, benchmarkPrice, tolerance = 0.25) {
  const offer = parseFloat(offeredPricePerUnit) || 0;
  const benchmark = parseFloat(benchmarkPrice) || 0;
  const rawTol = tolerance !== undefined ? parseFloat(tolerance) : 0.25;
  const tol = rawTol > 1 ? rawTol / 100 : rawTol;

  const lowerLimit = Math.round(benchmark * (1 - tol));
  const upperLimit = Math.round(benchmark * (1 + tol));

  if (offer < lowerLimit) {
    const diffPercent = lowerLimit > 0 ? Math.round(((lowerLimit - offer) / lowerLimit) * 100) : 0;
    return {
      status: "BELOW_FAIR_RANGE",
      isFlagged: true,
      label: "BELOW FAIR RANGE ⚠️",
      diffPercent,
      lowerLimit,
      upperLimit,
      benchmarkPrice: benchmark,
      message: `Offer of ₹${offer}/kg is ${diffPercent}% below the minimum fair limit of ₹${lowerLimit}/kg.`
    };
  }

  if (offer > upperLimit) {
    const diffPercent = upperLimit > 0 ? Math.round(((offer - upperLimit) / upperLimit) * 100) : 0;
    return {
      status: "ABOVE_FAIR_RANGE",
      isFlagged: true,
      label: "ABOVE FAIR RANGE ⚠️",
      diffPercent,
      lowerLimit,
      upperLimit,
      benchmarkPrice: benchmark,
      message: `Offer of ₹${offer}/kg is ${diffPercent}% above the maximum fair limit of ₹${upperLimit}/kg.`
    };
  }

  return {
    status: "FAIR",
    isFlagged: false,
    label: "FAIR ✓",
    diffPercent: 0,
    lowerLimit,
    upperLimit,
    benchmarkPrice: benchmark,
    message: `Offer of ₹${offer}/kg is within the fair reference range (₹${lowerLimit}–₹${upperLimit}/kg).`
  };
}

/**
 * 3. classifyEWaste:
 * Resolves category, benchmark, hazard, and recovery metals.
 */
export function classifyEWaste(itemTitleOrKeywords) {
  const query = (itemTitleOrKeywords || '').toLowerCase();

  const match = structuredEWasteCategories.find(c =>
    query.includes(c.name.toLowerCase()) ||
    query.includes(c.category.toLowerCase()) ||
    c.name.toLowerCase().split(' ').some(w => w.length > 3 && query.includes(w))
  );

  if (match) {
    const range = calculateFairPriceRange(match.benchmarkPrice, match.tolerance, 1);
    return {
      matched: true,
      category: match.category,
      material: match.name,
      benchmarkPrice: match.benchmarkPrice,
      tolerance: match.tolerance,
      lowerLimit: range.lowerLimit,
      upperLimit: range.upperLimit,
      hazardLevel: match.hazardLevel,
      recoveryMetals: match.recoveryMetals,
      unit: match.unit
    };
  }

  const defaultCat = structuredEWasteCategories[structuredEWasteCategories.length - 1];
  const defaultRange = calculateFairPriceRange(defaultCat.benchmarkPrice, defaultCat.tolerance, 1);
  return {
    matched: false,
    category: defaultCat.category,
    material: itemTitleOrKeywords || defaultCat.name,
    benchmarkPrice: defaultCat.benchmarkPrice,
    tolerance: defaultCat.tolerance,
    lowerLimit: defaultRange.lowerLimit,
    upperLimit: defaultRange.upperLimit,
    hazardLevel: defaultCat.hazardLevel,
    recoveryMetals: defaultCat.recoveryMetals,
    unit: defaultCat.unit
  };
}

/**
 * 4. calculateQuoteValidation:
 * Calculates validation details for a quote
 */
export function calculateQuoteValidation({
  lotWeight = 0,
  quantity = 0,
  quotedPrice = 0,
  benchmarkPrice = 350,
  tolerance = 0.25,
  unit = 'kg',
  category = '',
  material = ''
}) {
  const benchmark = parseFloat(benchmarkPrice) || 350;
  const rawTol = tolerance !== undefined ? parseFloat(tolerance) : 0.25;
  const tol = rawTol > 1 ? rawTol / 100 : rawTol;
  const weight = parseFloat(lotWeight || quantity) || 0;
  const quote = parseFloat(quotedPrice) || 0;

  const lowerLimit = Math.round(benchmark * (1 - tol));
  const upperLimit = Math.round(benchmark * (1 + tol));
  const estimatedTotalAmount = Math.round(weight * quote);
  const tolerancePercent = Math.round(tol * 100);

  let isCleared = false;
  let status = 'PRE_CLEARED';
  let badgeText = 'PRE-CLEARED ✅';
  let position = 'IN_RANGE';
  let diffPercent = 0;
  let message = '';

  if (quote < lowerLimit) {
    isCleared = false;
    status = 'NOT_CLEARED_BELOW';
    badgeText = 'NOT CLEARED ❌';
    position = 'BELOW_RANGE';
    diffPercent = lowerLimit > 0 ? Math.round(((lowerLimit - quote) / lowerLimit) * 100) : 0;
    message = `Quoted price (₹${quote}/${unit}) is BELOW the allowed fair range (₹${lowerLimit} – ₹${upperLimit}/${unit}) by ${diffPercent}%.`;
  } else if (quote > upperLimit) {
    isCleared = false;
    status = 'NOT_CLEARED_ABOVE';
    badgeText = 'NOT CLEARED ❌';
    position = 'ABOVE_RANGE';
    diffPercent = upperLimit > 0 ? Math.round(((quote - upperLimit) / upperLimit) * 100) : 0;
    message = `Quoted price (₹${quote}/${unit}) is ABOVE the allowed fair range (₹${lowerLimit} – ₹${upperLimit}/${unit}) by ${diffPercent}%.`;
  } else {
    isCleared = true;
    status = 'PRE_CLEARED';
    badgeText = 'PRE-CLEARED ✅';
    position = 'IN_RANGE';
    diffPercent = 0;
    message = `Quoted price (₹${quote}/${unit}) is within the allowed fair benchmark range (₹${lowerLimit} – ₹${upperLimit}/${unit}).`;
  }

  return {
    category,
    material,
    benchmarkRate: benchmark,
    tolerancePercent,
    allowedPriceRange: {
      minPrice: lowerLimit,
      maxPrice: upperLimit,
      rangeLabel: `₹${lowerLimit} – ₹${upperLimit} / ${unit}`
    },
    quotedPrice: quote,
    lotWeight: weight,
    unit,
    estimatedTotalAmount,
    validation: {
      isCleared,
      status,
      badgeText,
      position,
      diffPercent,
      message,
      explanation: isCleared
        ? `Quoted price of ₹${quote}/${unit} is fully compliant and pre-cleared without manual approval barriers.`
        : position === 'BELOW_RANGE'
          ? `Quoted price of ₹${quote}/${unit} is ${diffPercent}% below the minimum allowed limit (₹${lowerLimit}/${unit}).`
          : `Quoted price of ₹${quote}/${unit} is ${diffPercent}% above the maximum allowed limit (₹${upperLimit}/${unit}).`
    }
  };
}
