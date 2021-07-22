
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: cb => cb('en'),
    init: () => {},
    cacheUserLanguage: () => {},
  };
  
const resources = {
    resources: {
        en: {
          translation: {
            hello: 'Hello world',
            change: 'Change language',
          },
        },
        de: {
          translation: {
            hello: 'Hallo',
            change: 'Sprache ändern',
          },
        },
      },
}

  i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      debug: true,
      resources
    });

    export default i18next;