import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import GlassCard from "../ui/GlassCard";
import Input from "../ui/Input";
import cn from "../../utils/cn";
import {
  FLAGSHIP_ID,
  subscribeToAdminProduct,
  updateProductPrice,
  updateVariantStock,
} from "../../services/productService";

const toNumber = (text) => (text.trim() === "" ? NaN : Number(text));

// One color: shows live stock, lets the admin set an exact number.
function VariantRow({ variant, onSave }) {
  const [value, setValue] = useState(String(variant.stock));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Follows the live stock (it also drops when an order is confirmed).
  useEffect(() => {
    setValue(String(variant.stock));
  }, [variant.stock]);

  const changed = value !== String(variant.stock);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      await onSave(variant, toNumber(value));
      setMsg("Saved.");
    } catch (err) {
      setMsg(err.message || "Couldn't save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="flex flex-wrap items-center gap-4 py-4">
      <span
        className="h-8 w-8 shrink-0 rounded-full border border-white/20"
        style={{ backgroundColor: variant.hex }}
      />
      <div className="min-w-[8rem] flex-1">
        <p className="text-sm font-medium">{variant.name}</p>
        <p
          className={cn(
            "text-xs",
            variant.stock === 0 ? "text-red-400" : "text-muted"
          )}
        >
          {variant.stock === 0 ? "Out of stock" : `${variant.stock} in stock`}
        </p>
      </div>
      <input
        type="number"
        inputMode="numeric"
        min="0"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setMsg("");
        }}
        aria-label={`Stock for ${variant.name}`}
        className="glass-panel w-24 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-gold/60"
      />
      <Button
        type="button"
        variant="ghost"
        onClick={save}
        disabled={!changed || saving}
        className="px-5 py-2 disabled:opacity-40"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : "Save"}
      </Button>
      {msg && <p className="w-full text-xs text-muted">{msg}</p>}
    </li>
  );
}

// Price and old (crossed-out) price.
function PriceForm({ product, onSave }) {
  const [price, setPrice] = useState(String(product.price));
  const [oldPrice, setOldPrice] = useState(String(product.compareAtPrice));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setPrice(String(product.price));
    setOldPrice(String(product.compareAtPrice));
  }, [product.price, product.compareAtPrice]);

  const changed =
    price !== String(product.price) || oldPrice !== String(product.compareAtPrice);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      await onSave(toNumber(price), toNumber(oldPrice));
      setMsg("Saved.");
    } catch (err) {
      setMsg(err.message || "Couldn't save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Price (Rs.)"
          type="number"
          inputMode="numeric"
          min="1"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setMsg("");
          }}
        />
        <Input
          label="Old price, crossed out (Rs.)"
          type="number"
          inputMode="numeric"
          min="1"
          value={oldPrice}
          onChange={(e) => {
            setOldPrice(e.target.value);
            setMsg("");
          }}
        />
      </div>
      <p className="text-xs text-muted">
        Customers who already have the page open need to refresh before ordering
        at the new price.
      </p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={save}
          disabled={!changed || saving}
          className="px-6 py-2.5 disabled:opacity-40"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : "Save price"}
        </Button>
        {msg && <span className="text-xs text-muted">{msg}</span>}
      </div>
    </div>
  );
}

export default function StockManager({ admin }) {
  const [data, setData] = useState({
    product: null,
    variants: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    return subscribeToAdminProduct(
      FLAGSHIP_ID,
      ({ product, variants }) =>
        setData({ product, variants, loading: false, error: "" }),
      (err) => {
        console.error("Failed to load product:", err);
        setData({
          product: null,
          variants: [],
          loading: false,
          error: "Couldn't load the product.",
        });
      }
    );
  }, []);

  if (data.loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-gold" />
      </div>
    );
  }
  if (data.error || !data.product) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-sm text-red-300">
        {data.error || "The product document is missing. Run the seed script."}
      </div>
    );
  }

  const { product, variants } = data;

  return (
    <div className="space-y-6">
      <GlassCard>
        <p className="font-semibold">{product.name}</p>
        <div className="mt-4">
          <PriceForm
            product={product}
            onSave={(price, compareAtPrice) =>
              updateProductPrice({
                productId: product.id,
                price,
                compareAtPrice,
                fromPrice: product.price,
                admin,
              })
            }
          />
        </div>
      </GlassCard>

      <GlassCard>
        <p className="font-semibold">Stock by color</p>
        <p className="mt-1 text-xs text-muted">
          Stock drops automatically when you confirm an order. Use this to
          add new stock or correct a count.
        </p>
        <ul className="mt-2 divide-y divide-white/10">
          {variants.map((v) => (
            <VariantRow
              key={v.id}
              variant={v}
              onSave={(variant, to) =>
                updateVariantStock({
                  productId: product.id,
                  variantId: variant.id,
                  from: variant.stock,
                  to,
                  admin,
                })
              }
            />
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
