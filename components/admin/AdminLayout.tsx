"use client";

import type { ReactNode } from "react";

type AdminLayoutProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
};

export default function AdminLayout({
  tabs,
  activeTab,
  onTabChange,
  children,
}: AdminLayoutProps) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-10 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Admin
        </p>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={[
                "rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors",
                activeTab === tab
                  ? "bg-[#FF6F61] text-black"
                  : "text-white/80 hover:bg-white/10",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>
      <section className="rounded-2xl border border-white/10 bg-black/30 p-6">
        {children}
      </section>
    </div>
  );
}
