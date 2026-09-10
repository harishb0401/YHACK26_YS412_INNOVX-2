import React from 'react';
import { Weight, RefreshCw, UserCheck, ShieldCheck, ArrowUpRight, Leaf } from 'lucide-react';

export default function ImpactStatsSection({ stats }) {
  const cards = [
    {
      title: "E-Waste Collected",
      value: stats.totalCollected || "12,450 kg",
      subtitle: "+18% from last month",
      icon: Weight,
      color: "from-emerald-500 to-teal-600",
      bgTint: "bg-emerald-50/60 border-emerald-100",
      iconBg: "bg-emerald-100 text-emerald-700"
    },
    {
      title: "E-Waste Recycled",
      value: stats.totalRecycled || "10,820 kg",
      subtitle: "Verified closed-loop processing",
      icon: RefreshCw,
      color: "from-teal-500 to-cyan-600",
      bgTint: "bg-teal-50/60 border-teal-100",
      iconBg: "bg-teal-100 text-teal-700"
    },
    {
      title: "Verified Collectors",
      value: `${stats.verifiedCollectors || 128} Collectors`,
      subtitle: "Active regional pickup hubs",
      icon: UserCheck,
      color: "from-cyan-500 to-blue-600",
      bgTint: "bg-cyan-50/60 border-cyan-100",
      iconBg: "bg-cyan-100 text-cyan-700"
    },
    {
      title: "Verified Recyclers",
      value: `${stats.verifiedRecyclers || 42} Recyclers`,
      subtitle: "Licensed R2v3 & EPA facilities",
      icon: ShieldCheck,
      color: "from-emerald-600 to-emerald-800",
      bgTint: "bg-emerald-50/60 border-emerald-100",
      iconBg: "bg-emerald-100 text-emerald-800"
    }
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Platform Milestones
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Measurable Ecosystem Impact
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time aggregate totals recorded across verified collector nodes and recycler facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <div 
                key={idx}
                className={`p-6 rounded-2xl border ${card.bgTint} hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-600">{card.title}</span>
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                    {card.value}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {card.subtitle}
                  </p>
                </div>

                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/0 to-emerald-200/20 rounded-full blur-xl pointer-events-none" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
