import React, { useState } from 'react';
import { 
  Search, Globe, Menu, X, ArrowRight, User, Sparkles, 
  MapPin, BookOpen, ShieldCheck, LayoutDashboard, Truck, Package, Shield
} from 'lucide-react';
import { useTranslation } from '../i18n';

export default function Navbar({ 
  activeView, 
  setActiveView, 
  onOpenSearchModal,
  currentRole = 'public',
  onChangeRole
}) {
  const { t, lang, setLang } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks = [
    { name: t("navHome"), view: 'landing' },
    { name: "How It Works", view: 'how-it-works' },
    { name: t("navGuide"), view: 'guide' },
    { name: t("navLocations"), view: 'locations' },
    { name: "About", view: 'about' },
  ];

  const handleNavClick = (viewName) => {
    setActiveView(viewName);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EA]/95 backdrop-blur-md border-b border-[#3F7655]/15 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo: ♻ ECO-Link */}
          <div 
            onClick={() => handleNavClick('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] flex items-center justify-center text-white shadow-md shadow-[#3F7655]/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">♻</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#244936]">
              Eco-<span className="text-[#3F7655]">Link</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#DDEBD8]/40 p-1.5 rounded-full border border-[#3F7655]/10">
            {navLinks.map((link, idx) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link.view)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-[#3F7655] text-white shadow-sm' 
                      : 'text-[#203128] hover:text-[#3F7655] hover:bg-[#DDEBD8]/60'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Search, Language, Auth & Dashboard Links */}
          <div className="hidden sm:flex items-center gap-2">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearchModal}
              title="Search e-waste materials & reference rates"
              className="p-2 rounded-full text-[#203128] hover:text-[#3F7655] hover:bg-[#DDEBD8]/60 transition border border-[#3F7655]/10 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Search className="w-4 h-4 text-[#3F7655]" />
            </button>

            {/* Language Switcher: EN | தமிழ் */}
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

            {/* Login & Sign Up Buttons (Section 1) */}
            <button
              onClick={() => handleNavClick('login')}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-full transition cursor-pointer border ${
                activeView === 'login'
                  ? 'bg-[#3F7655] text-white border-[#3F7655]'
                  : 'bg-white text-[#203128] border-[#3F7655]/20 hover:bg-[#DDEBD8]/50'
              }`}
            >
              Login
            </button>

            <button
              onClick={() => handleNavClick('signup')}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-full transition cursor-pointer ${
                activeView === 'signup'
                  ? 'bg-[#244936] text-white shadow-md'
                  : 'bg-[#3F7655] text-white hover:bg-[#244936]'
              }`}
            >
              Sign Up
            </button>

            {/* Portal / Role Switcher Quick Links */}
            <button
              onClick={() => handleNavClick('collector')}
              className={`p-2 rounded-full border transition cursor-pointer ${
                activeView === 'collector'
                  ? 'bg-[#3F7655] text-white border-[#3F7655]'
                  : 'text-[#244936] bg-[#DDEBD8] hover:bg-[#c9e0c1] border-[#3F7655]/20'
              }`}
              title="Collector Dashboard"
            >
              <Truck className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNavClick('recycler')}
              className={`p-2 rounded-full transition cursor-pointer ${
                activeView === 'recycler'
                  ? 'bg-[#244936] text-white'
                  : 'bg-[#3F7655] text-white hover:bg-[#244936]'
              }`}
              title="Recycler Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-[#F2C94C]" />
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-full transition cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-[#14291E] text-[#F2C94C]'
                  : 'bg-[#244936] text-white hover:bg-[#14291E]'
              }`}
              title="Admin Dashboard"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Profile Link */}
            <button
              onClick={() => handleNavClick('profile')}
              className={`p-2 rounded-full transition cursor-pointer border ${
                activeView === 'profile'
                  ? 'bg-[#3F7655] text-white border-[#3F7655]'
                  : 'bg-white text-[#203128] border-[#3F7655]/20 hover:bg-[#DDEBD8]'
              }`}
              title="User Profile"
            >
              <User className="w-4 h-4 text-[#3F7655]" />
            </button>

          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#203128] hover:bg-[#DDEBD8]/60 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-[#3F7655]/15 bg-[#F8F5EA] px-4 pt-3 pb-6 space-y-3">
          
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

          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(link.view)}
                className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-bold ${
                  activeView === link.view 
                    ? 'bg-[#3F7655] text-white' 
                    : 'text-[#203128] hover:bg-[#DDEBD8]'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#3F7655]/10 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('login')}
              className="py-2.5 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 rounded-xl"
            >
              Login
            </button>
            <button
              onClick={() => handleNavClick('signup')}
              className="py-2.5 text-xs font-bold text-white bg-[#3F7655] rounded-xl"
            >
              Sign Up
            </button>
          </div>

          <div className="pt-2 border-t border-[#3F7655]/10 flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleNavClick('collector')}
                className="py-2 text-[11px] font-bold bg-[#DDEBD8] text-[#244936] rounded-xl text-center"
              >
                Collector
              </button>
              <button
                onClick={() => handleNavClick('recycler')}
                className="py-2 text-[11px] font-bold bg-[#244936] text-white rounded-xl text-center"
              >
                Recycler
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="py-2 text-[11px] font-bold bg-[#14291E] text-[#F2C94C] rounded-xl text-center"
              >
                Admin
              </button>
              <button
                onClick={() => handleNavClick('profile')}
                className="py-2 text-[11px] font-bold bg-white text-[#203128] border border-[#3F7655]/20 rounded-xl text-center"
              >
                Profile
              </button>
            </div>

            <button
              onClick={onOpenSearchModal}
              className="w-full py-2.5 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 rounded-xl flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-[#3F7655]" />
              <span>{t("navSearchPlaceholder")}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
