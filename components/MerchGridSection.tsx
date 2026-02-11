"use client";

import { useMemo, useState } from "react";
import type { MerchItem } from "@/lib/admin/types";

type MerchGridSectionProps = {
  items: MerchItem[];
};

export default function MerchGridSection({ items }: MerchGridSectionProps) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items;
    return items.filter((item) => item.title.toLowerCase().includes(trimmed));
  }, [items, query]);

  return (
    <section className="bg-black pb-24 pt-8 sm:pb-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <label className="sr-only" htmlFor="merch-search">
            Search merch
          </label>
          <input
            id="merch-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search merch..."
            className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[#FF6F61]/70"
          />
        </div>

        {!items.length ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-white/80">
            Merch will be available soon.
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-white/80">
            No merch found for your search.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:-translate-y-0.5 hover:border-[#FF6F61]/45 hover:bg-white/10"
              >
                <div className="aspect-square overflow-hidden bg-black/40">
                  <img
                    src={item.image_path}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="font-anton text-2xl uppercase leading-tight text-white transition group-hover:text-[#FF6F61]">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                    Shop item
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
