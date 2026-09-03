import { Suspense } from "react";
import ProductsView from "../../components/ProductsView.jsx";

export const metadata = {
  title: "All Products",
  description: "Browse cakes, mithai, cookies, bakery goods, and desserts from Ajwa Sweets & Bakers in Gulshan-e-Iqbal, Karachi.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsView />
    </Suspense>
  );
}
