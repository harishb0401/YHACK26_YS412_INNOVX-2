import React, { useState } from 'react';
import { Award, CheckCircle2, Sparkles, ArrowRight, Gift, Lock } from 'lucide-react';
import { rewardsList, userDashboardData } from '../mockData';

export default function RewardsView({ setActiveView, currentPoints = 1240 }) {
  const [redeemedIds, setRedeemedIds] = useState([]);

  const handleRedeem = (reward) => {
    if (currentPoints >= reward.pointsRequired) {
      setRedeemedIds([...redeemedIds, reward.id]);
      alert(`🎉 Congratulations! You have successfully redeemed "${reward.title}" for ${reward.pointsRequired} points. Confirmation code sent to your email!`);
    } else {
      alert(`You need ${reward.pointsRequired - currentPoints} more points to redeem "${reward.title}". Keep recycling!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Points Banner */}
        <div className="bg-[#244936] text-white p-8 sm:p-10 rounded-[32px] shadow-xl border border-[#3F7655]/40 text-center space-y-6 relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-[#F2C94C] text-[#244936] flex items-center justify-center text-3xl mx-auto font-black shadow-lg">
            🌱
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F2C94C]">YOUR REWARDS BALANCE</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              {currentPoints.toLocaleString()} <span className="text-2xl text-[#F2C94C]">POINTS</span>
            </h1>
          </div>

          {/* Progress Bar Container */}
          <div className="max-w-md mx-auto space-y-2 text-left">
            <div className="flex justify-between text-xs font-bold text-[#DDEBD8]">
              <span>Current: {currentPoints} pts</span>
              <span>Target: 1,500 pts</span>
            </div>

            <div className="w-full bg-[#14291E] h-4 rounded-full p-0.5 border border-[#3F7655]">
              <div 
                className="bg-[#F2C94C] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentPoints / 1500) * 100)}%` }}
              />
            </div>

            <p className="text-xs text-center text-[#DDEBD8] font-medium pt-1">
              Next unlockable reward: <span className="font-extrabold text-[#F2C94C]">Free Stainless Reusable Bottle</span> (260 pts left)
            </p>
          </div>

        </div>

        {/* Rewards Marketplace Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#203128] flex items-center gap-2">
                <Gift className="w-6 h-6 text-[#3F7655]" />
                Redeem Eco Rewards
              </h2>
              <p className="text-xs text-[#718078]">
                Exchange points earned from doorstep pickups and recycling drop-offs for sustainable goods.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardsList.map((reward) => {
              const isAlreadyRedeemed = redeemedIds.includes(reward.id);
              const canAfford = currentPoints >= reward.pointsRequired;

              return (
                <div 
                  key={reward.id}
                  className="bg-white rounded-[24px] border border-[#3F7655]/15 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-[#F8F5EA] text-3xl flex items-center justify-center mb-3 shadow-inner border border-[#3F7655]/10">
                      {reward.icon}
                    </div>

                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3F7655] bg-[#DDEBD8] px-2 py-0.5 rounded">
                      {reward.category}
                    </span>

                    <h3 className="text-base font-extrabold text-[#203128] mt-2 mb-1 leading-snug">
                      {reward.title}
                    </h3>

                    <p className="text-xs text-[#718078] leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#3F7655]/10 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#718078]">Required:</span>
                      <span className="font-extrabold text-[#3F7655] text-sm">{reward.pointsRequired} pts</span>
                    </div>

                    {isAlreadyRedeemed ? (
                      <div className="w-full py-2.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Redeemed ✓
                      </div>
                    ) : canAfford ? (
                      <button
                        onClick={() => handleRedeem(reward)}
                        className="w-full py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Redeem Reward
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRedeem(reward)}
                        className="w-full py-2.5 bg-[#F8F5EA] text-[#718078] border border-[#3F7655]/15 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Lock className="w-3.5 h-3.5" /> Need {reward.pointsRequired - currentPoints} pts
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
