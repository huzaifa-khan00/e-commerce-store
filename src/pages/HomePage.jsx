import Hero from "../components/home/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* TEMPORARY placeholder so "Order COD" has somewhere to scroll.
          Replaced by the real variant selector in Module 2. */}
      <section id="buy-now" className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Product section coming in Module 2</p>
      </section>
    </>
  );
}