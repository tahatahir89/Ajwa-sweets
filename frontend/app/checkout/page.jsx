"use client";
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, MapPin } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../lib/api.js";

const STEPS = ["Customer Info", "Delivery Address", "Payment"];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);

  const [form, setForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: "", whatsapp: "",
    houseFlat: "", street: "", area: "", city: "", landmark: "", instructions: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/delivery-zones");
        setZones(data || []);
      } catch {
        /* zones stay empty — user sees an honest message below */
      }
      if (user) {
        try {
          const { data } = await api.get("/auth/me");
          if (data.addresses?.length) {
            setSavedAddresses(data.addresses);
            setShowNewAddressForm(false);
          }
        } catch {
          /* no saved addresses available */
        }
      }
    })();
  }, [user]);

  if (items.length === 0 && !submitting) {
    return (
      <div className="max-w-xl mx-auto px-5 py-28 text-center">
        <h2 className="font-display text-2xl font-semibold text-ajwa-navy">Your cart is empty</h2>
        <Link href="/products" className="inline-block mt-6 bg-ajwa-navy text-white px-7 py-3 rounded-full font-semibold">Explore Products</Link>
      </div>
    );
  }

  const zone = zones.find((z) => (z._id || z.id) === zoneId);
  const deliveryFee = zone?.charge ?? 0;
  const total = subtotal + deliveryFee;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const applySavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setShowNewAddressForm(false);
    setForm((f) => ({
      ...f,
      houseFlat: addr.houseFlat || "", street: addr.street || "", area: addr.area || "",
      city: addr.city || "", landmark: addr.landmark || "", instructions: addr.instructions || "",
    }));
    setFieldErrors({});
  };

  const validateStep = (index) => {
    const errs = {};
    if (index === 0) {
      if (!form.name.trim()) errs.name = true;
      if (!form.email.trim()) errs.email = true;
      if (!form.phone.trim()) errs.phone = true;
      setFieldErrors(errs);
      if (Object.keys(errs).length) {
        setError("Please fill in your name, email, and phone number before continuing.");
        return false;
      }
    }
    if (index === 1) {
      if (!form.houseFlat.trim()) errs.houseFlat = true;
      if (!form.street.trim()) errs.street = true;
      if (!form.area.trim()) errs.area = true;
      if (!form.city.trim()) errs.city = true;
      setFieldErrors(errs);
      if (Object.keys(errs).length) {
        setError("Please fill in all required address fields before continuing.");
        return false;
      }
      if (!zoneId) {
        setError("Please select a delivery zone before continuing.");
        return false;
      }
    }
    setError("");
    setFieldErrors({});
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setError("");
    setFieldErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const placeOrder = async () => {
    if (!validateStep(0) || !validateStep(1)) {
      setStep(!validateStep(0) ? 0 : 1);
      return;
    }
    setSubmitting(true);
    setError("");
    const payload = {
      items: items.map((i) => ({ productId: i.productId, variantLabel: i.variantLabel, quantity: i.quantity })),
      deliveryAddress: {
        houseFlat: form.houseFlat, street: form.street, area: form.area,
        city: form.city, landmark: form.landmark, instructions: form.instructions,
      },
      deliveryZoneId: zoneId,
      paymentMethod: form.paymentMethod,
      guestInfo: { name: form.name, email: form.email, phone: form.phone, whatsapp: form.whatsapp },
    };
    try {
      const { data } = await api.post("/orders", payload);
      clearCart();
      router.push(`/checkout/confirmation/${data.orderNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (field) => `input ${fieldErrors[field] ? "border-red-400 ring-2 ring-red-100" : ""}`;

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-14 grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <div className="flex items-center gap-3 mb-8">
          {STEPS.map((label, i) => (
            <Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${i <= step ? "bg-ajwa-navy text-white" : "bg-ajwa-softcream text-ajwa-ink/50"}`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${i === step ? "font-semibold" : "text-ajwa-ink/50"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-ajwa-navy/10" />}
            </Fragment>
          ))}
        </div>

        {step === 0 && (
          <div className="bg-white rounded-xl2 shadow-card p-6 space-y-4">
            <h2 className="font-display text-xl font-semibold text-ajwa-navy">Customer Information</h2>
            <input value={form.name} onChange={update("name")} placeholder="Full Name *" className={fieldClass("name")} />
            <input value={form.email} onChange={update("email")} placeholder="Email *" type="email" className={fieldClass("email")} />
            <input value={form.phone} onChange={update("phone")} placeholder="Phone Number *" className={fieldClass("phone")} />
            <input value={form.whatsapp} onChange={update("whatsapp")} placeholder="WhatsApp Number" className="input" />
          </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-xl2 shadow-card p-6 space-y-4">
            <h2 className="font-display text-xl font-semibold text-ajwa-navy">Delivery Address</h2>

            {savedAddresses.length > 0 && (
              <div>
                <span className="text-sm font-medium">Saved Addresses</span>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  {savedAddresses.map((a) => (
                    <button
                      key={a._id}
                      type="button"
                      onClick={() => applySavedAddress(a)}
                      className={`text-left p-3 rounded-lg border text-sm flex items-start gap-2 transition-colors ${
                        selectedAddressId === a._id && !showNewAddressForm ? "border-ajwa-navy bg-ajwa-softcream" : "border-ajwa-navy/15 hover:bg-ajwa-softcream/50"
                      }`}
                    >
                      <MapPin size={15} className="mt-0.5 shrink-0 text-ajwa-navy" />
                      <div>
                        <div className="font-medium">{a.label || "Address"}</div>
                        <div className="text-ajwa-ink/60 text-xs mt-0.5">{[a.houseFlat, a.street, a.area, a.city].filter(Boolean).join(", ")}</div>
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setShowNewAddressForm(true); setSelectedAddressId(""); }}
                    className={`text-left p-3 rounded-lg border text-sm font-medium transition-colors ${showNewAddressForm ? "border-ajwa-navy bg-ajwa-softcream" : "border-dashed border-ajwa-navy/20 hover:bg-ajwa-softcream/50"}`}
                  >
                    + Use a new address
                  </button>
                </div>
              </div>
            )}

            {showNewAddressForm && (
              <>
                <input value={form.houseFlat} onChange={update("houseFlat")} placeholder="House / Flat *" className={fieldClass("houseFlat")} />
                <input value={form.street} onChange={update("street")} placeholder="Street *" className={fieldClass("street")} />
                <input value={form.area} onChange={update("area")} placeholder="Area *" className={fieldClass("area")} />
                <input value={form.city} onChange={update("city")} placeholder="City *" className={fieldClass("city")} />
                <input value={form.landmark} onChange={update("landmark")} placeholder="Landmark (optional)" className="input" />
                <textarea value={form.instructions} onChange={update("instructions")} placeholder="Delivery instructions (optional)" className="input" rows={2} />
              </>
            )}

            <div>
              <span className="text-sm font-medium">Delivery Zone {!zoneId && <span className="text-red-500">*</span>}</span>
              {zones.length === 0 ? (
                <p className="text-xs text-ajwa-ink/50 mt-2">No delivery zones are configured yet — please check back soon or contact us directly.</p>
              ) : (
                <div className="grid sm:grid-cols-3 gap-3 mt-2">
                  {zones.map((z) => (
                    <button
                      key={z._id || z.id}
                      type="button"
                      onClick={() => setZoneId(z._id || z.id)}
                      className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                        zoneId === (z._id || z.id) ? "border-ajwa-navy bg-ajwa-softcream" : "border-ajwa-navy/15 hover:bg-ajwa-softcream/50"
                      }`}
                    >
                      <div className="font-medium">{z.name}</div>
                      <div className="text-ajwa-ink/60">Rs. {z.charge} · {z.estimatedTime}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl2 shadow-card p-6 space-y-4">
            <h2 className="font-display text-xl font-semibold text-ajwa-navy">Payment</h2>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-ajwa-navy bg-ajwa-softcream">
              <div className="w-4 h-4 rounded-full border-2 border-ajwa-navy flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-ajwa-navy" />
              </div>
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <p className="text-xs text-ajwa-ink/50">Pay in cash when your order arrives. Please have the exact amount ready if possible.</p>
          </div>
        )}

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <div className="flex justify-between mt-6">
          <button onClick={back} disabled={step === 0} className="px-6 py-3 rounded-full border border-ajwa-navy/20 text-sm font-medium disabled:opacity-30">Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} className="px-7 py-3 rounded-full bg-ajwa-navy text-white text-sm font-semibold hover:bg-ajwa-navydark">Continue</button>
          ) : (
            <button onClick={placeOrder} disabled={submitting} className="px-7 py-3 rounded-full bg-ajwa-navy text-white text-sm font-semibold hover:bg-ajwa-navydark disabled:opacity-60">
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl2 shadow-card p-6 h-fit">
        <h2 className="font-display text-xl font-semibold mb-4 text-ajwa-navy">Order Summary</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span className="text-ajwa-ink/70">{i.name} {i.variantLabel && `(${i.variantLabel})`} × {i.quantity}</span>
              <span>Rs. {(i.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-ajwa-navy/10 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-ajwa-ink/60">Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-ajwa-ink/60">Delivery</span><span>Rs. {deliveryFee.toLocaleString()}</span></div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-ajwa-navy/10">
            <span>Total</span><span className="text-ajwa-navy">Rs. {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
