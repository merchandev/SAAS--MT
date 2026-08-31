import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Clock, Mail, MessageCircle, Phone, Send, ShieldCheck, Zap } from "lucide-react";
import MarketingCta from "@/components/marketing/MarketingCta";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageHero from "@/components/marketing/PageHero";
import ContactForm from "@/components/home/ContactForm";

import { prisma } from "@/lib/prisma";

import { getTranslatedField } from "@/lib/i18n-utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await prisma.staticPage.findUnique({ where: { slug: "contacto" } });

  const title = getTranslatedField(seo, "title", locale, seo?.title) || "Contacto | Software de Traslados — Transfers in Barcelona";
  const metaDesc = getTranslatedField(seo, "metaDescription", locale, seo?.metaDescription) || "Solicita una demo gratuita de nuestra plataforma SaaS para empresas de traslados privados. Nuestro equipo te muestra el sistema en menos de 24 horas.";
  const seoKw = getTranslatedField(seo, "seoKeywords", locale, seo?.seoKeywords);

  const languages = ["es", "en", "fr", "ca"];
  const alternates: Record<string, string> = {};
  languages.forEach((lang) => {
    alternates[lang] = `https://transfersinbarcelona.com/${lang}/contacto`;
  });

  return {
    title,
    description: metaDesc,
    keywords: seoKw || undefined,
    alternates: {
      canonical: `https://transfersinbarcelona.com/${locale}/contacto`,
      languages: alternates,
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
    value: "Respuesta rápida en horario laboral",
    href: "https://wa.me/34662024136",
    Icon: MessageCircle,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PageHero
        eyebrow="Contacto"
        title="Solicita una demo para tu empresa"
        description="Nuestro equipo te muestra la plataforma en vivo con tus rutas y tu flota. Sin compromiso, en menos de 24 horas."
      />

      <main>
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D4AF37]">Te acompañamos desde el primer día</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">¿Hablamos sobre tu empresa de traslados?</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Cuéntanos cómo funciona tu operación actual: número de vehículos, conductores, volumen de reservas y qué quieres automatizar. Te preparamos una demo personalizada.
              </p>

              <div className="mt-8 grid gap-4">
                <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <Zap className="mt-1 h-6 w-6 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-black">Demo en 24 horas</h3>
                    <p className="mt-2 leading-7 text-gray-600">
                      Agenda una sesión guiada con nuestro equipo. Te mostramos el panel, el widget de reservas, la app de conductor y el flujo de pagos con datos reales.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <Clock className="mt-1 h-6 w-6 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-black">Activación en 48 horas</h3>
                    <p className="mt-2 leading-7 text-gray-600">
                      Una vez tomada la decisión, nuestro equipo de onboarding configura tu cuenta, importa tu flota y activa el widget en tu web. Sin tiempos de espera.
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
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D4AF37]">Soluciones a medida</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight">Para empresas, hoteles y operadores de flota</h2>
              <p className="mt-5 leading-8 text-gray-300">
                Si necesitas una integración específica, una tarificación personalizada, gestión de múltiples empresas o un acuerdo de distribución, podemos diseñar una solución adaptada a tu volumen de operaciones.
              </p>
              <Link
                href="mailto:info@transfersinbarcelona.com?subject=Solicitud%20corporativa%20SaaS%20Transfers%20in%20Barcelona"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-[#D4AF37] px-7 text-sm font-black text-gray-900 shadow-md transition hover:bg-[#C5A059]"
              >
                Solicitar propuesta empresarial
              </Link>
            </div>
          </div>
        </section>

        <MarketingCta
          title="¿Quieres ver la demo antes de hablar con nosotros?"
          description="El widget de reservas está activo en nuestra página de inicio. Pruébalo con cualquier ruta y comprueba cómo funciona en tiempo real."
        />
      </main>

      <MarketingFooter />
    </div>
  );
}

