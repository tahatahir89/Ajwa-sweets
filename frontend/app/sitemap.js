import { siteUrl } from "../lib/business.js";

const STATIC_ROUTES = ["", "/products", "/about", "/contact", "/login", "/register"];

async function fetchSlugs(path) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const categories = await fetchSlugs("/categories");
  const categoryEntries = (categories || []).map((c) => ({
    url: `${siteUrl}/products/${c.slug}`,
    lastModified: new Date(),
  }));

  const products = await fetchSlugs("/products?limit=500");
  const productEntries = (products?.products || []).map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
