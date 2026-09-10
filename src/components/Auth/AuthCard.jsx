import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthCard({ initialTab = 'login', onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="w-full max-w-[490px] mx-auto bg-white p-7 sm:p-9 rounded-[32px] border border-[#3F7655]/20 shadow-xl space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-1.5">
        <div className="w-12 h-12 rounded-2xl bg-[#3F7655] text-white mx-auto flex items-center justify-center font-black text-xl shadow-md">
          ♻
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#203128]">
          Eco-<span className="text-[#3F7655]">Link</span>
        </h2>
      </div>

      {/* Segmented Tab Switch: [ LOGIN ] [ SIGN UP ] */}
      <div className="flex bg-[#F8F5EA] p-1.5 rounded-2xl border border-[#3F7655]/15">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'login'
              ? 'bg-[#3F7655] text-white shadow-sm'
              : 'text-[#718078] hover:text-[#203128]'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('signup')}
          className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all duration-150 cursor-pointer ${
            activeTab === 'signup'
              ? 'bg-[#3F7655] text-white shadow-sm'
              : 'text-[#718078] hover:text-[#203128]'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form Content */}
      {activeTab === 'login' ? (
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          onSwitchToSignup={() => setActiveTab('signup')}
        />
      ) : (
        <SignupForm
          onSignupSuccess={onLoginSuccess}
          onSwitchToLogin={() => setActiveTab('login')}
        />
      )}
    </div>
  );
}
