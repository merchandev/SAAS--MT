import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  CalendarCheck,
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Plane,
  Route,
  Star,
  Users,
} from "lucide-react";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";
import MobileMenu from "@/components/home/MobileMenu";
import { settingsQueries } from "@/modules/settings/settings.queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Traslados y tours en Barcelona | Chófer privado MeTransfers",
  description:
    "Tu chófer privado en Barcelona para traslados al aeropuerto, tours y eventos corporativos. Vehículos de alta gama y confirmación instantánea en menos de 2 minutos.",
  keywords: [
    "traslados privados Barcelona",
    "tours en Barcelona",
    "chófer privado Barcelona",
    "transfer aeropuerto Barcelona",
    "coches con chófer Barcelona",
    "traslados premium España",
  ],
  openGraph: {
    title: "Traslados Privados & Tours Premium en Barcelona",
    description:
      "Vehículos de alta gama para traslados al aeropuerto, tours privados y eventos corporativos en Barcelona.",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traslados y tours en Barcelona | MeTransfers",
    description:
      "Reserva tu chófer privado en Barcelona con confirmación instantánea en menos de 2 minutos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const services = [
  {
    title: "Transfers de aeropuerto",
    description:
      "Traslados privados desde y hacia Barcelona-El Prat, estaciones, hoteles, domicilios, oficinas y terminales de cruceros.",
    Icon: Plane,
  },
  {
    title: "Tours privados en Barcelona",
    description:
      "Coche con chófer por horas para visitas panorámicas, rutas culturales, excursiones privadas y planes a medida.",
    Icon: Route,
  },
  {
    title: "Eventos corporativos",
    description:
      "Movilidad ejecutiva para congresos, reuniones, roadshows, cenas de empresa, ferias y atención a clientes internacionales.",
    Icon: Briefcase,
  },
  {
    title: "Alquiler por horas",
    description:
      "Disponga de un conductor privado durante el tiempo contratado, con flexibilidad para paradas y cambios de agenda.",
    Icon: Clock,
  },
  {
    title: "Bodas y celebraciones",
    description:
      "Vehículos con chófer para novios, invitados, hoteles, fincas, restaurantes y traslados coordinados de grupos.",
    Icon: CalendarCheck,
  },
  {
    title: "Servicios para grupos",
    description:
      "Minivans, minibuses y vehículos amplios para familias, equipos de trabajo, equipaje voluminoso y viajes compartidos.",
    Icon: Users,
  },
];

const steps = [
  {
    title: "Indique su ruta",
    description:
      "Añada dirección de recogida, destino, fecha y hora para calcular la disponibilidad del servicio.",
  },
  {
    title: "Elija vehículo",
    description:
      "Seleccione la opción que encaje con pasajeros, equipaje, imagen del viaje y nivel de confort esperado.",
  },
  {
    title: "Confirme online",
    description:
      "Revise las condiciones y reserve con precio claro, sin llamadas ni esperas innecesarias.",
  },
  {
    title: "Su chófer le espera",
    description:
      "El conductor estará preparado en el punto acordado para asistirle y realizar el trayecto con puntualidad.",
  },
];

const fleet = [
  "Berlina estándar para traslados urbanos y aeropuerto",
  "Vehículo business para reuniones, congresos y clientes ejecutivos",
  "Vehículo premium o de lujo para servicios VIP y representación",
  "Monovolumen, minivan y minibús para familias, grupos y equipaje",
];

const routes = [
  "Barcelona - Aeropuerto Josep Tarradellas Barcelona-El Prat",
  "Barcelona - Puerto de cruceros y terminales marítimas",
  "Barcelona - Sitges, Tarragona y Costa Brava",
  "Barcelona - Andorra y traslados de larga distancia",
];

const advantages = [
  "Precio cerrado antes de reservar",
  "Conductores profesionales y discretos",
  "Vehículos seleccionados para cada viaje",
  "Atención antes, durante y después del servicio",
  "Opciones para empresas, turismo, eventos y grupos",
  "Servicios adicionales bajo petición: sillas infantiles, agua, paradas, bienvenida y equipaje especial",
];

const faqs = [
  {
    question: "¿Puedo reservar un traslado desde el aeropuerto de Barcelona?",
    answer:
      "Sí. Puede reservar transfers privados desde y hacia Barcelona-El Prat e indicar los datos del vuelo para facilitar la coordinación de la recogida.",
  },
  {
    question: "¿El precio del traslado es cerrado?",
    answer:
      "El precio y las condiciones principales se muestran antes de confirmar la reserva, para que sepa qué servicio está contratando.",
  },
  {
    question: "¿Puedo contratar un coche con chófer por horas?",
    answer:
      "Sí. El servicio por horas es adecuado para reuniones, tours privados, eventos, visitas o agendas con varias paradas en Barcelona.",
  },
  {
    question: "¿MeTransfers ofrece vehículos para grupos?",
    answer:
      "Sí. Según disponibilidad, se pueden reservar minivans, minibuses y vehículos amplios para familias, grupos, eventos o viajes corporativos.",
  },
];

type HomeSettings = {
  SITE_NAME?: string;
  COMPANY_NAME?: string;
  SITE_LOGO_URL?: string;
  BRAND_ACCENT_COLOR?: string;
};

async function getHomeSettings(): Promise<HomeSettings> {
  try {
    return await settingsQueries.getAllSettings();
  } catch {
    return {
      SITE_NAME: "MeTransfers",
      COMPANY_NAME: "MeTransfers",
      SITE_LOGO_URL: "",
      BRAND_ACCENT_COLOR: "#D4AF37",
    };
  }
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase text-[#9B7B20]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-gray-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-gray-600">{description}</p>
    </div>
  );
}

export default async function HomePage() {
  const settings = await getHomeSettings();
  const brandName = settings.SITE_NAME || settings.COMPANY_NAME || "MeTransfers";
  const logoUrl = settings.SITE_LOGO_URL?.trim();
  const accentColor = settings.BRAND_ACCENT_COLOR || "#D4AF37";
  const brandAccentStyle = {
    "--brand-accent": accentColor,
  } as CSSProperties & Record<"--brand-accent", string>;
  const logoBackgroundImage = logoUrl ? `url("${logoUrl.replace(/"/g, '\\"')}")` : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brandName,
    url: "https://metransfers.es",
    description:
      "Traslados privados, tours premium y coches con chófer en Barcelona para aeropuerto, empresas, eventos y viajes a medida.",
    areaServed: [
      { "@type": "City", name: "Barcelona" },
      { "@type": "Country", name: "España" },
    ],
    serviceType: [
      "Traslados privados",
      "Tours privados",
      "Chófer privado",
      "Transfers de aeropuerto",
      "Alquiler de vehículo con conductor por horas",
      "Transporte corporativo",
    ],
    makesOffer: {
      "@type": "OfferCatalog",
      name: "Servicios de transporte privado MeTransfers",
      itemListElement: services.map(({ title, description }) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: title,
          description,
        },
      })),
    },
  };

  return (
    <div
      className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white"
      style={brandAccentStyle}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="fixed inset-x-0 top-0 z-50 mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-7xl items-center justify-between rounded-lg border border-white/15 bg-black/55 px-4 py-3 shadow-2xl backdrop-blur-md sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${brandName} inicio`}>
          {logoUrl ? (
            <span
              className="h-11 w-11 shrink-0 rounded-lg bg-white bg-contain bg-center bg-no-repeat shadow-lg"
              style={{ backgroundImage: logoBackgroundImage }}
              aria-hidden="true"
            />
          ) : (
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white shadow-lg"
              style={{ backgroundColor: accentColor }}
            >
              MT
            </span>
          )}
          <span className="truncate text-lg font-semibold uppercase text-white sm:text-xl">{brandName}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/85 md:flex">
          <a href="#servicios" className="transition-colors hover:text-[#D4AF37]">
            Servicios
          </a>
          <a href="#como-funciona" className="transition-colors hover:text-[#D4AF37]">
            Cómo funciona
          </a>
          <a href="#flota" className="transition-colors hover:text-[#D4AF37]">
            Flota
          </a>
          <a href="#faq" className="transition-colors hover:text-[#D4AF37]">
            FAQ
          </a>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-bold text-black transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: accentColor }}
          >
            Reservar
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </nav>

        <MobileMenu accentColor={accentColor} />
      </header>

      <main>
        <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-32 pb-14 sm:pt-36 lg:pt-40">
          <Image
            src="/images/hero_light.png"
            alt="Chófer privado de MeTransfers en Barcelona"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
            <div className="max-w-3xl text-white">
              <p className="mb-4 inline-flex rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                Traslados Privados & Tours Premium — España
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
                Traslados y tours en Barcelona
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                Tu chófer privado en Barcelona te espera. Vehículos de alta gama para traslados al
                aeropuerto, tours y eventos corporativos. Asegura tu viaje con confirmación
                instantánea en menos de 2 minutos.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/booking"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 font-bold text-black shadow-xl transition-transform hover:-translate-y-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  Reservar traslado
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <a
                  href="#servicios"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  Ver servicios
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ["< 2 min", "Confirmación online"],
                  ["24/7", "Reservas anticipadas"],
                  ["BCN", "Aeropuerto, puerto y hoteles"],
                ].map(([value, label]) => (
                  <div key={value} className="rounded-lg border border-white/15 bg-black/25 p-4 backdrop-blur">
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    <p className="mt-1 text-sm text-white/70">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="w-full justify-self-end" aria-label="Formulario de reserva">
              <HomeBookingFormClient />
            </aside>
          </div>
        </section>

        <section id="servicios" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionIntro
              eyebrow="Servicios premium"
              title="Transporte privado con conductor para cada tipo de viaje"
              description="Reserve transfers privados, coches con chófer por horas, transporte ejecutivo, tours privados y vehículos para eventos con una experiencia clara desde el primer clic."
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map(({ title, description, Icon }) => (
                <article
                  key={title}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#9B7B20]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-950">{title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-gray-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase text-[#D4AF37]">Cómo funciona</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">Reserve su chófer privado en Barcelona sin complicaciones</h2>
                <p className="mt-5 leading-8 text-white/70">
                  MeTransfers organiza cada servicio con información clara: ruta, horario, tipo de
                  vehículo, pasajeros, equipaje y condiciones aplicables antes de confirmar.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <article key={step.title} className="rounded-lg border border-white/10 bg-white/10 p-6">
                    <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-bold text-gray-950">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-3 leading-7 text-white/70">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
              <Image
                src="/images/chauffeur_day.png"
                alt="Conductor privado profesional para traslados premium"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-[#9B7B20]">Ventajas MeTransfers</p>
              <h2 className="text-3xl font-semibold text-gray-950 sm:text-4xl">
                Puntualidad, discreción y precio claro desde la reserva
              </h2>
              <p className="mt-5 leading-8 text-gray-600">
                El servicio está pensado para viajeros que necesitan algo más que un desplazamiento:
                comodidad, coordinación y una experiencia cuidada desde la recogida hasta el destino.
              </p>
              <div className="mt-8 grid gap-3">
                {advantages.map((advantage) => (
                  <div key={advantage} className="flex gap-3 rounded-lg bg-white p-4 shadow-sm">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#9B7B20]" aria-hidden="true" />
                    <p className="leading-7 text-gray-700">{advantage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="flota" className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-[#9B7B20]">Flota seleccionada</p>
              <h2 className="text-3xl font-semibold text-gray-950 sm:text-4xl">
                Vehículos de alta gama para aeropuerto, tours y eventos
              </h2>
              <p className="mt-5 leading-8 text-gray-600">
                La asignación se adapta a pasajeros, equipaje y tipo de servicio: traslados
                individuales, familias, grupos, viajes corporativos o reservas premium.
              </p>

              <div className="mt-8 grid gap-4">
                {fleet.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
                    <Car className="mt-1 h-5 w-5 shrink-0 text-[#9B7B20]" aria-hidden="true" />
                    <p className="leading-7 text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[5/4] overflow-hidden rounded-lg shadow-2xl">
              <Image
                src="/images/fleet_light.png"
                alt="Flota premium de vehículos con chófer"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section id="rutas" className="bg-gray-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase text-[#D4AF37]">Rutas destacadas</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">Traslados privados desde Barcelona</h2>
                <p className="mt-5 leading-8 text-white/70">
                  Reserve transporte privado desde aeropuertos, estaciones, hoteles, puertos, oficinas,
                  domicilios particulares o cualquier dirección que necesite.
                </p>
              </div>

              <div className="grid gap-4">
                {routes.map((route) => (
                  <article key={route} className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/10 p-5">
                    <MapPin className="h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                    <h3 className="text-lg font-semibold">{route}</h3>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <SectionIntro
              eyebrow="Preguntas frecuentes"
              title="Dudas habituales antes de reservar"
              description="Información rápida para contratar su transfer privado, tour o coche con chófer en Barcelona con más tranquilidad."
            />

            <div className="space-y-3">
              {faqs.map(({ question, answer }) => (
                <details key={question} className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-gray-950 [&::-webkit-details-marker]:hidden">
                    {question}
                    <ChevronRight className="h-5 w-5 shrink-0 transition group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="mt-4 leading-7 text-gray-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#9B7B20]">Reserve ahora</p>
              <h2 className="mt-2 text-3xl font-semibold text-gray-950">
                Organice su próximo traslado privado con MeTransfers
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                Indique origen, destino, fecha y hora. Le ayudamos a encontrar el transporte privado
                que mejor se adapta a su viaje.
              </p>
            </div>
            <Link
              href="/booking"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 font-bold text-black shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: accentColor }}
            >
              Ver disponibilidad
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-5 w-5 text-[#9B7B20]" aria-hidden="true" />
            <span className="font-semibold uppercase text-gray-950">{brandName}</span>
          </div>
          <p>© {new Date().getFullYear()} {brandName} Premium Mobility. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-gray-950">
              Acceso clientes
            </Link>
            <Link href="/register" className="hover:text-gray-950">
              Registro
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
