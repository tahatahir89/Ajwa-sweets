"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { PLACEHOLDER_IMAGE } from "../../lib/placeholder.js";
import RequireAuth from "../../components/RequireAuth.jsx";

function WishlistInner() {
  const { products, loading, toggle } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <h1 className="font-display text-3xl font-semibold mb-8 text-ajwa-navy">My Wishlist</h1>

      {loading ? (
        <p className="text-ajwa-ink/50">Loading your wishlist...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl2 shadow-card">
          <Heart size={40} className="mx-auto text-ajwa-gold mb-4" />
          <p className="text-ajwa-ink/60">Nothing saved yet — tap the heart on any product to add it here.</p>
          <Link href="/products" className="inline-block mt-5 bg-ajwa-navy text-white px-6 py-3 rounded-full font-semibold hover:bg-ajwa-navydark">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => {
            const price = p.variants?.length ? p.variants[0].price : p.basePrice;
            return (
              <div key={p._id} className="bg-white rounded-xl2 shadow-card overflow-hidden">
                <Link href={`/product/${p.slug}`} className="relative block aspect-[4/3] bg-ajwa-softcream overflow-hidden">
                  <Image src={p.images?.[0] || PLACEHOLDER_IMAGE} alt={p.name} fill sizes="33vw" className="object-cover" />
                </Link>
                <div className="p-4">
                  <Link href={`/product/${p.slug}`} className="font-medium hover:text-ajwa-navy">{p.name}</Link>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-ajwa-navy">Rs. {price?.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <button onClick={() => addItem(p, p.variants?.[0]?.label, price, 1)} aria-label="Add to cart" className="p-2 rounded-full bg-ajwa-navy text-white hover:bg-ajwa-navydark">
                        <ShoppingBag size={15} />
                      </button>
                      <button onClick={() => toggle(p)} aria-label="Remove from wishlist" className="p-2 rounded-full border border-ajwa-navy/20 hover:bg-ajwa-softcream">
                        <Heart size={15} className="fill-ajwa-navy text-ajwa-navy" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <RequireAuth>
      <WishlistInner />
    </RequireAuth>
  );
}
