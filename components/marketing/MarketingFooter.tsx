import Link from "next/link";
import MarketingLogo from "./MarketingLogo";

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
  { href: "/contacto", label: "Política de Privacidad" },
  { href: "/contacto", label: "Términos y Condiciones" },
  { href: "/contacto", label: "Aviso Legal" },
  { href: "/contacto", label: "Cookies" },
];

export default function MarketingFooter() {
  return (
    <footer className="relative bg-gray-50 text-gray-900 border-t border-gray-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr]">
        <div>
          <MarketingLogo className="mb-5" />
          <p className="max-w-xs text-base leading-7 text-gray-600">
            Traslados privados y tours personalizados de lujo en Barcelona y toda España. Tu comodidad,
            nuestra pasión.
          </p>
          <div className="mt-8 flex gap-3">
            {[
              { href: "https://www.instagram.com/", label: "Instagram", icon: "photo_camera" },
              { href: "https://www.facebook.com/", label: "Facebook", icon: "group" },
              { href: "https://wa.me/34662024136", label: "WhatsApp", icon: "chat" },
            ].map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                rel="noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{icon}</span>
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
              <span className="material-symbols-outlined text-[18px] text-gray-400" aria-hidden="true">phone</span>
              +34 662 02 41 36
            </a>
            <a href="mailto:info@metransfers.es" className="flex items-center gap-3 transition hover:text-gray-900 w-fit">
              <span className="material-symbols-outlined text-[18px] text-gray-400" aria-hidden="true">mail</span>
              info@metransfers.es
            </a>
            <span className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[18px] text-gray-400" aria-hidden="true">location_on</span>
              Barcelona, España
            </span>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-black text-gray-700">
                <span className="material-symbols-outlined text-[16px] text-[#21d070]" aria-hidden="true">star</span>
                Verified
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-black text-gray-700">
                <span className="material-symbols-outlined text-[16px] text-gray-400" aria-hidden="true">lock</span>
                Seguro
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm font-semibold text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 MeTransfers Barcelona. Todos los derechos reservados.</p>
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
        <span className="material-symbols-outlined text-[28px]" aria-hidden="true">chat</span>
      </a>
    </footer>
  );
}

