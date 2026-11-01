import Hero from "../components/home/Hero";
import VariantSelector from "../components/home/VariantSelector";

export default function HomePage() {
  // TEMPORARY: proves the selection state works. In the checkout module this
  // becomes a navigation to /checkout carrying the selected order.
  const handleOrder = (order) => {
    alert(
      `${order.quantity} x ${order.variant.name} = Rs. ${order.total} (COD)`
    );
  };

  return (
    <>
      <Hero />
      <VariantSelector onOrder={handleOrder} />
    </>
  );
}