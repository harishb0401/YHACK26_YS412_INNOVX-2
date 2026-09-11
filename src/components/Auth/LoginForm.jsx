import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Truck, ShieldCheck, Shield, AlertCircle, Loader2, WifiOff, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n';
import authService from '../../services/authService';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { getOfflineCollectorSession } from '../../services/offline/offlineSession';

export default function LoginForm({ onLoginSuccess, onSwitchToSignup }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { online } = useOnlineStatus();
  const [selectedRole, setSelectedRole] = useState('collector');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [offlineCollector, setOfflineCollector] = useState(null);

  // Check if device already has a validated offline collector session
  useEffect(() => {
    if (!online) {
      getOfflineCollectorSession().then((res) => {
        const isAuthOffline = res?.state === 'AUTHENTICATED_OFFLINE' || res?.status === 'AUTHENTICATED_OFFLINE';
        if (isAuthOffline && res?.user) {
          setOfflineCollector(res.user);
        }
      });
    } else {
      setOfflineCollector(null);
    }
  }, [online]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If offline, check for existing collector session
    if (!online) {
      if (offlineCollector) {
        if (onLoginSuccess) onLoginSuccess(offlineCollector);
        navigate('/collector/dashboard');
        return;
      }
      setErrorMessage('Internet connection is required for your first login.');
      return;
    }

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage(t('enterEmailPhonePassword') || 'Please enter your phone number/email and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const user = await authService.login(identifier, password, selectedRole);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      if (user.role === 'collector') {
        navigate('/collector/dashboard');
      } else if (user.role === 'recycler') {
        navigate('/recycler/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRoleLogin = async (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    setIsLoading(true);

    const demoCredentials = {
      collector: { id: 'demo.collector@example.com', pass: 'EcoLink@2026' },
      recycler: { id: 'demo.recycler@example.com', pass: 'EcoLink@2026' },
      admin: { id: 'demo.admin@example.com', pass: 'EcoLink@2026' }
    };

    const creds = demoCredentials[role];
    setIdentifier(creds.id);
    setPassword(creds.pass);

    try {
      const user = await authService.login(creds.id, creds.pass, role);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      if (role === 'collector') navigate('/collector/dashboard');
      else if (role === 'recycler') navigate('/recycler/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err) {
      // If server is not yet populated with seed data or offline fallback
      setErrorMessage(err.message || `Could not log in as ${role}. Please check server.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Title & Subtitle */}
      <div className="text-center space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-[#203128]">{t('welcomeBack')}</h3>
        <p className="text-xs font-semibold text-[#718078]">
          {t('loginSubtitleText')}
        </p>
      </div>

      {/* OFFLINE STATUS NOTICES */}
      {!online && offlineCollector && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-black text-emerald-950">Active Collector Session Detected</span>
          </div>
          <p className="text-xs text-emerald-900 font-medium">
            Welcome back, <strong>{offlineCollector.name || 'Collector'}</strong>! You can continue offline on this device.
          </p>
          <button
            type="button"
            onClick={() => {
              if (onLoginSuccess) onLoginSuccess(offlineCollector);
              navigate('/collector/dashboard');
            }}
            className="w-full py-2.5 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Open Collector Dashboard (Offline)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {!online && !offlineCollector && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-amber-900 font-black text-xs">
            <WifiOff className="w-4 h-4 text-amber-700" />
            <span>Offline Mode</span>
          </div>
          <p className="text-xs text-amber-950 font-bold leading-relaxed">
            Internet connection is required for your first login.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full py-2 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-[#718078] tracking-wider block">
          {t('selectAccountRole')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('collector');
              setIdentifier('');
            }}
            className={`py-2 px-2 text-xs font-extrabold rounded-xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'collector'
                ? 'bg-[#3F7655] text-white border-[#3F7655] shadow-sm'
                : 'bg-[#F8F5EA] text-[#203128] border-[#3F7655]/15 hover:bg-[#DDEBD8]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t('collectorRole')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('recycler');
              setIdentifier('');
            }}
            className={`py-2 px-2 text-xs font-extrabold rounded-xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'recycler'
                ? 'bg-[#244936] text-white border-[#244936] shadow-sm'
                : 'bg-[#F8F5EA] text-[#203128] border-[#3F7655]/15 hover:bg-[#DDEBD8]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#F2C94C]" />
            <span>{t('recyclerRole')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setIdentifier('');
            }}
            className={`py-2 px-2 text-xs font-extrabold rounded-xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-[#14291E] text-[#F2C94C] border-[#14291E] shadow-sm'
                : 'bg-[#F8F5EA] text-[#203128] border-[#3F7655]/15 hover:bg-[#DDEBD8]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('adminRole')}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-extrabold text-[#203128] block mb-1">
            {t('emailOrPhone')}
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={selectedRole === 'collector' ? "demo.collector@example.com" : selectedRole === 'recycler' ? "demo.recycler@example.com" : "demo.admin@example.com"}
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-extrabold text-[#203128] block mb-1">
            {t('password')}
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 font-bold text-[#718078] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-[#3F7655] focus:ring-[#3F7655]"
            />
            <span>{t('rememberMe')}</span>
          </label>

          <button
            type="button"
            onClick={() => alert("Demo Password: EcoLink@2026. For existing accounts, please contact administrator.")}
            className="font-bold text-[#3F7655] hover:underline cursor-pointer"
          >
            {t('forgotPassword')}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-[#3F7655] hover:bg-[#244936] disabled:opacity-60 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('authenticating', 'Authenticating...')}</span>
            </>
          ) : (
            <>
              <span>{t('loginBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Quick Login */}
      <div className="pt-3 border-t border-[#3F7655]/10 space-y-1.5">
        <span className="text-[10px] font-extrabold text-[#718078] uppercase tracking-wider block text-center">
          {t('quickInstantLogin')}
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickRoleLogin('collector')}
            className="py-1.5 px-2 bg-[#DDEBD8] hover:bg-[#c6dfc0] text-[#244936] rounded-xl text-[10px] font-black cursor-pointer transition text-center"
          >
            {t('collectorRole')} →
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickRoleLogin('recycler')}
            className="py-1.5 px-2 bg-[#244936] hover:bg-[#183225] text-white rounded-xl text-[10px] font-black cursor-pointer transition text-center"
          >
            {t('recyclerRole')} →
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleQuickRoleLogin('admin')}
            className="py-1.5 px-2 bg-[#14291E] hover:bg-black text-[#F2C94C] rounded-xl text-[10px] font-black cursor-pointer transition text-center"
          >
            {t('adminRole')} →
          </button>
        </div>
      </div>

      {/* Switch to Signup */}
      <div className="text-center pt-2">
        <p className="text-xs font-semibold text-[#718078]">
          {t('dontHaveAccount')}{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-extrabold text-[#3F7655] hover:underline cursor-pointer ml-1"
          >
            {t('navSignUp')}
          </button>
        </p>
      </div>
    </div>
  );
}
