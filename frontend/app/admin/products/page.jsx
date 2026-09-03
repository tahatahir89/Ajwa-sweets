"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Pencil, Plus, Upload, X, ImageOff } from "lucide-react";
import api from "../../../lib/api.js";
import AdminLayout from "../../../components/AdminLayout.jsx";

const emptyForm = { name: "", slug: "", category: "", basePrice: "", shortDescription: "", isFeatured: false, images: [] };

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const [p, c] = await Promise.all([api.get("/products", { params: { limit: 100 } }), api.get("/categories")]);
      setProducts(p.data.products || []);
      setCategories(c.data || []);
    } catch {
      setError("Could not load products — check that the backend is running and connected.");
    }
  };

  useEffect(() => { load(); }, []);

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append("image", file);
        const { data: res } = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
        uploadedUrls.push(res.url);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }));
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed — check that the backend is running and connected.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url) => setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, basePrice: Number(form.basePrice) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post("/products", payload);
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    }
  };

  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name, slug: p.slug, category: p.category?._id || "", basePrice: p.basePrice,
      shortDescription: p.shortDescription, isFeatured: p.isFeatured, images: p.images || [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const remove = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch {
      setError("Delete failed");
    }
  };

  return (
    <AdminLayout title="Products">
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <form onSubmit={submit} className="bg-white rounded-xl2 shadow-card p-5 grid sm:grid-cols-2 gap-3 mb-8">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
        <input required placeholder="Slug (url-friendly)" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="input" />
        <select required value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="input">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input required type="number" placeholder="Base Price (Rs.)" value={form.basePrice} onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))} className="input" />
        <input placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))} className="input sm:col-span-2" />

        <div className="sm:col-span-2">
          <span className="text-sm font-medium">Product Images</span>
          <div className="flex flex-wrap gap-3 mt-2">
            {form.images.map((url) => (
              <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-ajwa-navy/15 group">
                <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                <button type="button" onClick={() => removeImage(url)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className={`w-20 h-20 rounded-lg border-2 border-dashed border-ajwa-navy/20 flex flex-col items-center justify-center gap-1 cursor-pointer text-ajwa-ink/40 hover:bg-ajwa-softcream transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              <Upload size={16} />
              <span className="text-[10px]">{uploading ? "Uploading..." : "Add"}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageSelect} className="hidden" disabled={uploading} />
            </label>
          </div>
          <p className="text-xs text-ajwa-ink/40 mt-1.5">JPG, PNG, or WebP. First image is used as the main product photo.</p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} /> Mark as featured
        </label>
        <div className="flex gap-3">
          <button className="flex-1 inline-flex items-center justify-center gap-2 bg-ajwa-navy text-white rounded-full py-2.5 font-semibold text-sm hover:bg-ajwa-navydark">
            <Plus size={15} /> {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-5 rounded-full border border-ajwa-navy/20 text-sm font-medium">Cancel</button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl2 shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ajwa-ink/50 border-b border-ajwa-navy/10">
              <th className="p-4">Image</th><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Featured</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-ajwa-navy/5 last:border-0">
                <td className="p-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-ajwa-softcream flex items-center justify-center">
                    {p.images?.[0] ? <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" /> : <ImageOff size={16} className="text-ajwa-ink/30" />}
                  </div>
                </td>
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-ajwa-ink/60">{p.category?.name}</td>
                <td className="p-4">Rs. {p.basePrice?.toLocaleString()}</td>
                <td className="p-4">{p.isFeatured ? "Yes" : "—"}</td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => edit(p)} className="text-ajwa-ink/50 hover:text-ajwa-navy"><Pencil size={15} /></button>
                  <button onClick={() => remove(p._id)} className="text-ajwa-ink/50 hover:text-red-600"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-ajwa-ink/50 text-sm">No products yet, or backend not connected.</p>}
      </div>
    </AdminLayout>
  );
}
