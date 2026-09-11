import React, { useState } from 'react';
import { Bell, CheckCircle2, ShieldCheck, AlertCircle, DollarSign, Package, Clock } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import { useTranslation } from '../../i18n';

export default function CollectorNotifications({ notifications = mockNotifications }) {
  const { t } = useTranslation();
  const [list, setList] = useState(notifications || mockNotifications);

  const markAllRead = () => {
    setList(list.map(n => ({ ...n, unread: false })));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS':
      case 'PAYMENT':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'WARNING':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'MATCH':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Package className="w-4 h-4 text-[#3F7655]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">{t('navNotifications')}</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            {t('collectorNotifSubtitle')}
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-white hover:bg-[#DDEBD8] text-[#244936] border border-[#3F7655]/20 rounded-xl font-bold text-xs transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          {t('unreadNotifications')}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {list.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-[24px] border transition flex items-start gap-4 ${
              item.unread
                ? 'bg-white border-[#3F7655]/30 shadow-sm'
                : 'bg-[#FAF8F2] border-[#3F7655]/10 opacity-80'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-[#DDEBD8] shrink-0 mt-0.5">
              {getIcon(item.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black text-[#203128]">{t(item.title)}</h3>
                <span className="text-[11px] text-[#718078] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time || item.timestamp || 'Just now'}
                </span>
              </div>
              <p className="text-xs text-[#718078] leading-relaxed">{t(item.message || item.desc)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
