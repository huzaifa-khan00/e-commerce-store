import Reveal from "./Reveal";

// Shared heading block: small gold label, big title, optional subtitle.
export default function SectionHeading({ label, title, subtitle }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center">
      <p className="text-sm font-medium tracking-wide text-gold-light">
        {label}
      </p>
      <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-muted">{subtitle}</p>}
    </Reveal>
  );
}