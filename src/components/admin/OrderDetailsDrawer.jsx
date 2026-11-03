import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MessageCircle, Phone, X } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Input from "../ui/Input";
import OrderStatusSelect from "./OrderStatusSelect";
import { formatDateTime, formatPrice } from "../../utils/formatters";
import { toWhatsAppNumber } from "../../utils/phone";
import { whatsappLink } from "../../utils/whatsapp";

const TIMES = [
  ["Placed", "createdAt"],
  ["Confirmed", "confirmedAt"],
  ["Dispatched", "dispatchedAt"],
  ["Delivered", "deliveredAt"],
  ["Cancelled", "cancelledAt"],
  ["Returned", "returnedAt"],
];

// Pre-written WhatsApp message that fits the order's current status.
function buildMessage(order) {
  const first = order.customer.name.split(" ")[0];
  const item = order.items[0];
  const base = `Hi ${first}, this is regarding your order ${order.orderNumber}.`;

  switch (order.status) {
    case "confirmed":
      return `${base} Your order is confirmed and will be dispatched soon.`;
    case "dispatched":
      return `${base} It has been dispatched via ${order.courier?.name}, tracking no. ${order.courier?.trackingNumber}. Please keep ${formatPrice(order.total)} ready for the courier.`;
    case "delivered":
      return `${base} Thank you for your order! We hope you love it.`;
    case "cancelled":
      return `${base} Your order has been cancelled. Contact us if you have any questions.`;
    default:
      return `${base} ${item.quantity} x ${item.productName} (${item.variantName}), total ${formatPrice(order.total)} (COD). Can you confirm your delivery address?`;
  }
}

export default function OrderDetailsDrawer({
  order,
  onClose,
  onUpdateStatus,
  onSaveNotes,
}) {
  const [notes, setNotes] = useState(order.adminNotes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesMsg, setNotesMsg] = useState("");

  // Close with the Esc key.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const item = order.items[0];
  const { customer } = order;

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesMsg("");
    try {
      await onSaveNotes(order.orderNumber, notes);
      setNotesMsg("Saved.");
    } catch (err) {
      console.error("Saving notes failed:", err);
      setNotesMsg("Couldn't save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-darkBg shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
          <div>
            <p className="font-heading text-lg font-bold tracking-wide text-gold-light">
              {order.orderNumber}
            </p>
            <div className="mt-1.5">
              <Badge status={order.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-muted hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-7 overflow-y-auto p-5">
          {/* Customer */}
          <section>
            <h3 className="text-sm font-semibold">Customer</h3>
            <div className="mt-2 space-y-1 text-sm text-muted">
              <p className="text-base text-white">{customer.name}</p>
              <p>{customer.phone}</p>
              <p>{customer.address}</p>
              <p>{customer.city}</p>
              {customer.notes && (
                <p className="pt-1 italic">Customer note: {customer.notes}</p>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <Button
                href={`tel:${customer.phone}`}
                variant="ghost"
                className="flex-1 px-4 py-2.5"
              >
                <Phone size={16} /> Call
              </Button>
              <Button
                href={whatsappLink(
                  toWhatsAppNumber(customer.phone),
                  buildMessage(order)
                )}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                className="flex-1 px-4 py-2.5"
              >
                <MessageCircle size={16} /> Message
              </Button>
            </div>
          </section>

          {/* Items */}
          <section>
            <h3 className="text-sm font-semibold">Order</h3>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                {item.quantity} × {item.productName} ({item.variantName})
              </p>
              <p className="text-muted">Unit price {formatPrice(item.unitPrice)}</p>
              <p className="pt-1 font-semibold text-gold-light">
                Collect on delivery: {formatPrice(order.total)}
              </p>
            </div>
          </section>

          {/* Courier */}
          {order.courier && (
            <section>
              <h3 className="text-sm font-semibold">Courier</h3>
              <p className="mt-2 text-sm">
                {order.courier.name}
                <span className="text-muted"> · {order.courier.trackingNumber}</span>
              </p>
            </section>
          )}

          {order.cancelReason && (
            <section>
              <h3 className="text-sm font-semibold">Cancel reason</h3>
              <p className="mt-2 text-sm text-muted">{order.cancelReason}</p>
            </section>
          )}

          {/* Dates */}
          <section>
            <h3 className="text-sm font-semibold">History</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {TIMES.filter(([, field]) => order[field]).map(([label, field]) => (
                <li key={field} className="flex justify-between gap-4">
                  <span className="text-muted">{label}</span>
                  <span>{formatDateTime(order[field])}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Status change (key resets its fields after each change) */}
          <section>
            <h3 className="mb-3 text-sm font-semibold">Update status</h3>
            <OrderStatusSelect
              key={order.status}
              order={order}
              onUpdate={(newStatus, extras) =>
                onUpdateStatus(order.orderNumber, newStatus, extras)
              }
            />
          </section>

          {/* Private notes */}
          <section>
            <Input
              label="Private notes"
              as="textarea"
              rows={3}
              placeholder="Only you can see this"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesMsg("");
              }}
            />
            <div className="mt-3 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-5 py-2 disabled:opacity-60"
              >
                {savingNotes ? <Loader2 size={16} className="animate-spin" /> : "Save notes"}
              </Button>
              {notesMsg && <span className="text-xs text-muted">{notesMsg}</span>}
            </div>
          </section>
        </div>
      </motion.aside>
    </motion.div>
  );
}