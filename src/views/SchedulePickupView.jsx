import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, ArrowRight, Truck, Award, Sparkles, Scale } from 'lucide-react';
import { useTranslation, useLanguage } from '../i18n';

export default function SchedulePickupView({ setActiveView, onPickupScheduled }) {
  const { t } = useTranslation();
  const { tCategory } = useLanguage();

  const [selectedMaterials, setSelectedMaterials] = useState(["Plastic", "Paper"]);
  const [weightKg, setWeightKg] = useState(15);
  const [pickupDate, setPickupDate] = useState("Saturday, 14 Sep");
  const [timeSlot, setTimeSlot] = useState("10:00 AM – 12:00 PM");
  const [address, setAddress] = useState("142 Market Street, Apt 4B, San Francisco, CA");
  const [isBooked, setIsBooked] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const materialsOptions = ["Plastic", "Paper", "Glass", "Metal", "Electronics", "Batteries", "Textiles"];

  const dateOptions = [
    "Saturday, 14 Sep",
    "Sunday, 15 Sep",
    "Monday, 16 Sep",
    "Tuesday, 17 Sep"
  ];

  const timeSlotsOptions = [
    "08:00 AM – 10:00 AM",
    "10:00 AM – 12:00 PM",
    "01:00 PM – 03:00 PM",
    "04:00 PM – 06:00 PM"
  ];

  const toggleMaterial = (mat) => {
    if (selectedMaterials.includes(mat)) {
      if (selectedMaterials.length > 1) {
        setSelectedMaterials(selectedMaterials.filter(m => m !== mat));
      }
    } else {
      setSelectedMaterials([...selectedMaterials, mat]);
    }
  };

  const calculatedPoints = Math.round(weightKg * 8);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEarnedPoints(calculatedPoints);
    setIsBooked(true);
    if (onPickupScheduled) {
      onPickupScheduled({
        materials: selectedMaterials,
        weightKg,
        pickupDate,
        timeSlot,
        address,
        points: calculatedPoints
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EA] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#DDEBD8] text-[#244936] text-xs font-bold uppercase tracking-wider">
            <Truck className="w-4 h-4 text-[#3F7655]" /> {t("doorstepCollection")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#203128] tracking-tight">
            {t("scheduleDoorstepPickup")}
          </h1>
          <p className="text-sm text-[#718078] max-w-lg mx-auto">
            {t("scheduleDoorstepDesc")}
          </p>
        </div>

        {/* Pickup Form Card */}
        <div className="bg-white rounded-[28px] border border-[#3F7655]/20 shadow-md p-6 sm:p-10 space-y-8">

          {isBooked ? (
            <div className="text-center py-8 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-[#DDEBD8] text-[#3F7655] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12 text-[#3F7655]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-[#203128]">{t("pickupScheduledSuccess")}</h2>
                <p className="text-sm text-[#718078] max-w-md mx-auto">
                  {t("collectorAssignedFor", { date: pickupDate, time: timeSlot })}
                </p>
              </div>

              {/* Reward Points Box */}
              <div className="p-4 rounded-2xl bg-[#F8F5EA] border border-[#3F7655]/20 max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#718078] font-medium">{t("estimatedWeightLabel")}:</span>
                  <span className="font-bold text-[#203128]">{weightKg} kg</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#718078] font-medium">{t("materialsLabel")}:</span>
                  <span className="font-bold text-[#203128]">{selectedMaterials.map(m => tCategory(m)).join(', ')}</span>
                </div>
                <div className="pt-2 border-t border-[#3F7655]/15 flex justify-between items-center text-sm font-extrabold text-[#3F7655]">
                  <span>{t("rewardPoints")}:</span>
                  <span className="bg-[#DDEBD8] px-2.5 py-0.5 rounded-md">+{earnedPoints} pts 🌱</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setActiveView('generator')}
                  className="px-6 py-3 bg-[#3F7655] hover:bg-[#244936] text-white font-bold rounded-2xl shadow transition text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>{t("viewDashboardImpact")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Step 1: What do you have? */}
              <div className="space-y-3">
                <label className="block text-sm font-extrabold text-[#203128]">
                  {t("whatDoYouHaveToRecycle")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {materialsOptions.map((mat, idx) => {
                    const isSelected = selectedMaterials.includes(mat);
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => toggleMaterial(mat)}
                        className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${isSelected
                            ? 'bg-[#3F7655] text-white shadow-md'
                            : 'bg-[#F8F5EA] text-[#203128] border border-[#3F7655]/15 hover:bg-[#DDEBD8]'
                          }`}
                      >
                        <span>{isSelected ? '✓' : '+'}</span>
                        <span>{tCategory(mat)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: How much? (Weight Slider) */}
              <div className="space-y-3 pt-2 border-t border-[#3F7655]/10">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-extrabold text-[#203128] flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#3F7655]" />
                    {t("estimatedTotalWeightTitle", { weight: weightKg })}
                  </label>
                  <span className="text-xs font-bold text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
                    {t("impactPointsEarned", { points: calculatedPoints })}
                  </span>
                </div>

                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-[#3F7655] cursor-pointer"
                />

                <div className="flex justify-between text-xs text-[#718078] font-mono">
                  <span>{t("smallBag")}</span>
                  <span>50 kg</span>
                  <span>{t("largeBatch")}</span>
                </div>
              </div>

              {/* Step 3 & 4: Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#3F7655]/10">
                <div>
                  <label className="block text-xs font-extrabold text-[#203128] mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#3F7655]" />
                    {t("choosePickupDate")}
                  </label>
                  <select
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                  >
                    {dateOptions.map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#203128] mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#3F7655]" />
                    {t("chooseTimeSlot")}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                  >
                    {timeSlotsOptions.map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 5: Pickup Address */}
              <div className="space-y-2 pt-2 border-t border-[#3F7655]/10">
                <label className="block text-xs font-extrabold text-[#203128] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#3F7655]" />
                  {t("pickupAddressTitle")}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("pickupAddressInputPlaceholder")}
                  className="w-full bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#203128] focus:bg-white focus:border-[#3F7655] focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#3F7655]/10">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#3F7655] hover:bg-[#244936] text-white font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t("confirmAndSchedulePickup")}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}

