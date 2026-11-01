import { Star } from "lucide-react";
import cn from "../../utils/cn";

// Shows 5 stars, filling the first `rating` of them in gold.
export default function StarRating({ rating = 5, size = 16 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={cn(
            n <= rating ? "fill-gold text-gold" : "text-white/20"
          )}
        />
      ))}
    </div>
  );
}