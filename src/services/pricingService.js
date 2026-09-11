import api from './api';
import { calculateQuoteValidation } from '../utils/rulesEngine';

/**
 * Validates a recycler quoted price through the backend API,
 * with resilient automatic fallback to the rules engine validation.
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
    const res = await api.post('/pricing/validate-quote', payload);
    if (res?.success && res?.data) {
      return res.data;
    }
  } catch (err) {
    // Network or offline fallback
    console.debug('Backend pricing API unavailable, falling back to local rules engine:', err.message);
  }

  // Pure deterministic rules engine validation
  return calculateQuoteValidation(payload);
}

