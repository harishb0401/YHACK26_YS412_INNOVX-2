import React from 'react';
import { Leaf, Award, TrendingUp, RefreshCw, Sparkles, CheckCircle2, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { userDashboardData } from '../mockData';
import { useTranslation, useLanguage } from '../i18n';

export default function UserDashboardView({ setActiveView, userStats = userDashboardData }) {
  const { t } = useTranslation();
  const { tCategory } = useLanguage();

  const pieData = [
    { name: 'Paper', value: 45, color: '#F2C94C' },
    { name: 'Plastic', value: 30, color: '#3F7655' },
    { name: 'Glass', value: 15, color: '#244936' },
    { name: 'Electronics', value: 10, color: '#8B6B4A' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Greeting Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#3F7655]/15 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#203128] tracking-tight">
              {t("goodMorningUser", { name: userStats.userName })}
            </h1>
            <p className="text-sm text-[#718078] mt-1">
              {t("personalImpactSummary")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('pickup')}
              className="px-5 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-bold text-xs rounded-2xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{t("scheduleNewPickup")}</span>
            </button>
          </div>
        </div>

        {/* 3 Main Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Recycled */}
          <div className="bg-white p-6 rounded-[24px] border border-[#3F7655]/15 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-[#718078]">
              <span className="text-xs font-bold uppercase tracking-wider">{t("recycledKgTotal")}</span>
              <span className="text-xl">♻</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-[#203128]">{userStats.totalRecycledKg} kg</h3>
            <p className="text-xs text-[#3F7655] font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#3F7655]" /> {t("recycledVsLastMonth")}
            </p>
          </div>

          {/* Card 2: CO2 Saved */}
          <div className="bg-white p-6 rounded-[24px] border border-[#3F7655]/15 shadow-sm space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-[#718078]">
              <span className="text-xs font-bold uppercase tracking-wider">{t("co2Offset")}</span>
              <span className="text-xl">🌱</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-[#203128]">{userStats.co2SavedKg} kg</h3>
            <p className="text-xs text-[#3F7655] font-semibold flex items-center gap-1">
              {t("matureTreesEquiv")}
            </p>
          </div>

          {/* Card 3: Points */}
          <div className="bg-[#244936] text-white p-6 rounded-[24px] border border-[#3F7655]/30 shadow-md space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-[#F2C94C]">
              <span className="text-xs font-bold uppercase tracking-wider">{t("rewardPoints")}</span>
              <span className="text-xl">✨</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white">{userStats.earnedPoints.toLocaleString()}</h3>
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-[#DDEBD8]">{t("ptsToNextReward", { pts: userStats.targetPoints - userStats.earnedPoints })}</span>
              <button 
                onClick={() => setActiveView('rewards')}
                className="text-xs font-bold text-[#F2C94C] underline hover:text-yellow-300 cursor-pointer"
              >
                {t("redeemLink")}
              </button>
            </div>
          </div>

        </div>

        {/* 2-Column: Activity Distribution Chart vs Progress Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Recycling Activity Distribution */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[28px] border border-[#3F7655]/15 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#3F7655]/10 pb-3">
              <h3 className="text-base font-extrabold text-[#203128]">{t("recyclingMaterialActivity")}</h3>
              <span className="text-xs font-semibold text-[#718078]">{t("thisMonth")}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
              <div className="w-44 h-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4}>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                {pieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#F8F5EA]">
                    <div className="flex items-center gap-2 font-bold text-[#203128]">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{tCategory(item.name)}</span>
                    </div>
                    <span className="font-mono text-[#718078] font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Progress & Tier Status */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[28px] border border-[#3F7655]/15 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-extrabold text-[#203128]">{t("yourProgressTier")}</h3>
                <span className="text-xs font-bold text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                  {t("tierLevel2")}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F5EA] border border-[#3F7655]/10 space-y-3 my-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3F7655] text-white font-bold flex items-center justify-center text-lg">
                    🌱
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#203128]">{userStats.tier}</h4>
                    <p className="text-xs text-[#718078]">{t("ecoHeroProgress")}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-[#E6DCC4] h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#3F7655] h-full rounded-full transition-all duration-500"
                      style={{ width: `${userStats.tierProgressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-[#718078]">
                    <span>1,240 pts</span>
                    <span>1,500 pts (Eco Hero)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView('rewards')}
              className="w-full py-3 bg-[#DDEBD8] hover:bg-[#3F7655] hover:text-white text-[#244936] font-bold text-xs rounded-2xl transition text-center cursor-pointer"
            >
              {t("viewAvailableRewards")}
            </button>
          </div>

        </div>

        {/* Recent Recycling Activity List */}
        <div className="bg-white rounded-[28px] border border-[#3F7655]/15 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-[#3F7655]/10 pb-3">
            <h3 className="text-lg font-extrabold text-[#203128]">{t("recentRecyclingActivity")}</h3>
            <span className="text-xs text-[#718078] font-semibold">{t("transactionsCount", { count: 4 })}</span>
          </div>

          <div className="space-y-3">
            {userStats.recentActivity.map((act) => (
              <div 
                key={act.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F5EA] border border-[#3F7655]/10 hover:border-[#3F7655]/30 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{act.icon}</span>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#203128]">{tCategory(act.category)}</h4>
                    <span className="text-xs text-[#718078]">{act.date} • {act.weightKg} kg processed</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-[#3F7655] bg-[#DDEBD8] px-3 py-1 rounded-full">
                    +{act.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

