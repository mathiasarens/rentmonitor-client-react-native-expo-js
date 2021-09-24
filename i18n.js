
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
            overview: 'Overview',
            signIn: 'SignIn',
            unauthenticatedError: 'Session expired',
            connectionError: 'Remote connection error'

          },
        },
        de: {
          translation: {
            hello: 'Hallo',
            change: 'Sprache ändern',
            overview: 'Uebersicht',
            signIn: 'Anmelden',
            unauthenticatedError: 'Sitzung abgelaufen',
            connectionError: 'Verbindungsfehler'
          },
        },
      },
}

  i18next
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'de',
      debug: true,
      resources
    });

    export default i18next;