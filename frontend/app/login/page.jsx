"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(form.email, form.password);
    if (res.success) router.push(res.role === "admin" ? "/admin" : "/account");
    else setError(res.message);
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold text-center mb-8 text-ajwa-navy">Welcome Back</h1>
      <form onSubmit={submit} className="bg-white rounded-xl2 shadow-card p-7 space-y-4">
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="input" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full bg-ajwa-navy text-white py-3 rounded-full font-semibold hover:bg-ajwa-navydark transition-colors disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="text-center text-sm text-ajwa-ink/60 mt-5">
        New here? <Link href="/register" className="text-ajwa-navy hover:text-ajwa-gold">Create an account</Link>
      </p>
    </div>
  );
}
