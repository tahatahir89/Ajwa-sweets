"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "../../lib/placeholder.js";
import { useCart } from "../../context/CartContext.jsx";
import api from "../../lib/api.js";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const { data } = await api.get("/coupons/validate", { params: { code: coupon, subtotal } });
      const d = data.type === "percentage" ? (subtotal * data.value) / 100 : data.value;
      setDiscount(data.maxDiscount ? Math.min(d, data.maxDiscount) : d);
      setCouponMsg("Coupon applied!");
    } catch (err) {
      setDiscount(0);
      setCouponMsg(err.response?.data?.message || "Invalid coupon code");
    }
  };

  const deliveryEstimate = subtotal > 0 ? 150 : 0;
  const total = Math.max(subtotal + deliveryEstimate - discount, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-28 text-center">
        <h2 className="font-display text-2xl font-semibold text-ajwa-navy">Your cart is waiting for something delicious!</h2>
        <Link href="/products" className="inline-block mt-6 bg-ajwa-navy text-white px-7 py-3 rounded-full font-semibold hover:bg-ajwa-navydark transition-colors">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-14 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="font-display text-3xl font-semibold mb-6 text-ajwa-navy">Your Cart</h1>
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white rounded-xl2 shadow-card p-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-ajwa-softcream shrink-0">
              <Image src={item.image || PLACEHOLDER_IMAGE} alt={item.name} fill sizes="96px" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <Link href={`/product/${item.slug}`} className="font-medium hover:text-ajwa-navy">{item.name}</Link>
                  {item.variantLabel && <div className="text-xs text-ajwa-ink/50 mt-0.5">{item.variantLabel}</div>}
                </div>
                <button onClick={() => removeItem(item.id)} aria-label="Remove" className="text-ajwa-ink/40 hover:text-ajwa-navy">
                  <Trash2 size={17} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center border border-ajwa-navy/15 rounded-full overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-ajwa-softcream"><Minus size={13} /></button>
                  <span className="px-3 text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-ajwa-softcream"><Plus size={13} /></button>
                </div>
                <span className="font-semibold text-ajwa-navy">Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
        <Link href="/products" className="inline-block text-sm text-ajwa-navy hover:text-ajwa-gold mt-2">← Continue Shopping</Link>
      </div>

      <div className="bg-white rounded-xl2 shadow-card p-6 h-fit sticky top-24">
        <h2 className="font-display text-xl font-semibold mb-5 text-ajwa-navy">Order Summary</h2>
        <div className="flex gap-2 mb-5">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
            className="flex-1 rounded-full border border-ajwa-navy/15 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ajwa-navy/20"
          />
          <button onClick={applyCoupon} className="px-4 py-2 rounded-full bg-ajwa-ink text-white text-sm font-medium hover:bg-black transition-colors">
            Apply
          </button>
        </div>
        {couponMsg && <p className="text-xs text-ajwa-ink/60 -mt-3 mb-4">{couponMsg}</p>}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-ajwa-ink/60">Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-ajwa-ink/60">Delivery (est.)</span><span>Rs. {deliveryEstimate.toLocaleString()}</span></div>
          {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>- Rs. {discount.toLocaleString()}</span></div>}
          <div className="border-t border-ajwa-navy/10 pt-3 flex justify-between font-semibold text-base">
            <span>Total</span><span className="text-ajwa-navy">Rs. {total.toLocaleString()}</span>
          </div>
        </div>
        <p className="text-xs text-ajwa-ink/45 mt-2">Final delivery fee is calculated at checkout based on your area.</p>
        <Link href="/checkout" className="block text-center mt-6 bg-ajwa-navy text-white py-3.5 rounded-full font-semibold hover:bg-ajwa-navydark transition-colors">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
