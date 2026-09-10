import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Award, CheckCircle2, Clock } from 'lucide-react';

export default function RecyclerCard({ recycler, onSelect, showActions = true }) {
  if (!recycler) return null;

  const isVerified = recycler.verificationStatus === 'VERIFIED';

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#3F7655]/20 shadow-sm hover:shadow-md transition space-y-4">
      <div className="flex items-start justify-between gap-3 border-b border-[#3F7655]/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-[#203128]">{recycler.companyName}</h3>
            {isVerified && (
              <span className="text-[10px] font-extrabold bg-[#244936] text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-[#F2C94C]" /> CPCB Verified
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-[#718078] mt-0.5">{recycler.contactPerson || "Authorized Facility Manager"}</p>
          <span className="text-[11px] font-mono text-slate-500">{recycler.cpcbRegistrationNo}</span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200">
            ★ {recycler.rating || 4.9}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-xs font-semibold text-[#718078]">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
          <span>{recycler.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#3F7655]" />
          <span>{recycler.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-[#3F7655]" />
          <span>{recycler.email}</span>
        </div>
      </div>

      <div className="pt-2">
        <span className="text-[10px] font-extrabold uppercase text-[#718078] block mb-1.5">Authorized Materials</span>
        <div className="flex flex-wrap gap-1.5">
          {(recycler.acceptedCategories || []).map((cat, idx) => (
            <span key={idx} className="text-[10px] font-bold bg-[#FAF8F2] text-[#244936] px-2.5 py-1 rounded-lg border border-[#3F7655]/15">
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
