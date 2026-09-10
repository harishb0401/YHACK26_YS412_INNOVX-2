import React from 'react';
import { Leaf, TrendingUp, Layers, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { monthlyRecyclingData } from '../mockData';
import { useTranslation } from '../i18n';

export default function EnvironmentalImpactSection({ stats }) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t("wasteDivertedLandfill"),
      value: stats?.landfillDiverted || "12.45 Tons",
      subtitle: t("landfillDiverted"),
      icon: Leaf,
      color: "text-emerald-600 bg-emerald-100"
    },
    {
      title: t("materialsRecoveredRate"),
      value: stats?.materialRecoveryRate || "92.6%",
      subtitle: t("recoveredMetalsSub"),
      icon: Layers,
      color: "text-teal-600 bg-teal-100"
    },
    {
      title: t("co2Offset"),
      value: `${stats?.co2SavedTonnes || "28.4"} Tonnes`,
      subtitle: t("matureTreesEquiv"),
      icon: TrendingUp,
      color: "text-cyan-600 bg-cyan-100"
    },
    {
      title: t("completionRate"),
      value: stats?.successfulProcessingRate || "96.0%",
      subtitle: t("statusRecycledCertified"),
      icon: CheckCircle2,
      color: "text-emerald-700 bg-emerald-100"
    }
  ];

  return (
    <section id="impact" className="py-20 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-3 border border-emerald-200">
            <Leaf className="w-3.5 h-3.5" /> {t("environmentalSavingsLedger")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("quantifiedEcologicalImpact")}
          </h2>
          <p className="text-base text-slate-600 mt-3">
            {t("quantifiedEcologicalDesc")}
          </p>
        </div>

        {/* 4 Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-2xl ${card.color} flex items-center justify-center`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {t("immutableLog")}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{card.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Monthly Recycling Trend Chart Container */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                {t("monthlyGrowthTitle")}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t("monthlyGrowthDesc")}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" /> Collected (kg)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-teal-400" /> Recycled (kg)
              </span>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRecyclingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="collected" fill="#10b981" radius={[6, 6, 0, 0]} name={t("recycledKgTotal")} />
                <Bar dataKey="recycled" fill="#2dd4bf" radius={[6, 6, 0, 0]} name={t("statusRecycled")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </section>
  );
}
