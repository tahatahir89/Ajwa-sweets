"use client";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import api from "../../../lib/api.js";
import AdminLayout from "../../../components/AdminLayout.jsx";
import ConfirmModal from "../../../components/ConfirmModal.jsx";

const STATUSES = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700", out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortDir, setSortDir] = useState("desc");
  const [expandedId, setExpandedId] = useState(null);
  const [clearStep, setClearStep] = useState(0);
  const [clearing, setClearing] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/orders", { params: statusFilter ? { status: statusFilter } : {} });
      setOrders(data);
    } catch {
      setError("Could not load orders — check that the backend is running and connected.");
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      load();
    } catch {
      setError("Could not update order status");
    }
  };

  const confirmClearAll = async () => {
    setClearing(true);
    setError("");
    try {
      await api.delete("/orders");
      setClearStep(0);
      setSuccessMsg("All orders have been cleared successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
      load();
    } catch {
      setClearStep(0);
      setError("Could not clear orders — please try again.");
    } finally {
      setClearing(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.guestInfo?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.guestInfo?.email?.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (sortDir === "desc" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)));
    return list;
  }, [orders, search, sortDir]);

  return (
    <AdminLayout title="Orders">
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {successMsg && <p className="text-sm text-green-700 mb-4">{successMsg}</p>}

      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, customer name, or email"
          className="input flex-1 min-w-[220px]"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <button
          onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
          className="inline-flex items-center gap-1 px-4 py-2.5 rounded-lg border border-ajwa-navy/20 text-sm font-medium hover:bg-ajwa-softcream"
        >
          Date {sortDir === "desc" ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
        <button
          onClick={() => setClearStep(1)}
          disabled={orders.length === 0}
          className="ml-auto inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 size={14} /> Clear All Orders
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((o) => {
          const customerName = o.user?.name || o.guestInfo?.name || "Guest";
          const customerEmail = o.user?.email || o.guestInfo?.email || "—";
          const customerPhone = o.user?.phone || o.guestInfo?.phone || "—";
          const address = o.deliveryAddress
            ? [o.deliveryAddress.houseFlat, o.deliveryAddress.street, o.deliveryAddress.area, o.deliveryAddress.city].filter(Boolean).join(", ")
            : "—";
          const isOpen = expandedId === o._id;

          return (
            <div key={o._id} className="bg-white rounded-xl2 shadow-card overflow-hidden">
              <button onClick={() => setExpandedId(isOpen ? null : o._id)} className="w-full text-left p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-ajwa-ink/60">{o.orderNumber}</div>
                  <div className="font-medium mt-0.5">{customerName}</div>
                  <div className="text-xs text-ajwa-ink/40">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-ajwa-navy">Rs. {o.total?.toLocaleString()}</span>
                  <select
                    value={o.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize border-0 ${STATUS_STYLES[o.status]}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-ajwa-navy/10 p-4 bg-ajwa-cream/40 text-sm grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div><span className="text-ajwa-ink/50">Email:</span> {customerEmail}</div>
                    <div><span className="text-ajwa-ink/50">Phone:</span> {customerPhone}</div>
                    <div><span className="text-ajwa-ink/50">Delivery Address:</span> {address}</div>
                    <div><span className="text-ajwa-ink/50">Payment:</span> {o.paymentMethod?.toUpperCase()} ({o.paymentStatus})</div>
                  </div>
                  <div>
                    <span className="text-ajwa-ink/50">Items:</span>
                    <ul className="mt-1 space-y-1">
                      {o.items.map((item, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{item.name} {item.variantLabel && `(${item.variantLabel})`} × {item.quantity}</span>
                          <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-ajwa-ink/50 text-sm py-10">No orders match, or backend not connected.</p>}
      </div>

      <ConfirmModal
        open={clearStep === 1}
        title="Are you sure you want to clear all orders?"
        message="This will permanently remove every order from the system."
        onConfirm={() => setClearStep(2)}
        onCancel={() => setClearStep(0)}
      />
      <ConfirmModal
        open={clearStep === 2}
        confirming={clearing}
        title="This action cannot be undone"
        message="This will remove all orders from the customer/order database. This cannot be undone. Are you sure you want to continue?"
        onConfirm={confirmClearAll}
        onCancel={() => setClearStep(0)}
      />
    </AdminLayout>
  );
}
