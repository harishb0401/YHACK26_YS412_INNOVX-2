import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, ArrowRight, Truck, ShieldCheck, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function SignupForm({ onSignupSuccess, onSwitchToLogin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [signupRole, setSignupRole] = useState('collector'); // 'collector' | 'recycler'
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !signupPhone.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMessage(t('fillAllRequired') || 'Please fill out all required fields.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage(t('passwordsDoNotMatch') || 'Passwords do not match.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage(t('accountCreatedRedirecting') || 'Account created successfully! Redirecting...');

    const userPayload = {
      role: signupRole,
      identifier: signupPhone || signupEmail,
      name: fullName,
      phone_verified: true
    };

    if (onSignupSuccess) {
      onSignupSuccess(userPayload);
    }

    setTimeout(() => {
      if (signupRole === 'collector') {
        navigate('/collector/dashboard');
      } else {
        navigate('/recycler/dashboard');
      }
    }, 1000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Title & Subtitle */}
      <div className="text-center space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-[#203128]">{t('createYourAccount')}</h3>
        <p className="text-xs font-semibold text-[#718078]">
          {t('joinEcosystem')}
        </p>
      </div>

      {/* Role selection / Account Type */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-[#718078] tracking-wider block">
          {t('accountType')}
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setSignupRole('collector')}
            className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
              signupRole === 'collector'
                ? 'bg-[#DDEBD8]/50 border-[#3F7655] ring-1 ring-[#3F7655]'
                : 'bg-[#F8F5EA] border-[#3F7655]/15 hover:bg-[#DDEBD8]/30'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                signupRole === 'collector' ? 'bg-[#3F7655] text-white' : 'bg-white text-[#3F7655]'
              }`}>
                <Truck className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-black text-[#203128] block">{t('collectorRole')}</span>
                <span className="text-[10px] text-[#718078] block">{t('registerLotsAndEarn') || 'Register lots & earn'}</span>
              </div>
            </div>
            {signupRole === 'collector' && <Check className="w-4 h-4 text-[#3F7655]" />}
          </button>

          <button
            type="button"
            onClick={() => setSignupRole('recycler')}
            className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
              signupRole === 'recycler'
                ? 'bg-[#244936]/10 border-[#244936] ring-1 ring-[#244936]'
                : 'bg-[#F8F5EA] border-[#3F7655]/15 hover:bg-[#DDEBD8]/30'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                signupRole === 'recycler' ? 'bg-[#244936] text-white' : 'bg-white text-[#244936]'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-[#F2C94C]" />
              </div>
              <div>
                <span className="text-xs font-black text-[#203128] block">{t('recyclerRole')}</span>
                <span className="text-[10px] text-[#718078] block">{t('procureAndRecycle') || 'Procure & recycle'}</span>
              </div>
            </div>
            {signupRole === 'recycler' && <Check className="w-4 h-4 text-[#244936]" />}
          </button>
        </div>
      </div>

      {/* Error / Success Notifications */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="text-xs font-extrabold text-[#203128] block mb-1">
            {t('fullName')} *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              {t('phoneNumber')} *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              {t('emailAddress')} *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              {t('password')} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              {t('confirmPassword')} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-3"
        >
          <span>{t('createAccountBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2">
        <p className="text-xs font-semibold text-[#718078]">
          {t('alreadyHaveAccount')}{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-extrabold text-[#3F7655] hover:underline cursor-pointer ml-1"
          >
            {t('navLogin')}
          </button>
        </p>
      </div>
    </div>
  );
}
