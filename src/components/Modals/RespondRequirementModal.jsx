import React, { useState } from 'react';
import { X, Plus, Trash2, ShieldAlert, ArrowRight, Calculator } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { referenceScrapPrices } from '../../data/scrapPrices';
import { calculateReferenceValue, calculateAverageReferenceRate, checkPriceWarning } from '../../utils/rulesEngine';

export default function RespondRequirementModal({ 
  isOpen, 
  onClose, 
  requirement, 
  onSubmitResponse 
}) {
  const { t } = useTranslation();

  const [items, setItems] = useState([
    { id: "item-1", material: "Laptop / Notebook", weightKg: 5, referencePrice: 300 },
    { id: "item-2", material: "Mobile Phones & Tablets", weightKg: 2, referencePrice: 500 },
    { id: "item-3", material: "Printers & Scanners", weightKg: 3, referencePrice: 200 }
  ]);

  const [collectorName, setCollectorName] = useState('Apex Scrap Collection (Ramesh)');
  const [askingPricePerKg, setAskingPricePerKg] = useState(310);
  const [notes, setNotes] = useState('Items tested, batteries safely packed in non-conductive crate.');

  if (!isOpen || !requirement) return null;

  const totalWeightKg = items.reduce((sum, item) => sum + (parseFloat(item.weightKg) || 0), 0);
  const estimatedRefValue = calculateReferenceValue(items);
  const averageRefRate = calculateAverageReferenceRate(items);
  const collectorLotValue = Math.round(totalWeightKg * (parseFloat(askingPricePerKg) || 0));

  const handleAddItem = () => {
    const defaultMat = referenceScrapPrices[0];
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        material: defaultMat.material,
        weightKg: 2,
        referencePrice: defaultMat.referencePrice
      }
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleMaterialChange = (id, newMaterial) => {
    const scrapObj = referenceScrapPrices.find(s => s.material === newMaterial) || { referencePrice: 250 };
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          material: newMaterial,
          referencePrice: scrapObj.referencePrice
        };
      }
      return item;
    }));
  };

  const handleWeightChange = (id, val) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          weightKg: parseFloat(val) || 0
        };
      }
      return item;
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceWarning = checkPriceWarning(
      askingPricePerKg, 
      requirement.referenceMin || 280, 
      requirement.referenceMax || 330
    );

    const responsePayload = {
      requirementId: requirement.id,
      collectorName,
      items,
      totalWeightKg,
      askingPricePerKg: parseFloat(askingPricePerKg),
      estimatedLotValue: estimatedRefValue,
      collectorLotValue,
      averageRefRate,
      notes,
      priceWarning
    };

    onSubmitResponse(responsePayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-[#FAF8F2] rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#3F7655]/30 space-y-6 my-auto text-[#203128]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3F7655]/15">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#3F7655] bg-[#DDEBD8] px-2.5 py-0.5 rounded-full">
              COLLECTOR DECLARATION
            </span>
            <h3 className="text-xl font-black text-[#244936] mt-1">
              Respond to: {requirement.recyclerName}
            </h3>
            <p className="text-xs text-[#718078]">
              Target: {requirement.category} · {requirement.requiredQuantityKg} kg required · Target: ₹{requirement.targetPricePerKg}/kg
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Declared Materials List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Declared Material Items (Weights & Rates)
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-[#3F7655] hover:text-[#244936] flex items-center gap-1 bg-[#DDEBD8] px-2.5 py-1 rounded-full"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={item.id} className="bg-white p-3 rounded-2xl border border-[#3F7655]/15 flex items-center gap-3">
                  <div className="flex-1">
                    <select
                      value={item.material}
                      onChange={(e) => handleMaterialChange(item.id, e.target.value)}
                      className="w-full text-xs font-bold bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#3F7655]"
                    >
                      {referenceScrapPrices.map(sp => (
                        <option key={sp.id} value={sp.material}>
                          {sp.icon} {sp.material} (Ref: ₹{sp.referencePrice}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <div className="relative">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={item.weightKg}
                        onChange={(e) => handleWeightChange(item.id, e.target.value)}
                        className="w-full text-xs font-bold bg-[#F8F5EA] border border-[#3F7655]/20 rounded-xl px-2.5 py-2 text-right pr-7 focus:outline-none focus:border-[#3F7655]"
                        placeholder="kg"
                      />
                      <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold">kg</span>
                    </div>
                  </div>

                  <div className="w-20 text-right">
                    <span className="text-[11px] font-bold text-slate-500 block">Subtotal</span>
                    <span className="text-xs font-black text-[#3F7655]">
                      ₹{Math.round(item.weightKg * item.referencePrice)}
                    </span>
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Calculation Summary Box (Rule-Based) */}
          <div className="bg-[#DDEBD8]/50 rounded-2xl p-4 border border-[#3F7655]/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#244936]">
              <Calculator className="w-4 h-4 text-[#3F7655]" />
              <span>Rule-Based Reference Calculation</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-[#3F7655]/15">
                <span className="text-[10px] text-slate-500 font-bold block">Total Weight</span>
                <span className="text-base font-black text-[#244936]">{totalWeightKg} kg</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#3F7655]/15">
                <span className="text-[10px] text-slate-500 font-bold block">Avg Reference Rate</span>
                <span className="text-base font-black text-[#244936]">₹{averageRefRate}/kg</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#3F7655]/15">
                <span className="text-[10px] text-slate-500 font-bold block">Estimated Lot Value</span>
                <span className="text-base font-black text-[#3F7655]">₹{estimatedRefValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Asking Price Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1.5">
                {t("askingPricePerKg")}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  required
                  min="50"
                  max="2000"
                  value={askingPricePerKg}
                  onChange={(e) => setAskingPricePerKg(e.target.value)}
                  className="w-full text-sm font-black bg-white border border-[#3F7655]/20 rounded-xl pl-8 pr-12 py-2.5 text-slate-900 focus:outline-none focus:border-[#3F7655]"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">/ kg</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Reference range: ₹{requirement.referenceMin || 280}–₹{requirement.referenceMax || 330}/kg
              </span>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#203128] mb-1.5">
                Collector Organization / Name
              </label>
              <input
                type="text"
                required
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#3F7655]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 text-xs font-bold bg-white border border-[#3F7655]/20 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="py-3 px-6 text-xs font-extrabold bg-[#3F7655] hover:bg-[#244936] text-white rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>{t("submitResponse")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
