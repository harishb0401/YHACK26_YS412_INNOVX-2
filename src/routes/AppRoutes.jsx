import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../components/Layout/PublicLayout';
import CollectorLayout from '../components/Layout/CollectorLayout';
import RecyclerLayout from '../components/Layout/RecyclerLayout';
import AdminLayout from '../components/Layout/AdminLayout';

// Public Pages
import Home from '../pages/public/Home';
import HowItWorks from '../pages/public/HowItWorks';
import RecycleGuide from '../pages/public/RecycleGuide';
import Locations from '../pages/public/Locations';
import About from '../pages/public/About';
import Login from '../pages/public/Login';

// Collector Pages
import CollectorDashboard from '../pages/collector/CollectorDashboard';
import RegisterWaste from '../pages/collector/RegisterWaste';
import MyWasteLots from '../pages/collector/MyWasteLots';
import WasteLotDetails from '../pages/collector/WasteLotDetails';
import RecyclerMatches from '../pages/collector/RecyclerMatches';
import RecyclerMatchDetails from '../pages/collector/RecyclerMatchDetails';
import Transactions from '../pages/collector/Transactions';
import TransactionDetails from '../pages/collector/TransactionDetails';
import CollectorProfile from '../pages/collector/CollectorProfile';
import CollectorNotifications from '../pages/collector/CollectorNotifications';

// Recycler Pages
import RecyclerDashboard from '../pages/recycler/RecyclerDashboard';
import WasteRequests from '../pages/recycler/WasteRequests';
import MyMatches from '../pages/recycler/MyMatches';
import RecyclerTransactions from '../pages/recycler/RecyclerTransactions';
import Compliance from '../pages/recycler/Compliance';
import RecyclerProfile from '../pages/recycler/RecyclerProfile';
import RecyclerNotifications from '../pages/recycler/RecyclerNotifications';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Collectors from '../pages/admin/Collectors';
import Recyclers from '../pages/admin/Recyclers';
import AdminWasteLots from '../pages/admin/AdminWasteLots';
import AdminTransactions from '../pages/admin/AdminTransactions';
import Verification from '../pages/admin/Verification';
import AdminProfile from '../pages/admin/AdminProfile';
import AdminNotifications from '../pages/admin/AdminNotifications';

// 404 Fallback Page
import NotFound from '../pages/NotFound';

export default function AppRoutes({
  currentUser,
  onLoginSuccess,
  onLogout,
  materialLots,
  onLotCreated,
  transactions,
  collectors,
  recyclers
}) {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES */}
      <Route element={<PublicLayout currentUser={currentUser} onLogout={onLogout} />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/recycle-guide" element={<RecycleGuide />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login initialTab="login" onLoginSuccess={onLoginSuccess} />} />
        <Route path="/signup" element={<Login initialTab="signup" onLoginSuccess={onLoginSuccess} />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* 2. COLLECTOR ROUTES */}
      <Route path="/collector" element={<CollectorLayout currentUser={currentUser} onLogout={onLogout} />}>
        <Route path="dashboard" element={<CollectorDashboard materialLots={materialLots} transactions={transactions} />} />
        <Route path="register-waste" element={<RegisterWaste onLotCreated={onLotCreated} />} />
        <Route path="waste-lots" element={<MyWasteLots materialLots={materialLots} />} />
        <Route path="waste-lots/:lotId" element={<WasteLotDetails materialLots={materialLots} />} />
        <Route path="recycler-matches" element={<RecyclerMatches />} />
        <Route path="recycler-matches/:matchId" element={<RecyclerMatchDetails />} />
        <Route path="transactions" element={<Transactions transactions={transactions} />} />
        <Route path="transactions/:transactionId" element={<TransactionDetails transactions={transactions} />} />
        <Route path="profile" element={<CollectorProfile />} />
        <Route path="notifications" element={<CollectorNotifications />} />
      </Route>

      {/* 3. RECYCLER ROUTES */}
      <Route path="/recycler" element={<RecyclerLayout currentUser={currentUser} onLogout={onLogout} />}>
        <Route path="dashboard" element={<RecyclerDashboard materialLots={materialLots} />} />
        <Route path="waste-requests" element={<WasteRequests materialLots={materialLots} />} />
        <Route path="matches" element={<MyMatches materialLots={materialLots} />} />
        <Route path="transactions" element={<RecyclerTransactions transactions={transactions} />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="profile" element={<RecyclerProfile />} />
        <Route path="notifications" element={<RecyclerNotifications />} />
      </Route>

      {/* 4. ADMIN ROUTES */}
      <Route path="/admin" element={<AdminLayout currentUser={currentUser} onLogout={onLogout} />}>
        <Route path="dashboard" element={<AdminDashboard collectors={collectors} recyclers={recyclers} materialLots={materialLots} transactions={transactions} />} />
        <Route path="collectors" element={<Collectors collectors={collectors} />} />
        <Route path="recyclers" element={<Recyclers recyclers={recyclers} />} />
        <Route path="waste-lots" element={<AdminWasteLots materialLots={materialLots} />} />
        <Route path="transactions" element={<AdminTransactions transactions={transactions} />} />
        <Route path="verification" element={<Verification recyclers={recyclers} />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
    </Routes>
  );
}
