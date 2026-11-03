import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import TrackOrderForm from "../components/track/TrackOrderForm";
import OrderStatusTimeline from "../components/track/OrderStatusTimeline";
import GlassCard from "../components/ui/GlassCard";
import useTrackOrder from "../hooks/useTrackOrder";
import { ORDER_NUMBER_REGEX } from "../schemas/trackOrderSchema";

export default function TrackOrderPage() {
  const [params, setParams] = useSearchParams();
  const { tracking, loading, error, track } = useTrackOrder();
  const fromUrl = (params.get("order") || "").trim().toUpperCase();

  // Opened from a link like /track-order?order=ORD-4F9K2X: look it up straight away.
  useEffect(() => {
    if (ORDER_NUMBER_REGEX.test(fromUrl)) track(fromUrl);
  }, [fromUrl, track]);

  const handleSubmit = ({ orderNumber }) => {
    setParams({ order: orderNumber }, { replace: true });
    track(orderNumber);
  };

  return (
    <section className="mx-auto max-w-xl px-5 pb-20 pt-28">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">Track Your Order</h1>
      <p className="mt-2 text-muted">
        Enter the order number you received after placing your order.
      </p>

      <div className="glass-panel mt-8 rounded-2xl p-6">
        <TrackOrderForm
          defaultValue={fromUrl}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error === "not_found"
            ? "We couldn't find an order with that number. Please check it and try again."
            : "Something went wrong while looking up your order. Please try again."}
        </div>
      )}

      {tracking && (
        <GlassCard className="mt-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted">Order number</p>
              <p className="font-heading text-xl font-bold tracking-wider text-gold-light">
                {tracking.orderNumber}
              </p>
            </div>
          </div>

          <OrderStatusTimeline tracking={tracking} />

          {(tracking.courierName || tracking.trackingNumber) && (
            <div className="mt-6 rounded-xl bg-white/5 p-4 text-sm">
              <p className="text-muted">Courier details</p>
              {tracking.courierName && (
                <p className="mt-1 font-medium">{tracking.courierName}</p>
              )}
              {tracking.trackingNumber && (
                <p className="text-muted">
                  Tracking no: <span className="text-white">{tracking.trackingNumber}</span>
                </p>
              )}
            </div>
          )}
        </GlassCard>
      )}
    </section>
  );
}