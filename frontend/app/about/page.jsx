import Image from "next/image";
import { business } from "../../lib/business.js";

export const metadata = {
  title: "About Us",
  description: `Learn about ${business.displayName}, a bakery and sweets shop in Gulshan-e-Iqbal, Karachi.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-16">
      <h1 className="font-display text-4xl font-semibold text-center mb-3 text-ajwa-navy">About {business.displayName}</h1>
      <p className="text-center text-ajwa-ink/60 max-w-2xl mx-auto mb-12">{business.description}</p>

      <div className="w-full h-[280px] rounded-xl2 shadow-card mb-12 bg-ajwa-navy flex items-center justify-center">
        <Image src="/logo.jpg" alt={`${business.displayName} logo`} width={180} height={180} className="rounded-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {business.categories.map((c) => (
          <div key={c} className="bg-white rounded-xl2 shadow-card p-5 text-center font-medium text-ajwa-navy">
            {c}
          </div>
        ))}
      </div>

      <div className="prose max-w-none text-ajwa-ink/70 leading-relaxed">
        <p>
          Located on main Rashid Minhas Road in Block 10-A, Gulshan-e-Iqbal, {business.displayName} serves the
          neighbourhood {business.hours.display.toLowerCase()}. Whether it's a fresh breakfast, a box of mithai for
          a celebration, or a custom cake, the shop covers a wide range of bakery and sweets favourites under one
          roof.
        </p>
      </div>
    </div>
  );
}
