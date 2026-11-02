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