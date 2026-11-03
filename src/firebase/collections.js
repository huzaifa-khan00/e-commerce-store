// Single place for collection names and order statuses,
// so a typo can't silently create a wrong collection.
export const COLLECTIONS = {
  PRODUCTS: "products",
  VARIANTS: "variants", // subcollection of a product
  ORDERS: "orders",
  ORDER_TRACKING: "order_tracking",
  ADMIN_LOGS: "admin_logs",
  ADMINS: "admins",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  DISPATCHED: "dispatched",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
};

export const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

// Which statuses an order may move to from each current status.
// Cancelled and Returned are final.
export const STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["dispatched", "cancelled"],
  dispatched: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

// The order timestamp that is set when an order enters a status.
export const STATUS_TIMESTAMP_FIELD = {
  confirmed: "confirmedAt",
  dispatched: "dispatchedAt",
  delivered: "deliveredAt",
  cancelled: "cancelledAt",
  returned: "returnedAt",
};

export function canTransition(from, to) {
  return (STATUS_TRANSITIONS[from] ?? []).includes(to);
}