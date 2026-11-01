import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { generateOrderNumber } from "../utils/orderNumber";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  // Opened directly with no selected product? Send them to pick one.
  if (!order) return <Navigate to="/#buy-now" replace />;

  const handlePlaceOrder = async (customer) => {
    // TEMPORARY: simulates saving the order.
    // Replaced by orderService.createOrder() in the Firebase module.
    await new Promise((resolve) => setTimeout(resolve, 700));
    const orderNumber = generateOrderNumber();

    navigate("/order-success", {
      replace: true,
      state: { orderNumber, order, customer },
    });
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

      <div className="mt-10 grid gap-8 lg:grid-cols-5">
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