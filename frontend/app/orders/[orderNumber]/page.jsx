"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { Check, RefreshCw } from "lucide-react";
import api from "../../../lib/api.js";
import RequireAuth from "../../../components/RequireAuth.jsx";

const TIMELINE = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered"];
const TIMELINE_LABELS = {
  pending: "Order Placed", confirmed: "Order Confirmed", preparing: "Preparing Your Order",
  out_for_delivery: "Out for Delivery", delivered: "Delivered",
};
const POLL_INTERVAL_MS = 12000;

function OrderDetailInner({ orderNumber }) {
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const prevStatusRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderNumber}`);
        if (cancelled) return;
        if (prevStatusRef.current && prevStatusRef.current !== data.status) {
          setJustUpdated(true);
          setTimeout(() => setJustUpdated(false), 4000);
        }
        prevStatusRef.current = data.status;
        setOrder(data);
      } catch {
        if (!cancelled) setNotFound(true);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [orderNumber]);

  if (notFound) return <div className="max-w-3xl mx-auto px-5 py-20 text-center text-ajwa-ink/50">Order not found.</div>;
  if (!order) return <div className="max-w-3xl mx-auto px-5 py-20 text-center text-ajwa-ink/50">Loading order...</div>;

  const currentIndex = TIMELINE.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-14">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ajwa-navy">Order {order.orderNumber}</h1>
          <p className="text-sm text-ajwa-ink/50 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-ajwa-ink/40">
          <RefreshCw size={12} className="animate-spin" style={{ animationDuration: "3s" }} /> Live status — updates automatically
        </span>
      </div>

      {justUpdated && (
        <div className="mt-4 bg-green-50 text-green-700 px-4 py-2.5 rounded-lg text-sm font-medium animate-fadeUp">
          Your order status was just updated to "{TIMELINE_LABELS[order.status] || order.status.replace(/_/g, " ")}"
        </div>
      )}

      {!isCancelled && (
        <div className="mt-10 flex items-center justify-between">
          {TIMELINE.map((s, i) => (
            <Fragment key={s}>
              <div className="flex flex-col items-center text-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${i <= currentIndex ? "bg-ajwa-navy text-white" : "bg-ajwa-softcream text-ajwa-ink/40"}`}>
                  {i <= currentIndex ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-[11px] mt-2 max-w-[70px] ${i === currentIndex ? "text-ajwa-ink font-semibold" : "text-ajwa-ink/60"}`}>{TIMELINE_LABELS[s]}</span>
              </div>
              {i < TIMELINE.length - 1 && <div className={`flex-1 h-0.5 -mt-6 ${i < currentIndex ? "bg-ajwa-navy" : "bg-ajwa-softcream"}`} />}
            </Fragment>
          ))}
        </div>
      )}
      {isCancelled && <div className="mt-8 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">This order was cancelled.</div>}

      <div className="mt-10 bg-white rounded-xl2 shadow-card p-6">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-2 border-b border-ajwa-navy/10 last:border-0">
            <span>{item.name} {item.variantLabel && `(${item.variantLabel})`} × {item.quantity}</span>
            <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold mt-4 pt-3 border-t border-ajwa-navy/10">
          <span>Total</span><span className="text-ajwa-navy">Rs. {order.total.toLocaleString()}</span>
        </div>
        <div className="text-xs text-ajwa-ink/50 mt-3 space-y-1">
          <div>Payment: {order.paymentMethod?.toUpperCase()} ({order.paymentStatus})</div>
          {order.deliveryAddress && (
            <div>Delivery: {[order.deliveryAddress.houseFlat, order.deliveryAddress.street, order.deliveryAddress.area, order.deliveryAddress.city].filter(Boolean).join(", ")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }) {
  return (
    <RequireAuth>
      <OrderDetailInner orderNumber={params.orderNumber} />
    </RequireAuth>
  );
}
