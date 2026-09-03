"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { itemCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur shadow-card" : "bg-ajwa-cream/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-10 h-10 rounded-full bg-ajwa-navy flex items-center justify-center shrink-0">
            <span className="text-ajwa-gold font-display text-lg">A</span>
          </span>
          <span className="font-display text-2xl font-semibold tracking-tight text-ajwa-navy">
            Ajwa <span className="text-ajwa-gold">Sweets</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-ajwa-ink/80 hover:text-ajwa-navy transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Search" onClick={() => setSearchOpen((s) => !s)} className="p-2 rounded-full hover:bg-ajwa-softcream transition-colors">
            <Search size={20} />
          </button>
          <Link href={user ? "/account" : "/login"} aria-label="Account" className="p-2 rounded-full hover:bg-ajwa-softcream transition-colors hidden sm:block">
            <User size={20} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative p-2 rounded-full hover:bg-ajwa-softcream transition-colors">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-ajwa-gold text-ajwa-navydark text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button className="md:hidden p-2" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="max-w-7xl mx-auto px-5 md:px-8 pb-4 animate-fadeUp">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cakes, mithai, bakery items..."
            className="w-full rounded-full border border-ajwa-navy/15 bg-white px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ajwa-navy/30"
          />
        </form>
      )}

      {open && (
        <div className="md:hidden bg-ajwa-cream border-t border-ajwa-navy/10 px-5 py-4 flex flex-col gap-4 animate-fadeUp">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-base font-medium text-ajwa-ink">
              {link.label}
            </Link>
          ))}
          <Link href={user ? "/account" : "/login"} onClick={() => setOpen(false)} className="text-base font-medium text-ajwa-ink">
            {user ? "My Account" : "Login / Register"}
          </Link>
        </div>
      )}
    </header>
  );
}
