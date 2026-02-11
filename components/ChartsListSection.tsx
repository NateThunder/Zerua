"use client";

import { useMemo, useState } from "react";

type ChartSong = {
  id: string;
  rank: number;
  title: string;
  artist: string;
  release: string;
};

const chartSongs: ChartSong[] = [];

export default function ChartsListSection() {
  const [query, setQuery] = useState("");

  const filteredSongs = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return chartSongs;
    return chartSongs.filter((song) => song.title.toLowerCase().includes(trimmed));
  }, [query]);

  return (
    <section className="bg-black pb-24 pt-8 sm:pb-28">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <label className="sr-only" htmlFor="charts-search">
            Search songs
          </label>
          <input
            id="charts-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search songs..."
            className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white outline-none transition focus:border-[#FF6F61]/70"
          />
        </div>

        {filteredSongs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-white/80">
            No songs found for your search.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <ul className="divide-y divide-white/10">
              {filteredSongs.map((song) => (
                <li key={song.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start gap-4 sm:items-center">
                    <span className="w-10 shrink-0 font-anton text-3xl leading-none text-[#FF6F61]">
                      {song.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-anton text-2xl uppercase leading-tight text-white">
                        {song.title}
                      </p>
                      <p className="text-sm text-white/70">
                        {song.artist} - {song.release}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
