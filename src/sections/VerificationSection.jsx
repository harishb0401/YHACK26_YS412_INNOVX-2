import React from 'react';
import { ShieldCheck, MapPin, Scale, Award, Building2, CheckCircle2, Factory } from 'lucide-react';
import { verifiedRecyclersList, verifiedCollectorsList } from '../mockData';

export default function VerificationSection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-3 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Network Directory
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Accredited Recyclers & Verified Collectors
          </h2>
          <p className="text-base text-slate-600 mt-3">
            Every entity on the ECO-Link platform undergoes rigorous identity, EPA license, and facility audit verification before handling e-waste manifests.
          </p>
        </div>

        {/* Recyclers Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Factory className="w-5 h-5 text-emerald-600" />
            Verified Recycler Facilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedRecyclersList.map((rec) => (
              <div 
                key={rec.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Recycler ✓
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">{rec.id}</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 leading-snug">{rec.companyName}</h4>
                  
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {rec.location}
                  </p>

                  {/* Supported Categories Badges */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Supported Categories:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.supportedCategories.map((cat, cIdx) => (
                        <span key={cIdx} className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specs Box */}
                <div className="pt-4 border-t border-slate-100 space-y-2 bg-slate-50/70 p-3.5 rounded-2xl">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Processing Capacity:</span>
                    <span className="font-bold text-slate-900">{rec.processingCapacity}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Registration Number:</span>
                    <span className="font-mono text-slate-700 font-semibold">{rec.registrationNumber}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Recovery Efficiency:</span>
                    <span className="font-bold text-emerald-600">{rec.recoveryEfficiency}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collectors Grid */}
        <div className="mt-14 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Verified Regional Collector Organizations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {verifiedCollectorsList.map((col) => (
              <div 
                key={col.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{col.companyName}</h4>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Verified Collector ✓
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {col.location}
                  </p>
                  <p className="text-xs font-mono text-slate-400">Reg #: {col.registrationNumber}</p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-lg font-extrabold text-slate-900 block">{col.totalPickups} Pickups</span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 sm:justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Compliant
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
