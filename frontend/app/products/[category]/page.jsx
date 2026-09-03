import { Suspense } from "react";
import ProductsView from "../../../components/ProductsView.jsx";

export async function generateMetadata({ params }) {
  const name = params.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: name,
    description: `Shop ${name} from Ajwa Sweets & Bakers in Gulshan-e-Iqbal, Karachi.`,
    alternates: { canonical: `/products/${params.category}` },
  };
}

export default function CategoryProductsPage({ params }) {
  return (
    <Suspense fallback={null}>
      <ProductsView categorySlug={params.category} />
    </Suspense>
  );
}
