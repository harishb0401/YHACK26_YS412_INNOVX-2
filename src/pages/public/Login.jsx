import React from 'react';
import AuthCard from '../../components/Auth/AuthCard';

export default function Login({ initialTab = "login", onLoginSuccess }) {
  return (
    <div className="min-h-[85vh] bg-[#F8F5EA] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-[#203128]">
      <AuthCard initialTab={initialTab} onLoginSuccess={onLoginSuccess} />
    </div>
  );
}
