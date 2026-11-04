import Button from "../components/ui/Button";

// Shown for any URL that doesn't exist.
export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-heading text-6xl font-bold text-gold-light">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/">Back to Home</Button>
        <Button href="/track-order" variant="ghost">
          Track Order
        </Button>
      </div>
    </section>
  );
}
