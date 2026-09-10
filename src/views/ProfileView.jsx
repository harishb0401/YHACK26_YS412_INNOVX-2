import React from 'react';
import { User, Phone, Mail, MapPin, ShieldCheck, CheckCircle2, AlertCircle, Building2, Truck, Award } from 'lucide-react';

export default function ProfileView({ currentRole = 'collector', userProfile, onOpenPhoneVerificationModal }) {
  const isCollector = currentRole === 'collector';
  const isRecycler = currentRole === 'recycler';

  const profileName = userProfile?.name || userProfile?.companyName || (isCollector ? "Ramesh Kumar" : "GreenCycle Material Recovery Ltd");
  const profilePhone = userProfile?.phone || "+91 98401 23456";
  const profileEmail = userProfile?.email || (isCollector ? "ramesh@apexscrap.com" : "procurement@greencycle.in");
  const profileLocation = userProfile?.location || (isCollector ? "Guindy Industrial Estate, Chennai" : "Ambattur Industrial Estate, Chennai");
  const phoneVerified = userProfile?.phone_verified ?? userProfile?.phoneVerified ?? true;
  const verificationStatus = userProfile?.verificationStatus || (isRecycler ? "VERIFIED" : "ACTIVE");

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12 px-4 sm:px-6 lg:px-8 text-[#203128]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white p-8 rounded-[32px] border border-[#3F7655]/20 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl ${isCollector ? 'bg-[#3F7655]' : 'bg-[#244936]'} text-white flex items-center justify-center font-black text-2xl shadow-inner`}>
              {isCollector ? <Truck className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8 text-[#F2C94C]" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#203128]">{profileName}</h1>
                <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${isCollector ? 'bg-[#DDEBD8] text-[#244936]' : 'bg-emerald-100 text-emerald-800'}`}>
                  {currentRole.toUpperCase()}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#718078] mt-1">
                Eco-Link Certified Participant ID: {userProfile?.id || (isCollector ? "COL-TN-101" : "REC-TN-01")}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-xs font-bold text-[#718078]">Account Status:</span>
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-800 text-xs font-extrabold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Account: ✓ Active</span>
            </div>
          </div>
        </div>

        {/* Section 25 Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal / Organization Information */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#3F7655]/20 shadow-md space-y-5">
            <h2 className="text-lg font-black text-[#203128] border-b border-[#3F7655]/10 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-[#3F7655]" />
              <span>{isCollector ? "Personal Information" : "Organization Information"}</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[#718078] font-extrabold block text-[10px] uppercase">Name / Entity</span>
                <span className="font-extrabold text-[#203128] text-sm">{profileName}</span>
              </div>

              <div>
                <span className="text-[#718078] font-extrabold block text-[10px] uppercase">Phone Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#3F7655]" />
                  <span className="font-extrabold text-[#203128]">{profilePhone}</span>
                </div>
              </div>

              <div>
                <span className="text-[#718078] font-extrabold block text-[10px] uppercase">Email Address</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#3F7655]" />
                  <span className="font-extrabold text-[#203128]">{profileEmail}</span>
                </div>
              </div>

              <div>
                <span className="text-[#718078] font-extrabold block text-[10px] uppercase">Address</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
                  <span className="font-extrabold text-[#203128]">{profileLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account & Verification Statuses */}
          <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-[#3F7655]/20 shadow-md space-y-5">
            <h2 className="text-lg font-black text-[#203128] border-b border-[#3F7655]/10 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3F7655]" />
              <span>Account & Verification Status</span>
            </h2>

            <div className="space-y-4 text-xs">
              
              {/* Phone Verification Status */}
              <div className="p-4 rounded-2xl bg-[#F8F5EA] border border-[#3F7655]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#718078]">Phone Verification</span>
                  <strong className="block text-sm font-black text-[#203128]">Mobile OTP Auth</strong>
                </div>
                {phoneVerified ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Phone: ✓ Verified</span>
                  </span>
                ) : (
                  <button
                    onClick={onOpenPhoneVerificationModal}
                    className="px-3 py-1 rounded-full bg-rose-600 text-white font-extrabold text-xs cursor-pointer hover:bg-rose-700 transition"
                  >
                    Verify Phone Now
                  </button>
                )}
              </div>

              {/* Account Status */}
              <div className="p-4 rounded-2xl bg-[#F8F5EA] border border-[#3F7655]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#718078]">System Account</span>
                  <strong className="block text-sm font-black text-[#203128]">Participant Profile</strong>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Account: ✓ Active</span>
                </span>
              </div>

              {/* For Recycler: Authorization Verification Status */}
              {isRecycler && (
                <div className="p-4 rounded-2xl bg-[#DDEBD8]/50 border border-[#3F7655]/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#718078]">CPCB Authorization</span>
                    <strong className="block text-sm font-black text-[#244936]">Facility License</strong>
                  </div>
                  {verificationStatus === 'VERIFIED' ? (
                    <span className="px-3 py-1 rounded-full bg-[#244936] text-white font-extrabold text-xs flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-[#F2C94C]" />
                      <span>Authorization: ✓ Verified</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Authorization: ⏳ Pending Verification</span>
                    </span>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
