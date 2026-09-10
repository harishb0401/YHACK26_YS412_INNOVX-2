import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en';
import { ta } from './ta';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('eco_link_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('eco_link_lang', lang);
    } catch (e) {
      console.warn('Could not persist language to localStorage:', e);
    }
    document.documentElement.lang = lang;
  }, [lang]);

  // Enhanced translation function with parameter interpolation and fallback
  const t = (key, paramsOrFallback = {}) => {
    const dictionary = lang === 'ta' ? ta : en;
    let text = dictionary[key] || en[key];

    if (typeof paramsOrFallback === 'string') {
      text = text || paramsOrFallback;
    } else if (typeof paramsOrFallback === 'object' && paramsOrFallback !== null) {
      if (!text) text = key;
      // Replace {paramName} placeholders
      Object.keys(paramsOrFallback).forEach((paramKey) => {
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
        text = text.replace(regex, paramsOrFallback[paramKey]);
      });
    }

    return text || key;
  };

  // Helper translators for dynamic data
  const tCategory = (cat) => {
    if (!cat) return '';
    const keyMap = {
      "IT Equipment": "catITEquipment",
      "Consumer Electronics": "catConsumerElectronics",
      "Components": "catComponents",
      "Batteries": "catBatteries",
      "Cables & Wiring": "catCablesWiring",
      "Large Appliances": "catLargeAppliances",
      "Paper": "catPaper",
      "Plastic": "catPlastic",
      "Glass": "catGlass",
      "Metal": "catMetal",
      "Organic": "catOrganic",
      "Textiles": "catTextiles",
      "Mixed E-Waste": "catMixedEWaste"
    };
    const key = keyMap[cat] || cat;
    return t(key, cat);
  };

  const tStatus = (status) => {
    if (!status) return '';
    const keyMap = {
      "Pending": "statusPending",
      "Matched": "statusMatched",
      "Pickup Scheduled": "statusPickupScheduled",
      "In Transit": "statusInTransit",
      "Received": "statusReceived",
      "Processing": "statusProcessing",
      "Dismantling": "statusDismantling",
      "Sorting": "statusSorting",
      "Material Recovery": "statusMaterialRecovery",
      "Recycled": "statusRecycled",
      "Recycling Completed": "statusRecycled",
      "Collected": "timelineCollected",
      "Classified": "timelineClassified",
      "Valued": "timelineValued",
      "Recycler Selected": "timelineSelected",
      "Handover Pending": "timelineHandoverPending",
      "Recycler Received": "timelineReceived",
      "Active": "statusActive",
      "In Material Lot": "statusInMaterialLot",
      "Recycled & Certified ✓": "statusRecycledCertified",
      "Normal Range": "statusNormalRange",
      "Flagged (+Above Ref)": "statusFlaggedAboveRef"
    };
    const key = keyMap[status] || status;
    return t(key, status);
  };

  const tCondition = (cond) => {
    if (!cond) return '';
    const keyMap = {
      "Working / Repairable": "conditionWorking",
      "Non-working / Scrap": "conditionNonWorking",
      "Mixed Condition": "conditionMixed"
    };
    const key = keyMap[cond] || cond;
    return t(key, cond);
  };

  const toggleLang = (newLang) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, tCategory, tStatus, tCondition }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useTranslation = () => {
  return useLanguage();
};
