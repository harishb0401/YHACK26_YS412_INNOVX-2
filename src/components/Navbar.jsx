import React, { useState } from 'react';
import { Search, Globe, Menu, X, ArrowRight, User, Sparkles, Calendar, MapPin, BookOpen, Award, LayoutDashboard, Leaf } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, onOpenSearchModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const navLinks = [
    { name: 'Home', view: 'landing' },
    { name: 'How it works', view: 'landing', anchor: '#how-it-works' },
    { name: 'Recycle Guide', view: 'guide' },
    { name: 'Locations', view: 'locations' },
    { name: 'Schedule Pickup', view: 'pickup' },
    { name: 'Dashboard', view: 'dashboard' },
    { name: 'Rewards', view: 'rewards' },
  ];

  const handleNavClick = (link) => {
    setActiveView(link.view);
    if (link.anchor) {
      setTimeout(() => {
        const elem = document.querySelector(link.anchor);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EA]/95 backdrop-blur-md border-b border-[#3F7655]/15 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo: ♻ EcoLoop */}
          <div 
            onClick={() => setActiveView('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] flex items-center justify-center text-white shadow-md shadow-[#3F7655]/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black">♻</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#244936]">
              Eco<span className="text-[#3F7655]">Loop</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#DDEBD8]/40 p-1.5 rounded-full border border-[#3F7655]/10">
            {navLinks.map((link, idx) => {
              const isActive = activeView === link.view && !link.anchor;
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
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

          {/* Right Action Tools: Search, Language, Log in, Get Started */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Search Icon Trigger */}
            <button
              onClick={onOpenSearchModal}
              title="Search materials (Can I recycle this?)"
              className="p-2.5 rounded-full text-[#203128] hover:text-[#3F7655] hover:bg-[#DDEBD8]/60 transition border border-[#3F7655]/10 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Search className="w-4 h-4 text-[#3F7655]" />
              <span className="hidden xl:inline text-[#718078]">Search item...</span>
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button 
                className="px-2.5 py-1.5 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/15 rounded-full flex items-center gap-1 hover:border-[#3F7655]/40 transition"
              >
                <Globe className="w-3.5 h-3.5 text-[#3F7655]" />
                <span>{selectedLang}</span>
                <span className="text-[10px]">▾</span>
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#3F7655]/15 rounded-xl shadow-lg p-1 hidden group-hover:block z-50 min-w-[70px]">
                <button onClick={() => setSelectedLang('EN')} className="w-full text-left px-2.5 py-1 text-xs hover:bg-[#DDEBD8] rounded-lg">EN</button>
                <button onClick={() => setSelectedLang('ES')} className="w-full text-left px-2.5 py-1 text-xs hover:bg-[#DDEBD8] rounded-lg">ES</button>
                <button onClick={() => setSelectedLang('DE')} className="w-full text-left px-2.5 py-1 text-xs hover:bg-[#DDEBD8] rounded-lg">DE</button>
              </div>
            </div>

            {/* Log in Button */}
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-3.5 py-2 text-xs font-bold text-[#203128] hover:text-[#3F7655] transition"
            >
              Log in
            </button>

            {/* Primary CTA: Get Started */}
            <button
              onClick={() => setActiveView('pickup')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#3F7655] hover:bg-[#244936] rounded-full shadow-md shadow-[#3F7655]/20 hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#203128] hover:bg-[#DDEBD8]/60 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#3F7655]/15 bg-[#F8F5EA] px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(link)}
                className="text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#203128] hover:bg-[#DDEBD8] hover:text-[#244936]"
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-[#3F7655]/10 flex flex-col gap-2">
            <button
              onClick={onOpenSearchModal}
              className="w-full py-2.5 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 rounded-xl flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-[#3F7655]" />
              <span>Can I recycle this item? (Search)</span>
            </button>
            <button
              onClick={() => { setActiveView('pickup'); setMobileMenuOpen(false); }}
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow"
            >
              Get Started (Schedule Pickup)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
