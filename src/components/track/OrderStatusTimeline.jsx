import {
  Ban,
  CheckCircle2,
  ClipboardList,
  PackageCheck,
  PhoneCall,
  Truck,
  Undo2,
} from "lucide-react";
import cn from "../../utils/cn";
import { formatDateTime } from "../../utils/formatters";

const STEPS = [
  { key: "pending", label: "Order placed", icon: ClipboardList, dateField: "createdAt" },
  { key: "confirmed", label: "Confirmed by phone", icon: PhoneCall },
  { key: "dispatched", label: "Dispatched", icon: Truck, dateField: "dispatchedAt" },
  { key: "delivered", label: "Delivered", icon: PackageCheck, dateField: "deliveredAt" },
];

export default function OrderStatusTimeline({ tracking }) {
  const { status } = tracking;

  // Cancelled and returned orders don't follow the normal steps.
  if (status === "cancelled" || status === "returned") {
    const Icon = status === "cancelled" ? Ban : Undo2;
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4">
        <Icon size={22} className="mt-0.5 shrink-0 text-red-300" />
        <div>
          <p className="font-medium text-red-200">
            {status === "cancelled" ? "Order cancelled" : "Order returned"}
          </p>
          <p className="mt-1 text-sm text-red-200/70">
            Questions? Contact us and we'll help you out.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="space-y-0">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = done && !isCurrent ? CheckCircle2 : step.icon;
        const date = step.dateField ? formatDateTime(tracking[step.dateField]) : "";

        return (
          <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Connector line to the next step */}
            {i < STEPS.length - 1 && (
              <span
                className={cn(
                  "absolute left-5 top-10 h-[calc(100%-2.5rem)] w-px",
                  i < currentIndex ? "bg-gold/60" : "bg-white/10"
                )}
              />
            )}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                done
                  ? "border-gold/60 bg-gold/15 text-gold"
                  : "border-white/10 bg-white/5 text-white/30",
                isCurrent && "ring-2 ring-gold/40"
              )}
            >
              <Icon size={18} />
            </div>
            <div className="pt-1.5">
              <p className={cn("text-sm font-medium", !done && "text-white/40")}>
                {step.label}
              </p>
              {done && date && <p className="mt-0.5 text-xs text-muted">{date}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}