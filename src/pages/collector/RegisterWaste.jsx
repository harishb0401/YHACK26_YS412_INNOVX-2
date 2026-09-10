import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';
import { structuredEWasteCategories } from '../../data/scrapPrices';
import { calculateFairPriceRange } from '../../utils/rulesEngine';
import { mockBenchmarkPrices, mockCollector } from '../../data/mockData';

export default function RegisterWaste({ benchmarkPrices = mockBenchmarkPrices, onLotCreated, collectorProfile = mockCollector }) {
  const navigate = useNavigate();

  const [category, setCategory] = useState(structuredEWasteCategories[0].name);
  const [material, setMaterial] = useState(structuredEWasteCategories[0].defaultMaterial);
  const [quantity, setQuantity] = useState('25');
  const [unit, setUnit] = useState('kg');
  const [condition, setCondition] = useState('Non-working / Scrap');
  const [location, setLocation] = useState(collectorProfile?.location || 'Chennai - Guindy Industrial Estate');
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const selectedCatData = structuredEWasteCategories.find(c => c.name === category);
  const benchmarkRate = (benchmarkPrices || []).find(p => p.category === category)?.referencePrice || selectedCatData?.benchmarkPrice || 350;
  const tolerance = (benchmarkPrices || []).find(p => p.category === category)?.tolerancePercent !== undefined 
    ? (benchmarkPrices || []).find(p => p.category === category).tolerancePercent 
    : (selectedCatData?.tolerance ? selectedCatData.tolerance * 100 : 25);
    
  const fairRange = calculateFairPriceRange(benchmarkRate, tolerance);
  const parsedQty = parseFloat(quantity) || 0;
  const estimatedVal = Math.round(parsedQty * benchmarkRate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!parsedQty || parsedQty <= 0) {
      alert("Please enter a valid positive quantity.");
      return;
    }

    if (onLotCreated) {
      onLotCreated({
        category,
        material: material.trim() || category,
        quantity: parsedQty,
        unit,
        condition,
        location,
        collectionDate,
        notes,
        benchmarkPrice: benchmarkRate
      });
    }

    navigate('/collector/waste-lots');
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
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-lg space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase text-[#3F7655] tracking-widest bg-[#DDEBD8] px-3 py-1 rounded-full">
            Fair Pricing & Manifest Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128] mt-2">Register E-Waste Lot</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Classify and create an authentic Digital Material Lot for verified CPCB recyclers in Tamil Nadu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                E-Waste Category *
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const newCat = e.target.value;
                  setCategory(newCat);
                  const matched = structuredEWasteCategories.find(c => c.name === newCat);
                  if (matched) setMaterial(matched.defaultMaterial);
                }}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                {structuredEWasteCategories.map((c, i) => (
                  <option key={i} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                Material Description *
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                Unit of Measurement
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="units">Units / Pieces</option>
                <option value="tons">Metric Tons (MT)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                <option value="Non-working / Scrap">Non-working / Scrap</option>
                <option value="Intact / Used">Intact / Used</option>
                <option value="Partially Dismantled">Partially Dismantled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                Storage Location / Hub *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Guindy Industrial Estate, Chennai"
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">
                Collection Date *
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

          {/* Pricing Calculation Preview Box */}
          <div className="p-6 bg-[#FAF8F2] rounded-[24px] border border-[#3F7655]/20 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#3F7655] flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>Automated Benchmark Pricing Model</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#3F7655]/10">
                <span className="text-[10px] font-extrabold text-[#718078] uppercase block">Benchmark Rate</span>
                <span className="text-base font-black text-[#203128]">₹{benchmarkRate} / {unit}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#3F7655]/10">
                <span className="text-[10px] font-extrabold text-[#718078] uppercase block">Acceptable Price Band (±{tolerance}%)</span>
                <span className="text-xs font-black text-[#3F7655]">₹{fairRange.minPrice} – ₹{fairRange.maxPrice} / {unit}</span>
              </div>

              <div className="p-3 bg-[#DDEBD8] rounded-xl border border-[#3F7655]/30">
                <span className="text-[10px] font-extrabold text-[#244936] uppercase block">Estimated Lot Value</span>
                <span className="text-base font-black text-[#244936]">₹{estimatedVal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#718078]">
              <CheckCircle2 className="w-4 h-4 text-[#3F7655] shrink-0 mt-0.5" />
              <span>
                Any recycler offer within this range is automatically pre-cleared without penalty warnings.
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              Additional Inspection Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Dry indoor storage, segregated into anti-static bins..."
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl p-4 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#3F7655] hover:bg-[#244936] text-white font-black text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Create Digital Waste Lot & Generate QR Signature</span>
          </button>
        </form>
      </div>
    </div>
  );
}
