import React, { useState } from 'react';
import { Search, Filter, ShoppingBag, DollarSign, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Scale, MapPin } from 'lucide-react';
import { mockWasteLots, mockBenchmarkPrices } from '../../data/mockData';
import { calculateFairPriceRange, evaluateOfferFairPrice } from '../../utils/rulesEngine';

export default function WasteRequests({ materialLots = mockWasteLots }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLotForBid, setSelectedLotForBid] = useState(null);
  const [bidRate, setBidRate] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);

  const availableLots = (materialLots || mockWasteLots).filter(l => ['REGISTERED', 'MATCHED'].includes(l.status));

  const filteredLots = availableLots.filter(lot =>
    (lot.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lot.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lot.material || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lot.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenBid = (lot) => {
    setSelectedLotForBid(lot);
    setBidRate(String(lot.benchmarkPrice || 350));
    setBidSubmitted(false);
  };

  const handleSendBid = (e) => {
    e.preventDefault();
    setBidSubmitted(true);
    setTimeout(() => {
      setSelectedLotForBid(null);
      setBidSubmitted(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Available Waste Stream</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          Explore verified digital e-waste manifests from collectors across Tamil Nadu and submit procurement bids.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material category, lot ID, or location..."
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>

        <span className="text-xs font-black text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1.5 rounded-xl">
          {filteredLots.length} Lots Available
        </span>
      </div>

      {/* Grid of Waste Stream Lots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => {
          const benchmark = lot.benchmarkPrice || 350;
          const fairBand = calculateFairPriceRange(benchmark, 25);

          return (
            <div
              key={lot.id}
              className="bg-white p-6 rounded-[32px] border border-[#3F7655]/20 shadow-md hover:border-[#3F7655]/50 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {lot.category}
                    </span>
                    <h3 className="text-base font-black text-[#203128] mt-1.5">{lot.id}</h3>
                  </div>
                  <span className="text-xs font-black text-[#244936] bg-[#F2C94C] px-2.5 py-0.5 rounded-full">
                    {lot.quantity || lot.totalWeightKg} kg
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-[#203128]">{lot.material}</p>
                  <p className="text-[#718078] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
                    <span>{lot.location}</span>
                  </p>
                </div>

                {/* Benchmark Band info */}
                <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#3F7655]/10 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-[#718078] uppercase">Benchmark Scrap Rate</span>
                    <span className="font-black text-[#203128]">₹{benchmark} / kg</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#718078]">Fair Range (±25%)</span>
                    <span className="font-bold text-[#3F7655]">₹{fairBand.minPrice} – ₹{fairBand.maxPrice} / kg</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#3F7655]/10">
                <button
                  onClick={() => handleOpenBid(lot)}
                  className="w-full py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl font-black text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Submit Price Offer</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Bid Modal */}
      {selectedLotForBid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-[#3F7655]/20 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                  Submit Recycler Offer
                </span>
                <h3 className="text-xl font-black text-[#203128] mt-1">{selectedLotForBid.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLotForBid(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBid} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F8F5EA] rounded-xl space-y-1">
                <p><strong>Material:</strong> {selectedLotForBid.material}</p>
                <p><strong>Weight:</strong> {selectedLotForBid.quantity || selectedLotForBid.totalWeightKg} kg</p>
                <p><strong>Benchmark Rate:</strong> ₹{selectedLotForBid.benchmarkPrice || 350} / kg</p>
              </div>

              <div>
                <label className="font-extrabold text-[#203128] block mb-1">
                  Your Offered Price per kg (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={bidRate}
                  onChange={(e) => setBidRate(e.target.value)}
                  className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-sm font-black text-[#203128] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#DDEBD8] rounded-xl border border-[#3F7655]/30 flex justify-between items-center">
                <span className="font-bold text-[#244936]">Total Payout Commitment:</span>
                <span className="text-base font-black text-[#244936]">
                  ₹{(Math.round((parseFloat(bidRate) || 0) * (selectedLotForBid.quantity || selectedLotForBid.totalWeightKg || 0))).toLocaleString()}
                </span>
              </div>

              {bidSubmitted && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Bid successfully dispatched to Collector!</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#3F7655]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLotForBid(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bidSubmitted}
                  className="px-6 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold rounded-xl shadow cursor-pointer"
                >
                  Confirm & Send Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
