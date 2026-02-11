"use client";

import { useInView } from "@/components/useInView";
import type { ReleasePlatformLink } from "@/lib/admin/types";

const defaultPlatforms = [
  {
    name: "Spotify",
    href: "#",
    logo: "/media/spotify.avif",
    bg: "bg-[#1CD562]",
    isLight: false,
  },
  {
    name: "Apple Music",
    href: "#",
    logo: "/media/apple.avif",
    bg: "bg-white",
    isLight: true,
  },
  {
    name: "Deezer",
    href: "#",
    logo: "/media/deezer.avif",
    bg: "bg-black",
    isLight: false,
  },
  {
    name: "Bandcamp",
    href: "#",
    logo: "/media/bandcamp.avif",
    bg: "bg-[#5f9fb1]",
    isLight: false,
  },
  {
    name: "Tidal",
    href: "#",
    logo: "/media/tidal.avif",
    bg: "bg-white",
    isLight: true,
  },
  {
    name: "Amazon Music",
    href: "#",
    logo: "/media/amazon.avif",
    bg: "bg-white",
    isLight: true,
  },
  {
    name: "YouTube",
    href: "#",
    logo: "/media/youtube.avif",
    bg: "bg-white",
    isLight: true,
  },
];

type LatestReleaseSectionProps = {
  compact?: boolean;
  showHeading?: boolean;
  showLabel?: boolean;
  title?: string;
  coverImagePath?: string;
  platformLinks?: ReleasePlatformLink[];
};

type PlatformUi = {
  name: string;
  href: string;
  logo: string;
  bg: string;
  isLight: boolean;
};

function toPlatformUi(platformLinks?: ReleasePlatformLink[]): PlatformUi[] {
  const source =
    platformLinks?.length
      ? platformLinks.map((item) => ({ name: item.platform, href: item.url }))
      : defaultPlatforms.map((item) => ({ name: item.name, href: item.href }));

  return source.map((item) => {
    const key = item.name.toLowerCase();
    if (key.includes("spotify")) {
      return {
        name: item.name,
        href: item.href,
        logo: "/media/spotify.avif",
        bg: "bg-[#1CD562]",
        isLight: false,
      };
    }
    if (key.includes("apple")) {
      return {
        name: item.name,
        href: item.href,
        logo: "/media/apple.avif",
        bg: "bg-white",
        isLight: true,
      };
    }
    if (key.includes("deezer")) {
      return {
        name: item.name,
        href: item.href,
        logo: "/media/deezer.avif",
        bg: "bg-black",
        isLight: false,
      };
    }
    if (key.includes("bandcamp")) {
      return {
        name: item.name,
        href: item.href,
        logo: "/media/bandcamp.avif",
        bg: "bg-[#5f9fb1]",
        isLight: false,
      };
    }
    if (key.includes("tidal")) {
      return {
        name: item.name,
        href: item.href,
        logo: "/media/tidal.avif",
        bg: "bg-white",
        isLight: true,
      };
    }
    if (key.includes("amazon")) {
      return {
        name: item.name,
        href: item.href,
        logo: "/media/amazon.avif",
        bg: "bg-white",
        isLight: true,
      };
    }
    if (key.includes("youtube")) {
      return {
        name: item.name,
        href: item.href,
        logo: "/media/youtube.avif",
        bg: "bg-white",
        isLight: true,
      };
    }
    return {
      name: item.name,
      href: item.href,
      logo: "/media/logo.svg",
      bg: "bg-white",
      isLight: true,
    };
  });
}

export default function LatestReleaseSection({
  compact = false,
  showHeading = true,
  showLabel = true,
  title = "I Need Thee (feat. Zerua Music)",
  coverImagePath = "/media/Harvest_cover.webp",
  platformLinks,
}: LatestReleaseSectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const platforms = toPlatformUi(platformLinks);

  return (
    <section className="relative overflow-hidden bg-[#f3efea] text-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(0,0,0,0.06),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute inset-0 film-grain-dark" aria-hidden="true" />
      </div>
      <div
        ref={ref}
        className={[
          "relative mx-auto max-w-6xl px-6",
          compact ? "pt-20 pb-12 sm:pt-24 sm:pb-16" : "pt-32 pb-20 sm:pt-36 sm:pb-24",
          "transition-all duration-700 ease-out",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        ].join(" ")}
      >
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
          <div
            className={[
              "flex flex-col items-start",
              "transition-all duration-700 ease-out",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            ].join(" ")}
          >
            {showHeading && (
              <header className="mb-6">
                {showLabel && (
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.5em] text-black/50">
                    Latest Release
                  </p>
                )}
                <h2 className="mt-4 font-anton text-2xl font-bold uppercase leading-tight text-black sm:text-3xl lg:text-4xl">
                  {title}
                </h2>
              </header>
            )}
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_30%_30%,rgba(0,0,0,0.15),transparent_60%)] blur-2xl" />
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
                <img
                  src={coverImagePath}
                  alt={`${title} cover`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div
            className={[
              "mt-4 flex flex-col gap-3 md:mt-8",
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
                      "w-full rounded-full px-6 py-3 sm:py-3.5",
                      "shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]",
                      "flex items-center justify-center",
                      "h-14 sm:h-16",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3efea]",
                      platform.isLight ? "border border-black/10" : "border border-black/5",
                      platform.bg,
                    ].join(" ")}
                    aria-label={platform.name}
                  >
                    <img
                      src={platform.logo}
                      alt={platform.name}
                      className="h-7 w-full max-w-[280px] object-contain sm:h-8"
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
