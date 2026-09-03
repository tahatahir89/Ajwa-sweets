import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import WhatsAppButton from "../../../../components/WhatsAppButton.jsx";
import { business } from "../../../../lib/business.js";

export const metadata = { title: "Order Confirmed", robots: { index: false } };

export default function OrderConfirmationPage({ params }) {
  const { orderNumber } = params;
  return (
    <div className="max-w-xl mx-auto px-5 py-28 text-center">
      <CheckCircle2 size={56} className="mx-auto text-green-600 mb-5" />
      <h1 className="font-display text-3xl font-semibold text-ajwa-navy">Order placed successfully!</h1>
      <p className="text-ajwa-ink/60 mt-3">Your order is now being prepared.</p>
      <div className="mt-6 inline-block bg-ajwa-softcream px-5 py-2.5 rounded-full font-mono text-sm">{orderNumber}</div>
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Link href="/orders" className="bg-ajwa-navy text-white px-6 py-3 rounded-full font-semibold hover:bg-ajwa-navydark transition-colors">Track My Order</Link>
        <Link href="/products" className="border border-ajwa-navy text-ajwa-navy px-6 py-3 rounded-full font-semibold hover:bg-ajwa-softcream transition-colors">Continue Shopping</Link>
      </div>
      <div className="mt-6">
        <WhatsAppButton floating={false} label="Confirm via WhatsApp" message={`Hello ${business.displayName}, I just placed order ${orderNumber}. Could you confirm it for me?`} />
      </div>
    </div>
  );
}
