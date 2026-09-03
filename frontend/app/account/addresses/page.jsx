"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";
import api from "../../../lib/api.js";
import AddressForm from "../../../components/AddressForm.jsx";
import RequireAuth from "../../../components/RequireAuth.jsx";

function AddressesInner() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/me");
      setAddresses(data.addresses || []);
    } catch {
      setError("Could not load your addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addAddress = async (form) => {
    setSaving(true);
    try {
      const { data } = await api.post("/users/addresses", form);
      setAddresses(data);
      setAdding(false);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save address");
    } finally {
      setSaving(false);
    }
  };

  const updateAddress = async (id, form) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/users/addresses/${id}`, form);
      setAddresses(data);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update address");
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await api.delete(`/users/addresses/${id}`);
      setAddresses(data);
    } catch {
      setError("Could not delete address");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold text-ajwa-navy">Saved Addresses</h1>
        {!adding && (
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 bg-ajwa-navy text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-ajwa-navydark">
            <Plus size={15} /> Add Address
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {adding && (
        <div className="bg-white rounded-xl2 shadow-card p-6 mb-6">
          <h2 className="font-semibold mb-4">New Address</h2>
          <AddressForm onSave={addAddress} onCancel={() => setAdding(false)} saving={saving} />
        </div>
      )}

      {loading ? (
        <p className="text-ajwa-ink/50">Loading...</p>
      ) : addresses.length === 0 && !adding ? (
        <div className="text-center py-16 bg-white rounded-xl2 shadow-card">
          <MapPin size={36} className="mx-auto text-ajwa-gold mb-3" />
          <p className="text-ajwa-ink/60">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((a) =>
            editingId === a._id ? (
              <div key={a._id} className="bg-white rounded-xl2 shadow-card p-6">
                <AddressForm initial={a} saving={saving} onCancel={() => setEditingId(null)} onSave={(form) => updateAddress(a._id, form)} />
              </div>
            ) : (
              <div key={a._id} className="bg-white rounded-xl2 shadow-card p-5 flex justify-between items-start">
                <div>
                  <div className="font-semibold">{a.label || "Address"}</div>
                  <div className="text-sm text-ajwa-ink/60 mt-1">
                    {[a.houseFlat, a.street, a.area, a.city].filter(Boolean).join(", ")}
                  </div>
                  {a.landmark && <div className="text-xs text-ajwa-ink/45 mt-1">Landmark: {a.landmark}</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(a._id)} className="p-2 rounded-full hover:bg-ajwa-softcream text-ajwa-ink/50"><Pencil size={15} /></button>
                  <button onClick={() => deleteAddress(a._id)} className="p-2 rounded-full hover:bg-ajwa-softcream text-ajwa-ink/50 hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function AddressesPage() {
  return (
    <RequireAuth>
      <AddressesInner />
    </RequireAuth>
  );
}
