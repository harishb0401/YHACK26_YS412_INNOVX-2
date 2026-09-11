import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useOfflineSession } from '../../hooks/useOfflineSession';
import { AUTH_STATES } from '../../services/offline/offlineSession';
import { WifiOff, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

export default function CollectorLayout({ currentUser, onLogout, onOpenSearchModal }) {
  const navigate = useNavigate();
  const { authState, isOfflineAuthenticated, isOnline: online, offlineUser, isChecking } = useOfflineSession(currentUser);

  // 1. If actively verifying session, show clean subtle loader
  if (isChecking && !currentUser) {
    return (
      <div className="min-h-screen bg-[#F8F5EA] flex items-center justify-center text-[#203128]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#3F7655] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#718078]">Verifying offline collector session...</p>
        </div>
      </div>
    );
  }

  // Determine active user (online user or authenticated offline session)
  const effectiveUser = currentUser || (isOfflineAuthenticated ? offlineUser : null);

  // 2. Offline & Never Authenticated on this device -> Exact required message
  if (!online && (!effectiveUser || authState === AUTH_STATES.NOT_AUTHENTICATED)) {
    return (
      <div className="min-h-screen bg-[#F8F5EA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-[32px] border border-[#3F7655]/20 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
            <WifiOff className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#203128]">Internet Connection Required</h2>
            <p className="text-xs text-[#718078] mt-2 font-medium leading-relaxed">
              Internet connection is required for your first login.
            </p>
            <p className="text-[11px] text-[#718078] mt-1">
              Once you log in online at least once, you can access your collector workspace offline anytime.
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#3F7655] hover:bg-[#244936] text-white rounded-2xl font-black text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Connection</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-[#203128] rounded-2xl font-bold text-xs transition border border-slate-200 cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Offline & Expired Offline Session (exceeded 7 days without reconnect)
  if (!online && authState === AUTH_STATES.SESSION_EXPIRED) {
    return (
      <div className="min-h-screen bg-[#F8F5EA] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-[32px] border border-[#3F7655]/20 shadow-xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#203128]">Offline Session Expired</h2>
            <p className="text-xs text-[#718078] mt-2 font-medium leading-relaxed">
              Your offline collector session has expired after 7 days. For security, please connect to the internet to verify your credentials.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#3F7655] hover:bg-[#244936] text-white rounded-2xl font-black text-xs shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Online Authentication</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. Online & Unauthenticated -> Redirect to /login
  if (!effectiveUser) {
    return <Navigate to="/login" replace />;
  }

  // 5. Role check -> Collector or Admin only
  if (effectiveUser.role !== 'collector' && effectiveUser.role !== 'admin') {
    if (effectiveUser.role === 'recycler') {
      return <Navigate to="/recycler/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EA] text-[#203128] antialiased font-sans">
      <Navbar 
        isLoggedIn={true} 
        currentRole="collector" 
        userProfile={effectiveUser}
        onLogout={onLogout}
        onOpenSearchModal={onOpenSearchModal}
      />

      {/* Subtle Offline Notice Banner for Collectors */}
      {!online && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-xs font-bold text-amber-950 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          <span>Offline Mode Active — You can declare e-waste and review cached records. Changes will sync automatically upon reconnection.</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
