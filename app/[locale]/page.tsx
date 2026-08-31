import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Globe,
  BarChart3,
  Smartphone,
  ChevronRight,
  CheckCircle,
  Building2,
  Hotel,
  Plane,
  Ship,
  ArrowRight,
} from "lucide-react";
import { unstable_cache } from "next/cache";

import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import { settingsQueries } from "@/modules/settings/settings.queries";
import GygReviews from "@/components/home/GygReviews";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Software de Gestión de Traslados Privados | SaaS para Empresas",
  description:
    "Plataforma SaaS para empresas de traslados: reservas online, gestión de conductores, pagos automáticos y panel de control. Digitaliza tu operación y crece con tecnología probada.",
  keywords: [
    "software gestión traslados",
    "saas traslados privados",
    "plataforma reservas transfer",
    "software empresa traslados espana",
    "gestión conductores privados",
    "sistema reservas transfer aeropuerto",
    "software chófer privado",
    "digitalización empresa traslados",
    "plataforma traslados corporativos",
  ],
  alternates: {
    canonical: "https://saas.merchan.dev/es",
    languages: {
      es: "https://saas.merchan.dev/es",
      en: "https://saas.merchan.dev/en",
      fr: "https://saas.merchan.dev/fr",
      ca: "https://saas.merchan.dev/ca",
    },
  },
  openGraph: {
    title: "Software de Gestión de Traslados Privados | SaaS para Empresas",
    description:
      "Plataforma SaaS para empresas de traslados: reservas online, gestión de conductores, pagos automáticos y panel de control.",
    locale: "es_ES",
    type: "website",
    url: "https://saas.merchan.dev/es",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software de Gestión de Traslados | SaaS para Empresas",
    description:
      "Plataforma SaaS para empresas de traslados: reservas online, gestión de conductores, pagos automáticos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    title: "Panel de reservas en tiempo real",
    description:
      "Gestiona todas las reservas desde un único panel: estado, conductor asignado, ruta, cliente y pago. Sin hojas de cálculo, sin caos.",
    Icon: LayoutDashboard,
  },
  {
    title: "Gestión de conductores y flota",
    description:
      "Asigna servicios a conductores, controla disponibilidad, envía instrucciones y recibe confirmaciones desde la app de conductor.",
    Icon: Users,
  },
  {
    title: "Pagos online automáticos",
    description:
      "Cobra al momento de la reserva integrando cualquier pasarela de pagos (Redsys, Getnet, PayPal, Stripe, etc). Facturación automática y precios fijos sin sorpresas.",
    Icon: CreditCard,
  },
  {
    title: "Widget embebible en tu web",
    description:
      "Añade el motor de reservas a tu web actual en minutos. Tus clientes reservan en tu dominio, con tu marca y tu precio.",
    Icon: Globe,
  },
  {
    title: "Informes y analítica",
    description:
      "Ingresos por período, rutas más reservadas, tasa de ocupación y conversión. Datos para tomar decisiones con información real.",
    Icon: BarChart3,
  },
  {
    title: "Integración Universal",
    description:
      "Conectable con cualquier plataforma. Plugins nativos para WordPress y Shopify, integración GoHighLevel (GHL), SDKs React/PHP y API REST a medida.",
    Icon: Globe,
  },
  {
    title: "App de conductor",
    description:
      "El conductor ve sus servicios del día, recibe el detalle del viaje y puede actualizar el estado en tiempo real desde el móvil.",
    Icon: Smartphone,
  },
];

const steps = [
  {
    title: "Crea tu cuenta",
    description:
      "Regístrate, configura tu empresa, añade tus vehículos y conductores. En menos de 30 minutos estás operativo.",
  },
  {
    title: "Define tus rutas y precios",
    description:
      "Establece tarifas por zona, precio fijo o tarifa horaria. El sistema calcula y muestra el precio al cliente automáticamente.",
  },
  {
    title: "Activa el widget en tu web",
    description:
      "Copia una línea de código y el formulario de reservas aparece en tu sitio. Tus clientes ya pueden reservar online.",
  },
  {
    title: "Gestiona y crece",
    description:
      "Las reservas llegan al panel, el conductor recibe la asignación y tú cobras online. Escala sin añadir administración.",
  },
];

const targetAudiences = [
  {
    title: "Empresas de traslados privados",
    description:
      "Digitaliza tu operación, capta reservas online 24/7 y gestiona tu flota sin depender de llamadas y WhatsApp.",
    Icon: Plane,
  },
  {
    title: "Operadores de traslados al aeropuerto",
    description:
      "Especialízate en transfers aeropuerto con seguimiento de vuelos, coordinación de llegadas y confirmaciones automáticas.",
    Icon: Building2,
  },
  {
    title: "Hoteles y alojamientos turísticos",
    description:
      "Ofrece traslados a tus huéspedes como servicio adicional. El hotel gestiona, el sistema cobra y el conductor ejecuta.",
    Icon: Hotel,
  },
  {
    title: "Operadores de cruceros y puerto",
    description:
      "Gestiona la demanda en temporada alta con asignación inteligente de vehículos para grupos y pasajeros de crucero.",
    Icon: Ship,
  },
];

const advantages = [
  "Sin comisiones por reserva — pagas solo la suscripción mensual",
  "Tu marca, tu dominio, tus precios",
  "Onboarding guiado en menos de 48 horas",
  "Soporte técnico en español incluido",
  "Integración con Google Maps para rutas y distancias",
  "Cumplimiento RGPD y pagos PCI-DSS seguros",
];

const faqs = [
  {
    question: "¿Necesito conocimientos técnicos para instalar el software?",
    answer:
      "No. La plataforma está diseñada para ser operada por el equipo de la empresa, no por un departamento de IT. El widget de reservas se instala copiando una línea de código en tu web y el panel de gestión es intuitivo desde el primer día.",
  },
  {
    question: "¿Puedo probar el sistema antes de suscribirme?",
    answer:
      "Sí. Ofrecemos una demo guiada con nuestro equipo donde configuramos tu cuenta de prueba con datos reales. Contacta con nosotros y agendamos una sesión en menos de 24 horas.",
  },
  {
    question: "¿El formulario de reservas funciona en mi web actual?",
    answer:
      "El widget es compatible con cualquier web: WordPress, Wix, Squarespace, HTML puro o cualquier plataforma. Solo necesitas pegar el código de integración en tu página.",
  },
  {
    question: "¿Qué pasa con mis reservas actuales?",
    answer:
      "Podemos importar tus reservas existentes durante el proceso de onboarding. Nuestro equipo te acompaña en la migración para que no pierdas ninguna reserva ni información de cliente.",
  },
];


type HomeSettings = {
  SITE_NAME?: string;
  COMPANY_NAME?: string;
  SITE_LOGO_URL?: string;
  BRAND_ACCENT_COLOR?: string;
};

const getHomeSettings = unstable_cache(
  async (): Promise<HomeSettings> => {
    try {
      return await settingsQueries.getAllSettings();
    } catch {
      return {
        SITE_NAME: "Merchan.Dev SaaS",
        COMPANY_NAME: "Merchan.Dev SaaS",
        SITE_LOGO_URL: "",
        BRAND_ACCENT_COLOR: "#D4AF37",
      };
    }
  },
  ["home-settings"],
  { revalidate: 3600 }
);

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
  const brandName = settings.SITE_NAME || settings.COMPANY_NAME || "Merchan.Dev SaaS";
  const accentColor = settings.BRAND_ACCENT_COLOR || "#D4AF37";
  const brandAccentStyle = {
    "--brand-accent": accentColor,
  } as CSSProperties & Record<"--brand-accent", string>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Merchan.Dev SaaS — SaaS de Gestión de Traslados",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://saas.merchan.dev",
    description:
      "Plataforma SaaS para empresas de traslados privados: reservas online, gestión de conductores, pagos automáticos, widget embebible y panel de control.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Demo gratuita disponible. Solicita acceso.",
    },
    featureList: [
      "Panel de reservas en tiempo real",
      "Gestión de conductores y flota",
      "Pagos online integrados",
      "Widget embebible en cualquier web",
      "App de conductor",
      "Informes y analítica de negocio",
    ],
    provider: {
      "@type": "Organization",
      name: brandName,
      url: "https://saas.merchan.dev",
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
        {/* Hero */}
        <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-32 pb-14 sm:pt-36 lg:pt-40">
          <Image
            src="/images/blog/articles/la-mejor-opcion-de-mejores-empresas-de-traslados-en-espana-y-espana-top-10-ranking-2026-3795.jpg"
            alt="Panel de gestión de traslados privados para empresas"
            fill
            priority
            fetchPriority="high"
            loading="eager"
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
          <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />

          <div className="relative z-10 mx-auto flex flex-col lg:grid w-full max-w-7xl lg:items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
            <div className="max-w-3xl text-white contents lg:block">
              <div className="order-1 lg:order-none">
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
                  El software que digitaliza tu empresa de traslados privados
                </h1>
              </div>
              <div className="order-3 lg:order-none">
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                  Reservas online 24/7, gestión de conductores, pagos automáticos y panel de control. Todo en una plataforma SaaS lista para usar en menos de 48 horas.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/contacto?tipo=demo"
                    className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full px-7 py-3 font-black text-gray-900 shadow-lg transition hover:-translate-y-1"
                    style={{ backgroundColor: accentColor }}
                  >
                    Solicitar demo gratuita
                    <ChevronRight className="h-[22px] w-[22px]" aria-hidden="true" />
                  </Link>
                  <a
                    href="#caracteristicas"
                    className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
                  >
                    Ver características
                    <ArrowRight className="h-[20px] w-[20px]" aria-hidden="true" />
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                    Sin comisiones por reserva
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                    Tu marca y tu dominio
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                    Demo guiada en 24h
                  </div>
                </div>

                <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    ["48h", "Tiempo de activación"],
                    ["24/7", "Reservas automáticas"],
                    ["100%", "Tu marca, tus precios"],
                  ].map(([value, label]) => (
                    <div key={value} className="rounded-lg border border-white/15 bg-black/25 p-4 backdrop-blur">
                      <p className="text-2xl font-semibold text-white">{value}</p>
                      <p className="mt-1 text-sm text-white/70">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="w-full justify-self-end order-2 lg:order-none" aria-label="Demo del widget de reservas">
              <div className="mb-3 text-center">
                <span className="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/90 backdrop-blur">
                  🚀 Prueba el widget de reservas en vivo
                </span>
              </div>
              <HomeBookingFormClient />
            </aside>
          </div>
        </section>

        {/* Características */}
        <section id="caracteristicas" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionIntro
              eyebrow="Plataforma completa"
              title="Todo lo que necesita tu empresa de traslados"
              description="Una sola plataforma reemplaza el teléfono, el WhatsApp, las hojas de cálculo y el caos operativo. Gestiona reservas, conductores y cobros desde un panel unificado."
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ title, description, Icon }) => (
                <article
                  key={title}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#9B7B26]">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-950">{title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="bg-gray-50 py-20 text-gray-900 sm:py-28 relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase text-[#9B7B26]">Puesta en marcha</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">De cero a operativo en menos de 48 horas</h2>
                <p className="mt-5 leading-8 text-gray-600">
                  Nuestro equipo te acompaña en la configuración inicial: vehículos, zonas de servicio, tarifas y widget en tu web. Sin dependencia de IT externa ni semanas de implantación.
                </p>
                <Link
                  href="/contacto?tipo=demo"
                  className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-gray-900 shadow-md transition hover:-translate-y-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  Hablar con el equipo
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
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

        {/* Para quién es */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionIntro
              eyebrow="Para tu sector"
              title="Diseñado para cada tipo de operador de traslados"
              description="Tanto si eres una empresa de traslados privados, un operador de aeropuerto, un hotel o un operador de cruceros, la plataforma se adapta a tu modelo de negocio."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {targetAudiences.map(({ title, description, Icon }) => (
                <article
                  key={title}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#9B7B26]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Ventajas */}
        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
              <Image
                src="/images/blog/articles/la-mejor-opcion-de-la-ventaja-de-un-conductor-local-rutas-sin-trafico-y-puntualidad-en-tu-tour-6197.jpg"
                alt="Plataforma de gestión de traslados privados para empresas"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-[#9B7B20]">Por qué elegirnos</p>
              <h2 className="text-3xl font-semibold text-gray-950 sm:text-4xl">
                Tecnología de traslados sin complicaciones ni comisiones
              </h2>
              <p className="mt-5 leading-8 text-gray-600">
                A diferencia de los marketplaces que cobran comisión por cada viaje, nuestra plataforma tiene tarifa mensual fija. Tú conservas el 100% de tus ingresos.
              </p>
              <div className="mt-8 grid gap-3">
                {advantages.map((advantage) => (
                  <div key={advantage} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <CheckCircle className="mt-0.5 h-[22px] w-[22px] shrink-0 text-[#9B7B26]" aria-hidden="true" />
                    <p className="leading-7 text-gray-700 font-medium">{advantage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* En producción — MeTransfers */}
        <section id="demo" className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-[#9B7B20]">En producción</p>
              <h2 className="text-3xl font-semibold text-gray-950 sm:text-4xl">
                El widget que ya usan operadores como MeTransfers
              </h2>
              <p className="mt-5 leading-8 text-gray-600">
                MeTransfers, uno de los operadores de traslados privados de referencia en España, utiliza nuestra infraestructura para gestionar reservas online, asignar conductores y procesar pagos de forma automática.
              </p>
              <p className="mt-4 leading-8 text-gray-600">
                El formulario que viste en la parte superior de esta página es exactamente el widget que tus clientes verían en tu web — funcional, rápido y conectado a tu operación en tiempo real.
              </p>
              <div className="mt-8">
                <Link
                  href="/contacto?tipo=demo"
                  className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full px-7 py-3 font-black text-gray-900 shadow-lg transition hover:-translate-y-1"
                  style={{ backgroundColor: accentColor }}
                >
                  Quiero una demo para mi empresa
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[5/4] overflow-hidden rounded-lg shadow-2xl">
              <Image
                src="/images/blog/articles/guia-completa-conoce-nuestra-flota-los-vehiculos-de-alta-gama-para-tus-tours-por-espana-5020.jpg"
                alt="Flota de traslados gestionada con la plataforma SaaS"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <GygReviews />

        {/* FAQ */}
        <section id="faq" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-4xl px-6">
            <SectionIntro
              eyebrow="Preguntas frecuentes"
              title="Todo lo que necesitas saber antes de empezar"
              description="Resolvemos las dudas más habituales de empresas de traslados que están evaluando digitalizar su operación."
            />

            <div className="space-y-3">
              {faqs.map(({ question, answer }) => (
                <details key={question} className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-gray-950 [&::-webkit-details-marker]:hidden">
                    {question}
                    <ChevronRight className="h-6 w-6 shrink-0 transition group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="mt-4 leading-7 text-gray-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-[#9B7B20]">Empieza hoy</p>
              <h2 className="mt-2 text-3xl font-semibold text-gray-950">
                Digitaliza tu empresa de traslados en 48 horas
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                Agenda una demo gratuita con nuestro equipo y te mostramos cómo la plataforma funciona con tus rutas, tus precios y tu flota.
              </p>
            </div>
            <Link
              href="/contacto?tipo=demo"
              className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full px-7 py-3 font-black text-gray-900 shadow-lg transition hover:-translate-y-1 whitespace-nowrap"
              style={{ backgroundColor: accentColor }}
            >
              Solicitar demo gratuita
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

