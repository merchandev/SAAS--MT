"use client";

import Link from "next/link";
import { useState } from "react";
import MarketingLogo from "./MarketingLogo";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
  { href: "/preguntas-frecuentes", label: "FAQ" },
  { href: "/tours-privados", label: "Tours" },
  { href: "/contacto", label: "Contacto" },
];

export default function MarketingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-gray-200 bg-white/90 px-5 py-3 shadow-md backdrop-blur-md lg:px-9">
        <Link href="/" className="flex items-center gap-2 transition hover:opacity-80">
          <MarketingLogo />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-bold text-gray-700 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-gray-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-gray-200 px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">language</span>
            Idioma
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">expand_more</span>
          </button>
          <Link
             href="/booking"
             className="inline-flex h-11 items-center justify-center rounded-full bg-gray-900 px-6 text-sm font-bold text-white shadow-md transition hover:bg-gray-800"
          >
             Reservar ahora
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-900 lg:hidden"
        >
          <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-20 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                  {item.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 rounded-full bg-gray-900 px-4 py-3 text-center text-sm font-black text-white shadow-md transition hover:bg-gray-800"
              >
                Reservar Ya
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
