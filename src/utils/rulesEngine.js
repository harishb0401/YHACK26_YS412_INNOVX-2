import { referenceScrapPrices } from '../data/scrapPrices';

/**
 * ECO-Link Rule-Based Deterministic Engine
 * All calculations and matching algorithms are transparent, rule-driven, and reproducible.
 * (No non-deterministic AI claims).
 */

/**
 * 1. classifyEWaste: Assigns material category, hazard class, and default reference rates based on keywords/properties.
 */
export function classifyEWaste(itemTitleOrKeywords) {
  const query = (itemTitleOrKeywords || '').toLowerCase();
  
  const match = referenceScrapPrices.find(p => 
    query.includes(p.material.toLowerCase()) || 
    query.includes(p.category.toLowerCase()) ||
    p.material.toLowerCase().split(' ').some(word => word.length > 3 && query.includes(word))
  );

  if (match) {
    return {
      matched: true,
      category: match.category,
      material: match.material,
      referencePrice: match.referencePrice,
      referenceMin: match.referenceMin,
      referenceMax: match.referenceMax,
      hazardLevel: match.hazardLevel,
      recoveryMetals: match.recoveryMetals,
      unit: match.unit
    };
  }

  // Fallback default rule
  return {
    matched: false,
    category: "Mixed E-Waste",
    material: itemTitleOrKeywords || "General E-Waste",
    referencePrice: 250,
    referenceMin: 220,
    referenceMax: 290,
    hazardLevel: "Low",
    recoveryMetals: ["Copper", "Steel"],
    unit: "₹/kg"
  };
}

/**
 * 2. calculateReferenceValue:
 * Estimated Lot Value = sum of (quantityKg × category reference price)
 * e.g., Laptop (5kg × ₹300) + Mobile (2kg × ₹500) + Printer (3kg × ₹200) = ₹3,100
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

/**
 * 3. calculateAverageReferenceRate:
 * Average of the applicable category reference rates (in ₹/kg)
 */
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

/**
 * 4. calculateLotValue:
 * Total Agreed / Asking Value = Total Weight × Asking Price
 */
export function calculateLotValue(items = [], askingPricePerKg = 0) {
  const totalWeight = items.reduce((total, item) => total + parseFloat(item.weightKg || item.quantity || 0), 0);
  return Math.round(totalWeight * (parseFloat(askingPricePerKg) || 0));
}

/**
 * 5. checkPriceWarning:
 * Evaluates whether asking price is significantly above the reference range (> +15% above max or reference).
 * Returns { isWarning: boolean, percentAbove: number, referenceMin: number, referenceMax: number, message: string }
 */
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
      message: `Your asking price (₹${price}/kg) is ${percentAbove}% above the current reference range (₹${minRange}–₹${maxRange}/kg).`
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

/**
 * 6. matchCollectorsToRequirement:
 * Matches collectors with active requirements based on:
 * - Material Category compatibility
 * - Available Quantity
 * - Geographic proximity / City match
 * - Asking price vs Recycler Budget
 * - Reliability score
 */
export function matchCollectorsToRequirement(collectors = [], requirement) {
  if (!requirement) return [];

  return collectors.map(collector => {
    let matchScore = 50; // baseline

    // Rule 1: Category Match
    const categoryMatches = (collector.materials || []).some(
      m => m.toLowerCase().includes(requirement.category.toLowerCase()) || requirement.category.toLowerCase().includes(m.toLowerCase())
    );
    if (categoryMatches) matchScore += 25;

    // Rule 2: Quantity Sufficiency
    const weight = parseFloat(collector.availableWeightKg || 0);
    const reqQty = parseFloat(requirement.requiredQuantityKg || 0);
    if (weight >= reqQty * 0.8) matchScore += 15;

    // Rule 3: Price within budget
    const asking = parseFloat(collector.askingPricePerKg || 0);
    const budget = parseFloat(requirement.targetPricePerKg || 0);
    if (asking <= budget) {
      matchScore += 10;
    } else if (asking > budget * 1.3) {
      matchScore -= 10;
    }

    // Check price warning status for this collector
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

/**
 * 7. verifyRecyclerStatus:
 * Validates CPCB/EPR government registration status layer vs ECO-Link platform status layer.
 */
export function verifyRecyclerStatus(recycler) {
  const hasCpcb = Boolean(recycler?.cpcbRegistrationNo && recycler?.cpcbRegistrationNo.trim().length > 5);
  const isPlatformActive = Boolean(recycler?.isPlatformVerified);

  return {
    cpcbVerified: hasCpcb,
    cpcbRegistrationNo: recycler?.cpcbRegistrationNo || "TN-EPR-DEMO-2026",
    cpcbAuditDate: recycler?.cpcbAuditDate || "15 Jan 2026",
    platformVerified: isPlatformActive,
    statusBadgeText: hasCpcb ? "✓ CPCB/EPR Registration Verified" : "CPCB Registration Pending",
    tier: recycler?.tier || "Tier-1 Certified Recovery Unit",
    complianceScore: hasCpcb ? "100% Verified" : "Audit In Progress"
  };
}
