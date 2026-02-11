"use client";

import type { ReactNode } from "react";

type AdminFormProps = {
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitLabel?: string;
};

export default function AdminForm({
  title,
  children,
  onSubmit,
  submitLabel = "Save",
}: AdminFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-white/10 bg-black/20 p-4"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
        {title}
      </p>
      <div className="space-y-3">{children}</div>
      <button
        type="submit"
        className="mt-4 rounded-full bg-[#FF6F61] px-5 py-2 text-sm font-semibold text-black"
      >
        {submitLabel}
      </button>
    </form>
  );
}
