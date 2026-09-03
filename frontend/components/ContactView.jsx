"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton.jsx";
import api from "../lib/api.js";
import { business } from "../lib/business.js";

export default function ContactView() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.post("/messages", form);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || "Could not send your message. Please try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-16 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="font-display text-3xl font-semibold mb-6 text-ajwa-navy">Get in Touch</h1>
        <div className="space-y-4 text-sm text-ajwa-ink/70">
          {business.phone && (
            <div className="flex items-center gap-3"><Phone size={17} className="text-ajwa-navy" /> {business.phone}</div>
          )}
          {business.email && (
            <div className="flex items-center gap-3"><Mail size={17} className="text-ajwa-navy" /> {business.email}</div>
          )}
          <div className="flex items-start gap-3">
            <MapPin size={17} className="text-ajwa-navy mt-0.5 shrink-0" />
            <a href={business.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ajwa-navy">
              {business.address.line1}, {business.address.line2}, {business.address.city}, {business.address.region}
            </a>
          </div>
          <div className="flex items-center gap-3"><Clock size={17} className="text-ajwa-navy" /> {business.hours.display}</div>
          {business.social.facebook && (
            <div className="flex items-center gap-3">
              <Facebook size={17} className="text-ajwa-navy" />
              <a href={business.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-ajwa-navy">
                Follow us on Facebook
              </a>
            </div>
          )}
        </div>
        <div className="mt-6">
          <WhatsAppButton floating={false} label="Chat on WhatsApp" message={`Hello ${business.displayName}, I have a question.`} />
        </div>
        <div className="mt-8 rounded-xl2 overflow-hidden shadow-card aspect-video">
          <iframe
            title="Ajwa Sweets & Bakers location"
            src={`https://www.google.com/maps?q=${business.geo.latitude},${business.geo.longitude}&z=16&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>

      <form onSubmit={submit} className="bg-white rounded-xl2 shadow-card p-7 space-y-4 h-fit">
        <h2 className="font-display text-xl font-semibold mb-2 text-ajwa-navy">Send us a Message</h2>
        {status === "sent" ? (
          <p className="text-green-700 text-sm">Your message has been sent successfully. We'll get back to you soon.</p>
        ) : (
          <>
            <input required placeholder="Name" value={form.name} onChange={update("name")} className="input" disabled={status === "sending"} />
            <input required type="email" placeholder="Email" value={form.email} onChange={update("email")} className="input" disabled={status === "sending"} />
            <input placeholder="Phone (optional)" value={form.phone} onChange={update("phone")} className="input" disabled={status === "sending"} />
            <textarea required placeholder="Message" rows={4} value={form.message} onChange={update("message")} className="input" disabled={status === "sending"} />
            {status === "error" && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={status === "sending"} className="w-full bg-ajwa-navy text-white py-3 rounded-full font-semibold hover:bg-ajwa-navydark transition-colors disabled:opacity-60">
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
