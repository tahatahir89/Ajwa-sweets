"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../lib/api.js";
import RequireAuth from "../../components/RequireAuth.jsx";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function OrdersInner() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/mine");
        if (!cancelled) setOrders(data);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-14">
      <h1 className="font-display text-3xl font-semibold mb-8 text-ajwa-navy">My Orders</h1>
      {loading ? (
        <p className="text-ajwa-ink/50">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl2 shadow-card">
          <p className="text-ajwa-ink/60">No orders yet — orders you place while logged in will show up here.</p>
          <Link href="/products" className="inline-block mt-5 bg-ajwa-navy text-white px-6 py-3 rounded-full font-semibold hover:bg-ajwa-navydark">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o._id} href={`/orders/${o._id}`} className="block bg-white rounded-xl2 shadow-card p-5 hover:shadow-soft transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-sm text-ajwa-ink/60">{o.orderNumber}</div>
                  <div className="text-xs text-ajwa-ink/40 mt-1">{new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[o.status]}`}>
                  {o.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between items-end mt-3">
                <span className="text-sm text-ajwa-ink/60">{o.items.length} item(s)</span>
                <span className="font-semibold text-ajwa-navy">Rs. {o.total.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersInner />
    </RequireAuth>
  );
}
