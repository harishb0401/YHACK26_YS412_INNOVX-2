import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, badge, color = "emerald" }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#3F7655]/20 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black text-[#718078] uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-black text-[#203128]">{value}</span>
        {badge && (
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#DDEBD8] text-[#244936]">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[11px] font-semibold text-[#718078] mt-1">{subtitle}</p>
      )}
    </div>
  );
}
