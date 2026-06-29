import Link from "next/link";
import MarketingLogo from "./MarketingLogo";
import MobileMenu from "@/components/home/MobileMenu";
import { authService } from "@/modules/auth/auth.service";
import { settingsQueries } from "@/modules/settings/settings.queries";

export default async function MarketingHeader() {
  let settings;
  try {
    settings = await settingsQueries.getAllSettings();
  } catch {
    settings = { BRAND_ACCENT_COLOR: "#D4AF37" };
  }
  const accentColor = settings.BRAND_ACCENT_COLOR || "#D4AF37";

  const session = await authService.getSession();
  const isCustomer = session?.role === "CUSTOMER";

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-7xl items-center justify-between rounded-lg border border-white/15 bg-black/55 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-6">
      <MarketingLogo />

      <nav className="hidden items-center gap-7 text-sm font-semibold text-white/85 md:flex">
        <a href="/#servicios" className="transition-colors hover:text-[#D4AF37]">
          Servicios
        </a>
        <Link href="/tours-privados" className="transition-colors hover:text-[#D4AF37]">
          Tours
        </Link>
        <Link href="/blog" className="transition-colors hover:text-[#D4AF37]">
          Blog
        </Link>
        <Link href="/preguntas-frecuentes" className="transition-colors hover:text-[#D4AF37]">
          FAQ
        </Link>
        <Link href="/contacto" className="transition-colors hover:text-[#D4AF37]">
          Contacto
        </Link>
        
        {isCustomer ? (
          <Link
            href="/customer/dashboard"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: accentColor, color: "#111" }}
            title="Mi Panel"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">person</span>
          </Link>
        ) : (
          <Link
            href="/booking"
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold text-gray-900 shadow-lg transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: accentColor }}
          >
            Reservar
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_right</span>
          </Link>
        )}
      </nav>

      <MobileMenu accentColor={accentColor} isCustomer={isCustomer} />
    </header>
  );
}
