import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { createOrder } from "../services/orderService";
import { checkOrderLimit, recordOrder } from "../utils/rateLimit";
import { generateOrderNumber } from "../utils/orderNumber";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const order = state?.order;

  // Opened directly with no selected product? Send them to pick one.
  if (!order) return <Navigate to="/#buy-now" replace />;

  const goToSuccess = (orderNumber, customer) =>
    navigate("/order-success", {
      replace: true,
      state: { orderNumber, order, customer },
    });

  const handlePlaceOrder = async (customer, { bot } = {}) => {
    setError("");

    // Honeypot tripped: pretend it worked, save nothing.
    if (bot) {
      goToSuccess(generateOrderNumber(), customer);
      return;
    }

    const limit = checkOrderLimit();
    if (!limit.allowed) {
      setError(limit.message);
      return;
    }

    try {
      const { orderNumber } = await createOrder(order, customer);
      recordOrder();
      goToSuccess(orderNumber, customer);
    } catch (err) {
      console.error("Order failed:", err);
      setError(
        "We couldn't place your order. Please check your connection and try again, or order on WhatsApp."
      );
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 pt-28">
      <a
        href="/#buy-now"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-white"
      >
        <ArrowLeft size={16} /> Back to product
      </a>

      <h1 className="font-heading text-3xl font-bold sm:text-4xl">
        Complete Your Order
      </h1>
      <p className="mt-2 text-muted">
        Just a few details. You pay when it arrives.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="glass-panel rounded-2xl p-6 lg:col-span-3">
          <CheckoutForm onSubmit={handlePlaceOrder} />
        </div>
        <div className="lg:col-span-2">
          <OrderSummary order={order} />
        </div>
      </div>
    </section>
  );
}