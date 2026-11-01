import GlassCard from "../ui/GlassCard";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import StarRating from "../ui/StarRating";
import { REVIEWS } from "../../data/reviews";

export default function Reviews() {
  return (
    <section id="reviews" className="mx-auto max-w-6xl px-5 pb-24">
      <SectionHeading
        label="Customer Reviews"
        title="Loved by Buyers Across Pakistan"
      />
      <div className="grid gap-5 md:grid-cols-3">
        {REVIEWS.map((review, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <GlassCard className="flex h-full flex-col">
              <StarRating rating={review.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                "{review.text}"
              </p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="text-xs text-muted">{review.city}</p>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}