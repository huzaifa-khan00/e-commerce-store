import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

export const FLAGSHIP_ID = "flagship-001";

// ---------- Customer side ----------

// Loads the product and its active colors. Returns null if it doesn't exist
// or is switched off. The result has the same shape the components already use.
export async function getProduct(productId = FLAGSHIP_ID) {
  const productSnap = await getDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
  if (!productSnap.exists() || productSnap.data().active !== true) return null;
  const p = productSnap.data();

  const variantsSnap = await getDocs(
    collection(db, COLLECTIONS.PRODUCTS, productId, COLLECTIONS.VARIANTS)
  );

  const variants = variantsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((v) => v.active === true)
    .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
    .map((v) => ({
      id: v.id,
      name: v.name,
      hex: v.hex,
      image: v.imageUrl,
      stock: v.stock,
    }));

  return {
    id: productSnap.id,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    maxPerOrder: p.maxPerOrder,
    variants,
  };
}

// ---------- Admin side ----------

// Live product + ALL its colors (including switched-off ones).
// Calls onData({ product, variants }). Returns the unsubscribe function.
export function subscribeToAdminProduct(productId, onData, onError) {
  let product; // undefined = not loaded yet, null = document missing
  let variants;

  const emit = () => {
    if (product === undefined || variants === undefined) return;
    onData({ product, variants });
  };

  const stopProduct = onSnapshot(
    doc(db, COLLECTIONS.PRODUCTS, productId),
    (snap) => {
      product = snap.exists() ? { id: snap.id, ...snap.data() } : null;
      emit();
    },
    onError
  );

  const stopVariants = onSnapshot(
    collection(db, COLLECTIONS.PRODUCTS, productId, COLLECTIONS.VARIANTS),
    (snap) => {
      variants = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
      emit();
    },
    onError
  );

  return () => {
    stopProduct();
    stopVariants();
  };
}

// Sets a color's stock to an exact number and records it in the audit log.
export async function updateVariantStock({ productId, variantId, from, to, admin }) {
  if (!Number.isInteger(to) || to < 0 || to > 100000) {
    throw new Error("Enter a whole number, 0 or more.");
  }

  const batch = writeBatch(db);
  batch.update(
    doc(db, COLLECTIONS.PRODUCTS, productId, COLLECTIONS.VARIANTS, variantId),
    { stock: to }
  );
  batch.set(doc(collection(db, COLLECTIONS.ADMIN_LOGS)), {
    action: "stock_update",
    productId,
    variantId,
    from,
    to,
    adminUid: admin.uid,
    adminEmail: admin.email,
    createdAt: serverTimestamp(),
  });
  await batch.commit();
}

// Changes the price and the crossed-out "old" price, and logs it.
export async function updateProductPrice({
  productId,
  price,
  compareAtPrice,
  fromPrice,
  admin,
}) {
  if (!Number.isInteger(price) || price < 1 || price > 10000000) {
    throw new Error("Price must be a whole number of rupees.");
  }
  if (!Number.isInteger(compareAtPrice) || compareAtPrice < price) {
    throw new Error("The old price can't be lower than the price.");
  }

  const batch = writeBatch(db);
  batch.update(doc(db, COLLECTIONS.PRODUCTS, productId), {
    price,
    compareAtPrice,
    updatedAt: serverTimestamp(),
  });
  batch.set(doc(collection(db, COLLECTIONS.ADMIN_LOGS)), {
    action: "price_update",
    productId,
    from: fromPrice,
    to: price,
    note: `old price ${compareAtPrice}`,
    adminUid: admin.uid,
    adminEmail: admin.email,
    createdAt: serverTimestamp(),
  });
  await batch.commit();
}
