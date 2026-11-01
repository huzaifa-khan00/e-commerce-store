import Hero from "../components/home/Hero";
import TrustBar from "../components/home/TrustBar";
import VariantSelector from "../components/home/VariantSelector";
import FeatureShowcase from "../components/home/FeatureShowcase";
import CodOrderGuide from "../components/home/CodOrderGuide";
import Reviews from "../components/home/Reviews";
import FAQ from "../components/home/FAQ";

export default function HomePage() {
  // TEMPORARY: replaced by navigation to /checkout in the checkout module.
  const handleOrder = (order) => {
    alert(
      `${order.quantity} x ${order.variant.name} = Rs. ${order.total} (COD)`
    );
  };

  return (
    <>
      <Hero />
      <TrustBar />
      <VariantSelector onOrder={handleOrder} />
      <FeatureShowcase />
      <CodOrderGuide />
      <Reviews />
      <FAQ />
    </>
  );
}