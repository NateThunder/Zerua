"use client";

import { useInView } from "@/components/useInView";

const platforms = [
  { name: "Spotify", href: "#", logo: "/media/spotify.avif", bg: "bg-[#1CD562]" },
  { name: "Apple Music", href: "#", logo: "/media/apple.avif", bg: "bg-white" },
  { name: "Deezer", href: "#", logo: "/media/deezer.avif", bg: "bg-black" },
  { name: "Bandcamp", href: "#", logo: "/media/bandcamp.avif", bg: "bg-[#5f9fb1]" },
  { name: "Tidal", href: "#", logo: "/media/tidal.avif", bg: "bg-white" },
  { name: "Amazon Music", href: "#", logo: "/media/amazon.avif", bg: "bg-white" },
  { name: "YouTube", href: "#", logo: "/media/youtube.avif", bg: "bg-white" },
];

export default function LatestReleaseSection() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section className="relative overflow-hidden bg-[#f7f5f2] text-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(0,0,0,0.08),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.06),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply">
        <div className="absolute inset-0 film-grain-dark" aria-hidden="true" />
      </div>
      <div
        ref={ref}
        className={[
          "relative mx-auto max-w-6xl px-6 py-24 sm:py-32",
          "transition-all duration-700 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        ].join(" ")}
      >
        <header className="mb-12">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.5em] text-black/50">
            Latest Release
          </p>
          <h2 className="mt-6 font-anton text-4xl font-bold uppercase leading-tight text-black sm:text-5xl lg:text-6xl">
            I Need Thee (feat. Zerua Music)
          </h2>
        </header>

        <div className="grid gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
          <div
            className={[
              "flex items-start",
              "transition-all duration-700 ease-out",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            ].join(" ")}
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.15),transparent_60%)] blur-2xl" />
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
                <img
                  src="/media/Harvest_cover.webp"
                  alt="I Need Thee Celtic Worship (feat. Zerua Music) cover"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div
            className={[
              "flex flex-col gap-5",
              "transition-all duration-700 ease-out delay-100",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            ].join(" ")}
          >
            <ul className="flex flex-col gap-3">
              {platforms.map((platform) => (
                <li
                  key={platform.name}
                  className="flex"
                >
                  <a
                    href={platform.href}
                    className={[
                      "w-full rounded-xl px-4 py-3",
                      "shadow-[0_6px_16px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5",
                      "flex items-center justify-center",
                      platform.bg,
                    ].join(" ")}
                  >
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="h-8 w-full max-w-[320px] object-contain"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
