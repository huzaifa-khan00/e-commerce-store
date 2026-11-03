import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS, ORDER_STATUS } from "../firebase/collections";
import { generateOrderNumber } from "../utils/orderNumber";

// Saves the order and its public tracking document in ONE batch, so both
// exist or neither does (the security rules require this).
// order: { product, variant, quantity }   customer: validated checkout values
export async function createOrder({ product, variant, quantity }, customer) {
  const orderNumber = generateOrderNumber();
  const unitPrice = product.price;
  const now = serverTimestamp();

  const orderRef = doc(db, COLLECTIONS.ORDERS, orderNumber);
  const trackingRef = doc(db, COLLECTIONS.ORDER_TRACKING, orderNumber);

  const batch = writeBatch(db);

  // Every field must be present. The rules reject missing or extra keys.
  batch.set(orderRef, {
    orderNumber,
    customer: {
      name: customer.fullName,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      // Firestore rejects undefined, so only include notes when filled in.
      ...(customer.notes ? { notes: customer.notes } : {}),
    },
    items: [
      {
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        unitPrice,
        quantity,
      },
    ],
    total: unitPrice * quantity,
    paymentMethod: "cod",
    status: ORDER_STATUS.PENDING,
    courier: null,
    stockDeducted: false,
    cancelReason: null,
    adminNotes: null,
    createdAt: now,
    confirmedAt: null,
    dispatchedAt: null,
    deliveredAt: null,
    cancelledAt: null,
    returnedAt: null,
    updatedAt: now,
  });

  // Public tracking record: status only, no personal details.
  batch.set(trackingRef, {
    status: ORDER_STATUS.PENDING,
    courierName: null,
    trackingNumber: null,
    createdAt: now,
    dispatchedAt: null,
    deliveredAt: null,
    updatedAt: now,
  });

  await batch.commit();
  return { orderNumber };
}