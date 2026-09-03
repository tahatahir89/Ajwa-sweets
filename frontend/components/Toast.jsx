"use client";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function Toast() {
  const { toast: cartToast } = useCart();
  const { toast: wishlistToast } = useWishlist();
  const message = cartToast || wishlistToast;

  if (!message) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-ajwa-navy text-white text-sm font-medium px-5 py-3 rounded-full shadow-soft animate-fadeUp">
      {message}
    </div>
  );
}
