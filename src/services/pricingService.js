import { calculateQuoteValidation } from '../utils/rulesEngine';

/**
 * Validates a recycler quoted price through the backend API,
 * with resilient automatic fallback to the rules engine validation.
 * 
 * @param {Object} params
 * @param {string} params.category - E-Waste category name
 * @param {string} params.material - Material description/type
 * @param {number|string} params.lotWeight - Weight of the lot in kg/units
 * @param {number|string} params.quantity - Alias for lotWeight
 * @param {number|string} params.quotedPrice - Quoted rate per unit (₹/kg)
 * @param {number|string} params.benchmarkPrice - Reference benchmark price
 * @param {number|string} params.tolerance - Tolerance fraction or percentage
 * @param {string} params.unit - Unit of measurement (default: 'kg')
 * @returns {Promise<Object>} Backend calculation & validation response
 */
export async function validateQuotedPriceBackend({
  category = '',
  material = '',
  lotWeight,
  quantity,
  quotedPrice = 0,
  benchmarkPrice = 350,
  tolerance = 0.25,
  unit = 'kg'
}) {
  const weight = lotWeight !== undefined ? lotWeight : quantity;
  const payload = {
    category,
    material,
    lotWeight: parseFloat(weight) || 0,
    quotedPrice: parseFloat(quotedPrice) || 0,
    benchmarkPrice: parseFloat(benchmarkPrice) || 350,
    tolerance: tolerance !== undefined ? parseFloat(tolerance) : 0.25,
    unit: unit || 'kg'
  };

  try {
    const response = await fetch('/api/pricing/validate-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const json = await response.json();
      if (json && json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // Network or offline fallback
    console.debug('Backend pricing API unavailable, falling back to rules engine:', err);
  }

  // Pure deterministic rules engine validation
  return calculateQuoteValidation(payload);
}
