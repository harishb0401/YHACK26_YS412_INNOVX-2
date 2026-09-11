import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, ArrowRight, Package, DollarSign, Scale, ShieldCheck, 
  CheckCircle2, Clock, Sparkles, Inbox, Award
} from 'lucide-react';
import StatCard from '../../components/Cards/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { mockWasteLots, mockOffers, mockTransactions, mockCollector } from '../../data/mockData';
import { useTranslation } from '../../i18n';

export default function CollectorDashboard({ 
  materialLots = mockWasteLots, 
  offers = mockOffers,
  transactions = mockTransactions, 
  collectorProfile = mockCollector 
}) {
  const navigate = useNavigate();
  const { t, tCategory } = useTranslation();

  const myLots = materialLots || mockWasteLots;
  const allOffers = offers || mockOffers;

  const activeRequests = myLots.filter(l => !['COMPLETED', 'CANCELLED', 'REJECTED'].includes(l.status));
  const awaitingOffersCount = myLots.filter(l => ['AWAITING_OFFERS', 'SUBMITTED', 'AVAILABLE', 'REGISTERED'].includes(l.status)).length;
  const totalWeight = myLots.reduce((acc, l) => acc + (parseFloat(l.quantity || l.totalWeightKg) || 0), 0);
  const totalEarnings = (transactions || []).reduce((acc, tx) => acc + (tx.totalValue || 0), 0) + 
                        myLots.filter(l => l.status === 'COMPLETED').reduce((s, l) => s + (l.agreedTotalValue || l.estimatedLotValue || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#244936] text-white p-6 sm:p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#F2C94C] bg-white/10 px-3 py-0.5 rounded-full">
              {t('collectorPortal')}
            </span>
            {collectorProfile?.phone_verified && (
              <span className="text-xs font-black text-[#244936] bg-[#F2C94C] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {t('phoneVerifiedBadge')}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            {t('goodMorningUser', { name: collectorProfile?.name || "Ramesh Kumar" })}
          </h1>
          <p className="text-xs sm:text-sm text-[#DDEBD8] mt-1">
            {t('eWasteManifestSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/collector/register-waste')}
            className="px-6 py-3.5 bg-[#F2C94C] hover:bg-[#e0b83b] text-[#244936] rounded-2xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createEWasteRequest')}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Cards (Request-Driven Flow) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Create Request */}
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#3F7655]/40 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-bold mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">{t('createEWasteRequest')}</h3>
            <p className="text-xs text-[#718078] mt-1">
              {t('addEWasteSubtitle')}
            </p>
          </div>
          <Link
            to="/collector/register-waste"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>{t('navRegisterEWaste')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: My Requests */}
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#3F7655]/40 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
              <Inbox className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">{t('myDeclaredLots')}</h3>
            <p className="text-xs text-[#718078] mt-1">
              {t('availableRequestsDesc')}
            </p>
          </div>
          <Link
            to="/collector/requests"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>{t('viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Transactions */}
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between hover:border-[#3F7655]/40 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">{t('transactionsTitle')}</h3>
            <p className="text-xs text-[#718078] mt-1">
              {t('transactionsSubtitle')}
            </p>
          </div>
          <Link
            to="/collector/transactions"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>{t('navTransactions')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent E-Waste Requests Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#203128]">{t('myDeclaredLots')}</h2>
            <p className="text-xs text-[#718078]">{t('availableRequestsDesc')}</p>
          </div>
          <Link
            to="/collector/requests"
            className="text-xs font-black text-[#3F7655] hover:underline flex items-center gap-1"
          >
            <span>{t('viewDetails')} ({myLots.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myLots.slice(0, 3).map((lot) => {
            const reqOffers = allOffers.filter(o => o.lotId === lot.id);
            const qty = lot.quantity || lot.totalWeightKg || 1;
            const unit = lot.unit || 'kg';

            return (
              <div
                key={lot.id}
                className="p-5 bg-white rounded-3xl border border-[#3F7655]/20 shadow-sm hover:shadow-md hover:border-[#3F7655]/40 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-2.5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-[#3F7655] bg-[#DDEBD8] px-2 py-0.5 rounded-full">
                        {tCategory(lot.category)}
                      </span>
                      <h4 className="text-sm font-black text-[#203128] mt-1">{lot.material}</h4>
                      <span className="text-[11px] font-mono text-[#718078] font-bold">{lot.id}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={lot.status} size="sm" />
                      {lot.syncStatus === 'pending' ? (
                        <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                          🟠 Pending sync
                        </span>
                      ) : lot.syncStatus === 'failed' ? (
                        <span className="text-[10px] font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                          ❌ Sync failed
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Synced
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-[#718078]">
                    <div>
                      <span className="text-[10px] block uppercase font-bold">{t('quantityLabel')}</span>
                      <strong className="text-[#203128]">{qty} {unit}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] block uppercase font-bold">{t('statusOFFER_RECEIVED')}</span>
                      <strong className={reqOffers.length > 0 ? "text-emerald-700" : "text-amber-700"}>
                        {reqOffers.length > 0 ? `${reqOffers.length} Received` : t('statusAWAITING_OFFERS')}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#3F7655]/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#3F7655]">
                    {t('benchmarkPriceLabel')}: ₹{lot.benchmarkPrice || 350}/{unit}
                  </span>
                  <button
                    onClick={() => navigate(`/collector/requests/${lot.id}`)}
                    className="px-3 py-1.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('viewDetails')}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
