import React, { useState } from 'react';
import { Truck, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Phone, Lock, Mail, MapPin, Building, Shield } from 'lucide-react';
import { structuredEWasteCategories } from '../data/scrapPrices';

export default function SignUpView({ setActiveView, onSignUpSuccess }) {
  const [accountType, setAccountType] = useState('collector'); // 'collector' | 'recycler'
  
  // Collector Form State
  const [collectorName, setCollectorName] = useState('');
  const [collectorPhone, setCollectorPhone] = useState('');
  const [collectorEmail, setCollectorEmail] = useState('');
  const [collectorAddress, setCollectorAddress] = useState('');
  const [collectorPassword, setCollectorPassword] = useState('');
  const [collectorConfirmPassword, setCollectorConfirmPassword] = useState('');

  // Collector OTP verification step state
  const [collectorStep, setCollectorStep] = useState('form'); // 'form' | 'otp' | 'completed'
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Recycler Form State
  const [orgName, setOrgName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [recyclerPhone, setRecyclerPhone] = useState('');
  const [recyclerEmail, setRecyclerEmail] = useState('');
  const [recyclerAddress, setRecyclerAddress] = useState('');
  const [acceptedCategories, setAcceptedCategories] = useState(['Computer Equipment', 'PCB / Electronic Components']);
  const [authorizationDetails, setAuthorizationDetails] = useState('');
  const [recyclerPassword, setRecyclerPassword] = useState('');
  const [recyclerCompleted, setRecyclerCompleted] = useState(false);

  const [formError, setFormError] = useState('');

  // Toggle Category selection for Recycler
  const toggleCategory = (catName) => {
    if (acceptedCategories.includes(catName)) {
      setAcceptedCategories(acceptedCategories.filter(c => c !== catName));
    } else {
      setAcceptedCategories([...acceptedCategories, catName]);
    }
  };

  // Collector Registration Submit
  const handleCollectorSubmit = (e) => {
    e.preventDefault();
    if (!collectorName.trim() || !collectorPhone.trim() || !collectorPassword.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }
    if (collectorPassword !== collectorConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    setFormError('');
    setCollectorStep('otp');
  };

  // Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setFormError('Please enter a 4-digit OTP (Try 1234).');
      return;
    }
    setFormError('');
    setIsOtpVerified(true);
    setCollectorStep('completed');

    onSignUpSuccess({
      role: 'collector',
      user: {
        id: `COL-TN-${Math.floor(100 + Math.random() * 900)}`,
        name: collectorName,
        phone: collectorPhone,
        phone_verified: true,
        email: collectorEmail,
        location: collectorAddress || "Chennai"
      }
    });
  };

  // Recycler Registration Submit
  const handleRecyclerSubmit = (e) => {
    e.preventDefault();
    if (!orgName.trim() || !contactPerson.trim() || !recyclerPhone.trim() || !recyclerPassword.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }
    setFormError('');
    setRecyclerCompleted(true);

    onSignUpSuccess({
      role: 'recycler',
      user: {
        id: `REC-TN-${Math.floor(10 + Math.random() * 90)}`,
        companyName: orgName,
        contactPerson: contactPerson,
        phone: recyclerPhone,
        email: recyclerEmail,
        location: recyclerAddress || "Chennai",
        verificationStatus: "PENDING_VERIFICATION",
        acceptedCategories: acceptedCategories
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 px-4 sm:px-6 lg:px-8 text-[#203128]">
      <div className="max-w-2xl mx-auto space-y-8 bg-white p-8 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#3F7655] text-white mx-auto flex items-center justify-center font-black text-xl shadow-md">
            ♻
          </div>
          <h2 className="text-3xl font-black text-[#203128]">Create an Eco-Link Account</h2>
          <p className="text-xs font-semibold text-[#718078]">
            Select your account type to get started with e-waste recycling.
          </p>
        </div>

        {/* Account Type Selection (Section 6 diagram) */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase text-[#718078] tracking-wider block text-center">
            Select Account Type
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Collector Card */}
            <div
              onClick={() => {
                setAccountType('collector');
                setFormError('');
              }}
              className={`p-6 rounded-[24px] border-2 transition-all cursor-pointer space-y-3 ${
                accountType === 'collector'
                  ? 'border-[#3F7655] bg-[#DDEBD8]/40 shadow-md ring-2 ring-[#3F7655]/20'
                  : 'border-[#3F7655]/15 bg-[#F8F5EA] hover:border-[#3F7655]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#3F7655] text-white flex items-center justify-center font-black">
                  <Truck className="w-5 h-5" />
                </div>
                {accountType === 'collector' && (
                  <CheckCircle2 className="w-5 h-5 text-[#3F7655]" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-[#203128]">COLLECTOR</h3>
                <p className="text-xs font-semibold text-[#718078]">
                  Collect & register E-Waste lots to get benchmark prices and match with recyclers.
                </p>
              </div>
            </div>

            {/* Recycler Card */}
            <div
              onClick={() => {
                setAccountType('recycler');
                setFormError('');
              }}
              className={`p-6 rounded-[24px] border-2 transition-all cursor-pointer space-y-3 ${
                accountType === 'recycler'
                  ? 'border-[#244936] bg-[#244936]/5 shadow-md ring-2 ring-[#244936]/20'
                  : 'border-[#3F7655]/15 bg-[#F8F5EA] hover:border-[#3F7655]/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#244936] text-white flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5 text-[#F2C94C]" />
                </div>
                {accountType === 'recycler' && (
                  <CheckCircle2 className="w-5 h-5 text-[#244936]" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-[#203128]">RECYCLER</h3>
                <p className="text-xs font-semibold text-[#718078]">
                  Recycle E-Waste, post procurement demands, and accept verified lots.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* COLLECTOR REGISTRATION FORM & OTP FLOW */}
        {/* ---------------------------------------------------- */}
        {accountType === 'collector' && (
          <div className="space-y-6 pt-2 border-t border-[#3F7655]/10">
            
            {/* Step 1: Registration Form */}
            {collectorStep === 'form' && (
              <form onSubmit={handleCollectorSubmit} className="space-y-4">
                <h3 className="text-sm font-black uppercase text-[#3F7655] tracking-wider">
                  Collector Registration Form
                </h3>

                <div>
                  <label className="text-xs font-extrabold text-[#203128] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={collectorName}
                    onChange={(e) => setCollectorName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#203128] block mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={collectorPhone}
                      onChange={(e) => setCollectorPhone(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#203128] block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={collectorEmail}
                      onChange={(e) => setCollectorEmail(e.target.value)}
                      placeholder="ramesh@apexscrap.com"
                      className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#203128] block mb-1">Address / Location *</label>
                  <input
                    type="text"
                    required
                    value={collectorAddress}
                    onChange={(e) => setCollectorAddress(e.target.value)}
                    placeholder="Guindy Industrial Estate, Chennai"
                    className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#203128] block mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={collectorPassword}
                      onChange={(e) => setCollectorPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#203128] block mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={collectorConfirmPassword}
                      onChange={(e) => setCollectorConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Phone Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Phone OTP Verification */}
            {collectorStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center mx-auto">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#203128]">Phone Verification</h3>
                <p className="text-xs font-semibold text-[#718078]">
                  Enter the 4-digit verification code sent to <strong className="text-[#203128]">{collectorPhone}</strong>
                </p>

                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full text-center text-2xl font-black tracking-widest bg-[#F8F5EA] border-2 border-[#3F7655]/30 rounded-2xl py-3 text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#718078] block mt-1">Simulated OTP: Use any 4 numbers (e.g. 1234)</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCollectorStep('form')}
                    className="w-1/3 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 rounded-2xl bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Create Account</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Verified & Account Created */}
            {collectorStep === 'completed' && (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#203128]">Account Created ✓</h3>
                <p className="text-xs font-semibold text-[#718078] max-w-sm mx-auto">
                  Your phone number <strong className="text-[#203128]">{collectorPhone}</strong> has been verified. You can now register e-waste lots and receive recycler offers.
                </p>
                <button
                  onClick={() => setActiveView('collector')}
                  className="px-8 py-3.5 rounded-2xl bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to Collector Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* RECYCLER REGISTRATION FORM & PENDING VERIFICATION NOTICE */}
        {/* ---------------------------------------------------- */}
        {accountType === 'recycler' && (
          <div className="space-y-6 pt-2 border-t border-[#3F7655]/10">
            
            {!recyclerCompleted ? (
              <form onSubmit={handleRecyclerSubmit} className="space-y-4">
                <h3 className="text-sm font-black uppercase text-[#244936] tracking-wider">
                  Recycler Registration Form
                </h3>

                <div>
                  <label className="text-xs font-extrabold text-[#203128] block mb-1">Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. GreenCycle Material Recovery Ltd"
                    className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#203128] block mb-1">Contact Person *</label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Dr. K. Senthil Nathan"
                      className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#203128] block mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={recyclerPhone}
                      onChange={(e) => setRecyclerPhone(e.target.value)}
                      placeholder="+91 94441 23456"
                      className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-[#203128] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={recyclerEmail}
                      onChange={(e) => setRecyclerEmail(e.target.value)}
                      placeholder="intake@greencycle.in"
                      className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-[#203128] block mb-1">Facility Location *</label>
                    <input
                      type="text"
                      required
                      value={recyclerAddress}
                      onChange={(e) => setRecyclerAddress(e.target.value)}
                      placeholder="Ambattur Industrial Estate, Chennai"
                      className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Accepted Waste Types Checkboxes */}
                <div>
                  <label className="text-xs font-extrabold text-[#203128] block mb-2">Accepted Waste Types *</label>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 bg-[#F8F5EA] rounded-2xl border border-[#3F7655]/20">
                    {structuredEWasteCategories.map((cat, cIdx) => {
                      const isChecked = acceptedCategories.includes(cat.name);
                      return (
                        <label key={cIdx} className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategory(cat.name)}
                            className="rounded text-[#3F7655] focus:ring-[#3F7655]"
                          />
                          <span className="text-[#203128]">{cat.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#203128] block mb-1">Authorization Details (CPCB / TNPCB Reg. No.)</label>
                  <input
                    type="text"
                    value={authorizationDetails}
                    onChange={(e) => setAuthorizationDetails(e.target.value)}
                    placeholder="TN-EPR-2026-8821"
                    className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#203128] block mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={recyclerPassword}
                    onChange={(e) => setRecyclerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl px-4 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                  />
                </div>

                {/* Section 6 Recycler Status Note */}
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Notice: Recycler account will remain <strong>Pending Verification</strong> until admin review.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#244936] hover:bg-[#14291E] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#F2C94C]" />
                  <span>Submit Recycler Registration</span>
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#203128]">Registration Submitted ⏳</h3>
                <p className="text-xs font-semibold text-[#718078] max-w-sm mx-auto leading-relaxed">
                  Your recycler registration for <strong className="text-[#203128]">{orgName}</strong> is created with status:
                </p>
                <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full border border-amber-300">
                  ⏳ Pending Admin Verification
                </div>
                <p className="text-[11px] text-[#718078] max-w-sm mx-auto">
                  You can explore the Recycler Dashboard immediately in preview mode.
                </p>
                <button
                  onClick={() => setActiveView('recycler')}
                  className="px-8 py-3.5 rounded-2xl bg-[#244936] hover:bg-[#14291E] text-white font-extrabold text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Go to Recycler Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-[#3F7655]/10">
          <p className="text-xs font-semibold text-[#718078]">
            Already have an account?{' '}
            <button
              onClick={() => setActiveView('login')}
              className="font-extrabold text-[#3F7655] hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
