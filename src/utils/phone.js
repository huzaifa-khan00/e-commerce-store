// Pakistani mobile numbers: 11 digits, starting with 03 (e.g. 03001234567).

// Cleans user input and converts +92 / 92 / 0092 prefixes to the local 03 format.
export function normalizePhone(input = "") {
  let digits = String(input).replace(/\D/g, ""); // strip spaces, dashes, "+"

  if (digits.startsWith("0092")) digits = digits.slice(4);
  else if (digits.startsWith("92")) digits = digits.slice(2);

  if (digits.startsWith("3") && digits.length === 10) digits = "0" + digits;

  return digits;
}

// True only for 11-digit numbers like 03XXXXXXXXX.
export function isValidPhone(input = "") {
  return /^03\d{9}$/.test(normalizePhone(input));
}

// Converts a local number to WhatsApp's international format: 03001234567 -> 923001234567
export function toWhatsAppNumber(input = "") {
  const local = normalizePhone(input);
  return local.startsWith("0") ? `92${local.slice(1)}` : local;
}