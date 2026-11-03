import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";
import cn from "../../utils/cn";
import useProduct from "../../hooks/useProduct";
import { formatPrice } from "../../utils/formatters";

export default function VariantSelector({ onOrder }) {
  const { product, loading, error, reload } = useProduct();
  const [selectedId, setSelectedId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // Tracks which variant images failed to load, so we can show a fallback tile.
  const [failed, setFailed] = useState({});

  const ready = !loading && !error && product && product.variants.length > 0;

  // Hooks are above; everything below only runs once the product is loaded.
  let content;

  if (loading) {
    content = (
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="glass-panel aspect-square animate-pulse rounded-3xl" />
        <div className="space-y-4">
          <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-white/10" />
          <div className="h-12 w-full animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
    );
  } else if (!ready) {
    content = (
      <div className="glass-panel mx-auto max-w-md rounded-2xl p-8 text-center">
        <p className="font-medium">We couldn't load the product.</p>
        <p className="mt-2 text-sm text-muted">
          Please check your connection and try again.
        </p>
        <Button type="button" onClick={reload} className="mt-5">
          Try again
        </Button>
      </div>
    );
  } else {
    const variant =
      product.variants.find((v) => v.id === selectedId) ?? product.variants[0];
    const maxQty = Math.min(variant.stock, product.maxPerOrder);
    const outOfStock = variant.stock <= 0;
    const total = product.price * quantity;
    const discount = Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
    );

    // Switching color keeps the quantity within the new color's stock limit.
    const selectVariant = (v) => {
      setSelectedId(v.id);
      setQuantity((q) => Math.max(1, Math.min(q, v.stock, product.maxPerOrder)));
    };

    const handleOrder = () => {
      onOrder?.({ product, variant, quantity, total });
    };

    content = (
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
      >
        {/* Product image: cross-fades when the color changes */}
        <div className="glass-panel relative aspect-square overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${variant.hex}66, transparent 70%)`,
              }}
            >
              {!failed[variant.id] ? (
                <img
                  src={variant.image}
                  alt={`${product.name} in ${variant.name}`}
                  className="h-full w-full object-contain p-8"
                  onError={() =>
                    setFailed((f) => ({ ...f, [variant.id]: true }))
                  }
                />
              ) : (
                // Fallback until real product photos are added
                <span className="text-sm text-muted">
                  {variant.name} image goes here
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Product details */}
        <div>
          <p className="text-sm font-medium tracking-wide text-gold-light">
            Cash on Delivery Available
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
            {product.name}
          </h2>
          <p className="mt-3 text-muted">{product.tagline}</p>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-heading text-3xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice > product.price && (
              <>
                <span className="text-muted line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-light">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Color swatches */}
          <div className="mt-8">
            <p className="text-sm text-muted">
              Color: <span className="font-medium text-white">{variant.name}</span>
            </p>
            <div className="mt-3 flex gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectVariant(v)}
                  aria-label={`Select ${v.name}`}
                  aria-pressed={v.id === variant.id}
                  className={cn(
                    "h-10 w-10 rounded-full border border-white/20 transition-all duration-300",
                    v.id === variant.id
                      ? "scale-110 ring-2 ring-gold ring-offset-2 ring-offset-darkBg"
                      : "hover:scale-105"
                  )}
                  style={{ backgroundColor: v.hex }}
                />
              ))}
            </div>
          </div>

          {/* Stock alert */}
          <p
            className={cn(
              "mt-5 text-sm font-medium",
              outOfStock
                ? "text-red-400"
                : variant.stock <= 5
                ? "text-amber-400"
                : "text-emerald-400"
            )}
          >
            {outOfStock
              ? "Out of stock"
              : variant.stock <= 5
              ? `Hurry, only ${variant.stock} left in this color`
              : "In stock, ready to ship"}
          </p>

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm text-muted">Quantity</span>
            <div className="glass-panel flex items-center rounded-full">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || outOfStock}
                aria-label="Decrease quantity"
                className="p-3 disabled:opacity-30"
              >
                <Minus size={16} />
              </button>
              <span className="w-8 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty || outOfStock}
                aria-label="Increase quantity"
                className="p-3 disabled:opacity-30"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* CTA */}
          <Button
            type="button"
            onClick={handleOrder}
            disabled={outOfStock}
            className="mt-8 w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
          >
            Buy via Cash on Delivery · {formatPrice(total)}
          </Button>

          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <ShieldCheck size={14} className="text-gold" />
            Pay when it arrives. 7-day replacement guarantee.
          </p>
        </div>
      </motion.div>
    );
  }

  // The section (and its id) always exists so "Order COD" links and the
  // mobile bar can find it, even while loading.
  return (
    <section id="buy-now" className="mx-auto max-w-6xl px-5 py-24">
      {content}
    </section>
  );
}