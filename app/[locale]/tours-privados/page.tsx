import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Map, Mountain, Route, ShieldCheck, Sparkles } from "lucide-react";
import MarketingCta from "@/components/marketing/MarketingCta";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageHero from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Tours privados en Barcelona | Transfers in Barcelona",
  description:
    "Tours privados desde Barcelona a Montserrat, Costa Brava, Girona y rutas personalizadas con vehículo premium y chófer profesional.",
  alternates: {
    canonical: "https://transfersinbarcelona.com/es/tours-privados",
  },
};

const features = [
  "Rutas flexibles decididas por usted",
  "Asesoría local en la ruta",
  "Disponibilidad desde medio día (4h) hasta días completos (12h)",
  "Servicio premium y discreción total",
];

const tours = [
  {
    id: "barcelona",
    title: "Tour en Barcelona",
    description:
      "Recorrido privado por la ciudad, miradores, barrios emblemáticos, hoteles, restaurantes y puntos culturales con paradas a medida.",
    duration: "4-8 horas",
    Icon: Route,
  },
  {
    id: "montserrat",
    title: "Tour a Montserrat",
    description:
      "Excursión privada desde Barcelona al monasterio, montaña y alrededores con vehículo cómodo y tiempo flexible.",
    duration: "5-8 horas",
    Icon: Mountain,
  },
  {
    id: "costa-brava",
    title: "Tour Costa Brava",
    description:
      "Ruta hacia pueblos costeros, calas, restaurantes y hoteles boutique para disfrutar el Mediterráneo sin prisas.",
    duration: "8-12 horas",
    Icon: Sparkles,
  },
  {
    id: "girona",
    title: "Tour a Girona",
    description:
      "Visita privada al centro histórico, murallas, casco antiguo y alrededores con conductor profesional desde Barcelona.",
    duration: "6-10 horas",
    Icon: Map,
  },
];

export default function PrivateToursPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <PageHero
        eyebrow="Tours privados"
        title="Tours Extraordinarios"
        description="Viaja por Cataluña en confort total. Montserrat, Costa Brava, Girona y más destinos en vehículos de alta gama con conductores profesionales."
      />

      <main>
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_420px] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D4AF37]">Sobre el servicio</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Tours privados a tu ritmo</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
                Organizamos tours privados para viajeros que quieren conocer Barcelona y Cataluña con
                comodidad, privacidad y una agenda flexible. El conductor se adapta a los horarios, paradas
                y preferencias del grupo.
              </p>

              <h3 className="mt-12 text-2xl font-black text-gray-900">Características destacadas</h3>
              <div className="mt-6 grid gap-5">
                {features.map((feature) => (
                  <div key={feature} className="flex gap-4 text-lg font-bold text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-gray-900" aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-lg">
              <Map className="h-10 w-10 text-[#D4AF37]" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-black text-gray-900">Resumen</h2>
              <div className="my-8 h-px bg-gray-200" />
              <h3 className="font-black text-gray-900">¿Qué incluye?</h3>
              <ul className="mt-5 space-y-4 text-base font-bold text-gray-700">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  Rutas personalizadas
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  Vehículos de lujo
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  Chófer local experto
                </li>
              </ul>
              <Link
                href="/booking"
                className="mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gray-900 px-6 text-base font-black text-white shadow-md transition hover:bg-gray-800"
              >
                Reservar Servicio
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <p className="mt-5 text-center text-sm font-semibold text-gray-600">Confirmación del servicio. Pago seguro.</p>
            </aside>
          </div>
        </section>

        <section className="bg-gray-50 py-20 text-gray-900 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D4AF37]">Destinos destacados</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Elige tu ruta privada desde Barcelona
              </h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Diseñamos cada tour según el tiempo disponible, el ritmo del viaje y el tipo de experiencia que buscas.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {tours.map(({ id, title, description, duration, Icon }) => (
                <article
                  id={id}
                  key={title}
                  className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-3 py-2 text-xs font-black text-[#D4AF37]">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {duration}
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-black text-gray-900">{title}</h3>
                  <p className="mt-4 text-base leading-8 text-gray-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gray-100 py-20 sm:py-24">
          <Image
            src="/images/fleet_light.png"
            alt="Vehículo premium para tours privados en Barcelona"
            fill
            sizes="100vw"
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gray-100/80" />
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-gray-900" aria-hidden="true" />
            <h2 className="mt-6 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Chófer privado, vehículo premium y ruta flexible
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              Ideal para parejas, familias, grupos reducidos, clientes corporativos y viajeros que buscan
              una experiencia privada sin depender de horarios cerrados.
            </p>
          </div>
        </section>

        <MarketingCta
          title="Reserva tu tour privado en Barcelona"
          description="Indica fecha, horario y destino. Nuestro equipo coordina el vehículo adecuado para tu ruta."
          label="Reservar tour"
        />
      </main>

      <MarketingFooter />
    </div>
  );
}
