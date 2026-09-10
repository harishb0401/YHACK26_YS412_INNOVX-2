import React from 'react';
import { 
  Clock, CheckCircle2, Truck, Box, RefreshCw, Sparkles, 
  FileCheck, AlertTriangle, ShieldCheck, XCircle, AlertCircle, DollarSign, Package
} from 'lucide-react';
import { useLanguage } from '../i18n';

export default function StatusBadge({ status, size = "md" }) {
  const { tStatus } = useLanguage();

  const configs = {
    // 12 Lot Statuses
    "DRAFT": {
      bg: "bg-slate-100 border-slate-300 text-slate-700",
      icon: Package,
      dot: "bg-slate-400"
    },
    "AVAILABLE": {
      bg: "bg-emerald-50 border-emerald-300 text-emerald-800",
      icon: Sparkles,
      dot: "bg-emerald-500"
    },
    "MATCHED": {
      bg: "bg-indigo-50 border-indigo-200 text-indigo-700",
      icon: Sparkles,
      dot: "bg-indigo-500"
    },
    "OFFER_RECEIVED": {
      bg: "bg-amber-50 border-amber-300 text-amber-800",
      icon: Clock,
      dot: "bg-amber-500 animate-pulse"
    },
    "OFFER_ACCEPTED": {
      bg: "bg-teal-50 border-teal-300 text-teal-800",
      icon: CheckCircle2,
      dot: "bg-teal-500"
    },
    "PICKUP_SCHEDULED": {
      bg: "bg-sky-50 border-sky-300 text-sky-800",
      icon: Clock,
      dot: "bg-sky-500"
    },
    "HANDED_OVER": {
      bg: "bg-purple-50 border-purple-300 text-purple-800",
      icon: Truck,
      dot: "bg-purple-500"
    },
    "PAYMENT_COMPLETED": {
      bg: "bg-emerald-50 border-emerald-300 text-emerald-800",
      icon: DollarSign,
      dot: "bg-emerald-600"
    },
    "COMPLETED": {
      bg: "bg-emerald-100 border-emerald-300 text-emerald-900 font-extrabold",
      icon: CheckCircle2,
      dot: "bg-emerald-600"
    },
    "REJECTED": {
      bg: "bg-rose-50 border-rose-200 text-rose-700",
      icon: XCircle,
      dot: "bg-rose-500"
    },
    "CANCELLED": {
      bg: "bg-slate-100 border-slate-200 text-slate-600",
      icon: XCircle,
      dot: "bg-slate-400"
    },
    "UNDER_REVIEW": {
      bg: "bg-amber-50 border-amber-200 text-amber-700",
      icon: AlertTriangle,
      dot: "bg-amber-500"
    },

    // Recycler Verification Statuses
    "VERIFIED": {
      bg: "bg-emerald-100 border-emerald-300 text-emerald-900",
      icon: ShieldCheck,
      dot: "bg-emerald-600"
    },
    "PENDING_VERIFICATION": {
      bg: "bg-amber-50 border-amber-300 text-amber-800",
      icon: Clock,
      dot: "bg-amber-500"
    },
    "SUSPENDED": {
      bg: "bg-rose-50 border-rose-300 text-rose-800",
      icon: AlertCircle,
      dot: "bg-rose-500"
    },

    // Offer Statuses
    "PENDING": {
      bg: "bg-amber-50 border-amber-200 text-amber-700",
      icon: Clock,
      dot: "bg-amber-500"
    },
    "ACCEPTED": {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      icon: CheckCircle2,
      dot: "bg-emerald-500"
    },
    "FLAGGED": {
      bg: "bg-rose-50 border-rose-300 text-rose-800",
      icon: AlertTriangle,
      dot: "bg-rose-500 animate-pulse"
    },
    "EXPIRED": {
      bg: "bg-slate-100 border-slate-200 text-slate-500",
      icon: Clock,
      dot: "bg-slate-400"
    },

    // Handover & Legacy
    "In Transit": {
      bg: "bg-purple-50 border-purple-200 text-purple-700",
      icon: Truck,
      dot: "bg-purple-500"
    },
    "IN_TRANSIT": {
      bg: "bg-purple-50 border-purple-200 text-purple-700",
      icon: Truck,
      dot: "bg-purple-500"
    },
    "Received": {
      bg: "bg-teal-50 border-teal-200 text-teal-700",
      icon: Box,
      dot: "bg-teal-500"
    },
    "Active": {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      icon: CheckCircle2,
      dot: "bg-emerald-500"
    },
    "PAID": {
      bg: "bg-emerald-50 border-emerald-300 text-emerald-800",
      icon: DollarSign,
      dot: "bg-emerald-500"
    }
  };

  const config = configs[status] || {
    bg: "bg-slate-100 border-slate-200 text-slate-700",
    icon: FileCheck,
    dot: "bg-slate-400"
  };

  const IconComponent = config.icon;
  const isSmall = size === "sm";

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold border rounded-full transition-colors ${config.bg} ${isSmall ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <IconComponent className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{tStatus(status)}</span>
    </span>
  );
}


