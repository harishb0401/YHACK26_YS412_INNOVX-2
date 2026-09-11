import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function TransactionCard({ tx, detailUrl }) {
  const { t } = useTranslation();
  if (!tx) return null;

  const url = detailUrl || `/collector/transactions/${tx.id}`;

  return (
    <div className="bg-white p-5 rounded-3xl border border-[#3F7655]/20 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
              {t('eprCompliant')}
            </span>
            <h3 className="text-base font-black text-[#203128] mt-1.5 font-mono">{tx.id}</h3>
            <p className="text-xs text-[#718078]">{t('lotLabel')}: <strong className="text-[#203128]">{tx.lotId}</strong></p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t('payStatusPAID')}
          </span>
        </div>

        <div className="space-y-2 mt-4 text-xs font-semibold text-[#718078]">
          <div className="flex justify-between">
            <span>{t('collectorLabel')}:</span>
            <strong className="text-[#203128]">{tx.collectorName}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('recyclerLabel')}:</span>
            <strong className="text-[#203128]">{tx.recyclerName}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t('quantityLabel')}:</span>
            <strong className="text-[#203128]">{tx.quantity} {tx.unit || 'kg'}</strong>
          </div>
          <div className="flex justify-between p-2 bg-[#FAF8F2] rounded-xl font-bold">
            <span className="text-[#203128]">{t('totalValue')}:</span>
            <span className="text-[#3F7655] font-black text-sm">₹{tx.totalValue?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-[#3F7655]/10">
        <Link
          to={url}
          className="w-full py-2.5 text-center text-xs font-bold text-[#244936] bg-[#DDEBD8]/50 hover:bg-[#DDEBD8] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t('digitalReceipt')}</span>
        </Link>
      </div>
    </div>
  );
}
