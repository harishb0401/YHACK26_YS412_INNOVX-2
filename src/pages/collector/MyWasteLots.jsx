import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Package, ArrowRight } from 'lucide-react';
import WasteLotCard from '../../components/Cards/WasteLotCard';
import { mockWasteLots } from '../../data/mockData';

export default function MyWasteLots({ materialLots = mockWasteLots }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const lots = materialLots || mockWasteLots;

  const filteredLots = lots.filter((lot) => {
    const matchesSearch = (lot.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lot.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lot.material || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">My Waste Lots</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Manage your registered digital e-waste lots and track their live verification progress.
          </p>
        </div>

        <button
          onClick={() => navigate('/collector/register-waste')}
          className="px-5 py-3 bg-[#3F7655] hover:bg-[#244936] text-white rounded-2xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Lot</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lot ID or material..."
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'REGISTERED', 'MATCHED', 'DISPATCHED', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#3F7655] text-white shadow-sm'
                  : 'bg-[#F8F5EA] text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]'
              }`}
            >
              {status === 'ALL' ? 'All Lots' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Waste Lots */}
      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLots.map((lot) => (
            <WasteLotCard
              key={lot.id}
              lot={lot}
              onViewDetails={() => navigate(`/collector/waste-lots/${lot.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[32px] border border-[#3F7655]/20 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center mx-auto font-black text-xl">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[#203128]">No Waste Lots Found</h3>
          <p className="text-xs text-[#718078] max-w-sm mx-auto">
            Try adjusting your search criteria or register a new material lot to start receiving recycler offers.
          </p>
          <button
            onClick={() => navigate('/collector/register-waste')}
            className="px-6 py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl font-bold text-xs shadow transition cursor-pointer"
          >
            Register Waste Lot Now
          </button>
        </div>
      )}
    </div>
  );
}
