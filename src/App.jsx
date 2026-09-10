import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CanIRecycleModal from './components/Modals/CanIRecycleModal';

import LandingView from './views/LandingView';
import RecyclingGuideView from './views/RecyclingGuideView';
import FindLocationView from './views/FindLocationView';
import SchedulePickupView from './views/SchedulePickupView';
import UserDashboardView from './views/UserDashboardView';
import RewardsView from './views/RewardsView';

import { userDashboardData } from './mockData';

export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [userStats, setUserStats] = useState(userDashboardData);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Callback when user schedules a new doorstep pickup
  const handlePickupScheduled = (pickupInfo) => {
    setUserStats(prev => {
      const newTotalKg = prev.totalRecycledKg + pickupInfo.weightKg;
      const newPoints = prev.earnedPoints + pickupInfo.points;
      const newCo2 = +(prev.co2SavedKg + pickupInfo.weightKg * 0.33).toFixed(1);

      const newAct = {
        id: `act-${Date.now()}`,
        category: pickupInfo.materials[0] || 'Mixed',
        weightKg: pickupInfo.weightKg,
        points: pickupInfo.points,
        date: 'Just now',
        icon: '📦'
      };

      return {
        ...prev,
        totalRecycledKg: newTotalKg,
        co2SavedKg: newCo2,
        earnedPoints: newPoints,
        recentActivity: [newAct, ...prev.recentActivity]
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EA] text-[#203128] antialiased font-sans">
      
      {/* Global Navigation Header */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* Dynamic View Body */}
      <div className="flex-1">
        {activeView === 'landing' && (
          <LandingView 
            setActiveView={setActiveView}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
          />
        )}

        {activeView === 'guide' && (
          <RecyclingGuideView 
            setActiveView={setActiveView}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
          />
        )}

        {activeView === 'locations' && (
          <FindLocationView 
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'pickup' && (
          <SchedulePickupView 
            setActiveView={setActiveView}
            onPickupScheduled={handlePickupScheduled}
          />
        )}

        {activeView === 'dashboard' && (
          <UserDashboardView 
            setActiveView={setActiveView}
            userStats={userStats}
          />
        )}

        {activeView === 'rewards' && (
          <RewardsView 
            setActiveView={setActiveView}
            currentPoints={userStats.earnedPoints}
          />
        )}
      </div>

      {/* Global Footer */}
      <Footer setActiveView={setActiveView} />

      {/* Interactive "Can I Recycle This?" Search Modal */}
      <CanIRecycleModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        setActiveView={setActiveView}
      />

    </div>
  );
}
