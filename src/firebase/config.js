import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Values come from .env.local (never commit that file).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Fail loudly if a value is missing, instead of a confusing Firebase error later.
const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(
    `Missing Firebase config: ${missing.join(", ")}. Check your .env.local file and restart the dev server.`
  );
}

const app = initializeApp(firebaseConfig);

// App Check must start before any other Firebase service is used.
// Skipped when no key is set, so the site works fine without it.
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (siteKey) {
  if (import.meta.env.DEV) {
    // On localhost, Firebase prints a debug token in the browser console.
    // Register that token once in the Firebase console (App Check → your app →
    // Manage debug tokens).
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;