import React, { useState } from 'react';
import { Lock, Phone, Mail, ArrowRight, ShieldCheck, Truck, Shield, AlertCircle } from 'lucide-react';

export default function LoginView({ setActiveView, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('collector');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter your phone number/email and password.');
      return;
    }

    setErrorMessage('');
    
    // Call handler to authenticate and set active user role
    onLoginSuccess({
      role: selectedRole,
      identifier: identifier,
      name: selectedRole === 'collector' ? 'Ramesh Kumar' : selectedRole === 'recycler' ? 'GreenCycle Recovery' : 'System Admin'
    });

    // Redirect to corresponding dashboard based on Section 5 specification
    if (selectedRole === 'collector') {
      setActiveView('collector');
    } else if (selectedRole === 'recycler') {
      setActiveView('recycler');
    } else if (selectedRole === 'admin') {
      setActiveView('admin');
    }
  };

  const handleQuickRoleLogin = (role) => {
    setSelectedRole(role);
    onLoginSuccess({
      role: role,
      identifier: role === 'collector' ? '+91 98401 23456' : role === 'recycler' ? 'procurement@greencycle.in' : 'admin@ecolink.gov.in',
      name: role === 'collector' ? 'Ramesh Kumar' : role === 'recycler' ? 'GreenCycle Recovery' : 'System Admin'
    });

    if (role === 'collector') setActiveView('collector');
    else if (role === 'recycler') setActiveView('recycler');
    else if (role === 'admin') setActiveView('admin');
  };

  return (
    <div className="min-h-screen bg-[#F8F5EA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#203128]">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-[32px] border border-[#3F7655]/20 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#3F7655] text-white mx-auto flex items-center justify-center font-black text-xl shadow-md">
            ♻
          </div>
          <h2 className="text-2xl font-black text-[#203128]">Sign In to Eco-Link</h2>
          <p className="text-xs font-semibold text-[#718078]">
            Access your verified Collector, Recycler, or Admin portal.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-[#718078] tracking-wider block">
            Select Account Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('collector')}
              className={`py-2.5 px-2 text-xs font-extrabold rounded-2xl border transition flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === 'collector'
                  ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-md'
                  : 'bg-[#F8F5EA] text-[#203128] border-[#3F7655]/15 hover:bg-[#DDEBD8]'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Collector</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('recycler')}
              className={`py-2.5 px-2 text-xs font-extrabold rounded-2xl border transition flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === 'recycler'
                  ? 'bg-[#244936] text-white border-[#244936] shadow-md'
                  : 'bg-[#F8F5EA] text-[#203128] border-[#3F7655]/15 hover:bg-[#DDEBD8]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#F2C94C]" />
              <span>Recycler</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2.5 px-2 text-xs font-extrabold rounded-2xl border transition flex flex-col items-center gap-1 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-[#14291E] text-[#F2C94C] border-[#14291E] shadow-md'
                  : 'bg-[#F8F5EA] text-[#203128] border-[#3F7655]/15 hover:bg-[#DDEBD8]'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-extrabold text-[#203128] block mb-1">
              Phone Number / Email
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={selectedRole === 'collector' ? "+91 98401 23456" : "email@domain.com"}
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-extrabold text-[#203128]">Password</label>
              <button
                type="button"
                onClick={() => alert("Password reset link sent to your registered phone/email.")}
                className="text-[11px] font-bold text-[#3F7655] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Login to {selectedRole.toUpperCase()} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Testing Shortcuts */}
        <div className="pt-4 border-t border-[#3F7655]/10 space-y-2">
          <span className="text-[10px] font-extrabold text-[#718078] uppercase tracking-wider block text-center">
            Simulate Instant Login (Demo Mode)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickRoleLogin('collector')}
              className="py-1.5 px-2 bg-[#DDEBD8] hover:bg-[#c6dfc0] text-[#244936] rounded-xl text-[10px] font-black cursor-pointer transition text-center"
            >
              Collector →
            </button>
            <button
              onClick={() => handleQuickRoleLogin('recycler')}
              className="py-1.5 px-2 bg-[#244936] hover:bg-[#183225] text-white rounded-xl text-[10px] font-black cursor-pointer transition text-center"
            >
              Recycler →
            </button>
            <button
              onClick={() => handleQuickRoleLogin('admin')}
              className="py-1.5 px-2 bg-[#14291E] hover:bg-black text-[#F2C94C] rounded-xl text-[10px] font-black cursor-pointer transition text-center"
            >
              Admin →
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs font-semibold text-[#718078]">
            Don't have an account?{' '}
            <button
              onClick={() => setActiveView('signup')}
              className="font-extrabold text-[#3F7655] hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
