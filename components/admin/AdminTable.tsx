"use client";

import type { ReactNode } from "react";

type AdminTableProps = {
  headers: string[];
  children: ReactNode;
};

export default function AdminTable({ headers, children }: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full border-collapse text-left">
        <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/60">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-white/90">{children}</tbody>
      </table>
    </div>
  );
}
