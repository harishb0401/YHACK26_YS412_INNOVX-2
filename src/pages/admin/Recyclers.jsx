import React, { useState } from 'react';
import { Search, ShieldCheck, Building, CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';
import { mockRecyclers } from '../../data/mockData';
import { useTranslation } from '../../i18n';

export default function Recyclers({ recyclers = mockRecyclers }) {
  const { t, tCategory } = useTranslation();
  const [recyclerList, setRecyclerList] = useState(recyclers || mockRecyclers);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = recyclerList.filter(r =>
    (r.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.cpcbRegistrationNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStatus = (id, newStatus) => {
    setRecyclerList(recyclerList.map(r => 
      r.id === id ? { ...r, verificationStatus: newStatus } : r
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">{t('adminRecyclersTitle')}</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          {t('verifyCpcbLicenses')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-[28px] border border-[#3F7655]/20 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#3F7655] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search')}
            className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Recyclers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((r) => {
          const isVerified = r.verificationStatus === 'VERIFIED';

          return (
            <div
              key={r.id}
              className="bg-white p-6 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#3F7655]/10 pb-3">
                  <div>
                    <h3 className="text-base font-black text-[#203128]">{r.companyName}</h3>
                    <p className="text-xs text-[#718078] mt-0.5">{r.location}</p>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isVerified ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                    {isVerified ? t('recStatusVERIFIED') : t('recStatusPENDING')}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <p><strong>{t('cpcbRegNoLabel')}:</strong> <span className="font-mono text-[11px]">{r.cpcbRegistrationNo}</span></p>
                  <p><strong>{t('contactPersonLabel')}:</strong> {r.contactPerson} ({r.phone})</p>
                  <p><strong>{t('monthlyCapacityLabel')}:</strong> {(r.capacityMonthlyKg || 50000).toLocaleString()} kg / mo</p>
                  <div>
                    <strong className="block mb-1">{t('acceptedCategoriesLabel')}:</strong>
                    <div className="flex flex-wrap gap-1">
                      {(r.acceptedCategories || []).map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 bg-[#F8F5EA] border border-[#3F7655]/15 rounded text-[10px] font-bold">
                          {tCategory(cat)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#3F7655]/10 flex items-center justify-end gap-2">
                {isVerified ? (
                  <button
                    onClick={() => updateStatus(r.id, 'SUSPENDED')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer"
                  >
                    {t('suspendAccountBtn')}
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(r.id, 'VERIFIED')}
                    className="px-4 py-1.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    {t('approveVerificationBtn')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
