"use client";
import { useState } from "react";

const emptyAddress = { label: "Home", houseFlat: "", street: "", area: "", city: "", landmark: "", instructions: "" };

export default function AddressForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || emptyAddress);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.houseFlat?.trim()) errs.houseFlat = true;
    if (!form.street?.trim()) errs.street = true;
    if (!form.area?.trim()) errs.area = true;
    if (!form.city?.trim()) errs.city = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  const fieldClass = (field) => `input ${errors[field] ? "border-red-400 ring-2 ring-red-100" : ""}`;

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={form.label} onChange={update("label")} placeholder="Label (e.g. Home, Office)" className="input" />
      <input value={form.houseFlat} onChange={update("houseFlat")} placeholder="House / Flat *" className={fieldClass("houseFlat")} />
      <input value={form.street} onChange={update("street")} placeholder="Street *" className={fieldClass("street")} />
      <input value={form.area} onChange={update("area")} placeholder="Area *" className={fieldClass("area")} />
      <input value={form.city} onChange={update("city")} placeholder="City *" className={fieldClass("city")} />
      <input value={form.landmark} onChange={update("landmark")} placeholder="Landmark (optional)" className="input" />
      <textarea value={form.instructions} onChange={update("instructions")} placeholder="Delivery instructions (optional)" rows={2} className="input" />
      {Object.keys(errors).length > 0 && (
        <p className="text-sm text-red-600">Please fill in all required address fields before continuing.</p>
      )}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="bg-ajwa-navy text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-ajwa-navydark disabled:opacity-60">
          {saving ? "Saving..." : "Save Address"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-full text-sm font-medium border border-ajwa-navy/20">Cancel</button>
        )}
      </div>
    </form>
  );
}
