"use client";

import type { ReactNode } from "react";

type AdminModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function AdminModal({ open, title, children, onClose }: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/80 p-6 shadow-[0_28px_70px_rgba(0,0,0,0.55)]">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-anton text-2xl uppercase text-[#FF6F61]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-[#FF6F61] hover:text-[#FF6F61]"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
