import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import MarketingLogo from "@/components/marketing/MarketingLogo";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import { settingsQueries } from "@/modules/settings/settings.queries";
import GygReviews from "@/components/home/GygReviews";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Traslados privados y chófer en Barcelona | MeTransfers",
  description:
    "Reserva transfers de aeropuerto, traslados privados, tours y coches con chófer en Barcelona. Precio cerrado, conductor profesional y vehículos para empresas, eventos y viajes privados.",
  keywords: [
    "transfer aeropuerto Barcelona",
    "traslado aeropuerto Barcelona",
    "traslado privado Barcelona",
    "chófer privado Barcelona",
    "coche con chófer Barcelona",
    "alquiler coche con conductor Barcelona",
    "transfer Barcelona aeropuerto",
    "taxi privado Barcelona aeropuerto",
  ],
  openGraph: {
    title: "Traslados privados y coches con chófer en Barcelona",
    description:
      "Reserva transfers de aeropuerto, traslados privados, tours y coches con chófer en Barcelona. Precio cerrado, conductor profesional y vehículos para empresas y eventos.",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traslados privados y chófer en Barcelona | MeTransfers",
    description:
      "Reserva transfers de aeropuerto, traslados privados, tours y coches con chófer en Barcelona. Precio cerrado y conductor profesional.",
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
    Icon: "flight",
  },
  {
    title: "Tours privados en Barcelona",
    description:
      "Coche con chófer por horas para visitas panorámicas, rutas culturales, excursiones privadas y planes a medida.",
    Icon: "route",
  },
  {
    title: "Eventos corporativos",
    description:
      "Movilidad ejecutiva para congresos, reuniones, roadshows, cenas de empresa, ferias y atención a clientes internacionales.",
    Icon: "work",
  },
  {
    title: "Alquiler por horas",
    description:
      "Disponga de un conductor privado durante el tiempo contratado, con flexibilidad para paradas y cambios de agenda.",
    Icon: "schedule",
  },
  {
    title: "Bodas y celebraciones",
    description:
      "Vehículos con chófer para novios, invitados, hoteles, fincas, restaurantes y traslados coordinados de grupos.",
    Icon: "event_available",
  },
  {
    title: "Servicios para grupos",
    description:
      "Minivans, minibuses y vehículos amplios para familias, equipos de trabajo, equipaje voluminoso y viajes compartidos.",
    Icon: "group",
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
  "ECONOMIC CLASS: berlina Mercedes para traslados urbanos y aeropuerto",
  "BUSINESS CLASS: berlina Mercedes ejecutiva para reuniones, congresos y clientes premium",
  "MINI VAN ECONOMIC: Mercedes para familias, grupos y equipaje amplio",
  "MINI VAN «V» CLASS: Mercedes Clase V para servicios VIP, grupos y máxima comodidad",
];

const routes = [
  {
    label: "Barcelona - Aeropuerto Josep Tarradellas Barcelona-El Prat",
    origin: "",
    destination: "Aeropuerto Josep Tarradellas Barcelona-El Prat",
  },
  {
    label: "Barcelona - Puerto de cruceros y terminales marítimas",
    origin: "",
    destination: "Puerto de Barcelona, Terminal de Cruceros",
  },
  {
    label: "Barcelona - Sitges, Tarragona y Costa Brava",
    origin: "",
    destination: "Sitges, España",
  },
  {
    label: "Barcelona - Andorra y traslados de larga distancia",
    origin: "",
    destination: "Andorra la Vella, Andorra",
  },
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
      "MeTransfers ofrece traslados privados, transfers de aeropuerto, tours y servicios de coche con chófer en Barcelona. Reserva online con precio cerrado y atención personalizada.",
    areaServed: [
      { "@type": "City", name: "Barcelona" },
      { "@type": "City", name: "Sitges" },
      { "@type": "City", name: "Tarragona" },
      { "@type": "City", name: "Girona" },
    ],
    serviceType: [
      "Transfer aeropuerto Barcelona",
      "Traslados privados Barcelona",
      "Coche con chófer Barcelona",
      "Traslados corporativos Barcelona",
      "Tours privados Barcelona",
      "Traslados puerto de Barcelona",
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

      <MarketingHeader />

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

          <div className="relative z-10 mx-auto flex flex-col lg:grid w-full max-w-7xl lg:items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
            <div className="max-w-3xl text-white contents lg:block">
              <div className="order-1 lg:order-none">
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
                  Traslados privados y coches con chófer en Barcelona
                </h1>
              </div>
              <div className="order-3 lg:order-none">
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                  Reserva tu traslado privado en Barcelona con MeTransfers. Transfers de aeropuerto, puerto de cruceros, tours privados, eventos corporativos y servicios de coche con chófer por horas. Viaja con precio cerrado, conductor profesional y atención personalizada.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/booking"
                  className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full px-7 py-3 font-black text-gray-900 shadow-lg transition hover:-translate-y-1"
                  style={{ backgroundColor: accentColor }}
                >
                  Reservar traslado
                  <span className="material-symbols-outlined text-[22px]" aria-hidden="true">chevron_right</span>
                </Link>
                <a
                  href="#servicios"
                  className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
                >
                  Ver servicios
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">location_on</span>
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ["Online", "Reserva rápida"],
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
            </div>

            <aside className="w-full justify-self-end order-2 lg:order-none" aria-label="Formulario de reserva">
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
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                    <span className="material-symbols-outlined text-[28px]" aria-hidden="true">{Icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-950">{title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="bg-gray-50 py-20 text-gray-900 sm:py-28 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase text-[#D4AF37]">Cómo funciona</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">Reserve su chófer privado en Barcelona sin complicaciones</h2>
                <p className="mt-5 leading-8 text-gray-600">
                  MeTransfers organiza cada servicio con información clara: ruta, horario, tipo de
                  vehículo, pasajeros, equipaje y condiciones aplicables antes de confirmar.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map((step, index) => (
                  <article key={step.title} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-950">
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="mt-3 leading-7 text-gray-600">{step.description}</p>
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
                  <div key={advantage} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <span className="material-symbols-outlined mt-0.5 text-[22px] shrink-0 text-[#D4AF37]" aria-hidden="true">check_circle</span>
                    <p className="leading-7 text-gray-700 font-medium">{advantage}</p>
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
                  <div key={item} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-5 transition hover:bg-white hover:shadow-sm">
                    <span className="material-symbols-outlined mt-0.5 text-[24px] shrink-0 text-[#D4AF37]" aria-hidden="true">directions_car</span>
                    <p className="leading-7 text-gray-700 font-medium">{item}</p>
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

        <section id="rutas" className="bg-gray-50 py-20 text-gray-900 sm:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase text-[#D4AF37]">Rutas destacadas</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">Traslados privados desde Barcelona</h2>
                <p className="mt-5 leading-8 text-gray-600">
                  Reserve transporte privado desde aeropuertos, estaciones, hoteles, puertos, oficinas,
                  domicilios particulares o cualquier dirección que necesite.
                </p>
              </div>

              <div className="grid gap-4">
                {routes.map((route) => (
                  <Link 
                    key={route.label} 
                    href={`/booking?origin=${encodeURIComponent(route.origin)}&destination=${encodeURIComponent(route.destination)}`}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#D4AF37]"
                  >
                    <span className="material-symbols-outlined text-[24px] shrink-0 text-[#D4AF37]" aria-hidden="true">location_on</span>
                    <h3 className="text-lg font-semibold">{route.label}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <GygReviews />

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
                    <span className="material-symbols-outlined text-[24px] shrink-0 transition group-open:rotate-90" aria-hidden="true">chevron_right</span>
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
              className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full px-7 py-3 font-black text-gray-900 shadow-lg transition hover:-translate-y-1"
              style={{ backgroundColor: accentColor }}
            >
              Ver disponibilidad
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">chevron_right</span>
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
