import React, { useState } from 'react';
import { Search, MapPin, Navigation, Clock, Phone, Star, Filter, CheckCircle2, ShieldCheck } from 'lucide-react';
import { recyclingLocations } from '../mockData';

export default function FindLocationView({ setActiveView }) {
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState('All');
  const [activeLocationId, setActiveLocationId] = useState(recyclingLocations[0].id);

  const materialsList = ["All", "Paper", "Plastic", "Glass", "Metal", "Electronics", "Batteries", "Organic"];

  const filteredLocations = recyclingLocations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
                          loc.address.toLowerCase().includes(locationSearch.toLowerCase());
    const matchesMat = selectedMaterialFilter === 'All' || loc.acceptedMaterials.includes(selectedMaterialFilter);
    return matchesSearch && matchesMat;
  });

  const activeLocation = recyclingLocations.find(l => l.id === activeLocationId) || recyclingLocations[0];

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Search Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#3F7655]/15 shadow-sm space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" /> Interactive Location Locator
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#203128]">
              Find a Recycling Drop-off Location
            </h1>
            <p className="text-xs sm:text-sm text-[#718078] mt-1">
              Locate nearby certified recycling centers, accepted materials, and operating hours.
            </p>
          </div>

          {/* Search Input & Material Chips */}
          <div className="space-y-4">
            <div className="relative max-w-xl">
              <Search className="w-5 h-5 text-[#3F7655] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search by city, zipcode, or location name..."
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#718078] mr-1">Filter Materials:</span>
              {materialsList.map((mat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMaterialFilter(mat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedMaterialFilter === mat 
                      ? 'bg-[#3F7655] text-white shadow-sm' 
                      : 'bg-[#F8F5EA] text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Split Desktop Layout: Left List + Right Interactive Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Location Cards List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#244936]">
                Recycling Points ({filteredLocations.length})
              </h3>
              <span className="text-xs text-[#718078] font-semibold">Sorted by distance</span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {filteredLocations.map((loc) => {
                const isSelected = loc.id === activeLocationId;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setActiveLocationId(loc.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected 
                        ? 'bg-white border-[#3F7655] ring-2 ring-[#3F7655]/20 shadow-md' 
                        : 'bg-white border-[#3F7655]/15 hover:border-[#3F7655]/40 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-md inline-block mb-1">
                          ♻ Verified Point
                        </span>
                        <h4 className="text-base font-extrabold text-[#203128]">{loc.name}</h4>
                        <p className="text-xs text-[#718078] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#3F7655] shrink-0" />
                          {loc.address}
                        </p>
                      </div>

                      <span className="text-xs font-extrabold text-[#3F7655] bg-[#F8F5EA] px-2.5 py-1 rounded-full border border-[#3F7655]/15 shrink-0">
                        {loc.distance}
                      </span>
                    </div>

                    {/* Accepted Materials List */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {loc.acceptedMaterials.map((m, mIdx) => (
                        <span key={mIdx} className="text-[11px] font-medium bg-[#F8F5EA] text-[#203128] px-2 py-0.5 rounded border border-[#3F7655]/10">
                          {m}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#3F7655]/10 flex items-center justify-between text-xs text-[#718078]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#3F7655]" />
                        {loc.hours}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Navigating directions to ${loc.name} at ${loc.address}`);
                        }}
                        className="px-3 py-1 bg-[#3F7655] hover:bg-[#244936] text-white font-bold rounded-lg text-xs transition flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Directions</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Interactive Map Panel */}
          <div className="lg:col-span-7 bg-[#244936] text-white p-6 sm:p-8 rounded-[28px] shadow-xl border border-[#3F7655]/30 space-y-6 relative overflow-hidden min-h-[520px] flex flex-col justify-between">
            
            {/* Top Map Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F2C94C]" />
                <h3 className="text-base font-bold text-white">Interactive Location Map</h3>
              </div>
              <span className="text-xs font-mono text-[#F2C94C] bg-[#14291E] border border-[#3F7655] px-3 py-1 rounded-full">
                {activeLocation.name} Selected
              </span>
            </div>

            {/* Simulated Map Visual Canvas */}
            <div className="flex-1 my-4 bg-[#14291E] rounded-2xl p-6 relative border border-white/10 flex flex-col justify-center items-center overflow-hidden min-h-[340px]">
              
              {/* Grid Background lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#3F7655_1px,transparent_1px),linear-gradient(to_bottom,#3F7655_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

              {/* Simulated Location Map Pins */}
              {recyclingLocations.map((loc) => {
                const isSelected = loc.id === activeLocationId;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setActiveLocationId(loc.id)}
                    className={`absolute cursor-pointer transition-all ${
                      loc.id === 'loc-1' ? 'top-1/4 left-1/3' : loc.id === 'loc-2' ? 'top-1/2 left-2/3' : 'bottom-1/4 left-1/2'
                    }`}
                  >
                    <div className={`flex flex-col items-center group ${isSelected ? 'scale-110 z-20' : 'opacity-80 hover:opacity-100'}`}>
                      <div className={`px-2.5 py-1 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1 ${
                        isSelected ? 'bg-[#F2C94C] text-[#244936]' : 'bg-white text-[#203128]'
                      }`}>
                        <span>♻</span>
                        <span>{loc.name}</span>
                      </div>
                      <div className={`w-4 h-4 rotate-45 -mt-2 ${isSelected ? 'bg-[#F2C94C]' : 'bg-white'}`} />
                    </div>
                  </div>
                );
              })}

              {/* Selected Location Card Banner overlay inside map */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#244936]/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-[#F2C94C] text-sm">{activeLocation.name}</h4>
                  <span className="text-[11px] font-mono text-[#DDEBD8]">{activeLocation.distance}</span>
                </div>
                <p className="text-white/80">{activeLocation.address} • {activeLocation.hours}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-white/70">Phone: {activeLocation.phone}</span>
                  <button
                    onClick={() => alert(`Starting turn-by-turn navigation to ${activeLocation.name}`)}
                    className="px-3 py-1 bg-[#F2C94C] text-[#244936] font-bold rounded-lg text-xs hover:bg-yellow-300 transition flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" /> Start GPS Route
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
