"use client";

import { useInView } from "@/components/useInView";

const platforms = [
  { name: "Apple Music", action: "PLAY" },
  { name: "Spotify", action: "PLAY" },
  { name: "iTunes Store", action: "DOWNLOAD" },
  { name: "Deezer", action: "PLAY" },
  { name: "Amazon Music", action: "PLAY" },
  { name: "Tidal", action: "PLAY" },
];

export default function LatestReleaseSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="bg-white text-black">
      <div
        ref={ref}
        className={[
          "mx-auto max-w-6xl px-6 py-20",
          "transition-all duration-700 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        ].join(" ")}
      >
        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/70">
            Latest Release
          </p>
          <h2 className="mt-4 font-anton text-4xl font-bold uppercase leading-tight sm:text-5xl">
            I Need Thee (feat. Zerua Music)
          </h2>
        </header>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex items-start">
            <div className="w-full max-w-md">
              <div className="aspect-square overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-sm">
                <img
                  src="/media/Harvest_cover.webp"
                  alt="I Need Thee Celtic Worship (feat. Zerua Music) cover"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <ul className="flex flex-col gap-4">
              {platforms.map((platform) => (
                <li
                  key={platform.name}
                  className="flex items-center justify-between gap-4 border-b border-black/10 pb-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                      {platform.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                      {platform.name}
                    </span>
                  </div>
                  <button className="rounded-full bg-black px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition-transform hover:-translate-y-0.5">
                    {platform.action}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
