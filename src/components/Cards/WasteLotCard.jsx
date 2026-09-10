import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, MapPin, Scale, Clock, ArrowRight } from 'lucide-react';
import StatusBadge from '../StatusBadge';

export default function WasteLotCard({ lot, onViewDetails, onOpenOffers }) {
  if (!lot) return null;

  const lotId = lot.id;
  const qty = lot.quantity || lot.totalWeightKg || 1;
  const unit = lot.unit || 'kg';
  const val = lot.agreedTotalValue || lot.estimatedLotValue || (qty * (lot.benchmarkPrice || 350));

  return (
    <div className="bg-white p-5 rounded-3xl border border-[#3F7655]/20 shadow-sm hover:shadow-md hover:border-[#3F7655]/40 transition flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
              {lot.category}
            </span>
            <h3 className="text-base font-black text-[#203128] mt-1.5">{lot.material || lot.category}</h3>
            <span className="text-xs font-mono font-bold text-[#718078]">{lot.id}</span>
          </div>
          <StatusBadge status={lot.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-[#718078]">
          <div className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#3F7655]" />
            <span>Quantity: <strong className="text-[#203128]">{qty} {unit}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#3F7655]" />
            <span>Date: <strong className="text-[#203128]">{lot.createdDate || "Recent"}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
            <span className="truncate">Node: <strong className="text-[#203128]">{lot.location || "Chennai SIDCO Hub"}</strong></span>
          </div>
        </div>

        <div className="mt-3 p-2.5 bg-[#FAF8F2] rounded-xl flex items-center justify-between text-xs font-black">
          <span className="text-[#718078]">Fair Benchmark:</span>
          <span className="text-[#3F7655]">₹{lot.benchmarkPrice || 350}/{unit} (₹{val.toLocaleString()})</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-[#3F7655]/10">
        <Link
          to={`/collector/waste-lots/${lot.id}`}
          className="flex-1 py-2 text-center text-xs font-bold text-[#244936] bg-[#DDEBD8]/50 hover:bg-[#DDEBD8] rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Lot Details</span>
        </Link>

        {onOpenOffers && (
          <button
            onClick={() => onOpenOffers(lot)}
            className="px-3 py-2 text-xs font-black text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl transition flex items-center gap-1 cursor-pointer shadow-sm"
          >
            <span>Offers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
