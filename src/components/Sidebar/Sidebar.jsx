import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, PlusCircle, Package, DollarSign, 
  Truck, ShieldCheck, Award, User, Bell, 
  Layers, Users, CheckCircle2, FileText, Settings
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function Sidebar({ role = 'collector', userProfile }) {
  const { t } = useTranslation();
  const location = useLocation();

  const collectorLinks = [
    { to: '/collector/dashboard', key: 'navDashboard', icon: LayoutDashboard },
    { to: '/collector/register-waste', key: 'navRegisterEWaste', icon: PlusCircle },
    { to: '/collector/requests', key: 'navMyWasteLots', icon: Package },
    { to: '/collector/transactions', key: 'navTransactions', icon: Award },
    { to: '/collector/profile', key: 'navProfile', icon: User },
    { to: '/collector/notifications', key: 'navNotifications', icon: Bell },
  ];

  const recyclerLinks = [
    { to: '/recycler/dashboard', key: 'navDashboard', icon: LayoutDashboard },
    { to: '/recycler/waste-requests', key: 'navWasteRequests', icon: Layers },
    { to: '/recycler/transactions', key: 'navTransactions', icon: Award },
    { to: '/recycler/compliance', key: 'navCompliance', icon: ShieldCheck },
    { to: '/recycler/profile', key: 'navProfile', icon: User },
    { to: '/recycler/notifications', key: 'navNotifications', icon: Bell },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', key: 'navDashboard', icon: LayoutDashboard },
    { to: '/admin/collectors', key: 'navCollectors', icon: Users },
    { to: '/admin/recyclers', key: 'navRecyclers', icon: ShieldCheck },
    { to: '/admin/waste-lots', key: 'navWasteLots', icon: Package },
    { to: '/admin/transactions', key: 'navTransactions', icon: Award },
    { to: '/admin/verification', key: 'navVerification', icon: CheckCircle2 },
    { to: '/admin/profile', key: 'navProfile', icon: User },
    { to: '/admin/notifications', key: 'navNotifications', icon: Bell },
  ];

  const links = role === 'collector' ? collectorLinks : role === 'recycler' ? recyclerLinks : adminLinks;

  const displayName = userProfile?.name || userProfile?.companyName || (role === 'collector' ? t('collectorRole') : role === 'recycler' ? t('recyclerRole') : t('adminRole'));

  return (
    <aside className="w-64 bg-white border-r border-[#3F7655]/15 p-5 flex flex-col justify-between shrink-0 min-h-[calc(100vh-5rem)]">
      <div className="space-y-6">
        
        {/* User Card */}
        <div className="p-3.5 bg-[#FAF8F2] rounded-2xl border border-[#3F7655]/15 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3F7655] text-white flex items-center justify-center font-bold text-sm">
            {displayName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-black text-[#203128] truncate">{displayName}</h4>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wider">
              {role === 'collector' ? t('collectorRole') : role === 'recycler' ? t('recyclerRole') : t('adminRole')}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link, idx) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;

            return (
              <NavLink
                key={idx}
                to={link.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive 
                    ? 'bg-[#3F7655] text-white shadow-sm' 
                    : 'text-[#203128] hover:text-[#3F7655] hover:bg-[#DDEBD8]/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t(link.key)}</span>
              </NavLink>
            );
          })}
        </nav>

      </div>

      {/* Footer info in sidebar */}
      <div className="pt-4 border-t border-[#3F7655]/10 text-[11px] text-[#718078] font-semibold text-center">
        Eco-Link v2.6.0 · {t('eprCompliant')}
      </div>
    </aside>
  );
}
