import React, { useState } from 'react';
import { 
  Search, Filter, ShoppingBag, DollarSign, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertTriangle, Scale, MapPin, Calendar, Clock, Truck, 
  Send, X
} from 'lucide-react';
import { mockWasteLots, mockBenchmarkPrices, mockRecycler } from '../../data/mockData';
import { calculateFairPriceRange } from '../../utils/rulesEngine';
import { useTranslation } from '../../i18n';

export default function WasteRequests({ 
  materialLots = mockWasteLots, 
  onSubmitOffer,
  recyclerProfile = mockRecycler
}) {
  const { t, tCategory } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLotForBid, setSelectedLotForBid] = useState(null);
  const [bidRate, setBidRate] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [logisticsNotes, setLogisticsNotes] = useState('Direct factory pickup arranged with certified weighing scales.');
  const [bidSubmitted, setBidSubmitted] = useState(false);

  // Available collector requests
  const availableLots = (materialLots || mockWasteLots).filter(l => 
    ['AWAITING_OFFERS', 'SUBMITTED', 'AVAILABLE', 'REGISTERED', 'OFFERS_RECEIVED', 'OFFER_RECEIVED', 'MATCHED'].includes(l.status)
  );

  const filteredLots = availableLots.filter(lot =>
    (lot.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lot.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lot.material || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lot.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenBid = (lot) => {
    setSelectedLotForBid(lot);
    setBidRate(String(lot.benchmarkPrice || 350));
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 2);
    setPickupDate(defaultDate.toISOString().split('T')[0]);
    setBidSubmitted(false);
  };

  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  const handleSendBid = async (e) => {
    e.preventDefault();
    const rate = parseFloat(bidRate);
    if (!rate || rate <= 0) {
      alert("Please enter a valid positive bid rate.");
      return;
    }

    const qty = selectedLotForBid.quantity || selectedLotForBid.totalWeightKg || 1;
    const total = Math.round(rate * qty);

    if (onSubmitOffer) {
      setIsSubmittingBid(true);
      try {
        await onSubmitOffer({
          lotId: selectedLotForBid.lotId || selectedLotForBid.id,
          recyclerId: recyclerProfile?._id || recyclerProfile?.id || "REC-TN-01",
          recyclerName: recyclerProfile?.organizationName || recyclerProfile?.companyName || recyclerProfile?.name || "GreenCycle Material Recovery Ltd",
          recyclerVerified: true,
          pricePerUnit: rate,
          ratePerKg: rate,
          totalPrice: total,
          proposedPickupDate: pickupDate,
          notes: logisticsNotes,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        });
        setBidSubmitted(true);
        setTimeout(() => {
          setSelectedLotForBid(null);
          setBidSubmitted(false);
        }, 1200);
      } catch (err) {
        alert(err.message || "Failed to submit offer to server.");
      } finally {
        setIsSubmittingBid(false);
      }
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3 py-0.5 rounded-full">
            {t('recyclerIntakePipeline', 'Recycler Intake Pipeline')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128] mt-1.5">{t('availableCollectorRequests', 'Available Collector Requests')}</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          {t('availableRequestsDesc', 'Review authenticated e-waste requests declared by registered collectors and submit competitive price offers.')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[28px] border border-[#3F7655]/20 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchRecyclerRequestsPlaceholder', 'Search material category, request ID, or location...')}
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>

        <span className="text-xs font-black text-[#3F7655] bg-[#DDEBD8] px-3.5 py-1.5 rounded-xl self-start md:self-auto">
          {t('requestsAvailableBiddingCount', '{count} Requests Available for Bidding', { count: filteredLots.length })}
        </span>
      </div>

      {/* Grid of Waste Stream Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLots.map((lot) => {
          const benchmark = lot.benchmarkPrice || 350;
          const fairBand = calculateFairPriceRange(benchmark, 25);
          const qty = lot.quantity || lot.totalWeightKg || 1;
          const unit = lot.unit || 'kg';

          return (
            <div
              key={lot.id}
              className="bg-white p-6 rounded-[32px] border border-[#3F7655]/20 shadow-md hover:border-[#3F7655]/50 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {tCategory(lot.category)}
                    </span>
                    <h3 className="text-base font-black text-[#203128] mt-1.5">{lot.material}</h3>
                    <span className="text-xs font-mono font-bold text-[#718078]">{lot.id}</span>
                  </div>
                  <span className="text-xs font-black text-[#244936] bg-[#F2C94C] px-2.5 py-0.5 rounded-full">
                    {qty} {unit}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#718078]">
                  <p className="flex items-center gap-1.5 text-[#203128] font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#3F7655] shrink-0" />
                    <span className="truncate">{lot.location}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#3F7655] shrink-0" />
                    <span>{t('postedDate', 'Posted')}: {lot.collectionDate || lot.createdDate || 'Today'}</span>
                  </p>
                </div>

                {/* Benchmark Band info */}
                <div className="p-3.5 bg-[#FAF8F2] rounded-2xl border border-[#3F7655]/10 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-[#718078] uppercase">{t('stateBenchmarkRate', 'State Benchmark Rate')}</span>
                    <span className="font-black text-[#203128]">₹{benchmark} / {unit}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#718078]">{t('fairRange25', 'Fair Range (±25%)')}</span>
                    <span className="font-bold text-[#3F7655]">₹{fairBand.minPrice} – ₹{fairBand.maxPrice} / {unit}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#3F7655]/10">
                <button
                  onClick={() => handleOpenBid(lot)}
                  className="w-full py-3 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl font-black text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{t('submitPriceOffer', 'Submit Price Offer')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Bid Modal */}
      {selectedLotForBid && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] border border-[#3F7655]/20 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
              <div>
                <span className="text-[10px] font-black uppercase text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                  {t('submitRecyclerOfferModalTitle', 'Submit Recycler Offer')}
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
              <div className="p-3.5 bg-[#F8F5EA] rounded-2xl space-y-1">
                <p><strong>{t('materialCategory', 'Material')}:</strong> {selectedLotForBid.material}</p>
                <p><strong>{t('weight', 'Weight')}:</strong> {selectedLotForBid.quantity || selectedLotForBid.totalWeightKg} {selectedLotForBid.unit || 'kg'}</p>
                <p><strong>{t('benchmarkPriceLabel', 'Benchmark Rate')}:</strong> ₹{selectedLotForBid.benchmarkPrice || 350} / {selectedLotForBid.unit || 'kg'}</p>
              </div>

              <div>
                <label className="font-extrabold text-[#203128] block mb-1">
                  {t('yourOfferedPrice', 'Your Offered Price per Unit (₹)')} *
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

              <div>
                <label className="font-extrabold text-[#203128] block mb-1">
                  {t('proposedPickupDateLabel', 'Proposed Pickup Date')} *
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-extrabold text-[#203128] block mb-1">
                  {t('logisticsWeighingTerms', 'Logistics & Weighing Terms')}
                </label>
                <input
                  type="text"
                  value={logisticsNotes}
                  onChange={(e) => setLogisticsNotes(e.target.value)}
                  className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-[#DDEBD8] rounded-2xl border border-[#3F7655]/30 flex justify-between items-center">
                <span className="font-bold text-[#244936]">{t('totalPayoutCommitment', 'Total Payout Commitment')}:</span>
                <span className="text-base font-black text-[#244936]">
                  ₹{(Math.round((parseFloat(bidRate) || 0) * (selectedLotForBid.quantity || selectedLotForBid.totalWeightKg || 0))).toLocaleString()}
                </span>
              </div>

              {bidSubmitted && (
                <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{t('offerDispatchedNotice', 'Offer dispatched! Collector has been notified.')}</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#3F7655]/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLotForBid(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={bidSubmitted}
                  className="px-6 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold rounded-xl shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('confirmSubmitOffer', 'Confirm & Submit Offer')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
