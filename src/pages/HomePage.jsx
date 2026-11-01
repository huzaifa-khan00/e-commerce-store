import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/home/Hero";
import TrustBar from "../components/home/TrustBar";
import VariantSelector from "../components/home/VariantSelector";
import FeatureShowcase from "../components/home/FeatureShowcase";
import CodOrderGuide from "../components/home/CodOrderGuide";
import Reviews from "../components/home/Reviews";
import FAQ from "../components/home/FAQ";
import Footer from "../layout/Footer";
import MobileStickyBar from "../layout/MobileStickyBar";

export default function HomePage() {
  const navigate = useNavigate();

  // Coming from another page with a link like /#buy-now: the browser can't
  // scroll until React has rendered, so we scroll here once the page is ready.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const timer = setTimeout(
      () => document.getElementById(id)?.scrollIntoView(),
      50
    );
    return () => clearTimeout(timer);
  }, []);

  // Sends the selected variant and quantity to the checkout page.
  const handleOrder = (order) => {
    navigate("/checkout", { state: { order } });
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
      <Footer />
      <MobileStickyBar />
    </>
  );
}