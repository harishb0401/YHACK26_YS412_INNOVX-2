import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Scale, DollarSign, CheckCircle2, XCircle, 
  AlertTriangle, Calculator, ShieldCheck, TrendingDown, 
  TrendingUp, RefreshCw, HelpCircle, Info, MapPin, Loader2, Navigation
} from 'lucide-react';
import { structuredEWasteCategories } from '../../data/scrapPrices';
import { calculateFairPriceRange } from '../../utils/rulesEngine';
import { mockBenchmarkPrices, mockCollector } from '../../data/mockData';
import { validateQuotedPriceBackend } from '../../services/pricingService';
import { useTranslation } from '../../i18n';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { getCategoryPrice, getCachedSafetyGuidance } from '../../services/offline/offlineContentService';

export default function RegisterWaste({ benchmarkPrices = mockBenchmarkPrices, onLotCreated, collectorProfile = mockCollector }) {
  const navigate = useNavigate();
  const { t, tCategory, tCondition } = useTranslation();
  const { online } = useOnlineStatus();

  const [category, setCategory] = useState(structuredEWasteCategories[0].name);
  const [material, setMaterial] = useState(structuredEWasteCategories[0].description || structuredEWasteCategories[0].name);
  const [quantity, setQuantity] = useState('25');
  const [unit, setUnit] = useState('kg');
  const [condition, setCondition] = useState('Non-working / Scrap');
  const [location, setLocation] = useState(collectorProfile?.location || 'Chennai - Guindy Industrial Estate');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState('');
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offlinePriceInfo, setOfflinePriceInfo] = useState({ isOffline: false, lastUpdated: null });
  const [safetyGuidance, setSafetyGuidance] = useState(null);
  const [showSafetyGuide, setShowSafetyGuide] = useState(false);

  // Load offline cached prices and safety guidelines
  useEffect(() => {
    getCategoryPrice(category).then(info => {
      setOfflinePriceInfo(info);
    });
    getCachedSafetyGuidance(category).then(guide => {
      setSafetyGuidance(guide);
    });
  }, [category, online]);

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

  // Geolocation detector
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please enter location manually.");
      return;
    }

    setIsLocating(true);
    setLocationSuccess('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        setLocationSuccess(`GPS coordinates detected: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
        setLocation(`Chennai Hub (${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E)`);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        alert('Could not access GPS location. You can continue by entering your location manually.');
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!parsedQty || parsedQty <= 0) {
      alert("Please enter a valid positive quantity / lot weight.");
      return;
    }

    if (!parsedQuote || parsedQuote <= 0) {
      alert("Please enter a valid positive recycler quoted price.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onLotCreated) {
        await onLotCreated({
          category,
          material: (material || '').trim() || category,
          quantity: parsedQty,
          totalWeightKg: parsedQty,
          unit,
          condition,
          location,
          latitude,
          longitude,
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

        if (!online) {
          alert("Saved offline. It will sync automatically when internet connection returns.");
        }
      }

      navigate('/collector/requests');
    } catch (err) {
      alert(err.message || "Failed to create waste lot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Row 3: Location (with GPS Detect) and Collection Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold text-[#203128]">
                  {t('storageLocationHub', 'Storage Location / Hub')} *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                  className="text-[11px] font-bold text-[#3F7655] hover:text-[#244936] flex items-center gap-1 cursor-pointer"
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>{t('detectingGps', 'Detecting GPS...')}</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-3 h-3" />
                      <span>{t('detectMyLocation', 'Detect My Location')}</span>
                    </>
                  )}
                </button>
              </div>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('placeholderLocation')}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
              {locationSuccess && (
                <p className="text-[10px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{locationSuccess}</span>
                </p>
              )}
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

          {/* QUOTED AMOUNT & LIVE BACKEND PRICING VALIDATION */}
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

            {/* Offline Price Badge */}
            {!online && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs font-bold text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Offline price — last updated: {offlinePriceInfo.lastUpdated || 'Initial Baseline'}</span>
                </div>
                <span className="text-[10px] font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md self-start sm:self-auto">
                  IndexedDB Cached Rate
                </span>
              </div>
            )}

            {/* Cached Safety Guidance Box */}
            {safetyGuidance && (
              <div className="p-4 bg-[#EAF4E8] border border-[#3F7655]/20 rounded-2xl space-y-2 text-xs">
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setShowSafetyGuide(!showSafetyGuide)}
                >
                  <span className="font-extrabold text-[#244936] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#3F7655]" />
                    <span>Safety Protocols for {category} (Offline Cached)</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#3F7655] hover:underline">
                    {showSafetyGuide ? '▲ Hide' : '▼ View Safety Guidance'}
                  </span>
                </div>

                {showSafetyGuide && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] animate-in fade-in duration-150">
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-1">
                      <strong className="text-emerald-800 uppercase block text-[10px] font-black">✓ Handling Do's</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-[#203128] font-medium">
                        {safetyGuidance.dos?.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-rose-200 space-y-1">
                      <strong className="text-rose-800 uppercase block text-[10px] font-black">✕ Handling Don'ts</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-[#203128] font-medium">
                        {safetyGuidance.donts?.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                {t('quotedPriceHelpText', 'Enter your asking or quoted price per {unit}. The system checks if it falls within the fair ±{tolerance}% reference range.', { unit, tolerance: displayTolerance })}
              </p>
            </div>

            {/* Live Benchmark & Allowed Range Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-[#3F7655]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#718078] tracking-wider block">
                  {t('categoryBenchmarkLabel', 'Category Benchmark')}
                </span>
                <span className="text-base font-black text-[#203128] block">
                  ₹{displayBenchmark} / {unit}
                </span>
                <span className="text-[10px] text-[#718078] block">
                  {t('cpcbReferenceRateLabel', 'CPCB Reference Price')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#3F7655]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#718078] tracking-wider block">
                  {t('allowedPriceRange', 'Allowed Price Range')} (±{displayTolerance}%)
                </span>
                <span className="text-base font-black text-[#3F7655] block">
                  ₹{minPrice} – ₹{maxPrice} / {unit}
                </span>
                <span className="text-[10px] text-[#718078] block">
                  {t('fairTransactionBoundsLabel', 'Fair Transaction Bounds')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#3F7655]/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#718078] tracking-wider block">
                  {t('estimatedTotalValue', 'Estimated Total Value')}
                </span>
                <span className="text-base font-black text-[#203128] block">
                  ₹{estimatedTotalAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#718078] block">
                  {parsedQty} {unit} × ₹{parsedQuote || 0}
                </span>
              </div>
            </div>

            {/* Clearance & Validation Status Banner */}
            <div className={`p-4 rounded-2xl border transition-all ${
              validation.isCleared
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : validation.position === 'BELOW_RANGE'
                  ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                  : 'bg-amber-50/90 border-amber-300 text-amber-950'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold ${
                    validation.isCleared ? 'bg-emerald-600' : validation.position === 'BELOW_RANGE' ? 'bg-rose-600' : 'bg-amber-600'
                  }`}>
                    {validation.isCleared ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider">
                        Validation Status:
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                        validation.isCleared 
                          ? 'bg-emerald-200 text-emerald-900' 
                          : 'bg-rose-200 text-rose-900'
                      }`}>
                        {validation.isCleared ? t('preClearedBadge', 'PRE-CLEARED ✅') : t('notClearedBadge', 'NOT CLEARED ❌')}
                      </span>
                      {!validation.isCleared && (
                        <span className="text-[11px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                          {validation.position === 'BELOW_RANGE' ? t('belowAllowedRange', 'Below Allowed Range') : t('aboveAllowedRange', 'Above Allowed Range')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold leading-snug">
                      {validation.message}
                    </p>
                    <p className="text-[11px] opacity-80">
                      {validation.explanation}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-black border flex items-center gap-1.5 shadow-sm ${
                    validation.isCleared
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : validation.position === 'BELOW_RANGE'
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-amber-600 text-white border-amber-700'
                  }`}>
                    {validation.isCleared ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t('preClearedBadge', 'Pre-Cleared')}</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4" />
                        <span>{t('flaggedBadge', 'Flagged')} ({validation.diffPercent}% off)</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              {t('additionalInspectionNotes', 'Collector Notes / Special Instructions')}
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('placeholderStorageNotes', 'e.g. Stored in ESD safe boxes, ready for loading dock inspection.')}
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl p-4 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#3F7655]/10 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/collector/dashboard')}
              className="px-6 py-3.5 text-xs font-bold text-[#718078] hover:text-[#203128] cursor-pointer"
            >
              {t('cancel', 'Cancel')}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-[#3F7655] hover:bg-[#244936] disabled:opacity-60 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('submittingToDatabase', 'Submitting to Database...')}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('submitAndBroadcastBtn', 'Declare Request & Broadcast to Recyclers')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
