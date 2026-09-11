import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Package, ShoppingBag, DollarSign, Scale, RefreshCw, ArrowRight, CheckCircle2, Clock, Award } from 'lucide-react';
import StatCard from '../../components/Cards/StatCard';
import WasteLotCard from '../../components/Cards/WasteLotCard';
import { mockWasteLots, mockRecycler, mockTransactions } from '../../data/mockData';
import { useTranslation } from '../../i18n';

export default function RecyclerDashboard({ recyclerProfile = mockRecycler, materialLots = mockWasteLots }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const availableLots = (materialLots || mockWasteLots).filter(l => ['REGISTERED', 'MATCHED', 'AWAITING_OFFERS', 'AVAILABLE'].includes(l.status));
  const activeProcessing = (materialLots || mockWasteLots).filter(l => ['ACCEPTED', 'DISPATCHED', 'OFFER_ACCEPTED'].includes(l.status));
  const recycledLots = (materialLots || mockWasteLots).filter(l => l.status === 'COMPLETED');

  const totalProcuredKg = (materialLots || mockWasteLots)
    .filter(l => ['ACCEPTED', 'DISPATCHED', 'COMPLETED', 'OFFER_ACCEPTED'].includes(l.status))
    .reduce((sum, l) => sum + (parseFloat(l.quantity || l.totalWeightKg) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Recycler Welcome Banner */}
      <div className="bg-[#1B3828] text-white p-6 sm:p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#F2C94C] bg-white/10 px-3 py-0.5 rounded-full">
              {t('recyclerPortal')}
            </span>
            <span className="text-xs font-black text-[#244936] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F7655]" />
              {t('recStatusVERIFIED')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            {recyclerProfile?.companyName || "GreenCycle Material Recovery Ltd"}
          </h1>
          <p className="text-xs sm:text-sm text-[#DDEBD8] mt-1">
            {t('availableRequestsDesc')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/recycler/waste-requests')}
            className="px-6 py-3.5 bg-[#F2C94C] hover:bg-[#e0b83b] text-[#244936] rounded-2xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('availableCollectorRequests')}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-bold mb-3">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">{t('navWasteRequests')}</h3>
            <p className="text-xs text-[#718078] mt-1">
              {t('availableRequestsDesc')}
            </p>
          </div>
          <Link
            to="/recycler/waste-requests"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>{t('availableCollectorRequests')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">{t('transactionsTitle')}</h3>
            <p className="text-xs text-[#718078] mt-1">
              {t('transactionsSubtitle')}
            </p>
          </div>
          <Link
            to="/recycler/transactions"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>{t('navTransactions')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-[#203128]">{t('navCompliance')}</h3>
            <p className="text-xs text-[#718078] mt-1">
              {t('cpcbVerifLayerSub')}
            </p>
          </div>
          <Link
            to="/recycler/compliance"
            className="text-xs font-black text-[#3F7655] hover:text-[#244936] flex items-center gap-1.5 pt-3 border-t border-[#3F7655]/10"
          >
            <span>{t('navCompliance')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Available Lots Ready For Procurement */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#203128]">{t('availableCollectorRequests')}</h2>
            <p className="text-xs text-[#718078]">{t('requestsAvailableBidding')}</p>
          </div>
          <Link
            to="/recycler/waste-requests"
            className="text-xs font-black text-[#3F7655] hover:underline flex items-center gap-1"
          >
            <span>{t('viewDetails')} ({availableLots.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableLots.slice(0, 3).map((lot) => (
            <WasteLotCard
              key={lot.id}
              lot={lot}
              onViewDetails={() => navigate('/recycler/waste-requests')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
