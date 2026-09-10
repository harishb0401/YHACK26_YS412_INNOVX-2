import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, MapPin, ArrowRight, BookOpen, ShieldAlert, Cpu, Smartphone, Laptop, Monitor, Tv, Printer, Battery, Cable, HardDrive, Layers } from 'lucide-react';
import { useTranslation } from '../i18n';

export default function RecyclingGuideView({ setActiveView, onOpenSearchModal }) {
  const { t } = useTranslation();
  const [guideSearch, setGuideSearch] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('mobiles');

  // Exact 10 Categories from Section 3 Specification
  const guideCategories = [
    {
      id: 'mobiles',
      name: 'Mobile phones',
      icon: <Smartphone className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Old, unused, or damaged mobile phones, smartphones, and cellular devices.',
      components: ['Printed Circuit Boards (PCBs)', 'Precious Metals (Gold, Silver, Copper)', 'Polycarbonate Plastics', 'Lithium-ion Battery'],
      dos: [
        'Remove all personal data and perform a factory reset',
        'Keep batteries safely separated where applicable',
        'Hand over to authorized recycling channels'
      ],
      donts: [
        'Do not throw electronics into regular waste bins',
        'Do not puncture or damage lithium batteries',
        'Do not burn electronic components or wires'
      ]
    },
    {
      id: 'laptops',
      name: 'Laptops',
      icon: <Laptop className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Portable notebook computers, ultrabooks, and laptop chargers.',
      components: ['Motherboards & RAM Chips', 'Aluminum & Magnesium Alloy Casing', 'LCD/OLED Display Panels', 'Lithium-Polymer Batteries'],
      dos: [
        'Back up and erase hard disk drive data prior to disposal',
        'Detach external chargers and cables for separate processing',
        'Hand over intact to CPCB verified recyclers'
      ],
      donts: [
        'Do not dismantle display screens manually',
        'Do not expose damaged laptop batteries to heat',
        'Do not crush or incinerate laptop bodies'
      ]
    },
    {
      id: 'computers',
      name: 'Computers',
      icon: <HardDrive className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Desktop PC towers, workstations, power supply units (PSUs), and internal drives.',
      components: ['High-Grade Motherboards', 'Copper Heat Sinks & Wiring', 'Steel/Iron Chassis', 'Power Transformers'],
      dos: [
        'Remove data drives or execute cryptographic wipe',
        'Keep metal casing intact during aggregation',
        'Separate power cords for copper recovery'
      ],
      donts: [
        'Do not open power supply capacitors without safety tools',
        'Do not discard heavy metal computer cases in municipal dumps',
        'Do not burn wire insulation'
      ]
    },
    {
      id: 'batteries',
      name: 'Batteries',
      icon: <Battery className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Lithium-ion, Lead-acid, NiMH, and button cell batteries from electronics.',
      components: ['Lithium & Cobalt Oxides', 'Lead & Sulfuric Acid', 'Nickel & Cadmium Compounds', 'Copper/Aluminum Foils'],
      dos: [
        'Tape battery terminals to prevent accidental short-circuiting',
        'Store in cool, dry, non-conductive containers',
        'Deliver directly to authorized battery recyclers'
      ],
      donts: [
        'Do not crush, puncture, or submerge batteries in water',
        'Do not mix leaking lead-acid batteries with household trash',
        'Do not incinerate or expose to open flame'
      ]
    },
    {
      id: 'tvs',
      name: 'TVs',
      icon: <Tv className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Television sets including CRT, LED, LCD, and Plasma screens.',
      components: ['Leaded CRT Glass (Legacy TVs)', 'LED Backlight Strips', 'Main System Boards', 'Plastic Enclosures'],
      dos: [
        'Handle CRT glass with extreme care to prevent implosion',
        'Keep internal circuit boards intact',
        'Transport upright to authorized processing centers'
      ],
      donts: [
        'Do not smash CRT tubes to avoid toxic lead dust release',
        'Do not dump television units in open fields',
        'Do not burn plastic TV frames'
      ]
    },
    {
      id: 'monitors',
      name: 'Monitors',
      icon: <Monitor className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Computer display monitors, flat-panel screens, and touch monitors.',
      components: ['Indium Tin Oxide Glass', 'CCFL/LED Backlights', 'Control Logic PCBA', 'Plastic/Metal Stands'],
      dos: [
        'Keep glass panels face-protected during transit',
        'Recycle power adapters along with the monitor',
        'Hand over to certified IT asset disposition centers'
      ],
      donts: [
        'Do not break mercury-containing CCFL backlight tubes',
        'Do not drop or crush display panels',
        'Do not mix with construction debris'
      ]
    },
    {
      id: 'printers',
      name: 'Printers',
      icon: <Printer className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Inkjet printers, laserjet units, scanners, and multifunction fax devices.',
      components: ['Copper Stepper Motors', 'Toner Cartridges', 'Logic Boards', 'Engineered ABS Plastics'],
      dos: [
        'Remove ink or toner cartridges prior to e-waste handover',
        'Keep paper trays and accessories bundled together',
        'Recycle toner cartridges through manufacturer take-back schemes'
      ],
      donts: [
        'Do not spill toxic toner powder into waterways or drains',
        'Do not incinerate plastic printer shells',
        'Do not throw raw cartridges into domestic trash'
      ]
    },
    {
      id: 'cables',
      name: 'Cables',
      icon: <Cable className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Power cords, USB cables, LAN Ethernet wires, and HDMI connections.',
      components: ['99.9% Pure Copper Strands', 'Aluminum Shielding Foil', 'PVC/Rubber Insulation Sheathing'],
      dos: [
        'Bundle wires neatly into coils for easy weighing',
        'Hand over directly to mechanical granulation recyclers',
        'Keep metal connectors attached'
      ],
      donts: [
        'Do not open-burn cables to strip PVC plastic insulation',
        'Do not dump wire scrap in drain channels',
        'Do not expose PVC to fire due to toxic dioxin release'
      ]
    },
    {
      id: 'circuit-boards',
      name: 'Circuit boards',
      icon: <Cpu className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Printed Circuit Boards (PCBs) from servers, telecom gear, and household appliances.',
      components: ['Gold, Palladium & Silver Contacts', 'Fiberglass Substrate (FR-4)', 'IC Chips & Microprocessors', 'Solder (Tin/Lead/Copper)'],
      dos: [
        'Store high-grade motherboard scrap separately from low-grade boards',
        'Protect gold-plated contact fingers from abrasion',
        'Transfer to hydrometallurgical refining facilities'
      ],
      donts: [
        'Do not use crude acid baths in unventilated informal yards',
        'Do not burn circuit boards over open fires',
        'Do not discard shredded PCB dust in open air'
      ]
    },
    {
      id: 'other-electronics',
      name: 'Other electronics',
      icon: <Layers className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Microwaves, gaming consoles, smart home gadgets, and audio equipment.',
      components: ['Transformers & Coils', 'Steel & Aluminum Frames', 'Control Circuitry', 'Synthetic Polymers'],
      dos: [
        'Check device category & material grade on Eco-Link',
        'Separate heavy transformers from light electronics',
        'Deliver to CPCB registered authorized recyclers'
      ],
      donts: [
        'Do not discard mixed electronic gadgets in landfill waste',
        'Do not dismantle hazardous high-voltage components',
        'Do not burn any electronic housings'
      ]
    }
  ];

  const activeCategory = guideCategories.find(c => c.id === selectedCatId) || guideCategories[0];

  const filteredCategories = guideCategories.filter(cat => 
    cat.name.toLowerCase().includes(guideSearch.toLowerCase()) ||
    cat.whatIsIt.toLowerCase().includes(guideSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 text-[#203128]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold uppercase tracking-wider border border-[#3F7655]/20">
            <BookOpen className="w-3.5 h-3.5" /> RECYCLING GUIDE DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#203128] tracking-tight">
            E-Waste Classification & Recycling Protocol
          </h1>
          <p className="text-base text-[#718078] font-medium">
            Learn what materials can be recovered, key components, and vital Do's and Don'ts for responsible handling.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/15 shadow-sm space-y-4">
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-[#3F7655] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={guideSearch}
              onChange={(e) => setGuideSearch(e.target.value)}
              placeholder="Search category (e.g. Mobile phones, Batteries, Laptops)..."
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-12 pr-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
            />
          </div>
        </div>

        {/* 10 Category Cards Grid (Section 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {filteredCategories.map((cat) => {
            const isSelected = selectedCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCatId(cat.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-md scale-105'
                    : 'bg-white text-[#203128] border-[#3F7655]/20 hover:bg-[#DDEBD8]/50'
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-[#DDEBD8]'}`}>
                  {cat.icon}
                </div>
                <span className="text-xs font-extrabold">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Detail View (Section 3 Specification) */}
        {activeCategory && (
          <div className="bg-white rounded-[32px] border border-[#3F7655]/20 shadow-lg p-6 sm:p-10 space-y-8 animate-fadeIn">
            
            {/* Category Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#3F7655]/15">
              <div className="w-14 h-14 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center shadow-inner">
                {activeCategory.icon}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#3F7655] tracking-widest block">
                  CATEGORY DETAILS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#203128]">{activeCategory.name}</h2>
              </div>
            </div>

            {/* What is it? */}
            <div className="bg-[#FAF8F2] p-5 rounded-2xl border border-[#3F7655]/15 space-y-1">
              <h3 className="text-xs font-black uppercase text-[#3F7655] tracking-wider">What is it?</h3>
              <p className="text-sm font-semibold text-[#203128] leading-relaxed">
                {activeCategory.whatIsIt}
              </p>
            </div>

            {/* Common Recyclable Components */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-[#203128] tracking-wider">
                Common Recyclable Components
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeCategory.components.map((comp, idx) => (
                  <div key={idx} className="p-3 bg-[#F8F5EA] rounded-xl border border-[#3F7655]/10 flex items-center gap-2 text-xs font-bold text-[#203128]">
                    <div className="w-2 h-2 rounded-full bg-[#3F7655]" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-Column Grid: DO vs DON'T */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* DO SECTION */}
              <div className="p-6 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-3">
                <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Do</span>
                </h3>
                <ul className="space-y-2.5">
                  {activeCategory.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-bold text-emerald-950">
                      <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DON'T SECTION */}
              <div className="p-6 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-3">
                <h3 className="text-sm font-black text-rose-900 uppercase tracking-wider flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Don't</span>
                </h3>
                <ul className="space-y-2.5">
                  {activeCategory.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-bold text-rose-950">
                      <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-[#3F7655]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[#718078] font-semibold">
                Have e-waste of this category to dispose? Register a digital lot to get benchmark prices.
              </span>
              <button
                onClick={() => setActiveView('collector')}
                className="px-6 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Register E-Waste Lot →
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
