import { MessageCircle } from "lucide-react";
import Button from "../ui/Button";
import { CONTACT } from "../../utils/constants";
import { whatsappLink } from "../../utils/whatsapp";
import { formatPrice } from "../../utils/formatters";

// Opens WhatsApp with the order details pre-filled, addressed to the client.
export default function WhatsAppButton({ orderNumber, order, customer }) {
  const message =
    `Hi, I just placed order ${orderNumber}.\n` +
    `${order.quantity} x ${order.product.name} (${order.variant.name})\n` +
    `Total: ${formatPrice(order.total)} (COD)\n` +
    `Name: ${customer.fullName}\n` +
    `City: ${customer.city}`;

  return (
    <Button
      href={whatsappLink(CONTACT.whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      variant="ghost"
      className="w-full"
    >
      <MessageCircle size={18} />
      Confirm on WhatsApp
    </Button>
  );
}