"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import api from "../lib/api.js";
import CategoryCard from "../components/CategoryCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { business } from "../lib/business.js";

function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function Stat({ value, suffix, label }) {
  const count = useCountUp(value);
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl font-semibold text-ajwa-navy">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-ajwa-ink/60 mt-1">{label}</div>
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products", { params: { featured: true, limit: 9 } }),
        ]);
        setCategories(catRes.data || []);
        setBestSellers(prodRes.data?.products || []);
      } catch {
        // Real failure — categories/best-sellers just stay empty; no fake data.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ajwa-navy via-ajwa-navy to-ajwa-navydark">
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center relative">
          <div className="relative z-10 animate-fadeUp">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-ajwa-navydark bg-ajwa-gold px-3 py-1.5 rounded-full mb-5">
              Bakery & Sweets — Gulshan-e-Iqbal, Karachi
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] text-white">
              From Breakfast
              <br />
              <span className="text-ajwa-gold">To Dessert.</span>
            </h1>
            <p className="mt-6 text-white/70 text-base md:text-lg max-w-md">
              {business.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="inline-flex items-center gap-2 bg-ajwa-gold text-ajwa-navydark px-7 py-3.5 rounded-full font-semibold shadow-soft hover:brightness-95 transition">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors">
                Visit Our Shop
              </Link>
            </div>
          </div>

          <div className="relative h-[380px] md:h-[460px] flex items-center justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/5 backdrop-blur flex items-center justify-center animate-floaty">
              <Image src="/logo.jpg" alt={`${business.displayName} logo`} width={220} height={220} className="rounded-full object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ajwa-navy">What We Offer</h2>
          <Link href="/products" className="text-sm font-medium text-ajwa-navy hidden sm:inline-flex items-center gap-1 hover:text-ajwa-gold transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat._id || cat.slug} category={cat} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {business.categories.map((c) => (
              <span key={c} className="px-4 py-2.5 rounded-full bg-white shadow-card text-sm font-medium text-ajwa-navy">
                {c}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* BEST SELLERS */}
      <section className="bg-white/60 py-20">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ajwa-navy">Our Best Sellers</h2>
            <Link href="/products" className="text-sm font-medium text-ajwa-navy hidden sm:inline-flex items-center gap-1 hover:text-ajwa-gold transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : bestSellers.length > 0 ? (
              bestSellers.slice(0, 9).map((p) => <ProductCard key={p._id} product={p} />)
            ) : (
              <p className="col-span-full text-center text-ajwa-ink/50 py-10">
                No featured products yet — check back soon, or browse the full menu.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-xl2 shadow-card w-full h-[360px] bg-ajwa-navy flex items-center justify-center">
          <Image src="/logo.jpg" alt={`${business.displayName} storefront logo`} width={200} height={200} className="rounded-full" />
        </div>
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-ajwa-navy">Visit {business.displayName}</h2>
          <p className="text-ajwa-ink/70 leading-relaxed">{business.description}</p>
          <div className="grid grid-cols-2 gap-6 mt-8">
            <Stat value={business.categories.length} suffix="" label="Categories of Treats" />
            <Stat value={17} suffix="h" label="Open Daily" />
          </div>
          <Link href="/about" className="inline-flex items-center gap-1 mt-8 text-ajwa-navy font-medium hover:text-ajwa-gold transition-colors">
            Read our story <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
