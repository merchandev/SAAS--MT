import Link from "next/link";
import { Camera, LockKeyhole, Mail, MapPin, MessageCircle, Phone, Star, Users } from "lucide-react";
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
    <footer className="relative bg-[#061833] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1.1fr]">
        <div>
          <MarketingLogo className="mb-5" />
          <p className="max-w-xs text-base leading-7 text-white/80">
            Traslados privados y tours personalizados de lujo en Barcelona y toda España. Tu comodidad,
            nuestra pasión.
          </p>
          <div className="mt-8 flex gap-3">
            {[
              { href: "https://www.instagram.com/", label: "Instagram", Icon: Camera },
              { href: "https://www.facebook.com/", label: "Facebook", Icon: Users },
              { href: "https://wa.me/34662024136", label: "WhatsApp", Icon: MessageCircle },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80 transition hover:bg-white/15 hover:text-white"
                rel="noreferrer"
                target="_blank"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">Servicios</h2>
          <nav className="mt-6 grid gap-4 text-sm font-bold text-white/85">
            {services.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">Tours destacados</h2>
          <nav className="mt-6 grid gap-4 text-sm font-bold text-white/85">
            {tours.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.14em]">Contacto</h2>
          <div className="mt-6 grid gap-4 text-sm font-bold text-white/85">
            <a href="tel:+34662024136" className="flex items-center gap-3 transition hover:text-white">
              <Phone className="h-4 w-4 text-[#2b8cff]" aria-hidden="true" />
              +34 662 02 41 36
            </a>
            <a href="mailto:info@metransfers.es" className="flex items-center gap-3 transition hover:text-white">
              <Mail className="h-4 w-4 text-[#2b8cff]" aria-hidden="true" />
              info@metransfers.es
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#2b8cff]" aria-hidden="true" />
              Barcelona, España
            </span>
            <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-black">
              <Star className="h-4 w-4 fill-[#21d070] text-[#21d070]" aria-hidden="true" />
              GetYourGuide Verified
            </span>
            <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs font-black">
              <LockKeyhole className="h-4 w-4 text-[#ffd643]" aria-hidden="true" />
              Pago Seguro
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm font-semibold text-white/80 md:flex-row md:items-center md:justify-between">
          <p>© 2026 MeTransfers Barcelona. Todos los derechos reservados.</p>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((item) => (
              <Link key={item.label} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <a
        href="https://wa.me/34662024136"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#21d070] text-white shadow-2xl shadow-[#21d070]/30 transition hover:scale-105"
        rel="noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
      </a>
    </footer>
  );
}
