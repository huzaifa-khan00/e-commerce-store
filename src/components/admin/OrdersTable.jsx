import Badge from "../ui/Badge";
import { formatDateTime, formatPrice } from "../../utils/formatters";

// A tappable list of orders. Works on phones and desktops alike.
export default function OrdersTable({ orders, onSelect }) {
  if (orders.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-sm text-muted">
        No orders to show.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => {
        const item = order.items[0];
        return (
          <li key={order.orderNumber}>
            <button
              type="button"
              onClick={() => onSelect(order.orderNumber)}
              className="glass-panel flex w-full flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/10"
            >
              <div className="min-w-0">
                <p className="font-heading font-semibold tracking-wide text-gold-light">
                  {order.orderNumber}
                </p>
                <p className="truncate text-sm">
                  {order.customer.name} · {order.customer.city}
                </p>
                <p className="text-xs text-muted">
                  {item.quantity} × {item.variantName}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <Badge status={order.status} />
                <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}