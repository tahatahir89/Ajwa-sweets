import Link from "next/link";
import { Facebook, MapPin, Clock } from "lucide-react";
import { business } from "../lib/business.js";

export default function Footer() {
  return (
    <footer className="bg-ajwa-navydark text-white/80 mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-display text-2xl text-white mb-3">{business.displayName}</h3>
          <p className="text-sm text-white/60">{business.tagline}</p>
          <div className="flex gap-3 mt-5">
            {business.social.facebook && (
              <a
                href={business.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Facebook size={16} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/products" className="hover:text-white">Products</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/account" className="hover:text-white">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Visit Us</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-ajwa-gold" />
              <a href={business.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {business.address.line1}, {business.address.line2}, {business.address.city}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} className="shrink-0 text-ajwa-gold" /> {business.hours.display}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">What We Offer</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {business.categories.slice(0, 5).map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {business.displayName}. All Rights Reserved.
      </div>
    </footer>
  );
}
