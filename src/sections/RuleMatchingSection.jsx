import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Tag, Scale, MapPin, Cpu, Sliders, ArrowRight, Play, Sparkles } from 'lucide-react';
import { verifiedRecyclersList, categoriesList, evaluateRecyclerMatch } from '../mockData';

export default function RuleMatchingSection({ setActiveView }) {
  // Simulator State
  const [selectedCategory, setSelectedCategory] = useState("IT & Telecommunications");
  const [wasteWeight, setWasteWeight] = useState(380);
  const [wasteDistance, setWasteDistance] = useState(15);
  const [selectedRecyclerId, setSelectedRecyclerId] = useState("REC-401");

  const selectedRecycler = verifiedRecyclersList.find(r => r.id === selectedRecyclerId) || verifiedRecyclersList[0];

  const simulatedWasteItem = {
    category: selectedCategory,
    weight: Number(wasteWeight),
    distanceKm: Number(wasteDistance)
  };

  const evaluation = evaluateRecyclerMatch(simulatedWasteItem, selectedRecycler);

  return (
    <section className="py-20 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wider uppercase mb-3 border border-emerald-200">
            <Sliders className="w-3.5 h-3.5" /> Deterministic Matching Engine
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Rule-Based Recycler Assignment
          </h2>
          <p className="text-base text-slate-600 mt-3 leading-relaxed">
            ECO-Link uses strict, verifiable business rules to automatically match logged electronic waste batches with licensed, available recyclers in proximity.
          </p>
        </div>

        {/* Grid Layout: Visual Rules Explanation + Live Interactive Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Visual Rules Criteria List */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                5-Point Rule Validation Criteria
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every transaction must satisfy 100% of the following hard parameters before a recycler is granted access to accept the e-waste manifest.
              </p>

              <div className="space-y-3 pt-2">
                
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Waste Category Match</h4>
                    <p className="text-xs text-slate-500">Recycler must hold active license for specific waste classification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Recycler Verification</h4>
                    <p className="text-xs text-slate-500">Facility must possess active R2v3, e-Stewards, or EPA state accreditation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Recycler Capacity</h4>
                    <p className="text-xs text-slate-500">Unused monthly intake quota must exceed total batch mass.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Distance Limit</h4>
                    <p className="text-xs text-slate-500">Transit distance must remain within eco-radius limits (&lt; 50 km).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Processing Capability</h4>
                    <p className="text-xs text-slate-500">Facility possesses required recovery tech & safety isolation setup.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Matching Simulator Panel */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6 relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold text-white tracking-tight">Interactive Matching Engine Simulator</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-1 rounded-md">
                  Rule Evaluation Active
                </span>
              </div>

              {/* Simulation Controls Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Waste Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
                  >
                    {categoriesList.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Select Target Recycler</label>
                  <select
                    value={selectedRecyclerId}
                    onChange={(e) => setSelectedRecyclerId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
                  >
                    {verifiedRecyclersList.map((rec) => (
                      <option key={rec.id} value={rec.id}>{rec.companyName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Batch Weight ({wasteWeight} kg)</label>
                  <input
                    type="range"
                    min="50"
                    max="35000"
                    step="50"
                    value={wasteWeight}
                    onChange={(e) => setWasteWeight(e.target.value)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>50 kg</span>
                    <span>35,000 kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Transit Distance ({wasteDistance} km)</label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={wasteDistance}
                    onChange={(e) => setWasteDistance(e.target.value)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>5 km</span>
                    <span>120 km (Limit: 50km)</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Live Check Results Panel */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
                  Live Rule Check Verdict
                </h4>

                <div className="space-y-2">
                  {evaluation.checks.map((chk, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-900/60">
                      <span className="flex items-center gap-2 text-slate-300">
                        {chk.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="font-medium">{chk.name}</span>
                      </span>
                      <span className={`font-mono text-[11px] ${chk.passed ? 'text-emerald-400 font-semibold' : 'text-rose-400'}`}>
                        {chk.passed ? '✓ ' + chk.detail : '✕ Failed (' + chk.detail + ')'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Final Status Box */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Evaluation Outcome:</span>
                  {evaluation.isEligible ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Eligible Recycler ✓</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-sm">
                      <XCircle className="w-4 h-4" />
                      <span>Not Eligible (Rule Disqualified)</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
