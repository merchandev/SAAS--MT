import { headers } from "next/headers";
import { Phone, Mail, MapPin, Star, Lock, MessageCircle } from "lucide-react";
import Link from "next/link";
import MarketingLogo from "./MarketingLogo";
import { localizedPath } from "@/lib/i18n-utils";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const services = [
  { href: "/rutas/airport-transfer-barcelona", label: "Traslados Aeropuerto de Barcelona" },
  { href: "/rutas/cruise-port-transfer-barcelona", label: "Traslados Puerto de Cruceros" },
  { href: "/rutas/chauffeur-service-barcelona", label: "Coches con Chófer en Barcelona" },
  { href: "/rutas/corporate-transfers-barcelona", label: "Traslados Corporativos y Eventos" },
];

const tours = [
  { href: "/rutas/barcelona-to-andorra-transfer", label: "Traslado de Barcelona a Andorra" },
  { href: "/rutas/barcelona-to-sitges-transfer", label: "Traslado de Barcelona a Sitges" },
  { href: "/rutas/barcelona-to-costa-brava-transfer", label: "Traslado a la Costa Brava" },
  { href: "/rutas/montserrat-private-tour", label: "Tour Privado a Montserrat" },
];

const legalLinks = [
  { href: "/politica-de-privacidad", label: "Política de Privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos y Condiciones" },
  { href: "/aviso-legal", label: "Aviso Legal" },
  { href: "/cookies", label: "Política de Cookies" },
];

export default async function MarketingFooter() {
  const headersList = await headers();
  const currentLocale = headersList.get("x-locale") || "es";

  return (
    <footer className="relative bg-gray-50 text-gray-900 border-t border-gray-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr]">
        <div>
          <MarketingLogo className="mb-5" variant="footer" locale={currentLocale} />
          <p className="max-w-xs text-base leading-7 text-gray-600">
            Traslados privados y tours de lujo personalizados en Barcelona y toda España. Tu comodidad, nuestra pasión.
          </p>
          <div className="mt-8 flex gap-3">
            {[
              { href: "https://wa.me/34662024136", label: "WhatsApp", icon: WhatsAppIcon },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                rel="noreferrer"
                target="_blank"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-gray-900">Servicios</h2>
          <nav className="mt-6 grid gap-4 text-sm font-semibold text-gray-600">
            {services.map((item) => (
              <Link key={item.label} href={localizedPath(item.href, currentLocale)} className="transition hover:text-gray-900 hover:translate-x-1 inline-block w-fit">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-gray-900">Rutas Destacadas</h2>
          <nav className="mt-6 grid gap-4 text-sm font-semibold text-gray-600">
            {tours.map((item) => (
              <Link key={item.label} href={localizedPath(item.href, currentLocale)} className="transition hover:text-gray-900 hover:translate-x-1 inline-block w-fit">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-gray-900">Contacto</h2>
          <div className="mt-6 grid gap-4 text-sm font-semibold text-gray-600">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="h-[18px] w-[18px] text-gray-400" aria-hidden="true" />
                <a href="tel:+34662024136" className="transition hover:text-gray-900">
                  +34 662 02 41 36
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-[18px] w-[18px] text-gray-400" aria-hidden="true" />
                <a href="mailto:info@transfersinbarcelona.com" className="transition hover:text-gray-900">
                  info@transfersinbarcelona.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-[18px] w-[18px] text-gray-400" aria-hidden="true" />
                Barcelona, España
              </li>
            </ul>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1527] px-2.5 py-1.5 text-xs font-black text-white">
                <Lock className="h-4 w-4 text-[#F3C200] fill-[#F3C200]" aria-hidden="true" />
                Pago Seguro
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm font-semibold text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Transfers in Barcelona. Todos los derechos reservados.</p>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((item) => (
              <Link key={item.label} href={localizedPath(item.href, currentLocale)} className="transition hover:text-gray-900">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <a
        href="https://wa.me/34662024136"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#21d070] text-white shadow-lg transition hover:scale-105"
        rel="noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
      </a>
    </footer>
  );
}

