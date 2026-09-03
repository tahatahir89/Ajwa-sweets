import { Star } from "lucide-react";

export default function StarRating({ rating = 0 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= Math.round(rating) ? "fill-ajwa-gold text-ajwa-gold" : "text-ajwa-navy/20"}
        />
      ))}
    </div>
  );
}
