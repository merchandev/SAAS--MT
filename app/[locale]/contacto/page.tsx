import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Clock, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";
import MarketingCta from "@/components/marketing/MarketingCta";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageHero from "@/components/marketing/PageHero";
import ContactForm from "@/components/home/ContactForm";

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await prisma.staticPage.findUnique({ where: { slug: "contacto" } });
  return {
    title: seo?.title || "Contacto | Transfers in Barcelona",
    description: seo?.metaDescription || "Contacta con Transfers in Barcelona para traslados privados, tours, eventos corporativos y coches con chófer en Barcelona.",
    keywords: seo?.seoKeywords || undefined,
    alternates: {
      canonical: "/contacto",
    },
  };
}

const contactCards = [
  {
    title: "Teléfono",
    value: "+34 662 02 41 36",
    href: "tel:+34662024136",
    Icon: Phone,
  },
  {
    title: "Email",
    value: "info@transfersinbarcelona.com",
    href: "mailto:info@transfersinbarcelona.com",
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
    <div className="min-h-screen bg-white text-gray-900">
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu próximo traslado"
        description="Nuestro equipo te ayuda a organizar transfers privados, tours, servicios por horas y transporte corporativo en Barcelona."
      />

      <main>
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D4AF37]">Atención personalizada</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Contacta con Transfers in Barcelona</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Cuéntanos qué tipo de servicio necesitas y te orientaremos con la opción más adecuada
                según ruta, pasajeros, equipaje, horario y nivel de vehículo.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <MapPin className="mt-1 h-6 w-6 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-black">Área de servicio</h3>
                    <p className="mt-2 leading-7 text-gray-600">
                      Barcelona, aeropuerto, puerto, hoteles, Costa Brava, Girona, Tarragona, Sitges,
                      Andorra y rutas nacionales bajo petición.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <Clock className="mt-1 h-6 w-6 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-black">Reservas y atención</h3>
                    <p className="mt-2 leading-7 text-gray-600">
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
                  className="flex items-center justify-between gap-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition hover:-translate-y-1"
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  target={href.startsWith("http") ? "_blank" : undefined}
                >
                  <span className="flex items-center gap-5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-black uppercase tracking-[0.12em] text-[#D4AF37]">
                        {title}
                      </span>
                      <span className="mt-1 block text-lg font-black text-gray-900">{value}</span>
                    </span>
                  </span>
                  <Send className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-start">
            <ContactForm />

            <div className="rounded-3xl bg-gray-900 p-8 text-white shadow-xl">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D4AF37]">Respuesta profesional</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight">Servicios para empresas, hoteles y eventos</h2>
              <p className="mt-5 leading-8 text-gray-300">
                Si necesitas coordinar varios vehículos, traslados recurrentes, recepción de clientes
                internacionales o transporte para congresos, podemos preparar una solución adaptada.
              </p>
              <Link
                href="mailto:info@transfersinbarcelona.com?subject=Solicitud%20corporativa%20Transfers in Barcelona"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#D4AF37] px-7 text-sm font-black text-gray-900 shadow-md transition hover:bg-[#C5A059]"
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
