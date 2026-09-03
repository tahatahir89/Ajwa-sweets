import ProductDetailView from "../../../components/ProductDetailView.jsx";
import { siteUrl } from "../../../lib/business.js";

async function getProduct(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/products/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 155),
    alternates: { canonical: `/product/${params.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);

  const jsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.shortDescription || product.description,
        image: product.images,
        sku: product._id,
        offers: {
          "@type": "Offer",
          priceCurrency: "PKR",
          price: product.variants?.[0]?.price ?? product.basePrice,
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/product/${params.slug}`,
        },
        aggregateRating:
          product.numReviews > 0
            ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.numReviews }
            : undefined,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <ProductDetailView slug={params.slug} initialProduct={product} />
    </>
  );
}
