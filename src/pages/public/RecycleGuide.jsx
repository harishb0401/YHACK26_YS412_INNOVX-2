import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, MapPin, ArrowRight, BookOpen, ShieldAlert, Cpu, Smartphone, Laptop, Monitor, Tv, Printer, Battery, Cable, HardDrive, Layers } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function RecycleGuide({ onOpenSearchModal }) {
  const { t, tCategory } = useTranslation();
  const navigate = useNavigate();
  const [guideSearch, setGuideSearch] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('mobiles');

  // Exact 10 Categories from Section 3 Specification
  const guideCategories = [
    {
      id: 'mobiles',
      name: 'Mobile phones',
      icon: <Smartphone className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgMobWhatIsIt', 'Old, unused, or damaged mobile phones, smartphones, and cellular devices.'),
      components: [
        t('rgMobComp1', 'Printed Circuit Boards (PCBs)'),
        t('rgMobComp2', 'Precious Metals (Gold, Silver, Copper)'),
        t('rgMobComp3', 'Polycarbonate Plastics'),
        t('rgMobComp4', 'Lithium-ion Battery')
      ],
      dos: [
        t('rgMobDo1', 'Remove all personal data and perform a factory reset'),
        t('rgMobDo2', 'Keep batteries safely separated where applicable'),
        t('rgMobDo3', 'Hand over to authorized recycling channels')
      ],
      donts: [
        t('rgMobDont1', 'Do not throw electronics into regular waste bins'),
        t('rgMobDont2', 'Do not puncture or damage lithium batteries'),
        t('rgMobDont3', 'Do not burn electronic components or wires')
      ]
    },
    {
      id: 'laptops',
      name: 'Laptops',
      icon: <Laptop className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgLapWhatIsIt', 'Portable notebook computers, ultrabooks, and laptop chargers.'),
      components: [
        t('rgLapComp1', 'Motherboards & RAM Chips'),
        t('rgLapComp2', 'Aluminum & Magnesium Alloy Casing'),
        t('rgLapComp3', 'LCD/OLED Display Panels'),
        t('rgLapComp4', 'Lithium-Polymer Batteries')
      ],
      dos: [
        t('rgLapDo1', 'Back up and erase hard disk drive data prior to disposal'),
        t('rgLapDo2', 'Detach external chargers and cables for separate processing'),
        t('rgLapDo3', 'Hand over intact to CPCB verified recyclers')
      ],
      donts: [
        t('rgLapDont1', 'Do not dismantle display screens manually'),
        t('rgLapDont2', 'Do not expose damaged laptop batteries to heat'),
        t('rgLapDont3', 'Do not crush or incinerate laptop bodies')
      ]
    },
    {
      id: 'computers',
      name: 'Computers',
      icon: <HardDrive className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgCompWhatIsIt', 'Desktop PC towers, workstations, power supply units (PSUs), and internal drives.'),
      components: [
        t('rgCompComp1', 'High-Grade Motherboards'),
        t('rgCompComp2', 'Copper Heat Sinks & Wiring'),
        t('rgCompComp3', 'Steel/Iron Chassis'),
        t('rgCompComp4', 'Power Transformers')
      ],
      dos: [
        t('rgCompDo1', 'Remove data drives or execute cryptographic wipe'),
        t('rgCompDo2', 'Keep metal casing intact during aggregation'),
        t('rgCompDo3', 'Separate power cords for copper recovery')
      ],
      donts: [
        t('rgCompDont1', 'Do not open power supply capacitors without safety tools'),
        t('rgCompDont2', 'Do not discard heavy metal computer cases in municipal dumps'),
        t('rgCompDont3', 'Do not burn wire insulation')
      ]
    },
    {
      id: 'monitors',
      name: 'Monitors',
      icon: <Monitor className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgMonWhatIsIt', 'Computer display monitors (LCD, LED, and legacy CRT glass monitors).'),
      components: [
        t('rgMonComp1', 'Lead-containing CRT Glass'),
        t('rgMonComp2', 'CCFL Backlight Tubes (Mercury trace)'),
        t('rgMonComp3', 'Internal Driver PCBs'),
        t('rgMonComp4', 'ABS Plastic Housings')
      ],
      dos: [
        t('rgMonDo1', 'Handle CRT monitors with extreme care to prevent glass breakage'),
        t('rgMonDo2', 'Store in dry, sheltered collection nodes'),
        t('rgMonDo3', 'Hand over to certified e-waste dismantling units')
      ],
      donts: [
        t('rgMonDont1', 'Do not smash glass tubes or expose vacuum funnels'),
        t('rgMonDont2', 'Do not dump broken screens in open spaces'),
        t('rgMonDont3', 'Do not mix with household scrap iron')
      ]
    },
    {
      id: 'televisions',
      name: 'Televisions',
      icon: <Tv className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgTvWhatIsIt', 'Smart TVs, flat screens, OLED displays, and older tube televisions.'),
      components: [
        t('rgTvComp1', 'Mainboard Electronics'),
        t('rgTvComp2', 'Power Inverters & Transformers'),
        t('rgTvComp3', 'Polarized Display Filters'),
        t('rgTvComp4', 'Copper Induction Coils')
      ],
      dos: [
        t('rgTvDo1', 'Keep TV bodies structurally intact during transport'),
        t('rgTvDo2', 'Keep remote controls and cords grouped with unit'),
        t('rgTvDo3', 'Register for scheduled pickup with licensed recyclers')
      ],
      donts: [
        t('rgTvDont1', 'Do not break backlight lamps containing mercury vapour'),
        t('rgTvDont2', 'Do not scavenge internal boards without ventilation'),
        t('rgTvDont3', 'Do not leave out in wet weather')
      ]
    },
    {
      id: 'printers',
      name: 'Printers',
      icon: <Printer className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgPrintWhatIsIt', 'LaserJet, Inkjet, thermal printers, scanners, and multi-function copiers.'),
      components: [
        t('rgPrintComp1', 'Stepper Motors & Micro-controllers'),
        t('rgPrintComp2', 'Toner Cartridges & Ink Heads'),
        t('rgPrintComp3', 'Rubber Rollers & Metal Rods'),
        t('rgPrintComp4', 'Plastic Enclosures')
      ],
      dos: [
        t('rgPrintDo1', 'Remove ink or toner cartridges prior to handover'),
        t('rgPrintDo2', 'Store spent toner in closed bags to avoid airborne particulate'),
        t('rgPrintDo3', 'Recycle plastic and electronic chassis via EPR hubs')
      ],
      donts: [
        t('rgPrintDont1', 'Do not inhale loose laser toner powder'),
        t('rgPrintDont2', 'Do not wash ink residue into storm drains'),
        t('rgPrintDont3', 'Do not burn plastic gears or cartridges')
      ]
    },
    {
      id: 'batteries',
      name: 'Batteries',
      icon: <Battery className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgBatWhatIsIt', 'Rechargeable Lithium-ion, Lead-Acid UPS, and Nickel-Metal Hydride battery packs.'),
      components: [
        t('rgBatComp1', 'Cobalt, Nickel & Manganese Cathodes'),
        t('rgBatComp2', 'Lithium Salts & Electrolyte Solvents'),
        t('rgBatComp3', 'Lead Plates & Sulfuric Acid'),
        t('rgBatComp4', 'Copper & Aluminum Current Collectors')
      ],
      dos: [
        t('rgBatDo1', 'Insulate exposed battery terminals with non-conductive tape'),
        t('rgBatDo2', 'Store in cool, dry containment away from direct sunlight'),
        t('rgBatDo3', 'Hand over directly to authorized battery recyclers')
      ],
      donts: [
        t('rgBatDont1', 'Do not short-circuit positive and negative terminals'),
        t('rgBatDont2', 'Do not expose damaged battery packs to water or flame'),
        t('rgBatDont3', 'Do not dispose of lead-acid batteries with regular trash')
      ]
    },
    {
      id: 'cables',
      name: 'Cables & chargers',
      icon: <Cable className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgCabWhatIsIt', 'Copper electrical wires, power adapters, HDMI cables, and charging leads.'),
      components: [
        t('rgCabComp1', 'High-Purity Copper Core'),
        t('rgCabComp2', 'PVC/Rubber Insulation'),
        t('rgCabComp3', 'Gold-plated Terminals'),
        t('rgCabComp4', 'Ferrite Beads')
      ],
      dos: [
        t('rgCabDo1', 'Bundle and tie wires together by material type'),
        t('rgCabDo2', 'Keep copper wiring dry to preserve recycling grade'),
        t('rgCabDo3', 'Use mechanical granulators rather than burning')
      ],
      donts: [
        t('rgCabDont1', 'NEVER open-burn wire bundles to strip plastic insulation'),
        t('rgCabDont2', 'Do not inhale toxic dioxins produced from burning PVC'),
        t('rgCabDont3', 'Do not cut live electrical cables')
      ]
    },
    {
      id: 'circuit-boards',
      name: 'Circuit boards',
      icon: <Cpu className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgPcbWhatIsIt', 'High-grade telecommunication PCBs, motherboard cards, and controller boards.'),
      components: [
        t('rgPcbComp1', 'Gold Bonding Wires & Gold Finger Plating'),
        t('rgPcbComp2', 'Palladium & Tantalum Capacitors'),
        t('rgPcbComp3', 'Tin/Lead Solder Points'),
        t('rgPcbComp4', 'Fiberglass Substrates')
      ],
      dos: [
        t('rgPcbDo1', 'Store PCBs in electrostatic-safe dry bins'),
        t('rgPcbDo2', 'Sort PCBs by grade (High-grade telecom vs Low-grade brown board)'),
        t('rgPcbDo3', 'Transfer to authorized smelting and recovery plants')
      ],
      donts: [
        t('rgPcbDont1', 'Do not use dangerous backyard acid baths (aqua regia)'),
        t('rgPcbDont2', 'Do not burn fiberglass substrates to extract metals'),
        t('rgPcbDont3', 'Do not dump acidic tailings into local water tables')
      ]
    },
    {
      id: 'other-electronics',
      name: 'Other electronics',
      icon: <Layers className="w-6 h-6 text-[#3F7655]" />,
      whatIsIt: t('rgOthWhatIsIt', 'Microwaves, routers, set-top boxes, smart gadgets, and medical electronics.'),
      components: [
        t('rgOthComp1', 'Small Transformers & Relays'),
        t('rgOthComp2', 'Plastic & Metal Housings'),
        t('rgOthComp3', 'Low-Grade PCBs & Displays'),
        t('rgOthComp4', 'Power Supply Units')
      ],
      dos: [
        t('rgOthDo1', 'Check device label for hazardous material warnings'),
        t('rgOthDo2', 'Separate heavy metal transformers from electronics'),
        t('rgOthDo3', 'Declare on Eco-Link platform for verified classification')
      ],
      donts: [
        t('rgOthDont1', 'Do not puncture sealed cooling coils or vacuum components'),
        t('rgOthDont2', 'Do not dispose of medical sensors in general trash'),
        t('rgOthDont3', 'Do not leave e-waste in vacant public lands')
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
            <BookOpen className="w-3.5 h-3.5 text-[#3F7655]" /> {t('cpcbRecyclingGuideBadge', 'CPCB STANDARDIZED RECYCLING GUIDE')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#203128] tracking-tight">
            {t('guideMainHeading', 'How to Recycle Your E-Waste')}
          </h1>
          <p className="text-base text-[#718078] font-medium">
            {t('guideSubHeading', 'Learn proper classification, valuable component recovery, and safe handling guidelines for 10 electronic waste categories.')}
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
              placeholder={t('searchGuidePlaceholder', 'Search category, e.g. Mobile, Laptop, PCB, Battery, Cables...')}
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
              <span>{tCategory(cat.name)}</span>
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
                    {t('cpcbClassificationBadge', 'CPCB E-WASTE CLASSIFICATION')}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#203128]">{tCategory(activeCategory.name)}</h2>
                </div>
              </div>

              <button
                onClick={() => navigate('/locations')}
                className="px-5 py-2.5 bg-[#F8F5EA] hover:bg-[#DDEBD8] text-[#203128] font-bold text-xs rounded-xl border border-[#3F7655]/20 transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <MapPin className="w-4 h-4 text-[#3F7655]" />
                <span>{t('findDropPoints', 'Find Drop Points')}</span>
              </button>
            </div>

            {/* WHAT IS IT (Section 3 Specification) */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase text-[#3F7655] tracking-wider">
                {t('whatIsItLabel', 'What is it?')}
              </h3>
              <p className="text-sm font-semibold text-[#203128] leading-relaxed">
                {activeCategory.whatIsIt}
              </p>
            </div>

            {/* VALUABLE COMPONENTS / MATERIALS (Section 3 Specification) */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase text-[#3F7655] tracking-wider">
                {t('valuableComponentsLabel', 'Valuable Components & Recyclable Materials:')}
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
                  <span>{t('doLabel', 'Do')}</span>
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
                  <span>{t('dontLabel', "Don't")}</span>
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
                {t('haveEWasteToDisposeText', 'Have e-waste of this category to dispose? Register a digital lot to get benchmark prices.')}
              </span>
              <button
                onClick={() => navigate('/collector/register-waste')}
                className="px-6 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
              >
                {t('registerEWasteLotBtn', 'Register E-Waste Lot →')}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
