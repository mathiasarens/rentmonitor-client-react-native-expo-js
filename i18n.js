
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: cb => cb('de'),
    init: () => {},
    cacheUserLanguage: () => {},
  };
  
const resources = {

        en: {
          translation: {
            rentmonitor: 'RentMonitor',
            change: 'Change language',
            overview: 'Overview',
            unauthenticatedError: 'Session expired',
            connectionError: 'Remote connection error',
            welcome: 'Welcome',
            bookings: 'Bookings',
            dateFormat: 'dd/MM/yyyy',

            signIn: 'Login',
            signInError: 'Login error {{message}}',

            signUp: 'Sign up',

            overviewScreenLoad: 'Reload',
            overviewScreenSyncAccounts: 'Sync Accounts',
            overviewScreenAccountSynchronizationResult: '{{numberOfAccounts}} Accounts synchronized. {{numberOfErrors}} errors.'
          },
        },
        de: {
          translation: {
            rentmonitor: 'RentMonitor',
            change: 'Sprache ändern',
            overview: 'Übersicht',
            unauthenticatedError: 'Sitzung abgelaufen',
            connectionError: 'Verbindungsfehler',
            welcome: 'Willkommen',
            bookings: 'Buchungen',
            dateFormat: 'dd.MM.yyyy',
            
            signIn: 'Anmelden',
            signInError: 'Anmeldefehler {{message}}',

            signUp: 'Registrieren',

            overviewScreenLoad: 'Aktualisieren',
            overviewScreenSyncAccounts: 'Konten abfragen',
            overviewScreenAccountSynchronizationResult:'{{numberOfAccounts}} Konten synchronisiert. {{numberOfErrors}} Fehler.',
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