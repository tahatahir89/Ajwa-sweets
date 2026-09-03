"use client";
export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirming }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-5">
      <div className="bg-white rounded-xl2 shadow-soft p-6 max-w-sm w-full">
        <h3 className="font-display text-lg font-semibold text-ajwa-navy">{title}</h3>
        <p className="text-sm text-ajwa-ink/60 mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded-full text-sm font-medium border border-ajwa-navy/20">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={confirming}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {confirming ? "Please wait..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
