import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";
import WhatsAppButton from "../components/checkout/WhatsAppButton";

export default function OrderSuccessPage() {
  const { state } = useLocation();

  if (!state?.orderNumber) return <Navigate to="/" replace />;
  const { orderNumber, order, customer } = state;

  return (
    <section className="mx-auto max-w-xl px-5 pb-20 pt-32 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15"
      >
        <CheckCircle2 size={44} className="text-emerald-400" />
      </motion.div>

      <h1 className="font-heading text-3xl font-bold">Order Placed!</h1>
      <p className="mt-3 text-muted">
        Thank you, {customer.fullName.split(" ")[0]}. We'll call you shortly to
        confirm your order.
      </p>

      <GlassCard className="mt-8">
        <p className="text-sm text-muted">Your order number</p>
        <p className="mt-1 font-heading text-3xl font-bold tracking-wider text-gold-light">
          {orderNumber}
        </p>
        <p className="mt-2 text-xs text-muted">
          Save this number. You'll need it to track your order.
        </p>
      </GlassCard>

      <GlassCard className="mt-5 text-left">
        <p className="font-medium">What happens next</p>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li>1. Our team calls {customer.phone} to confirm.</li>
          <li>2. Your parcel is dispatched with a courier.</li>
          <li>3. Pay the courier in cash on delivery.</li>
        </ol>
      </GlassCard>

      <div className="mt-6 space-y-3">
        <WhatsAppButton
          orderNumber={orderNumber}
          order={order}
          customer={customer}
        />
        <Button href="/" variant="ghost" className="w-full">
          Back to Home
        </Button>
      </div>
    </section>
  );
}