import { headers } from "next/headers";
import Link from "next/link";
import MarketingLogo from "./MarketingLogo";
import MobileMenu from "@/components/home/MobileMenu";
import { authService } from "@/modules/auth/auth.service";
import { settingsQueries } from "@/modules/settings/settings.queries";
import LanguageSwitcher from "./LanguageSwitcher";
import { User, ChevronRight } from "lucide-react";
import { localizedPath } from "@/lib/i18n-utils";
export default async function MarketingHeader() {
  const headersList = await headers();
  const currentLocale = headersList.get("x-locale") || "es";

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
      <MarketingLogo locale={currentLocale} />

      <nav className="hidden items-center gap-7 text-sm font-semibold text-white/85 md:flex">
        <Link href={localizedPath("/#servicios", currentLocale)} className="transition-colors hover:text-[#D4AF37]">
          Servicios
        </Link>
        <Link href={localizedPath("/tours-privados", currentLocale)} className="transition-colors hover:text-[#D4AF37]">
          Tours
        </Link>
        <Link href={localizedPath("/blog", currentLocale)} className="transition-colors hover:text-[#D4AF37]">
          Blog
        </Link>
        <Link href={localizedPath("/preguntas-frecuentes", currentLocale)} className="transition-colors hover:text-[#D4AF37]">
          FAQ
        </Link>
        <Link href={localizedPath("/contacto", currentLocale)} className="transition-colors hover:text-[#D4AF37]">
          Contacto
        </Link>
        <LanguageSwitcher />

        {isCustomer ? (
          <Link
            href={localizedPath("/customer/dashboard", currentLocale)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: accentColor, color: "#111" }}
            title="Mi Panel"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href={localizedPath("/login", currentLocale)}
              className="text-sm font-semibold text-white/90 transition-colors hover:text-[#D4AF37]"
            >
              Acceder
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href={localizedPath("/register", currentLocale)}
              className="text-sm font-semibold text-white/90 transition-colors hover:text-[#D4AF37]"
            >
              Registro
            </Link>
            <Link
              href={localizedPath("/booking", currentLocale)}
              className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold text-gray-900 shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: accentColor }}
            >
              Reservar
              <ChevronRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
          </div>
        )}
      </nav>

      <MobileMenu accentColor={accentColor} isCustomer={isCustomer} />
    </header>
  );
}
