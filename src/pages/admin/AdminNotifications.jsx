import React, { useState } from 'react';
import { Bell, ShieldCheck, AlertTriangle, Building, Clock, Users } from 'lucide-react';

export default function AdminNotifications() {
  const [list, setList] = useState([
    {
      id: 'NOTIF-ADM-1',
      title: 'New Recycler Facility Pending Verification',
      message: 'GreenMat Eco-Processing Center submitted CPCB documentation for approval.',
      type: 'VERIFICATION',
      time: '10 mins ago',
      unread: true
    },
    {
      id: 'NOTIF-ADM-2',
      title: 'Pricing Rule Flagged Below-Tolerance Offer',
      message: 'Bid on Lot EW-2026-001247 was submitted at -21.4% below state benchmark.',
      type: 'FLAG',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 'NOTIF-ADM-3',
      title: 'Monthly EPR Quota Report Ready',
      message: 'Tamil Nadu aggregated e-waste compliance volume crossed 44,000 kg.',
      type: 'COMPLIANCE',
      time: 'Today, 8:00 AM',
      unread: false
    }
  ]);

  const markAllRead = () => {
    setList(list.map(n => ({ ...n, unread: false })));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Admin Notifications</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            State-wide compliance alerts, facility verifications, and regulatory notifications.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-white hover:bg-[#DDEBD8] text-[#244936] border border-[#3F7655]/20 rounded-xl font-bold text-xs transition cursor-pointer self-start sm:self-auto shadow-sm"
        >
          Mark all as read
        </button>
      </div>

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
            <div className="p-2.5 rounded-xl bg-[#DDEBD8] shrink-0 mt-0.5 text-[#3F7655]">
              {item.type === 'FLAG' ? <AlertTriangle className="w-4 h-4 text-amber-600" /> : <ShieldCheck className="w-4 h-4" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black text-[#203128]">{item.title}</h3>
                <span className="text-[11px] text-[#718078] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </span>
              </div>
              <p className="text-xs text-[#718078] leading-relaxed">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
