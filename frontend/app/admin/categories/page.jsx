"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Pencil, Upload, ImageOff } from "lucide-react";
import api from "../../../lib/api.js";
import AdminLayout from "../../../components/AdminLayout.jsx";

const emptyForm = { name: "", slug: "", description: "", image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch {
      setError("Could not load categories — check that the backend is running and connected.");
    }
  };
  useEffect(() => { load(); }, []);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("image", file);
      const { data: res } = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, image: res.url }));
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed — check that the backend is running and connected.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/categories/${editingId}`, form);
      else await api.post("/categories", form);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const edit = (c) => {
    setEditingId(c._id);
    setForm({ name: c.name, slug: c.slug, description: c.description || "", image: c.image || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const remove = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <AdminLayout title="Categories">
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <form onSubmit={submit} className="bg-white rounded-xl2 shadow-card p-5 grid sm:grid-cols-3 gap-3 mb-8">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
        <input required placeholder="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="input" />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input" />

        <div className="sm:col-span-3">
          <span className="text-sm font-medium">Category Image</span>
          <div className="flex items-center gap-3 mt-2">
            {form.image ? (
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-ajwa-navy/15">
                <Image src={form.image} alt="" fill sizes="80px" className="object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg border border-dashed border-ajwa-navy/20 flex items-center justify-center text-ajwa-ink/30">
                <ImageOff size={18} />
              </div>
            )}
            <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ajwa-navy/20 text-sm font-medium cursor-pointer hover:bg-ajwa-softcream transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              <Upload size={15} /> {uploading ? "Uploading..." : form.image ? "Replace Image" : "Upload Image"}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageSelect} className="hidden" disabled={uploading} />
            </label>
          </div>
          <p className="text-xs text-ajwa-ink/40 mt-1.5">This image is what shows on the homepage's "What We Offer" category cards.</p>
        </div>

        <div className="sm:col-span-3 flex gap-3">
          <button className="flex-1 bg-ajwa-navy text-white rounded-full py-2.5 font-semibold text-sm hover:bg-ajwa-navydark">
            {editingId ? "Update Category" : "Add Category"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-5 rounded-full border border-ajwa-navy/20 text-sm font-medium">Cancel</button>
          )}
        </div>
      </form>
      <div className="grid sm:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div key={c._id} className="bg-white rounded-xl2 shadow-card p-4 flex justify-between items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-ajwa-softcream shrink-0 flex items-center justify-center">
                {c.image ? <Image src={c.image} alt="" fill sizes="48px" className="object-cover" /> : <ImageOff size={16} className="text-ajwa-ink/30" />}
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{c.name}</div>
                <div className="text-xs text-ajwa-ink/50">{c.slug}</div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <button onClick={() => edit(c)} className="text-ajwa-ink/40 hover:text-ajwa-navy"><Pencil size={15} /></button>
              <button onClick={() => remove(c._id)} className="text-ajwa-ink/40 hover:text-red-600"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
