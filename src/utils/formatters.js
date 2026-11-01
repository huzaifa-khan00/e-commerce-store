// Formats a number as Pakistani rupees, e.g. 4999 -> "Rs. 4,999"
export function formatPrice(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}