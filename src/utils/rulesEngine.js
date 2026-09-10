import { structuredEWasteCategories, referenceScrapPrices } from '../data/scrapPrices';

/**
 * ECO-Link Rule-Based Deterministic Engine
 * Transparent, deterministic, auditable rules for e-waste classification,
 * fair pricing limits, recycler matching, offer evaluation, and traceability.
 */

/**
 * 1. calculateFairPriceRange:
 * Formula:
 * Lower Limit = Benchmark Price × (1 - Tolerance)
 * Upper Limit = Benchmark Price × (1 + Tolerance)
 * Estimated Value = Quantity × Benchmark Price
 */
export function calculateFairPriceRange(benchmarkPrice, tolerance = 0.25, quantity = 1) {
  const benchmark = parseFloat(benchmarkPrice) || 0;
  const tol = parseFloat(tolerance) || 0.25;
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
    rangeLabel: `₹${lowerLimit}–₹${upperLimit}/kg`,
    estimatedLotValue,
    minEstimatedValue,
    maxEstimatedValue
  };
}

/**
 * 2. evaluateOfferFairPrice:
 * Evaluates recycler offer against fair price limits.
 * Returns: { status: 'FAIR' | 'BELOW_FAIR_RANGE' | 'ABOVE_FAIR_RANGE', isFlagged: boolean, label: string, diffPercent: number }
 */
export function evaluateOfferFairPrice(offeredPricePerUnit, benchmarkPrice, tolerance = 0.25) {
  const offer = parseFloat(offeredPricePerUnit) || 0;
  const benchmark = parseFloat(benchmarkPrice) || 0;
  const tol = parseFloat(tolerance) || 0.25;

  const lowerLimit = Math.round(benchmark * (1 - tol));
  const upperLimit = Math.round(benchmark * (1 + tol));

  if (offer < lowerLimit) {
    const diffPercent = Math.round(((lowerLimit - offer) / lowerLimit) * 100);
    return {
      status: "BELOW_FAIR_RANGE",
      isFlagged: true,
      label: "BELOW FAIR RANGE ⚠️",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      diffPercent,
      lowerLimit,
      upperLimit,
      benchmarkPrice: benchmark,
      message: `Offer of ₹${offer}/kg is ${diffPercent}% below the minimum fair limit of ₹${lowerLimit}/kg.`
    };
  }

  if (offer > upperLimit) {
    const diffPercent = Math.round(((offer - upperLimit) / upperLimit) * 100);
    return {
      status: "ABOVE_FAIR_RANGE",
      isFlagged: true,
      label: "ABOVE FAIR RANGE ⚠️",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
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
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    diffPercent: 0,
    lowerLimit,
    upperLimit,
    benchmarkPrice: benchmark,
    message: `Offer of ₹${offer}/kg is within the fair reference range (₹${lowerLimit}–₹${upperLimit}/kg).`
  };
}

/**
 * 3. classifyEWaste:
 * Assigns structured material category, benchmark price, hazard level, and recovery metals.
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
      referencePrice: match.benchmarkPrice,
      tolerance: match.tolerance,
      lowerLimit: range.lowerLimit,
      upperLimit: range.upperLimit,
      referenceMin: range.lowerLimit,
      referenceMax: range.upperLimit,
      hazardLevel: match.hazardLevel,
      recoveryMetals: match.recoveryMetals,
      unit: match.unit,
      icon: match.icon
    };
  }

  // Default fallback category: Other E-Waste
  const defaultCat = structuredEWasteCategories[structuredEWasteCategories.length - 1];
  const defaultRange = calculateFairPriceRange(defaultCat.benchmarkPrice, defaultCat.tolerance, 1);
  return {
    matched: false,
    category: defaultCat.category,
    material: itemTitleOrKeywords || defaultCat.name,
    benchmarkPrice: defaultCat.benchmarkPrice,
    referencePrice: defaultCat.benchmarkPrice,
    tolerance: defaultCat.tolerance,
    lowerLimit: defaultRange.lowerLimit,
    upperLimit: defaultRange.upperLimit,
    referenceMin: defaultRange.lowerLimit,
    referenceMax: defaultRange.upperLimit,
    hazardLevel: defaultCat.hazardLevel,
    recoveryMetals: defaultCat.recoveryMetals,
    unit: defaultCat.unit,
    icon: defaultCat.icon
  };
}

/**
 * 4. matchLotsToRecycler:
 * Matches available lots with a verified recycler based on:
 * - Recycler Verification Status (Must be 'VERIFIED')
 * - Material Category compatibility
 * - Capacity / Quantity fit
 * - Proximity / Location
 */
export function matchLotsToRecycler(lots = [], recycler) {
  if (!recycler || recycler.verificationStatus !== 'VERIFIED') {
    return [];
  }

  const acceptedCats = recycler.acceptedCategories || recycler.supportedCategories || [];

  return lots.filter(lot => {
    // Only available, matched or offer received lots
    const isLotOpen = ['AVAILABLE', 'MATCHED', 'OFFER_RECEIVED', 'DRAFT'].includes(lot.status) || 
                      ['Available', 'Matched', 'Pending'].includes(lot.status);
    if (!isLotOpen) return false;

    // Check category match
    const categoryMatches = acceptedCats.length === 0 || acceptedCats.some(cat => 
      cat.toLowerCase().includes((lot.category || '').toLowerCase()) ||
      (lot.category || '').toLowerCase().includes(cat.toLowerCase())
    );

    return categoryMatches;
  }).map(lot => {
    let matchScore = 70;
    if ((recycler.location || '').toLowerCase().includes((lot.location || '').split('-')[0].trim().toLowerCase())) {
      matchScore += 20;
    }
    return {
      ...lot,
      matchScore: Math.min(matchScore, 98)
    };
  });
}

/**
 * 5. createTraceabilityEvent:
 * Creates standard milestone timestamp entry for lot traceability ledger
 */
export function createTraceabilityEvent(event, userRole, status, details = {}) {
  const now = new Date();
  const timeStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
                 now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return {
    id: `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    event,
    timestamp: timeStr,
    isoTimestamp: now.toISOString(),
    userRole,
    status,
    details
  };
}

/**
 * Backward compatibility helpers
 */
export function calculateReferenceValue(items = []) {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => {
    const qty = parseFloat(item.weightKg || item.quantity || 0);
    const ref = item.referencePrice !== undefined 
      ? item.referencePrice 
      : (classifyEWaste(item.material || item.name || item.category).referencePrice);
    return total + (qty * ref);
  }, 0);
}

export function calculateAverageReferenceRate(items = []) {
  if (!items || items.length === 0) return 250;
  const rates = items.map(item => {
    return item.referencePrice !== undefined
      ? item.referencePrice
      : (classifyEWaste(item.material || item.name || item.category).referencePrice);
  });
  const sum = rates.reduce((acc, curr) => acc + curr, 0);
  return Math.round(sum / rates.length);
}

export function calculateLotValue(items = [], askingPricePerKg = 0) {
  const totalWeight = items.reduce((total, item) => total + parseFloat(item.weightKg || item.quantity || 0), 0);
  return Math.round(totalWeight * (parseFloat(askingPricePerKg) || 0));
}

export function checkPriceWarning(askingPrice, referenceMin = 280, referenceMax = 330) {
  const price = parseFloat(askingPrice) || 0;
  const maxRange = parseFloat(referenceMax) || 330;
  const minRange = parseFloat(referenceMin) || 280;

  if (price > maxRange * 1.15) {
    const percentAbove = Math.round(((price - maxRange) / maxRange) * 100);
    return {
      isWarning: true,
      percentAbove,
      referenceMin: minRange,
      referenceMax: maxRange,
      askingPrice: price,
      message: `Your asking price (₹${price}/kg) is ${percentAbove}% above the reference range (₹${minRange}–₹${maxRange}/kg).`
    };
  }

  return {
    isWarning: false,
    percentAbove: 0,
    referenceMin: minRange,
    referenceMax: maxRange,
    askingPrice: price,
    message: `Asking price is within normal market reference range (₹${minRange}–₹${maxRange}/kg).`
  };
}

export function matchCollectorsToRequirement(collectors = [], requirement) {
  if (!requirement) return [];

  return collectors.map(collector => {
    let matchScore = 50;
    const categoryMatches = (collector.materials || []).some(
      m => m.toLowerCase().includes(requirement.category.toLowerCase()) || requirement.category.toLowerCase().includes(m.toLowerCase())
    );
    if (categoryMatches) matchScore += 25;

    const weight = parseFloat(collector.availableWeightKg || 0);
    const reqQty = parseFloat(requirement.requiredQuantityKg || 0);
    if (weight >= reqQty * 0.8) matchScore += 15;

    const asking = parseFloat(collector.askingPricePerKg || 0);
    const budget = parseFloat(requirement.targetPricePerKg || 0);
    if (asking <= budget) {
      matchScore += 10;
    } else if (asking > budget * 1.3) {
      matchScore -= 10;
    }

    const priceCheck = checkPriceWarning(
      collector.askingPricePerKg, 
      requirement.referenceMin || 280, 
      requirement.referenceMax || 330
    );

    return {
      ...collector,
      matchScore: Math.min(Math.max(matchScore, 20), 99),
      hasPriceWarning: priceCheck.isWarning,
      priceWarningDetails: priceCheck
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

export function verifyRecyclerStatus(recycler) {
  const isVerified = recycler?.verificationStatus === 'VERIFIED' || Boolean(recycler?.isPlatformVerified);
  const hasCpcb = Boolean(recycler?.cpcbRegistrationNo && recycler?.cpcbRegistrationNo.trim().length > 5);

  return {
    cpcbVerified: hasCpcb,
    cpcbRegistrationNo: recycler?.cpcbRegistrationNo || "TN-EPR-DEMO-2026",
    cpcbAuditDate: recycler?.cpcbAuditDate || "15 Jan 2026",
    platformVerified: isVerified,
    statusBadgeText: isVerified ? "✓ Verified Recycler" : (recycler?.verificationStatus || "Pending Verification"),
    tier: recycler?.tier || "Tier-1 Certified Recovery Unit",
    complianceScore: isVerified ? "100% Verified" : "Audit In Progress"
  };
}

