import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const getEnv = (key: string) => {
  return import.meta.env[key] || (process.env as any)[key];
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY') || "AIzaSyAqnqzSM99LaVDh_OA1_hywncJ7CaB8oJ0",
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN') || "ephinance-1bf47.firebaseapp.com",
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID') || "ephinance-1bf47",
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || "ephinance-1bf47.firebasestorage.app",
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || "979219398550",
  appId: getEnv('VITE_FIREBASE_APP_ID') || "1:979219398550:web:455ef44b20ceeaacaee7b7",
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID') || "G-ZBE5TMENT3"
};

// Check if API key exists
const isConfigValid = !!firebaseConfig.apiKey;

let app;
if (isConfigValid) {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} else {
  console.warn("Firebase API Key is missing. Firebase features will not work.");
  app = getApps().length > 0 ? getApp() : initializeApp({
    apiKey: "missing-key",
    authDomain: "missing-domain",
    projectId: "missing-id",
    storageBucket: "missing-bucket",
    messagingSenderId: "missing-sender",
    appId: "missing-app"
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics is only supported in browser environments
export const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;
