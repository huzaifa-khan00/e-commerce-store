import cn from "../../utils/cn";
import { STATUS_LABELS } from "../../firebase/collections";

// Full class names are written out so Tailwind includes them.
const TONES = {
  pending: "bg-amber-500/15 text-amber-300",
  confirmed: "bg-sky-500/15 text-sky-300",
  dispatched: "bg-violet-500/15 text-violet-300",
  delivered: "bg-emerald-500/15 text-emerald-300",
  cancelled: "bg-red-500/15 text-red-300",
  returned: "bg-orange-500/15 text-orange-300",
};

// Colored pill for an order status.
export default function Badge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONES[status] ?? "bg-white/10 text-white",
        className
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}