import GlassCard from "../ui/GlassCard";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import { FEATURES } from "../../data/features";

export default function FeatureShowcase() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHeading
        label="Why Choose Us"
        title="Made Better, Down to the Details"
        subtitle="Everything you'd expect from a premium product, with none of the risk."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.08}>
            <GlassCard className="h-full transition-transform duration-300 hover:-translate-y-1">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15">
                <Icon size={22} className="text-gold" />
              </div>
              <h3 className="font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}