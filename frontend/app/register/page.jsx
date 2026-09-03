"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await register(form);
    if (res.success) router.push("/account");
    else setError(res.message);
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display text-3xl font-semibold text-center mb-8 text-ajwa-navy">Create an Account</h1>
      <form onSubmit={submit} className="bg-white rounded-xl2 shadow-card p-7 space-y-4">
        <input required placeholder="Full Name" value={form.name} onChange={update("name")} className="input" />
        <input required type="email" placeholder="Email" value={form.email} onChange={update("email")} className="input" />
        <input placeholder="Phone Number" value={form.phone} onChange={update("phone")} className="input" />
        <input required type="password" placeholder="Password" value={form.password} onChange={update("password")} className="input" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full bg-ajwa-navy text-white py-3 rounded-full font-semibold hover:bg-ajwa-navydark transition-colors disabled:opacity-60">
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="text-center text-sm text-ajwa-ink/60 mt-5">
        Already have an account? <Link href="/login" className="text-ajwa-navy hover:text-ajwa-gold">Log in</Link>
      </p>
    </div>
  );
}
