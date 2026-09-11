import { calculateQuoteValidation, classifyEWaste, structuredEWasteCategories } from '../services/pricingService.js';

/**
 * Validate a quote against fair pricing bounds
 * POST /api/pricing/validate-quote
 */
export async function validateQuote(req, res, next) {
  try {
    const {
      category = '',
      material = '',
      lotWeight,
      quantity,
      quotedPrice = 0,
      benchmarkPrice,
      tolerance = 0.25,
      unit = 'kg'
    } = req.body;

    const weight = lotWeight !== undefined ? lotWeight : quantity;
    const resolvedBenchmark = benchmarkPrice || (classifyEWaste(material || category).benchmarkPrice) || 350;

    const validationResult = calculateQuoteValidation({
      category,
      material: material || category,
      lotWeight: weight,
      quotedPrice,
      benchmarkPrice: resolvedBenchmark,
      tolerance,
      unit
    });

    return res.status(200).json({
      success: true,
      data: validationResult
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Reference E-Waste Benchmark Categories
 * GET /api/pricing/categories
 */
export async function getCategories(req, res) {
  return res.status(200).json({
    success: true,
    data: structuredEWasteCategories
  });
}
