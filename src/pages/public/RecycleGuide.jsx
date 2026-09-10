import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, MapPin, ArrowRight, BookOpen, ShieldAlert, Cpu, Smartphone, Laptop, Monitor, Tv, Printer, Battery, Cable, HardDrive, Layers } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function RecycleGuide({ onOpenSearchModal }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
      id: 'monitors',
      name: 'Monitors',
      icon: <Monitor className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Computer display monitors (LCD, LED, and legacy CRT glass monitors).',
      components: ['Lead-containing CRT Glass', 'CCFL Backlight Tubes (Mercury trace)', 'Internal Driver PCBs', 'ABS Plastic Housings'],
      dos: [
        'Handle CRT monitors with extreme care to prevent glass breakage',
        'Store in dry, sheltered collection nodes',
        'Hand over to certified e-waste dismantling units'
      ],
      donts: [
        'Do not smash glass tubes or expose vacuum funnels',
        'Do not dump broken screens in open spaces',
        'Do not mix with household scrap iron'
      ]
    },
    {
      id: 'televisions',
      name: 'Televisions',
      icon: <Tv className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Smart TVs, flat screens, OLED displays, and older tube televisions.',
      components: ['Mainboard Electronics', 'Power Inverters & Transformers', 'Polarized Display Filters', 'Copper Induction Coils'],
      dos: [
        'Keep TV bodies structurally intact during transport',
        'Keep remote controls and cords grouped with unit',
        'Register for scheduled pickup with licensed recyclers'
      ],
      donts: [
        'Do not break backlight lamps containing mercury vapour',
        'Do not scavenge internal boards without ventilation',
        'Do not leave out in wet weather'
      ]
    },
    {
      id: 'printers',
      name: 'Printers',
      icon: <Printer className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'LaserJet, Inkjet, thermal printers, scanners, and multi-function copiers.',
      components: ['Stepper Motors & Micro-controllers', 'Toner Cartridges & Ink Heads', 'Rubber Rollers & Metal Rods', 'Plastic Enclosures'],
      dos: [
        'Remove ink or toner cartridges prior to handover',
        'Store spent toner in closed bags to avoid airborne particulate',
        'Recycle plastic and electronic chassis via EPR hubs'
      ],
      donts: [
        'Do not inhale loose laser toner powder',
        'Do not wash ink residue into storm drains',
        'Do not burn plastic gears or cartridges'
      ]
    },
    {
      id: 'batteries',
      name: 'Batteries',
      icon: <Battery className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Rechargeable Lithium-ion, Lead-Acid UPS, and Nickel-Metal Hydride battery packs.',
      components: ['Cobalt & Lithium Compounds', 'Lead & Sulfuric Acid Plates', 'Nickel & Cadmium Electrodes', 'Copper/Aluminum Foils'],
      dos: [
        'Tape terminals of 9V/Lithium batteries with non-conductive tape',
        'Store in non-metallic, fireproof containers',
        'Channel strictly to authorized hydrometallurgy facilities'
      ],
      donts: [
        'Do not submerge lithium batteries in water',
        'Do not crush, short-circuit, or pierce battery packs',
        'Do not mix with regular organic or paper waste'
      ]
    },
    {
      id: 'cables',
      name: 'Cables & chargers',
      icon: <Cable className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Copper electrical wires, power adapters, HDMI cables, and charging leads.',
      components: ['High-Purity Copper Core', 'PVC/Rubber Insulation', 'Gold-plated Terminals', 'Ferrite Beads'],
      dos: [
        'Bundle and tie wires together by material type',
        'Keep copper wiring dry to preserve recycling grade',
        'Use mechanical granulators rather than burning'
      ],
      donts: [
        'NEVER open-burn wire bundles to strip plastic insulation',
        'Do not inhale toxic dioxins produced from burning PVC',
        'Do not cut live electrical cables'
      ]
    },
    {
      id: 'circuit-boards',
      name: 'Circuit boards',
      icon: <Cpu className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'High-grade telecommunication PCBs, motherboard cards, and controller boards.',
      components: ['Gold Bonding Wires & Gold Finger Plating', 'Palladium & Tantalum Capacitors', 'Tin/Lead Solder Points', 'Fiberglass Substrates'],
      dos: [
        'Store PCBs in electrostatic-safe dry bins',
        'Sort PCBs by grade (High-grade telecom vs Low-grade brown board)',
        'Transfer to authorized smelting and recovery plants'
      ],
      donts: [
        'Do not use dangerous backyard acid baths (aqua regia)',
        'Do not burn fiberglass substrates to extract metals',
        'Do not dump acidic tailings into local water tables'
      ]
    },
    {
      id: 'other-electronics',
      name: 'Other electronics',
      icon: <Layers className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: 'Microwaves, routers, set-top boxes, smart gadgets, and medical electronics.',
      components: ['Magnetrons & Transformers', 'RF Transmitter Modules', 'Mixed Metal Chassis', 'Silicone & Plastics'],
      dos: [
        'Check device label for hazardous material warnings',
        'Separate heavy metal transformers from electronics',
        'Declare on Eco-Link platform for verified classification'
      ],
      donts: [
        'Do not puncture sealed cooling coils or vacuum components',
        'Do not dispose of medical sensors in general trash',
        'Do not leave e-waste in vacant public lands'
      ]
    }
  ];

  const filteredCategories = guideCategories.filter(c => 
    c.name.toLowerCase().includes(guideSearch.toLowerCase()) ||
    c.whatIsIt.toLowerCase().includes(guideSearch.toLowerCase()) ||
    c.components.some(comp => comp.toLowerCase().includes(guideSearch.toLowerCase()))
  );

  const activeCategory = guideCategories.find(c => c.id === selectedCatId) || guideCategories[0];

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 text-[#203128]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header (Section 3 Specification) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold uppercase tracking-wider border border-[#3F7655]/20">
            <BookOpen className="w-3.5 h-3.5 text-[#3F7655]" /> CPCB STANDARDIZED RECYCLING GUIDE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#203128] tracking-tight">
            How to Recycle Your E-Waste
          </h1>
          <p className="text-base text-[#718078] font-medium">
            Learn proper classification, valuable component recovery, and safe handling guidelines for 10 electronic waste categories.
          </p>
        </div>

        {/* Search Bar Input (Section 3 Specification) */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-[#3F7655] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={guideSearch}
              onChange={(e) => setGuideSearch(e.target.value)}
              placeholder="Search category, e.g. Mobile, Laptop, PCB, Battery, Cables..."
              className="w-full bg-white border-2 border-[#3F7655]/25 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-bold text-[#203128] focus:border-[#3F7655] focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* 10 Category Selection Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer border ${
                selectedCatId === cat.id
                  ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-md'
                  : 'bg-white text-[#203128] border-[#3F7655]/15 hover:bg-[#DDEBD8]'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Detailed Category View Card */}
        {activeCategory && (
          <div className="bg-white p-8 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-xl space-y-8 animate-fadeIn">
            
            {/* Header with Title & Icon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3F7655]/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#DDEBD8] flex items-center justify-center">
                  {activeCategory.icon}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#3F7655]">
                    CPCB E-WASTE CLASSIFICATION
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#203128]">{activeCategory.name}</h2>
                </div>
              </div>

              <button
                onClick={() => navigate('/locations')}
                className="px-5 py-2.5 bg-[#F8F5EA] hover:bg-[#DDEBD8] text-[#203128] font-bold text-xs rounded-xl border border-[#3F7655]/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <MapPin className="w-4 h-4 text-[#3F7655]" />
                <span>Find Drop Points</span>
              </button>
            </div>

            {/* WHAT IS IT (Section 3 Specification) */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase text-[#3F7655] tracking-wider">
                What is it?
              </h3>
              <p className="text-sm font-semibold text-[#203128] leading-relaxed">
                {activeCategory.whatIsIt}
              </p>
            </div>

            {/* VALUABLE COMPONENTS / MATERIALS (Section 3 Specification) */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-[#3F7655] tracking-wider">
                Valuable Components & Recyclable Materials:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeCategory.components.map((comp, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF8F2] rounded-xl border border-[#3F7655]/15 text-xs font-bold text-[#203128] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#3F7655]"></span>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-Column Grid: DO vs DON'T (Section 3 Specification) */}
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
                onClick={() => navigate('/collector/register-waste')}
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
