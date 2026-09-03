"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api.js";
import AdminLayout from "../../components/AdminLayout.jsx";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, products: 0, customers: 0, revenue: 0, dailyRevenue: 0, newMessages: 0 });

  useEffect(() => {
    (async () => {
      try {
        const [orders, products, users, messages] = await Promise.all([
          api.get("/orders"), api.get("/products", { params: { limit: 1 } }), api.get("/users"), api.get("/messages", { params: { status: "new" } }),
        ]);

        const revenue = orders.data.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.total : 0), 0);

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const dailyRevenue = orders.data
          .filter((o) => o.status !== "cancelled" && new Date(o.createdAt) >= startOfToday)
          .reduce((sum, o) => sum + o.total, 0);

        setStats({
          orders: orders.data.length,
          products: products.data.total,
          customers: users.data.length,
          revenue,
          dailyRevenue,
          newMessages: messages.data.length,
        });
      } catch {
        /* backend not reachable yet — cards stay at zero rather than showing fake numbers */
      }
    })();
  }, []);

  const cards = [
    { label: "Today's Revenue", value: `Rs. ${stats.dailyRevenue.toLocaleString()}` },
    { label: "Total Orders", value: stats.orders },
    { label: "Products", value: stats.products },
    { label: "Customers", value: stats.customers },
    { label: "Revenue (paid)", value: `Rs. ${stats.revenue.toLocaleString()}` },
    { label: "New Messages", value: stats.newMessages },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl2 shadow-card p-5">
            <div className="text-xs text-ajwa-ink/50 uppercase tracking-wide">{c.label}</div>
            <div className="font-display text-2xl font-semibold mt-1 text-ajwa-navy">{c.value}</div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
