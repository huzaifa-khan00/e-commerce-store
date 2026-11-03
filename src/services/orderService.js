import {
  collection,
  doc,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/config";
import {
  COLLECTIONS,
  ORDER_STATUS,
  STATUS_LABELS,
  STATUS_TIMESTAMP_FIELD,
  canTransition,
} from "../firebase/collections";
import { generateOrderNumber } from "../utils/orderNumber";

// ---------- Customer side ----------

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

// ---------- Admin side ----------

// Live list of the newest orders. Returns the unsubscribe function.
export function subscribeToOrders(onData, onError, max = 200) {
  const q = query(
    collection(db, COLLECTIONS.ORDERS),
    orderBy("createdAt", "desc"),
    limit(max)
  );
  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

// Moves an order to a new status. Everything happens in ONE transaction:
// the order, the public tracking record, the stock, and the audit log.
export async function updateOrderStatus({
  orderNumber,
  newStatus,
  courierName,
  trackingNumber,
  cancelReason,
  admin, // { uid, email }
}) {
  await runTransaction(db, async (tx) => {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderNumber);
    const trackingRef = doc(db, COLLECTIONS.ORDER_TRACKING, orderNumber);

    // --- Reads first (a transaction must read before it writes) ---
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists()) throw new Error("Order not found.");
    const order = orderSnap.data();

    if (!canTransition(order.status, newStatus)) {
      throw new Error(
        `A ${STATUS_LABELS[order.status]} order can't be changed to ${STATUS_LABELS[newStatus]}.`
      );
    }
    if (
      newStatus === ORDER_STATUS.DISPATCHED &&
      (!courierName?.trim() || !trackingNumber?.trim())
    ) {
      throw new Error("Enter the courier name and tracking number.");
    }

    const item = order.items[0];
    const variantRef = doc(
      db,
      COLLECTIONS.PRODUCTS,
      item.productId,
      COLLECTIONS.VARIANTS,
      item.variantId
    );

    // Stock drops when confirmed, and comes back if a confirmed order is
    // cancelled or returned.
    let stockChange = 0;
    if (newStatus === ORDER_STATUS.CONFIRMED && !order.stockDeducted) {
      stockChange = -item.quantity;
    } else if (
      (newStatus === ORDER_STATUS.CANCELLED ||
        newStatus === ORDER_STATUS.RETURNED) &&
      order.stockDeducted
    ) {
      stockChange = item.quantity;
    }

    let variantExists = false;
    if (stockChange !== 0) {
      const variantSnap = await tx.get(variantRef);
      variantExists = variantSnap.exists();
      if (
        stockChange < 0 &&
        (!variantExists || variantSnap.data().stock < item.quantity)
      ) {
        throw new Error(
          "Not enough stock to confirm this order. Update the stock first."
        );
      }
    }

    // --- Writes ---
    const now = serverTimestamp();

    const orderUpdate = { status: newStatus, updatedAt: now };
    const stampField = STATUS_TIMESTAMP_FIELD[newStatus];
    if (stampField) orderUpdate[stampField] = now;
    if (stockChange < 0) orderUpdate.stockDeducted = true;
    if (stockChange > 0) orderUpdate.stockDeducted = false;

    const trackingUpdate = { status: newStatus, updatedAt: now };
    let note = null;

    if (newStatus === ORDER_STATUS.DISPATCHED) {
      const name = courierName.trim();
      const number = trackingNumber.trim();
      orderUpdate.courier = { name, trackingNumber: number };
      trackingUpdate.courierName = name;
      trackingUpdate.trackingNumber = number;
      trackingUpdate.dispatchedAt = now;
      note = `${name}, tracking ${number}`;
    }
    if (newStatus === ORDER_STATUS.DELIVERED) {
      trackingUpdate.deliveredAt = now;
    }
    if (newStatus === ORDER_STATUS.CANCELLED) {
      orderUpdate.cancelReason = cancelReason?.trim() || null;
      note = orderUpdate.cancelReason;
    }

    tx.update(orderRef, orderUpdate);
    tx.update(trackingRef, trackingUpdate);

    if (stockChange < 0 || (stockChange > 0 && variantExists)) {
      tx.update(variantRef, { stock: increment(stockChange) });
    }

    // Audit log: who changed what, and when.
    tx.set(doc(collection(db, COLLECTIONS.ADMIN_LOGS)), {
      orderId: orderNumber,
      orderNumber,
      action: "status_change",
      from: order.status,
      to: newStatus,
      adminUid: admin.uid,
      adminEmail: admin.email,
      note,
      createdAt: now,
    });
  });
}

// Private notes the customer never sees.
export function saveAdminNotes(orderNumber, notes) {
  return updateDoc(doc(db, COLLECTIONS.ORDERS, orderNumber), {
    adminNotes: notes.trim() || null,
    updatedAt: serverTimestamp(),
  });
}