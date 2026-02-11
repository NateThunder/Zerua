"use client";

import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { LogoMark } from "./LogoMark";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Live Events", href: "#" },
  { label: "Music", href: "/music" },
  { label: "Videos", href: "#" },
  { label: "Charts", href: "#" },
  { label: "Merch", href: "#" },
];

const socials = [
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/zeruamusic/" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
];

type HeaderProps = {
  variant?: "light" | "dark";
};

export default function Header({ variant = "light" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = variant === "dark";

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b to-transparent",
          isDark ? "from-white/60 via-white/20" : "from-black/50 via-black/20",
        ].join(" ")}
      />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between py-2 pl-1 pr-4 sm:py-2 sm:pl-2 sm:pr-6 lg:py-2 lg:pl-2 lg:pr-8">
        <div className="-ml-1 flex items-center gap-3 sm:-ml-2 lg:-ml-3">
          <LogoMark className="h-16 w-24" variant={isDark ? "dark" : "light"} />
        </div>

        <nav
          className={[
            "hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.35em] md:flex",
            isDark ? "text-black/80" : "text-white/90",
          ].join(" ")}
        >
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-opacity hover:opacity-70"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div
          className={[
            "hidden items-center gap-4 md:flex",
            isDark ? "text-black/80" : "text-white/90",
          ].join(" ")}
        >
          {socials.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="transition-opacity hover:opacity-70"
            >
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </div>

        <button
          className="md:hidden -m-3 p-3"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="flex h-5 w-6 flex-col justify-between">
            <span className={["h-0.5 w-full", isDark ? "bg-black" : "bg-white"].join(" ")} />
            <span className={["h-0.5 w-full", isDark ? "bg-black" : "bg-white"].join(" ")} />
            <span className={["h-0.5 w-full", isDark ? "bg-black" : "bg-white"].join(" ")} />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-30">
          <button
            className="absolute inset-0 cursor-default bg-black/20 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-[82vw] max-w-sm translate-x-0 animate-[drawer-in_280ms_ease-out] bg-black/95 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/50"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>
            <div className="flex h-full flex-col gap-6 px-6 pb-10 text-sm font-semibold uppercase tracking-[0.35em] text-white">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-opacity hover:opacity-70"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
              <div className="mt-6 flex items-center gap-4">
                {socials.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="text-white/90 transition-opacity hover:opacity-70"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
