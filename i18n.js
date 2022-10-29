
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
            overviewScreen: 'Overview',
            unauthenticatedError: 'Session expired',
            connectionError: 'Remote connection error',
            welcome: 'Welcome',
            bookingsScreen: 'Bookings',
            dateFormat: 'dd/MM/yyyy',
            accounts: 'Accounts',

            signIn: 'Login',
            signInError: 'Login error {{message}}',

            signUp: 'Sign up',

            overviewScreenSyncAccounts: 'Sync Accounts',
            overviewScreenAccountSynchronizationResult: '{{numberOfAccounts}} Accounts synchronized. {{numberOfErrors}} errors.',
            syncScreen: 'Account Sync',
            syncScreenResultNewBookings: 'New Bookings',
            syncScreenResultUnmatchedTransactions: 'Unmatched Transactions'
          },
        },
        de: {
          translation: {
            rentmonitor: 'RentMonitor',
            change: 'Sprache ändern',
            overviewScreen: 'Übersicht',
            unauthenticatedError: 'Sitzung abgelaufen',
            connectionError: 'Verbindungsfehler',
            welcome: 'Willkommen',
            bookingsScreen: 'Buchungen',
            dateFormat: 'dd.MM.yyyy',
            accounts: 'Konten',

            signIn: 'Anmelden',
            signInError: 'Anmeldefehler {{message}}',

            signUp: 'Registrieren',

            overviewScreenSyncAccounts: 'Konten abfragen',
            overviewScreenAccountSynchronizationResult:'{{numberOfAccounts}} Konten synchronisiert. {{numberOfErrors}} Fehler.',
            syncScreen: 'Konten abfragen',
            syncScreenResultNewBookings: 'Neue Buchungen',
            syncScreenResultUnmatchedTransactions: 'Neue Transaktionen'
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