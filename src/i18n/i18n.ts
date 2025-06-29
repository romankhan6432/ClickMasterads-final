"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

const i18nInstance = i18n
  .use(Backend)
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`../../public/locales/${language}/${namespace}.json`)
  ));

// Only use language detector on client side
if (typeof window !== 'undefined') {
  i18nInstance.use(LanguageDetector);
}

i18nInstance.init({
  defaultNS: 'translation',
  fallbackLng: 'en',
  supportedLngs: ['en-US', 'en', 'bn', 'hi','fr','ar'],
  fallbackNS: 'translation',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  react: {
    useSuspense: false
  }
});

export default i18nInstance;