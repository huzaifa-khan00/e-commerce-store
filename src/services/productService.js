import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

export const FLAGSHIP_ID = "flagship-001";

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