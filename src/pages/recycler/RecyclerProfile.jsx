import React, { useState } from 'react';
import { Building, ShieldCheck, Phone, Mail, MapPin, CheckCircle2, Edit3, Save } from 'lucide-react';
import { mockRecycler } from '../../data/mockData';
import { useTranslation } from '../../i18n';

export default function RecyclerProfile({ recyclerProfile = mockRecycler }) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(recyclerProfile || mockRecycler);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">{t('navProfile')}</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          {t('cpcbVerifLayerSub')}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{t('save')} ✓</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3F7655]/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F2C94C] text-[#244936] flex items-center justify-center font-black text-2xl shadow-sm">
              GC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#203128]">{profile.companyName || 'GreenCycle Material Recovery Ltd'}</h2>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {t('recStatusVERIFIED')}
                </span>
              </div>
              <p className="text-xs text-[#718078] mt-0.5">Reg No: {profile.cpcbRegistrationNo || 'TN-EPR-2026-8821'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#F8F5EA] hover:bg-[#DDEBD8] text-[#244936] border border-[#3F7655]/20 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? t('cancel') : t('editPrice')}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('accountType')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.companyName || ''}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('cpcbTnpcbReg')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.cpcbRegistrationNo || ''}
                onChange={(e) => setProfile({ ...profile, cpcbRegistrationNo: e.target.value })}
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('fullName')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.contactPerson || 'Dr. K. Senthil Nathan'}
                onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('phoneNumber')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.phone || '+91 94441 23456'}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('storageLocationHub')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.location || 'Ambattur Industrial Estate, Chennai'}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-2xl font-black text-xs shadow transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t('save')}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
