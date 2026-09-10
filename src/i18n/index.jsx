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
    // Update font family / lang attribute dynamically if helpful
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, fallback = '') => {
    const dictionary = lang === 'ta' ? ta : en;
    return dictionary[key] || en[key] || fallback || key;
  };

  const toggleLang = (newLang) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
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
  const { t, lang, setLang, toggleLang } = useLanguage();
  return { t, lang, setLang, toggleLang };
};
