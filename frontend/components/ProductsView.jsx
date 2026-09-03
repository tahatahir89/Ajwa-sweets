"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import api from "../lib/api.js";
import ProductCard from "./ProductCard.jsx";
import SkeletonCard from "./SkeletonCard.jsx";
import { business } from "../lib/business.js";

export default function ProductsView({ categorySlug: routeCategorySlug }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("search") || "";
  const categoryFilter = routeCategorySlug || searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const setQuery = (params) => {
    const usp = new URLSearchParams(params);
    router.push(`${routeCategorySlug ? "/products" : pathname}${usp.toString() ? `?${usp}` : ""}`);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const catRes = await api.get("/categories");
        if (!cancelled) setCategories(catRes.data || []);
      } catch {
        /* no bundled fake fallback — categories simply won't render as filters */
      }
      try {
        const params = {};
        if (search) params.search = search;
        if (categoryFilter) params.category = categoryFilter;
        const prodRes = await api.get("/products", { params });
        if (cancelled) return;
        setProducts(prodRes.data.products || []);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setFetchError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search, categoryFilter]);

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price_asc") list.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));
    if (sort === "price_desc") list.sort((a, b) => (b.basePrice || 0) - (a.basePrice || 0));
    if (sort === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [products, sort]);

  const activeCategoryName =
    categories.find((c) => c.slug === categoryFilter)?.name ||
    business.categories.find((c) => c.toLowerCase().replace(/\s+/g, "-") === categoryFilter);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-14">
      <h1 className="font-display text-3xl md:text-4xl font-semibold text-ajwa-navy">
        {search ? `Results for "${search}"` : activeCategoryName || "All Products"}
      </h1>

      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={() => setQuery(search ? { search } : {})}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            !categoryFilter ? "bg-ajwa-navy text-white border-ajwa-navy" : "border-ajwa-navy/20 text-ajwa-ink/70 hover:bg-ajwa-softcream"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c._id || c.slug}
            onClick={() => setQuery({ category: c.slug })}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              categoryFilter === c.slug ? "bg-ajwa-navy text-white border-ajwa-navy" : "border-ajwa-navy/20 text-ajwa-ink/70 hover:bg-ajwa-softcream"
            }`}
          >
            {c.name}
          </button>
        ))}

        <select
          value={sort}
          onChange={(e) =>
            setQuery({ ...(categoryFilter && { category: categoryFilter }), ...(search && { search }), sort: e.target.value })
          }
          className="ml-auto rounded-full border border-ajwa-navy/20 px-4 py-2 text-sm bg-white"
        >
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : fetchError ? (
        <div className="text-center py-24">
          <h3 className="font-display text-xl font-semibold">Couldn't load products right now</h3>
          <p className="text-ajwa-ink/60 mt-2 text-sm">Please check your connection and try again shortly.</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-24">
          <h3 className="font-display text-xl font-semibold">
            {categoryFilter && !search ? "No products available in this category." : "No treats found!"}
          </h3>
          <p className="text-ajwa-ink/60 mt-2 text-sm">Try a different search term or browse another category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
          {sorted.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
