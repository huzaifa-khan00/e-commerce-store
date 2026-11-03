// Formats a number as Pakistani rupees, e.g. 4999 -> "Rs. 4,999"
export function formatPrice(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}

// Formats a Firestore timestamp (or Date) as "3 Nov 2026, 1:39 pm".
// Returns "" when the value is empty.
export function formatDateTime(value) {
  if (!value) return "";
  const date = typeof value.toDate === "function" ? value.toDate() : new Date(value);
  return date.toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
}