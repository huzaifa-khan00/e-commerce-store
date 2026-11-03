// One-time tool: writes the product and its 3 colors to Firestore
// with the correct data types. Run: node scripts/seed.mjs
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { PRODUCT } from "../src/data/product.js";

// Reads the same keys the app uses from .env.local
function loadEnv() {
  const file = path.resolve(process.cwd(), ".env.local");
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });

  // Ask for the admin login (not stored anywhere)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const email = (await rl.question("Admin email: ")).trim();
  const password = (await rl.question("Admin password: ")).trim();
  rl.close();

  await signInWithEmailAndPassword(getAuth(app), email, password);
  console.log("Signed in as admin.");

  const db = getFirestore(app);
  const batch = writeBatch(db);

  // set() replaces the whole document, so earlier wrong-typed fields are overwritten
  batch.set(doc(db, "products", PRODUCT.id), {
    name: PRODUCT.name,
    tagline: PRODUCT.tagline,
    description: "Placeholder description",
    price: PRODUCT.price,
    compareAtPrice: PRODUCT.compareAtPrice,
    maxPerOrder: PRODUCT.maxPerOrder,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  for (const v of PRODUCT.variants) {
    batch.set(doc(db, "products", PRODUCT.id, "variants", v.id), {
      name: v.name,
      hex: v.hex,
      imageUrl: v.image,
      stock: v.stock,
      active: true,
    });
  }

  await batch.commit();
  console.log(`Done: product "${PRODUCT.id}" and ${PRODUCT.variants.length} colors saved.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});