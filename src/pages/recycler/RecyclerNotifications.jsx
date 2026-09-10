import React, { useState } from 'react';
import { Bell, ShoppingBag, ShieldCheck, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

export default function RecyclerNotifications() {
  const [list, setList] = useState([
    {
      id: 'NOTIF-REC-1',
      title: 'New Waste Lot Available in Chennai',
      message: '120 kg of Motherboards & PCB Assemblies registered in Guindy by Apex Scrap.',
      type: 'STREAM',
      time: '15 mins ago',
      unread: true
    },
    {
      id: 'NOTIF-REC-2',
      title: 'Price Offer Accepted by Collector',
      message: 'Your bid of ₹380/kg on Lot EW-2026-001245 has been accepted. Escrow ₹45,600 locked.',
      type: 'MATCH',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 'NOTIF-REC-3',
      title: 'Form-2 Manifest Ready for Download',
      message: 'Automated CPCB Form-2 manifest compiled for dispatch batch #DSP-401.',
      type: 'COMPLIANCE',
      time: 'Yesterday',
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
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">Recycler Notifications</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Alerts on incoming material lots, bid acceptances, and CPCB compliance milestones.
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
              {item.type === 'MATCH' ? <ShieldCheck className="w-4 h-4" /> : item.type === 'COMPLIANCE' ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
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
