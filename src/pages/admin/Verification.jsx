import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Building, FileText, Check, X, Loader2, RefreshCw } from 'lucide-react';
import { mockRecyclers } from '../../data/mockData';
import { useTranslation } from '../../i18n';
import adminService from '../../services/adminService';

export default function Verification({ recyclers = mockRecyclers }) {
  const { t } = useTranslation();
  const [pendingRecyclers, setPendingRecyclers] = useState([]);
  const [flaggedOffers, setFlaggedOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionAlert, setActionAlert] = useState(null);

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getVerifications();
      if (data) {
        setPendingRecyclers(data.pendingRecyclers || []);
        setFlaggedOffers(data.flaggedOffers || []);
      }
    } catch (err) {
      console.warn('Could not fetch live verifications:', err.message);
      setPendingRecyclers((recyclers || []).filter(r => r.cpcbStatus === 'PENDING' || r.verificationStatus === 'PENDING'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleApproveRecycler = async (id) => {
    try {
      await adminService.verifyRecycler(id);
      setPendingRecyclers(prev => prev.filter(r => r.id !== id && r.userId !== id));
      setActionAlert({
        type: 'success',
        text: `Facility approved! CPCB credentials verified and status updated to VERIFIED in Supabase.`
      });
    } catch (err) {
      alert(err.message || 'Failed to approve recycler on server.');
    }
  };

  const handleRejectRecycler = async (id) => {
    const reason = prompt('Please enter the regulatory rejection reason:', 'Facility documentation does not meet regulatory CPCB threshold');
    if (reason === null) return;

    try {
      await adminService.rejectRecycler(id, reason);
      setPendingRecyclers(prev => prev.filter(r => r.id !== id && r.userId !== id));
      setActionAlert({
        type: 'error',
        text: `Facility application rejected and logged in verification records.`
      });
    } catch (err) {
      alert(err.message || 'Failed to reject recycler on server.');
    }
  };

  const handleResolveFlag = async (id, action) => {
    try {
      if (action === 'dismissed') {
        await adminService.cancelOffer(id);
        setActionAlert({
          type: 'error',
          text: `Flagged offer ${id} was cancelled by administrator.`
        });
      } else {
        setActionAlert({
          type: 'success',
          text: `Flagged offer ${id} was reviewed and approved for transaction.`
        });
      }
      setFlaggedOffers(prev => prev.filter(f => f.id !== id && f.offerId !== id));
    } catch (err) {
      alert(err.message || 'Failed to update flagged offer.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">{t('verificationQueue', 'Verification & Compliance Queue')}</h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            {t('reviewAndApprovePending', 'Review pending recycler CPCB licenses and investigate rule-engine flagged pricing offers.')}
          </p>
        </div>

        <button
          onClick={fetchVerifications}
          className="px-4 py-2 bg-white border border-[#3F7655]/20 text-xs font-bold text-[#203128] rounded-xl hover:bg-[#DDEBD8]/50 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{t('refreshQueue', 'Refresh Queue')}</span>
        </button>
      </div>

      {/* Action Banner */}
      {actionAlert && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-150 ${
          actionAlert.type === 'success' ? 'bg-emerald-50 border border-emerald-300 text-emerald-950' : 'bg-rose-50 border border-rose-300 text-rose-950'
        }`}>
          <div className="flex items-center gap-2">
            {actionAlert.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionAlert.text}</span>
          </div>
          <button onClick={() => setActionAlert(null)} className="text-xs font-bold opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Pending Facilities Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-[#3F7655]/10 pb-4">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#3F7655]" />
            <h2 className="text-lg font-black text-[#203128]">{t('pendingRecyclerRegistrations')}</h2>
          </div>
          <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            {pendingRecyclers.length} {t('awaitingReview')}
          </span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-[#718078]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#3F7655] mb-2" />
            <p className="text-xs font-bold">Loading pending facility applications...</p>
          </div>
        ) : pendingRecyclers.length > 0 ? (
          <div className="space-y-4">
            {pendingRecyclers.map((rec) => (
              <div
                key={rec.id || rec.userId}
                className="p-5 rounded-2xl bg-[#FAF8F2] border border-[#3F7655]/15 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <h3 className="text-base font-black text-[#203128]">{rec.companyName || rec.organizationName}</h3>
                  <p className="text-[#718078]">{t('locationLabel', 'Location')}: {rec.location} • {t('contactLabel', 'Contact')}: {rec.contactPerson} ({rec.phone || 'N/A'})</p>
                  <p className="text-[#718078]">{t('cpcbRegLabel', 'CPCB Reg')}: <span className="font-mono font-bold text-[#203128]">{rec.cpcbRegistrationNo || rec.cpcbRegistrationNumber || 'PENDING'}</span></p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRejectRecycler(rec.id || rec.userId)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition cursor-pointer"
                  >
                    {t('reject')}
                  </button>
                  <button
                    onClick={() => handleApproveRecycler(rec.id || rec.userId)}
                    className="px-5 py-2 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{t('approveCpcbFacility')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#718078] text-center py-4">{t('allApplicationsCleared')}</p>
        )}
      </div>

      {/* Flagged Pricing Offers Section */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#3F7655]/20 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-[#3F7655]/10 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-black text-[#203128]">{t('ruleEngineFlaggedBids')}</h2>
          </div>
          <span className="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            {flaggedOffers.length} {t('flaggedCases')}
          </span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-[#718078]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#3F7655] mb-2" />
            <p className="text-xs font-bold">Scanning flagged pricing bids...</p>
          </div>
        ) : flaggedOffers.length > 0 ? (
          <div className="space-y-4">
            {flaggedOffers.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-900">{item.id}</span>
                    <strong className="text-sm font-black text-[#203128]">{item.recyclerName}</strong>
                  </div>
                  <p className="text-[#718078]">Lot: {item.lotId} ({item.material})</p>
                  <p className="text-amber-800 font-semibold">{item.issue}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolveFlag(item.id, 'dismissed')}
                    className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    {t('cancelBid')}
                  </button>
                  <button
                    onClick={() => handleResolveFlag(item.id, 'cleared')}
                    className="px-5 py-2 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
                  >
                    {t('overrideAllowBid')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#718078] text-center py-4">{t('noPriceAnomalyFlags')}</p>
        )}
      </div>
    </div>
  );
}
