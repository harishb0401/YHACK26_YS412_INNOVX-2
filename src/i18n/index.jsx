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
      "PCB / Electronic Components": "catPCB",
      "Copper": "catCopper",
      "Aluminium": "catAluminium",
      "Ferrous Metals": "catFerrous",
      "Plastics": "catPlastics",
      "Batteries": "catBatteries",
      "Cables / Wires": "catCables",
      "Cables & Wiring": "catCables",
      "Computer Equipment": "catComputer",
      "IT Equipment": "catComputer",
      "IT & Telecommunications": "catComputer",
      "Mobile / Small Electronics": "catMobile",
      "Consumer Electronics": "catMobile",
      "Components": "catPCB",
      "Other E-Waste": "catOther",
      "Mixed E-Waste": "catOther",
      "Paper": "catPaper",
      "Plastic": "catPlastics",
      "Glass": "catGlass",
      "Metal": "catFerrous",
      "Organic": "catOrganic",
      "Textiles": "catTextiles"
    };
    const key = keyMap[cat] || cat;
    return t(key, cat);
  };

  const tStatus = (status) => {
    if (!status) return '';
    const keyMap = {
      // 12 Lot & Request Statuses
      "DRAFT": "statusDRAFT",
      "Draft": "statusDRAFT",
      "SUBMITTED": "statusSUBMITTED",
      "Submitted": "statusSUBMITTED",
      "AWAITING_OFFERS": "statusAWAITING_OFFERS",
      "Awaiting Offers": "statusAWAITING_OFFERS",
      "AVAILABLE": "statusAVAILABLE",
      "MATCHED": "statusMATCHED",
      "OFFER_RECEIVED": "statusOFFER_RECEIVED",
      "OFFERS_RECEIVED": "statusOFFERS_RECEIVED",
      "Offers Received": "statusOFFERS_RECEIVED",
      "OFFER_ACCEPTED": "statusOFFER_ACCEPTED",
      "Offer Accepted": "statusOFFER_ACCEPTED",
      "PICKUP_SCHEDULED": "statusPICKUP_SCHEDULED",
      "HANDED_OVER": "statusHANDED_OVER",
      "Handed Over": "statusHANDED_OVER",
      "PAYMENT_COMPLETED": "statusPAYMENT_COMPLETED",
      "COMPLETED": "statusCOMPLETED",
      "Completed": "statusCOMPLETED",
      "REJECTED": "statusREJECTED",
      "CANCELLED": "statusCANCELLED",
      "UNDER_REVIEW": "statusUNDER_REVIEW",

      // Legacy and UI statuses
      "Pending": "statusPending",
      "Matched": "statusMatched",
      "Pickup Scheduled": "statusPICKUP_SCHEDULED",
      "In Transit": "statusInTransit",
      "Received": "statusReceived",
      "Processing": "statusProcessing",
      "Dismantling": "statusDismantling",
      "Sorting": "statusSorting",
      "Material Recovery": "statusMaterialRecovery",
      "Recycled": "statusRecycled",
      "Recycling Completed": "statusCOMPLETED",
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
      "Flagged (+Above Ref)": "statusFlaggedAboveRef",

      // Recycler Verification Statuses
      "VERIFIED": "recStatusVERIFIED",
      "PENDING_VERIFICATION": "recStatusPENDING",
      "SUSPENDED": "recStatusSUSPENDED",

      // Offer Statuses
      "PENDING": "offerStatusPENDING",
      "ACCEPTED": "offerStatusACCEPTED",
      "EXPIRED": "offerStatusEXPIRED",
      "FLAGGED": "offerStatusFLAGGED",

      // Handover Statuses
      "IN_TRANSIT": "handoverStatusIN_TRANSIT",
      "READY_FOR_HANDOVER": "handoverStatusREADY_FOR_HANDOVER",

      // Payment Statuses
      "PAID": "payStatusPAID",
      "FAILED": "payStatusFAILED"
    };
    const key = keyMap[status] || status;
    return t(key, status);
  };

  const tCondition = (cond) => {
    if (!cond) return '';
    const keyMap = {
      "Working / Repairable": "conditionWorking",
      "Non-working / Scrap": "conditionNonWorking",
      "Scrap": "conditionNonWorking",
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
