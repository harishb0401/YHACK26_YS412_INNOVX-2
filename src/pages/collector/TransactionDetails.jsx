import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, CheckCircle2, Download, ShieldCheck, FileText, Calendar, Building, MapPin } from 'lucide-react';
import { mockTransactions } from '../../data/mockData';
import { useTranslation } from '../../i18n';

export default function TransactionDetails({ transactions = mockTransactions }) {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const allTx = transactions || mockTransactions;
  const tx = allTx.find(t => t.id === transactionId) || allTx[0];

  if (!tx) {
    return (
      <div className="bg-white p-12 rounded-[32px] border border-[#3F7655]/20 text-center space-y-4 shadow-sm">
        <h2 className="text-xl font-black text-[#203128]">{t('transactionsTitle')}</h2>
        <Link to="/collector/transactions" className="text-xs font-bold text-[#3F7655] underline">
          {t('backToDashboard')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/collector/transactions')}
          className="px-4 py-2 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 rounded-xl hover:bg-[#DDEBD8]/50 transition flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#3F7655]" />
          <span>{t('backToDashboard')}</span>
        </button>

        <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {t('payStatusPAID')}
        </span>
      </div>

      {/* Invoice Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-lg space-y-8">
        {/* Header */}
        <div className="border-b border-[#3F7655]/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-3 py-1 rounded-full">
              {t('digitalReceipt')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#203128] mt-2">{tx.id}</h1>
            <p className="text-xs text-[#718078]">{t('collectionDate')}: {tx.date || tx.paymentDate || '2026-03-01'}</p>
          </div>

          <button
            onClick={() => alert(`Downloading Invoice PDF for ${tx.id}...`)}
            className="px-4 py-2.5 bg-[#F8F5EA] hover:bg-[#DDEBD8] text-[#244936] border border-[#3F7655]/20 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>{t('digitalReceipt')} PDF</span>
          </button>
        </div>

        {/* Parties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-2">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase block">{t('collectorLabel')}</span>
            <h4 className="text-sm font-black text-[#203128]">{tx.collectorName || 'Ramesh Kumar'}</h4>
            <p className="text-[#718078]">{t('storageLocationHub')}: Chennai Hub</p>
          </div>

          <div className="p-4 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/10 space-y-2">
            <span className="text-[10px] font-extrabold text-[#718078] uppercase block">{t('recyclerLabel')}</span>
            <h4 className="text-sm font-black text-[#203128]">{tx.recyclerName || 'GreenCycle Material Recovery Ltd'}</h4>
            <p className="text-[#718078]">CPCB License: TN-EPR-2026-8821</p>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="border border-[#3F7655]/15 rounded-2xl overflow-hidden text-xs">
          <div className="bg-[#FAF8F2] p-3 font-black text-[#203128] grid grid-cols-12 border-b border-[#3F7655]/10">
            <span className="col-span-6">{t('materialDescription')}</span>
            <span className="col-span-2 text-right">{t('quantityLabel')}</span>
            <span className="col-span-2 text-right">{t('benchmarkPriceLabel')}</span>
            <span className="col-span-2 text-right">{t('totalValue')}</span>
          </div>

          <div className="p-4 grid grid-cols-12 text-[#203128] font-semibold items-center">
            <div className="col-span-6">
              <span className="font-extrabold block">{tx.material || 'Motherboards & PCB Assemblies'}</span>
              <span className="text-[10px] text-[#718078]">Lot Reference: {tx.lotId}</span>
            </div>
            <span className="col-span-2 text-right">{tx.weightKg || 120} kg</span>
            <span className="col-span-2 text-right">₹{tx.ratePerKg || 380} / kg</span>
            <span className="col-span-2 text-right font-black text-[#3F7655]">₹{(tx.totalValue || 45600).toLocaleString()}</span>
          </div>

          <div className="bg-[#FAF8F2] p-4 border-t border-[#3F7655]/10 flex justify-between items-center font-black text-sm">
            <span className="text-[#203128]">{t('totalValue')}</span>
            <span className="text-xl text-[#244936]">₹{(tx.totalValue || 45600).toLocaleString()}</span>
          </div>
        </div>

        {/* CPCB Compliance Badge */}
        <div className="p-4 bg-[#DDEBD8]/50 rounded-2xl border border-[#3F7655]/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3F7655]" />
            <span className="font-bold text-[#244936]">{t('cpcbVerified')}</span>
          </div>
          <span className="font-mono text-[10px] text-[#718078]">CERT-EPR-2026-9921</span>
        </div>
      </div>
    </div>
  );
}
