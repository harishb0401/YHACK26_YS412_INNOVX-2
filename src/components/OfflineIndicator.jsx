import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, WifiOff, RefreshCw, CheckCircle2, Clock, 
  AlertCircle, ChevronDown, Sparkles 
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { subscribeSyncStatus, syncPendingRecords } from '../services/offline/syncManager';

export default function OfflineIndicator({ currentRole }) {
  const { online, simulatedOffline, toggleSimulatedOffline } = useOnlineStatus();
  const [syncState, setSyncState] = useState({
    status: 'idle',
    pendingCount: 0,
    syncedCount: 0,
    failedCount: 0,
    lastSyncTime: null,
    message: ''
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeSyncStatus(state => setSyncState(state));
    return unsub;
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualSync = async () => {
    if (!online) {
      alert("Cannot sync while offline. Please connect to the internet or disable offline simulation.");
      return;
    }
    await syncPendingRecords();
  };

  // Determine pill appearance
  const isSyncing = syncState.status === 'syncing';
  const hasPending = syncState.pendingCount > 0;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Compact Status Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm border ${
          online
            ? hasPending
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
        }`}
        title="Network & Offline Sync Status (Click to inspect)"
      >
        {isSyncing ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-[#3F7655] animate-spin" />
            <span>Syncing...</span>
          </>
        ) : online ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
            <span>Online</span>
            {hasPending && (
              <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {syncState.pendingCount} pending
              </span>
            )}
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <WifiOff className="w-3.5 h-3.5 text-amber-700" />
            <span>Offline</span>
            {hasPending && (
              <span className="bg-amber-300 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                • {syncState.pendingCount} pending
              </span>
            )}
          </>
        )}
        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#3F7655]/20 p-4 z-50 animate-in fade-in zoom-in-95 duration-100 text-[#203128] space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#3F7655]/10 pb-2">
            <span className="font-black text-[#244936] uppercase tracking-wider text-[10px]">
              Connection & Sync
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${online ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
              {online ? '🟢 Connected' : '🟠 Offline Mode'}
            </span>
          </div>

          {/* Sync status summary */}
          <div className="space-y-1.5 bg-[#F8F5EA] p-3 rounded-xl border border-[#3F7655]/10">
            <div className="flex items-center justify-between">
              <span className="text-[#718078] font-bold">Pending Records:</span>
              <strong className={syncState.pendingCount > 0 ? "text-amber-700 font-black" : "text-emerald-700 font-bold"}>
                {syncState.pendingCount === 0 ? "0 (All Synced ✓)" : `${syncState.pendingCount} waiting`}
              </strong>
            </div>
            {syncState.lastSyncTime && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#718078]">Last Sync:</span>
                <span className="font-semibold text-[#203128]">{syncState.lastSyncTime}</span>
              </div>
            )}
            {syncState.message && (
              <p className="text-[11px] font-bold text-[#3F7655] pt-1 border-t border-[#3F7655]/10">
                {syncState.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={!online || isSyncing || syncState.pendingCount === 0}
              className="w-full py-2 bg-[#3F7655] hover:bg-[#244936] disabled:opacity-50 text-white rounded-xl font-black text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

            {/* Simulated Offline Toggle for convenient desktop testing */}
            <button
              type="button"
              onClick={toggleSimulatedOffline}
              className={`w-full py-2 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                simulatedOffline
                  ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {simulatedOffline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Disable Offline Simulation</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                  <span>Simulate Offline Mode (Test)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-[#718078] leading-tight text-center pt-1 border-t border-[#3F7655]/10">
            Offline records are stored in browser IndexedDB and sync automatically when connection returns.
          </p>
        </div>
      )}
    </div>
  );
}
