import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, Menu, X, ArrowRight, User, Bell, 
  CheckCircle2, LogOut, Settings, ShieldCheck, 
  ChevronDown, Sparkles
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function Navbar({ 
  onOpenSearchModal,
  isLoggedIn = false,
  currentRole = 'public',
  userProfile = null,
  onLogout = null
}) {
  const { t, lang, setLang } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on route change or outside click
  useEffect(() => {
    setProfileDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  // Determine user display info
  const isCollector = isLoggedIn && currentRole === 'collector';
  const isRecycler = isLoggedIn && currentRole === 'recycler';
  const isAdmin = isLoggedIn && currentRole === 'admin';

  const displayName = userProfile?.name || 
    (isCollector ? "Ramesh Kumar" : 
     isRecycler ? "GreenCycle Material Recovery" : 
     isAdmin ? "Platform Administrator" : "Guest");

  const displayRoleTitle = isCollector ? "Collector" : 
    isRecycler ? "Recycler" : 
    isAdmin ? "Administrator" : "Public";

  const profilePath = isCollector ? '/collector/profile' : isRecycler ? '/recycler/profile' : '/admin/profile';
  const notifPath = isCollector ? '/collector/notifications' : isRecycler ? '/recycler/notifications' : '/admin/notifications';

  // Notifications Mock Data based on role
  const notifications = isCollector ? [
    { id: 1, title: "Offer Received: ₹670/kg", desc: "GreenCycle submitted an offer on LOT-00125", time: "5m ago", unread: true },
    { id: 2, title: "Phone Verified ✓", desc: "Your mobile number +91 98401 23456 is verified", time: "1h ago", unread: false },
    { id: 3, title: "Handover Scheduled", desc: "Pickup driver assigned for LOT-00124", time: "Yesterday", unread: false }
  ] : isRecycler ? [
    { id: 1, title: "New Matching Lot", desc: "30 kg Copper wiring available in Guindy", time: "12m ago", unread: true },
    { id: 2, title: "Offer Accepted", desc: "Collector accepted your bid of ₹670/kg", time: "2h ago", unread: true },
    { id: 3, title: "CPCB Audit Verified", desc: "EPR Compliance status: Active & Certified", time: "3d ago", unread: false }
  ] : [
    { id: 1, title: "1 Flagged Offer", desc: "Below benchmark bid requires review on LOT-00127", time: "15m ago", unread: true },
    { id: 2, title: "New Recycler Registered", desc: "Salem Electro-Smelt applied for verification", time: "1h ago", unread: true },
    { id: 3, title: "Benchmark Rates Updated", desc: "Lithium & PCB baseline updated for TN zone", time: "Yesterday", unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNavLinkClass = (path, exact = false) => {
    const isActive = exact 
      ? location.pathname === path 
      : (location.pathname === path || (path !== '/' && location.pathname.startsWith(path)));
    
    return `px-3.5 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
      isActive 
        ? 'bg-[#3F7655] text-white shadow-sm' 
        : 'text-[#203128] hover:text-[#3F7655] hover:bg-[#DDEBD8]/60'
    }`;
  };

  const getMobileNavLinkClass = (path, exact = false) => {
    const isActive = exact 
      ? location.pathname === path 
      : (location.pathname === path || (path !== '/' && location.pathname.startsWith(path)));
    
    return `text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
      isActive ? 'bg-[#3F7655] text-white' : 'text-[#203128] hover:bg-[#DDEBD8]'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EA]/95 backdrop-blur-md border-b border-[#3F7655]/15 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo: ♻ Eco-Link */}
          <Link 
            to={isLoggedIn ? (isCollector ? '/collector/dashboard' : isRecycler ? '/recycler/dashboard' : '/admin/dashboard') : '/'} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] flex items-center justify-center text-white shadow-md shadow-[#3F7655]/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">♻</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#244936]">
              Eco-<span className="text-[#3F7655]">Link</span>
            </span>
          </Link>

          {/* ========================================================= */}
          {/* 1. PUBLIC (UNAUTHENTICATED) DESKTOP NAVIGATION            */}
          {/* ========================================================= */}
          {!isLoggedIn && (
            <nav className="hidden lg:flex items-center gap-1 bg-[#DDEBD8]/40 p-1.5 rounded-full border border-[#3F7655]/10">
              <Link to="/" className={getNavLinkClass('/', true)}>
                Home
              </Link>
              <Link to="/how-it-works" className={getNavLinkClass('/how-it-works')}>
                How It Works
              </Link>
              <Link to="/recycle-guide" className={getNavLinkClass('/recycle-guide')}>
                Recycle Guide
              </Link>
              <Link to="/locations" className={getNavLinkClass('/locations')}>
                Locations
              </Link>
              <Link to="/about" className={getNavLinkClass('/about')}>
                About
              </Link>
            </nav>
          )}

          {/* ========================================================= */}
          {/* 2. COLLECTOR LOGGED-IN DESKTOP NAVIGATION                 */}
          {/* ========================================================= */}
          {isCollector && (
            <nav className="hidden lg:flex items-center gap-1 bg-[#DDEBD8]/40 p-1.5 rounded-full border border-[#3F7655]/10">
              <Link to="/collector/dashboard" className={getNavLinkClass('/collector/dashboard', true)}>
                Dashboard
              </Link>
              <Link to="/collector/register-waste" className={getNavLinkClass('/collector/register-waste')}>
                Register E-Waste
              </Link>
              <Link to="/collector/waste-lots" className={getNavLinkClass('/collector/waste-lots')}>
                My Waste Lots
              </Link>
              <Link to="/collector/recycler-matches" className={getNavLinkClass('/collector/recycler-matches')}>
                Recycler Matches
              </Link>
              <Link to="/collector/transactions" className={getNavLinkClass('/collector/transactions')}>
                Transactions
              </Link>
            </nav>
          )}

          {/* ========================================================= */}
          {/* 3. RECYCLER LOGGED-IN DESKTOP NAVIGATION                  */}
          {/* ========================================================= */}
          {isRecycler && (
            <nav className="hidden lg:flex items-center gap-1 bg-[#DDEBD8]/40 p-1.5 rounded-full border border-[#3F7655]/10">
              <Link to="/recycler/dashboard" className={getNavLinkClass('/recycler/dashboard', true)}>
                Dashboard
              </Link>
              <Link to="/recycler/waste-requests" className={getNavLinkClass('/recycler/waste-requests')}>
                Waste Requests
              </Link>
              <Link to="/recycler/matches" className={getNavLinkClass('/recycler/matches')}>
                My Matches
              </Link>
              <Link to="/recycler/transactions" className={getNavLinkClass('/recycler/transactions')}>
                Transactions
              </Link>
              <Link to="/recycler/compliance" className={getNavLinkClass('/recycler/compliance')}>
                Compliance
              </Link>
            </nav>
          )}

          {/* ========================================================= */}
          {/* 4. ADMIN LOGGED-IN DESKTOP NAVIGATION                     */}
          {/* ========================================================= */}
          {isAdmin && (
            <nav className="hidden lg:flex items-center gap-1 bg-[#DDEBD8]/40 p-1.5 rounded-full border border-[#3F7655]/10">
              <Link to="/admin/dashboard" className={getNavLinkClass('/admin/dashboard', true)}>
                Dashboard
              </Link>
              <Link to="/admin/collectors" className={getNavLinkClass('/admin/collectors')}>
                Collectors
              </Link>
              <Link to="/admin/recyclers" className={getNavLinkClass('/admin/recyclers')}>
                Recyclers
              </Link>
              <Link to="/admin/waste-lots" className={getNavLinkClass('/admin/waste-lots')}>
                Waste Lots
              </Link>
              <Link to="/admin/transactions" className={getNavLinkClass('/admin/transactions')}>
                Transactions
              </Link>
              <Link to="/admin/verification" className={getNavLinkClass('/admin/verification')}>
                Verification
              </Link>
            </nav>
          )}

          {/* ========================================================= */}
          {/* RIGHT SIDE TOOLS: PUBLIC VS LOGGED-IN                     */}
          {/* ========================================================= */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* PUBLIC ONLY: Search Icon */}
            {!isLoggedIn && (
              <button
                onClick={onOpenSearchModal}
                title="Search e-waste materials & reference rates"
                className="p-2.5 rounded-full text-[#203128] hover:text-[#3F7655] hover:bg-[#DDEBD8]/60 transition border border-[#3F7655]/10 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#3F7655]" />
                <span className="hidden xl:inline text-[#718078]">{t("navSearchPlaceholder") || "Search"}</span>
              </button>
            )}

            {/* Language Switcher: EN | தமிழ் (Always available) */}
            <div className="flex items-center bg-white border border-[#3F7655]/20 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-[#3F7655] text-white' 
                    : 'text-[#203128] hover:text-[#3F7655]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition cursor-pointer ${
                  lang === 'ta' 
                    ? 'bg-[#3F7655] text-white' 
                    : 'text-[#203128] hover:text-[#3F7655]'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* ===================================================== */}
            {/* STATE 1: PUBLIC RIGHT SIDE -> SINGLE [ Login / Signup ] */}
            {/* ===================================================== */}
            {!isLoggedIn && (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className={`px-5 py-2 text-xs font-extrabold rounded-full transition cursor-pointer shadow-sm ${
                    location.pathname === '/login' || location.pathname === '/signup'
                      ? 'bg-[#244936] text-white shadow-md'
                      : 'bg-[#3F7655] text-white hover:bg-[#244936]'
                  }`}
                >
                  Login / Signup
                </Link>
              </div>
            )}

            {/* ===================================================== */}
            {/* STATE 2, 3, 4: LOGGED IN -> [ 🔔 Notifications ] [ 👤 Profile ] */}
            {/* Login and Sign Up DISAPPEAR completely */}
            {/* ===================================================== */}
            {isLoggedIn && (
              <div className="flex items-center gap-2.5">
                
                {/* 🔔 Notifications Button & Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                    }}
                    title="Notifications"
                    className="p-2.5 rounded-full text-[#203128] bg-white hover:bg-[#DDEBD8]/60 border border-[#3F7655]/20 relative transition cursor-pointer shadow-sm"
                  >
                    <Bell className="w-4 h-4 text-[#3F7655]" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-[#3F7655]/20 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 pb-2 border-b border-[#3F7655]/10 flex items-center justify-between">
                        <span className="text-xs font-black text-[#203128]">Notifications</span>
                        <Link to={notifPath} className="text-[10px] font-bold text-[#3F7655] hover:underline">
                          View All
                        </Link>
                      </div>

                      <div className="divide-y divide-[#3F7655]/10 max-h-64 overflow-y-auto">
                        {notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => navigate(notifPath)}
                            className={`p-3 text-xs hover:bg-[#FAF8F2] transition cursor-pointer ${n.unread ? 'bg-[#DDEBD8]/20' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[#203128]">{n.title}</span>
                              <span className="text-[10px] text-slate-400">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-[#718078] mt-0.5">{n.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 px-3 border-t border-[#3F7655]/10 text-center">
                        <Link to={notifPath} className="text-[11px] font-bold text-[#3F7655] hover:underline">
                          Open Notifications Center →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* 👤 Profile Avatar & Dropdown Menu */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white hover:bg-[#DDEBD8]/50 border border-[#3F7655]/20 transition cursor-pointer shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#3F7655] text-white flex items-center justify-center font-bold text-xs shadow-inner">
                      {displayName.charAt(0)}
                    </div>
                    <div className="text-left hidden md:block">
                      <span className="text-xs font-extrabold text-[#203128] block truncate max-w-[110px] leading-tight">
                        {displayName.split(' ')[0]}
                      </span>
                      <span className="text-[10px] font-bold text-[#718078] block leading-none">
                        {displayRoleTitle}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#718078]" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#3F7655]/20 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Dropdown Header */}
                      <div className="px-4 pb-3 border-b border-[#3F7655]/10">
                        <h4 className="text-sm font-black text-[#203128] truncate">{displayName}</h4>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                          {displayRoleTitle}
                        </span>
                      </div>

                      {/* Dropdown Links */}
                      <div className="py-2 text-xs font-bold text-[#203128]">
                        <Link
                          to={profilePath}
                          className="w-full text-left px-4 py-2 hover:bg-[#DDEBD8]/40 transition flex items-center gap-2.5 cursor-pointer"
                        >
                          <User className="w-4 h-4 text-[#3F7655]" />
                          <span>Profile</span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            alert("Account preferences & notification settings saved.");
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-[#DDEBD8]/40 transition flex items-center gap-2.5 cursor-pointer"
                        >
                          <Settings className="w-4 h-4 text-[#718078]" />
                          <span>Settings</span>
                        </button>
                      </div>

                      {/* Divider & Logout */}
                      <div className="pt-2 border-t border-[#3F7655]/10 px-2">
                        <button
                          onClick={handleLogoutClick}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 rounded-xl transition flex items-center gap-2.5 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-[#203128] hover:bg-[#DDEBD8]/60 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE RESPONSIVE DRAWER                                  */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#3F7655]/15 bg-[#F8F5EA] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          
          {/* Language Toggle in Mobile Drawer */}
          <div className="flex items-center justify-between pb-2 border-b border-[#3F7655]/10">
            <span className="text-xs font-bold text-[#718078]">Language / மொழி:</span>
            <div className="flex items-center bg-white border border-[#3F7655]/20 rounded-full p-1">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-xs font-bold rounded-full ${lang === 'en' ? 'bg-[#3F7655] text-white' : 'text-[#203128]'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-3 py-1 text-xs font-bold rounded-full ${lang === 'ta' ? 'bg-[#3F7655] text-white' : 'text-[#203128]'}`}
              >
                தமிழ்
              </button>
            </div>
          </div>

          {/* 1. PUBLIC MOBILE NAV */}
          {!isLoggedIn && (
            <div className="flex flex-col space-y-1">
              <Link to="/" className={getMobileNavLinkClass('/', true)}>
                Home
              </Link>
              <Link to="/how-it-works" className={getMobileNavLinkClass('/how-it-works')}>
                How It Works
              </Link>
              <Link to="/recycle-guide" className={getMobileNavLinkClass('/recycle-guide')}>
                Recycle Guide
              </Link>
              <Link to="/locations" className={getMobileNavLinkClass('/locations')}>
                Locations
              </Link>
              <Link to="/about" className={getMobileNavLinkClass('/about')}>
                About
              </Link>

              <div className="pt-3 border-t border-[#3F7655]/10">
                <Link
                  to="/login"
                  className="block w-full py-2.5 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl text-center shadow-sm"
                >
                  Login / Signup
                </Link>
              </div>
            </div>
          )}

          {/* 2. COLLECTOR LOGGED IN MOBILE NAV */}
          {isCollector && (
            <div className="flex flex-col space-y-1">
              <div className="p-3 bg-white rounded-xl border border-[#3F7655]/15 mb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#203128] block">{displayName}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Collector</span>
                </div>
                <Link to="/collector/profile" className="text-xs font-bold text-[#3F7655] underline">Profile</Link>
              </div>

              <Link to="/collector/dashboard" className={getMobileNavLinkClass('/collector/dashboard', true)}>
                Dashboard
              </Link>
              <Link to="/collector/register-waste" className={getMobileNavLinkClass('/collector/register-waste')}>
                Register E-Waste
              </Link>
              <Link to="/collector/waste-lots" className={getMobileNavLinkClass('/collector/waste-lots')}>
                My Waste Lots
              </Link>
              <Link to="/collector/recycler-matches" className={getMobileNavLinkClass('/collector/recycler-matches')}>
                Recycler Matches
              </Link>
              <Link to="/collector/transactions" className={getMobileNavLinkClass('/collector/transactions')}>
                Transactions
              </Link>
              <Link to="/collector/notifications" className={getMobileNavLinkClass('/collector/notifications')}>
                Notifications ({unreadCount})
              </Link>

              <div className="pt-2 border-t border-[#3F7655]/10">
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-extrabold text-rose-700 bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. RECYCLER LOGGED IN MOBILE NAV */}
          {isRecycler && (
            <div className="flex flex-col space-y-1">
              <div className="p-3 bg-white rounded-xl border border-[#3F7655]/15 mb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#203128] block">{displayName}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Recycler</span>
                </div>
                <Link to="/recycler/profile" className="text-xs font-bold text-[#3F7655] underline">Profile</Link>
              </div>

              <Link to="/recycler/dashboard" className={getMobileNavLinkClass('/recycler/dashboard', true)}>
                Dashboard
              </Link>
              <Link to="/recycler/waste-requests" className={getMobileNavLinkClass('/recycler/waste-requests')}>
                Waste Requests
              </Link>
              <Link to="/recycler/matches" className={getMobileNavLinkClass('/recycler/matches')}>
                My Matches
              </Link>
              <Link to="/recycler/transactions" className={getMobileNavLinkClass('/recycler/transactions')}>
                Transactions
              </Link>
              <Link to="/recycler/compliance" className={getMobileNavLinkClass('/recycler/compliance')}>
                Compliance
              </Link>
              <Link to="/recycler/notifications" className={getMobileNavLinkClass('/recycler/notifications')}>
                Notifications ({unreadCount})
              </Link>

              <div className="pt-2 border-t border-[#3F7655]/10">
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-extrabold text-rose-700 bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. ADMIN LOGGED IN MOBILE NAV */}
          {isAdmin && (
            <div className="flex flex-col space-y-1">
              <div className="p-3 bg-white rounded-xl border border-[#3F7655]/15 mb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#203128] block">{displayName}</span>
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Admin</span>
                </div>
                <Link to="/admin/profile" className="text-xs font-bold text-[#3F7655] underline">Profile</Link>
              </div>

              <Link to="/admin/dashboard" className={getMobileNavLinkClass('/admin/dashboard', true)}>
                Dashboard
              </Link>
              <Link to="/admin/collectors" className={getMobileNavLinkClass('/admin/collectors')}>
                Collectors
              </Link>
              <Link to="/admin/recyclers" className={getMobileNavLinkClass('/admin/recyclers')}>
                Recyclers
              </Link>
              <Link to="/admin/waste-lots" className={getMobileNavLinkClass('/admin/waste-lots')}>
                Waste Lots
              </Link>
              <Link to="/admin/transactions" className={getMobileNavLinkClass('/admin/transactions')}>
                Transactions
              </Link>
              <Link to="/admin/verification" className={getMobileNavLinkClass('/admin/verification')}>
                Verification
              </Link>
              <Link to="/admin/notifications" className={getMobileNavLinkClass('/admin/notifications')}>
                Notifications ({unreadCount})
              </Link>

              <div className="pt-2 border-t border-[#3F7655]/10">
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-extrabold text-rose-700 bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </header>
  );
}
