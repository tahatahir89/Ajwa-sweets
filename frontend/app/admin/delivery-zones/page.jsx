"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../../../lib/api.js";
import AdminLayout from "../../../components/AdminLayout.jsx";

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({ name: "", charge: "", estimatedTime: "" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/delivery-zones");
      setZones(data);
    } catch {
      setError("Could not load delivery zones — check that the backend is running and connected.");
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/delivery-zones", { ...form, charge: Number(form.charge) });
      setForm({ name: "", charge: "", estimatedTime: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/delivery-zones/${id}`);
      load();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <AdminLayout title="Delivery Zones">
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <form onSubmit={submit} className="bg-white rounded-xl2 shadow-card p-5 grid sm:grid-cols-3 gap-3 mb-8">
        <input required placeholder="Zone name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
        <input required type="number" placeholder="Charge (Rs.)" value={form.charge} onChange={(e) => setForm((f) => ({ ...f, charge: e.target.value }))} className="input" />
        <input placeholder="Estimated time (e.g. 30-60 minutes)" value={form.estimatedTime} onChange={(e) => setForm((f) => ({ ...f, estimatedTime: e.target.value }))} className="input" />
        <button className="sm:col-span-3 bg-ajwa-navy text-white rounded-full py-2.5 font-semibold text-sm hover:bg-ajwa-navydark">Add Zone</button>
      </form>
      <div className="grid sm:grid-cols-2 gap-4">
        {zones.map((z) => (
          <div key={z._id} className="bg-white rounded-xl2 shadow-card p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{z.name}</div>
              <div className="text-xs text-ajwa-ink/50">Rs. {z.charge} · {z.estimatedTime}</div>
            </div>
            <button onClick={() => remove(z._id)} className="text-ajwa-ink/40 hover:text-red-600"><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
