"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import StarRating from "./StarRating.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { PLACEHOLDER_IMAGE } from "../lib/placeholder.js";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const price = product.variants?.length ? product.variants[0].price : product.basePrice;
  const wishlisted = isWishlisted(product._id);

  const quickAdd = (e) => {
    e.preventDefault();
    addItem(product, product.variants?.[0]?.label, price, 1);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    toggle(product);
  };

  return (
    <div className="group relative rounded-xl2 bg-white shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-ajwa-softcream">
          <Image
            src={product.images?.[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-card transition-opacity ${
              wishlisted ? "bg-ajwa-navy text-white opacity-100" : "bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart size={16} className={wishlisted ? "fill-white" : ""} />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-3 flex justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-1.5 bg-ajwa-ink/90 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <Eye size={13} /> Quick View
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-medium leading-snug text-ajwa-navy">{product.name}</h3>
          <p className="text-sm text-ajwa-ink/60 mt-1 line-clamp-2">{product.shortDescription}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-ajwa-ink/50">({product.numReviews})</span>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4 flex items-center justify-between">
        <span className="font-semibold text-ajwa-navy">Rs. {price?.toLocaleString()}</span>
        <button
          onClick={quickAdd}
          className="inline-flex items-center gap-1.5 bg-ajwa-navy text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-ajwa-navydark transition-colors"
        >
          <ShoppingBag size={14} /> Add
        </button>
      </div>
    </div>
  );
}
