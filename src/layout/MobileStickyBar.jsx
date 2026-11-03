import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../components/ui/Button";
import useProduct from "../hooks/useProduct";
import { formatPrice } from "../utils/formatters";

// Bottom-anchored quick-buy bar, mobile only.
// Appears after the hero, hides while the product section is on screen
// (it would duplicate the main order button there).
export default function MobileStickyBar() {
  const { product } = useProduct();
  const [pastHero, setPastHero] = useState(false);
  const [buyVisible, setBuyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById("buy-now");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBuyVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const show = pastHero && !buyVisible && product;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-nav fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-b-0 border-t border-white/10 px-5 py-3 md:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div>
            <p className="text-xs text-muted">Cash on Delivery</p>
            <p className="font-heading text-lg font-semibold">
              {formatPrice(product.price)}
            </p>
          </div>
          <Button href="#buy-now" className="px-6 py-2.5">
            Order COD
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}