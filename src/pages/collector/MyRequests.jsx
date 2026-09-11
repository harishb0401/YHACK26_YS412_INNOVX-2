import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Package, ArrowRight, Clock, 
  CheckCircle2, DollarSign, Scale, Calendar, Eye, LayoutGrid, ListFilter
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import { mockWasteLots, mockOffers } from '../../data/mockData';
import { useTranslation } from '../../i18n';

export default function MyRequests({ materialLots = mockWasteLots, offers = mockOffers }) {
  const navigate = useNavigate();
  const { t, tCategory, tStatus } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  const allLots = materialLots || mockWasteLots;
  const allOffers = offers || mockOffers;

  // Filter requests
  const filteredRequests = allLots.filter((lot) => {
    const matchesSearch = 
      (lot.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lot.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lot.material || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lot.location || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'ALL' || 
      lot.status === statusFilter ||
      (statusFilter === 'AWAITING_OFFERS' && ['AWAITING_OFFERS', 'SUBMITTED', 'AVAILABLE', 'REGISTERED'].includes(lot.status)) ||
      (statusFilter === 'OFFERS_RECEIVED' && ['OFFERS_RECEIVED', 'OFFER_RECEIVED', 'MATCHED'].includes(lot.status)) ||
      (statusFilter === 'OFFER_ACCEPTED' && ['OFFER_ACCEPTED', 'ACCEPTED', 'PICKUP_SCHEDULED'].includes(lot.status)) ||
      (statusFilter === 'IN_TRANSIT' && ['IN_TRANSIT', 'In Transit', 'DISPATCHED', 'HANDED_OVER'].includes(lot.status)) ||
      (statusFilter === 'COMPLETED' && ['COMPLETED', 'PAYMENT_COMPLETED'].includes(lot.status));

    return matchesSearch && matchesStatus;
  });

  // Count helper
  const getOffersForLot = (lotId) => {
    return allOffers.filter(o => o.lotId === lotId);
  };

  const awaitingCount = allLots.filter(l => ['AWAITING_OFFERS', 'SUBMITTED', 'AVAILABLE', 'REGISTERED'].includes(l.status)).length;
  const offersReceivedCount = allLots.filter(l => ['OFFERS_RECEIVED', 'OFFER_RECEIVED', 'MATCHED'].includes(l.status)).length;
  const acceptedCount = allLots.filter(l => ['OFFER_ACCEPTED', 'ACCEPTED', 'PICKUP_SCHEDULED', 'IN_TRANSIT', 'HANDED_OVER'].includes(l.status)).length;
  const completedCount = allLots.filter(l => ['COMPLETED', 'PAYMENT_COMPLETED'].includes(l.status)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3 py-0.5 rounded-full">
              {t('collectorPortal', 'Collector Portal')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128] mt-1.5">{t('myEWasteRequests', 'My E-Waste Requests')}</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            {t('trackRequestsSubtitle', 'Track your declared e-waste requests, review incoming offers from authorized recyclers, and manage handovers.')}
          </p>
        </div>

        <button
          onClick={() => navigate('/collector/register-waste')}
          className="px-5 py-3 bg-[#3F7655] hover:bg-[#244936] text-white rounded-2xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createEWasteRequest', 'Create E-Waste Request')}</span>
        </button>
      </div>

      {/* Overview Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setStatusFilter('AWAITING_OFFERS')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'AWAITING_OFFERS' 
              ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-sm' 
              : 'bg-white border-[#3F7655]/15 hover:border-[#3F7655]/40 text-[#203128]'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${statusFilter === 'AWAITING_OFFERS' ? 'text-white/80' : 'text-[#718078]'}`}>
            {t('statusAWAITING_OFFERS', 'Awaiting Offers')}
          </span>
          <span className="text-xl font-black mt-1 block">{awaitingCount}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('OFFERS_RECEIVED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'OFFERS_RECEIVED' 
              ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-sm' 
              : 'bg-white border-[#3F7655]/15 hover:border-[#3F7655]/40 text-[#203128]'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${statusFilter === 'OFFERS_RECEIVED' ? 'text-white/80' : 'text-[#718078]'}`}>
            {t('statusOFFERS_RECEIVED', 'Offers Received')}
          </span>
          <span className="text-xl font-black mt-1 block">{offersReceivedCount}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('OFFER_ACCEPTED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'OFFER_ACCEPTED' 
              ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-sm' 
              : 'bg-white border-[#3F7655]/15 hover:border-[#3F7655]/40 text-[#203128]'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${statusFilter === 'OFFER_ACCEPTED' ? 'text-white/80' : 'text-[#718078]'}`}>
            {t('offerAcceptedInTransit', 'Offer Accepted / In Transit')}
          </span>
          <span className="text-xl font-black mt-1 block">{acceptedCount}</span>
        </div>

        <div 
          onClick={() => setStatusFilter('COMPLETED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'COMPLETED' 
              ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-sm' 
              : 'bg-white border-[#3F7655]/15 hover:border-[#3F7655]/40 text-[#203128]'
          }`}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${statusFilter === 'COMPLETED' ? 'text-white/80' : 'text-[#718078]'}`}>
            {t('statusCOMPLETED', 'Completed')}
          </span>
          <span className="text-xl font-black mt-1 block">{completedCount}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[28px] border border-[#3F7655]/20 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchRequestPlaceholder', 'Search request ID, material, or location...')}
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'ALL', label: t('allRequests', 'All Requests') },
            { key: 'AWAITING_OFFERS', label: t('statusAWAITING_OFFERS', 'Awaiting Offers') },
            { key: 'OFFERS_RECEIVED', label: t('statusOFFERS_RECEIVED', 'Offers Received') },
            { key: 'OFFER_ACCEPTED', label: t('statusOFFER_ACCEPTED', 'Offer Accepted') },
            { key: 'IN_TRANSIT', label: t('statusInTransit', 'In Transit') },
            { key: 'COMPLETED', label: t('statusCOMPLETED', 'Completed') }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === item.key
                  ? 'bg-[#3F7655] text-white shadow-sm'
                  : 'bg-[#F8F5EA] text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* View Toggle */}
          <div className="hidden lg:flex items-center bg-[#F8F5EA] p-1 rounded-xl border border-[#3F7655]/15 ml-2">
            <button
              onClick={() => setViewMode('cards')}
              title="Cards View"
              className={`p-1.5 rounded-lg transition ${viewMode === 'cards' ? 'bg-white shadow text-[#3F7655]' : 'text-[#718078]'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow text-[#3F7655]' : 'text-[#718078]'}`}
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* LISTING CONTENT */}
      {filteredRequests.length > 0 ? (
        viewMode === 'cards' ? (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => {
              const reqOffers = getOffersForLot(request.id);
              const qty = request.quantity || request.totalWeightKg || 1;
              const unit = request.unit || 'kg';
              const benchmark = request.benchmarkPrice || 350;
              const estValue = request.agreedTotalValue || request.estimatedLotValue || (qty * benchmark);

              return (
                <div
                  key={request.id}
                  className="bg-white p-6 rounded-[32px] border border-[#3F7655]/20 shadow-md hover:border-[#3F7655]/50 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                          {tCategory(request.category)}
                        </span>
                        <h3 className="text-base font-black text-[#203128] mt-1.5">{request.material}</h3>
                        <span className="text-xs font-mono font-bold text-[#718078]">{request.id}</span>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[#718078]">
                      <div className="p-2.5 bg-[#F8F5EA] rounded-xl">
                        <span className="text-[10px] text-[#718078] block uppercase font-bold">{t('quantityLabel', 'Quantity')}</span>
                        <span className="text-sm font-black text-[#203128]">{qty} {unit}</span>
                      </div>

                      <div className="p-2.5 bg-[#F8F5EA] rounded-xl">
                        <span className="text-[10px] text-[#718078] block uppercase font-bold">{t('submissionDate', 'Submission Date')}</span>
                        <span className="text-xs font-bold text-[#203128]">{request.collectionDate || request.createdDate || 'Today'}</span>
                      </div>
                    </div>

                    {/* Offers Status Highlight */}
                    <div className="p-3 bg-[#FAF8F2] rounded-2xl border border-[#3F7655]/15 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#718078] block">{t('receivedOffers', 'Received Offers')}</span>
                        <span className="font-black text-[#203128]">
                          {reqOffers.length > 0 ? (
                            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {reqOffers.length} {reqOffers.length === 1 ? t('offerCountOne', 'Offer') : t('offerCountMany', 'Offers')} {t('received', 'Received')}
                            </span>
                          ) : (
                            <span className="text-amber-700 font-bold flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {t('awaitingRecyclerOffers', 'Awaiting Recycler Offers')}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-extrabold uppercase text-[#718078] block">{t('benchmarkPriceLabel', 'Benchmark')}</span>
                        <span className="font-extrabold text-[#3F7655]">₹{benchmark}/{unit}</span>
                      </div>
                    </div>

                    {/* Recycler Assigned Banner (if accepted) */}
                    {request.selectedRecyclerName && (
                      <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span className="truncate">{t('acceptedRecycler', 'Accepted: {name}', { name: request.selectedRecyclerName })}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between">
                    <span className="text-[11px] text-[#718078] font-semibold truncate max-w-[140px]">
                      {request.location}
                    </span>

                    <button
                      onClick={() => navigate(`/collector/requests/${request.id}`)}
                      className="px-4 py-2 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{t('viewDetails', 'View Details')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-[32px] border border-[#3F7655]/20 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F2] border-b border-[#3F7655]/15 text-[#203128] font-black uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-4">{t('requestIdCol', 'Request ID')}</th>
                    <th className="px-6 py-4">{t('wasteMaterialCol', 'Waste Material')}</th>
                    <th className="px-6 py-4">{t('quantityLabel', 'Quantity')}</th>
                    <th className="px-6 py-4">{t('submissionDate', 'Submission Date')}</th>
                    <th className="px-6 py-4">{t('status', 'Status')}</th>
                    <th className="px-6 py-4">{t('offersReceived', 'Offers Received')}</th>
                    <th className="px-6 py-4 text-right">{t('actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3F7655]/10 font-semibold text-[#203128]">
                  {filteredRequests.map((request) => {
                    const reqOffers = getOffersForLot(request.id);
                    const qty = request.quantity || request.totalWeightKg || 1;
                    const unit = request.unit || 'kg';

                    return (
                      <tr key={request.id} className="hover:bg-[#F8F5EA]/70 transition">
                        <td className="px-6 py-4 font-mono font-black text-[#203128]">
                          {request.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-[#203128]">{request.material}</div>
                          <div className="text-[11px] text-[#718078]">{tCategory(request.category)}</div>
                        </td>
                        <td className="px-6 py-4 font-extrabold">
                          {qty} {unit}
                        </td>
                        <td className="px-6 py-4 text-[#718078]">
                          {request.collectionDate || request.createdDate || 'Today'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={request.status} size="sm" />
                        </td>
                        <td className="px-6 py-4">
                          {reqOffers.length > 0 ? (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {reqOffers.length} {reqOffers.length === 1 ? t('offerCountOne', 'Offer') : t('offerCountMany', 'Offers')}
                            </span>
                          ) : (
                            <span className="text-[#718078] text-[11px] italic">0 ({t('awaiting', 'Awaiting')})</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/collector/requests/${request.id}`)}
                            className="px-3.5 py-1.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl font-bold text-xs shadow transition inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span>{t('viewDetails', 'View Details')}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white p-12 rounded-[32px] border border-[#3F7655]/20 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center mx-auto font-black text-xl">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[#203128]">{t('noEWasteRequestsFound', 'No E-Waste Requests Found')}</h3>
          <p className="text-xs text-[#718078] max-w-sm mx-auto">
            {searchQuery 
              ? t('noRequestsMatchedQuery', 'No requests matched your filter parameters. Try clearing your search query.') 
              : t('noRequestsSubmittedYet', 'You have not submitted any e-waste requests yet. Create a new request to notify authorized recyclers in your area.')}
          </p>
          <button
            onClick={() => navigate('/collector/register-waste')}
            className="px-6 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl font-bold text-xs shadow transition cursor-pointer"
          >
            {t('createFirstEWasteRequest', 'Create First E-Waste Request')}
          </button>
        </div>
      )}
    </div>
  );
}
