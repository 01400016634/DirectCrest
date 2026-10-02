import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Available languages: English (en), Bangla (bn), Chinese (zh), Japanese (ja)
// Future architecture for Hindi (hi), Urdu (ur), Arabic (ar), French (fr), German (de), Spanish (es)

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'bn', 'zh', 'ja', 'hi', 'ur', 'ar', 'fr', 'de', 'es'],
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    defaultNS: 'translation',
    fallbackNS: 'translation',
  });

export default i18n;
