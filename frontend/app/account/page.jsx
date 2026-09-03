"use client";
import Link from "next/link";
import { Package, MapPin, Heart, LogOut, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import RequireAuth from "../../components/RequireAuth.jsx";

function AccountInner() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-ajwa-softcream flex items-center justify-center">
          <User size={26} className="text-ajwa-navy" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ajwa-navy">{user?.name}</h1>
          <p className="text-sm text-ajwa-ink/60">{user?.email}</p>
        </div>
      </div>

      {user?.role === "admin" && (
        <Link href="/admin" className="block bg-ajwa-navy text-white rounded-xl2 shadow-soft p-6 flex items-center gap-4 hover:bg-ajwa-navydark transition-colors mb-6">
          <LayoutDashboard />
          <div>
            <div className="font-semibold">Go to Admin Dashboard</div>
            <div className="text-xs text-white/70">Manage products, orders, customers, and messages</div>
          </div>
        </Link>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <Link href="/orders" className="bg-white rounded-xl2 shadow-card p-6 flex items-center gap-4 hover:shadow-soft transition-shadow">
          <Package className="text-ajwa-navy" />
          <div>
            <div className="font-semibold">My Orders</div>
            <div className="text-xs text-ajwa-ink/50">Track and view your order history</div>
          </div>
        </Link>
        <Link href="/account/addresses" className="bg-white rounded-xl2 shadow-card p-6 flex items-center gap-4 hover:shadow-soft transition-shadow">
          <MapPin className="text-ajwa-navy" />
          <div>
            <div className="font-semibold">Saved Addresses</div>
            <div className="text-xs text-ajwa-ink/50">Manage your delivery addresses</div>
          </div>
        </Link>
        <Link href="/wishlist" className="bg-white rounded-xl2 shadow-card p-6 flex items-center gap-4 hover:shadow-soft transition-shadow">
          <Heart className="text-ajwa-navy" />
          <div>
            <div className="font-semibold">Wishlist</div>
            <div className="text-xs text-ajwa-ink/50">Products you've saved for later</div>
          </div>
        </Link>
        <button onClick={logout} className="bg-white rounded-xl2 shadow-card p-6 flex items-center gap-4 hover:shadow-soft transition-shadow text-left">
          <LogOut className="text-ajwa-navy" />
          <div>
            <div className="font-semibold">Logout</div>
            <div className="text-xs text-ajwa-ink/50">Sign out of your account</div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountInner />
    </RequireAuth>
  );
}
