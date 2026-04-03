import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent as firebaseLogEvent, type Analytics as FirebaseAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAbkLjQX5wMR12NGahfxUcGWFV7pkKWLcc",
  authDomain: "comparas-cb720.firebaseapp.com",
  projectId: "comparas-cb720",
  storageBucket: "comparas-cb720.firebasestorage.app",
  messagingSenderId: "236871069642",
  appId: "1:236871069642:web:19549c7632e0ebbf09a933",
  measurementId: "G-DWPX0V97R8"
};

const app = initializeApp(firebaseConfig);
let analytics: FirebaseAnalytics | null = null;

try {
  analytics = getAnalytics(app);
} catch {
  // Analytics not available (e.g. blocked by ad blocker)
}

function logEvent(name: string, params?: Record<string, string | number>) {
  if (analytics) {
    firebaseLogEvent(analytics, name, params);
  }
}

export const Analytics = {
  selectVehicleType(tipo: string) {
    logEvent('select_vehicle_type', { tipo });
  },

  changeAmount(montante: number) {
    logEvent('change_amount', { montante });
  },

  changeTerm(prazo: number) {
    logEvent('change_term', { prazo });
  },

  simulationComplete(params: { tipo: string; montante: number; prazo: number; num_resultados: number }) {
    logEvent('simulation_complete', params);
  },

  clickBanco(params: { banco: string; rank: number; tipo: string; montante: number; prazo: number }) {
    logEvent('click_banco', params);
  },

  clickBancoExcluded(params: { banco: string; tipo: string; montante: number; prazo: number }) {
    logEvent('click_banco_excluded', params);
  },

  expandExcluded(num_excluidos: number) {
    logEvent('expand_excluded', { num_excluidos });
  },
};
