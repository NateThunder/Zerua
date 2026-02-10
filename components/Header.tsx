"use client";

import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { LogoMark } from "./LogoMark";

const navItems = [
  "Home",
  "About",
  "Live Events",
  "Music",
  "Videos",
  "Charts",
  "Merch",
];

const socials = [
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/zeruamusic/" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "YouTube", icon: Youtube, href: "#" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between py-2 pl-1 pr-4 sm:py-2 sm:pl-2 sm:pr-6 lg:py-2 lg:pl-2 lg:pr-8">
        <div className="-ml-1 flex items-center gap-3 sm:-ml-2 lg:-ml-3">
          <LogoMark className="h-16 w-24" />
        </div>

        <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/90 md:flex">
          {navItems.map((item) => (
            <Link
              key={item}
              href="#"
              className="transition-opacity hover:opacity-70"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {socials.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="text-white/90 transition-opacity hover:opacity-70"
            >
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="flex h-5 w-6 flex-col justify-between">
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/90 backdrop-blur">
          <div className="flex h-full flex-col items-center justify-center gap-6 text-sm font-semibold uppercase tracking-[0.35em] text-white">
            {navItems.map((item) => (
              <Link
                key={item}
                href="#"
                className="transition-opacity hover:opacity-70"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-4">
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
        </div>
      )}
    </header>
  );
}
