import { useState } from "react";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import cn from "../../utils/cn";
import { STATUS_LABELS, STATUS_TRANSITIONS } from "../../firebase/collections";

const COURIERS = ["TCS", "Leopards", "PostEx", "M&P", "Trax", "BlueEx"];

// Shows only the statuses this order may move to, plus any extra details needed.
// onUpdate(newStatus, { courierName, trackingNumber, cancelReason }) may throw.
export default function OrderStatusSelect({ order, onUpdate }) {
  const options = STATUS_TRANSITIONS[order.status] ?? [];
  const [next, setNext] = useState("");
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (options.length === 0) {
    return (
      <p className="text-sm text-muted">
        This order is {STATUS_LABELS[order.status].toLowerCase()}. No further changes.
      </p>
    );
  }

  const handleSubmit = async () => {
    setError("");
    setSaving(true);
    try {
      await onUpdate(next, { courierName, trackingNumber, cancelReason });
    } catch (err) {
      setError(err.message || "Couldn't update the order. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {options.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setNext(status)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              next === status
                ? "border-gold bg-gold/15 text-gold-light"
                : "border-white/10 text-muted hover:text-white"
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {next === "confirmed" && (
        <p className="text-xs text-muted">
          Stock is reduced by the ordered quantity when you confirm.
        </p>
      )}

      {next === "dispatched" && (
        <div className="space-y-3">
          <Input
            label="Courier"
            list="couriers"
            placeholder="e.g. TCS"
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
          />
          <datalist id="couriers">
            {COURIERS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <Input
            label="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
        </div>
      )}

      {next === "cancelled" && (
        <Input
          label="Reason (optional)"
          placeholder="e.g. Customer not reachable"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      )}

      {(next === "cancelled" || next === "returned") && order.stockDeducted && (
        <p className="text-xs text-muted">
          The reserved stock is added back to this color.
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!next || saving}
        className="w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {saving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : next ? (
          `Mark as ${STATUS_LABELS[next]}`
        ) : (
          "Choose a status"
        )}
      </Button>
    </div>
  );
}