import React, { useState, useEffect } from 'react';
import { Building, ShieldCheck, Phone, Mail, MapPin, CheckCircle2, Edit3, Save, Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import authService from '../../services/authService';
import recyclerService from '../../services/recyclerService';

export default function RecyclerProfile({ currentUser, onProfileUpdated }) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    companyName: currentUser?.recyclerProfile?.facilityName || currentUser?.recyclerProfile?.companyName || currentUser?.organizationName || currentUser?.fullName || '',
    cpcbRegistrationNo: currentUser?.recyclerProfile?.cpcbRegistrationNo || currentUser?.recyclerProfile?.cpcbRegistrationNumber || currentUser?.recyclerProfile?.registrationNumber || '',
    contactPerson: currentUser?.fullName || currentUser?.name || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || currentUser?.address || currentUser?.recyclerProfile?.facilityAddress || '',
    email: currentUser?.email || '',
    isVerified: currentUser?.recyclerProfile?.status === 'VERIFIED' || currentUser?.recyclerProfile?.isVerified || false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const [freshUser, recRes] = await Promise.all([
          authService.fetchCurrentUser().catch(() => null),
          recyclerService.getProfile().catch(() => null)
        ]);

        if (isMounted) {
          const recData = recRes?.data || freshUser?.recyclerProfile || {};
          const userObj = freshUser || currentUser || {};
          setProfile({
            companyName: recData.facilityName || recData.companyName || recData.organizationName || userObj.fullName || '',
            cpcbRegistrationNo: recData.cpcbRegistrationNo || recData.cpcbRegistrationNumber || recData.registrationNumber || '',
            contactPerson: userObj.fullName || userObj.name || recData.contactPerson || '',
            phone: userObj.phone || recData.phone || '',
            location: userObj.location || userObj.address || recData.facilityAddress || recData.location || '',
            email: userObj.email || '',
            isVerified: recData.cpcbStatus === 'VERIFIED' || recData.isVerified || recData.status === 'VERIFIED' || false
          });
        }
      } catch (err) {
        console.warn('Could not load live recycler profile:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfileData();
    return () => { isMounted = false; };
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Update recycler facility details
      await recyclerService.updateProfile({
        facilityName: profile.companyName,
        organizationName: profile.companyName,
        cpcbRegistrationNo: profile.cpcbRegistrationNo,
        cpcbRegistrationNumber: profile.cpcbRegistrationNo,
        facilityAddress: profile.location,
        location: profile.location,
        phone: profile.phone,
        fullName: profile.contactPerson,
        contactPerson: profile.contactPerson
      });

      // 2. Update user profile
      const updatedUser = await authService.updateProfile({
        fullName: profile.contactPerson,
        phone: profile.phone,
        location: profile.location
      });

      if (onProfileUpdated && updatedUser) {
        onProfileUpdated(updatedUser);
      }

      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    const src = profile.companyName || profile.contactPerson || profile.email || 'RC';
    const parts = src.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return src.slice(0, 2).toUpperCase();
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
              {getInitials()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#203128]">{profile.companyName || profile.contactPerson || 'Recycler Facility'}</h2>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  profile.isVerified 
                    ? 'text-emerald-800 bg-emerald-100' 
                    : 'text-amber-800 bg-amber-100'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  {profile.isVerified ? t('recStatusVERIFIED') : 'Pending Verification'}
                </span>
              </div>
              <p className="text-xs text-[#718078] mt-0.5">
                Reg No: {profile.cpcbRegistrationNo ? profile.cpcbRegistrationNo : '—'}
              </p>
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
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                placeholder="Facility / Company Name"
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('cpcbTnpcbReg')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.cpcbRegistrationNo}
                onChange={(e) => setProfile({ ...profile, cpcbRegistrationNo: e.target.value })}
                placeholder="CPCB / TNPCB Reg Number"
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
                value={profile.contactPerson}
                onChange={(e) => setProfile({ ...profile, contactPerson: e.target.value })}
                placeholder="Contact Person Full Name"
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('phoneNumber')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="Phone Number"
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('storageLocationHub')}</label>
            <input
              type="text"
              disabled={!isEditing}
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="Facility Address / Location"
              className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
            />
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-2xl font-black text-xs shadow transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving...' : t('save')}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
