import Link from "next/link";
import MarketingLogo from "./MarketingLogo";

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
  { href: "/booking", label: "Traslados Aeropuerto" },
  { href: "/booking", label: "Traslados al Puerto" },
  { href: "/contacto", label: "Transfers Corporativos" },
  { href: "/tours-privados", label: "Tours Privados" },
  { href: "/tours-privados", label: "Excursiones Barcelona" },
];

const tours = [
  { href: "/tours-privados#barcelona", label: "Tour en Barcelona" },
  { href: "/tours-privados#montserrat", label: "Tour a Montserrat" },
  { href: "/tours-privados#costa-brava", label: "Tour Costa Brava" },
  { href: "/tours-privados#girona", label: "Tour a Girona" },
];

const legalLinks = [
  { href: "/politica-de-privacidad", label: "Política de Privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos y Condiciones" },
  { href: "/aviso-legal", label: "Aviso Legal" },
  { href: "/cookies", label: "Cookies" },
];

export default function MarketingFooter() {
  return (
    <footer className="relative bg-gray-50 text-gray-900 border-t border-gray-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr]">
        <div>
          <MarketingLogo className="mb-5" variant="footer" />
          <p className="max-w-xs text-base leading-7 text-gray-600">
            Traslados privados y tours personalizados de lujo en Barcelona y toda España. Tu comodidad,
            nuestra pasión.
          </p>
          <div className="mt-8 flex gap-3">
            {[
              { href: "https://www.instagram.com/", label: "Instagram", icon: InstagramIcon },
              { href: "https://www.facebook.com/", label: "Facebook", icon: FacebookIcon },
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
              <Link key={item.label} href={item.href} className="transition hover:text-gray-900 hover:translate-x-1 inline-block w-fit">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-gray-900">Tours destacados</h2>
          <nav className="mt-6 grid gap-4 text-sm font-semibold text-gray-600">
            {tours.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-gray-900 hover:translate-x-1 inline-block w-fit">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em] text-gray-900">Contacto</h2>
          <div className="mt-6 grid gap-4 text-sm font-semibold text-gray-600">
            <a href="tel:+34662024136" className="flex items-center gap-3 transition hover:text-gray-900 w-fit">
              <span translate="no" className="notranslate material-symbols-outlined text-[18px] text-gray-400" aria-hidden="true">phone</span>
              +34 662 02 41 36
            </a>
            <a href="mailto:info@transfersinbarcelona.com" className="flex items-center gap-3 transition hover:text-gray-900 w-fit">
              <span translate="no" className="notranslate material-symbols-outlined text-[18px] text-gray-400" aria-hidden="true">mail</span>
              info@transfersinbarcelona.com
            </a>
            <span className="flex items-center gap-3">
              <span translate="no" className="notranslate material-symbols-outlined text-[18px] text-gray-400" aria-hidden="true">location_on</span>
              Barcelona, España
            </span>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1527] px-2.5 py-1.5 text-xs font-black text-white">
                <span translate="no" className="notranslate material-symbols-outlined text-[16px] text-[#00C26D]" aria-hidden="true">star</span>
                GetYourGuide Verified
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B1527] px-2.5 py-1.5 text-xs font-black text-white">
                <span translate="no" className="notranslate material-symbols-outlined text-[16px] text-[#F3C200]" aria-hidden="true">lock</span>
                Pago Seguro
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm font-semibold text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Transfers in Barcelona. Todos los derechos reservados.</p>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-gray-900">
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
        <span translate="no" className="notranslate material-symbols-outlined text-[28px]" aria-hidden="true">chat</span>
      </a>
    </footer>
  );
}

