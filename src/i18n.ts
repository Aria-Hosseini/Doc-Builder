import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enMain from './locales/en/main.json';
import faMain from './locales/fa/main.json';

const confirmedFaTranslations: typeof enMain = faMain; 

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { main: enMain },
      fa: { main: confirmedFaTranslations },
    },
    fallbackLng: 'en', 
    ns: ['main'],
    defaultNS: 'main',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;