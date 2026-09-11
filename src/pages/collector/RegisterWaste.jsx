import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Scale, DollarSign, CheckCircle2, XCircle, 
  AlertTriangle, Calculator, ShieldCheck, TrendingDown, 
  TrendingUp, RefreshCw, HelpCircle, Info
} from 'lucide-react';
import { structuredEWasteCategories } from '../../data/scrapPrices';
import { calculateFairPriceRange } from '../../utils/rulesEngine';
import { mockBenchmarkPrices, mockCollector } from '../../data/mockData';
import { validateQuotedPriceBackend } from '../../services/pricingService';
import { useTranslation } from '../../i18n';

export default function RegisterWaste({ benchmarkPrices = mockBenchmarkPrices, onLotCreated, collectorProfile = mockCollector }) {
  const navigate = useNavigate();
  const { t, tCategory, tCondition } = useTranslation();

  const [category, setCategory] = useState(structuredEWasteCategories[0].name);
  const [material, setMaterial] = useState(structuredEWasteCategories[0].description || structuredEWasteCategories[0].name);
  const [quantity, setQuantity] = useState('25');
  const [unit, setUnit] = useState('kg');
  const [condition, setCondition] = useState('Non-working / Scrap');
  const [location, setLocation] = useState(collectorProfile?.location || 'Chennai - Guindy Industrial Estate');
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Selected Category Benchmark & Tolerance
  const selectedCatData = structuredEWasteCategories.find(c => c.name === category);
  const benchmarkRate = (benchmarkPrices || []).find(p => p.category === category)?.referencePrice || selectedCatData?.benchmarkPrice || 350;
  const tolerance = (benchmarkPrices || []).find(p => p.category === category)?.tolerancePercent !== undefined 
    ? (benchmarkPrices || []).find(p => p.category === category).tolerancePercent 
    : (selectedCatData?.tolerance ? selectedCatData.tolerance * 100 : 25);

  // Recycler Quoted Price state
  const [quotedPrice, setQuotedPrice] = useState(String(benchmarkRate));
  const [isCustomQuote, setIsCustomQuote] = useState(false);

  // Backend validation response state
  const [backendValidation, setBackendValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  // When category changes, if user hasn't explicitly set custom quote, update to new category benchmark
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    const matched = structuredEWasteCategories.find(c => c.name === newCat);
    if (matched) {
      setMaterial(matched.description || matched.name);
      const newBenchmark = (benchmarkPrices || []).find(p => p.category === newCat)?.referencePrice || matched.benchmarkPrice || 350;
      if (!isCustomQuote) {
        setQuotedPrice(String(newBenchmark));
      }
    }
  };

  // Trigger backend validation asynchronously on input changes
  useEffect(() => {
    let isCurrent = true;
    setIsValidating(true);

    const parsedQty = parseFloat(quantity) || 0;
    const parsedQuote = parseFloat(quotedPrice) || 0;
    const tolFraction = tolerance > 1 ? tolerance / 100 : tolerance;

    validateQuotedPriceBackend({
      category,
      material: (material || '').trim() || category,
      lotWeight: parsedQty,
      quotedPrice: parsedQuote,
      benchmarkPrice: benchmarkRate,
      tolerance: tolFraction,
      unit
    }).then((res) => {
      if (isCurrent) {
        setBackendValidation(res);
        setIsValidating(false);
      }
    }).catch((err) => {
      console.error('Pricing validation error:', err);
      if (isCurrent) {
        setIsValidating(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [category, material, quantity, quotedPrice, benchmarkRate, tolerance, unit]);

  // Fallback calculations in case backend response is still loading
  const parsedQty = parseFloat(quantity) || 0;
  const parsedQuote = parseFloat(quotedPrice) || 0;
  const fallbackRange = calculateFairPriceRange(benchmarkRate, tolerance > 1 ? tolerance / 100 : tolerance, parsedQty);
  
  const minPrice = backendValidation?.allowedPriceRange?.minPrice ?? fallbackRange.lowerLimit;
  const maxPrice = backendValidation?.allowedPriceRange?.maxPrice ?? fallbackRange.upperLimit;
  const displayBenchmark = backendValidation?.benchmarkRate ?? benchmarkRate;
  const displayTolerance = backendValidation?.tolerancePercent ?? Math.round(tolerance);
  const estimatedTotalAmount = backendValidation?.estimatedTotalAmount ?? Math.round(parsedQty * parsedQuote);
  
  const validation = backendValidation?.validation || {
    isCleared: parsedQuote >= minPrice && parsedQuote <= maxPrice,
    status: parsedQuote < minPrice ? 'NOT_CLEARED_BELOW' : parsedQuote > maxPrice ? 'NOT_CLEARED_ABOVE' : 'PRE_CLEARED',
    badgeText: (parsedQuote >= minPrice && parsedQuote <= maxPrice) ? 'PRE-CLEARED ✅' : 'NOT CLEARED ❌',
    position: parsedQuote < minPrice ? 'BELOW_RANGE' : parsedQuote > maxPrice ? 'ABOVE_RANGE' : 'IN_RANGE',
    diffPercent: parsedQuote < minPrice && minPrice > 0 ? Math.round(((minPrice - parsedQuote) / minPrice) * 100) : (parsedQuote > maxPrice && maxPrice > 0 ? Math.round(((parsedQuote - maxPrice) / maxPrice) * 100) : 0),
    message: parsedQuote < minPrice 
      ? `Quoted price (₹${parsedQuote}/${unit}) is BELOW the allowed fair range (₹${minPrice} – ₹${maxPrice}/${unit}).`
      : parsedQuote > maxPrice
        ? `Quoted price (₹${parsedQuote}/${unit}) is ABOVE the allowed fair range (₹${minPrice} – ₹${maxPrice}/${unit}).`
        : `Quoted price (₹${parsedQuote}/${unit}) is within the allowed fair benchmark range (₹${minPrice} – ₹${maxPrice}/${unit}).`
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!parsedQty || parsedQty <= 0) {
      alert("Please enter a valid positive quantity / lot weight.");
      return;
    }

    if (!parsedQuote || parsedQuote <= 0) {
      alert("Please enter a valid positive recycler quoted price.");
      return;
    }

    if (onLotCreated) {
      onLotCreated({
        category,
        material: (material || '').trim() || category,
        quantity: parsedQty,
        totalWeightKg: parsedQty,
        unit,
        condition,
        location,
        collectionDate,
        notes,
        benchmarkPrice: displayBenchmark,
        quotedPrice: parsedQuote,
        estimatedLotValue: estimatedTotalAmount,
        isPreCleared: validation.isCleared,
        clearanceBadge: validation.badgeText,
        clearanceStatus: validation.status,
        allowedPriceRange: {
          minPrice,
          maxPrice,
          rangeLabel: `₹${minPrice} – ₹${maxPrice} / ${unit}`
        },
        validationDetails: validation
      });
    }

    navigate('/collector/requests');
  };


  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/collector/dashboard')}
          className="px-4 py-2 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 rounded-xl hover:bg-[#DDEBD8]/50 transition flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#3F7655]" />
          <span>{t('backToDashboard', 'Back to Dashboard')}</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-lg space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase text-[#3F7655] tracking-widest bg-[#DDEBD8] px-3 py-1 rounded-full">
            {t('pricingAndValidationEngine', 'E-Waste Manifest & Fair Pricing Engine')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128] mt-2">{t('createEWasteRequest', 'Create E-Waste Request')}</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            {t('eWasteManifestSubtitle', 'Declare your collected e-waste volume, evaluate recycler quoted rates with automated backend pricing validation, and broadcast requests to certified CPCB recyclers.')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Category and Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                {t('eWasteCategory', 'E-Waste Category')} *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                {structuredEWasteCategories.map((c, i) => (
                  <option key={i} value={c.name}>{tCategory(c.name)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                {t('materialDescription', 'Material Description / Material Type')} *
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Mixed motherboards & server boards"
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Lot Weight / Quantity, Unit, Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                {t('lotWeight', 'Lot Weight (Quantity)')} *
              </label>
              <input
                type="number"
                min="0.1"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                {t('unitOfMeasurement', 'Unit of Measurement')}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                <option value="kg">{t('unitKg', 'Kilograms (kg)')}</option>
                <option value="units">{t('unitUnits', 'Units / Pieces')}</option>
                <option value="tons">{t('unitTons', 'Metric Tons (MT)')}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                {t('conditionLabel', 'Condition')}
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                <option value="Non-working / Scrap">{tCondition('Non-working / Scrap')}</option>
                <option value="Intact / Used">{tCondition('Working / Repairable')}</option>
                <option value="Partially Dismantled">{tCondition('Mixed Condition')}</option>
              </select>
            </div>
          </div>

          {/* Row 3: Location and Collection Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                {t('storageLocationHub', 'Storage Location / Hub')} *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('placeholderLocation')}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                {t('collectionDate', 'Collection Date')} *
              </label>
              <input
                type="date"
                required
                value={collectionDate}
                onChange={(e) => setCollectionDate(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* NEW SECTION: QUOTED AMOUNT & LIVE BACKEND PRICING VALIDATION */}
          <div className="p-6 sm:p-7 bg-[#FAF8F2] rounded-[28px] border-2 border-[#3F7655]/30 shadow-sm space-y-5">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3F7655]/15 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#3F7655] text-white flex items-center justify-center font-bold shadow-sm">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#3F7655]">
                    {t('pricingAndValidationEngine', 'Pricing & Validation Engine')}
                  </span>
                  <h3 className="text-base font-black text-[#203128]">
                    {t('quotedAmountSection', 'Quoted Amount')}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isValidating && (
                  <span className="text-[11px] font-bold text-[#3F7655] flex items-center gap-1 bg-[#DDEBD8] px-2.5 py-1 rounded-full animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    {t('validatingWithBackend', 'Validating with Backend...')}
                  </span>
                )}
                <span className="text-[10px] font-black uppercase text-[#3F7655] bg-[#DDEBD8] px-2.5 py-1 rounded-full">
                  {t('toleranceLabel', 'Tolerance')}: ±{displayTolerance}%
                </span>
              </div>
            </div>

            {/* Input for Recycler Quoted Price */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-[#203128] flex items-center gap-1.5">
                  <span>{t('recyclerQuotedPrice', 'Recycler Quoted Price')} (₹/{unit}) *</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setQuotedPrice(String(displayBenchmark));
                    setIsCustomQuote(false);
                  }}
                  className="text-[11px] font-bold text-[#3F7655] hover:text-[#244936] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{t('useBenchmarkRate', 'Use Benchmark')} (₹{displayBenchmark}/{unit})</span>
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#718078]">
                  ₹
                </span>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={quotedPrice}
                  onChange={(e) => {
                    setQuotedPrice(e.target.value);
                    setIsCustomQuote(true);
                  }}
                  placeholder={`e.g. ${displayBenchmark}`}
                  className="w-full bg-white border-2 border-[#3F7655]/30 rounded-2xl pl-8 pr-16 py-3.5 text-sm font-black text-[#203128] focus:border-[#3F7655] focus:outline-none shadow-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#718078] uppercase">
                  / {unit}
                </span>
              </div>
              <p className="text-[11px] text-[#718078] mt-1.5">
                {t('quotedPriceHelpText', 'Enter the unit price offered by the recycler or your target rate to check instant regulatory clearance.')}
              </p>
            </div>

            {/* 4 Automatically Calculated Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Benchmark Rate */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#3F7655]/15 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#718078] block tracking-wide">
                  {t('benchmarkPriceLabel', 'Benchmark Rate')}
                </span>
                <span className="text-base font-black text-[#203128] block">
                  ₹{displayBenchmark} <span className="text-xs font-bold text-[#718078]">/ {unit}</span>
                </span>
                <span className="text-[10px] font-medium text-[#718078] block">
                  {t('cpcbReferenceRateLabel', 'CPCB reference rate')}
                </span>
              </div>

              {/* 2. Allowed Price Range */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#3F7655]/15 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#718078] block tracking-wide">
                  {t('allowedPriceRange', 'Allowed Price Range')}
                </span>
                <span className="text-sm font-black text-[#3F7655] block truncate">
                  ₹{minPrice} – ₹{maxPrice} <span className="text-xs font-bold text-[#718078]">/ {unit}</span>
                </span>
                <span className="text-[10px] font-medium text-[#718078] block">
                  {t('toleranceBandText', 'Band of ±{tolerance}% from benchmark', { tolerance: displayTolerance })}
                </span>
              </div>

              {/* 3. Recycler Quoted Price */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#3F7655]/15 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#718078] block tracking-wide">
                  {t('recyclerQuotedPrice', 'Recycler Quoted Price')}
                </span>
                <span className="text-base font-black text-[#203128] block">
                  ₹{parsedQuote || 0} <span className="text-xs font-bold text-[#718078]">/ {unit}</span>
                </span>
                <span className="text-[10px] font-semibold block text-[#718078]">
                  {t('declaredUnitOfferLabel', 'Declared unit offer')}
                </span>
              </div>

              {/* 4. Estimated Total Amount = Lot Weight × Recycler Quoted Price */}
              <div className="p-3.5 bg-[#DDEBD8]/60 rounded-2xl border border-[#3F7655]/30 shadow-sm space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-[#244936] block tracking-wide">
                  {t('estimatedTotalAmount', 'Estimated Total Amount')}
                </span>
                <span className="text-base font-black text-[#244936] block">
                  ₹{estimatedTotalAmount.toLocaleString()}
                </span>
                <span className="text-[10px] font-medium text-[#244936]/80 block truncate">
                  {parsedQty} {unit} × ₹{parsedQuote || 0}
                </span>
              </div>
            </div>

            {/* Validation Clearance Status Banner */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${
              validation.isCleared 
                ? 'bg-[#DDEBD8]/90 border-[#3F7655]/40 text-[#203128]' 
                : validation.position === 'BELOW_RANGE'
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start sm:items-center gap-2.5">
                  {validation.isCleared ? (
                    <div className="w-8 h-8 rounded-full bg-[#3F7655] text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : validation.position === 'BELOW_RANGE' ? (
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        validation.isCleared 
                          ? 'bg-[#3F7655] text-white' 
                          : validation.position === 'BELOW_RANGE'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-600 text-white'
                      }`}>
                        {validation.isCleared ? t('preClearedBadge', 'PRE-CLEARED ✅') : t('notClearedBadge', 'NOT CLEARED ❌')}
                      </span>

                      {!validation.isCleared && (
                        <span className="text-[11px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                          {validation.position === 'BELOW_RANGE' ? t('belowAllowedRange', 'Below Allowed Range') : t('aboveAllowedRange', 'Above Allowed Range')}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold mt-1">
                      {validation.isCleared ? (
                        <span>{t('preClearedMessageText', 'The quoted price of ₹{quote}/{unit} is within the allowed fair price range (₹{min} – ₹{max}/{unit}). Instant pre-clearance granted.', { quote: parsedQuote, unit, min: minPrice, max: maxPrice })}</span>
                      ) : validation.position === 'BELOW_RANGE' ? (
                        <span>{t('belowRangeMessageText', 'The quoted price of ₹{quote}/{unit} is BELOW the allowed fair range (Minimum allowed: ₹{min}/{unit}) by {percent}%.', { quote: parsedQuote, unit, min: minPrice, percent: validation.diffPercent })}</span>
                      ) : (
                        <span>{t('aboveRangeMessageText', 'The quoted price of ₹{quote}/{unit} is ABOVE the allowed fair range (Maximum allowed: ₹{max}/{unit}) by {percent}%.', { quote: parsedQuote, unit, max: maxPrice, percent: validation.diffPercent })}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-extrabold sm:text-right shrink-0">
                  {validation.isCleared ? (
                    <span className="text-[#3F7655] bg-white/80 px-2.5 py-1 rounded-xl border border-[#3F7655]/20 block">
                      {t('readyForImmediateBroadcast', '✓ Ready for Immediate Broadcast')}
                    </span>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-xl border block ${
                      validation.position === 'BELOW_RANGE' 
                        ? 'bg-white text-rose-700 border-rose-200' 
                        : 'bg-white text-amber-800 border-amber-200'
                    }`}>
                      {t('priceOutOfBounds', '⚠️ Price Out of Bounds')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              {t('additionalInspectionNotes', 'Additional Inspection Notes')}
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('placeholderStorageNotes')}
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl p-4 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#3F7655] hover:bg-[#244936] text-white font-black text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('submitAndBroadcastBtn', 'Submit E-Waste Request & Broadcast to Recyclers')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

