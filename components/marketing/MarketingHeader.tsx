import Link from "next/link";
import { ChevronDown, Globe2, Menu } from "lucide-react";
import MarketingLogo from "./MarketingLogo";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/blog", label: "Blog" },
  { href: "/preguntas-frecuentes", label: "FAQ" },
  { href: "/tours-privados", label: "Tours" },
  { href: "/contacto", label: "Contacto" },
];

export default function MarketingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-4 pt-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/20 bg-[#061833]/90 px-5 py-3 shadow-2xl backdrop-blur-md lg:px-9">
        <MarketingLogo />

        <nav className="hidden items-center gap-7 text-sm font-bold text-white/85 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 text-sm font-bold text-white"
          >
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            Idioma
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <Link
            href="/booking"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#0868d8] px-7 text-sm font-black text-white shadow-lg shadow-[#0868d8]/30 transition hover:bg-[#075cbe]"
          >
            Reservar Ya
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/15 text-white [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Abrir navegación</span>
          </summary>
          <div className="absolute right-0 top-14 w-72 rounded-2xl border border-white/10 bg-[#061833] p-4 shadow-2xl">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-4 py-3 text-sm font-bold text-white/85 hover:bg-white/10">
                  {item.label}
                </Link>
              ))}
              <Link
                href="/booking"
                className="mt-2 rounded-full bg-[#0868d8] px-4 py-3 text-center text-sm font-black text-white"
              >
                Reservar Ya
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
