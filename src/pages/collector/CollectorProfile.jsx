import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, CheckCircle2, ShieldCheck, AlertCircle, Edit3, Save, Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n';
import authService from '../../services/authService';

export default function CollectorProfile({ currentUser = null, collectorProfile = null, onProfileUpdated = null }) {
  const { t } = useTranslation();
  const initialUser = currentUser || collectorProfile || authService.getCurrentUser() || {};
  
  const [profile, setProfile] = useState({
    fullName: initialUser.fullName || initialUser.name || '',
    name: initialUser.fullName || initialUser.name || '',
    company: initialUser.company || initialUser.facility_name || '',
    phone: initialUser.phone || '',
    email: initialUser.email || '',
    location: initialUser.location || initialUser.address || '',
    phone_verified: !!initialUser.phone_verified || !!initialUser.phone
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch fresh profile from database on mount
  useEffect(() => {
    let isMounted = true;
    async function loadFreshProfile() {
      try {
        const freshUser = await authService.fetchCurrentUser();
        if (isMounted && freshUser) {
          setProfile({
            fullName: freshUser.fullName || freshUser.name || '',
            name: freshUser.fullName || freshUser.name || '',
            company: freshUser.company || freshUser.facility_name || '',
            phone: freshUser.phone || '',
            email: freshUser.email || '',
            location: freshUser.location || freshUser.address || '',
            phone_verified: !!freshUser.phone_verified || !!freshUser.phone
          });
        }
      } catch (err) {
        console.warn('Could not refresh profile from server:', err.message);
      }
    }
    loadFreshProfile();
    return () => { isMounted = false; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    try {
      const updatedUser = await authService.updateProfile({
        fullName: profile.fullName || profile.name,
        name: profile.fullName || profile.name,
        phone: profile.phone,
        location: profile.location
      });

      if (updatedUser) {
        setProfile({
          fullName: updatedUser.fullName || updatedUser.name || '',
          name: updatedUser.fullName || updatedUser.name || '',
          company: updatedUser.company || updatedUser.facility_name || '',
          phone: updatedUser.phone || '',
          email: updatedUser.email || '',
          location: updatedUser.location || updatedUser.address || '',
          phone_verified: !!updatedUser.phone_verified || !!updatedUser.phone
        });

        if (onProfileUpdated) {
          onProfileUpdated(updatedUser);
        }
      }

      setIsEditing(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = profile.fullName || profile.name || profile.email || '—';
  const displayInitials = displayName !== '—'
    ? displayName.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">{t('navProfile')}</h1>
        <p className="text-xs sm:text-sm text-[#718078]">
          {t('collectorProfileSubtitle')}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{t('profileSavedMsg')}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white p-6 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-8">
        
        {/* User Identity Top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3F7655]/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#DDEBD8] text-[#244936] flex items-center justify-center font-black text-2xl shadow-sm">
              {displayInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-[#203128]">{displayName}</h2>
                {profile.phone_verified && (
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {t('verifiedCollectorBadge')}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#718078] mt-0.5">{profile.company || profile.location || 'Individual Collector'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-[#F8F5EA] hover:bg-[#DDEBD8] text-[#244936] border border-[#3F7655]/20 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? t('cancel') : t('editPrice')}</span>
          </button>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('fullName')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.fullName || profile.name || ''}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value, name: e.target.value })}
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('emailAddress')}</label>
              <input
                type="email"
                disabled={true}
                value={profile.email || ''}
                className="w-full bg-[#F8F5EA] opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('phoneNumber')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-extrabold text-[#203128] block mb-1">{t('storageLocationHub')}</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="e.g. Guindy, Chennai"
                className="w-full bg-[#F8F5EA] disabled:opacity-80 border border-[#3F7655]/20 rounded-2xl px-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#3F7655] hover:bg-[#244936] text-white rounded-2xl font-black text-xs shadow transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('save')}</span>
                </>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
