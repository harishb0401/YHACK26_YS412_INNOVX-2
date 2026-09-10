import React, { useState } from 'react';
import { 
  LayoutDashboard, PlusCircle, Package, Truck, Award, TrendingUp, 
  User, Calendar, Search, Filter, Eye, ArrowUpRight, ShieldCheck, CheckCircle2, Clock
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function CollectorDashboard({ 
  ewasteList, 
  onOpenAddWasteModal, 
  onTrackItem, 
  setActiveView 
}) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Sidebar Items
  const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Add E-Waste', icon: PlusCircle, action: onOpenAddWasteModal },
    { name: 'My Waste', icon: Package },
    { name: 'Recycler Requests', icon: ShieldCheck },
    { name: 'Pickup Schedule', icon: Calendar },
    { name: 'Tracking', icon: Truck, action: () => setActiveView('tracking') },
    { name: 'Certificates', icon: Award },
    { name: 'Impact', icon: TrendingUp },
    { name: 'Profile', icon: User },
  ];

  // Dashboard Summary Numbers
  const totalSubmitted = ewasteList.length;
  const wastePending = ewasteList.filter(w => w.status === 'Pending' || w.status === 'Matched').length;
  const wasteInTransit = ewasteList.filter(w => w.status === 'In Transit' || w.status === 'Pickup Scheduled').length;
  const wasteRecycled = ewasteList.filter(w => w.status === 'Recycled').length;

  // Filter Table Records
  const filteredList = ewasteList.filter(item => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.recycler?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* Sidebar Container */}
      <aside className="w-full lg:w-64 bg-slate-900 text-slate-300 p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          
          {/* Collector Organization Info */}
          <div className="pb-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center">
              AP
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Apex Logistics</h4>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Verified Collector ✓
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarItems.map((item, idx) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.name);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? 'bg-emerald-600 text-white font-semibold shadow' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          Logged in as: <span className="text-slate-300 font-mono">COL-8821</span>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-x-hidden">
        
        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Collector Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage e-waste manifests, track active pickups, and view certified recycling proofs.
            </p>
          </div>

          <button
            onClick={onOpenAddWasteModal}
            className="px-5 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New E-Waste</span>
          </button>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Waste Submitted</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">{totalSubmitted}</span>
              <span className="text-xs text-slate-400 font-mono">Manifests</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">All logged e-waste items</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block">Waste Pending</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-600">{wastePending}</span>
              <span className="text-xs text-amber-600/70 font-mono">Awaiting</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Rule matching / pending assignment</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider block">Waste In Transit</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-purple-600">{wasteInTransit}</span>
              <span className="text-xs text-purple-600/70 font-mono">En Route</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Freight scheduled or on road</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">Waste Recycled</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-emerald-600">{wasteRecycled}</span>
              <span className="text-xs text-emerald-600/70 font-mono">Completed</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Verified recycling proof issued</p>
          </div>

        </div>

        {/* E-Waste Table Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">E-Waste Collection Manifests</h3>
              <p className="text-xs text-slate-500">List of registered electronic waste shipments and assigned recyclers</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Tracking ID, waste, recycler..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Tracking ID</th>
                  <th className="py-3.5 px-4">Waste Type</th>
                  <th className="py-3.5 px-4">Weight (kg)</th>
                  <th className="py-3.5 px-4">Assigned Recycler</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Tracking ID */}
                    <td className="py-4 px-6 font-mono font-bold text-emerald-700">
                      {item.id}
                    </td>

                    {/* Waste Type & Category */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{item.wasteType}</div>
                      <div className="text-[11px] text-slate-500">{item.category}</div>
                    </td>

                    {/* Weight */}
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {item.weight} kg
                    </td>

                    {/* Recycler */}
                    <td className="py-4 px-4">
                      {item.recycler ? (
                        <div>
                          <div className="font-semibold text-slate-900">{item.recycler.name}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">Verified Facility ✓</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Rule Matching...</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 font-mono">
                      {item.date}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onTrackItem(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </main>
    </div>
  );
}
