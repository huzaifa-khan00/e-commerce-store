import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Values come from .env.local (never commit that file).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// Fail loudly if a value is missing, instead of a confusing Firebase error later.
const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(
    `Missing Firebase config: ${missing.join(", ")}. Check your .env.local file and restart the dev server.`
  );
}

// Ensure the reCAPTCHA key is also present
if (!recaptchaSiteKey) {
  throw new Error("Missing VITE_RECAPTCHA_SITE_KEY in your environment configuration.");
}

const app = initializeApp(firebaseConfig);

// Initialize App Check (runs safely in browser context)
if (typeof window !== "undefined") {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;