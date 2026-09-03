"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RequireAuth from "./RequireAuth.jsx";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/delivery-zones", label: "Delivery Zones" },
  { href: "/admin/messages", label: "Messages" },
];

function AdminLayoutInner({ children, title }) {
  const pathname = usePathname();
  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-[200px_1fr] gap-8">
      <nav className="flex md:flex-col gap-1 overflow-x-auto">
        {LINKS.map((l) => {
          const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                active ? "bg-ajwa-navy text-white" : "text-ajwa-ink/70 hover:bg-ajwa-softcream"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div>
        <h1 className="font-display text-2xl font-semibold mb-6 text-ajwa-navy">{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children, title }) {
  return (
    <RequireAuth adminOnly>
      <AdminLayoutInner title={title}>{children}</AdminLayoutInner>
    </RequireAuth>
  );
}
