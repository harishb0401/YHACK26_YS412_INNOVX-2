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
    { to: '/collector/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/collector/register-waste', label: 'Register E-Waste', icon: PlusCircle },
    { to: '/collector/waste-lots', label: 'My Waste Lots', icon: Package },
    { to: '/collector/recycler-matches', label: 'Recycler Matches', icon: DollarSign },
    { to: '/collector/transactions', label: 'Transactions', icon: Award },
    { to: '/collector/profile', label: 'Profile', icon: User },
    { to: '/collector/notifications', label: 'Notifications', icon: Bell },
  ];

  const recyclerLinks = [
    { to: '/recycler/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/recycler/waste-requests', label: 'Waste Requests', icon: Layers },
    { to: '/recycler/matches', label: 'My Matches', icon: DollarSign },
    { to: '/recycler/transactions', label: 'Transactions', icon: Award },
    { to: '/recycler/compliance', label: 'Compliance', icon: ShieldCheck },
    { to: '/recycler/profile', label: 'Profile', icon: User },
    { to: '/recycler/notifications', label: 'Notifications', icon: Bell },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/collectors', label: 'Collectors', icon: Users },
    { to: '/admin/recyclers', label: 'Recyclers', icon: ShieldCheck },
    { to: '/admin/waste-lots', label: 'Waste Lots', icon: Package },
    { to: '/admin/transactions', label: 'Transactions', icon: Award },
    { to: '/admin/verification', label: 'Verification', icon: CheckCircle2 },
    { to: '/admin/profile', label: 'Profile', icon: User },
    { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  ];

  const links = role === 'collector' ? collectorLinks : role === 'recycler' ? recyclerLinks : adminLinks;

  const displayName = userProfile?.name || userProfile?.companyName || (role === 'collector' ? 'Collector' : role === 'recycler' ? 'Recycler' : 'Admin');

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
              {role}
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
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

      </div>

      {/* Footer info in sidebar */}
      <div className="pt-4 border-t border-[#3F7655]/10 text-[11px] text-[#718078] font-semibold text-center">
        Eco-Link v2.6.0 · EPR Ready
      </div>
    </aside>
  );
}
