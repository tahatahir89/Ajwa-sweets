"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Heart, Truck, ShieldCheck } from "lucide-react";
import api from "../lib/api.js";
import StarRating from "./StarRating.jsx";
import StarRatingInput from "./StarRatingInput.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { PLACEHOLDER_IMAGE } from "../lib/placeholder.js";
import { business } from "../lib/business.js";

export default function ProductDetailView({ slug, initialProduct }) {
  const [product, setProduct] = useState(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState(initialProduct?.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const { user } = useAuth();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
      setVariant((prev) => prev || data.variants?.[0] || null);
    } catch {
      setProduct(null);
    }
  };

  useEffect(() => {
    if (!initialProduct) {
      setLoading(true);
      fetchProduct().finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <div className="max-w-7xl mx-auto px-5 py-24 text-center text-ajwa-ink/50">Loading...</div>;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-24 text-center">
        <h2 className="font-display text-2xl font-semibold">Product not found</h2>
        <Link href="/products" className="text-ajwa-navy hover:text-ajwa-gold mt-3 inline-block">Back to Products</Link>
      </div>
    );
  }

  const price = variant?.price ?? product.basePrice;
  const myReview = user ? product.reviews?.find((r) => (r.user?._id || r.user) === user._id) : null;

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) {
      setReviewError("Please select a star rating.");
      return;
    }
    setReviewSubmitting(true);
    setReviewError("");
    try {
      await api.post(`/products/${product._id}/reviews`, { rating: reviewRating, comment: reviewComment });
      setReviewSuccess(true);
      setReviewComment("");
      setReviewRating(0);
      await fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || "Could not submit your review — please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="relative rounded-xl2 overflow-hidden bg-ajwa-softcream aspect-square">
            <Image src={product.images?.[activeImage] || PLACEHOLDER_IMAGE} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImage === i ? "border-ajwa-navy" : "border-transparent"}`}>
                  <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ajwa-navy">{product.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <StarRating rating={product.rating} />
            <span className="text-sm text-ajwa-ink/50">({product.numReviews} reviews)</span>
          </div>
          <div className="mt-5 text-2xl font-semibold text-ajwa-navy">Rs. {price?.toLocaleString()}</div>
          <p className="mt-4 text-ajwa-ink/70 leading-relaxed">{product.description || product.shortDescription}</p>

          {product.variants?.length > 0 && (
            <div className="mt-6">
              <span className="text-sm font-medium">Size / Weight</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.variants.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => setVariant(v)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      variant?.label === v.label ? "bg-ajwa-navy text-white border-ajwa-navy" : "border-ajwa-navy/20 hover:bg-ajwa-softcream"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-ajwa-navy/20 rounded-full overflow-hidden">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-ajwa-softcream"><Minus size={14} /></button>
              <span className="px-4 text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-2.5 hover:bg-ajwa-softcream"><Plus size={14} /></button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-7">
            <button
              onClick={() => addItem(product, variant?.label, price, quantity)}
              className="flex-1 min-w-[160px] bg-ajwa-navy text-white py-3.5 rounded-full font-semibold hover:bg-ajwa-navydark transition-colors"
            >
              Add to Cart
            </button>
            <Link
              href="/checkout"
              onClick={() => addItem(product, variant?.label, price, quantity)}
              className="flex-1 min-w-[160px] text-center border border-ajwa-navy text-ajwa-navy py-3.5 rounded-full font-semibold hover:bg-ajwa-softcream transition-colors"
            >
              Buy Now
            </Link>
            <button aria-label={isWishlisted(product._id) ? "Remove from wishlist" : "Add to wishlist"} onClick={() => toggle(product)} className={`p-3.5 rounded-full border transition-colors ${isWishlisted(product._id) ? "bg-ajwa-navy border-ajwa-navy text-white" : "border-ajwa-navy/20 hover:bg-ajwa-softcream"}`}>
              <Heart size={18} className={isWishlisted(product._id) ? "fill-white" : ""} />
            </button>
          </div>

          <div className="mt-4">
            <WhatsAppButton
              floating={false}
              label="Ask about this on WhatsApp"
              message={`Hello ${business.displayName}, I'd like to ask about ${product.name}${variant ? ` (${variant.label})` : ""}.`}
            />
          </div>

          <div className="mt-8 space-y-3 border-t border-ajwa-navy/10 pt-6 text-sm text-ajwa-ink/70">
            <div className="flex items-center gap-2"><Truck size={16} className="text-ajwa-navy" /> Delivery charges calculated at checkout by your area</div>
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-ajwa-navy" /> Freshly prepared, quality checked before dispatch</div>
          </div>

          {product.ingredients?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-2">Ingredients</h3>
              <p className="text-sm text-ajwa-ink/60">{product.ingredients.join(", ")}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold mb-6 text-ajwa-navy">Customer Reviews</h2>

        {product.reviews?.length > 0 ? (
          <div className="space-y-5 mb-10">
            {product.reviews.map((r, i) => (
              <div key={r._id || i} className="border-b border-ajwa-navy/10 pb-5 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.name}</span>
                  <span className="text-xs text-ajwa-ink/40">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</span>
                </div>
                <StarRating rating={r.rating} />
                {r.comment && <p className="text-sm text-ajwa-ink/70 mt-2">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ajwa-ink/50 mb-10">No reviews yet — be the first to share what you thought.</p>
        )}

        {!user ? (
          <p className="text-sm text-ajwa-ink/60">
            <Link href="/login" className="text-ajwa-navy font-medium hover:text-ajwa-gold">Log in</Link> to write a review.
          </p>
        ) : myReview ? (
          <p className="text-sm text-ajwa-ink/60">You've already reviewed this product — thanks for your feedback!</p>
        ) : (
          <form onSubmit={submitReview} className="bg-white rounded-xl2 shadow-card p-6 space-y-4">
            <h3 className="font-semibold">Write a Review</h3>
            <StarRatingInput value={reviewRating} onChange={setReviewRating} />
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your thoughts about this product (optional)"
              rows={3}
              className="input"
            />
            {reviewError && <p className="text-sm text-red-600">{reviewError}</p>}
            {reviewSuccess && <p className="text-sm text-green-700">Thanks — your review has been posted!</p>}
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="bg-ajwa-navy text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-ajwa-navydark transition-colors disabled:opacity-60"
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
