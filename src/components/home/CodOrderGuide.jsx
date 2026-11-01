import { Banknote, ClipboardList, PhoneCall } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Place Your Order",
    text: "Choose your color and fill in a short delivery form. It takes under a minute.",
  },
  {
    icon: PhoneCall,
    title: "Confirmation Call",
    text: "Our team calls you to confirm the order and your delivery address.",
  },
  {
    icon: Banknote,
    title: "Pay at Your Doorstep",
    text: "Receive your parcel and pay the courier in cash. Nothing upfront.",
  },
];

export default function CodOrderGuide() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <SectionHeading
        label="How It Works"
        title="Order in 3 Simple Steps"
        subtitle="No cards, no advance payment. You pay only when it arrives."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.1}>
            <GlassCard className="relative h-full text-center">
              <span className="absolute left-5 top-4 font-heading text-4xl font-bold text-white/5">
                {i + 1}
              </span>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15">
                <Icon size={26} className="text-gold" />
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