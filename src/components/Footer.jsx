import React from 'react';
import { Leaf, ShieldCheck } from 'lucide-react';

export default function Footer({ setActiveView }) {
  return (
    <footer className="bg-[#244936] text-white pt-16 pb-12 border-t border-[#3F7655]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('landing')}>
              <div className="w-10 h-10 rounded-2xl bg-[#F2C94C] flex items-center justify-center text-[#244936] font-black text-xl shadow-md">
                ♻
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Eco<span className="text-[#F2C94C]">Loop</span>
              </span>
            </div>
            
            <p className="text-[#DDEBD8] text-sm max-w-sm leading-relaxed">
              Making recycling simple for everyone through verified drop-off points, doorstep collection pickups, and interactive sorting guides.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#F2C94C] pt-1">
              <Leaf className="w-4 h-4 text-[#F2C94C]" />
              <span>Certified Sustainable Web Architecture</span>
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-extrabold tracking-wider uppercase text-xs">Product</h4>
            <ul className="space-y-2 text-[#DDEBD8]">
              <li>
                <button onClick={() => setActiveView('landing')} className="hover:text-[#F2C94C] transition">
                  How it works
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('locations')} className="hover:text-[#F2C94C] transition">
                  Locations
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('pickup')} className="hover:text-[#F2C94C] transition">
                  Doorstep Pickup
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('rewards')} className="hover:text-[#F2C94C] transition">
                  Rewards System
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-extrabold tracking-wider uppercase text-xs">Resources</h4>
            <ul className="space-y-2 text-[#DDEBD8]">
              <li>
                <button onClick={() => setActiveView('guide')} className="hover:text-[#F2C94C] transition">
                  Recycling Guide
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('landing')} className="hover:text-[#F2C94C] transition">
                  Eco Journal
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#F2C94C] transition">
                  FAQ
                </a>
              </li>
              <li>
                <button onClick={() => setActiveView('dashboard')} className="hover:text-[#F2C94C] transition">
                  Impact Ledger
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-extrabold tracking-wider uppercase text-xs">Company</h4>
            <ul className="space-y-2 text-[#DDEBD8]">
              <li><a href="#about" className="hover:text-[#F2C94C] transition">About Us</a></li>
              <li><a href="#contact" className="hover:text-[#F2C94C] transition">Contact</a></li>
              <li><a href="#careers" className="hover:text-[#F2C94C] transition">Careers</a></li>
              <li><a href="#sustainability" className="hover:text-[#F2C94C] transition">Sustainability Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DDEBD8]/70">
          <p>© {new Date().getFullYear()} EcoLoop Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-[#F2C94C] transition">Privacy Policy</a>
            <span>·</span>
            <a href="#terms" className="hover:text-[#F2C94C] transition">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
