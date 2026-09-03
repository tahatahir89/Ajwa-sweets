"use client";
import { useEffect, useState } from "react";
import { Trash2, Mail, MailOpen, Reply } from "lucide-react";
import api from "../../../lib/api.js";
import AdminLayout from "../../../components/AdminLayout.jsx";

const STATUS_STYLES = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-yellow-100 text-yellow-700",
  replied: "bg-green-100 text-green-700",
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/messages", { params: filter ? { status: filter } : {} });
      setMessages(data);
    } catch {
      setError("Could not load messages — check that the backend is running and connected.");
    }
  };

  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/messages/${id}/status`, { status });
      load();
    } catch {
      setError("Could not update message status");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      load();
    } catch {
      setError("Could not delete message");
    }
  };

  const openMessage = (m) => {
    setExpandedId(expandedId === m._id ? null : m._id);
    if (m.status === "new") setStatus(m._id, "read");
  };

  return (
    <AdminLayout title="Customer Messages">
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex gap-2 mb-5">
        {["", "new", "read", "replied"].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium border capitalize ${filter === s ? "bg-ajwa-navy text-white border-ajwa-navy" : "border-ajwa-navy/20 text-ajwa-ink/70 hover:bg-ajwa-softcream"}`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m._id} className="bg-white rounded-xl2 shadow-card overflow-hidden">
            <button onClick={() => openMessage(m)} className="w-full text-left p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {m.status === "new" ? <Mail size={16} className="text-ajwa-navy shrink-0" /> : <MailOpen size={16} className="text-ajwa-ink/40 shrink-0" />}
                <div className="min-w-0">
                  <div className="font-medium truncate">{m.name} <span className="text-ajwa-ink/40 font-normal">— {m.email}</span></div>
                  <div className="text-xs text-ajwa-ink/50 truncate">{m.message}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[m.status]}`}>{m.status}</span>
                <span className="text-xs text-ajwa-ink/40 hidden sm:inline">{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
            </button>

            {expandedId === m._id && (
              <div className="border-t border-ajwa-navy/10 p-4 bg-ajwa-cream/40 text-sm space-y-2">
                <div><span className="text-ajwa-ink/50">Email:</span> {m.email}</div>
                {m.phone && <div><span className="text-ajwa-ink/50">Phone:</span> {m.phone}</div>}
                <div><span className="text-ajwa-ink/50">Message:</span> {m.message}</div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setStatus(m._id, "replied")} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200">
                    <Reply size={13} /> Mark Replied
                  </button>
                  <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-ajwa-softcream text-ajwa-navy hover:bg-ajwa-cream">
                    Reply by Email
                  </a>
                  <button onClick={() => remove(m._id)} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 ml-auto">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-ajwa-ink/50 text-sm py-10">No messages yet, or backend not connected.</p>}
      </div>
    </AdminLayout>
  );
}
