import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

// Reads one public tracking record by exact order number.
// Returns null when no such order exists.
export async function getTracking(orderNumber) {
  const snap = await getDoc(doc(db, COLLECTIONS.ORDER_TRACKING, orderNumber));
  return snap.exists() ? { orderNumber: snap.id, ...snap.data() } : null;
}