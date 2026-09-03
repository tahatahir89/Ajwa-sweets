"use client";
import { useEffect, useState } from "react";
import api from "../lib/api.js";

// Single source of truth: WHATSAPP_NUMBER in backend/.env, served via
// GET /api/settings. No frontend-hardcoded number.
let cachedNumber = null;

function useWhatsAppNumber() {
  const [number, setNumber] = useState(cachedNumber || "");

  useEffect(() => {
    if (cachedNumber) return;
    (async () => {
      try {
        const { data } = await api.get("/settings");
        if (data.whatsappNumber) {
          cachedNumber = data.whatsappNumber;
          setNumber(data.whatsappNumber);
        }
      } catch {
        /* leave blank — button hides itself below rather than showing a broken link */
      }
    })();
  }, []);

  return number;
}

export default function WhatsAppButton({ message, floating = true, label = "Order on WhatsApp" }) {
  const number = useWhatsAppNumber();
  const text = encodeURIComponent(message || "Hello Ajwa Sweets, I would like to place an order.");

  if (!number) return null;

  const href = `https://wa.me/${number}?text=${text}`;

  if (floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-soft hover:scale-105 transition-transform"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.29-1.39c1.44.79 3.06 1.2 4.7 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.51 2 12.04 2zm0 18.14h-.01c-1.46 0-2.9-.39-4.15-1.13l-.3-.18-3.14.82.84-3.06-.19-.32a8.19 8.19 0 01-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.55-3.7 8.24-8.28 8.22z" />
        </svg>
        <span className="hidden sm:inline text-sm font-semibold">{label}</span>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-semibold text-sm hover:brightness-95 transition"
    >
      {label}
    </a>
  );
}
