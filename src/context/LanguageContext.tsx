"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import en from '@/locales/en.json';
import si from '@/locales/si.json';
import ta from '@/locales/ta.json';

export type Locale = 'en' | 'si' | 'ta';

const translations = { en, si, ta };

type Translations = typeof en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = translations[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
