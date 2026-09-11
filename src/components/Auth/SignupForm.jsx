import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, ArrowRight, Truck, ShieldCheck, Check, AlertCircle, CheckCircle2, Loader2, Building } from 'lucide-react';
import authService from '../../services/authService';

export default function SignupForm({ onSignupSuccess, onSwitchToLogin }) {
  const navigate = useNavigate();
  const [signupRole, setSignupRole] = useState('collector'); // 'collector' | 'recycler'
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !signupPhone.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await authService.register({
        fullName: fullName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        password: signupPassword,
        role: signupRole,
        organizationName: signupRole === 'recycler' ? (organizationName.trim() || fullName.trim()) : undefined,
        locationText: 'Chennai Hub'
      });

      setSuccessMessage('Account created successfully! Redirecting...');

      if (onSignupSuccess) {
        onSignupSuccess(user);
      }

      setTimeout(() => {
        if (signupRole === 'collector') {
          navigate('/collector/dashboard');
        } else {
          navigate('/recycler/dashboard');
        }
      }, 800);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Title & Subtitle */}
      <div className="text-center space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-[#203128]">Create Your Account</h3>
        <p className="text-xs font-semibold text-[#718078]">
          Join the Eco-Link e-waste ecosystem
        </p>
      </div>

      {/* Role selection / Account Type */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-[#718078] tracking-wider block">
          Account Type
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
                <span className="text-xs font-black text-[#203128] block">Collector</span>
                <span className="text-[10px] text-[#718078] block">Register lots & earn</span>
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
                <span className="text-xs font-black text-[#203128] block">Recycler</span>
                <span className="text-[10px] text-[#718078] block">Procure & recycle</span>
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
            {signupRole === 'recycler' ? 'Contact Person Name *' : 'Full Name *'}
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

        {signupRole === 'recycler' && (
          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              Company / Facility Name *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. GreenCycle Recovery Ltd"
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              Phone Number *
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
              Email Address *
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
              Password *
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
              Confirm Password *
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
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-[#3F7655] hover:bg-[#244936] disabled:opacity-60 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2">
        <p className="text-xs font-semibold text-[#718078]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-extrabold text-[#3F7655] hover:underline cursor-pointer ml-1"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
