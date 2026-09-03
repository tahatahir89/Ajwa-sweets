import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "../lib/placeholder.js";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative rounded-xl2 overflow-hidden aspect-[3/4] block shadow-card hover:shadow-soft transition-shadow"
    >
      <Image
        src={category.image || PLACEHOLDER_IMAGE}
        alt={category.name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ajwa-navydark/90 via-ajwa-navy/20 to-transparent transition-opacity group-hover:from-ajwa-navy/95" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="font-display text-xl font-semibold">{category.name}</h3>
        <p className="text-xs text-white/80 mt-1 line-clamp-1">{category.description}</p>
        <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ajwa-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
          Shop now <ArrowUpRight size={14} />
        </div>
      </div>
    </Link>
  );
}
