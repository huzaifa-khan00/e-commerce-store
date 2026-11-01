import GlassCard from "../ui/GlassCard";
import { formatPrice } from "../../utils/formatters";

// order shape: { product, variant, quantity, total }
export default function OrderSummary({ order }) {
  const { product, variant, quantity, total } = order;

  return (
    <GlassCard className="lg:sticky lg:top-24">
      <h2 className="font-heading text-lg font-semibold">Order Summary</h2>

      <div className="mt-5 flex items-center gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10"
          style={{ background: `${variant.hex}55` }}
        >
          <img
            src={variant.image}
            alt=""
            className="h-full w-full object-contain p-1"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{product.name}</p>
          <p className="text-sm text-muted">
            {variant.name} · Qty {quantity}
          </p>
        </div>
        <p className="text-sm font-semibold">{formatPrice(total)}</p>
      </div>

      <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="text-emerald-400">Free</dd>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
          <dt>Pay on delivery</dt>
          <dd className="text-gold-light">{formatPrice(total)}</dd>
        </div>
      </dl>

      <p className="mt-5 text-xs text-muted">
        No advance payment. You pay the courier in cash when your parcel arrives.
      </p>
    </GlassCard>
  );
}