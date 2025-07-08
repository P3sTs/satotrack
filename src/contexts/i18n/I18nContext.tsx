
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Translations } from './translations';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translations;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

const STORAGE_KEY = 'satotrack_language';
const DEFAULT_LANGUAGE = 'pt-BR';

// Detect browser language
const detectBrowserLanguage = (): string => {
  try {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang.startsWith('pt')) return 'pt-BR';
    if (browserLang.startsWith('en')) return 'en-US';
    return DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize language state with a safe default
  const [language, setLanguageState] = useState<string>(DEFAULT_LANGUAGE);

  // Load saved language from localStorage after component mounts
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(STORAGE_KEY);
      if (savedLanguage && savedLanguage in translations) {
        setLanguageState(savedLanguage);
      } else {
        // First time visit - detect browser language
        const browserLanguage = detectBrowserLanguage();
        setLanguageState(browserLanguage);
        localStorage.setItem(STORAGE_KEY, browserLanguage);
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      setLanguageState(detectBrowserLanguage());
    }
  }, []);

  const availableLanguages = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' }
  ];

  const setLanguage = (lang: string) => {
    if (lang in translations) {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (error) {
        console.warn('Error setting localStorage:', error);
      }
    }
  };

  const t = translations[language] || translations[DEFAULT_LANGUAGE];

  useEffect(() => {
    // Garantir que o idioma seja persistido
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.warn('Error persisting language:', error);
    }
  }, [language]);

  const contextValue: I18nContextType = {
    language,
    setLanguage,
    t,
    availableLanguages
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};
