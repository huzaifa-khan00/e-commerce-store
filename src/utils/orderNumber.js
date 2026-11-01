// Generates order numbers like ORD-4F9K2X.
// Skips look-alike characters (0/O, 1/I) so customers can read them out over the phone.
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderNumber() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const code = Array.from(bytes, (b) => CHARS[b % CHARS.length]).join("");
  return `ORD-${code}`;
}