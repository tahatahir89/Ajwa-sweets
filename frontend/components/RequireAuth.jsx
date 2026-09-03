"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext.jsx";

export default function RequireAuth({ children, adminOnly = false }) {
  const { user } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Give the auth context a tick to hydrate from localStorage before deciding.
    const t = setTimeout(() => setChecked(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!checked) return;
    if (!user) {
      router.replace("/login");
    } else if (adminOnly && user.role !== "admin") {
      router.replace("/");
    }
  }, [checked, user, adminOnly, router]);

  if (!checked || !user || (adminOnly && user.role !== "admin")) return null;

  return children;
}
