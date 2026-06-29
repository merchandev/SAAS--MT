import Link from "next/link";
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
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-brand-blue/95 px-5 py-3 shadow-2xl backdrop-blur-md lg:px-9">
        <MarketingLogo />

        <nav className="hidden items-center gap-7 text-sm font-bold text-white/85 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-brand-gold">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">language</span>
            Idioma
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">expand_more</span>
          </button>
          <Link
            href="/booking"
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-gold px-7 text-sm font-black text-brand-blue shadow-lg shadow-brand-gold/20 transition hover:bg-brand-gold/90 hover:scale-105"
          >
            Reservar Ya
          </Link>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-white/10 text-white transition hover:bg-white/5 [&::-webkit-details-marker]:hidden">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">menu</span>
            <span className="sr-only">Abrir navegación</span>
          </summary>
          <div className="absolute right-0 top-14 w-72 rounded-2xl border border-white/10 bg-brand-blue p-4 shadow-2xl">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-4 py-3 text-sm font-bold text-white/85 hover:bg-white/10 hover:text-brand-gold transition">
                  {item.label}
                </Link>
              ))}
              <Link
                href="/booking"
                className="mt-2 rounded-full bg-brand-gold px-4 py-3 text-center text-sm font-black text-brand-blue shadow-md transition hover:bg-brand-gold/90"
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
