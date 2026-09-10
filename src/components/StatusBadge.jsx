import React from 'react';
import { Clock, CheckCircle2, Truck, Box, RefreshCw, Sparkles, FileCheck } from 'lucide-react';

export default function StatusBadge({ status, size = "md" }) {
  const configs = {
    "Pending": {
      bg: "bg-amber-50 border-amber-200 text-amber-700",
      icon: Clock,
      dot: "bg-amber-500"
    },
    "Matched": {
      bg: "bg-indigo-50 border-indigo-200 text-indigo-700",
      icon: Sparkles,
      dot: "bg-indigo-500"
    },
    "Pickup Scheduled": {
      bg: "bg-sky-50 border-sky-200 text-sky-700",
      icon: Clock,
      dot: "bg-sky-500"
    },
    "In Transit": {
      bg: "bg-purple-50 border-purple-200 text-purple-700",
      icon: Truck,
      dot: "bg-purple-500"
    },
    "Received": {
      bg: "bg-teal-50 border-teal-200 text-teal-700",
      icon: Box,
      dot: "bg-teal-500"
    },
    "Processing": {
      bg: "bg-blue-50 border-blue-200 text-blue-700",
      icon: RefreshCw,
      dot: "bg-blue-500 animate-spin"
    },
    "Recycled": {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      icon: CheckCircle2,
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
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full transition-colors ${config.bg} ${isSmall ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <IconComponent className={isSmall ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {status}
    </span>
  );
}
