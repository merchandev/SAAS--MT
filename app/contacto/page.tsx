import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Clock, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";
import MarketingCta from "@/components/marketing/MarketingCta";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageHero from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Contacto | MeTransfers Barcelona",
  description:
    "Contacta con MeTransfers para traslados privados, tours, eventos corporativos y coches con chófer en Barcelona.",
  alternates: {
    canonical: "/contacto",
  },
};

const contactCards = [
  {
    title: "Teléfono",
    value: "+34 662 02 41 36",
    href: "tel:+34662024136",
    Icon: Phone,
  },
  {
    title: "Email",
    value: "info@metransfers.es",
    href: "mailto:info@metransfers.es",
    Icon: Mail,
  },
  {
    title: "WhatsApp",
    value: "Respuesta rápida para reservas",
    href: "https://wa.me/34662024136",
    Icon: MessageCircle,
  },
];

const requestDetails = [
  "Dirección de recogida y destino",
  "Fecha, hora y número de pasajeros",
  "Equipaje aproximado y necesidades especiales",
  "Número de vuelo si es un traslado de aeropuerto",
  "Tipo de servicio: transfer, tour, evento o chófer por horas",
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-[#082141]">
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu próximo traslado"
        description="Nuestro equipo te ayuda a organizar transfers privados, tours, servicios por horas y transporte corporativo en Barcelona."
      />

      <main>
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#075cbe]">Atención personalizada</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Contacta con MeTransfers Barcelona</h2>
              <p className="mt-5 text-lg leading-8 text-[#082141]/70">
                Cuéntanos qué tipo de servicio necesitas y te orientaremos con la opción más adecuada
                según ruta, pasajeros, equipaje, horario y nivel de vehículo.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="flex gap-4 rounded-2xl border border-blue-100 bg-[#f7fbff] p-5">
                  <MapPin className="mt-1 h-6 w-6 shrink-0 text-[#075cbe]" aria-hidden="true" />
                  <div>
                    <h3 className="font-black">Área de servicio</h3>
                    <p className="mt-2 leading-7 text-[#082141]/70">
                      Barcelona, aeropuerto, puerto, hoteles, Costa Brava, Girona, Tarragona, Sitges,
                      Andorra y rutas nacionales bajo petición.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-blue-100 bg-[#f7fbff] p-5">
                  <Clock className="mt-1 h-6 w-6 shrink-0 text-[#075cbe]" aria-hidden="true" />
                  <div>
                    <h3 className="font-black">Reservas y atención</h3>
                    <p className="mt-2 leading-7 text-[#082141]/70">
                      Gestión online con confirmación rápida. Para servicios especiales, grupos o eventos,
                      contacta con antelación para coordinar disponibilidad.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5">
              {contactCards.map(({ title, value, href, Icon }) => (
                <a
                  key={title}
                  href={href}
                  className="flex items-center justify-between gap-5 rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/60 transition hover:-translate-y-1"
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  target={href.startsWith("http") ? "_blank" : undefined}
                >
                  <span className="flex items-center gap-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#075cbe]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-black uppercase tracking-[0.12em] text-[#075cbe]">
                        {title}
                      </span>
                      <span className="mt-1 block text-lg font-black">{value}</span>
                    </span>
                  </span>
                  <Send className="h-5 w-5 text-[#075cbe]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7fbff] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-start">
            <div className="rounded-3xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/70">
              <Building2 className="h-10 w-10 text-[#075cbe]" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-black tracking-tight">Datos útiles para preparar tu servicio</h2>
              <p className="mt-4 leading-8 text-[#082141]/70">
                Para responder más rápido, incluye esta información cuando contactes con nosotros.
              </p>
              <ul className="mt-6 grid gap-4">
                {requestDetails.map((detail) => (
                  <li key={detail} className="flex gap-3 font-semibold text-[#082141]/80">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#075cbe]" aria-hidden="true" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-[#061833] p-8 text-white shadow-2xl">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#49b8ff]">Respuesta profesional</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight">Servicios para empresas, hoteles y eventos</h2>
              <p className="mt-5 leading-8 text-white/70">
                Si necesitas coordinar varios vehículos, traslados recurrentes, recepción de clientes
                internacionales o transporte para congresos, podemos preparar una solución adaptada.
              </p>
              <Link
                href="mailto:info@metransfers.es?subject=Solicitud%20corporativa%20MeTransfers"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#0868d8] px-7 text-sm font-black text-white shadow-lg shadow-[#0868d8]/25"
              >
                Solicitar propuesta
              </Link>
            </div>
          </div>
        </section>

        <MarketingCta
          title="¿Prefieres reservar directamente?"
          description="Puedes comprobar disponibilidad online para traslados punto a punto, aeropuerto, tours y servicios por horas."
        />
      </main>

      <MarketingFooter />
    </div>
  );
}
