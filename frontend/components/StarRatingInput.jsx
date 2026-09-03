"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRatingInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${n} stars`}
        >
          <Star size={22} className={n <= (hover || value) ? "fill-ajwa-gold text-ajwa-gold" : "text-ajwa-navy/20"} />
        </button>
      ))}
    </div>
  );
}
