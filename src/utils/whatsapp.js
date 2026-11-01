// Builds a wa.me link that opens WhatsApp with a pre-filled message.
// number: international format, digits only (e.g. "923001234567").
export function whatsappLink(number, message = "") {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}