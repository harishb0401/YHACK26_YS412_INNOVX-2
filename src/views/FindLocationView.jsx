import React, { useState } from 'react';
import { Search, Filter, MapPin, Phone, Mail, Clock, ShieldCheck, ArrowRight, ExternalLink, Navigation } from 'lucide-react';
import { initialRecyclers } from '../mockData';
import { structuredEWasteCategories } from '../data/scrapPrices';

export default function FindLocationView({ setActiveView }) {
  const [wasteTypeFilter, setWasteTypeFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [distanceFilter, setDistanceFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecycler, setSelectedRecycler] = useState(null);

  // Locations mock list with Section 4 fields
  const recyclerLocations = initialRecyclers.map((r, idx) => ({
    ...r,
    distanceKm: [4.2, 12.8, 8.5, 18.0, 25.4][idx % 5],
    operatingHours: "Mon – Sat: 9:00 AM – 6:00 PM",
    contactPhone: r.phone || "+91 94441 23456",
    contactEmail: r.email || "info@recycler.com",
    authorizationStatus: r.verificationStatus === 'VERIFIED' ? '✓ Authorized CPCB Facility' : '⏳ Pending Authorization',
    isAuthorized: r.verificationStatus === 'VERIFIED',
  }));

  const locationsList = ['ALL', 'Chennai', 'Madurai', 'Coimbatore', 'Salem', 'Tirunelveli'];

  // Apply Section 4 Filters
  const filteredRecyclers = recyclerLocations.filter(r => {
    const matchesSearch = r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesWasteType = wasteTypeFilter === 'ALL' || 
                             r.acceptedCategories.some(c => c.toLowerCase().includes(wasteTypeFilter.toLowerCase()));

    const matchesLocation = locationFilter === 'ALL' || r.location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesDistance = distanceFilter === 'ALL' || 
                             (distanceFilter === '10' && r.distanceKm <= 10) ||
                             (distanceFilter === '20' && r.distanceKm <= 20);

    return matchesSearch && matchesWasteType && matchesLocation && matchesDistance;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 text-[#203128]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-extrabold uppercase tracking-wider border border-[#3F7655]/20">
            <MapPin className="w-3.5 h-3.5" /> RECYCLING POINTS DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#203128] tracking-tight">
            Find Authorized Recycling Points
          </h1>
          <p className="text-base text-[#718078] font-medium">
            Locate CPCB & TNPCB verified e-waste collection hubs and material recovery facilities near you.
          </p>
        </div>

        {/* Section 4 Filters Bar: Waste Type, Location, Distance, Accepted Material */}
        <div className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-md space-y-4">
          
          <div className="relative">
            <Search className="w-5 h-5 text-[#3F7655] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by facility name or area..."
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-12 pr-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            
            {/* Filter 1: Waste Type / Accepted Material */}
            <div>
              <label className="text-[10px] font-black uppercase text-[#718078] block mb-1">Waste Type / Material</label>
              <select
                value={wasteTypeFilter}
                onChange={(e) => setWasteTypeFilter(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                <option value="ALL">All Materials</option>
                {structuredEWasteCategories.map((c, i) => (
                  <option key={i} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Filter 2: Location */}
            <div>
              <label className="text-[10px] font-black uppercase text-[#718078] block mb-1">Location / District</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                {locationsList.map((loc, i) => (
                  <option key={i} value={loc}>{loc === 'ALL' ? 'All Districts' : loc}</option>
                ))}
              </select>
            </div>

            {/* Filter 3: Distance */}
            <div>
              <label className="text-[10px] font-black uppercase text-[#718078] block mb-1">Distance Radius</label>
              <select
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value)}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3 py-2 text-xs font-bold text-[#203128] focus:bg-white focus:outline-none"
              >
                <option value="ALL">Any Distance</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
              </select>
            </div>

            {/* Filter 4: Authorization Status */}
            <div>
              <label className="text-[10px] font-black uppercase text-[#718078] block mb-1">Authorization</label>
              <div className="flex items-center gap-2 pt-1 text-xs font-bold text-[#3F7655]">
                <ShieldCheck className="w-4 h-4" />
                <span>CPCB Verified Only</span>
              </div>
            </div>

          </div>

        </div>

        {/* 2-Column: Map Graphic View + Recycling Point Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Simulated Visual Map Area */}
          <div className="lg:col-span-5 bg-white p-6 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#3F7655]/10">
                <h3 className="text-sm font-black text-[#203128] flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-[#3F7655]" />
                  <span>Interactive Map View</span>
                </h3>
                <span className="text-[10px] font-extrabold text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                  {filteredRecyclers.length} Facilities Found
                </span>
              </div>

              {/* Map Graphic Canvas */}
              <div className="mt-4 h-72 rounded-2xl bg-[#DDEBD8]/40 border border-[#3F7655]/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3F7655_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Map Pins */}
                {filteredRecyclers.map((r, idx) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRecycler(r)}
                    style={{ top: `${20 + (idx * 18) % 60}%`, left: `${15 + (idx * 25) % 70}%` }}
                    className="absolute p-2 bg-[#3F7655] hover:bg-[#244936] text-white rounded-full shadow-lg transition-transform hover:scale-125 cursor-pointer"
                    title={r.companyName}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                ))}

                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-[#3F7655]/20 shadow-sm text-xs font-black text-[#244936] pointer-events-none">
                  Tamil Nadu Recycling Map Grid
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#3F7655]/15 text-xs text-[#718078]">
              <strong className="text-[#203128] font-bold block mb-1">Authorization Notice:</strong>
              All points listed comply with Central Pollution Control Board (CPCB) Extended Producer Responsibility rules.
            </div>
          </div>

          {/* Cards List (Section 4 Specification) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredRecyclers.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-6 rounded-[28px] border border-[#3F7655]/20 shadow-md hover:border-[#3F7655]/50 transition space-y-4"
              >
                
                {/* Header: Name, Distance & Authorization Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-[#203128]">{rec.companyName}</h3>
                      {rec.isAuthorized && (
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Authorized</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#718078] font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
                      <span>{rec.location}</span>
                    </p>
                  </div>

                  <span className="text-xs font-black text-[#3F7655] bg-[#DDEBD8] px-3 py-1 rounded-full self-start sm:self-auto">
                    {rec.distanceKm} km away
                  </span>
                </div>

                {/* Card Details (Section 4 requirements) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  {/* Accepted Waste Types */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#718078]">Accepted Waste Types:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.acceptedCategories.map((cat, cIdx) => (
                        <span key={cIdx} className="px-2 py-0.5 bg-[#F8F5EA] border border-[#3F7655]/15 text-[#203128] rounded-md text-[10px] font-bold">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Operating Hours & Contact */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[#718078]">
                      <Clock className="w-3.5 h-3.5 text-[#3F7655]" />
                      <span className="font-semibold text-[11px]">{rec.operatingHours}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#718078]">
                      <Phone className="w-3.5 h-3.5 text-[#3F7655]" />
                      <span className="font-semibold text-[11px]">{rec.contactPhone}</span>
                    </div>
                  </div>

                </div>

                {/* Footer: View Details Button */}
                <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#718078] font-medium">
                    Reg No: {rec.cpcbRegistrationNo}
                  </span>
                  <button
                    onClick={() => setSelectedRecycler(rec)}
                    className="px-4 py-2 rounded-xl bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Selected Recycler Details Modal */}
        {selectedRecycler && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] border border-[#3F7655]/20 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
              <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                    RECYCLER DETAILS
                  </span>
                  <h3 className="text-xl font-black text-[#203128] mt-1">{selectedRecycler.companyName}</h3>
                </div>
                <button
                  onClick={() => setSelectedRecycler(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs font-semibold text-[#203128]">
                <p><strong>Location:</strong> {selectedRecycler.location}</p>
                <p><strong>Authorization Status:</strong> {selectedRecycler.authorizationStatus}</p>
                <p><strong>Registration No:</strong> {selectedRecycler.cpcbRegistrationNo}</p>
                <p><strong>Contact Person:</strong> {selectedRecycler.contactPerson}</p>
                <p><strong>Phone:</strong> {selectedRecycler.contactPhone}</p>
                <p><strong>Email:</strong> {selectedRecycler.contactEmail}</p>
                <p><strong>Operating Hours:</strong> {selectedRecycler.operatingHours}</p>
                <div>
                  <strong>Accepted Materials:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRecycler.acceptedCategories.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[#F8F5EA] border border-[#3F7655]/15 rounded text-[10px] font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#3F7655]/10 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedRecycler(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedRecycler(null);
                    setActiveView('collector');
                  }}
                  className="px-5 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                >
                  Match Waste Lot with this Recycler →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
