import React, { useState } from 'react';
import { X, Phone, ShieldCheck, CheckCircle2, ArrowRight, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function PhoneVerificationModal({ 
  isOpen, 
  onClose, 
  initialPhone = "+91 98401 23456",
  onVerificationSuccess 
}) {
  const { t } = useTranslation();

  const [phone, setPhone] = useState(initialPhone.replace('+91 ', ''));
  const [otpStep, setOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(60);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setErrorMsg("Please enter a valid mobile number (10 digits).");
      return;
    }
    setErrorMsg('');
    setOtpStep(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // Accept standard demo OTP '123456' or any 6 digits
    if (enteredOtp === '123456' || (enteredOtp.length === 6 && /^\d+$/.test(enteredOtp))) {
      setErrorMsg('');
      setIsSuccess(true);
      setTimeout(() => {
        if (onVerificationSuccess) {
          onVerificationSuccess(`+91 ${phone.trim()}`);
        }
        onClose();
        setIsSuccess(false);
        setOtpStep(false);
        setEnteredOtp('');
      }, 1500);
    } else {
      setErrorMsg(t("otpInvalid"));
    }
  };

  const handleAutoFill = () => {
    setEnteredOtp('123456');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F2] rounded-[32px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#3F7655]/30 space-y-6 my-auto text-[#203128]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3F7655] text-white flex items-center justify-center font-black shadow-sm">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                {t("phoneVerificationRequired")}
              </span>
              <h3 className="text-lg font-black text-[#244936] mt-0.5">
                {t("phoneVerificationTitle")}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {isSuccess ? (
          <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-emerald-900">{t("phoneVerifiedBadge")}</h4>
            <p className="text-xs text-emerald-800 font-medium">
              Your mobile phone (+91 {phone}) has been verified. You can now create digital waste lots and receive verified offers.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-[#718078] leading-relaxed mb-4">
              {t("phoneVerificationSubtitle")}
            </p>

            {!otpStep ? (
              /* Step 1: Enter Phone Number */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#203128] mb-1">
                    {t("phoneNumberLabel")}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-2.5 bg-white border border-[#3F7655]/20 rounded-xl text-xs font-black text-[#244936]">
                      +91 (IN)
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t("phoneNumberPlaceholder")}
                      className="flex-1 text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#3F7655]"
                      required
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t("sendOtp")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 2: Enter OTP Code */
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
                <div className="bg-[#DDEBD8]/50 p-3 rounded-xl border border-[#3F7655]/20 flex items-center justify-between text-xs text-[#244936]">
                  <span>{t("otpSentTo", { phone: `+91 ${phone}` })}</span>
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="text-[11px] font-bold text-[#3F7655] underline cursor-pointer"
                  >
                    {t("change")}
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-extrabold text-[#203128]">
                      {t("enterOtp")}
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      className="text-[10px] font-black text-[#3F7655] bg-white px-2 py-0.5 rounded border border-[#3F7655]/20 hover:bg-[#DDEBD8] transition cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{t("autoFillDemoOtp")}</span>
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-[#718078]" />
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.trim())}
                      placeholder="e.g. 123456"
                      className="w-full pl-9 pr-4 py-2.5 text-center text-sm font-mono tracking-widest font-black bg-white border border-[#3F7655]/20 rounded-xl focus:outline-none focus:border-[#3F7655]"
                      required
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="flex-1 py-2.5 text-xs font-bold text-[#203128] bg-white border border-[#3F7655]/20 hover:bg-[#DDEBD8]/50 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t("resendOtp")}</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-2 py-2.5 text-xs font-extrabold text-white bg-[#3F7655] hover:bg-[#244936] rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t("verifyOtpBtn")}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
