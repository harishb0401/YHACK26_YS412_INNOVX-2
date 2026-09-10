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
    { name: t("navCollector"), view: 'collector' },
    { name: t("navRecycler"), view: 'recycler' },
    { name: t("navGenerator"), view: 'generator' },
    { name: t("navGuide"), view: 'guide' },
    { name: t("navLocations"), view: 'locations' },
    { name: t("navAdmin"), view: 'admin' },
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
              ECO-<span className="text-[#3F7655]">Link</span>
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

          {/* Right Action Tools: Search, Language, Role Selector */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearchModal}
              title="Search e-waste materials & reference rates"
              className="p-2.5 rounded-full text-[#203128] hover:text-[#3F7655] hover:bg-[#DDEBD8]/60 transition border border-[#3F7655]/10 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Search className="w-4 h-4 text-[#3F7655]" />
              <span className="hidden md:inline text-[#718078]">{t("navSearchPlaceholder")}</span>
            </button>

            {/* Language Switcher: EN | தமிழ் */}
            <div className="flex items-center bg-white border border-[#3F7655]/20 rounded-full p-1 shadow-sm">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-[#3F7655] text-white' 
                    : 'text-[#203128] hover:text-[#3F7655]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-2.5 py-1 text-xs font-bold rounded-full transition cursor-pointer ${
                  lang === 'ta' 
                    ? 'bg-[#3F7655] text-white' 
                    : 'text-[#203128] hover:text-[#3F7655]'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Fast Portal Selector Buttons */}
            <button
              onClick={() => handleNavClick('collector')}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-full border transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'collector'
                  ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-md shadow-[#3F7655]/20'
                  : 'text-[#244936] bg-[#DDEBD8] hover:bg-[#c9e0c1] border-[#3F7655]/20'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t("navCollector")}</span>
            </button>

            <button
              onClick={() => handleNavClick('recycler')}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'recycler'
                  ? 'bg-[#244936] text-white shadow-md shadow-[#244936]/20'
                  : 'bg-[#3F7655] hover:bg-[#244936] text-white shadow-sm'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F2C94C]" />
              <span>{t("navRecycler")}</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3.5 py-2 text-xs font-extrabold rounded-full transition flex items-center gap-1.5 cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-[#14291E] text-[#F2C94C] shadow-md shadow-black/20'
                  : 'bg-[#244936] hover:bg-[#14291E] text-white shadow-sm'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("navAdmin")}</span>
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

          <div className="pt-2 border-t border-[#3F7655]/10 flex flex-col gap-2">
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
